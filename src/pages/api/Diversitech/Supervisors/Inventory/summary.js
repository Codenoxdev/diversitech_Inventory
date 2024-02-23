import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const query = `SELECT
    tbl_item_master.item_code,
    tbl_item_master.item_description,
    tbl_item_master.category,
    tbl_item_master.dwg_division,
    tbl_item_master.material,
    tbl_item_master.unit,
    tbl_item_master.features,
    tbl_item_master.product_type,
    tbl_item_master.active,
    tbl_item_master.image_url,
    tbl_stock_summary.item_id,
    tbl_stock_summary.available_quantity
    FROM tbl_stock_summary
   JOIN tbl_item_master ON tbl_stock_summary.item_id = tbl_item_master.item_id`

    //  JOIN tbl_item_images ON tbl_item_master.item_code = tbl_item_images.item_code

    // `SELECT
    //       tbl_item_master.item_code,
    //       tbl_item_master.item_description,
    //       tbl_item_master.category,
    //       tbl_item_master.dwg_division,
    //       tbl_item_master.material,
    //       tbl_item_master.unit,
    //       tbl_item_master.features,
    //       tbl_item_master.product_type,
    //       tbl_item_master.active,
    //       tbl_item_master.image_url,
    //       tbl_stock_summary.item_id,
    //       tbl_stock_summary.available_quantity
    //     FROM tbl_stock_summary
    //     JOIN tbl_item_master ON tbl_stock_summary.item_id = tbl_item_master.item_id`
    connection.query(query, (err, data) => {
      if (err) {
        console.error(err)
        res.status(200).send('Error')

        return
      } else {
        res.status(200).json(data)
      }
    })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}
