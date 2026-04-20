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
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-5 shadow-xl shadow-emerald-200">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Booking confirmed</h2>
        <p className="text-sm text-slate-500 mt-2">
          Reference: <span className="font-mono font-semibold text-slate-700">{ref}</span>
        </p>
        <p className="text-sm text-slate-400 mt-1">A confirmation will be sent to {booking.phone}.</p>
      </div>
    )
  }

  return (
    <div className="pt-5 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Review your booking</h2>
        <p className="text-sm text-slate-500 mt-1">Check everything before confirming.</p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4">
          <p className="text-indigo-200 text-[11px] font-semibold tracking-widest uppercase">Booking Reference</p>
          <p className="text-white font-mono font-bold tracking-wider text-lg mt-0.5">{ref}</p>
        </div>

        <div className="divide-y divide-slate-50">
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

        <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100">
          <span className="text-sm text-slate-500 font-medium">Total due on the day</span>
          <span className="text-xl font-bold text-slate-900">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Info note */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-amber-700 leading-relaxed">
          Payment is collected on the day of service. Our team will confirm via LINE or SMS the evening before your appointment.
        </p>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 pt-3 pb-1 bg-slate-100 space-y-2.5">
        {liff.isInClient && !done && (
          <button
            onClick={handleSendToChat}
            disabled={sending || sent}
            className="w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Sending…
              </>
            ) : sent ? (
              'Sent to LINE chat ✓'
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
              className="flex-1 py-4 rounded-2xl border border-slate-200 font-semibold text-sm text-slate-600 bg-white hover:bg-slate-50 shadow-sm"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDone}
            className="flex-[2] py-4 rounded-2xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all duration-200"
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
    <div className="flex items-start gap-4 px-5 py-3">
      <span className="text-xs text-slate-400 font-medium w-16 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-800 font-medium flex-1">{value}</span>
    </div>
  )
}
