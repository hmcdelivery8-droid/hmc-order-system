import { supabaseAdmin } from '../../lib/supabase'
import { uploadToDrive } from '../../lib/drive'
import formidable from 'formidable'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const form = formidable({ maxFileSize: 50 * 1024 * 1024 })
    let fields, files
    try {
      ;[fields, files] = await form.parse(req)
    } catch (e) {
      return res.status(400).json({ error: 'Failed to parse form: ' + e.message })
    }

    const get = (key) => fields[key]?.[0] ?? null

    const orderData = {
      customer_name: get('customer_name'),
      product:       get('product'),
      size:          get('size'),
      print_method:  get('print_method'),
      shape:         get('shape'),
      quantity:      parseInt(get('quantity')),
      delivery_date: get('delivery_date'),
      notes:         get('notes'),
      status:        'pending',
    }

    const { data: order, error: insertError } = await supabaseAdmin
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (insertError) return res.status(500).json({ error: insertError.message })

    const uploadedFile = files.design_file?.[0]
    if (uploadedFile) {
      try {
        const { fileUrl, fileName } = await uploadToDrive(uploadedFile, order.order_number)
        await supabaseAdmin
          .from('orders')
          .update({ design_file_name: fileName, design_file_url: fileUrl })
          .eq('id', order.id)
        order.design_file_name = fileName
        order.design_file_url  = fileUrl
      } catch (driveErr) {
        console.error('Drive upload failed:', driveErr.message)
      }
    }

    return res.status(201).json(order)
  }

  res.status(405).json({ error: 'Method not allowed' })
}
