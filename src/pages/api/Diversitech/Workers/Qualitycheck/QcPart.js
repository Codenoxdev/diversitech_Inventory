import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const query = `
    SELECT
        tbm1.item_id,
        tbm1.image_path AS qc_img_url,
        tbm1.item_code,
        tbm1.item_description,
        tbm1.features
      FROM tbl_item_master AS tbm1
      WHERE
        tbm1.features = 3 AND
        tbm1.product_type = 'PART';
    `

    connection.query(query, (err, data) => {
      if (err) {
        console.error('Error executing SQL Query:', err)
        console.error('Master Data Not Get')
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
