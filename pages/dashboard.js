import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const T = {
  en: {
    title: 'Order Dashboard',
    newOrder: '+ New Order',
    totalOrders: 'Total Orders',
    pending: 'Pending',
    inProduction: 'In Production',
    delivered: 'Delivered',
    searchPlaceholder: 'Search by order # or customer…',
    filterAll: 'All statuses',
    filterPending: 'Pending',
    filterReview: 'Review',
    filterProduction: 'Production',
    filterDelivered: 'Delivered',
    colOrder: 'Order #',
    colCustomer: 'Customer',
    colProduct: 'Product',
    colQty: 'Qty',
    colDelivery: 'Delivery',
    colStatus: 'Status',
    colFile: 'File',
    noOrders: 'No orders found.',
    modalTitle: 'Order Details',
    close: 'Close',
    updateStatus: 'Update Status',
    save: 'Save',
    statusPending: 'Pending',
    statusReview: 'Review',
    statusProduction: 'Production',
    statusDelivered: 'Delivered',
    paper: 'Paper Cup',
    pet: 'PET Plastic Cup',
    digital: 'Digital',
    offset: 'Offset',
    notes: 'Notes',
    designFile: 'Design File',
    viewFile: 'View File',
    noFile: '—',
    orderedOn: 'Ordered on',
    reload: 'Reload',
    shape: 'Shape',
    size: 'Size',
    print: 'Print',
    customer: 'Customer',
    qty: 'Quantity',
    delivery: 'Delivery Date',
  },
  he: {
    title: 'לוח הזמנות',
    newOrder: '+ הזמנה חדשה',
    totalOrders: 'סה"כ הזמנות',
    pending: 'ממתין',
    inProduction: 'בייצור',
    delivered: 'נמסר',
    searchPlaceholder: 'חיפוש לפי מספר הזמנה או לקוח…',
    filterAll: 'כל הסטטוסים',
    filterPending: 'ממתין',
    filterReview: 'בבדיקה',
    filterProduction: 'בייצור',
    filterDelivered: 'נמסר',
    colOrder: 'מספר הזמנה',
    colCustomer: 'לקוח',
    colProduct: 'מוצר',
    colQty: 'כמות',
    colDelivery: 'תאריך אספקה',
    colStatus: 'סטטוס',
    colFile: 'קובץ',
    noOrders: 'לא נמצאו הזמנות.',
    modalTitle: 'פרטי הזמנה',
    close: 'סגור',
    updateStatus: 'עדכון סטטוס',
    save: 'שמור',
    statusPending: 'ממתין',
    statusReview: 'בבדיקה',
    statusProduction: 'בייצור',
    statusDelivered: 'נמסר',
    paper: 'כוס נייר',
    pet: 'כוס PET',
    digital: 'דיגיטל',
    offset: 'אופסט',
    notes: 'הערות',
    designFile: 'קובץ עיצוב',
    viewFile: 'צפה בקובץ',
    noFile: '—',
    orderedOn: 'הוזמן ב',
    reload: 'רענן',
    shape: 'צורה',
    size: 'גודל',
    print: 'הדפסה',
    customer: 'לקוח',
    qty: 'כמות',
    delivery: 'תאריך אספקה',
  },
}

function Badge({ status, t }) {
  const map = {
    pending:    ['b-pending',    t.statusPending],
    review:     ['b-review',     t.statusReview],
    production: ['b-production', t.statusProduction],
    delivered:  ['b-delivered',  t.statusDelivered],
  }
  const [cls, label] = map[status] ?? ['b-pending', status]
  return <span className={`badge ${cls}`}>{label}</span>
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: 'white', borderRadius: 'var(--r-lg)', padding: '20px 24px',
      boxShadow: 'var(--sh-sm)', display: 'flex', flexDirection: 'column',
      gap: 6, borderTop: `3px solid ${accent}`,
    }}>
      <span style={{ fontSize: 13, color: 'var(--g400)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--black)', lineHeight: 1 }}>{value}</span>
    </div>
  )
}

function BarChart({ orders }) {
  const products = {}
  orders.forEach(o => {
    const key = o.product === 'paper' ? 'Paper Cup' : 'PET Cup'
    products[key] = (products[key] || 0) + 1
  })
  const entries = Object.entries(products)
  const max = Math.max(...entries.map(e => e[1]), 1)
  const colors = { 'Paper Cup': '#185fa5', 'PET Cup': '#3b6d11' }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
      {entries.map(([name, count]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 80, fontSize: 12, color: 'var(--g600)', flexShrink: 0, textAlign: 'right' }}>{name}</span>
          <div style={{ flex: 1, background: 'var(--g100)', borderRadius: 4, height: 20, overflow: 'hidden' }}>
            <div style={{ width: `${(count / max) * 100}%`, height: '100%', background: colors[name] || 'var(--black)', borderRadius: 4, transition: 'width .4s ease' }} />
          </div>
          <span style={{ width: 24, fontSize: 12, fontWeight: 700, color: 'var(--g800)' }}>{count}</span>
        </div>
      ))}
      {entries.length === 0 && <span style={{ fontSize: 13, color: 'var(--g400)' }}>No data</span>}
    </div>
  )
}

function OrderModal({ order, lang, t, onClose, onStatusChange }) {
  const [status, setStatus] = useState(order.status)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (status === order.status) { onClose(); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        const updated = await res.json()
        onStatusChange(updated)
        onClose()
      }
    } finally {
      setSaving(false)
    }
  }

  const row = (label, value) => value ? (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--g100)' }}>
      <span style={{ width: 120, flexShrink: 0, fontSize: 13, color: 'var(--g400)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--g800)' }}>{value}</span>
    </div>
  ) : null

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 'var(--r-xl)', width: '100%', maxWidth: 500, boxShadow: 'var(--sh-lg)', overflow: 'hidden', animation: 'modalIn .22s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--g100)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--g400)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>{t.modalTitle}</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>{order.order_number}</div>
          </div>
          <Badge status={order.status} t={t} />
        </div>
        <div style={{ padding: '4px 24px 0' }}>
          {row(t.customer, order.customer_name)}
          {row(t.product, order.product === 'paper' ? t.paper : t.pet)}
          {row(t.size, order.size)}
          {order.print_method && row(t.print, order.print_method === 'digital' ? t.digital : t.offset)}
          {order.shape && row(t.shape, order.shape)}
          {row(t.qty, order.quantity?.toLocaleString())}
          {row(t.delivery, order.delivery_date)}
          {row(t.orderedOn, new Date(order.created_at).toLocaleDateString())}
          {order.notes && row(t.notes, order.notes)}
          {order.design_file_url && (
            <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--g100)' }}>
              <span style={{ width: 120, flexShrink: 0, fontSize: 13, color: 'var(--g400)', fontWeight: 500 }}>{t.designFile}</span>
              <a href={order.design_file_url} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: 'var(--blue-fg)', textDecoration: 'underline' }}>
                {order.design_file_name || t.viewFile}
              </a>
            </div>
          )}
        </div>
        <div style={{ padding: '16px 24px', background: 'var(--g50)', borderTop: '1px solid var(--g100)' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--g600)', display: 'block', marginBottom: 6 }}>{t.updateStatus}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ flex: 1 }}>
              <option value="pending">{t.statusPending}</option>
              <option value="review">{t.statusReview}</option>
              <option value="production">{t.statusProduction}</option>
              <option value="delivered">{t.statusDelivered}</option>
            </select>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '…' : t.save}</button>
            <button className="btn btn-secondary" onClick={onClose}>{t.close}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [lang, setLang] = useState('en')
  const t = T[lang]
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])
  useEffect(() => { document.body.classList.toggle('he', lang === 'he') }, [lang])

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    production: orders.filter(o => o.status === 'production').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || o.status === filterStatus
    return matchSearch && matchStatus
  })

  function handleStatusChange(updated) {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
  }

  return (
    <>
      <Head>
        <title>{t.title} — HMC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        .dash-table { width:100%; border-collapse:collapse; }
        .dash-table th { text-align:left; font-size:11px; font-weight:700; color:var(--g400); letter-spacing:.06em; text-transform:uppercase; padding:10px 14px; border-bottom:1.5px solid var(--g200); white-space:nowrap; }
        body.he .dash-table th { text-align:right; }
        .dash-table td { padding:12px 14px; font-size:14px; border-bottom:1px solid var(--g100); vertical-align:middle; }
        .dash-table tr:last-child td { border-bottom:none; }
        .dash-table tr:hover td { background:var(--g50); cursor:pointer; }
        .dash-table .file-link { color:var(--blue-fg); text-decoration:underline; font-size:12px; }
      `}</style>

      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', borderBottom: '1px solid var(--g200)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="80" fill="#111111"/>
            <path d="M96 96H192V208H256V96H320V416H256V272H192V416H96V96Z" fill="white"/>
            <path d="M352 96H416V160H448V224H416V288H448V352H416V416H352V352H320V288H352V224H320V160H352V96Z" fill="white"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--black)' }}>HMC Orders</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => setLang(l => l === 'en' ? 'he' : 'en')}>
            {lang === 'en' ? 'עברית' : 'English'}
          </button>
          <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }} onClick={fetchOrders}>{t.reload}</button>
          <Link href="/"><span className="btn btn-primary" style={{ padding: '7px 18px', fontSize: 13 }}>{t.newOrder}</span></Link>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
          <StatCard label={t.totalOrders}  value={stats.total}      accent="var(--black)" />
          <StatCard label={t.pending}      value={stats.pending}    accent="var(--amber-fg)" />
          <StatCard label={t.inProduction} value={stats.production} accent="var(--blue-fg)" />
          <StatCard label={t.delivered}    value={stats.delivered}  accent="var(--green-fg)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input type="text" placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 160 }}>
              <option value="">{t.filterAll}</option>
              <option value="pending">{t.filterPending}</option>
              <option value="review">{t.filterReview}</option>
              <option value="production">{t.filterProduction}</option>
              <option value="delivered">{t.filterDelivered}</option>
            </select>
          </div>
          {orders.length > 0 && (
            <div style={{ background: 'white', borderRadius: 'var(--r-lg)', padding: '16px 18px', boxShadow: 'var(--sh-sm)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--g400)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>Orders by Product</div>
              <BarChart orders={orders} />
            </div>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-sm)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--g400)', fontSize: 14 }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--g400)', fontSize: 14 }}>{t.noOrders}</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>{t.colOrder}</th><th>{t.colCustomer}</th><th>{t.colProduct}</th>
                    <th>{t.colQty}</th><th>{t.colDelivery}</th><th>{t.colStatus}</th><th>{t.colFile}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order.id} onClick={() => setSelected(order)}>
                      <td style={{ fontWeight: 600 }}>{order.order_number}</td>
                      <td>{order.customer_name}</td>
                      <td style={{ color: 'var(--g600)', fontSize: 13 }}>
                        {order.product === 'paper' ? t.paper : t.pet}<br/>
                        <span style={{ color: 'var(--g400)', fontSize: 11 }}>{order.size}{order.print_method ? ` · ${order.print_method === 'digital' ? t.digital : t.offset}` : ''}</span>
                      </td>
                      <td>{order.quantity?.toLocaleString()}</td>
                      <td style={{ color: 'var(--g600)', fontSize: 13, whiteSpace: 'nowrap' }}>{order.delivery_date}</td>
                      <td><Badge status={order.status} t={t} /></td>
                      <td onClick={e => e.stopPropagation()}>
                        {order.design_file_url
                          ? <a href={order.design_file_url} target="_blank" rel="noreferrer" className="file-link">{t.viewFile}</a>
                          : <span style={{ color: 'var(--g300)' }}>{t.noFile}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--g400)', textAlign: 'right' }}>
            {filtered.length} order{filtered.length !== 1 ? 's' : ''}
            {filterStatus || search ? ` (filtered from ${orders.length})` : ''}
          </div>
        )}
      </main>

      {selected && (
        <OrderModal
          order={selected} lang={lang} t={t}
          onClose={() => setSelected(null)}
          onStatusChange={updated => { handleStatusChange(updated); setSelected(updated) }}
        />
      )}
    </>
  )
}
