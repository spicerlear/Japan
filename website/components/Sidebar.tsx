'use client'

import { useState } from 'react'
import type { DayGroup } from '@/lib/data'

interface SidebarProps {
  days: DayGroup[]
  activeView: string
  onViewChange: (view: string) => void
}

const OVERVIEW_ITEMS = [
  { id: 'hotels', label: 'Hotels & Lodging', icon: '🏨' },
  { 
    id: 'restaurants', 
    label: 'Restaurants', 
    icon: '🍴',
    children: [
      { id: 'hakone-restaurants', label: 'Hakone' },
      { id: 'kyoto-restaurants', label: 'Kyoto' },
      { id: 'tokyo-restaurants', label: 'Tokyo' }
    ]
  },
  { id: 'cafes', label: 'Cafes', icon: '☕' },
  { id: 'bars', label: 'Bars', icon: '🍺' },
  { id: 'activities', label: 'Places to Visit', icon: '📍' },
  { id: 'trails', label: 'Hiking Trails', icon: '🥾' },
  { id: 'transit', label: 'Transit', icon: '🚆' },
]

export default function Sidebar({ days, activeView, onViewChange }: SidebarProps) {
  const [overviewOpen, setOverviewOpen] = useState(true)
  const [itineraryOpen, setItineraryOpen] = useState(true)
  const [restaurantsOpen, setRestaurantsOpen] = useState(false)

  return (
    <aside className="w-56 shrink-0 bg-[#1e1e30] border-r border-white/10 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h1 className="text-lg font-bold text-white">Japan 2026</h1>
        <p className="text-xs text-white/50 mt-0.5">May 6-17</p>
      </div>

      {/* Overview Section */}
      <div className="border-b border-white/10">
        <button
          onClick={() => setOverviewOpen(!overviewOpen)}
          className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-left transition-colors ${
            !activeView.startsWith('day-') ? 'text-white bg-white/5' : 'text-white/80 hover:text-white'
          }`}
        >
          <svg
            className={`w-3 h-3 transition-transform ${overviewOpen ? 'rotate-90' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6 4l8 6-8 6V4z" />
          </svg>
          Overview
        </button>
        {overviewOpen && (
          <div className="pb-2">
            {OVERVIEW_ITEMS.map((item) => (
              <div key={item.id}>
                <button
                  onClick={item.children ? () => setRestaurantsOpen(!restaurantsOpen) : () => onViewChange(item.id)}
                  className={`w-full flex items-center gap-2 px-4 py-1.5 text-sm transition-colors ${
                    item.children
                      ? 'text-white/80 hover:text-white'
                      : activeView === item.id
                      ? 'text-white bg-white/10 font-medium'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                  {item.children && (
                    <svg
                      className={`w-3 h-3 ml-auto transition-transform ${restaurantsOpen ? 'rotate-90' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6 4l8 6-8 6V4z" />
                    </svg>
                  )}
                </button>
                {item.children && restaurantsOpen && (
                  <div className="ml-6">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => onViewChange(child.id)}
                        className={`w-full text-left px-4 py-1 text-sm transition-colors ${
                          activeView === child.id
                            ? 'text-white bg-white/10 font-medium'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Itinerary Section */}
      <div>
        <button
          onClick={() => setItineraryOpen(!itineraryOpen)}
          className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-left transition-colors ${
            activeView.startsWith('day-') ? 'text-white bg-white/5' : 'text-white/80 hover:text-white'
          }`}
        >
          <svg
            className={`w-3 h-3 transition-transform ${itineraryOpen ? 'rotate-90' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6 4l8 6-8 6V4z" />
          </svg>
          Itinerary
        </button>
        {itineraryOpen && (
          <div className="pb-2">
            {days.map((day) => {
              const shortDate = new Date(day.date + 'T12:00:00')
              const dayLabel = shortDate.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
              const firstItem = day.items[0]
              return (
                <button
                  key={day.date}
                  onClick={() => onViewChange(`day-${day.date}`)}
                  className={`w-full text-left px-8 py-1.5 transition-colors ${
                    activeView === `day-${day.date}`
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="text-sm font-medium">{dayLabel}</div>
                  {firstItem && (
                    <div className="text-xs text-white/40 truncate">{firstItem.name}</div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
