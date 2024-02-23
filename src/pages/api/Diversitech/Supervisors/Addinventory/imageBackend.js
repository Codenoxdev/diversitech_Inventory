import connection from 'src/configs/db'
import path from 'path'
import multer from 'multer'
import multerS3 from 'multer-s3'
import mime from 'mime'
import { S3Client } from '@aws-sdk/client-s3'

// import { v4 as uuidv4 } from 'uuid'
// import { NextApiRequest, NextApiResponse } from 'next'

// const uploadDir = path.join(process.cwd(), '/public/image/Assembly')
// const uploadFront = path.join(process.cwd(), '/public/image/Front')
// const uploadBack = path.join(process.cwd(), '/public/image/Back')
// const uploadPart = path.join(process.cwd(), '/public/image/Parts')

const uploadAWSDir = 'Both'
const uploadAWSFront = 'Front'
const uploadAWSBack = 'Back'
const uploadAWSPart = 'Parts'
const uploadAWSFile = 'Files'

// console.log(process.env.AWS_ACCESS_KEY_ID)

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

// const localStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // const { product_type } = req.body
//     if (file.fieldname === 'partimage') {
//       cb(null, uploadPart)
//     } else if (file.fieldname === 'file') {
//       cb(null, uploadFront)
//     } else if (file.fieldname === 'file1') {
//       cb(null, uploadBack)
//     } else if (file.fieldname === 'file2') {
//       cb(null, uploadDir)
//     } else {
//       cb(new Error('Invalid file provided'))
//     }
//   },

//   filename: (req, file, cb) => {
//     const { item_code } = req.body
//     if (file.originalname && typeof file.originalname === 'string' && file.originalname.length > 0) {
//       const fileExtension = path.extname(file.originalname)
//       const uniqueFilename = `${item_code}${fileExtension}`
//       cb(null, uniqueFilename)
//     } else if (file.fieldname === 'file2') {
//       const uniqueFilename = `${item_code}_FM${fileExtension}`
//       cb(null, uniqueFilename)
//     } else {
//       const uniqueFilename = `${item_code}.txt`
//       cb(null, uniqueFilename)
//     }
//   }
// })

// const uploadMiddleware = multer({ storage: s3Storage, limits: { fileSize: 1024 * 1024 * 5 } })
// // Multer middleware for local storage

// const localUpload = multer({ storage: localStorage })

const awsUpload = multer({ storage: s3Storage })

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handle(req, res) {
  try {
    // console.log('Outside ' + req.body)

    // localUpload.fields([
    //   { name: 'partimage', maxCount: 1 },
    //   { name: 'file', maxCount: 1 },
    //   { name: 'file1', maxCount: 1 },
    //   { name: 'file2', maxCount: 1 }
    // ])(req, res, async function (err) {
    //   if (err) {
    //     console.error(err)

    //     return res.status(400).send(err.message)
    //   }

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

      // const imageUrl = `/image/`
      const { file, file1, file2, partimage, filedata } = req.files

      // console.log(file, file1, file2, partimage, filedata)

      const baseUrl = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com`
      let fileUrls = {}

      if (partimage) {
        // If partimage exists, upload it as a single file
        // fileUrls = { partimage: `${baseUrl}/${partimage[0].key}` }
        const filesToUpload = [partimage, filedata]
        filesToUpload.forEach((file, index) => {
          if (file) {
            fileUrls[`partimage${index}`] = `${baseUrl}/${file[0].key}`
          }
        })
      } else {
        // If partimage does not exist, upload file, file1, and file2 as separate files
        const filesToUpload = [file, file1, file2, filedata]
        filesToUpload.forEach((file, index) => {
          if (file) {
            fileUrls[`file${index}`] = `${baseUrl}/${file[0].key}`
          }
        })
      }

      const jsonFileUrls = JSON.stringify(fileUrls)

      // console.log('File URLs:', jsonFileUrls)

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
                  // console.log('Update successful frame')
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

                  connection.query(SelectQuery, [item_code], (err, result) => {
                    if (err) {
                      console.error('Error updating data:', err)
                      res.status(500).json({ error: 'Error occurred while updating data.' })
                    } else {
                      console.log('Insert successfully')

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

    // res.status(200).send('Files uploaded successfully')
    // })

    // })

    // await uploadMiddleware.fields([
    //   { name: 'file', maxCount: 1 },
    //   { name: 'file1', maxCount: 1 },
    //   { name: 'file2', maxCount: 1 },
    //   { name: 'partimage', maxCount: 1 }
    // ])(req, res, function (err) {
    //   console.log('Inside ' + req.body)
    //   if (err) {
    //     console.error(err)

    //     return res.status(400).send(err.message)
    //   }
    //   const imageUrl = `/image/`
    //   const { file, file1, file2, partimage } = req.files
    //   console.log(file.path, file1.path, file2.path, partimage.path, imageUrl)

    //   const Images = {
    //     file: file.path,
    //     file1: file1.path,
    //     file2: file2.path,
    //     partimage: partimage.path,
    //     imageurl: imageUrl
    //   }

    //   console.log(Images)

    //   res.status(200).send('File uploaded successfully')
    // })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
}
