import { ArrowUpRight, Check } from 'lucide-react'
import { email, features, services, steps, website } from './content'
import { InquiryForm, ProjectButton, ProjectCta } from './components/ProjectContact'
import type { ReactNode } from 'react'

export function PageHero({ label, title, children, index }: { label: string; title: ReactNode; children: ReactNode; index: string }) {
  return <section className="page-hero section-dark">
    <div className="hero-grid-lines" aria-hidden="true" />
    <div className="page-hero-inner">
      <div className="eyebrow"><span className="eyebrow-line" /> {label}</div>
      <h1>{title}</h1>
      {children}
    </div>
    <span className="page-index" aria-hidden="true">iDR / {index}</span>
  </section>
}

export function About() {
  return <>
    <PageHero label="About iDigitalRise" title={<>An independent studio for <strong>better websites.</strong></>} index="02">
      <p>iDigitalRise brings strategy, design, and development together to help businesses build a stronger presence online.</p>
      <ProjectButton className="button button-orange" />
    </PageHero>
    <section className="inner-section section-light">
      <div className="editorial-split">
        <div><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> Who we are</div><h2>A website should help your business do its job.</h2></div>
        <p>We’re a digital studio that designs and builds websites, online stores, and landing pages. We start by learning how customers find you and what they need from your site. Then we turn those insights into clear content, useful interfaces, and a structure that can grow with your business.</p>
      </div>
      <div className="principles-grid">
        <article><span className="service-category">01 / Purpose</span><h3>Our Mission</h3><p>Help businesses grow online by making their websites easier to find, understand, and use. We define what a site needs to achieve before deciding what it should look like.</p></article>
        <article><span className="service-category">02 / Direction</span><h3>Our Vision</h3><p>Make thoughtful design and dependable web development accessible to businesses at every stage, so the sites they invest in stay useful as their needs change.</p></article>
      </div>
    </section>
    <section className="inner-section section-dark expertise">
      <div className="eyebrow"><span className="eyebrow-line" /> What we do</div><h2>Our Expertise</h2>
      <div className="expertise-grid">{services.map(({ id, category, title, description, icon: Icon }) => <article key={id}><Icon size={22} aria-hidden="true" /><span className="service-category">{category}</span><h3><a href={`/#${id}`}>{title} <ArrowUpRight size={16} aria-hidden="true" /></a></h3><p>{description}</p></article>)}</div>
    </section>
    <section className="inner-section section-light">
      <div className="editorial-split"><div><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> The difference</div><h2>Why Choose iDigitalRise</h2></div><div><p>We explain our decisions, share work in progress, and test the details that matter: mobile layouts, load times, and the steps a customer takes to send an inquiry or buy something.</p><ul className="about-features">{features.map(feature => <li key={feature}><Check size={17} aria-hidden="true" />{feature}</li>)}</ul></div></div>
    </section>
    <section className="inner-section section-light about-process">
      <div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> A clear path forward</div><h2>Our Working Process</h2>
      <ol className="about-steps">{steps.map(([number, title, description]) => <li key={number}><span className="service-category">{number}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
    </section>
    <ProjectCta title="Let's Build Something Great Together" description="Tell us where you want to take your business and what you need from your website." />
  </>
}

export function Contact() {
  return <>
    <PageHero label="Contact iDigitalRise" title={<>Let's Start a <strong>Project</strong></>} index="03">
      <p>Have an idea or a project in mind? Let's discuss how iDigitalRise can help your business grow.</p>
    </PageHero>
    <section className="inner-section section-light contact-layout" aria-labelledby="inquiry-heading">
      <div className="contact-business"><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> Direct contact</div><h2>Talk to the studio.</h2><p>Prefer email? Tell us a little about your business and what you’re looking to build.</p>
        <dl><dt>Business Name</dt><dd>iDigitalRise</dd><dt>Email</dt><dd><a href={`mailto:${email}`}>{email} <ArrowUpRight size={16} aria-hidden="true" /></a></dd><dt>Website</dt><dd><a href={website}>{website} <ArrowUpRight size={16} aria-hidden="true" /></a></dd></dl>
      </div>
      <div className="contact-pane"><h2 id="inquiry-heading">Tell us about your project</h2><p>All fields are required unless marked optional.</p><InquiryForm includeBudget /></div>
    </section>
    <ProjectCta title="Let’s turn your idea into a plan." description="You don’t need a finished brief. A few details are enough to start the conversation." />
  </>
}
