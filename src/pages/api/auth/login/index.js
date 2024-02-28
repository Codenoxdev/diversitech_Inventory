import connection from 'src/configs/db'
import { transporter } from 'src/configs/nodemailer'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { jwtConfig } from 'src/@fake-db/auth/jwt'

export default async function handle(req, res) {
  try {
    const { email, password, userId } = req.body
    const selectVerifyQuery = `SELECT user_id,user_name,last_name,verify,first_name,password AS pass FROM tbl_user WHERE email_id=?`

    const selectMeQuery = `SELECT user_name,last_name,verify,first_name,password AS pass FROM tbl_user WHERE user_id=?`

    const selectUserPermissionQuery = `SELECT tur.role_id,
    tr.role_name,
    tp.permission_name,
    tp.read,
    tp.write,
    tu.placeId,
    tpl.comp_code as company
    FROM tbl_user tu
    JOIN tbl_user_role tur ON tur.user_id = tu.user_id
    JOIN tbl_role tr ON tr.role_id = tur.role_id
    JOIN tbl_permission tp ON tp.roleId = tr.role_id
    JOIN tbl_place tpl ON tpl.place_id = tu.placeId
    WHERE tu.user_id = ?`

    if (userId) {
      connection.query(selectMeQuery, [userId], async (err, result) => {
        if (err) {
          console.log('email or Password is Invalid')
        } else {
          for (const item of result) {
            const { first_name, last_name, verify, user_name, pass } = item

            if (!verify) {
              console.log('Account not verify')
            } else {
              // const isMatched = await bcrypt.compare(password, pass)
              // if (isMatched) {
              connection.query(selectUserPermissionQuery, [user_id], async (err, result) => {
                if (err) {
                  console.log('email or Password is Invalid')
                } else {
                  let role
                  let place
                  let comp_code
                  const permission = []
                  for (const data of result) {
                    const { role_name, permission_name, read, write, placeId, company } = data
                    role = result.find(p => p.role_name === role_name)
                    place = result.find(p => p.placeId === placeId)
                    comp_code = result.find(p => p.company === company)
                    permission.push({
                      permission: permission_name,
                      read: read,
                      write: write
                    })
                  }

                  if (!place) {
                    res.status(200).json({ success: false, message: 'User Deactivate' })
                  } else {
                    console.log(place)

                    const accessToken = jwt.sign({ id: user_id }, jwtConfig.secret, {
                      expiresIn: jwtConfig.expirationTime
                    })

                    const user = {
                      id: userId,
                      fullName: first_name + ' ' + last_name,
                      email: email,
                      role: role.role_name,
                      username: user_name,
                      permission: permission,
                      place: place.placeId,
                      comp_code: comp_code.company
                    }
                    console.log(user)

                    const response = {
                      accessToken,
                      userData: { ...user, password: undefined }
                    }
                    res.status(200).json({ success: true, message: response })
                  }
                }
              })

              // }
            }
          }
        }
      })
    }

    if (email && password) {
      connection.query(selectVerifyQuery, [email], async (err, result) => {
        if (err) {
          console.log('email or Password is Invalid')
        } else {
          for (const item of result) {
            const { user_id, first_name, last_name, verify, user_name, pass } = item

            if (!verify) {
              console.log('Account not verify')
            } else {
              const isMatched = await bcrypt.compare(password, pass)
              if (isMatched) {
                connection.query(selectUserPermissionQuery, [user_id], async (err, result) => {
                  if (err) {
                    console.log('email or Password is Invalid')
                  } else {
                    let role
                    let place
                    let comp_code
                    const permission = []
                    for (const data of result) {
                      const { role_name, permission_name, read, write, placeId, company } = data
                      role = result.find(p => p.role_name === role_name)
                      place = result.find(p => p.placeId === placeId)
                      comp_code = result.find(p => p.company === company)
                      permission.push({
                        permission: permission_name,
                        read: read,
                        write: write
                      })
                    }

                    if (!place) {
                      res.status(200).json({ success: false, message: 'User Deactivate' })
                    } else {
                      console.log(place)

                      const accessToken = jwt.sign({ id: user_id }, jwtConfig.secret, {
                        expiresIn: jwtConfig.expirationTime
                      })

                      const user = {
                        id: user_id,
                        fullName: first_name + ' ' + last_name,
                        email: email,
                        role: role.role_name,
                        username: user_name,
                        permission: permission,
                        place: place.placeId,
                        comp_code: comp_code.company
                      }

                      const response = {
                        accessToken,
                        userData: { ...user, password: undefined }
                      }
                      res.status(200).json({ success: true, message: response })
                    }

                    // const accessToken = jwt.sign({ id: user_id }, jwtConfig.secret, {
                    //   expiresIn: jwtConfig.expirationTime
                    // })

                    // const user = {
                    //   id: user_id,
                    //   fullName: first_name + ' ' + last_name,
                    //   email: email,
                    //   role: role.role_name,
                    //   username: user_name,
                    //   permission: permission
                    // }

                    // const response = {
                    //   accessToken,
                    //   userData: { ...user, password: undefined }
                    // }
                    // res.status(200).json({ success: true, message: response })

                    // console.log(role.role_name)
                    // console.log(place.placeId)
                  }
                })
              } else {
                res.status(200).json({ success: false, message: 'Invalid email or password ' })
              }
            }
          }
        }
      })
    }
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
