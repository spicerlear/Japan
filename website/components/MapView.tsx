'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import type { MapPin } from './TripPlanner'

const CATEGORY_COLORS: Record<string, string> = {
  hotel: '#e74c3c',
  restaurant: '#e67e22',
  activity: '#3498db',
  transit: '#2ecc71',
  trail: '#8b5cf6',
}

const CATEGORY_GLYPHS: Record<string, string> = {
  hotel: 'H',
  restaurant: 'R',
  activity: 'A',
  transit: 'T',
  trail: '\u26F0',
}

const CATEGORY_LABELS: Record<string, string> = {
  hotel: 'Hotel',
  restaurant: 'Restaurant',
  activity: 'Activity',
  transit: 'Transit',
  trail: 'Trail',
}

function pinSvg(category: string, isSelected: boolean): string {
  const color = CATEGORY_COLORS[category] || '#7f8c8d'
  const glyph = CATEGORY_GLYPHS[category] || '?'
  const size = isSelected ? 40 : 32
  const height = isSelected ? 50 : 40
  const fontSize = isSelected ? 18 : 14
  const textY = isSelected ? 24 : 20
  const strokeWidth = isSelected ? 3 : 2
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${height}" viewBox="0 0 ${size} ${height}">
    <path d="M${size / 2} 0C${size * 0.224} 0 0 ${size * 0.224} 0 ${size / 2}c0 ${size * 0.375} ${size / 2} ${size * 0.75} ${size / 2} ${size * 0.75}s${size / 2}-${size * 0.375} ${size / 2}-${size * 0.75}C${size} ${size * 0.224} ${size * 0.776} 0 ${size / 2} 0z" fill="${color}" stroke="white" stroke-width="${strokeWidth}"/>
    <text x="${size / 2}" y="${textY}" text-anchor="middle" fill="white" font-size="${fontSize}" font-weight="bold" font-family="Arial">${glyph}</text>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function googleMapsSearchUrl(pin: MapPin): string {
  const q = encodeURIComponent(pin.name + (pin.address ? ', ' + pin.address : ''))
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

function googleMapsDirectionsUrl(pin: MapPin): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}&travelmode=transit`
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
  const [infoPin, setInfoPin] = useState<MapPin | null>(null)

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

  // Fly to selected pin and open its InfoWindow
  useEffect(() => {
    if (!mapRef.current || !selectedPin) return
    mapRef.current.panTo({ lat: selectedPin.lat, lng: selectedPin.lng })
    mapRef.current.setZoom(15)
    setInfoPin(selectedPin)
  }, [selectedPin])

  const handleMarkerClick = useCallback(
    (pin: MapPin) => {
      setInfoPin(pin)
      onPinClick?.(pin)
    },
    [onPinClick],
  )

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
      onClick={() => setInfoPin(null)}
      options={{
        zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.TOP_RIGHT },
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {validPins.map((pin, i) => {
        const isSelected = infoPin?.lat === pin.lat && infoPin?.lng === pin.lng && infoPin?.name === pin.name
        return (
          <Marker
            key={`${pin.lat}-${pin.lng}-${i}`}
            position={{ lat: pin.lat, lng: pin.lng }}
            title={pin.name}
            icon={{
              url: pinSvg(pin.category, isSelected),
              scaledSize: isSelected ? new google.maps.Size(40, 50) : new google.maps.Size(32, 40),
              anchor: isSelected ? new google.maps.Point(20, 50) : new google.maps.Point(16, 40),
            }}
            zIndex={isSelected ? 1000 : undefined}
            onClick={() => handleMarkerClick(pin)}
          />
        )
      })}

      {infoPin && (
        <InfoWindow
          position={{ lat: infoPin.lat, lng: infoPin.lng }}
          onCloseClick={() => setInfoPin(null)}
          options={{ pixelOffset: new google.maps.Size(0, -45), maxWidth: 340 }}
        >
          <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: '4px 0' }}>
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: CATEGORY_COLORS[infoPin.category] || '#7f8c8d',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {CATEGORY_LABELS[infoPin.category] || infoPin.category}
              </span>
              {infoPin.booked && (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#22c55e',
                    backgroundColor: '#dcfce7',
                    marginLeft: 6,
                  }}
                >
                  Booked
                </span>
              )}
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }}>
              {infoPin.name}
            </h3>

            {infoPin.address && (
              <p style={{ margin: '0 0 6px', fontSize: 12, color: '#666', lineHeight: 1.4 }}>{infoPin.address}</p>
            )}

            {infoPin.date_start && (
              <p style={{ margin: '0 0 6px', fontSize: 12, color: '#444', fontWeight: 500 }}>
                {formatDate(infoPin.date_start)}
                {infoPin.date_end && ` \u2014 ${formatDate(infoPin.date_end)}`}
              </p>
            )}

            {infoPin.notes && (
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: 12,
                  color: '#555',
                  lineHeight: 1.5,
                  padding: '6px 8px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 6,
                  borderLeft: `3px solid ${CATEGORY_COLORS[infoPin.category] || '#7f8c8d'}`,
                }}
              >
                {infoPin.notes}
              </p>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <a
                href={googleMapsSearchUrl(infoPin)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: '#4285f4',
                  textDecoration: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Google Maps
              </a>
              <a
                href={googleMapsDirectionsUrl(infoPin)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#4285f4',
                  backgroundColor: '#e8f0fe',
                  textDecoration: 'none',
                  border: '1px solid #c4d7f5',
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 11l19-9-9 19-2-8-8-2z" />
                </svg>
                Directions
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}
