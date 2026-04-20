import { useState } from 'react'
import { useLiff } from './hooks/useLiff'
import StepIndicator from './components/StepIndicator'
import ServiceStep from './components/ServiceStep'
import ScheduleStep from './components/ScheduleStep'
import DetailsStep from './components/DetailsStep'
import ConfirmStep from './components/ConfirmStep'

const STEPS = ['Service', 'Schedule', 'Details', 'Confirm']

const initialBooking = {
  service: null,
  addons: [],
  date: null,
  time: null,
  name: '',
  phone: '',
  address: '',
  district: '',
  notes: '',
}

export default function App() {
  const liff = useLiff()
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState(initialBooking)

  const update = (data) => setBooking((prev) => ({ ...prev, ...data }))
  const next = () => setStep((s) => s + 1)
  const back = () => setStep((s) => s - 1)

  if (!liff.ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    )
  }

  if (liff.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-base font-medium text-gray-800">Could not connect to LINE</p>
          <p className="text-sm text-gray-400 mt-1">{liff.error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span className="font-semibold text-gray-900">BrightClean</span>
          </div>
          {liff.profile && (
            <div className="flex items-center gap-2">
              <img
                src={liff.profile.pictureUrl}
                alt=""
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs text-gray-500 max-w-[120px] truncate">
                {liff.profile.displayName}
              </span>
            </div>
          )}
        </div>
      </header>

      <StepIndicator steps={STEPS} current={step} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-8">
        {step === 0 && (
          <ServiceStep booking={booking} onChange={update} onNext={next} />
        )}
        {step === 1 && (
          <ScheduleStep booking={booking} onChange={update} onNext={next} onBack={back} />
        )}
        {step === 2 && (
          <DetailsStep booking={booking} profile={liff.profile} onChange={update} onNext={next} onBack={back} />
        )}
        {step === 3 && (
          <ConfirmStep booking={booking} liff={liff} onBack={back} />
        )}
      </main>
    </div>
  )
}
