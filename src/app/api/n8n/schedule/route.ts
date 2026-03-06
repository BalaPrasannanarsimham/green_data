import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Simulating the n8n webhook trigger
        // In a real production scenario, you would use fetch to hit the n8n webhook URL
        // e.g. await fetch("https://n8n.your-domain.com/webhook/cleanup", { method: 'POST', body: JSON.stringify(body) });
        console.log("n8n Webhook Triggered with payload:", body);

        // Simulating an API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json({
            success: true,
            message: "n8n automation successfully scheduled."
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to trigger n8n hook." }, { status: 500 });
    }
}
