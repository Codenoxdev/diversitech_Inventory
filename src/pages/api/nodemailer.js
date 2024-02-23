import { transporter } from 'src/configs/nodemailer'

export default async function handle(req, res) {
  // const { name, email, message } = req.body

  const mailOptions = {
    from: process.env.MAILER_USER,
    to: 'ayushji.kushwah@outlook.com',
    subject: 'Diversitech',
    text: 'message'
  }

  const result = await transporter.sendMail(mailOptions)

  if (result) {
    res.status(200).send('Email sent successfully')
  } else {
    res.status(500).send('An error occurred')
  }
}
