'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from './Sidebar'
import ContentPanel from './ContentPanel'
import type { Place, DayGroup, Trail } from '@/lib/data'

const MapView = dynamic(() => import('./MapView'), { ssr: false })

interface TripPlannerProps {
  places: Place[]
  days: DayGroup[]
  trails: Trail[]
}

export interface MapPin {
  lat: number
  lng: number
  name: string
  category: string
  address?: string
  notes?: string
  date_start?: string
  date_end?: string
  booked?: boolean
}

export default function TripPlanner({ places, days, trails }: TripPlannerProps) {
  const [activeView, setActiveView] = useState('hotels')
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null)

  const pins = useMemo<MapPin[]>(() => {
    if (activeView.startsWith('day-')) {
      const dateStr = activeView.replace('day-', '')
      const day = days.find((d) => d.date === dateStr)
      return (day?.items || []).map((item) => ({
        lat: item.lat,
        lng: item.lng,
        name: item.name,
        category: item.category,
        address: item.address,
        notes: item.notes,
      }))
    }

    if (activeView === 'trails') {
      return trails.map((t) => ({
        lat: t.lat,
        lng: t.lng,
        name: t.name,
        category: 'trail',
        notes: `${t.distance_km}km | ${t.elevation_gain_m}m gain | ${t.duration_hrs}hrs | ${t.difficulty}`,
      }))
    }

    let filteredPlaces = places
    if (activeView === 'hakone-restaurants') {
      filteredPlaces = places.filter(p => p.category === 'restaurant' && p.address.includes('Hakone'))
    } else if (activeView === 'kyoto-restaurants') {
      filteredPlaces = places.filter(p => p.category === 'restaurant' && p.address.includes('Kyoto'))
    } else if (activeView === 'tokyo-restaurants') {
      filteredPlaces = places.filter(p => p.category === 'restaurant' && p.address.includes('Tokyo'))
    } else if (activeView === 'restaurants') {
      filteredPlaces = places.filter(p => p.category === 'restaurant')
    } else {
      const categoryMap: Record<string, string> = {
        hotels: 'hotel',
        cafes: 'cafe',
        bars: 'bar',
        activities: 'activity',
        transit: 'transit',
      }
      const cat = categoryMap[activeView]
      if (cat) {
        filteredPlaces = places.filter(p => p.category === cat)
      }
    }

    return filteredPlaces.map((p) => ({
      lat: p.lat, lng: p.lng, name: p.name, category: p.category,
      address: p.address, notes: p.notes, date_start: p.date_start, date_end: p.date_end, booked: p.booked,
    }))
  }, [activeView, places, days, trails])

  const handleItemClick = useCallback((item: MapPin) => {
    setSelectedPin(item)
  }, [])

  const handleItemHover = useCallback((item: MapPin | null) => {
    // Could add hover highlight on map in the future
  }, [])

  const handlePinClick = useCallback((pin: MapPin) => {
    setSelectedPin(pin)
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar days={days} activeView={activeView} onViewChange={setActiveView} />

      <div className="flex flex-1 min-w-0">
        <div className="w-[480px] shrink-0 flex flex-col bg-[#16162a] border-r border-white/10">
          <ContentPanel
            activeView={activeView}
            places={places}
            days={days}
            trails={trails}
            onItemHover={handleItemHover}
            onItemClick={handleItemClick}
          />
        </div>

        <div className="flex-1 min-w-0">
          <MapView pins={pins} selectedPin={selectedPin} onPinClick={handlePinClick} />
        </div>
      </div>
    </div>
  )
}
