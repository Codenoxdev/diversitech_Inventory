import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const date = new Date().toISOString().split('T')[0]

    // console.log(date)

    const { Drows } = req.body

    // console.log(Drows)

    const insertPlanQuery = `INSERT INTO tbl_dispatch(dispatch_date, status_id) VALUES (?,?)`
    const insertPlanDetailQuery = `INSERT INTO tbl_dispatch_detail (dispatch_no, item_id, request_quantity) VALUES (?, ?, ?)`
    const getItemIdQuery = `SELECT item_id FROM tbl_item_master WHERE item_code = ?`
    const status = 1

    const insertPlanResult = await new Promise((resolve, reject) => {
      connection.query(insertPlanQuery, [date, status], (err, result) => {
        if (err) {
          console.error('Error Will Be Created In Planning = ', err)

          return reject(err)
        }
        const dispatch_no = result.insertId

        // console.log('dispatch_no = ', dispatch_no)
        resolve(dispatch_no)
      })
    })

    for (const item of Drows) {
      const { FertCode, Quantity } = item

      try {
        const getItemIdResult = await new Promise((resolve, reject) => {
          connection.query(getItemIdQuery, [FertCode], (err, rows) => {
            if (err) {
              console.error('Error occurred while retrieving item_id:', err)

              return reject(err)
            }
            if (rows.length === 0) {
              // console.log(`No data found for fertcode: ${FertCode}`)

              return resolve(null)
            }
            const itemId = rows[0].item_id

            // console.log('itemId = ' + itemId)
            resolve(itemId)
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

    res.status(200).json({ message: `Dispatch request for ${insertPlanResult} has been successfully created.` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error occurred while inserting data:', err })
  }
}
