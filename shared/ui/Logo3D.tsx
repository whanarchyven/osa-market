'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { SVGLoader, type SVGResult } from 'three/examples/jsm/loaders/SVGLoader.js'

interface Logo3DProps {
  className?: string
  color?: string
  depth?: number
  rotationSpeed?: number
}

export function Logo3D({
  className,
  color = '#FFC300',
  depth = 12,
  rotationSpeed = 0.01,
}: Logo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight, false)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.zIndex = '1'
    container.style.position = 'relative'
    container.style.overflow = 'hidden'
    container.style.width = '100%'
    container.style.height = '100%'
    container.appendChild(renderer.domElement)

    const { clientWidth, clientHeight } = container
    const camera = new THREE.OrthographicCamera(
      -clientWidth / 2,
      clientWidth / 2,
      clientHeight / 2,
      -clientHeight / 2,
      0.1,
      2000
    )
    camera.position.set(0, 0, 400)

    const ambient = new THREE.AmbientLight(0xffffff, 0.25)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2)
    keyLight.position.set(60, 0, 260)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0xfff0c2, 1.1, 700)
    fillLight.position.set(-140, 80, 220)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0xffffff, 0.9, 600)
    rimLight.position.set(180, -120, 260)
    scene.add(rimLight)

    const group = new THREE.Group()
    scene.add(group)

    let animationId = 0
    let disposed = false

    const loader = new SVGLoader()
    let svgCenter = new THREE.Vector2(0, 0)

    const centerGroup = (width: number, height: number) => {
      group.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(group)
      const center = new THREE.Vector3()
      const size = new THREE.Vector3()
      box.getCenter(center)
      box.getSize(size)

      const targetSize = Math.min(width, height) * 0.7
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = maxDim > 0 ? targetSize / maxDim : 1
      group.scale.set(scale, -scale, scale)
      group.rotation.set(0, 0, 0)
      group.position.set(0, 0, 0)
    }

    loader.load('/logo.svg', (data: SVGResult) => {
      if (disposed) return
      const svgEl = data.xml as unknown as SVGSVGElement | undefined
      const viewBox = svgEl?.getAttribute('viewBox')
      if (viewBox) {
        const [minX, minY, width, height] = viewBox
          .trim()
          .split(/[ ,]+/)
          .map((value: string) => Number(value))
        if ([minX, minY, width, height].every((value) => Number.isFinite(value))) {
          svgCenter = new THREE.Vector2(minX + width / 2, minY + height / 2)
        }
      } else {
        const width = Number(svgEl?.getAttribute('width') ?? 0)
        const height = Number(svgEl?.getAttribute('height') ?? 0)
        if (Number.isFinite(width) && Number.isFinite(height) && width && height) {
          svgCenter = new THREE.Vector2(width / 2, height / 2)
        }
      }

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.25,
        metalness: 0.35,
        roughness: 0.2,
        side: THREE.DoubleSide,
      })

      data.paths.forEach((path: THREE.ShapePath) => {
        const shapes = SVGLoader.createShapes(path)
        shapes.forEach((shape: THREE.Shape) => {
          const geometry = new THREE.ExtrudeGeometry(shape, {
            depth,
            bevelEnabled: true,
            bevelSize: depth * 0.2,
            bevelThickness: depth * 0.2,
            bevelSegments: 2,
          })
          geometry.translate(-svgCenter.x, -svgCenter.y, -depth / 2)
          const mesh = new THREE.Mesh(geometry, material)
          group.add(mesh)
        })
      })

      centerGroup(container.clientWidth, container.clientHeight)
      camera.lookAt(0, 0, 0)
    })

    const animate = () => {
      if (disposed) return
      group.rotation.y += rotationSpeed
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = (width: number, height: number) => {
      renderer.setSize(width, height, false)
      camera.left = -width / 2
      camera.right = width / 2
      camera.top = height / 2
      camera.bottom = -height / 2
      camera.updateProjectionMatrix()
      if (group.children.length > 0) {
        centerGroup(width, height)
      }
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      handleResize(entry.contentRect.width, entry.contentRect.height)
    })
    resizeObserver.observe(container)

    return () => {
      disposed = true
      resizeObserver.disconnect()
      cancelAnimationFrame(animationId)
      renderer.dispose()
      container.removeChild(renderer.domElement)
      group.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((material: THREE.Material) => material.dispose())
          } else {
            child.material.dispose()
          }
        }
      })
    }
  }, [color, depth, rotationSpeed])

  return <div ref={containerRef} className={className} />
}

