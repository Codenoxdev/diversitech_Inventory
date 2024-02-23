import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const deleteObjectFromS3 = async key => {
  try {
    const command = new DeleteObjectCommand({ Bucket: 'diversitech', Key: key })

    await s3Client.send(command)

    // console.log(`Object deleted successfully: ${key}`)

    return true
  } catch (error) {
    // console.error(`Error deleting object: ${key}`, error)

    return false
  }
}

export default async function handler(req, res) {
  try {
    const { key } = req.query

    const isDeleted = await deleteObjectFromS3(key)

    if (isDeleted) {
      res.status(200).json({ message: 'Object deleted successfully.' })
    } else {
      res.status(404).json({ error: 'Object not found or could not be deleted.' })
    }
  } catch (error) {
    console.error('Error occurred:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
