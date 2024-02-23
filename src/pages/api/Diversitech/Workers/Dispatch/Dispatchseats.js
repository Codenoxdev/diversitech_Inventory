import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { plan_no, seats_no } = req.body

    // console.log(plan_no) // Get the plan_no from the request query parameters

    if (!plan_no) {
      res.status(400).json({ message: 'Missing plan_no in query parameters' })

      return
    }

    const PlanDispatchseats = `SELECT
    tim.item_code,
    tim.item_description,
    tim.image_url,
    tim.vecv_part_no,
    tib.quantity,
    tdbd.request_quantity,
    tdbd.dispatch_quantity,
    tdbd.seat_item_id as item_id,
    tss.available_quantity
FROM tbl_dispatch_detail tdd JOIN tbl_dispatch_bom_detail tdbd on tdbd.dispatch_no = tdd.dispatch_no and  tdbd.item_id = tdd.item_id
JOIN tbl_item_master tim ON tim.item_id = tdbd.seat_item_id
JOIN tbl_item_bom tib ON tib.parent_item_id = tdbd.item_id and tib.item_id = tdbd.seat_item_id
JOIN tbl_stock_summary tss on tss.item_id = tdbd.seat_item_id
WHERE tdd.dispatch_no = ?
  AND tdd.item_id = ?`

    //     `SELECT
    //     tim.item_code,
    //     tim.item_description,
    //     tim.image_url,
    //     tim.vecv_part_no,
    //     tib.quantity,
    //     tdbd.request_quantity,
    //     tdbd.dispatch_quantity,
    //     tdbd.seat_item_id as item_id,
    //     tss.available_quantity
    // FROM tbl_dispatch_detail tdd JOIN tbl_dispatch_bom_detail tdbd on tdbd.dispatch_no = tdd.dispatch_no and  tdbd.item_id = tdd.item_id
    // JOIN tbl_item_master tim ON tim.item_id = tdbd.seat_item_id
    // JOIN tbl_item_bom tib ON tib.parent_item_id = tdbd.item_id and tib.item_id = tdbd.seat_item_id
    // JOIN tbl_stock_summary tss on tss.item_id = tdbd.seat_item_id
    // WHERE tdd.dispatch_no = ?
    //   AND tdd.item_id = ?;`

    connection.query(PlanDispatchseats, [plan_no, seats_no], (err, data) => {
      if (err) {
        console.error('Error executing SQL Query:', err)

        // console.error('Master Data Not Get')
        res.status(500).json({ error: 'Error fetching data from the database' })

        return
      }

      // console.log(data)

      // console.log('Master data Get from database:', JSON.stringify(data))
      res.status(200).json(data)
    })
  } catch (err) {
    console.error('Error in try and catch:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
