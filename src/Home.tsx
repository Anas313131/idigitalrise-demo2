import { lazy, Suspense } from 'react'
import LaptopExperience from '@/components/LaptopExperience'
import { services, steps, features } from './content'
import { ProjectButton, ProjectCta } from './components/ProjectContact'
import { DeferredWork } from './components/DeferredWork'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
} from 'lucide-react'

const FlexCarousel = lazy(() => import('@/components/FlexCarousel.jsx'))

type Project = {
  name: string
  type: string
  description: string
  className: string
  mark: string
}

const projects: Project[] = [
  { name: 'LuxeTime', type: 'E-commerce / 2024', description: 'A quiet luxury storefront for a new generation of watch collectors.', className: 'project-luxe', mark: 'LT' },
  { name: 'Forma Studio', type: 'Digital Identity / 2024', description: 'A tactile digital home for architecture, interiors, and considered spaces.', className: 'project-forma', mark: 'FS' },
  { name: 'ApexFit', type: 'Brand Platform / 2023', description: 'A high-energy training platform built to keep momentum moving.', className: 'project-apex', mark: 'AF' },
  { name: 'NovaTech', type: 'SaaS / 2023', description: 'Turning complex intelligence into a clear, confident product story.', className: 'project-nova', mark: 'NT' },
]

const carouselItems = projects.map((project) => ({
  src: `/images/${project.className}.svg`,
  alt: `${project.name} — ${project.description}`,
  title: project.name,
  subtitle: project.type,
}))

export default function Home() {
  return (
    <>
        <section className="hero section-dark" id="home">
          <div className="hero-grid-lines" />
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> Independent digital studio</div>
            <h1>We build digital experiences that make <em>businesses</em> <span>rise.</span></h1>
            <p className="hero-description">We design and build websites that explain what you do, earn trust, and make it easier for customers to take the next step.</p>
            <div className="hero-actions">
              <a className="button button-orange" href="#work">Explore our work <ArrowDownRight size={17} /></a>
              <ProjectButton className="button button-ghost" />
            </div>
            <div className="hero-proof"><span>Design</span><i /> <span>Development</span><i /> <span>Performance</span></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-large" />
            <div className="orbit orbit-small" />
            <div className="art-panel art-panel-top"><span>iDR / 001</span><span className="status-dot" /></div>
            <div className="rise-disc"><span>R</span><div className="disc-ring" /></div>
            <div className="art-panel art-panel-bottom"><span>Digital<br />advantage</span><ArrowUpRight size={20} /></div>
            <div className="art-cross">+</div>
            <div className="art-label">Scroll to explore <ArrowDownRight size={14} /></div>
          </div>
        </section>

        <LaptopExperience />

        <section className="marquee-strip" aria-label="Capabilities">
          <div className="marquee-track"><span>Strategy</span><b aria-hidden="true">✳</b><span>Design</span><b aria-hidden="true">✳</b><span>Development</span><b aria-hidden="true">✳</b><span>Performance</span></div>
        </section>

        <section className="services section-light" id="services">
          <div className="section-intro split-intro">
            <div><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> What we do</div><h2>Design, development, <em>and growth.</em></h2></div>
            <p>Launch a new site, improve an existing one, or give a campaign a page of its own.</p>
          </div>
          <div className="service-grid">
            {services.map(({ id, number, title, description, category, icon: Icon }) => (
              <article className="service-card" id={id} key={id}>
                <div className="service-top"><span>{number}</span><Icon size={22} strokeWidth={1.5} /></div>
                <div><div className="service-category">{category}</div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="work section-dark" id="work">
          <div className="section-intro split-intro work-intro">
            <div><div className="eyebrow"><span className="eyebrow-line" /> Selected work</div><h2>Digital experiences.<br /><em>Real impact.</em></h2></div>
            <a className="text-link" href="#projects">View all projects <ArrowUpRight size={17} /></a>
          </div>
          <div className="work-carousel">
            <DeferredWork><Suspense fallback={null}>
            <FlexCarousel
              items={carouselItems}
              preset="liquid"
              intro="none"
              cardHeight={0.5}
              gap={12}
              squeeze={0.2}
              focusOnClick
              captions
              fit="natural"
              radius={0}
              lensWidth={0.74}
              lensHeight={1.18}
              tilt={24}
              roundness={1}
              bend={0.14}
              reach={0.38}
              curl="twist"
              dispersion={0.12}
              liquid={0}
              followCursor={false}
              autoplay={false}
            />
            </Suspense></DeferredWork>
          </div>
          <div className="project-grid" id="projects">
            {projects.map(({ name, type, description, className, mark }, index) => (
              <article className={`project-card ${className}`} key={name}>
                <div className="project-visual" aria-hidden="true"><span className="project-number">0{index + 1}</span><span className="project-mark">{mark}</span><div className="project-shape" /><div className="project-ui"><span /><span /><span /></div></div>
                <div className="project-meta"><div><h3>{name}</h3><span>{type}</span></div><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="why section-light" id="about">
          <div className="why-visual"><div className="why-ring ring-one" /><div className="why-ring ring-two" /><div className="why-core">i<span>DR</span></div><div className="why-caption">Made for<br /><em>forward</em> thinkers.</div></div>
          <div className="why-copy"><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> The difference</div><h2>Good websites look good. <em>Great websites help customers act.</em></h2><p>We pair design with clear navigation, fast pages, and a simple path from first visit to inquiry or purchase.</p><div className="feature-list">{features.map((feature) => <div className="feature" key={feature}><span><Check size={14} /></span>{feature}</div>)}</div></div>
        </section>

        <section className="process section-light">
          <div className="section-intro split-intro"><div><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> Our approach</div><h2>Simple process.<br /><em>Serious results.</em></h2></div><p>No black boxes. No unnecessary layers. Just a clear, collaborative path from a good idea to a better business.</p></div>
          <div className="process-line">{steps.map(([number, title, description]) => <div className="step" key={number}><span className="step-number">{number}</span><div className="step-marker" /><h3>{title}</h3><p>{description}</p></div>)}</div>
        </section>

        <section className="manifesto section-dark"><div className="manifesto-grid" /><div className="manifesto-copy"><div className="eyebrow"><span className="eyebrow-line" /> A little about us</div><h2>Strategy, design, and development <em>under one roof.</em></h2><p>iDigitalRise is an independent digital studio. We take projects from the first conversation through design, development, and launch.</p><a className="text-link" href="/about">More about iDigitalRise <ArrowUpRight size={17} /></a></div><div className="manifesto-symbol" aria-hidden="true"><span>i</span><strong>DR</strong><small>EST. 2024</small></div></section>

        <section className="testimonials section-light"><div className="section-intro testimonial-heading"><div><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> Kind words</div><h2>Good company,<br /><em>great work.</em></h2></div><div className="quote-symbol">“</div></div><div className="testimonial-grid"><blockquote><p>“They didn't just redesign our website. They helped us understand what our business could become.”</p><footer><strong>Elena Marquez</strong><span>Founder, Forma Studio</span></footer></blockquote><blockquote><p>“The rare team that can make something feel beautiful and make it work harder at the same time.”</p><footer><strong>Marcus Chen</strong><span>Co-founder, NovaTech</span></footer></blockquote><blockquote><p>“From the first conversation, they felt like a true extension of our team. The result speaks for itself.”</p><footer><strong>Amelia Stone</strong><span>Director, LuxeTime</span></footer></blockquote></div></section>

        <ProjectCta id="contact" title="Ready to make your business rise?" description="Tell us what you’re building and what you need your website to do." />
    </>
  )
}
