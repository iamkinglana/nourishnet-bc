import nodemailer from 'nodemailer'

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })

  await transporter.sendMail({
    from: `"NourishNet" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  })
}
