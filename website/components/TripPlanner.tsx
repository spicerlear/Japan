'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from './Sidebar'
import ContentPanel from './ContentPanel'
import type { Place, DayGroup } from '@/lib/data'

const MapView = dynamic(() => import('./MapView'), { ssr: false })

interface TripPlannerProps {
  places: Place[]
  days: DayGroup[]
}

interface MapPin {
  lat: number
  lng: number
  name: string
  category: string
}

export default function TripPlanner({ places, days }: TripPlannerProps) {
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
      }))
    }

    const categoryMap: Record<string, string> = {
      hotels: 'hotel',
      restaurants: 'restaurant',
      activities: 'activity',
      transit: 'transit',
    }

    const cat = categoryMap[activeView]
    if (cat) {
      return places
        .filter((p) => p.category === cat)
        .map((p) => ({ lat: p.lat, lng: p.lng, name: p.name, category: p.category }))
    }

    // All places
    return places.map((p) => ({ lat: p.lat, lng: p.lng, name: p.name, category: p.category }))
  }, [activeView, places, days])

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
      {/* Left Sidebar */}
      <Sidebar days={days} activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <div className="flex flex-1 min-w-0">
        {/* Content Panel */}
        <div className="w-[480px] shrink-0 flex flex-col bg-[#16162a] border-r border-white/10">
          <ContentPanel
            activeView={activeView}
            places={places}
            days={days}
            onItemHover={handleItemHover}
            onItemClick={handleItemClick}
          />
        </div>

        {/* Map */}
        <div className="flex-1 min-w-0">
          <MapView pins={pins} selectedPin={selectedPin} onPinClick={handlePinClick} />
        </div>
      </div>
    </div>
  )
}
