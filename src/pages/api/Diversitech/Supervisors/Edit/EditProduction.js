import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { updatedBusPlans, plan_no } = req.body

    // console.log(updatedBusPlans, plan_no)
    const UpdateBy = 'Supervisor'

    // console.log(rows)
    const CurrentDate = new Date().toISOString()
    const selectPlanQuery = `SELECT * FROM tbl_planning_detail WHERE plan_no = ?`
    const selectItemBomQuery = `SELECT * FROM tbl_item_bom WHERE parent_item_id = ?`
    const insertPlanDetailQuery = `INSERT INTO tbl_planning_detail (plan_no, item_id, plan_quantity) VALUES (?, ?, ?)`

    const UpdatePlanDetailQuery = `UPDATE tbl_planning_detail
    SET plan_quantity = ?
    WHERE item_id = ? AND plan_no = ?; `

    const UpdatePlanBomQuery = `UPDATE tbl_planning_bom_detail
    SET seat_plan_qty = ?,
        frame_plan_qty = ?
    WHERE seat_item_id = ? AND plan_no = ?;`

    const response = []

    for (const item of updatedBusPlans) {
      const { item_id, plan_quantity } = item

      connection.query(selectPlanQuery, [plan_no], (err, result) => {
        if (err) {
          console.error('Error fetching data:', err)
          response.push({ success: false, message: 'Error occurred while fetching data' })

          return
        }

        const matchingItems = result.filter(row => row.item_id === item_id)

        if (matchingItems.length > 0) {
          // Update
          connection.query(UpdatePlanDetailQuery, [plan_quantity, item_id, plan_no], async (err, updateResult) => {
            if (err) {
              console.error('Error updating data:', err)
              response.push({ success: false, message: 'Error occurred while updating data' })
            } else {
              connection.query(selectItemBomQuery, [item_id], (err, ItemBomResult) => {
                for (const BomData of ItemBomResult) {
                  const { item_id, quantity } = BomData
                  const Bom_quantity = quantity * plan_quantity

                  // console.log(Bom_quantity)

                  connection.query(
                    UpdatePlanBomQuery,
                    [Bom_quantity, Bom_quantity, item_id, plan_no],
                    (err, UpdateBomResult) => {
                      if (err) {
                        console.error('Error fetching data:', err)
                      } else {
                        response.push({ success: true, message: 'Record Updated Successfully' })
                      }
                    }
                  )
                }
              })
            }
          })
        } else {
          connection.query(insertPlanDetailQuery, [plan_no, item_id, plan_quantity], (err, insertResult) => {
            if (err) {
              console.error('Error inserting data:', err)
              response.push({ success: false, message: 'Error occurred while inserting data' })
            } else {
              if (insertResult.affectedRows > 0) {
                response.push({ success: true, message: `Add new record in plan ${plan_no}` })

                // console.log('Insert Successful')
              } else {
                response.push({ success: false, message: `No new record add in plan ${plan_no}` })

                // console.log('Insert did not affect any rows')
              }
            }
          })
        }
      })
    }

    // console.log(response)
    const allSuccessful = response.every(item => item.success === true)

    if (allSuccessful) {
      res.status(200).json({ success: true, message: `Updated Successfully ${plan_no}` })
    } else {
      // Find the first failed response to show as an example
      const failedResponse = response.find(item => item.success === false)
      res.status(500).json({ success: false, message: 'Some updates/inserts failed', error: failedResponse.message })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error occurred while inserting data:', err })
  }
}
