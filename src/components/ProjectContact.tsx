import { createContext, useContext, useRef, type FormEvent, type KeyboardEvent, type MouseEvent, type ReactNode, useState } from 'react'
import { ArrowUpRight, ChevronDown, X } from 'lucide-react'
import { email, services } from '../content'

const formName = 'project-inquiry'
const formEndpoint = '/__forms.html'
const receiptPath = '/__inquiry-received'
const ProjectContactContext = createContext<(opener: HTMLButtonElement) => void>(() => {})

export function ProjectButton({ className, beforeOpen }: { className: string; beforeOpen?: () => void }) {
  const open = useContext(ProjectContactContext)
  return <button className={className} type="button" aria-haspopup="dialog" onClick={event => { beforeOpen?.(); open(event.currentTarget) }}>Start a Project <ArrowUpRight size={17} aria-hidden="true" /></button>
}

export function ProjectCta({ title, description, id }: { title: string; description: string; id?: string }) {
  return <section id={id} className="cta-section section-dark"><div className="cta-glow" aria-hidden="true" /><div className="eyebrow"><span className="eyebrow-line" /> Your next chapter</div><h2>{title}</h2><p>{description}</p><ProjectButton className="button button-orange" /></section>
}

export function InquiryForm({ includeBudget = false }: { includeBudget?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const sending = useRef(false)
  const formStatus = useRef<HTMLParagraphElement>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending.current) return
    const form = event.currentTarget
    for (const field of Array.from(form.elements)) {
      if ((field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && field.required) {
        field.value = field.value.trim()
      }
    }
    if (!form.reportValidity()) return

    const data = new URLSearchParams()
    new FormData(form).forEach((value, name) => data.append(name, String(value)))
    sending.current = true
    setStatus('sending')
    try {
      const response = await fetch(formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data })
      if (!response.ok || !(await response.text()).includes('data-inquiry-received="true"')) throw new Error('Unable to confirm submission')
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      sending.current = false
      requestAnimationFrame(() => formStatus.current?.focus())
    }
  }

  return (
    <form name={formName} className="contact-form inquiry-form" method="post" action={receiptPath} onSubmit={submit} aria-busy={status === 'sending'}>
      <input type="hidden" name="form-name" value={formName} />
      <div hidden><label>Leave this field blank<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
      <label><span>Full Name</span><input name="name" type="text" autoComplete="name" required maxLength={120} /></label>
      <label><span>Email Address</span><input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      <label><span>Phone Number</span><input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={40} pattern={String.raw`(?=(?:[^0-9]*[0-9]){7})[+0-9\(\).\s\-xX#]+`} title="Enter a phone number with at least 7 digits, such as +1 555 123 4567." /></label>
      <label><span>Company Name <small>(Optional)</small></span><input name="company" type="text" autoComplete="organization" maxLength={160} /></label>
      <label className={includeBudget ? undefined : 'full-field'}><span>Service Required</span><select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map(service => <option key={service.id}>{service.title}</option>)}<option>Not sure yet</option></select><ChevronDown size={16} aria-hidden="true" /></label>
      {includeBudget ? <label><span>Project Budget</span><select name="budget" required defaultValue=""><option value="" disabled>Choose a range</option><option>Under $5,000</option><option>$5,000 – $10,000</option><option>$10,000 – $25,000</option><option>$25,000+</option><option>Not sure yet</option></select><ChevronDown size={16} aria-hidden="true" /></label> : <input type="hidden" name="budget" value="" />}
      <label className="full-field"><span>Project Details</span><textarea name="message" rows={4} required maxLength={4000} placeholder="What are you building, and what would you like it to achieve?" /></label>
      <p className="form-note full-field">Read our <a href="/privacy-policy">Privacy Policy</a> for details on how we use your information.</p>
      <div className="form-actions full-field"><button className="button button-orange" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send Message'} <ArrowUpRight size={17} aria-hidden="true" /></button></div>
      <p className="form-feedback full-field" data-state={status} tabIndex={-1} role="status" ref={formStatus}>{status === 'success' ? 'Thank you. Your project inquiry has been received.' : status === 'error' ? <>We couldn’t confirm your submission. Please try again or email <a href={`mailto:${email}`}>{email}</a>.</> : null}</p>
    </form>
  )
}

export function ProjectContact({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const entry = useRef<HTMLButtonElement | null>(null)
  const previousOverflow = useRef('')
  const pointerOnBackdrop = useRef(false)

  function open(opener: HTMLButtonElement) {
    if (!dialog.current || dialog.current.open) return
    entry.current = opener
    previousOverflow.current = document.documentElement.style.overflow
    dialog.current.showModal()
    document.documentElement.style.overflow = 'hidden'
  }

  function close() {
    if (!dialog.current?.open) return
    dialog.current.close()
    document.documentElement.style.overflow = previousOverflow.current
    entry.current?.focus({ preventScroll: true })
  }

  function onBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget && pointerOnBackdrop.current) close()
    pointerOnBackdrop.current = false
  }

  function keepFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea'))
      .filter(control => !control.matches(':disabled') && control.tabIndex >= 0 && control.getClientRects().length > 0)
    const last = controls[controls.length - 1]
    const next = event.shiftKey ? last : controls[0]
    const edge = event.shiftKey ? controls[0] : last
    if (document.activeElement === edge && next) {
      event.preventDefault()
      next.focus()
    }
  }

  return <ProjectContactContext.Provider value={open}>
    {children}
    <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title" onCancel={event => { event.preventDefault(); close() }} onKeyDown={keepFocus} onClick={onBackdropClick} onPointerDown={event => { pointerOnBackdrop.current = event.target === event.currentTarget }}>
      <div className="project-dialog-panel">
        <div className="project-dialog-heading">
          <button className="dialog-close" type="button" aria-label="Close contact form" onClick={close}><X size={21} aria-hidden="true" /></button>
          <div className="eyebrow"><span className="eyebrow-line" /> Project inquiry</div>
          <h2 id="project-dialog-title">Let’s Start a Project</h2>
          <p>Tell us what you have in mind, or email <a href={`mailto:${email}`}>{email}</a>.</p>
        </div>
        <div className="project-dialog-body"><InquiryForm /></div>
      </div>
    </dialog>
  </ProjectContactContext.Provider>
}
