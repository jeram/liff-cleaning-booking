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
        <h2 className="text-lg font-semibold text-gray-900">Your details</h2>
        <p className="text-sm text-gray-500 mt-0.5">We will contact you 1 hour before arrival to confirm.</p>
      </div>

      <div className="space-y-4">

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full name</label>
          {nameFromLine ? (
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
              <img src={profile.pictureUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">{profile.displayName}</p>
                <p className="text-[11px] text-blue-600">From your LINE account</p>
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={booking.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Somchai Jaidee"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone number</label>
          <input
            type="tel"
            value={booking.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="08x-xxx-xxxx"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Address</label>
          <textarea
            value={booking.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="House/unit number, building, street name"
            rows={2}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">District</label>
          <select
            value={booking.district}
            onChange={(e) => onChange({ district: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="">Select district (Bangkok)</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Notes <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            value={booking.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Pet at home, access code, specific instructions…"
            rows={2}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div className="sticky bottom-0 pt-2 pb-2 bg-gray-50 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!validate()}
          className="flex-[2] py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700"
        >
          Review booking
        </button>
      </div>
    </div>
  )
}
