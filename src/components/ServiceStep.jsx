import { services, addons } from '../data/services'
import { calcTotal, formatPrice } from '../utils/booking'

export default function ServiceStep({ booking, onChange, onNext }) {
  const { service, addons: selectedAddons } = booking

  function toggleAddon(id) {
    const next = selectedAddons.includes(id)
      ? selectedAddons.filter((a) => a !== id)
      : [...selectedAddons, id]
    onChange({ addons: next })
  }

  const total = calcTotal(service, selectedAddons)

  return (
    <div className="pt-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Choose a service</h2>
        <p className="text-sm text-gray-500 mt-0.5">All services include a professional cleaner and cleaning supplies.</p>
      </div>

      <div className="space-y-3">
        {services.map((svc) => {
          const selected = service?.id === svc.id
          return (
            <button
              key={svc.id}
              onClick={() => onChange({ service: svc, addons: [] })}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                selected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{svc.name}</span>
                    {svc.popular && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-600 text-white rounded-full">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{svc.tagline}</p>
                </div>
                <div className="text-right ml-4">
                  <span className="font-bold text-gray-900">{formatPrice(svc.price)}</span>
                </div>
              </div>

              {selected && (
                <ul className="mt-3 space-y-1.5 border-t border-blue-200 pt-3">
                  {svc.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                      <svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </button>
          )
        })}
      </div>

      {service && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Add-ons</p>
          <div className="grid grid-cols-2 gap-2">
            {addons.map((addon) => {
              const checked = selectedAddons.includes(addon.id)
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                    checked
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs text-gray-800">{addon.name}</span>
                  <span className="text-xs font-semibold text-gray-600 ml-2">+{formatPrice(addon.price)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 pt-4 pb-2 bg-gray-50">
        {service && (
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-lg font-bold text-gray-900">{formatPrice(total)}</span>
          </div>
        )}
        <button
          onClick={onNext}
          disabled={!service}
          className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
