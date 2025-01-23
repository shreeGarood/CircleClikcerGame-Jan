import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, scores } = await request.json();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Build HTML for the email
    const html = `
      <div style="background-color: #000; color: #f4d03f; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif;">
        <h1 style="text-align: center; margin-bottom: 20px;">🎉 Game Score Report 🎮</h1>
        <p style="text-align: center; font-size: 16px; color: #f1c40f; margin-bottom: 30px;">
      Hi <strong>${name}</strong>, here are the results of your recent game session. Great job, and keep clicking those circles! ⭐
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #333; color: #f4d03f; text-align: left;">
              <th style="padding: 10px; border: 1px solid #f4d03f;">Name</th>
              <th style="padding: 10px; border: 1px solid #f4d03f;">Score</th>
              <th style="padding: 10px; border: 1px solid #f4d03f;">Stars</th>
            </tr>
          </thead>
          <tbody>
            ${scores
              .map((score: { name: string; score: number }, index: number) => {
                const stars = index === 0 
                  ? "⭐⭐⭐" 
                  : index === 1 
                  ? "⭐⭐" 
                  : index === 2 
                  ? "⭐" 
                  : "";
                return `
                  <tr style="text-align: center;">
                    <td style="padding: 10px; border: 1px solid #f4d03f;">${score.name}</td>
                    <td style="padding: 10px; border: 1px solid #f4d03f;">${score.score}</td>
                    <td style="padding: 10px; border: 1px solid #f4d03f; color: #f1c40f;">${stars}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
        <div style="text-align: center; margin-top: 20px;">
          <p style="font-size: 14px; color: #ddd; margin-bottom: 10px;">
            Keep practicing and aim for the highest score! Don't forget to share your achievements with friends. 🚀
          </p>
          <p style="font-size: 12px; color: #aaa;">
            This email was sent automatically by the game system. If you have any questions, please contact us at <a href="mailto:support@example.com" style="color: #f4d03f;">support@example.com</a>.
          </p>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Game Scores and Achievements",
      html,
    });

    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
