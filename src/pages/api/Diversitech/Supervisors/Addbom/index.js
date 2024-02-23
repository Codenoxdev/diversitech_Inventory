import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { bom } = req.body

    // console.log(bom)
    let successCount = 0
    const totalCount = bom.length

    for (const item of bom) {
      const { parent_id, item_id, Quantity } = item
      console.log(parent_id, item_id, Quantity)
      const selectquery = `SELECT EXISTS (SELECT * FROM tbl_item_bom WHERE parent_item_id = ${parent_id}) AS is_available;`
      console.log(selectquery)

      // console.log(parent_id, item_id, Quantity)

      const insertquery = 'INSERT INTO tbl_item_bom (parent_item_id, item_id, quantity) VALUES (?,?,?)'
      connection.query(selectquery, [parent_id], (err, result) => {
        if (err) {
          console.error(err)
        } else {
          const { is_available } = result[0]
          if (is_available) {
            console.log('exist')

            res.status(200).json({ success: false, message: 'Already exist BOM' })
          } else {
            connection.query(insertquery, [parent_id, item_id, Quantity], (err, result) => {
              if (err) {
                console.error(err)
              } else {
                console.log('Insert Data Successfully')
                successCount++
                if (successCount === totalCount) {
                  // If all insert operations are successful, send the response
                  res.status(200).json({ success: true, message: 'Insert Data Successfully' })
                }
              }
            })
          }
        }
      })
    }

    // for (const item of bom) {
    //   const { parent_id, item_id, Quantity } = item
    //   console.log(parent_id, item_id, Quantity)

    //   const insertquery = 'INSERT INTO tbl_item_bom (parent_item_id, item_id, quantity) VALUES (?,?,?)'

    //   connection.query(insertquery, [parent_id, item_id, Quantity], (err, result) => {
    //     if (err) {
    //       console.error(err)
    //     } else {
    //       console.log('Insert Data Successfully')
    //       res.status(500).json({ message: 'Bill of material created' })
    //     }
    //   })
    // }
    // res.status(200).json({ message: 'Insert Data Successfully' })
  } catch (err) {
    console.error('Error occurred while inserting data:', err)
  }
}
