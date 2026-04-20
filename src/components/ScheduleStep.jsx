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

  const canGoPrev =
    viewYear > minYear || (viewYear === minYear && viewMonth > minMonth)
  const canGoNext =
    viewYear < maxYear || (viewYear === maxYear && viewMonth < normalizedMaxMonth)

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

  function selectDate(dateStr) {
    onChange({ date: dateStr, time: null })
  }

  const availableSlots = booking.date
    ? timeSlots.filter((s) => !(bookedSlots[booking.date] || []).includes(s.id))
    : []

  return (
    <div className="pt-5 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Pick a date & time</h2>
        <p className="text-sm text-gray-500 mt-0.5">We operate Monday through Saturday, 9 AM – 5 PM.</p>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          <span className="text-sm font-semibold text-gray-900">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            disabled={!canGoNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-medium text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = toDateStr(viewYear, viewMonth, day)
            const date = new Date(dateStr)
            const isSunday = date.getDay() === 0
            const isPast = date < today
            const isFull = fullyBookedDates.has(dateStr)
            const disabled = isPast || isSunday || isFull
            const selected = booking.date === dateStr
            const isToday = dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

            return (
              <button
                key={day}
                onClick={() => !disabled && selectDate(dateStr)}
                disabled={disabled}
                className={`
                  relative h-9 w-full rounded-lg text-sm font-medium transition-all
                  ${selected ? 'bg-blue-600 text-white' : ''}
                  ${!selected && !disabled ? 'hover:bg-blue-50 text-gray-800' : ''}
                  ${disabled ? 'text-gray-300 cursor-not-allowed' : ''}
                  ${isFull && !isPast ? 'line-through text-gray-300' : ''}
                `}
              >
                {day}
                {isToday && !selected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
            <span className="text-[11px] text-gray-500">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-gray-100 inline-block" />
            <span className="text-[11px] text-gray-500">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Time slots */}
      {booking.date && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Available times</p>
          {availableSlots.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No slots available on this date. Please choose another day.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot) => {
                const selected = booking.time === slot.label
                return (
                  <button
                    key={slot.id}
                    onClick={() => onChange({ time: slot.label })}
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-blue-300'
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

      <div className="sticky bottom-0 pt-2 pb-2 bg-gray-50 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!booking.date || !booking.time}
          className="flex-[2] py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
