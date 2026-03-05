import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { google, gmail_v1 } from "googleapis";

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token.accessToken as string });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    try {
        const { q } = await req.json();

        if (!q) {
            return NextResponse.json({ error: "Invalid query" }, { status: 400 });
        }

        // Fetch ALL messages that match the query using pagination
        let allMessages: string[] = [];
        let pageToken: string | undefined = undefined;

        do {
            const rawResponse = await gmail.users.messages.list({
                userId: "me",
                q: q,
                maxResults: 500, // Safe batch size per page
                pageToken: pageToken,
                includeSpamTrash: true, // Required to match spam or trash messages
            });

            const listResponse = rawResponse.data as gmail_v1.Schema$ListMessagesResponse;

            if (listResponse.messages) {
                const ids = listResponse.messages.map(m => m.id as string);
                allMessages = allMessages.concat(ids);
            }
            pageToken = listResponse.nextPageToken || undefined;
        } while (pageToken);

        if (allMessages.length === 0) {
            return NextResponse.json({
                success: true,
                deletedCount: 0,
                message: "No messages found matching criteria."
            });
        }

        // We must use the trash method for each message individually.
        // Doing them all at once can overload the API or cause silent drops, 
        // so we process in chunks of 10 with a small delay.
        const chunkSize = 10;
        let successfulDeletes = 0;

        for (let i = 0; i < allMessages.length; i += chunkSize) {
            const chunk = allMessages.slice(i, i + chunkSize);
            await Promise.all(
                chunk.map(async (id) => {
                    try {
                        await gmail.users.messages.trash({
                            userId: "me",
                            id: id
                        });
                        successfulDeletes++;
                    } catch (err: any) {
                        // Ignore already deleted / 404 errors as they mean the item is already gone
                        if (err.code === 404) {
                            successfulDeletes++;
                        } else {
                            console.error(`Failed to trash message ${id}:`, err);
                        }
                    }
                })
            );

            // Introduce a short wait between chunks to guarantee we don't exceed Google rate limits
            if (i + chunkSize < allMessages.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        return NextResponse.json({
            success: true,
            deletedCount: successfulDeletes,
            message: "Emails successfully moved to Trash."
        });
    } catch (error: any) {
        console.error("Gmail Cleanup Error:", error);
        return NextResponse.json({ error: "Failed to clean emails" }, { status: 500 });
    }
}
