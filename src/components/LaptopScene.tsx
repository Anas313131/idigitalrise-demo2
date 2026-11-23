import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, useGLTF, useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import { Box3, BufferAttribute, Color, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PointLight, SRGBColorSpace, Vector3 } from 'three'
import type { LaptopMotion } from './LaptopExperience'

function Laptop({ motion, onReady, mobile }: { motion: MutableRefObject<LaptopMotion>; onReady: () => void; mobile: boolean }) {
  const { scene } = useGLTF(mobile ? '/models/idigitalrise-laptop-mobile.glb' : '/models/idigitalrise-laptop.glb', '/draco/')
  const image = useTexture('/images/idigitalrise-screen-current.webp')
  const group = useRef<Group>(null)
  const { model, materials, texture, geometries } = useMemo(() => {
    const model = scene.clone(true)
    const texture = image.clone()
    texture.flipY = false
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = 4
    texture.needsUpdate = true
    const materials: (MeshStandardMaterial | MeshBasicMaterial)[] = []
    const geometries: Mesh['geometry'][] = []
    model.traverse(object => {
      if (!(object instanceof Mesh)) return
      const original = object.material as MeshStandardMaterial
      if (original.name === 'screen') {
        // The supplied model uses a rotated UV island. Map the display in its own XY plane.
        const geometry = object.geometry.clone()
        geometry.computeBoundingBox()
        const bounds = geometry.boundingBox!
        const size = bounds.getSize(new Vector3())
        const positions = geometry.getAttribute('position')
        const uv = new Float32Array(positions.count * 2)
        for (let i = 0; i < positions.count; i++) {
          uv[i * 2] = (positions.getX(i) - bounds.min.x) / size.x
          uv[i * 2 + 1] = 1 - (positions.getY(i) - bounds.min.y) / size.y
        }
        geometry.setAttribute('uv', new BufferAttribute(uv, 2))
        object.geometry = geometry
        geometries.push(geometry)
        const material = new MeshBasicMaterial({ map: texture, toneMapped: false })
        object.material = material
        materials.push(material)
      } else {
        const material = original.clone()
        if (original.name === 'body') {
          material.color = new Color('#c3c5c8')
          material.metalness = 0.86
          material.roughness = 0.27
        }
        object.material = material
        materials.push(material)
      }
    })
    model.updateMatrixWorld(true)
    const box = new Box3().setFromObject(model)
    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())
    const scale = 3.8 / size.x
    model.position.sub(center)
    const normalized = new Group()
    normalized.add(model)
    normalized.scale.setScalar(scale)
    return { model: normalized, materials, texture, geometries }
  }, [scene, image])
  useEffect(() => { onReady() }, [onReady])
  useEffect(() => () => { materials.forEach(material => material.dispose()); texture.dispose(); geometries.forEach(geometry => geometry.dispose()) }, [materials, texture, geometries])
  useFrame(({ camera }) => {
    if (!group.current) return
    const m = motion.current
    group.current.scale.setScalar(m.scale)
    group.current.position.set(m.x, m.y, 0)
    group.current.rotation.set(m.rx, m.ry, 0)
    camera.position.set(0, 0.65, m.cameraZ)
    camera.lookAt(0, 0, 0)
  })
  return <group ref={group}><primitive object={model} dispose={null} /></group>
}

function OrangeLight({ motion, mobile }: { motion: MutableRefObject<LaptopMotion>; mobile: boolean }) {
  const light = useRef<PointLight>(null)
  useFrame(() => { if (light.current) light.current.intensity = (mobile ? 4 : 8) + motion.current.glow * 12 })
  return <pointLight ref={light} position={[-3, 0, -2]} color="#ff6500" intensity={8} />
}

function Activity({ active, motion }: { active: boolean; motion: MutableRefObject<LaptopMotion> }) {
  const setFrameloop = useThree(state => state.setFrameloop)
  const invalidate = useThree(state => state.invalidate)
  useEffect(() => { const state = motion.current; state.invalidate = invalidate; return () => { delete state.invalidate } }, [motion, invalidate])
  useEffect(() => { setFrameloop(active ? 'demand' : 'never'); if (active) invalidate() }, [active, setFrameloop, invalidate])
  return null
}

export default function LaptopScene({ motion, onReady, onError }: { motion: MutableRefObject<LaptopMotion>; onReady: () => void; onError: () => void }) {
  const host = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)')
    const update = () => setMobile(query.matches)
    update()
    query.addEventListener('change', update)
    let inView = true
    const updateActivity = () => setActive(inView && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; updateActivity() })
    if (host.current) observer.observe(host.current)
    document.addEventListener('visibilitychange', updateActivity)
    return () => { observer.disconnect(); query.removeEventListener('change', update); document.removeEventListener('visibilitychange', updateActivity) }
  }, [])
  return (
    <div ref={host} className="h-full w-full">
      <Canvas frameloop="demand" dpr={[1, mobile ? 1.25 : 1.5]} camera={{ position: [0, 0.65, 8.5], fov: 40, near: 0.1, far: 60 }} gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', onError, { once: true }) }}>
        <Activity active={active} motion={motion} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 5, 4]} intensity={3} color="#fff5eb" />
        <directionalLight position={[-4, 2, 1]} intensity={1.8} color="#d9e3f0" />
        <OrangeLight motion={motion} mobile={mobile} />
        <Environment resolution={mobile ? 64 : 128} frames={1}>
          <Lightformer position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 4, 1]} intensity={3} />
          <Lightformer position={[0, 1, 5]} scale={[8, 3, 1]} intensity={2} />
          {!mobile && <Lightformer position={[-5, 1, 0]} rotation={[0, Math.PI / 2, 0]} scale={[4, 5, 1]} intensity={2} />}
        </Environment>
        <Laptop motion={motion} onReady={onReady} mobile={mobile} />
        <ContactShadows position={[0, -1.65, 0]} opacity={0.3} scale={12} blur={2.8} far={5} resolution={mobile ? 128 : 256} frames={1} color="#000000" />
      </Canvas>
    </div>
  )
}
