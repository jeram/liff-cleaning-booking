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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-[3px] border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading…</p>
        </div>
      </div>
    )
  }

  if (liff.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <p className="text-base font-semibold text-slate-800">Could not connect to LINE</p>
          <p className="text-sm text-slate-400 mt-1">{liff.error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 pt-5 pb-4 sticky top-0 z-20">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <div>
              <p className="text-white font-semibold text-base leading-none">BrightClean</p>
              <p className="text-indigo-200 text-[11px] mt-0.5">Professional cleaning service</p>
            </div>
          </div>
          {liff.profile && (
            <div className="flex items-center gap-2 bg-white/15 rounded-full pl-1 pr-3 py-1">
              <img
                src={liff.profile.pictureUrl}
                alt=""
                className="w-6 h-6 rounded-full object-cover ring-2 ring-white/40"
              />
              <span className="text-xs text-white font-medium max-w-[90px] truncate">
                {liff.profile.displayName}
              </span>
            </div>
          )}
        </div>
      </header>

      <StepIndicator steps={STEPS} current={step} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-10">
        {step === 0 && <ServiceStep booking={booking} onChange={update} onNext={next} />}
        {step === 1 && <ScheduleStep booking={booking} onChange={update} onNext={next} onBack={back} />}
        {step === 2 && <DetailsStep booking={booking} profile={liff.profile} onChange={update} onNext={next} onBack={back} />}
        {step === 3 && <ConfirmStep booking={booking} liff={liff} onBack={back} />}
      </main>
    </div>
  )
}
