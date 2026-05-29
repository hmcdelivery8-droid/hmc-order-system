import { google } from 'googleapis'
import { createReadStream } from 'fs'
import path from 'path'

export async function uploadToDrive(file, orderNumber) {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  })

  const drive = google.drive({ version: 'v3', auth })

  const ext = path.extname(file.originalFilename || file.newFilename || '')
  const fileName = `${orderNumber}${ext}`

  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    },
    media: {
      mimeType: file.mimetype || 'application/octet-stream',
      body: createReadStream(file.filepath),
    },
    fields: 'id, name',
  })

  const fileId = res.data.id

  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
  })

  return {
    fileId,
    fileName,
    fileUrl: `https://drive.google.com/file/d/${fileId}/view`,
  }
}
