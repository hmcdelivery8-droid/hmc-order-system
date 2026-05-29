import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const DELIVERY_DAYS = { digital: 10, offset: 21, pet: 14 }

const T = {
  en: {
    lang: 'עברית', tabOrder: 'New Order', tabDash: 'Dashboard',
    s1title: 'Order Details', s1sub: 'Enter the customer name and quantity.',
    s2title: 'Product & Specifications', s2sub: 'Select product, size and printing method.',
    s3title: 'Design File & Notes', s3sub: 'Upload the artwork and add any instructions.',
    lblName: 'Customer / Client Name', lblQty: 'Quantity',
    lblProduct: 'Product Type', lblSizePaper: 'Cup Size', lblSizePet: 'Cup Size',
    lblPrint: 'Printing Method', lblShape: 'Cup Shape',
    lblDelivery: 'Estimated Delivery',
    ptDigital: 'Digital Printing', pdDigital: 'Shorter runs · faster turnaround',
    ptOffset: 'Offset Printing', pdOffset: 'High volume · premium quality',
    daysDigital: '10 days from today', daysOffset: '21 days from today',
    shapeU: 'U-Shape', shapeUd: 'Rounded bottom',
    shapeR: 'Regular', shapeRd: 'Standard straight',
    pPaper: 'Paper Cup', pPaperD: 'Printed paper cups for hot & cold drinks',
    pPet: 'PET Plastic Cup', pPetD: 'Clear plastic cups for cold beverages',
    sizePaperPh: 'Select size...', sizePetPh: 'Select size...',
    lblUpload: 'Design File', uploadText: 'Click to upload or drag & drop',
    uploadHint: 'PDF, AI, EPS, PNG, JPG, PSD, CDR — max 50 MB',
    lblNotes: 'Notes & Special Instructions',
    next: 'Continue', back: 'Back', submit: 'Submit Order',
    submitting: 'Submitting…',
    sucTitle: 'Order Submitted!',
    sucSub: 'The order has been saved. The team will review the design file shortly.',
    refId: 'Order ID', refDate: 'Delivery', refProd: 'Product', refQty: 'Quantity',
    newOrder: 'Submit another order', viewOrders: 'View all orders →',
    deliveryPill: 'On time', daysFrom: ' days from today',
    errName: 'Please enter a customer name',
    errProduct: 'Please select a product type',
    errSize: 'Please select a size',
    errPrint: 'Please select a printing method',
    errShape: 'Please select a cup shape',
    step1: 'Details', step2: 'Product', step3: 'Design',
    hint1: 'Step 1 of 3',
  },
  he: {
    lang: 'English', tabOrder: 'הזמנה חדשה', tabDash: 'לוח הזמנות',
    s1title: 'פרטי הזמנה', s1sub: 'הזן שם לקוח וכמות.',
    s2title: 'מוצר ומפרטים', s2sub: 'בחר מוצר, גודל ושיטת הדפסה.',
    s3title: 'קובץ עיצוב והערות', s3sub: 'העלה עיצוב והוסף הוראות.',
    lblName: 'שם לקוח', lblQty: 'כמות',
    lblProduct: 'סוג מוצר', lblSizePaper: 'גודל כוס', lblSizePet: 'גודל כוס',
    lblPrint: 'שיטת הדפסה', lblShape: 'צורת כוס',
    lblDelivery: 'מועד אספקה משוער',
    ptDigital: 'הדפסה דיגיטלית', pdDigital: 'כמויות קטנות · מסירה מהירה',
    ptOffset: 'הדפסת אופסט', pdOffset: 'כמויות גדולות · איכות גבוהה',
    daysDigital: '10 ימים מהיום', daysOffset: '21 ימים מהיום',
    shapeU: 'צורת U', shapeUd: 'תחתית מעוגלת',
    shapeR: 'רגיל', shapeRd: 'פרופיל ישר',
    pPaper: 'כוס נייר', pPaperD: 'כוסות נייר מודפסות',
    pPet: 'כוס PET', pPetD: 'כוסות פלסטיק שקוף',
    sizePaperPh: 'בחר גודל...', sizePetPh: 'בחר גודל...',
    lblUpload: 'קובץ עיצוב', uploadText: 'לחץ להעלאה או גרור ושחרר',
    uploadHint: 'PDF, AI, EPS, PNG, JPG, PSD, CDR — עד 50 מ"ב',
    lblNotes: 'הערות והוראות מיוחדות',
    next: 'המשך', back: 'חזרה', submit: 'שלח הזמנה',
    submitting: 'שולח…',
    sucTitle: 'ההזמנה נשלחה!',
    sucSub: 'ההזמנה נשמרה. הצוות יבדוק את קובץ העיצוב בקרוב.',
    refId: 'מספר הזמנה', refDate: 'אספקה', refProd: 'מוצר', refQty: 'כמות',
    newOrder: 'שלח הזמנה נוספת', viewOrders: '← כל ההזמנות',
    deliveryPill: 'בזמן', daysFrom: ' ימים מהיום',
    errName: 'אנא הזן שם לקוח',
    errProduct: 'אנא בחר סוג מוצר',
    errSize: 'אנא בחר גודל',
    errPrint: 'אנא בחר שיטת הדפסה',
    errShape: 'אנא בחר צורת כוס',
    step1: 'פרטים', step2: 'מוצר', step3: 'עיצוב',
    hint1: 'שלב 1 מתוך 3',
  },
}

const s = {
  topbar: { background: '#111', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 50 },
  logoWrap: { width: 42, height: 42, background: 'white', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  brandText: { color: 'white' },
  brandName: { fontSize: 15, fontWeight: 700 },
  brandSub: { fontSize: 11, color: 'rgba(255,255,255,.5)', marginTop: 1 },
  langBtn: { background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.22)', color: 'white', padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 },
  tabsBar: { background: 'white', borderBottom: '1px solid #e4e3dd', display: 'flex', padding: '0 32px', gap: 4 },
  tab: (active) => ({ padding: '14px 20px', fontSize: 13, fontWeight: 500, color: active ? '#111' : '#9a9990', cursor: 'pointer', borderBottom: active ? '2px solid #111' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', transition: 'all .18s' }),
  view: { padding: 32, maxWidth: 780, margin: '0 auto' },
  stepProgress: { display: 'flex', alignItems: 'flex-start', marginBottom: 28 },
  stepItem: (state) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, position: 'relative' }),
  stepDot: (state) => ({ width: 30, height: 30, borderRadius: '50%', border: state === 'active' ? '2px solid #111' : state === 'done' ? '2px solid #111' : '2px solid #e4e3dd', background: (state === 'active' || state === 'done') ? '#111' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: (state === 'active' || state === 'done') ? 'white' : '#9a9990', zIndex: 1, boxShadow: state === 'active' ? '0 0 0 4px rgba(17,17,17,.1)' : 'none' }),
  stepLabel: (state) => ({ fontSize: 11, color: (state === 'active' || state === 'done') ? '#2c2c2a' : '#9a9990', fontWeight: 500, textAlign: 'center' }),
  card: { background: 'white', borderRadius: 14, border: '1px solid #e4e3dd', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.08)' },
  cardHeader: { padding: '22px 28px 18px', borderBottom: '1px solid #f1f0ec' },
  cardTitle: { fontSize: 17, fontWeight: 700, color: '#111' },
  cardSub: { fontSize: 13, color: '#9a9990', marginTop: 4 },
  cardBody: { padding: '24px 28px' },
  cardNav: { padding: '16px 28px', borderTop: '1px solid #f1f0ec', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 },
  formGroup: (full) => ({ display: 'flex', flexDirection: 'column', gap: 7, gridColumn: full ? '1 / -1' : undefined }),
  fieldLbl: { fontSize: 11, fontWeight: 700, color: '#5a5955', textTransform: 'uppercase', letterSpacing: .5 },
  prodToggle: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  prodCard: (selected) => ({ border: selected ? '2px solid #111' : '1.5px solid #e4e3dd', borderRadius: 10, padding: '18px 16px', cursor: 'pointer', background: selected ? '#f9f9f8' : 'white', textAlign: 'center', transition: 'all .18s', position: 'relative' }),
  prodEmoji: { fontSize: 32, marginBottom: 10, display: 'block' },
  prodName: { fontSize: 14, fontWeight: 700, color: '#2c2c2a' },
  prodDesc: { fontSize: 12, color: '#9a9990', marginTop: 4, lineHeight: 1.4 },
  printRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  printOpt: (selected) => ({ border: selected ? '2px solid #111' : '1.5px solid #e4e3dd', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', background: selected ? '#f9f9f8' : 'white', transition: 'all .18s' }),
  printTitle: { fontSize: 13, fontWeight: 700, color: '#2c2c2a' },
  printDesc: { fontSize: 11, color: '#9a9990', marginTop: 3 },
  printDays: (selected) => ({ marginTop: 10, display: 'inline-block', fontSize: 11, fontWeight: 700, background: selected ? '#111' : '#f1f0ec', color: selected ? 'white' : '#5a5955', padding: '3px 10px', borderRadius: 20 }),
  shapeRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  shapeOpt: (selected) => ({ border: selected ? '2px solid #111' : '1.5px solid #e4e3dd', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', background: selected ? '#f9f9f8' : 'white', textAlign: 'center', transition: 'all .18s' }),
  deliveryBox: { background: '#f9f9f8', border: '1.5px solid #e4e3dd', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, animation: 'fadeUp .3s ease' },
  deliveryIcon: { width: 44, height: 44, background: '#111', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  deliveryDate: { fontSize: 17, fontWeight: 700, color: '#111' },
  deliveryMeta: { fontSize: 12, color: '#9a9990', marginTop: 2 },
  deliveryPill: { marginLeft: 'auto', background: '#eaf3de', color: '#3b6d11', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 },
  qtyRow: { display: 'flex', alignItems: 'center', border: '1.5px solid #e4e3dd', borderRadius: 10, overflow: 'hidden', background: '#f9f9f8', height: 42 },
  qtyBtn: { width: 42, height: '100%', border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: '#5a5955', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', flexShrink: 0 },
  qtyVal: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#111', borderLeft: '1px solid #e4e3dd', borderRight: '1px solid #e4e3dd', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  uploadZone: { border: '2px dashed #e4e3dd', borderRadius: 10, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: '#f9f9f8', position: 'relative' },
  filePreview: { background: '#f9f9f8', border: '1.5px solid #e4e3dd', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 },
  successScreen: { textAlign: 'center', padding: '40px 28px' },
  successCheck: { width: 68, height: 68, background: '#111', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'popIn .35s cubic-bezier(.34,1.56,.64,1)' },
  refBox: { background: '#f9f9f8', border: '1.5px solid #e4e3dd', borderRadius: 10, padding: '16px 20px', maxWidth: 400, margin: '0 auto 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  toast: (err) => ({ position: 'fixed', bottom: 24, right: 24, background: err ? '#a32d2d' : '#111', color: 'white', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,.14)', zIndex: 999, display: 'flex', alignItems: 'center', gap: 8, animation: 'toastIn .3s ease' }),
}

export default function OrderPage() {
  const [lang, setLang]           = useState('en')
  const [step, setStep]           = useState(1)
  const [name, setName]           = useState('')
  const [qty, setQty]             = useState(1000)
  const [product, setProduct]     = useState(null)
  const [paperSize, setPaperSize] = useState('')
  const [petSize, setPetSize]     = useState('')
  const [print, setPrint]         = useState(null)
  const [shape, setShape]         = useState(null)
  const [file, setFile]           = useState(null)
  const [notes, setNotes]         = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [orderResult, setOrderResult] = useState(null)
  const [toast, setToast]         = useState(null)
  const [toastErr, setToastErr]   = useState(false)

  const tr = T[lang]
  const isHe = lang === 'he'

  useEffect(() => {
    document.body.className = isHe ? 'he' : ''
    document.documentElement.dir = isHe ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, isHe])

  function showToast(msg, err = false) {
    setToast(msg); setToastErr(err)
    setTimeout(() => setToast(null), 3000)
  }

  const deliveryDate = () => {
    let days = null
    if (product === 'paper' && print) days = DELIVERY_DAYS[print]
    else if (product === 'pet' && petSize && (petSize !== '10oz' || shape)) days = DELIVERY_DAYS.pet
    if (!days) return null
    const d = new Date(); d.setDate(d.getDate() + days)
    return { date: d, days }
  }

  const deliveryInfo = deliveryDate()

  function goStep(n) {
    if (n === 2) {
      if (!name.trim()) { showToast(tr.errName, true); return }
    }
    if (n === 3) {
      if (!product) { showToast(tr.errProduct, true); return }
      const size = product === 'paper' ? paperSize : petSize
      if (!size) { showToast(tr.errSize, true); return }
      if (product === 'paper' && !print) { showToast(tr.errPrint, true); return }
      if (product === 'pet' && petSize === '10oz' && !shape) { showToast(tr.errShape, true); return }
    }
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const size = product === 'paper' ? paperSize : petSize
      const d = deliveryInfo?.date
      const formData = new FormData()
      formData.append('customer_name', name)
      formData.append('product', product)
      formData.append('size', size)
      if (print)  formData.append('print_method', print)
      if (shape)  formData.append('shape', shape)
      formData.append('quantity', qty)
      formData.append('delivery_date', d ? d.toISOString().split('T')[0] : new Date(Date.now() + 14*86400000).toISOString().split('T')[0])
      if (notes)  formData.append('notes', notes)
      if (file)   formData.append('design_file', file)

      const res = await fetch('/api/orders', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setOrderResult(data)
      setSubmitted(true)
      setStep(4)
    } catch (e) {
      showToast(e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  function resetForm() {
    setName(''); setQty(1000); setProduct(null); setPaperSize(''); setPetSize('')
    setPrint(null); setShape(null); setFile(null); setNotes('')
    setSubmitted(false); setOrderResult(null); setStep(1)
  }

  const stepState = (n) => n < step ? 'done' : n === step ? 'active' : 'idle'

  const fmtDate = (d) => d?.toLocaleDateString(isHe ? 'he-IL' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <Head><title>HMC Order System</title></Head>

      <div style={s.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={s.logoWrap}>
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="42" height="42" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0,200) scale(0.1,-0.1)" fill="#111111" stroke="none">
                <path d="M376 1734 c-14 -13 -16 -47 -16 -221 0 -193 1 -208 22 -244 34 -60 82 -79 206 -79 109 0 116 -4 92 -51 -10 -17 -23 -19 -149 -19 -159 0 -171 -6 -171 -78 l0 -42 173 0 c151 0 176 2 203 19 47 29 64 75 64 174 0 118 1 117 -160 117 -104 0 -132 3 -144 16 -13 13 -16 42 -16 160 l0 144 29 0 29 0 4 -109 c5 -164 -28 -151 370 -151 315 0 329 1 348 20 18 18 20 33 20 190 l0 170 -60 0 -60 0 0 -125 0 -125 -50 0 -49 0 2 125 2 125 -62 0 -63 0 0 -125 0 -125 -45 0 -45 0 0 125 0 125 -60 0 -60 0 0 -125 0 -125 -30 0 -30 0 0 96 c0 90 -9 130 -34 146 -6 4 -64 8 -128 8 -93 0 -120 -3 -132 -16z"/>
                <path d="M1464 1740 c-51 -21 -95 -109 -79 -159 5 -18 2 -21 -19 -21 -24 0 -26 -3 -26 -50 l0 -50 150 0 150 0 0 50 0 50 -63 0 c-90 0 -132 34 -91 74 10 10 33 16 65 16 l49 0 0 50 0 50 -57 -1 c-32 0 -67 -4 -79 -9z"/>
                <path d="M1340 915 l0 -485 60 0 60 0 0 485 0 485 -60 0 -60 0 0 -485z"/>
                <path d="M1520 1200 l0 -200 60 0 60 0 0 200 0 200 -60 0 -60 0 0 -200z"/>
                <path d="M995 1293 c-40 -21 -83 -62 -103 -98 -11 -20 -19 -64 -22 -130 l-5 -100 -131 -5 c-153 -6 -166 -12 -183 -91 -6 -28 -11 -138 -11 -244 l0 -195 65 0 65 0 0 190 c0 177 1 191 20 210 19 19 33 20 288 20 248 0 270 1 285 18 15 16 17 46 17 210 0 242 6 232 -147 232 -78 -1 -116 -5 -138 -17z m160 -218 l0 -110 -82 -3 -83 -3 0 86 c0 83 1 88 30 116 26 27 35 30 82 27 l53 -3 0 -110z"/>
                <path d="M372 937 c-41 -44 -16 -107 42 -107 60 0 88 68 46 110 -27 27 -62 25 -88 -3z"/>
                <path d="M1542 944 c-28 -19 -30 -74 -4 -97 25 -23 68 -21 92 3 27 27 25 56 -5 85 -28 29 -51 31 -83 9z"/>
                <path d="M375 785 c-14 -13 -25 -33 -25 -45 0 -27 43 -70 70 -70 29 0 60 35 60 68 0 33 -8 45 -37 61 -31 16 -41 14 -68 -14z"/>
                <path d="M740 780 c-27 -27 -25 -56 5 -85 28 -29 51 -31 83 -9 26 18 30 74 6 98 -22 22 -70 20 -94 -4z"/>
                <path d="M957 782 c-36 -40 -6 -112 46 -112 30 0 67 35 67 63 0 12 -7 33 -16 45 -19 28 -74 30 -97 4z"/>
                <path d="M1170 780 c-27 -27 -25 -56 5 -85 26 -27 46 -31 76 -14 41 21 44 86 5 111 -21 14 -66 8 -86 -12z"/>
                <path d="M1537 782 c-39 -43 -8 -112 49 -112 25 0 64 43 64 71 0 50 -80 78 -113 41z"/>
                <path d="M360 452 c0 -125 4 -182 12 -190 16 -16 1219 -17 1249 -2 18 10 19 23 19 190 l0 180 -60 0 -60 0 0 -130 0 -130 -120 0 -120 0 0 130 0 130 -60 0 -60 0 0 -131 0 -130 -47 3 -48 3 0 125 -1 125 -62 3 -62 3 0 -131 0 -130 -45 0 -45 0 0 130 0 130 -60 0 -59 0 -3 -127 -3 -128 -122 -3 -123 -3 0 131 0 130 -60 0 -60 0 0 -178z"/>
              </g>
            </svg>
          </div>
          <div style={s.brandText}>
            <div style={s.brandName}>HMC Labeling &amp; Packaging</div>
            <div style={s.brandSub}>Order Management System</div>
          </div>
        </div>
        <button style={s.langBtn} onClick={() => setLang(lang === 'en' ? 'he' : 'en')}>
          🌐 {tr.lang}
        </button>
      </div>

      <div style={s.tabsBar}>
        <div style={s.tab(true)}><span>📋</span> {tr.tabOrder}</div>
        <Link href="/dashboard" style={{ ...s.tab(false), textDecoration: 'none' }}><span>📊</span> {tr.tabDash}</Link>
      </div>

      <div style={s.view}>
        {step < 4 && (
          <div style={s.stepProgress}>
            {[1,2,3].map((n) => {
              const state = stepState(n)
              return (
                <div key={n} style={{ ...s.stepItem(state) }}>
                  {n < 3 && (
                    <div style={{ position: 'absolute', top: 14, left: 'calc(50% + 18px)', right: 'calc(-50% + 18px)', height: 1.5, background: state === 'done' ? '#111' : '#e4e3dd' }} />
                  )}
                  <div style={s.stepDot(state)}>{state === 'done' ? '✓' : n}</div>
                  <div style={s.stepLabel(state)}>{tr[`step${n}`]}</div>
                </div>
              )
            })}
          </div>
        )}

        <div style={s.card}>
          {step === 1 && (
            <>
              <div style={s.cardHeader}>
                <div style={s.cardTitle}>{tr.s1title}</div>
                <div style={s.cardSub}>{tr.s1sub}</div>
              </div>
              <div style={s.cardBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={s.formGroup(true)}>
                    <label style={s.fieldLbl}>{tr.lblName}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ahmad Khalil" />
                  </div>
                  <div style={s.formGroup(true)}>
                    <label style={s.fieldLbl}>{tr.lblQty}</label>
                    <div style={s.qtyRow}>
                      <button style={s.qtyBtn} onClick={() => setQty(q => Math.max(500, q - 500))}>−</button>
                      <div style={s.qtyVal}>{qty.toLocaleString()}</div>
                      <button style={s.qtyBtn} onClick={() => setQty(q => q + 500)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
              <div style={s.cardNav}>
                <span style={{ fontSize: 12, color: '#9a9990' }}>{tr.hint1}</span>
                <button className="btn btn-primary" onClick={() => goStep(2)}>
                  {tr.next} {isHe ? '←' : '→'}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={s.cardHeader}>
                <div style={s.cardTitle}>{tr.s2title}</div>
                <div style={s.cardSub}>{tr.s2sub}</div>
              </div>
              <div style={s.cardBody}>
                <div style={{ marginBottom: 22 }}>
                  <label style={s.fieldLbl}>{tr.lblProduct}</label>
                  <div style={{ ...s.prodToggle, marginTop: 8 }}>
                    {[{key:'paper',emoji:'☕',name:tr.pPaper,desc:tr.pPaperD},{key:'pet',emoji:'🥤',name:tr.pPet,desc:tr.pPetD}].map(p => (
                      <div key={p.key} style={s.prodCard(product===p.key)} onClick={() => { setProduct(p.key); setPaperSize(''); setPetSize(''); setPrint(null); setShape(null) }}>
                        {product === p.key && <div style={{ position:'absolute', top:10, right:10, width:20, height:20, background:'#111', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:12, fontWeight:700 }}>✓</div>}
                        <span style={s.prodEmoji}>{p.emoji}</span>
                        <div style={s.prodName}>{p.name}</div>
                        <div style={s.prodDesc}>{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {product === 'paper' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                    <div>
                      <label style={s.fieldLbl}>{tr.lblSizePaper}</label>
                      <select style={{ marginTop:8 }} value={paperSize} onChange={e => { setPaperSize(e.target.value); setPrint(null) }}>
                        <option value="">{tr.sizePaperPh}</option>
                        <option value="4oz">4 oz</option>
                        <option value="8oz">8 oz</option>
                        <option value="9oz">9 oz</option>
                        <option value="12oz">12 oz</option>
                      </select>
                    </div>
                    {paperSize && (
                      <div style={{ animation:'fadeUp .25s ease' }}>
                        <label style={s.fieldLbl}>{tr.lblPrint}</label>
                        <div style={{ ...s.printRow, marginTop:8 }}>
                          {[{key:'digital',t:tr.ptDigital,d:tr.pdDigital,days:tr.daysDigital},{key:'offset',t:tr.ptOffset,d:tr.pdOffset,days:tr.daysOffset}].map(p => (
                            <div key={p.key} style={s.printOpt(print===p.key)} onClick={() => setPrint(p.key)}>
                              <div style={s.printTitle}>{p.t}</div>
                              <div style={s.printDesc}>{p.d}</div>
                              <div style={s.printDays(print===p.key)}>{p.days}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {product === 'pet' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                    <div>
                      <label style={s.fieldLbl}>{tr.lblSizePet}</label>
                      <select style={{ marginTop:8 }} value={petSize} onChange={e => { setPetSize(e.target.value); setShape(null) }}>
                        <option value="">{tr.sizePetPh}</option>
                        {['10oz','12oz','14oz','16oz','18oz','20oz','22oz'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                      </select>
                    </div>
                    {petSize === '10oz' && (
                      <div style={{ animation:'fadeUp .25s ease' }}>
                        <label style={s.fieldLbl}>{tr.lblShape}</label>
                        <div style={{ ...s.shapeRow, marginTop:8 }}>
                          {[{key:'u-shape',n:tr.shapeU,d:tr.shapeUd,e:'🫙'},{key:'regular',n:tr.shapeR,d:tr.shapeRd,e:'🥤'}].map(sh => (
                            <div key={sh.key} style={s.shapeOpt(shape===sh.key)} onClick={() => setShape(sh.key)}>
                              <div style={{ fontSize:24, marginBottom:6 }}>{sh.e}</div>
                              <div style={{ fontSize:13, fontWeight:700, color:'#2c2c2a' }}>{sh.n}</div>
                              <div style={{ fontSize:11, color:'#9a9990', marginTop:3 }}>{sh.d}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {deliveryInfo && (
                  <div style={{ marginTop:20 }}>
                    <div style={{ borderTop:'1px solid #f1f0ec', margin:'16px 0' }}/>
                    <label style={s.fieldLbl}>{tr.lblDelivery}</label>
                    <div style={{ ...s.deliveryBox, marginTop:8 }}>
                      <div style={s.deliveryIcon}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.8" width="20" height="20"><rect x="2" y="4" width="16" height="14" rx="2"/><path d="M14 2v4M6 2v4M2 9h16"/></svg>
                      </div>
                      <div>
                        <div style={s.deliveryDate}>{fmtDate(deliveryInfo.date)}</div>
                        <div style={s.deliveryMeta}>{deliveryInfo.days}{tr.daysFrom}</div>
                      </div>
                      <div style={{ ...s.deliveryPill, marginLeft: isHe ? 0 : 'auto', marginRight: isHe ? 'auto' : 0 }}>{tr.deliveryPill}</div>
                    </div>
                  </div>
                )}
              </div>
              <div style={s.cardNav}>
                <button className="btn btn-secondary" onClick={() => goStep(1)}>
                  {isHe ? '→' : '←'} {tr.back}
                </button>
                <button className="btn btn-primary" onClick={() => goStep(3)}>
                  {tr.next} {isHe ? '←' : '→'}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div style={s.cardHeader}>
                <div style={s.cardTitle}>{tr.s3title}</div>
                <div style={s.cardSub}>{tr.s3sub}</div>
              </div>
              <div style={s.cardBody}>
                <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                  <div>
                    <label style={s.fieldLbl}>{tr.lblUpload}</label>
                    <div style={{ marginTop:8 }}>
                      {!file ? (
                        <div style={s.uploadZone}>
                          <input type="file" accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.psd,.cdr" onChange={e => setFile(e.target.files[0])} style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%', height:'100%' }} />
                          <div style={{ fontSize:32, marginBottom:10 }}>☁️</div>
                          <div style={{ fontSize:14, fontWeight:500, color:'#5a5955' }}>{tr.uploadText}</div>
                          <div style={{ fontSize:12, color:'#9a9990', marginTop:5 }}>{tr.uploadHint}</div>
                        </div>
                      ) : (
                        <div style={s.filePreview}>
                          <span style={{ fontSize:22 }}>📎</span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</div>
                            <div style={{ fontSize:11, color:'#9a9990', marginTop:2 }}>{(file.size/1024 > 1024 ? (file.size/1048576).toFixed(1)+' MB' : Math.round(file.size/1024)+' KB')}</div>
                          </div>
                          <button onClick={() => setFile(null)} style={{ border:'none', background:'none', cursor:'pointer', color:'#9a9990', fontSize:18, padding:4 }}>✕</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label style={s.fieldLbl}>{tr.lblNotes}</label>
                    <textarea style={{ marginTop:8 }} rows={4} maxLength={400} value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Pantone colors, special finish…" />
                    <div style={{ fontSize:11, color:'#9a9990', textAlign: isHe ? 'left' : 'right', marginTop:4 }}>{notes.length}/400</div>
                  </div>
                </div>
              </div>
              <div style={s.cardNav}>
                <button className="btn btn-secondary" onClick={() => goStep(2)}>
                  {isHe ? '→' : '←'} {tr.back}
                </button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? tr.submitting : tr.submit}
                </button>
              </div>
            </>
          )}

          {step === 4 && orderResult && (
            <div style={s.successScreen}>
              <div style={s.successCheck}>
                <svg viewBox="0 0 28 28" fill="none" stroke="white" strokeWidth="2.5" width="30" height="30"><path d="M5 14l7 7L23 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontSize:22, fontWeight:700, color:'#111', marginBottom:8 }}>{tr.sucTitle}</div>
              <div style={{ fontSize:14, color:'#9a9990', marginBottom:24, lineHeight:1.7, maxWidth:400, margin:'0 auto 24px' }}>{tr.sucSub}</div>
              <div style={s.refBox}>
                <div><label style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'#9a9990', display:'block', marginBottom:4 }}>{tr.refId}</label><div style={{ fontSize:14, fontWeight:700 }}>{orderResult.order_number}</div></div>
                <div><label style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'#9a9990', display:'block', marginBottom:4 }}>{tr.refDate}</label><div style={{ fontSize:14, fontWeight:700 }}>{deliveryInfo?.date.toLocaleDateString(isHe?'he-IL':'en-GB',{day:'numeric',month:'short'})}</div></div>
                <div><label style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'#9a9990', display:'block', marginBottom:4 }}>{tr.refProd}</label><div style={{ fontSize:14, fontWeight:700 }}>{product === 'paper' ? tr.pPaper : tr.pPet} {product==='paper'?paperSize:petSize}</div></div>
                <div><label style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.5, color:'#9a9990', display:'block', marginBottom:4 }}>{tr.refQty}</label><div style={{ fontSize:14, fontWeight:700 }}>{qty.toLocaleString()}</div></div>
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <button className="btn btn-secondary" onClick={resetForm}>{tr.newOrder}</button>
                <Link href="/dashboard" className="btn btn-primary">{tr.viewOrders}</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <div style={s.toast(toastErr)}>{toastErr ? '⚠ ' : '✓ '}{toast}</div>}
    </>
  )
}
