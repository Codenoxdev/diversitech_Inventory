import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { plan_no } = req.body // Get the plan_no from the request query parameters

    if (!plan_no) {
      res.status(400).json({ message: 'Missing plan_no in query parameters' })

      return
    }

    const Plandataview = `
    SELECT
    tpdb.frame_plan_qty,
    tim1.item_id as frame_item_id,
    tpdb.seat_item_id,
    tpdb.frame_prod_qty,
    tpdb.frame_paint_qty,
    tpdb.frame_plan_qty,
    tim1.image_url frame_img_url,
    tim1.item_code,
    tim1.welding_no,
    tim1.mtgauge_no,
    tim1.frame_model,
    tim1.legpart_no,
    tim1.item_description
  FROM tbl_planning_bom_detail tpdb
  JOIN tbl_item_master tim ON tpdb.seat_item_id = tim.item_id
  JOIN tbl_item_master tim1 ON tim1.item_code = tim.frame_no
  WHERE tpdb.plan_no = ?;
    `

    connection.query(Plandataview, [plan_no], (err, data) => {
      if (err) {
        console.error('Error executing SQL Query:', err)

        // console.error('Master Data Not Get')
        res.status(500).json({ error: 'Error fetching data from the database' })

        return
      }

      // console.log('Master data Get from the database:', JSON.stringify(data))
      res.status(200).json(data)
    })
  } catch (err) {
    console.error('Error in try and catch:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
