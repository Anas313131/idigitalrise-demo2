import type { CSSProperties, ComponentType } from 'react'
export interface CarouselItem {
  src: string
  alt?: string
  title?: string
  subtitle?: string
}
export interface FlexCarouselProps {
  items?: CarouselItem[]
  preset?: 'liquid' | 'ribbon' | 'vortex' | 'arch'
  intro?: 'rise' | 'bloom' | 'spin' | 'deal' | 'fade' | 'none'
  cardHeight?: number
  gap?: number
  radius?: number
  fit?: 'natural' | 'portrait' | 'square' | 'landscape'
  lensWidth?: number
  lensHeight?: number
  tilt?: number
  roundness?: number
  bend?: number
  reach?: number
  curl?: 'twist' | 'rise' | 'fall'
  dispersion?: number
  liquid?: number
  followCursor?: boolean
  squeeze?: number
  focusOnClick?: boolean
  autoplay?: boolean
  interval?: number
  captions?: boolean
  captureWheel?: boolean
  onChange?: (index: number, item: CarouselItem) => void
  onSelect?: (index: number, item: CarouselItem) => void
  className?: string
  style?: CSSProperties
}
declare const FlexCarousel: ComponentType<FlexCarouselProps>
export default FlexCarousel
