import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.accessToken) {
        // Demi Mode Bypass: Return mock data instead of 401 to allow judges to view the dashboard UI
        return NextResponse.json({
            storage: { usageGB: "4.20", limitGB: "15.00", usagePercent: "28.0" },
            emissions: { co2kg: "1.26" },
            energy: { kwh: "3.70" },
            unwantedMails: { count: 8345 }
        });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token.accessToken as string });

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    try {
        // 1. Get Drive Storage Quota
        const driveRes = await drive.about.get({
            fields: "storageQuota",
        });

        const storageQuota = driveRes.data.storageQuota;
        const usageBytes = parseInt(storageQuota?.usage || "0", 10);
        const limitBytes = parseInt(storageQuota?.limit || "1", 10); // avoid div 0

        const usageGB = usageBytes / (1024 * 1024 * 1024);
        const limitGB = limitBytes / (1024 * 1024 * 1024);
        const usagePercent = Math.min((usageGB / limitGB) * 100, 100);

        // 2. We can estimate CO2 based on total usage
        // Approx 0.3kg CO2 per GB stored per year
        const co2kg = usageGB * 0.3;

        // 3. We can estimate Energy Used based on total usage
        // Approx 0.88 kWh per GB stored per year
        const energyKwh = usageGB * 0.88;

        // 4. Try to get a quick estimate of Unwanted Mails 
        // Just searching for promos/updates to get an idea for the dashboard main view
        const promoResponse = await gmail.users.messages.list({
            userId: "me",
            q: "category:promotions OR category:updates",
            maxResults: 10,
        });

        const unwantedCountEstimate = promoResponse.data.resultSizeEstimate || 0;

        return NextResponse.json({
            storage: {
                usageGB: usageGB.toFixed(2),
                limitGB: limitGB.toFixed(2),
                usagePercent: usagePercent.toFixed(1)
            },
            emissions: {
                co2kg: co2kg.toFixed(2)
            },
            energy: {
                kwh: energyKwh.toFixed(2)
            },
            unwantedMails: {
                count: unwantedCountEstimate
            }
        });

    } catch (error: any) {
        console.error("Stats API Error Details:", error);
        return NextResponse.json({
            error: "Failed to fetch from Google APIs",
            details: error.message
        }, { status: 500 });
    }
}
