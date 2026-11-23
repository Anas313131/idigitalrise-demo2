import { Code2, PenTool, Search, ShoppingBag, Sparkles, Target } from 'lucide-react'

export const email = 'grow@idigitalrise.com'
export const website = 'https://idigitalrise.com'

export const services = [
  { id: 'website-development', number: '01', category: 'Build & commerce', title: 'Website Development', description: 'Build a responsive website that loads quickly and makes it easy for visitors to find what they need.', icon: Code2 },
  { id: 'ecommerce-development', number: '02', category: 'Build & commerce', title: 'E-Commerce Development', description: 'Build an online store where customers can browse, compare products, and check out with confidence.', icon: ShoppingBag },
  { id: 'ui-ux-design', number: '03', category: 'Design & redesign', title: 'UI/UX Design', description: 'Give customers a clearer path through your site with intuitive navigation and consistent interfaces.', icon: PenTool },
  { id: 'website-redesign', number: '04', category: 'Design & redesign', title: 'Website Redesign', description: 'Keep what works on your current site while updating its layout, visual design, and mobile experience.', icon: Sparkles },
  { id: 'seo-performance', number: '05', category: 'Visibility & conversion', title: 'SEO & Performance', description: 'Find and fix technical issues that slow pages down or make them harder for search engines to discover.', icon: Search },
  { id: 'landing-pages', number: '06', category: 'Visibility & conversion', title: 'Landing Pages', description: 'Give a product or campaign a focused page with one clear next step, from signing up to requesting a quote.', icon: Target },
]

export const steps = [
  ['01', 'Discover', 'Get to know your business, audience, and goals.'],
  ['02', 'Plan', 'Agree on priorities, site structure, and scope.'],
  ['03', 'Design', 'Map key journeys and shape the visual direction.'],
  ['04', 'Develop', 'Build the site and test it across screen sizes.'],
  ['05', 'Launch', 'Check the details and get the site ready to go live.'],
  ['06', 'Grow', 'Review what’s working and identify what to improve next.'],
]

export const features = ['Strategy before design', 'Built for mobile', 'Performance focused', 'Conversion driven', 'Modern technology', 'Built to scale']
