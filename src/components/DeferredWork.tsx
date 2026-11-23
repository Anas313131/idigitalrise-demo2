import { useEffect, useRef, useState, type ReactNode } from 'react'

export function DeferredWork({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null)
  const [nearby, setNearby] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearby(true)
        observer.disconnect()
      }
    }, { rootMargin: '450px' })
    if (host.current) observer.observe(host.current)
    return () => observer.disconnect()
  }, [])

  return <div className="h-full" ref={host}>{nearby && children}</div>
}
