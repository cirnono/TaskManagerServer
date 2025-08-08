import nodemailer from "nodemailer";

export default async function sendEmail(
    to: string,
    subject: string,
    text: string
) {
    const transporter = nodemailer.createTransport({
        host: process.env.GMAIL_HOST,
        port: Number(process.env.GMAIL_PORT),
        secure: false, // true for 465, false for other ports like 587
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to,
            subject,
            text,
        });
    } catch (error) {
        throw new Error("Error sending email");
    }
}
