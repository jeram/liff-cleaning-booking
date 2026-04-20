import { useEffect } from 'react'
import { districts } from '../data/services'

export default function DetailsStep({ booking, profile, onChange, onNext, onBack }) {
  useEffect(() => {
    if (profile?.displayName && !booking.name) {
      onChange({ name: profile.displayName })
    }
  }, [profile])

  const nameFromLine = !!profile?.displayName

  function validate() {
    return booking.name.trim() && booking.phone.trim().length >= 9 && booking.address.trim() && booking.district
  }

  return (
    <div className="pt-5 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Your details</h2>
        <p className="text-sm text-slate-500 mt-1">We will confirm via LINE or SMS the evening before.</p>
      </div>

      <div className="space-y-3">

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full name</label>
          {nameFromLine ? (
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
              <img src={profile.pictureUrl} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{profile.displayName}</p>
                <p className="text-[11px] text-indigo-500 font-medium mt-0.5">Pulled from your LINE account</p>
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={booking.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Somchai Jaidee"
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone number</label>
          <input
            type="tel"
            value={booking.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="08x-xxx-xxxx"
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Address</label>
          <textarea
            value={booking.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="House/unit number, building, street name"
            rows={2}
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">District</label>
          <div className="relative">
            <select
              value={booking.district}
              onChange={(e) => onChange({ district: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Select district (Bangkok)</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▾</div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Notes <span className="normal-case font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            value={booking.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Pet at home, access code, specific instructions…"
            rows={2}
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
          />
        </div>
      </div>

      <div className="sticky bottom-0 pt-3 pb-1 bg-slate-100 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border border-slate-200 font-semibold text-sm text-slate-600 bg-white hover:bg-slate-50 shadow-sm"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!validate()}
          className="flex-[2] py-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 active:scale-[0.98]"
        >
          Review booking
        </button>
      </div>
    </div>
  )
}
