'use client'

import { useEffect, useRef, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

interface MapPin {
  lat: number
  lng: number
  name: string
  category: string
}

const CATEGORY_COLORS: Record<string, string> = {
  hotel: '#e74c3c',
  restaurant: '#e67e22',
  activity: '#3498db',
  transit: '#2ecc71',
}

const CATEGORY_GLYPHS: Record<string, string> = {
  hotel: 'H',
  restaurant: 'R',
  activity: 'A',
  transit: 'T',
}

function pinSvg(category: string): string {
  const color = CATEGORY_COLORS[category] || '#7f8c8d'
  const glyph = CATEGORY_GLYPHS[category] || '?'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="${color}" stroke="white" stroke-width="2"/>
    <text x="16" y="20" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Arial">${glyph}</text>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

interface MapViewProps {
  pins: MapPin[]
  selectedPin?: MapPin | null
  onPinClick?: (pin: MapPin) => void
}

const containerStyle = { width: '100%', height: '100%' }
const defaultCenter = { lat: 35.6762, lng: 139.6503 }

export default function MapView({ pins, selectedPin, onPinClick }: MapViewProps) {
  const mapRef = useRef<google.maps.Map | null>(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    language: 'en',
  })

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  // Fit bounds when pins change
  useEffect(() => {
    if (!mapRef.current) return
    const validPins = pins.filter((p) => p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng))
    if (validPins.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    validPins.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }))
    mapRef.current.fitBounds(bounds, 40)
  }, [pins])

  // Fly to selected pin
  useEffect(() => {
    if (!mapRef.current || !selectedPin) return
    mapRef.current.panTo({ lat: selectedPin.lat, lng: selectedPin.lng })
    mapRef.current.setZoom(14)
  }, [selectedPin])

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e]">
        <p className="text-white/50">Loading map...</p>
      </div>
    )
  }

  const validPins = pins.filter((p) => p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng))

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={6}
      onLoad={onLoad}
      options={{
        zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.TOP_RIGHT },
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {validPins.map((pin, i) => (
        <Marker
          key={`${pin.lat}-${pin.lng}-${i}`}
          position={{ lat: pin.lat, lng: pin.lng }}
          title={pin.name}
          icon={{
            url: pinSvg(pin.category),
            scaledSize: new google.maps.Size(32, 40),
            anchor: new google.maps.Point(16, 40),
          }}
          onClick={() => onPinClick?.(pin)}
        />
      ))}
    </GoogleMap>
  )
}
