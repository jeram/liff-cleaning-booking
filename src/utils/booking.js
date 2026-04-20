import { addons } from '../data/services'

export function generateRef() {
  const d = new Date()
  const date = d.toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(Math.floor(1000 + Math.random() * 9000))
  return `CLN-${date}-${seq}`
}

export function calcTotal(service, selectedAddons) {
  const base = service?.price ?? 0
  const extra = selectedAddons.reduce((sum, id) => {
    return sum + (addons.find((a) => a.id === id)?.price ?? 0)
  }, 0)
  return base + extra
}

export function formatPrice(amount) {
  return `฿${amount.toLocaleString()}`
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function buildFlexMessage(booking, ref, total) {
  return {
    type: 'flex',
    altText: `BrightClean booking confirmed — ${ref}`,
    contents: {
      type: 'bubble',
      size: 'kilo',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#2563EB',
        paddingAll: 'lg',
        contents: [
          {
            type: 'text',
            text: 'Booking Confirmed',
            color: '#ffffff',
            size: 'lg',
            weight: 'bold',
          },
          {
            type: 'text',
            text: ref,
            color: '#93C5FD',
            size: 'xs',
            margin: 'xs',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        paddingAll: 'lg',
        contents: [
          row('Service', booking.service.name),
          row('Date', formatDate(booking.date)),
          row('Time', booking.time),
          row('Address', `${booking.address}, ${booking.district}`),
          { type: 'separator', margin: 'md' },
          {
            type: 'box',
            layout: 'horizontal',
            margin: 'md',
            contents: [
              { type: 'text', text: 'Total', color: '#111827', size: 'sm', weight: 'bold', flex: 2 },
              { type: 'text', text: formatPrice(total), color: '#2563EB', size: 'sm', weight: 'bold', flex: 3, align: 'end' },
            ],
          },
        ],
      },
    },
  }
}

function row(label, value) {
  return {
    type: 'box',
    layout: 'horizontal',
    contents: [
      { type: 'text', text: label, color: '#6B7280', size: 'xs', flex: 2 },
      { type: 'text', text: value || '—', color: '#111827', size: 'xs', flex: 3, align: 'end', wrap: true },
    ],
  }
}
