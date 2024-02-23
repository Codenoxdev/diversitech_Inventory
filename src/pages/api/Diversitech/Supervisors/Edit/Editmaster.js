import connection from 'src/configs/db'
import path from 'path'
import multer from 'multer'

// const uploadDir = path.join(process.cwd(), 'public/image/Front')

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir)
//   },
//   filename: (req, file, cb) => {
//     console.log(req.body)

//     // const { code } = req.body
//     // const { code } = req.body
//     // console.log('code = ' + code)
//     const fileExtension = path.extname(file.originalname)
//     const uniqueFilename = `${code}${fileExtension}`
//     cb(null, uniqueFilename)
//   }
// })

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   }
// })

// export const config = {
//   api: {
//     bodyParser: false
//   }
// }

export default async function handle(req, res) {
  try {
    // console.log(date)

    const { item_id, product_type, formData, busPlans, code } = req.body

    // console.log(item_id, product_type, formData, busPlans, code)
    // console.log('BUSPLANS = ', busPlans)

    // upload.fields([
    //   { name: 'file', maxCount: 1 },
    //   { name: 'file1', maxCount: 1 },
    //   { name: 'file2', maxCount: 1 },
    //   { name: 'partimage', maxCount: 1 }
    // ])(req, res, err => {
    //   if (err instanceof multer.MulterError) {
    //     console.error('Multer error:', err)

    //     return res.status(500).json({ error: 'Error uploading file.' })
    //   } else if (err) {
    //     console.error('Unknown error:', err)

    //     return res.status(500).json({ error: 'Unknown error uploading file.' })
    //   }
    // })

    let selectQuery
    let UpdateQuery

    if (!busPlans) {
      if (item_id && product_type === 'FRAME') {
        selectQuery = `SELECT item_id, item_code,item_description,image_url, dwg_division, unit, features, welding_no,mtgauge_no,legpart_no,frame_model,product_type FROM tbl_item_master WHERE item_id = ? AND product_type = ?`

        // selectQuery = `SELECT tim.item_id, tim.item_code,tim.item_description, tim.dwg_division, tim.unit,
        // tim.features, tim.welding_no,tim.mtgauge_no,tim.legpart_no,tim.frame_model,
        // tim.product_type, tii.image_path
        // FROM tbl_item_master tim
        // Join tbl_item_images tii on tim.item_code = tii.item_code
        // WHERE
        // item_id = ? AND product_type = ?`
      } else if (item_id && product_type === 'BUS') {
        selectQuery = `SELECT item_id, item_code,product_type , item_description, engine_type, variant, bs_type, model, active FROM tbl_item_master WHERE item_id = ? AND product_type = ?`
      } else if (item_id && product_type === 'SEAT') {
        selectQuery = `SELECT item_id,item_code,item_description ,image_url, product_type, frame_no, vecv_part_no, unit, features, active FROM tbl_item_master WHERE item_id = ? AND product_type = ?`
      } else {
        selectQuery = `SELECT item_id,item_code,item_description,image_url, product_type, material, unit, category, dwg_division, active FROM tbl_item_master WHERE item_id = ? AND product_type = ?`
      }
    } else {
      if (busPlans[0].item_id && busPlans[0].product_type === 'FRAME') {
        UpdateQuery = `UPDATE tbl_item_master
        SET item_code = ?, item_description = ?, dwg_division = ?, unit = ?, features = ?, welding_no = ?, mtgauge_no = ?, legpart_no = ?, frame_model=?
        WHERE item_id = ? AND product_type = ?;`
      } else if (busPlans[0].item_id && busPlans[0].product_type === 'BUS') {
        UpdateQuery = `UPDATE tbl_item_master
        SET item_code = ?,item_description = ?,engine_type = ?,variant = ?,bs_type = ?,model = ?
        WHERE item_id = ? AND product_type = ?;`
      } else if (busPlans[0].item_id && busPlans[0].product_type === 'SEAT') {
        UpdateQuery = `UPDATE tbl_item_master
        SET item_code = ?, item_description = ?,frame_no = ?, vecv_part_no = ?,unit = ?, features = ?
        WHERE item_id = ? AND product_type = ?;`
      } else {
        UpdateQuery = `UPDATE tbl_item_master
        SET item_code = ?, item_description = ?, material = ?, unit = ?,category = ?, dwg_division = ?
        WHERE item_id = ? AND product_type = ?;`
      }
    }

    if (!busPlans) {
      connection.query(selectQuery, [item_id, product_type], (err, result) => {
        if (err) {
          console.error('Error fetching data:', err)
          res.status(500).json({ error: 'Internal Server Error' })
        } else {
          res.status(200).json(result)
        }

        return
      })
    } else {
      // console.log(
      //   busPlans[0].item_id,
      //   busPlans[0].item_code,
      //   busPlans[0].item_description,
      //   busPlans[0].engine_type,
      //   busPlans[0].variant,
      //   busPlans[0].bs_type,
      //   busPlans[0].model,
      //   busPlans[0].product_type,
      //   busPlans[0].unit,
      //   busPlans[0].dwg_division,
      //   busPlans[0].features,
      //   busPlans[0].welding_no,
      //   busPlans[0].mtgauge_no,
      //   busPlans[0].legpart_no,
      //   busPlans[0].frame_model,
      //   busPlans[0].frame_no,
      //   busPlans[0].vecv_part_no,
      //   busPlans[0].material,
      //   busPlans[0].category
      // )
      for (const item of busPlans) {
        const {
          item_code,
          item_description,
          dwg_division,
          unit,
          features,
          welding_no,
          mtgauge_no,
          legpart_no,
          frame_model,
          item_id,
          product_type,
          engine_type,
          variant,
          bs_type,
          model,
          frame_no,
          vecv_part_no,
          material
        } = item

        if (product_type === 'FRAME') {
          connection.query(
            UpdateQuery,
            [
              item_code,
              item_description,
              dwg_division,
              unit,
              features,
              welding_no,
              mtgauge_no,
              legpart_no,
              frame_model,
              item_id,
              product_type
            ],
            (err, result) => {
              if (err) {
                console.error('Error updating data:', err)
                res.status(500).json({ error: 'Error occurred while updating data.' })
              } else {
                // console.log('Update successful frame')
                res.status(200).json({ success: true, message: 'Update successful' })
              }

              return
            }
          )
        } else if (product_type === 'BUS') {
          connection.query(
            UpdateQuery,
            [item_code, item_description, engine_type, variant, bs_type, model, item_id, product_type],
            (err, result) => {
              if (err) {
                console.error('Error updating data:', err)
                res.status(500).json({ error: 'Error occurred while updating data.' })
              } else {
                // console.log('Update successful  Bus')
                res.status(200).json({ success: true, message: 'Update successful' })
              }

              return
            }
          )
        } else if (product_type === 'SEAT') {
          connection.query(
            UpdateQuery,
            [item_code, item_description, frame_no, vecv_part_no, unit, features, item_id, product_type],
            (err, result) => {
              if (err) {
                console.error('Error updating data:', err)
                res.status(500).json({ error: 'Error occurred while updating data.' })
              } else {
                // console.log('Update successful seat')
                res.status(200).json({ success: true, message: 'Update successful' })
              }

              return
            }
          )
        } else {
          connection.query(
            UpdateQuery,
            [item_code, item_description, material, unit, category, dwg_division, item_id, product_type],
            (err, result) => {
              if (err) {
                console.error('Error updating data:', err)
                res.status(500).json({ error: 'Error occurred while updating data.' })
              } else {
                // console.log('Update successful Parts')
                res.status(200).json({ success: true, message: 'Update successful' })
              }

              return
            }
          )
        }
      }
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error occurred:', err })
  }
}
