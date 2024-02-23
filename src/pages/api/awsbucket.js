const multer = require('multer')
const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')
const { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  },
  region: process.env.AWS_REGION
})

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml']
  if (allowedMimeTypes.includes(mime.lookup(file.originalname))) {
    cb(null, true)
  } else {
    cb(new Error('Invalid Mime Type, only JPEG, PNG, and SVG'), false)
  }
}

const upload = multer({
  storage: multerS3({
    fileFilter,
    s3,
    bucket: process.env.AWS_BUCKET,

    // metadata: function (req, file, cb) {
    //   cb(null, { fieldName: 'codenox1_meta_data' })
    // },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10
  }
})

export { upload }
