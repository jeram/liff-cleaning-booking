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
    <div className="pt-5 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Choose a service</h2>
        <p className="text-sm text-slate-500 mt-1">All services include supplies and a vetted professional cleaner.</p>
      </div>

      <div className="space-y-3">
        {services.map((svc) => {
          const selected = service?.id === svc.id
          return (
            <button
              key={svc.id}
              onClick={() => onChange({ service: svc, addons: [] })}
              className={`w-full text-left rounded-2xl p-4 transition-all duration-200 relative overflow-hidden ${
                selected
                  ? 'bg-white border-2 border-indigo-500 shadow-lg shadow-indigo-100'
                  : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
              }`}
            >
              {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className="flex items-start justify-between pr-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">{svc.name}</span>
                    {svc.popular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-full tracking-wide">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">{svc.tagline}</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <span className="text-lg font-bold text-slate-900">{formatPrice(svc.price)}</span>
                </div>
              </div>

              {selected && (
                <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                  {svc.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
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
          <p className="text-sm font-semibold text-slate-700 mb-2.5">Add-ons</p>
          <div className="grid grid-cols-2 gap-2">
            {addons.map((addon) => {
              const checked = selectedAddons.includes(addon.id)
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`flex flex-col rounded-xl p-3 text-left transition-all duration-150 ${
                    checked
                      ? 'bg-indigo-50 border-2 border-indigo-400 shadow-sm'
                      : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300'
                  }`}
                >
                  <span className={`text-xs font-medium ${checked ? 'text-indigo-700' : 'text-slate-700'}`}>{addon.name}</span>
                  <span className={`text-xs font-semibold mt-0.5 ${checked ? 'text-indigo-600' : 'text-slate-400'}`}>+{formatPrice(addon.price)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 pt-3 pb-1 bg-slate-100">
        {service && (
          <div className="flex items-center justify-between mb-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100">
            <span className="text-sm text-slate-500 font-medium">Estimated total</span>
            <span className="text-xl font-bold text-slate-900">{formatPrice(total)}</span>
          </div>
        )}
        <button
          onClick={onNext}
          disabled={!service}
          className="w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
