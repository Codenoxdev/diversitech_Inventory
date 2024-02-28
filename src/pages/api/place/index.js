import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const placeQuery = `SELECT * FROM tbl_place`

    connection.query(placeQuery, (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).json(err)
      } else {
        res.status(200).json(result)
      }
    })
  } catch {
    console.error('Error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
