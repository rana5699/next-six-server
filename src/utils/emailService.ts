/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
// import config from '../config/config';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'ranaot56@gmail.com',
    pass: 'ezwl gkjj jtdl amry',
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: 'ranaot56@gmail.com',
      to: to,
      subject: subject,
      html: text,
    });
  } catch (error:any) {
    throw new Error(error);
  }
};
