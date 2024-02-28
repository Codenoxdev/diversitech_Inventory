import connection from 'src/configs/db'
import path from 'path'
import multer from 'multer'
import multerS3 from 'multer-s3'
import mime from 'mime'
import { S3Client } from '@aws-sdk/client-s3'

const uploadAWSDir = 'Both'
const uploadAWSFront = 'Front'
const uploadAWSBack = 'Back'
const uploadAWSPart = 'Parts'
const uploadAWSFile = 'Files'

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['*/*', 'image/jpeg', 'image/png', 'image/svg+xml', 'application/*']
  if (allowedMimeTypes.includes(mime.lookup(file.originalname))) {
    cb(null, true)
  } else {
    cb(new Error('Invalid Mime Type, only JPEG, PNG, and SVG'), false)
  }
}
let uploadAWSPath = ''

const s3Storage = multerS3({
  fileFilter,
  s3: s3,
  bucket: process.env.AWS_BUCKET,
  key: function (req, file, cb) {
    const { item_code } = req.body

    if (file.fieldname === 'partimage') {
      uploadAWSPath = uploadAWSPart
    } else if (file.fieldname === 'file') {
      uploadAWSPath = uploadAWSFront
    } else if (file.fieldname === 'file1') {
      uploadAWSPath = uploadAWSBack
    } else if (file.fieldname === 'file2') {
      uploadAWSPath = uploadAWSDir
    } else if (file.fieldname === 'filedata') {
      uploadAWSPath = uploadAWSFile
    } else {
      cb(new Error('Invalid file provided'))
    }

    const uniqueFilename = `${item_code}${path.extname(file.originalname)}`
    cb(null, `${uploadAWSPath}/${uniqueFilename}`)
  }
})

const awsUpload = multer({ storage: s3Storage })

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handle(req, res) {
  try {
    awsUpload.fields([
      { name: 'partimage', maxCount: 1 },
      { name: 'file', maxCount: 1 },
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'filedata', maxCount: 1 }
    ])(req, res, function (err) {
      if (err) {
        console.error(err)

        return res.status(400).send(err.message)
      }

      const { file, file1, file2, partimage, filedata } = req.files

      const baseUrl = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com`
      let fileUrls = {}

      if (partimage) {
        const filesToUpload = [partimage, filedata]
        filesToUpload.forEach((file, index) => {
          if (file) {
            fileUrls[`partimage${index}`] = `${baseUrl}/${file[0].key}`
          }
        })
      } else {
        const filesToUpload = [file, file1, file2, filedata]
        filesToUpload.forEach((file, index) => {
          if (file) {
            fileUrls[`file${index}`] = `${baseUrl}/${file[0].key}`
          }
        })
      }

      const jsonFileUrls = JSON.stringify(fileUrls)

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
        mtg_gauge_number,
        storeAreas
      } = req.body

      console.log(item_code, item_description, storeAreas)

      let InsertQuery

      let stockInsertQuery =
        'INSERT INTO tbl_stock_summary(item_id) SELECT(item_id) FROM tbl_item_master WHERE item_code = ?'

      const SelectCheckquery = ' SELECT item_code from tbl_item_master Where item_code = ?'

      // const Insertimage = `INSERT INTO tbl_item_images (item_code, image_path) VALUES (?,?);`

      const insertImageLocation = `INSERT INTO tbl_image_location(item_id,coords,title,image-status) VALUES (?,?,?,?,?)`

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
        InsertQuery = `INSERT INTO tbl_item_master (item_code, item_description,engine_type,variant,bs_type,model,product_type,active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
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
                jsonFileUrls
              ],
              (err, result) => {
                if (err) {
                  console.error('Error updating data:', err)
                  res.status(500).json({ error: 'Error occurred while updating data.' })
                } else {
                  let lastId = result.insertId

                  // if (storeAreas) {
                  //   for (const item of result) {
                  //     const { x_axis, y_axis, value, name } = item
                  //     let coords = x_axis + ',' + y_axis
                  //     console.log(coords)
                  //     connection.query(insertImageLocation, [lastId, coords, name, value], (err, result) => {
                  //       if (err) {
                  //         console.error('Error updating data:', err)
                  //         res.status(500).json({ error: 'Error occurred while updating data.' })
                  //       } else {
                  //         console.log('Insert successfully')
                  //       }
                  //     })
                  //   }
                  // }
                  connection.query(stockInsertQuery, [item_code], (err, result) => {
                    if (err) {
                      console.error('Error updating data:', err)
                      res.status(500).json({ error: 'Error occurred while updating data.' })
                    } else {
                      console.log('Insert successful')
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
              [item_code, item_description, engine_type, variant, bs_type, model, product_type, active],
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
                  connection.query(stockInsertQuery, [item_code], (err, result) => {
                    if (err) {
                      console.error('Error updating data:', err)
                      res.status(500).json({ error: 'Error occurred while updating data.' })
                    } else {
                      // console.log('Insert successfully')
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
              [item_code, item_description, frame_no, vecv_part_no, unit, features, product_type, active, jsonFileUrls],
              (err, result) => {
                if (err) {
                  console.error('Error updating data:', err)
                  res.status(500).json({ error: 'Error occurred while updating data.' })
                } else {
                  let lastId = result.insertId

                  // if (Array.isArray(storeAreas)) {
                  //   // Check if storeAreas is an array
                  //   storeAreas.forEach(item => {
                  //     const { x_axis, y_axis, value, name } = item
                  //     const coords = `${x_axis},${y_axis}`
                  //     console.log(coords)

                  //     // Assuming connection is defined outside of this block
                  //     connection.query(insertImageLocation, [lastId, coords, name, value], (err, result) => {
                  //       if (err) {
                  //         console.error('Error updating data:', err)
                  //         res.status(500).json({ error: 'Error occurred while updating data.' })
                  //       } else {
                  //         console.log('Insert successfully')
                  //       }
                  //     })
                  //   })
                  // } else {
                  //   storeAreas.forEach(item => {
                  //     const { x_axis, y_axis, value, name } = item[0]
                  //     const coords = `${x_axis},${y_axis}`
                  //     console.log(coords)

                  //     // Assuming connection is defined outside of this block
                  //     connection.query(insertImageLocation, [lastId, coords, name, value], (err, result) => {
                  //       if (err) {
                  //         console.error('Error updating data:', err)
                  //         res.status(500).json({ error: 'Error occurred while updating data.' })
                  //       } else {
                  //         console.log('Insert successfully')
                  //       }
                  //     })
                  //   })
                  // }
                  connection.query(stockInsertQuery, [item_code], (err, result) => {
                    if (err) {
                      console.error('Error updating data:', err)
                      res.status(500).json({ error: 'Error occurred while updating data.' })
                    } else {
                      console.log('Insert successful')

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
              [item_code, item_description, material, unit, category, dwg_division, product_type, active, jsonFileUrls],
              (err, result) => {
                if (err) {
                  console.error('Error updating data:', err)
                  res.status(500).json({ error: 'Error occurred while updating data.' })
                } else {
                  let lastId = result.insertId

                  // if (storeAreas) {
                  //   for (const item of result) {
                  //     const { x_axis, y_axis, value, name } = item
                  //     let coords = x_axis + ',' + y_axis
                  //     console.log(coords)
                  //     connection.query(insertImageLocation, [lastId, coords, name, value], (err, result) => {
                  //       if (err) {
                  //         console.error('Error updating data:', err)
                  //         res.status(500).json({ error: 'Error occurred while updating data.' })
                  //       } else {
                  //         console.log('Insert successfully')
                  //       }
                  //     })
                  //   }
                  // }
                  connection.query(stockInsertQuery, [item_code], (err, result) => {
                    if (err) {
                      console.error('Error updating data:', err)
                      res.status(500).json({ error: 'Error occurred while updating data.' })
                    } else {
                      console.log('Insert successful')

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
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
}
