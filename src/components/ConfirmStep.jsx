import { useState, useMemo } from 'react'
import { addons } from '../data/services'
import { generateRef, calcTotal, formatPrice, formatDate, buildFlexMessage } from '../utils/booking'

export default function ConfirmStep({ booking, liff, onBack }) {
  const ref = useMemo(() => generateRef(), [])
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const selectedAddons = addons.filter((a) => booking.addons.includes(a.id))
  const total = calcTotal(booking.service, booking.addons)

  async function handleSendToChat() {
    setSending(true)
    const message = buildFlexMessage(booking, ref, total)
    const ok = await liff.sendFlexMessage(message)
    setSending(false)
    setSent(ok)
    setDone(true)
  }

  function handleDone() {
    liff.closeWindow()
    setDone(true)
  }

  if (done && !liff.isInClient) {
    return (
      <div className="pt-16 flex flex-col items-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Booking confirmed</h2>
        <p className="text-sm text-gray-500 mt-2">Reference: <span className="font-mono font-semibold text-gray-700">{ref}</span></p>
        <p className="text-sm text-gray-500 mt-1">We will send a confirmation SMS to {booking.phone}.</p>
      </div>
    )
  }

  return (
    <div className="pt-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Review your booking</h2>
        <p className="text-sm text-gray-500 mt-0.5">Please check everything before confirming.</p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 px-4 py-3">
          <p className="text-xs text-blue-200 font-medium">BOOKING REFERENCE</p>
          <p className="text-white font-mono font-semibold tracking-wide">{ref}</p>
        </div>

        <div className="divide-y divide-gray-100">
          <Row label="Service" value={booking.service.name} />
          {selectedAddons.length > 0 && (
            <Row label="Add-ons" value={selectedAddons.map((a) => a.name).join(', ')} />
          )}
          <Row label="Date" value={formatDate(booking.date)} />
          <Row label="Time" value={booking.time} />
          <Row label="Name" value={booking.name} />
          <Row label="Phone" value={booking.phone} />
          <Row label="Address" value={`${booking.address}, ${booking.district}`} />
          {booking.notes && <Row label="Notes" value={booking.notes} />}
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-lg font-bold text-gray-900">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Payment note */}
      <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-amber-700">
          Payment is collected on the day of service. Our team will confirm via LINE or SMS the evening before.
        </p>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 pt-2 pb-2 bg-gray-50 space-y-2">
        {liff.isInClient && !done && (
          <button
            onClick={handleSendToChat}
            disabled={sending || sent}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Sending…
              </>
            ) : sent ? (
              'Sent to chat ✓'
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send confirmation to LINE chat
              </>
            )}
          </button>
        )}

        <div className="flex gap-3">
          {!done && (
            <button
              onClick={onBack}
              className="flex-1 py-3.5 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDone}
            className="flex-[2] py-3.5 rounded-xl font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            {liff.isInClient ? 'Close' : 'Confirm booking'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start gap-4 px-4 py-2.5">
      <span className="text-xs text-gray-400 w-16 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-900 flex-1">{value}</span>
    </div>
  )
}
