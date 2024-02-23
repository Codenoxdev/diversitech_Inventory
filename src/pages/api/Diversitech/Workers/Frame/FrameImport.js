import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { item_code, count_value, plan_no, type, seat_id } = req.body

    // console.log(item_code, count_value, plan_no, type, seat_id)
    const status = 'Frame'
    const Type = type

    if (count_value < 0) {
      return res.status(200).json({
        success: false,
        message: 'Negative value Inserted'
      })
    }

    if (!item_code || !count_value) {
      return res.status(400).json({ error: 'Invalid input data' })
    }

    const CurrentDate = new Date().toISOString()

    const SelectQuery = `SELECT item_id FROM tbl_item_master WHERE item_code = ?`
    const SelectCheckQuery = `SELECT * FROM tbl_planning_bom_detail WHERE seat_item_id = ? AND plan_no = ?`
    const StatusQuery = `SELECT status_id FROM tbl_status WHERE status_description = ?`

    // const InsertQuery = `INSERT INTO tbl_stock_ledger(item_id, trans_type, trans_qty, transaction_no) VALUES (?, ?, ?, ?)`

    const UpdateQuery = `
      UPDATE tbl_planning_bom_detail
      SET frame_prod_qty = LEAST(COALESCE(frame_prod_qty, 0) + ?, frame_plan_qty),updated_on = ?
      WHERE seat_item_id = ? AND plan_no = ?;
    `

    connection.query(SelectQuery, [item_code], async (err, itemResult) => {
      if (err) {
        console.error('Error in SelectQuery:', err)

        return res.status(500).json({ error: 'Internal server error' })
      }

      if (itemResult.length === 0) {
        return res.status(400).json({ error: 'Item not found' })
      }

      const { item_id } = itemResult[0]

      // console.log(itemResult + item_id)
      connection.query(SelectCheckQuery, [seat_id, plan_no], async (err, checkResult) => {
        if (err) {
          console.error('Error in SelectCheckQuery:', err)

          return res.status(500).json({ error: 'Internal server error' })
        }

        let canInsert = true

        // console.log(checkResult)

        for (const frame of checkResult) {
          const { frame_plan_qty, frame_prod_qty } = frame

          // console.log(frame_plan_qty, frame_prod_qty)
          // console.log(parseInt(frame_prod_qty) + parseInt(count_value))
          // console.log(frame_plan_qty < parseInt(frame_prod_qty) + parseInt(count_value))

          if (
            // frame_plan_qty === parseInt(frame_prod_qty) + count_value &&
            frame_plan_qty <
            parseInt(frame_prod_qty) + parseInt(count_value)
          ) {
            canInsert = false
            break
          }
        }

        // console.log(canInsert)

        if (canInsert) {
          const statusResult = await new Promise((resolve, reject) => {
            connection.query(StatusQuery, [status], (err, statusRows) => {
              if (err) {
                reject(err)
              } else {
                resolve(statusRows)
              }
            })
          })

          for (const statusRow of statusResult) {
            const { status_id } = statusRow

            await new Promise((resolve, reject) => {
              connection.query(UpdateQuery, [count_value, CurrentDate, seat_id, plan_no], err => {
                if (err) {
                  reject(err)
                } else {
                  resolve()
                }
              })
            })

            // console.log('Inserted')
          }

          return res.status(200).json({
            success: true,
            message: `Data for Plan ${plan_no} and Item ${item_code} has been successfully inserted.`
          })
        } else {
          return res.status(200).json({
            success: false,
            message: 'Record Already Inserted'
          })
        }
      })
    })
  } catch (err) {
    console.error('Error in try and catch:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
