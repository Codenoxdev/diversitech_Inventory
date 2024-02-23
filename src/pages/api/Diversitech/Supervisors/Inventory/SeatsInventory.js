import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { plan_no, item_id } = req.body

    // console.log(plan_no, item_id)

    if ((!plan_no, !item_id)) {
      res.status(400).json({ message: 'Missing plan_no in query parameters' })

      return
    }

    const PlanInventory = `SELECT
    tim.vecv_part_no,
    tim.item_description,
    tib.quantity,
    tim.item_code,
    tim.image_url seat_img_url,
    tpdb.qc_qty,
    tim.frame_no,
    tim.image_url as frame_img_url,
    tpdb.seat_plan_qty,
    tpdb.frame_paint_qty,
    tib.parent_item_id AS seat_parent_id
FROM tbl_planning_bom_detail tpdb
JOIN tbl_item_master tim ON tpdb.seat_item_id = tim.item_id
LEFT JOIN tbl_item_master tim1 ON tim1.item_code = tim.frame_no
JOIN tbl_item_bom tib ON tib.item_id = tim.item_id
WHERE tpdb.plan_no = ? AND tib.parent_item_id = ?;`

    // `SELECT
    // tim.vecv_part_no,
    // tim.item_description,
    // tib.quantity,
    // tim.item_code,
    // tim.image_url seat_img_url,
    // tpdb.qc_qty,
    // tim.frame_no,
    // tim.image_url as frame_img_url,
    // tpdb.seat_plan_qty,
    // tpdb.frame_paint_qty,
    // tib.parent_item_id AS seat_parent_id
    // FROM tbl_planning_bom_detail tpdb
    // JOIN tbl_item_master tim ON tpdb.seat_item_id = tim.item_id
    // JOIN tbl_item_master tim1 ON tim1.item_code = tim.frame_no
    // JOIN tbl_item_bom tib ON tib.item_id = tim.item_id
    // WHERE tpdb.plan_no = ? AND tib.parent_item_id = ?;`

    connection.query(PlanInventory, [plan_no, item_id], (err, data) => {
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
