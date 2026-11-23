import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
const LaptopScene = lazy(() => import('./LaptopScene'))
export type LaptopMotion = { scale: number; x: number; y: number; rx: number; ry: number; cameraZ: number; glow: number; invalidate?: () => void }
const initialMotion = (): LaptopMotion => ({ scale: 0.92, x: 0, y: 0, rx: 0.13, ry: -0.36, cameraZ: 8.5, glow: 0.12 })

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

export default function LaptopExperience() {
  const section = useRef<HTMLElement>(null)
  const motion = useRef<LaptopMotion>(initialMotion())
  const [nearby, setNearby] = useState(false)
  const [supported, setSupported] = useState(true)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])
  const handleError = useCallback(() => setSupported(false), [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    setSupported(Boolean(gl))
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect() }
    }, { rootMargin: '600px' })
    if (section.current) observer.observe(section.current)
    return () => { observer.disconnect(); query.removeEventListener('change', update) }
  }, [])

  useEffect(() => {
    if (!ready || !supported || !section.current) return
    const element = section.current
    const media = gsap.matchMedia()
    media.add({ desktop: '(min-width: 1024px)', tablet: '(width > 640px) and (width < 1024px)', mobile: '(max-width: 640px)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
      const { mobile, tablet, reduce } = context.conditions!
      const target = motion.current
      const words = element.querySelectorAll('.laptop-word')
      const glow = element.querySelector('.laptop-ambient')
      if (reduce) {
        Object.assign(target, { scale: 1.04, y: 0.25, rx: 0.08, ry: 0, cameraZ: mobile ? 8.2 : tablet ? 9.2 : 8.1, glow: 0.3 })
        gsap.set(words, { opacity: 1, y: 0 })
        target.invalidate?.()
        return
      }
      Object.assign(target, initialMotion(), { cameraZ: mobile ? 9 : tablet ? 10.2 : 9 })
      gsap.set(words, { opacity: 0, y: 10 })
      target.invalidate?.()
      const timeline = gsap.timeline({
        onUpdate: () => target.invalidate?.(),
        scrollTrigger: { trigger: element, start: 'top top', end: () => `+=${element.clientHeight * Number(getComputedStyle(element).getPropertyValue('--laptop-travel'))}`, pin: true, pinSpacing: false, scrub: 0.45, anticipatePin: 1, invalidateOnRefresh: true },
      })
      timeline.to(target, { scale: 1.08, ry: 0.02, rx: 0.04, y: 0.32, cameraZ: mobile ? 8.2 : tablet ? 9.2 : 8.1, glow: 0.39, duration: 0.8, ease: 'power1.out' })
        .to(glow, { opacity: 0.5, duration: 0.55 }, '<')
        .to(words, { opacity: 1, y: 0, stagger: 0.045, duration: 0.34, ease: 'power2.out' }, 0.3)
        .to(target, { ry: -0.04, duration: 0.27, ease: 'none' })
    }, element)
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => { cancelAnimationFrame(refresh); media.revert() }
  }, [ready, supported])

  const fallback = !supported
  return (
    <div className={`laptop-shell ${supported && !reduced ? 'laptop-shell-motion' : ''}`}>
    <section ref={section} className={`laptop-experience relative isolate w-full text-white ${fallback ? 'laptop-fallback' : ''} ${reduced ? 'laptop-reduced' : ''}`} aria-label="iDigitalRise digital experiences">
      <div className="laptop-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="laptop-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="laptop-kicker absolute left-0 right-0 text-center">Strategy. Design. Development.</div>
      <div className="laptop-stage absolute inset-0" aria-hidden="true">
        {nearby && supported && (
          <SceneBoundary onError={() => setSupported(false)}>
            <Suspense fallback={null}>
              <LaptopScene motion={motion} onReady={handleReady} onError={handleError} />
            </Suspense>
          </SceneBoundary>
        )}
      </div>
      {fallback && <img className="laptop-static" src="/images/idigitalrise-screen-current.webp" width={1280} height={800} loading="lazy" alt="The iDigitalRise homepage with its orange orbital logo and digital studio headline" />}
      {!ready && supported && <div className="laptop-loading absolute inset-0 flex items-center justify-center" role="status"><span>Preparing the experience<span className="laptop-loading-dot">.</span></span></div>}
      <h2 className="laptop-headline pointer-events-none absolute left-0 right-0 px-5 text-center" aria-label="We turn ideas into digital experiences.">
        <span className="laptop-word inline-block">WE TURN</span>{' '}<span className="laptop-word inline-block">IDEAS INTO</span><br />
        <span className="laptop-word inline-block laptop-highlight">DIGITAL</span>{' '}<span className="laptop-word inline-block laptop-highlight">EXPERIENCES.</span>
      </h2>
      <div className="laptop-scroll absolute bottom-7 left-0 right-0 text-center" aria-hidden="true">{fallback || reduced ? 'Built to make your business rise' : 'Scroll to explore ↓'}</div>
    </section>
    </div>
  )
}
