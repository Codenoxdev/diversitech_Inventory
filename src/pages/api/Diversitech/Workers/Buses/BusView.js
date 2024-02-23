import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { plan_no, item_id } = req.query

    if (!plan_no) {
      res.status(400).json({ message: 'Missing plan_no in query parameters' })

      return
    }

    if (item_id) {
      const deleteRowQuery = `DELETE pd, pb
      FROM tbl_planning_detail pd
      JOIN tbl_planning_bom_detail pb
      ON pd.plan_no = pb.plan_no AND pd.item_id = pb.item_id
      WHERE pd.plan_no = ? AND pd.item_id = ?;`

      // `
      //   DELETE FROM tbl_planning_detail
      //   WHERE plan_no = ? AND item_id = ?;
      // `
      const selectItemBomQuery = `SELECT * FROM tbl_item_bom WHERE parent_item_id = ?`
      const deletePlanQuery = `DELETE FROM tbl_planning_bom_detail WHERE seat_item_id = ? AND plan_no = ?; `

      connection.query(deleteRowQuery, [plan_no, item_id], (err, updateResult) => {
        if (err) {
          console.error('Error updating data:', err)
        } else {
          connection.query(selectItemBomQuery, [item_id], (err, ItemBomResult) => {
            for (const BomData of ItemBomResult) {
              const { item_id } = BomData

              // console.log(item_id)

              const Bom_item_id = item_id

              connection.query(
                deletePlanQuery,

                [Bom_item_id, plan_no],

                (err, UpdateBomResult) => {
                  if (err) {
                    console.error('Error fetching data:', err)
                  } else {
                    res.status(200).json({ message: 'Row deleted successfully' })
                  }
                }
              )
            }
          })
        }
      })
    } else {
      // Fetch data functionality (if item_id is not provided)
      const Plandataview = `
        SELECT
          tbl_planning_detail.item_id,
          tbl_item_master.item_code,
          tbl_item_master.item_description,
          tbl_item_master.engine_type,
          tbl_item_master.variant,
          tbl_item_master.bs_type,
          tbl_item_master.model,
          tbl_planning_detail.plan_quantity
        FROM tbl_planning_detail
        JOIN tbl_item_master ON tbl_planning_detail.item_id = tbl_item_master.item_id
        WHERE tbl_planning_detail.plan_no = ?;
      `

      connection.query(Plandataview, [plan_no], (err, data) => {
        if (err) {
          console.error('Error executing SQL Query:', err)
          res.status(500).json({ error: 'Error fetching data from the database' })

          return
        }

        // console.log('Master data Get from database:', JSON.stringify(data))
        res.status(200).json(data)
      })
    }
  } catch (err) {
    console.error('Error in try and catch:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
