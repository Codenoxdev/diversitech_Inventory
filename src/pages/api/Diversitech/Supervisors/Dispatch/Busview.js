import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { plan_no } = req.body

    // console.log(plan_no) // Get the plan_no from the request query parameters

    if (!plan_no) {
      res.status(400).json({ message: 'Missing plan_no in query parameters' })

      return
    }

    const Plandataview = `
      SELECT
        tbl_dispatch_detail.item_id,
        tbl_item_master.item_code,
        tbl_item_master.item_description,
        tbl_item_master.engine_type,
        tbl_item_master.variant,
        tbl_item_master.bs_type,
        tbl_item_master.model,
        tbl_dispatch_detail.request_quantity
      FROM tbl_dispatch_detail
      JOIN tbl_item_master ON tbl_dispatch_detail.item_id = tbl_item_master.item_id
      WHERE tbl_dispatch_detail.dispatch_no = ?;
    `

    connection.query(Plandataview, [plan_no], (err, data) => {
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
