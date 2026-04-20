import { useState } from 'react'
import { timeSlots, fullyBookedDates, bookedSlots } from '../data/services'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function ScheduleStep({ booking, onChange, onNext, onBack }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const minMonth = today.getMonth()
  const minYear = today.getFullYear()
  const maxMonth = minMonth + 2
  const maxYear = minYear + (maxMonth > 11 ? 1 : 0)
  const normalizedMaxMonth = maxMonth > 11 ? maxMonth - 12 : maxMonth

  const canGoPrev = viewYear > minYear || (viewYear === minYear && viewMonth > minMonth)
  const canGoNext = viewYear < maxYear || (viewYear === maxYear && viewMonth < normalizedMaxMonth)

  function prevMonth() {
    if (!canGoPrev) return
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (!canGoNext) return
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  const availableSlots = booking.date
    ? timeSlots.filter((s) => !(bookedSlots[booking.date] || []).includes(s.id))
    : []

  return (
    <div className="pt-5 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Pick a date & time</h2>
        <p className="text-sm text-slate-500 mt-1">We operate Monday – Saturday, 9 AM to 5 PM.</p>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-light"
          >
            ‹
          </button>
          <span className="text-sm font-bold text-slate-800">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            disabled={!canGoNext}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-light"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-semibold text-slate-400 py-1 tracking-wide">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = toDateStr(viewYear, viewMonth, day)
            const date = new Date(dateStr)
            const isSunday = date.getDay() === 0
            const isPast = date < today
            const isFull = fullyBookedDates.has(dateStr)
            const disabled = isPast || isSunday || isFull
            const selected = booking.date === dateStr
            const isToday = dateStr === todayStr

            return (
              <button
                key={day}
                onClick={() => !disabled && onChange({ date: dateStr, time: null })}
                disabled={disabled}
                className={`
                  relative h-9 w-full rounded-xl text-sm font-medium transition-all duration-150
                  ${selected ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200' : ''}
                  ${!selected && !disabled ? 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700' : ''}
                  ${disabled ? 'text-slate-300 cursor-not-allowed' : ''}
                `}
              >
                {day}
                {isToday && !selected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 inline-block" />
            <span className="text-[11px] text-slate-500 font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-lg bg-slate-100 inline-block" />
            <span className="text-[11px] text-slate-500 font-medium">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Time slots */}
      {booking.date && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2.5">Available times</p>
          {availableSlots.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm">
              <p className="text-sm text-slate-400">No slots available on this date. Please choose another day.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {availableSlots.map((slot) => {
                const selected = booking.time === slot.label
                return (
                  <button
                    key={slot.id}
                    onClick={() => onChange({ time: slot.label })}
                    className={`py-3.5 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                      selected
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-700 shadow-sm'
                    }`}
                  >
                    {slot.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className="sticky bottom-0 pt-3 pb-1 bg-slate-100 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border border-slate-200 font-semibold text-sm text-slate-600 bg-white hover:bg-slate-50 shadow-sm"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!booking.date || !booking.time}
          className="flex-[2] py-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
