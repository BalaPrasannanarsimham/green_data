import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !(session as any).accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: (session as any).accessToken as string });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    try {
        // 1. Fetch promotional emails
        const promoResponse = await gmail.users.messages.list({
            userId: "me",
            q: "category:promotions OR category:updates older_than:1m",
            maxResults: 50, // Limit for quick demo
        });

        const messages = promoResponse.data.messages || [];

        // Let's get size estimations by fetching details of the first 5 to get an average,
        // or just assume 150KB per promo email for simplicity to avoid hitting rate limits.
        const averageSizeKB = 150;
        const totalCount = promoResponse.data.resultSizeEstimate || messages.length;
        const estimatedSizeMB = (totalCount * averageSizeKB) / 1024;

        // Emissions roughly 0.3g CO2 per MB of stored data
        const co2SavedGrams = estimatedSizeMB * 0.3;

        return NextResponse.json({
            count: totalCount,
            estimatedSizeMB: estimatedSizeMB.toFixed(2),
            co2SavedGrams: co2SavedGrams.toFixed(2),
            messages: messages.map(m => m.id),
            messageLimitRespected: true // only passing ids
        });
    } catch (error: any) {
        console.error("Gmail API Error:", error);
        return NextResponse.json({ error: "Failed to fetch from Gmail API" }, { status: 500 });
    }
}
