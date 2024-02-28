import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { plan_no, item_id } = req.body

    // console.log(plan_no, item_id)

    if (!plan_no) {
      res.status(400).json({ message: 'Missing plan_no in query parameters' })

      return
    }

    const Plandataview = `SELECT
    tpdb.frame_plan_qty,
    tim1.item_id as frame_item_id,
    tpdb.seat_item_id,
    tpdb.frame_prod_qty,
    tpdb.frame_paint_qty,
    tpdb.frame_plan_qty,
    tim1.image_url,
    tim1.item_code,
    tim1.item_description
FROM tbl_planning_detail tpd
JOIN tbl_planning_bom_detail tpdb ON tpdb.plan_no = tpd.plan_no AND tpdb.item_id = tpd.item_id
JOIN tbl_item_master tim ON tpdb.seat_item_id = tim.item_id
LEFT JOIN tbl_item_master tim1 ON tim1.item_code = tim.frame_no
WHERE tpdb.plan_no = ? and tpd.item_id = ?;`

    //diversitech.s3.amazonaws.com/Parts/E141P01522.JPG

    //   `
    //   SELECT
    //   tpdb.frame_plan_qty,
    //   tim1.item_id as frame_item_id,
    //   tpdb.seat_item_id,
    //   tpdb.frame_prod_qty,
    //   tpdb.frame_paint_qty,
    //   tpdb.frame_plan_qty,
    //   tim1.image_url,
    //   tim1.item_code,
    //   tim1.item_description
    // FROM tbl_planning_detail tpd join tbl_planning_bom_detail tpdb on tpdb.plan_no = tpd.plan_no and tpdb.item_id = tpd.item_id
    // JOIN tbl_item_master tim ON tpdb.seat_item_id = tim.item_id
    // JOIN tbl_item_master tim1 ON tim1.item_code = tim.frame_no
    // WHERE tpdb.plan_no = ? and tpd.item_id = ?;
    //   `

    https: connection.query(Plandataview, [plan_no, item_id], (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching data from the database' })

        return
      }

      res.status(200).json(data)
    })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' })
  }
}
