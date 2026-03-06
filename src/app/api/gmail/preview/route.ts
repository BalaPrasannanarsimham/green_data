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
        const { categories, readStatus, sizeFilter } = await req.json();

        // Prepare base query properties
        const baseQueryParts = [];
        if (readStatus.read && !readStatus.unread) baseQueryParts.push("is:read");
        if (!readStatus.read && readStatus.unread) baseQueryParts.push("is:unread");
        if (sizeFilter) baseQueryParts.push(sizeFilter);
        const baseQuery = baseQueryParts.join(" ");

        let total = 0;
        const breakdown: Record<string, number> = {};

        // Fetch exact counts for each category using complete pagination
        for (const cat of categories) {
            let catQuery = cat === "spam" ? "in:spam" : `category:${cat}`;
            const finalQuery = `${catQuery} ${baseQuery}`.trim();

            let catCount = 0;
            let pageToken: string | undefined = undefined;

            try {
                do {
                    const rawResponse = await gmail.users.messages.list({
                        userId: "me",
                        q: finalQuery,
                        maxResults: 500,
                        pageToken: pageToken,
                        includeSpamTrash: true,
                    });

                    const listResponse = rawResponse.data as gmail_v1.Schema$ListMessagesResponse;
                    if (listResponse.messages) {
                        catCount += listResponse.messages.length;
                    }
                    pageToken = listResponse.nextPageToken || undefined;
                } while (pageToken);

                breakdown[cat] = catCount;
                total += catCount;
            } catch (err) {
                console.error(`Failed to fetch exact count for category ${cat}`, err);
                breakdown[cat] = 0;
            }
        }

        return NextResponse.json({
            success: true,
            total,
            breakdown,
        });
    } catch (error: any) {
        console.error("Gmail Preview Error:", error);
        return NextResponse.json({ error: "Failed to load preview" }, { status: 500 });
    }
}
