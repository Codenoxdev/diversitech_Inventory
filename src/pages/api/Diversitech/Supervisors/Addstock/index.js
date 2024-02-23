import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { itemId, quantity, Type, text } = req.body
    const CurrentDate = new Date().toISOString()

    // let type = 'add'

    const insertquery =
      'INSERT INTO tbl_stock_adjustment (adjustment_date,adj_type, adj_qty, item_id, adj_remark) VALUES (?,?,?,?,?)'

    connection.query(insertquery, [CurrentDate, Type, quantity, itemId, text], (err, result) => {
      if (err) {
        console.error(err)
      } else {
        // console.log('Insert Data Successfully')
        res.status(500).json({ message: 'Update Data successfully' })
      }
    })
  } catch (err) {
    console.error('Error occurred while inserting data:', err)
  }
}
