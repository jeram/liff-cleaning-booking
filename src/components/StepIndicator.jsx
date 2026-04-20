export default function StepIndicator({ steps, current }) {
  return (
    <div className="bg-white border-b border-slate-200 px-5 py-3.5 shadow-sm">
      <div className="flex items-center max-w-lg mx-auto">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                  i < current
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200'
                    : i === current
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-300 scale-110'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {i < current ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${i <= current ? 'text-indigo-600' : 'text-slate-400'}`}>
                {label.toUpperCase()}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1.5 mb-4 rounded-full transition-all duration-300 ${i < current ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
