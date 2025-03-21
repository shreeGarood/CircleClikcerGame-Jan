import { NextApiRequest, NextApiResponse } from "next";
import { sendNotification } from "@/utils/firebaseAdmin"; // Make sure you have this file

export async function POST(req: Request) {
  try {
    const { token, title, body } = await req.json();
    
    if (!token || !title || !body) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }

    await sendNotification(token, title, body);

    return new Response(JSON.stringify({ success: "Notification sent!" }), { status: 200 });
  } catch (error:any) {
    return new Response(JSON.stringify({ error: error.message || "An error occurred" }), { status: 500 });
  }
}
