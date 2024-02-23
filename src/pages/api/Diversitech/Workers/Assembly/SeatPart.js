import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { seat_id } = req.query

    const query = ` SELECT
    tim1.item_description,
    tim.item_id,
    tim1.item_code,
    tpdb.quantity,
    tim1.image_url AS seat_img_url,
    tim.item_description AS frame_item_description
  FROM tbl_item_bom tpdb
  JOIN tbl_item_master tim ON tim.item_id = tpdb.parent_item_id
  JOIN tbl_item_master tim1 ON tim1.item_id = tpdb.item_id
  WHERE tpdb.parent_item_id = ?;`

    // `
    //   SELECT
    //     tim1.item_description,
    //     tim.item_id,
    //     tim1.item_code,
    //     tpdb.quantity,
    //     tim.image_url AS frame_img_url,
    //     tim.item_description AS frame_item_description
    //   FROM tbl_item_bom tpdb
    //   JOIN tbl_item_master tim ON tim.item_id = tpdb.parent_item_id
    //   JOIN tbl_item_master tim1 ON tim1.item_id = tpdb.item_id
    //   WHERE tpdb.parent_item_id = ?;
    // `

    connection.query(query, [seat_id], (err, data) => {
      if (err) {
        console.error('Error executing SQL Query:', err)

        // console.error('Master Data Not Get')
        res.status(500).json({ error: 'Error fetching data from the database' })
      } else {
        // console.log('Master data fetched from the database:', data)
        res.status(200).json(data)
      }
    })
  } catch (err) {
    console.error('Error in try and catch:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
