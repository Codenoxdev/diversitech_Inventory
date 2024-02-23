import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const query = `SELECT * FROM tbl_item_master`
    connection.query(query, (err, data) => {
      if (err) {
        console.error('error execution sql Query:', err)

        // console.log('Master Data Not Get')
        console.error(err)
        res.status(200).send('Error')

        return
      } else {
        // console.log('Master data Get to database:- ', data)
        res.status(200).json(data)
      }
    })
  } catch (err) {
    // console.log('Error in try and catch:', err)

    return res.status(500).json({ message: 'Internal server error' })
  }
}
