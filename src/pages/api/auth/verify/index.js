import connection from 'src/configs/db'
import { transporter } from 'src/configs/nodemailer'

export const selectOtpQuery = `SELECT verify,otp FROM tbl_user WHERE email_id = ?`

export const updateQuery = `UPDATE tbl_user SET verify=? WHERE email_id=?`

// export const selectQuery = `SELECT EXISTS (SELECT * FROM tbl_user WHERE email_id= ?) AS is_available `

export default async function handle(req, res) {
  try {
    const { email_id, Otp } = req.body
    const verify = true
    connection.query(selectOtpQuery, [email_id], (err, result) => {
      for (const item of result) {
        const { otp } = item
        if (Otp !== parseInt(otp)) {
          console.log('Wrong otp')
          res.status(200).json({ success: false, message: 'Invalid OTP' })
        } else {
          connection.query(updateQuery, [verify, email_id], (err, result) => {
            if (err) {
              res.status(200).json('Something went wrong')
            } else {
              res.status(200).json({ success: true, message: 'OTP Successfully' })
            }
          })
        }
      }
    })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
