import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { value, seat_id, plan_no } = req.body

    if (!value) {
      return res.status(400).json({ error: 'Invalid input data' })
    }

    const CurrentDate = new Date().toISOString()

    const SelectQuery = `SELECT seat_plan_qty, frame_paint_qty,seat_prod_qty, qc_qty
     FROM tbl_planning_bom_detail
     WHERE seat_item_id = ? AND plan_no = ?`

    connection.query(SelectQuery, [seat_id, plan_no], async (err, itemResult) => {
      for (const item of itemResult) {
        const { seat_plan_qty, frame_paint_qty, seat_prod_qty, qc_qty } = item

        // console.log(seat_plan_qty, seat_prod_qty, qc_qty)
        // console.log(item)
        if (
          frame_paint_qty >= parseInt(seat_prod_qty) + parseInt(value) ||
          seat_prod_qty >= parseInt(qc_qty) + parseInt(value)
        ) {
          return res.status(200).send({
            success: true,
            message: item

            // item: item
          })

          // res.status(200).send({ item })
        } else {
          return res.status(200).send({
            success: false,
            message: 'Record Already Inserted'

            // item: item
          })
        }
      }
    })
  } catch (err) {
    console.error('Error in try and catch:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
