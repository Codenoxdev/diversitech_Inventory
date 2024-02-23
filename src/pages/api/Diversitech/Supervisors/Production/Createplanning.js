import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const date = new Date().toISOString().split('T')[0]

    // console.log(date)

    const { rows } = req.body

    // const status_id = 1

    // console.log(rows)

    const insertPlanQuery = `INSERT INTO tbl_planning (plan_date) VALUES (?)`
    const insertPlanDetailQuery = `INSERT INTO tbl_planning_detail (plan_no, item_id, plan_quantity) VALUES (?, ?, ?)`
    const getItemIdQuery = `SELECT item_id FROM tbl_item_master WHERE item_code = ?`

    // const insertPlanBomQuery = `INSERT INTO tbl_planning_bom_detail (plan_no, seat_item_id, seat_plan_qty, frame_plan_qty) VALUES (?,?,?,?)`

    const insertPlanResult = await new Promise((resolve, reject) => {
      connection.query(insertPlanQuery, [date], (err, result) => {
        if (err) {
          console.error('Error Will Be Created In Planning = ', err)
          reject(err)
        } else {
          const plan_no = result.insertId

          // console.log('Plan_NO = ', plan_no)
          resolve(plan_no)
        }
      })
    })

    for (const item of rows) {
      const { FertCode, Quantity } = item

      try {
        const getItemIdResult = await new Promise((resolve, reject) => {
          connection.query(getItemIdQuery, [FertCode], (err, rows) => {
            if (err) {
              console.error('Error occurred while retrieving item_id:', err)
              reject(err)
            } else {
              if (rows.length === 0) {
                resolve(null)
              } else {
                const itemId = rows[0].item_id
                resolve(itemId)
              }
            }
          })
        })

        if (getItemIdResult) {
          await new Promise((resolve, reject) => {
            connection.query(insertPlanDetailQuery, [insertPlanResult, getItemIdResult, Quantity], err => {
              if (err) {
                console.error('Error occurred while inserting into tbl_dispatch_detail:', err)

                return reject(err)
              }

              // console.log('Data inserted into tbl_dispatch_detail successfully!')
              resolve()
            })
          })
        }
      } catch (err) {
        console.error(err)
      }
    }

    res.status(200).json({ message: `Production record '${insertPlanResult}' has been successfully created.` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error occurred while inserting data:', err })
  }
}
