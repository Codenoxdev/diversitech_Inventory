import connection from 'src/configs/db'

// import uploadimage from './uploadimage'
import multer from 'multer'
import path from 'path'

// import { v4 as uuidv4 } from 'uuid'
// import { NextApiRequest, NextApiResponse } from 'next'

const uploadDir = path.join(process.cwd(), '/public/image/Assembly')
const uploadFront = path.join(process.cwd(), '/public/image/Front')
const uploadBack = path.join(process.cwd(), '/public/image/Back')
const uploadPart = path.join(process.cwd(), '/public/image/Parts')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // const { product_type } = req.body
    if (file.fieldname === 'partimage') {
      cb(null, uploadPart)
    } else if (file.fieldname === 'file') {
      cb(null, uploadFront)
    } else if (file.fieldname === 'file1') {
      cb(null, uploadBack)
    } else if (file.fieldname === 'file2') {
      cb(null, uploadDir)
    } else {
      cb(new Error('Invalid file provided'))
    }
  },

  filename: (req, file, cb) => {
    const { item_code } = req.body
    if (file.originalname && typeof file.originalname === 'string' && file.originalname.length > 0) {
      const fileExtension = path.extname(file.originalname)
      const uniqueFilename = `${item_code}${fileExtension}`
      cb(null, uniqueFilename)
    } else if (file.fieldname === 'file2') {
      const uniqueFilename = `${item_code}_FM${fileExtension}`
      cb(null, uniqueFilename)
    } else {
      const uniqueFilename = `${item_code}.txt`
      cb(null, uniqueFilename)
    }
  }
})

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } })

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handle(req, res) {
  // console.log('Add Inventoryreq.body = ' + req.body)
  try {
    upload.fields([
      { name: 'file', maxCount: 1 },
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'partimage', maxCount: 1 }
    ])(req, res, err => {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err)

        return res.status(500).json({ error: 'Error uploading file.' })
      } else if (err) {
        console.error('Unknown error:', err)

        return res.status(500).json({ error: 'Unknown error uploading file.' })
      }
      const { file, file1, file2, partimage } = req.files

      // console.log(file, file1, file2, partimage)

      // const imageUrl = []
      const imageUrl = `/image/`

      // console.log(imageUrl)
      // console.log(req.body)

      const {
        item_code,
        item_description,
        engine_type,
        variant,
        model,
        bs_type,
        product_type,
        vecv_part_no,
        frame_no,
        dwg_division,
        material,
        unit,
        category,
        features,
        active,
        welding_fixTure_number,
        leg_part_number,
        fmodel,
        mtg_gauge_number
      } = req.body

      let InsertQuery

      let SelectQuery =
        'INSERT INTO tbl_stock_summary(item_id) SELECT(item_id) FROM tbl_item_master WHERE item_code = ? '

      const SelectCheckquery = ' SELECT item_code from tbl_item_master Where item_code = ?'

      // const Insertimage = `INSERT INTO tbl_item_images (item_code, image_path) VALUES (?,?);`

      if (item_code) {
        connection.query(SelectCheckquery, [item_code], (err, result) => {
          // console.log(result[0].item_code)
          if (result && result.length > 0 && result[0].item_code === item_code) {
            return res.status(200).json({ success: false, message: 'Item ID is already Exist' })
          }
        })
      }

      if (product_type === 'FRAME') {
        InsertQuery = `INSERT INTO tbl_item_master (item_code, item_description, dwg_division, unit, features, welding_no, mtgauge_no, legpart_no, frame_model, product_type, active, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`
      } else if (product_type === 'BUS') {
        InsertQuery = `INSERT INTO tbl_item_master (item_code, item_description,engine_type,variant,bs_type,model,product_type,active, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      } else if (product_type === 'SEAT') {
        InsertQuery = `INSERT INTO tbl_item_master (item_code, item_description,frame_no,vecv_part_no,unit,features,product_type,active, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      } else {
        InsertQuery = `INSERT INTO tbl_item_master (item_code, item_description, material, unit, category, dwg_division, product_type, active, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`
      }

      if (product_type === 'FRAME' && item_code && item_description) {
        connection.query(SelectCheckquery, [item_code], (err, result) => {
          // console.log(result[0].item_code)
          if (result && result.length > 0 && result[0].item_code === item_code) {
            return res.status(200).json({ success: false, message: 'Item ID is already Exist' })
          } else {
            connection.query(
              InsertQuery,
              [
                item_code,
                item_description,
                dwg_division,
                unit,
                features,
                welding_fixTure_number,
                mtg_gauge_number,
                leg_part_number,
                fmodel,
                product_type,
                active,
                imageUrl
              ],
              (err, result) => {
                if (err) {
                  console.error('Error updating data:', err)
                  res.status(500).json({ error: 'Error occurred while updating data.' })
                } else {
                  connection.query(SelectQuery, [item_code], (err, result) => {
                    if (err) {
                      console.error('Error updating data:', err)
                      res.status(500).json({ error: 'Error occurred while updating data.' })
                    } else {
                      console.log('Insert successful  Bus')
                    }
                  })
                  res.status(200).json({ success: true, message: 'Successfully Addded.' })
                }

                return
              }
            )

            // res.status(200).json({ message: 'Successfully Addded.' })
          }
        })
      } else if (product_type === 'BUS' && item_code && item_description) {
        connection.query(SelectCheckquery, [item_code], (err, result) => {
          // console.log(result[0].item_code)
          if (result && result.length > 0 && result[0].item_code === item_code) {
            return res.status(200).json({ success: false, message: 'Item ID is already Exist' })
          } else {
            connection.query(
              InsertQuery,
              [item_code, item_description, engine_type, variant, bs_type, model, product_type, active, imageUrl],
              (err, result) => {
                if (err) {
                  console.error('Error updating data:', err)
                  res.status(500).json({ error: 'Error occurred while updating data.' })
                } else {
                  // console.log('Update successful  Bus')
                  // res.status(200).json({ message: 'Update successful' })
                  // for (const imagePath of imageUrl) {
                  //   connection.execute(Insertimage, [item_code, imagePath])
                  //   console.log(`Inserted image path: ${imagePath}`)
                  // }

                  connection.query(SelectQuery, [item_code], (err, result) => {
                    if (err) {
                      console.error('Error updating data:', err)
                      res.status(500).json({ error: 'Error occurred while updating data.' })
                    } else {
                      console.log('Insert successfully  Bus')

                      // res.status(200).json({ message: 'Successfully Addded.' })
                    }
                  })

                  res.status(200).json({ success: true, message: 'Successfully Addded.' })
                }

                return
              }
            )
          }
        })
      } else if (product_type === 'SEAT' && item_code && item_description) {
        connection.query(SelectCheckquery, [item_code], (err, result) => {
          // console.log(result[0].item_code)
          if (result && result.length > 0 && result[0].item_code === item_code) {
            return res.status(200).json({ success: false, message: 'Item ID is already Exist' })
          } else {
            connection.query(
              InsertQuery,
              [item_code, item_description, frame_no, vecv_part_no, unit, features, product_type, active, imageUrl],
              (err, result) => {
                if (err) {
                  console.error('Error updating data:', err)
                  res.status(500).json({ error: 'Error occurred while updating data.' })
                } else {
                  // console.log('Update successful seat')
                  // res.status(200).json({ message: 'Update successful' })
                  // for (const imagePath of imageUrl) {
                  //   connection.execute(Insertimage, [item_code, imagePath])
                  //   console.log(`Inserted image path: ${imagePath}`)
                  // }

                  connection.query(SelectQuery, [item_code], (err, result) => {
                    if (err) {
                      console.error('Error updating data:', err)
                      res.status(500).json({ error: 'Error occurred while updating data.' })
                    } else {
                      console.log('Insert successful seat')

                      // res.status(200).json({ message: 'Successfully Addded.' })
                    }
                  })
                  res.status(200).json({ success: true, message: 'Successfully Addded.' })
                }

                return
              }
            )
          }
        })
      } else if (product_type === 'PART' && item_code && item_description) {
        connection.query(SelectCheckquery, [item_code], (err, result) => {
          // console.log(result[0].item_code)
          if (result && result.length > 0 && result[0].item_code === item_code) {
            return res.status(200).json({ success: false, message: 'Item ID is already Exist' })
          } else {
            connection.query(
              InsertQuery,
              [item_code, item_description, material, unit, category, dwg_division, product_type, active, imageUrl],
              (err, result) => {
                if (err) {
                  console.error('Error updating data:', err)
                  res.status(500).json({ error: 'Error occurred while updating data.' })
                } else {
                  // console.log('Update successful Parts')
                  // res.status(200).json({ message: 'Update successful' })
                  // for (const imagePath of imageUrl) {
                  //   connection.execute(Insertimage, [item_code, imagePath])
                  //   console.log(`Inserted image path: ${imagePath}`)

                  //   // res.status(200).json({ message: 'Successfully Addded.' })
                  // }
                  connection.query(SelectQuery, [item_code], (err, result) => {
                    if (err) {
                      console.error('Error updating data:', err)
                      res.status(500).json({ error: 'Error occurred while updating data.' })
                    } else {
                      console.log('Insert successful  Bus')

                      // res.status(200).json({ message: 'Successfully Addded.' })
                    }
                  })

                  res.status(200).json({ success: true, message: 'Successfully Addded.' })
                }

                return
              }
            )
          }
        })
      } else {
        res.status(200).json({ error: 'Add field First' })
      }
    })

    // })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error occurred while inserting data:', err })
  }
}
