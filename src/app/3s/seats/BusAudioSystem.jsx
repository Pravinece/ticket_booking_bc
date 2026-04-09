import { useRef, useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { Volume2, VolumeOff } from 'lucide-react'

export default function BusAudioSystem() {
  const { camera } = useThree()
  const [audioStarted, setAudioStarted] = useState(false)
  const [audioError, setAudioError] = useState('')
  
  // Audio source positions in your bus (adjust these coordinates)
  const AUDIO_SOURCES = {
    engine: { position: [0.4499342730040058,
      1.4252366646205994,
      -5.541243778772628], maxVolume: 1, falloff: 9, file: '/engine.mp3' },
    music: { position: [0.6312704635040446,
      1.1496367269103351,
      -32.98095023503519], maxVolume: 1, falloff: 9, file: '/music.mp3' },
    ambient: { position: [-2.180737543024691,
      0.8339527421100754,
      -20.028920396174954], maxVolume: 1, falloff: 9, file: '/ambient.mp3' }
  }

  const audioElements = useRef({})
  const audioContext = useRef(null)
  const gainNodes = useRef({})
  const pannerNodes = useRef({})

  // Initialize Web Audio API
  const initAudio = async () => {
    if(audioStarted) return
    try {
      // Create audio context
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)()
      
      // Load and setup each audio source
      for (const [key, config] of Object.entries(AUDIO_SOURCES)) {
        try {
          // Create audio element
          const audio = new Audio(config.file)
          audio.loop = true
          audio.crossOrigin = 'anonymous'
          
          // Test if file exists
          await new Promise((resolve, reject) => {
            audio.addEventListener('canplaythrough', resolve)
            audio.addEventListener('error', reject)
            audio.load()
          })

          // Create Web Audio nodes
          const source = audioContext.current.createMediaElementSource(audio)
          const gainNode = audioContext.current.createGain()
          const pannerNode = audioContext.current.createPanner()
          
          // Configure panner for 3D audio
          pannerNode.panningModel = 'HRTF'
          pannerNode.distanceModel = 'inverse'
          pannerNode.refDistance = 1
          pannerNode.maxDistance = config.falloff
          pannerNode.rolloffFactor = 1
          
          // Connect audio graph
          source.connect(gainNode)
          gainNode.connect(pannerNode)
          pannerNode.connect(audioContext.current.destination)
          
          // Store references
          audioElements.current[key] = audio
          gainNodes.current[key] = gainNode
          pannerNodes.current[key] = pannerNode
          
          // Set initial position
          pannerNode.positionX.setValueAtTime(config.position[0], audioContext.current.currentTime)
          pannerNode.positionY.setValueAtTime(config.position[1], audioContext.current.currentTime)
          pannerNode.positionZ.setValueAtTime(config.position[2], audioContext.current.currentTime)
          
          console.log(`✅ Audio loaded: ${key} from ${config.file}`)
          
        } catch (error) {
          console.error(`❌ Failed to load ${key} audio:`, error)
          setAudioError(prev => prev + `Failed to load ${config.file}. `)
        }
      }
      startAudio()
      setAudioStarted(true)
      
      console.log('🎵 Audio system initialized')
      
    } catch (error) {
      console.error('❌ Audio context failed:', error)
      setAudioError('Web Audio API not supported')
    }
  }

  // Start all audio
  const startAudio = async () => {
    if (audioContext.current?.state === 'suspended') {
      await audioContext.current.resume()
    }
    
    Object.values(audioElements.current).forEach(audio => {
      audio.play().catch(err => console.error('Play failed:', err))
    })
  }

  // Calculate volume based on distance
  const calculateVolume = (cameraPos, sourcePos, maxVolume, falloff) => {
    const distance = cameraPos.distanceTo(new THREE.Vector3(...sourcePos))
    const volume = Math.max(0, maxVolume * (1 - distance / falloff))
    return Math.min(maxVolume, volume)
  }

  useFrame(() => {
    if (!audioStarted || !audioContext.current) return

    const cameraPos = camera.position

    // Update listener position (camera)
    if (audioContext.current.listener) {
      audioContext.current.listener.positionX.setValueAtTime(cameraPos.x, audioContext.current.currentTime)
      audioContext.current.listener.positionY.setValueAtTime(cameraPos.y, audioContext.current.currentTime)
      audioContext.current.listener.positionZ.setValueAtTime(cameraPos.z, audioContext.current.currentTime)
    }

    // Update each audio source volume
    Object.entries(AUDIO_SOURCES).forEach(([key, config]) => {
      const gainNode = gainNodes.current[key]
      if (gainNode) {
        const volume = calculateVolume(cameraPos, config.position, config.maxVolume, config.falloff)
        gainNode.gain.setValueAtTime(volume, audioContext.current.currentTime)
      }
    })
  })

  return (
      <Html position={[15, 8, 0]}>
              <button 
                onClick={initAudio}
                className='absolute top-2 right-2 p-2 rounded-full z-10 bg-white/20 hover:bg-white/40 transition'
              >
                {audioStarted ? <Volume2 /> : <VolumeOff />}
              </button>
      </Html>
  )
}