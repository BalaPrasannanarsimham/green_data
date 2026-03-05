import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { google, gmail_v1 } from "googleapis";

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.accessToken) {
        // Demi Mode Bypass: Return mock data instead of 401
        return NextResponse.json({
            success: true,
            total: 2140,
            breakdown: {
                promotions: 1240,
                updates: 540,
                social: 360,
                primary: 0,
                spam: 0
            }
        });
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

        // Fetch counts for each category
        await Promise.all(
            categories.map(async (cat: string) => {
                let catQuery = cat === "spam" ? "in:spam" : `category:${cat}`;
                const finalQuery = `${catQuery} ${baseQuery}`.trim();

                try {
                    const rawResponse = await gmail.users.messages.list({
                        userId: "me",
                        q: finalQuery,
                        maxResults: 500, // Fetch max to get close count without paginating forever
                        includeSpamTrash: true,
                    });

                    const listResponse = rawResponse.data as gmail_v1.Schema$ListMessagesResponse;
                    const count = listResponse.messages?.length || 0;

                    breakdown[cat] = count;
                    total += count;
                } catch (err) {
                    console.error(`Failed to fetch count for category ${cat}`, err);
                    breakdown[cat] = 0;
                }
            })
        );

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
