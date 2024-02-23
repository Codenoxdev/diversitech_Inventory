import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { item_id, bom, parent, child } = req.body

    if (item_id) {
      try {
        const selectquery = `SELECT
          tim.item_id,
          tim.item_code AS FertCode,
          tim.item_description,
          tim.material,
          tim.unit,
          tim.category,
          tib.quantity AS Quantity,
          tim.image_url,
          tim2.item_id AS parent_id,
          tim2.item_description AS parent_description
        FROM tbl_item_bom tib
        JOIN tbl_item_master tim ON tib.item_id = tim.item_id
        LEFT JOIN tbl_item_master tim1 ON tim1.item_code = tim.frame_no
        JOIN tbl_item_master tim2 ON tim2.item_id = tib.parent_item_id
        WHERE tib.parent_item_id = ?`

        connection.query(selectquery, [item_id], (err, result) => {
          if (err) {
            console.error('Error inserting data:', err)
            response.push({ success: false, message: 'Error occurred while inserting data' })
          } else {
            // console.log(result)
            res.status(200).json(result)
          }
        })
      } catch (err) {
        res.status(500).json({ success: false, message: 'Something went Wrong' })
      }
    }

    if (bom) {
      try {
        let successCount = 0
        const totalCount = bom.length

        // console.log(totalCount)
        for (const item of bom) {
          const { parent_id, item_id, Quantity } = item
          const selectQuery = `SELECT EXISTS (SELECT * FROM tbl_item_bom WHERE parent_item_id = ? AND item_id = ?) AS is_available;`

          const insertQuery = 'INSERT INTO tbl_item_bom (parent_item_id, item_id, quantity) VALUES (?,?,?)'
          connection.query(selectQuery, [parent_id, item_id], (err, result) => {
            if (err) {
              console.error(err)
            } else {
              const { is_available } = result[0]
              if (is_available) {
                console.log('exist')
              } else {
                connection.query(insertQuery, [parent_id, item_id, Quantity], (err, result) => {
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
      } catch (err) {
        res.status(500).json({ success: false, message: 'Something went Wrong' })
      }
    }

    if (parent && child) {
      try {
        const deleteQuery = `DELETE FROM tbl_item_bom WHERE parent_item_id = ? AND item_id = ?`
        connection.query(deleteQuery, [parent, child], (err, result) => {
          // if (!result) {
          //   res.status(200).json({ success: true, message: 'Delete Successfully' })
          // }
          if (err) {
            console.error(err)
          } else {
            console.log('Successfully Delete')
            res.status(200).json({ success: true, message: 'Delete Successfully' })
          }
        })
      } catch (err) {
        res.status(500).json({ success: false, message: 'Something went Wrong' })
      }
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error occurred while inserting data:', err })
  }
}
