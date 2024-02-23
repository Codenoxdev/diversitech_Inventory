import connection from 'src/configs/db'
import { transporter } from 'src/configs/nodemailer'
import bcrypt from 'bcrypt'

export const selectUserQuery = `SELECT EXISTS (SELECT * FROM tbl_user WHERE user_name= ?) AS is_available `

export const selectQuery = `SELECT EXISTS (SELECT * FROM tbl_user WHERE email_id= ?) AS is_available `

export default async function handle(req, res) {
  try {
    const { first_name, last_name, password, user_name, phone, email_id } = req.body
    console.log(first_name, last_name, user_name, phone, email_id)

    connection.query(selectQuery, [email_id], (err, result) => {
      for (const item of result) {
        const { is_available } = item
        if (is_available) {
          console.log('This email is already in use.')
          res.status(200).json('This email is already in use.')
        } else {
          connection.query(selectUserQuery, [user_name], async (err, result) => {
            for (const item of result) {
              const { is_available } = item
              if (is_available) {
                console.log('This username is already in use.')
                res.status(200).json('This username is already in use.')
              } else {
                const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
                console.log(otp)

                const hashPass = await bcrypt.hash(password, 12)
                console.log(hashPass)

                if (otp) {
                  const mailOptions = {
                    from: process.env.MAILER_USER,
                    to: email_id,
                    subject: 'Verify Email',
                    text: `verify OTP :- ${otp}`
                  }

                  const result = await transporter.sendMail(mailOptions)

                  if (result) {
                    console.log('Mail send ')
                  } else {
                    console.log('Mail Not send ')
                  }
                }

                const insertQuery = `INSERT INTO tbl_user(first_name,last_name,user_name,password,phone,email_id,otp) VALUES (?,?,?,?,?,?,?)`
                connection.query(
                  insertQuery,
                  [first_name, last_name, user_name, hashPass, phone, email_id, otp],
                  (err, result) => {
                    if (err) {
                      console.error('Error', err)
                    } else {
                      // const accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret)
                      console.log('Insert Successfully')
                      res.status(200).json({ success: true, message: 'Insert Successfully' })
                    }
                  }
                )
              }
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
