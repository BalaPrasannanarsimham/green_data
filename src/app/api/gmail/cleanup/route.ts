import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { google, gmail_v1 } from "googleapis";

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.accessToken) {
        return NextResponse.json({
            error: "Demo Mode is active. To protect your privacy, no real emails were deleted. Please click 'Logout' then 'Get Started with Google' to scan your actual inbox!"
        }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token.accessToken as string });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    try {
        const { q, limit } = await req.json();

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

        if (limit && limit > 0) {
            allMessages = allMessages.slice(0, limit);
        }

        // Speed up deletion using batchModify to add the TRASH label.
        // This is significantly more efficient than individual calls and prevents server timeouts.
        const batchSize = 1000;
        let successfulDeletes = 0;

        for (let i = 0; i < allMessages.length; i += batchSize) {
            const chunk = allMessages.slice(i, i + batchSize);
            try {
                // Adding the 'TRASH' label is the standard way to move messages to trash in batches.
                // We also remove 'INBOX' to ensure they disappear from the main view immediately.
                await gmail.users.messages.batchModify({
                    userId: "me",
                    requestBody: {
                        ids: chunk,
                        addLabelIds: ["TRASH"],
                        removeLabelIds: ["INBOX", "UNREAD"]
                    }
                });
                successfulDeletes += chunk.length;
            } catch (err: any) {
                console.error(`Batch cleanup failed for chunk starting at index ${i}, falling back to individual trash.`, err);
                // Fallback: Individual trash method for robustness
                for (const id of chunk) {
                    try {
                        await gmail.users.messages.trash({
                            userId: "me",
                            id: id
                        });
                        successfulDeletes++;
                    } catch (individualErr: any) {
                        console.error(`Failed to trash message ${id}:`, individualErr.message);
                    }
                }
            }

            // Small delay between batches to stay safe with Google's quota limits
            if (i + batchSize < allMessages.length) {
                await new Promise(resolve => setTimeout(resolve, 150));
            }
        }

        return NextResponse.json({
            success: true,
            deletedCount: successfulDeletes,
            message: "Emails successfully moved to Trash! Your Google Drive storage will update shortly as the system syncs."
        });
    } catch (error: any) {
        console.error("Gmail Cleanup Error:", error);
        return NextResponse.json({ error: "Failed to clean emails: " + error.message }, { status: 500 });
    }
}
