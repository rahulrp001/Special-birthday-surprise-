import { useEffect, useState } from 'react'

/**
 * Small hook that reveals `text` one character at a time.
 * Used for the typing-effect moments across the site.
 */
export function useTypewriter(text, { speed = 40, startDelay = 0 } = {}) {
  const [output, setOutput] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setOutput('')
    setDone(false)
    let i = 0
    let interval

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setOutput(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return { output, done }
}
