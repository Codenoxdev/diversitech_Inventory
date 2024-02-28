import multer from 'multer'
import multerS3 from 'multer-s3'
import mime from 'mime'
import { S3Client } from '@aws-sdk/client-s3'
import connection from 'src/configs/db'
import path from 'path'

// import { v4 as uuidv4 } from 'uuid'
// import { NextApiRequest, NextApiResponse } from 'next'

// const uploadDir = path.join(process.cwd(), '/public/image/Front')

// console.log('itemCode = ' + itemCode)

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir)
//   },
//   filename: (req, file, cb) => {
//     const { item_code } = req.body
//     if (file.originalname && typeof file.originalname === 'string' && file.originalname.length > 0) {
//       const fileExtension = path.extname(file.originalname)
//       const uniqueFilename = `${item_code}${fileExtension}`
//       cb(null, uniqueFilename)
//     } else {
//       const uniqueFilename = `${item_code}.txt`
//       cb(null, uniqueFilename)
//     }

//     // itemCode = item_code

//     // console.log('Item Code1:', item_code)

//     // // Generate a unique identifier (UUID) if item_code is missing in the request body

//     // if (!item_code) {
//     //   item_code = itemCode

//     //   // item_code = uuidv4()
//     // }

//     // const fileExtension = path.extname(file.originalname)
//     // const uniqueFilename = `${item_code}${fileExtension}`

//     // // const uniqueFilename = `${file.originalname}${fileExtension}`

//     // cb(null, uniqueFilename)
//   }
// })

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   }
// })

const uploadAWSDir = 'Both'
const uploadAWSFront = 'Front'
const uploadAWSBack = 'Back'
const uploadAWSPart = 'Parts'
const uploadAWSFile = 'Files'

const fileFilter = (req, file, cb) => {
  // console.log(req.body.item_code + 'Check Inside fileFilter')
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/*']
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

    // console.log(req.body.item_code + ' = Check Inside s3Storage = ' + item_code)

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

export default async function handler(req, res) {
  // console.log('Body Outside', req.body)
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

      // console.log('Body inside', req.body.item_code)

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

      // const jsonFileUrls = JSON.stringify(fileUrls)

      // console.log('File URLs:', jsonFileUrls)
      const {
        item_id,
        item_code,
        item_description,
        engine_type,
        variant,
        model,
        bs_type,
        image_url,
        product_type,
        vecv_part_no,
        frame_no,
        dwg_division,
        material,
        unit,
        category,
        features,
        active,
        welding_no,
        legpart_no,
        frame_model,
        mtgauge_no
      } = req.body

      // console.log(
      //   item_id,
      //   item_code,
      //   item_description,
      //   engine_type,
      //   variant,
      //   model,
      //   bs_type,
      //   image_url,
      //   product_type,
      //   vecv_part_no,
      //   frame_no,
      //   dwg_division,
      //   material,
      //   unit,
      //   category,
      //   features,
      //   active,
      //   welding_no,
      //   legpart_no,
      //   frame_model,
      //   mtgauge_no
      // )

      // console.log('BUSPLANS check= ', busPlans)
      let UpdateQuery

      if (item_id && product_type === 'FRAME') {
        UpdateQuery = `UPDATE tbl_item_master
        SET item_code = ?, item_description = ?, dwg_division = ?, unit = ?, image_url = ?, features = ?, welding_no = ?, mtgauge_no = ?, legpart_no = ?, frame_model = ?
        WHERE item_id = ? AND product_type = ?;`
      } else if (item_id && product_type === 'BUS') {
        UpdateQuery = `UPDATE tbl_item_master
        SET item_code = ?,item_description = ?,engine_type = ?,variant = ?,bs_type = ?,model = ?
        WHERE item_id = ? AND product_type = ?;`
      } else if (item_id && product_type === 'SEAT') {
        UpdateQuery = `UPDATE tbl_item_master
        SET item_code = ?, item_description = ?,frame_no = ?, vecv_part_no = ?, image_url = ?,unit = ?, features = ?
        WHERE item_id = ? AND product_type = ?;`
      } else {
        UpdateQuery = `UPDATE tbl_item_master
        SET item_code = ?, item_description = ?, material = ?, unit = ?,category = ? , image_url = ? , dwg_division = ?
        WHERE item_id = ? AND product_type = ?;`
      }
      console.log(image_url)

      // const imageUrlObject = JSON.parse(image_url)
      let imageUrlObject = null

      product_type === 'BUS' ? (imageUrlObject = null) : (imageUrlObject = JSON.parse(image_url))

      // try {
      //   imageUrlObject = JSON.parse(image_url)
      // } catch (error) {
      //   console.error('Error parsing image_url:', error)
      // }

      for (const key of ['file0', 'file1', 'file2', 'partimage0', 'partimage1']) {
        if (fileUrls[key]) {
          imageUrlObject[key] = fileUrls[key]
        }
      }

      // console.log(imageUrlObject)

      const jsonFileUrls = JSON.stringify(imageUrlObject)

      if (product_type === 'FRAME') {
        connection.query(
          UpdateQuery,
          [
            item_code,
            item_description,
            dwg_division,
            unit,
            jsonFileUrls,
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
          [item_code, item_description, frame_no, vecv_part_no, jsonFileUrls, unit, features, item_id, product_type],
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
      } else if (product_type === 'PART') {
        connection.query(
          UpdateQuery,
          [item_code, item_description, material, unit, category, jsonFileUrls, dwg_division, item_id, product_type],
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

      // }

      // }
    })

    // })

    // await new Promise((resolve, reject) => {
    //   awsUpload.single('file')(req, res, err => {
    //     if (err) {
    //       console.error('Error uploading file:', err)

    //       return reject({ statusCode: 500, message: 'Error uploading file.' })
    //     }

    //     if (!req.file) {
    //       console.error('No file provided')

    //       return reject({ statusCode: 400, message: 'No file provided.' })
    //     }

    //     console.log('Item Code:', req.body.item_code)
    //     console.log('Uploaded File:', req.file)

    //     const baseUrl = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com`
    //     const imageUrl = `${baseUrl}/${req.body.item_code + file.key}`
    //     console.log('Image URL:', imageUrl)

    //     resolve({ statusCode: 200, imageUrl })
    //   })
    // })
    //   .then(result => res.status(result.statusCode).json({ imageUrl: result.imageUrl }))
    //   .catch(error => {
    //     console.error('Error:', error)
    //     res.status(error.statusCode || 500).json({ error: error.message || 'Server error.' })
    //   })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Server error.' })
  }
}
