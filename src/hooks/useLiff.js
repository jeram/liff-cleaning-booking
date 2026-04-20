import { useState, useEffect } from 'react'
import liff from '@line/liff'

export function useLiff() {
  const [profile, setProfile] = useState(null)
  const [isInClient, setIsInClient] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const liffId = import.meta.env.VITE_LIFF_ID

    if (!liffId) {
      setReady(true)
      return
    }

    liff
      .init({ liffId })
      .then(async () => {
        const inClient = liff.isInClient()
        setIsInClient(inClient)

        if (!liff.isLoggedIn()) {
          if (!inClient) liff.login()
          setReady(true)
          return
        }

        try {
          const p = await liff.getProfile()
          setProfile(p)
        } catch {
          // proceed without profile
        }

        setReady(true)
      })
      .catch((err) => {
        setError(err)
        setReady(true)
      })
  }, [])

  async function sendFlexMessage(message) {
    if (!isInClient) return false
    try {
      await liff.sendMessages([message])
      return true
    } catch {
      return false
    }
  }

  function closeWindow() {
    if (isInClient) liff.closeWindow()
  }

  return { profile, isInClient, ready, error, sendFlexMessage, closeWindow }
}
