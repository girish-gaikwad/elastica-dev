import { NextResponse } from "next/server";
import { MailtrapClient } from "mailtrap";
import connectToDatabase from "@/lib/mongoose";
import UserEmail from "@/models/UserEmail";

const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN as string,
});

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Save email to database
    const newUser = new UserEmail({ email });
    await newUser.save();

    // Send welcome email
    await mailtrapClient.send({
      from: { email: "hello@demomailtrap.com", name: "Elastica Team" },
      to: [{ email }],
      subject: "Welcome to Our Community!",
      text: "Thanks for subscribing. Stay tuned for updates!",
    });

    return NextResponse.json(
      { message: "Email saved & welcome email sent!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
