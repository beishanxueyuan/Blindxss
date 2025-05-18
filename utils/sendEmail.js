// utils/sendEmail.js
import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, text }) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // 使用 SSL
    auth: {
      user: 'chain00x@163.com', // 发件人邮箱
      pass: 'GZVNbreC39GVax3z', // 授权码
    },
  });

  const mailOptions = {
    from: 'chain00x@163.com',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('邮件发送成功');
    return { success: true, message: '邮件发送成功' };
  } catch (error) {
    console.error('邮件发送失败:', error);
    return { success: false, message: '邮件发送失败' };
  }
}