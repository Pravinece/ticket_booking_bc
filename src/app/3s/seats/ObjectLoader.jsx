import { Canvas, useThree, useFrame } from '@react-three/fiber'
import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import LightHelper from './LightHelper'
import { Html, Loader, OrbitControls } from '@react-three/drei'
import ModelLoader from './ModelLoader'
import CameraController from './CameraController'
import { CAMERA_POSITIONS } from '@/data/busData'
import { set } from 'mongoose'
import { Card } from '@/components/ui/card'
import { Armchair } from 'lucide-react'
import { cn } from '@/lib/utils'
import BusAudioSystem from './BusAudioSystem'

// Keeps orbit target just ahead of camera so scroll always moves forward
function TargetFollower({ controlsRef }) {
  useFrame(() => {
    if (!controlsRef?.current) return
    const cam = controlsRef.current.object
    const dist = cam.position.distanceTo(controlsRef.current.target)
    if (dist < 0.5) {
      const dir = new THREE.Vector3()
      cam.getWorldDirection(dir)
      controlsRef.current.target.copy(cam.position).add(dir.multiplyScalar(2))
      controlsRef.current.update()
    }
  })
  return null
}

function ObjectLoader({seats}) {
  const [selectedSeat, setSelectedSeat] = useState(0)
  const [savedPositions, setSavedPositions] = useState({})
  const controlsRef = useRef()

  
  const seatColors = {
    booked: 'bg-white/10 text-white/10 cursor-not-allowed',
    selected: 'bg-[#BA9EFF] text-white shadow-lg shadow-[#BA9EFF] scale-105',
    available: 'border-[#53DDFC] bg-white/10 hover:bg-green-100 hover:scale-105 cursor-pointer'
  }


  return (
    <>
      {/* Canvas */}
      <div className="max-w-5xl mx-auto p-6 glass-card h-130">
        <Canvas>
          <OrbitControls
            ref={controlsRef}
            minDistance={0}
            maxDistance={100}
            enablePan={true}
          />
          <TargetFollower controlsRef={controlsRef} />
            <CameraController
              selectedSeat={selectedSeat}
              CAMERA_POSITIONS={{ ...CAMERA_POSITIONS, ...savedPositions }}
              controlsRef={controlsRef}
            />
          <LightHelper />
          <BusAudioSystem />
          <Suspense fallback={<Html><Loader /></Html>}>
            <ModelLoader />
          </Suspense>
        </Canvas>
      </div>

      <Card className="glass-card p-6 max-w-5xl mx-auto p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              {seats.map(seat => {
                const isBooked = seat.status === 'booked'
                const isSelected = selectedSeat == seat.seat_number
                const status = isBooked ? 'booked' : isSelected ? 'selected' : 'available'

                return (
                  <div
                    key={seat.seat_number}
                    onClick={() => setSelectedSeat(seat.seat_number)}
                    className={cn(
                      "w-11 h-11 rounded-xl border border-border/50 flex items-center justify-center text-sm font-medium transition-all duration-200",
                      seatColors[status]
                    )}
                  >
                    <span className='flex flex-col items-center text-[10px]'><Armchair className='w-[18px]'/> {seat.seat_number}</span>
                    
                  </div>
                )
              })}
            </div>
          </Card>
    </>
  )
}

export default ObjectLoader
