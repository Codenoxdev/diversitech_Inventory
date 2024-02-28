import connection from 'src/configs/db'
import { transporter } from 'src/configs/nodemailer'
import bcrypt from 'bcrypt'

export const selectUserQuery = `SELECT EXISTS (SELECT * FROM tbl_user WHERE username= ?) AS is_available `

export const selectQuery = `SELECT EXISTS (SELECT * FROM tbl_user WHERE email= ?) AS is_available `

export default async function handle(req, res) {
  try {
    // const { firstName, lastName, password, username, phone, email } = req.body
    const { username, email, password, firstName, lastName, phone, branch_id } = req.body

    console.log(firstName, lastName, password, username, phone, email, branch_id)

    connection.query(selectQuery, [email], (err, result) => {
      for (const item of result) {
        const { is_available } = item
        if (is_available) {
          console.log('This email is already in use.')
          res.status(200).json('This email is already in use.')
        } else {
          connection.query(selectUserQuery, [username], async (err, result) => {
            for (const item of result) {
              const { is_available } = item
              if (is_available) {
                console.log('This username is already in use.')
                res.status(500).json('This username is already in use.')
              } else {
                const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
                console.log(otp)

                const hashPass = await bcrypt.hash(password, 12)
                console.log(hashPass)

                if (otp) {
                  const mailOptions = {
                    from: process.env.MAILER_USER,
                    to: email,
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

                const insertQuery = `INSERT INTO tbl_user(firstName,lastName,username,password,phone,email,otp,placeId) VALUES (?,?,?,?,?,?,?)`
                connection.query(
                  insertQuery,
                  [firstName, lastName, username, hashPass, phone, email, otp, branch_id],
                  (err, result) => {
                    if (err) {
                      console.error('Error', err)
                    } else {
                      // const accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret)
                      console.log('Insert Successfully')
                      res.status(200).json({ success: true, message: 'Registered Successfully' })
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
