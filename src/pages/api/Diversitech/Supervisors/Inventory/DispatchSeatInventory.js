import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { plan_no, seats_no } = req.body

    // console.log(plan_no, item_id) // Get the plan_no from the request query parameters

    if ((!plan_no, !seats_no)) {
      res.status(400).json({ message: 'Missing plan_no in query parameters' })

      return
    }

    const DispatchInventory = `SELECT
    tbl_item_master.item_code,
    tbl_item_master.item_description,
    tbl_item_master.image_url,
    tbl_item_master.frame_no,
    tbl_item_master.vecv_part_no,
    tbl_item_bom.quantity,
    tbl_dispatch_bom_detail.dispatch_quantity,
    tbl_dispatch_bom_detail.request_quantity,
    tbl_item_bom.item_id
FROM tbl_item_bom
JOIN tbl_item_master ON tbl_item_bom.item_id = tbl_item_master.item_id
JOIN tbl_dispatch_bom_detail ON tbl_item_bom.item_id = tbl_dispatch_bom_detail.seat_item_id
WHERE tbl_item_bom.parent_item_id = ?
  AND tbl_dispatch_bom_detail.dispatch_no = ?`

    //     `
    //     SELECT
    //     tbl_item_master.item_code,
    //     tbl_item_master.item_description,
    //     tbl_item_master.image_url,
    //     tbl_item_master.frame_no,
    //     tbl_item_master.vecv_part_no,
    //     tbl_item_bom.quantity,
    //     tbl_dispatch_bom_detail.dispatch_quantity,
    //     tbl_dispatch_bom_detail.request_quantity,
    //     tbl_item_bom.item_id
    // FROM tbl_item_bom
    // JOIN tbl_item_master ON tbl_item_bom.item_id = tbl_item_master.item_id
    // JOIN tbl_dispatch_bom_detail ON tbl_item_bom.item_id = tbl_dispatch_bom_detail.seat_item_id
    // WHERE tbl_item_bom.parent_item_id = ?
    //   AND tbl_dispatch_bom_detail.dispatch_no = ?
    //   `

    connection.query(DispatchInventory, [seats_no, plan_no], (err, data) => {
      if (err) {
        console.error('Error executing SQL Query:', err)

        // console.error('Master Data Not Get')
        res.status(500).json({ error: 'Error fetching data from the database' })

        return
      }

      // console.log('Master data Get from database:', JSON.stringify(data))
      res.status(200).json(data)
    })
  } catch (err) {
    console.error('Error in try and catch:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
