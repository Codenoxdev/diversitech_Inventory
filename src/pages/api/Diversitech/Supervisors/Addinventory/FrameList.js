import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { frame_list_type } = req.body

    const frames = `
      SELECT
        item_code
      FROM tbl_item_master
      WHERE tbl_item_master.product_type = ?;
    `

    connection.query(frames, [frame_list_type], (err, data) => {
      if (err) {
        console.error('Error executing SQL Query:', err)
        res.status(500).json({ error: 'Error fetching data from the database' })

        return
      }
      res.status(200).json(data)
    })
  } catch (err) {
    console.error('Error in try and catch:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
