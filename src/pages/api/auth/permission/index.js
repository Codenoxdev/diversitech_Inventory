import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { role, role_description, permissions } = req.body

    const selectPermissionVerifyQuery = `SELECT EXISTS(SELECT role_name FROM tbl_role WHERE role_description =?)AS is_available`
    const insertRoleQuery = `INSERT INTO tbl_role(role_name, role_description) VALUES (?,?)`

    const insertPermissionQuery =
      'INSERT INTO tbl_permission (permission_name, `read`, `write`, roleId) VALUES (?, ?, ?, ?)'

    console.log(role, role_description, permissions)

    connection.query(selectPermissionVerifyQuery, [role_description], async (err, result) => {
      if (err) {
        res.status(200).json({ success: false, message: `Internal Server Error` })
        console.log('email or Password is Invalid')
      } else {
        for (const item of result) {
          const { is_available } = item
          if (is_available) {
            console.log('Already Exist, please change role_description for this role')
            res.status(200).json({ success: false, message: `${role_description} Permission Already Created` })
          } else {
            connection.query(insertRoleQuery, [role, role_description], async (err, result) => {
              if (err) {
                console.log('ERROR = ' + err)
                res.status(200).json({ success: false, message: `Something Went Wrong` })
              } else {
                const lastRoleId = result.insertId
                let hasError = false // Track if any error occurs during permission insertion
                let insertedCount = 0 // Track the number of permissions successfully inserted
                if (permissions) {
                  for (const permission of permissions) {
                    const { permission_name, read, write } = permission
                    connection.query(
                      insertPermissionQuery,
                      [permission_name, read, write, lastRoleId],
                      async (err, result) => {
                        if (err) {
                          console.log('ERROR = ' + err)
                          hasError = true
                        } else {
                          // console.log('Insert Successfully')
                          insertedCount++
                        }

                        if (insertedCount === permissions.length) {
                          if (hasError) {
                            res
                              .status(200)
                              .json({ success: false, message: `Error occurred while inserting permissions` })
                          } else {
                            res.status(200).json({ success: true, message: `${role} Permission Created` })
                          }
                        }
                      }
                    )
                  }
                } else {
                  // No permissions to insert
                  res.status(200).json({ success: true, message: `${role} Role Created` })
                }
              }
            })
          }

          // console.log(role_name)
          // if (is_available) {
          //   console.log('Already Exist, please change role_description for this role')
          //   res.status(200).json({ success: false, message: `${role_description} Permission Already Created` })
          // } else {
          //   connection.query(insertRoleQuery, [role, role_description], async (err, result) => {
          //     if (err) {
          //       console.log('ERROR = ' + err)
          //       res.status(200).json({ success: false, message: `Something Went Wrong` })
          //     } else {
          //       const lastRoleId = result.insertId
          //       if (permissions) {
          //         for (const permission of permissions) {
          //           const { permission_name, read, write } = permission
          //           connection.query(
          //             insertPermissionQuery,
          //             [permission_name, read, write, lastRoleId],
          //             async (err, result) => {
          //               if (err) {
          //                 console.log('ERROR = ' + err)
          //               } else {
          //                 console.log('Insert Successfully')
          //                 res.status(200).json({ success: true, message: `${role} Permission Created` })
          //               }
          //             }
          //           )
          //         }
          //       }
          //     }
          //   })
          // }
        }
      }
    })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// jsondata for Insertion

// {
//   "role": "worker",
//   "role_description":"w1",
//   "permissions": [
//     {
//       "permission_name": "navbar-frame",
//       "read": true,
//       "write": true
//     },
//     {
//       "permission_name": "navbar-paint",
//       "read": true,
//       "write": false
//     },
//     {
//       "permission_name": "navbar-assembly",
//       "read": true,
//       "write": false
//     },
//     {
//       "permission_name": "navbar-quality-check",
//       "read": true,
//       "write": false
//     },
//     {
//       "permission_name": "navbar-dispatch",
//       "read": true,
//       "write": false
//     },
//   //   {
//   //     "permission_name": "navbar-cowl",
//   //     "read": true,
//   //     "write": false
//   //   },
//     {
//       "permission_name": "navbar-home",
//       "read": true,
//       "write": false
//     }
//   //   {
//   //     "permission_name": "navbar-master",
//   //     "read": true,
//   //     "write": false
//   //   },
//   //   {
//   //     "permission_name": "navbar-planning",
//   //     "read": true,
//   //     "write": false
//   //   },
//   //   {
//   //     "permission_name": "navbar-dispatch",
//   //     "read": true,
//   //     "write": false
//   //   },
//   //   {
//   //     "permission_name": "navbar-history",
//   //     "read": true,
//   //     "write": false
//   //   }
//   ]
// }
