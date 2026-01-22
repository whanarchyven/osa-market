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
  rotationSpeed = 0.004,
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

    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(120, 160, 200)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0xffe38b, 0.7, 600)
    fillLight.position.set(-120, -80, 180)
    scene.add(fillLight)

    const axes = new THREE.AxesHelper(120)
    scene.add(axes)

    const grid = new THREE.GridHelper(240, 12, 0x444444, 0x222222)
    grid.rotation.x = Math.PI / 2
    scene.add(grid)

    const debugCube = new THREE.Mesh(
      new THREE.BoxGeometry(40, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true })
    )
    debugCube.position.set(0, 0, 0)
    scene.add(debugCube)

    const group = new THREE.Group()
    scene.add(group)

    let animationId = 0
    let disposed = false

    const loader = new SVGLoader()
    const baseRotationX = Math.PI + 0.12
    const centerGroup = (width: number, height: number) => {
      group.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(group)
      const center = new THREE.Vector3()
      const size = new THREE.Vector3()
      box.getCenter(center)
      box.getSize(size)

      group.position.set(-center.x, -center.y, -center.z)

      const targetSize = Math.min(width, height) * 0.7
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = maxDim > 0 ? targetSize / maxDim : 1
      group.scale.set(scale, -scale, scale)
      group.rotation.x = 0
      group.position.z = -depth * 0.5

      group.updateMatrixWorld(true)
      const scaledBox = new THREE.Box3().setFromObject(group)
      const scaledCenter = new THREE.Vector3()
      scaledBox.getCenter(scaledCenter)
      group.position.sub(scaledCenter)
    }

    loader.load('/logo.svg', (data: SVGResult) => {
      if (disposed) return
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
          const mesh = new THREE.Mesh(geometry, material)
          group.add(mesh)
        })
      })

      const boxHelper = new THREE.BoxHelper(group, 0xff00ff)
      scene.add(boxHelper)

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

