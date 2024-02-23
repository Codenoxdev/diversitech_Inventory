import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { value, seat_id, plan_no } = req.body

    // console.log(value, plan_no, seat_id)

    // const status = 'Frame'
    // const Type = type

    if (!value) {
      return res.status(400).json({ error: 'Invalid input data' })
    }

    const CurrentDate = new Date().toISOString()

    const SelectQuery = `SELECT frame_plan_qty, seat_plan_qty, frame_prod_qty, frame_paint_qty
     FROM tbl_planning_bom_detail
     WHERE seat_item_id = ? AND plan_no = ?`

    connection.query(SelectQuery, [seat_id, plan_no], async (err, itemResult) => {
      // console.log(itemResult)

      for (const item of itemResult) {
        const { frame_plan_qty, seat_plan_qty, frame_prod_qty, frame_paint_qty } = item

        // console.log(frame_plan_qty, seat_plan_qty, frame_prod_qty, frame_paint_qty)
        // console.log(item)

        // value1 = parseInt(frame_prod_qty) + value

        // console.log(value1)
        // console.log(item)
        // data.push({
        //   frame_qty: value1,
        //   seat_plan_qty: seat_plan_qty,
        //   frame_prod_qty: frame_prod_qty,
        //   frame_paint_qty: frame_paint_qty
        // })
        // console.log(data[0].frame_qty + 'check')

        // console.log(frame_plan_qty > parseInt(frame_prod_qty) + parseInt(count_value))
        // console.log(parseInt(frame_prod_qty) + ' ' + parseInt(count_value))

        if (
          frame_plan_qty >= parseInt(frame_prod_qty) + parseInt(value) ||
          frame_prod_qty >= parseInt(frame_paint_qty) + parseInt(value)
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
