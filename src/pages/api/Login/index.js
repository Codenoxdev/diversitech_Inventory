import connection from 'src/configs/db'

// import jwt from 'jsonwebtoken'

// const jwtConfig = {
//   secret: process.env.NEXT_PUBLIC_JWT_SECRET,
//   expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
//   refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
// }

export default async function handle(req, res) {
  try {
    const Selectquery = `SELECT tu.first_name, tu.last_name, tu.user_name, tu.phone,tu.email_id, tr.role_name FROM tbl_user AS tu
    JOIN tbl_user_role tur ON tu.user_id = tur.user_id
    JOIN tbl_role tr ON tur.role_id = tr.role_id`

    connection.query(Selectquery, (err, result) => {
      for (const item of result) {
        const { first_name, last_name, user_name, phone, email_id } = item

        // console.log(first_name, last_name, user_name, phone, email_id)
      }
    })

    // const { email, password } = req.body

    // // console.log(email, password)

    // if (!email || !password) {
    //   return res.status(400).json({ error: 'Missing email or password' })
    // }

    // const userdataview = `SELECT * FROM tbl_user WHERE email_id = ? AND password = ?`
    // const userroleID = `SELECT role_id FROM tbl_user_role WHERE user_id = ?`
    // const userroleview = `SELECT * FROM tbl_role WHERE role_id = ?`

    // const userQueryResult = await new Promise((resolve, reject) => {
    //   connection.query(userdataview, [email, password], (err, User) => {
    //     if (err) {
    //       return reject(err)
    //     }
    //     resolve(User)
    //   })
    // })

    // // if (userQueryResult.length === 0) {
    // //   return res.status(401).json({ error: 'Invalid email and Password' })
    // // }

    // const UserId = userQueryResult[0].user_id
    // const user = userQueryResult

    // // console.log(userQueryResult + '================123')
    // if (userQueryResult) {
    //   const accessToken = jwt.sign({ id: UserId }, jwtConfig.secret, { expiresIn: jwtConfig.expirationTime })

    //   const roleQueryResult = await new Promise((resolve, reject) => {
    //     connection.query(userroleID, [UserId], (err, role) => {
    //       if (err) {
    //         return reject(err)
    //       }
    //       resolve(role)
    //     })
    //   })

    //   if (roleQueryResult.length === 0) {
    //     return res.status(500).json({ error: 'Error fetching user role' })
    //   }

    //   const RoleId = roleQueryResult[0].role_id

    //   const roleDataQueryResult = await new Promise((resolve, reject) => {
    //     connection.query(userroleview, [RoleId], (err, roledata) => {
    //       if (err) {
    //         return reject(err)
    //       }
    //       resolve(roledata)
    //     })
    //   })

    //   const RoleName = roleDataQueryResult[0].role_name

    //   // const response = {
    //   //   accessToken,
    //   //   userData: { ...user, password: undefined }
    //   // }
    //   if (RoleName === 'Workers') {
    //     // console.log('redirect a page')

    //     res.status(200).json({
    //       success: true,
    //       redirectTo: '/components/Wdashboard/',
    //       user: user,
    //       accessToken: accessToken,
    //       RoleName: RoleName
    //     })
    //   } else {
    //     res.status(200).json({ success: true, redirectTo: '/login/' })
    //   }
    // } else {
    //   error = {
    //     email: ['email or Password is Invalid']
    //   }

    //   return [400, { error }]
    // }
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
