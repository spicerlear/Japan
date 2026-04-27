'use client'

import { useState } from 'react'
import type { Place, DayGroup, ItineraryItem, Trail } from '@/lib/data'

const CATEGORY_COLORS: Record<string, string> = {
  hotel: 'bg-red-500',
  restaurant: 'bg-orange-500',
  cafe: 'bg-yellow-500',
  bar: 'bg-purple-500',
  activity: 'bg-blue-500',
  transit: 'bg-green-500',
}

const CATEGORY_LABELS: Record<string, string> = {
  hotel: 'Hotel',
  restaurant: 'Restaurant',
  cafe: 'Cafe',
  bar: 'Bar',
  activity: 'Activity',
  transit: 'Transit',
}

const CATEGORY_ICONS: Record<string, string> = {
  hotel: '🏨',
  restaurant: '🍴',
  cafe: '☕',
  bar: '🍺',
  activity: '📍',
  transit: '🚆',
}

interface ContentPanelProps {
  activeView: string
  places: Place[]
  days: DayGroup[]
  trails: Trail[]
  onItemHover: (item: { lat: number; lng: number; name: string; category: string } | null) => void
  onItemClick: (item: { lat: number; lng: number; name: string; category: string }) => void
}

function PlaceCard({
  place,
  onHover,
  onClick,
}: {
  place: Place
  onHover: (p: Place | null) => void
  onClick: (p: Place) => void
}) {
  return (
    <div
      className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors cursor-pointer"
      onMouseEnter={() => onHover(place)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(place)}
    >
      {place.image_url && (
        <div className="w-full h-32 overflow-hidden">
          <img
            src={place.image_url}
            alt={place.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">{place.name}</h3>
            <p className="text-white/50 text-xs mt-0.5 truncate">{place.address}</p>
            {place.date_start && (
              <p className="text-white/60 text-xs mt-1">
                {formatDate(place.date_start)}
                {place.date_end && ` — ${formatDate(place.date_end)}`}
              </p>
            )}
            {place.notes && <p className="text-white/40 text-xs mt-1">{place.notes}</p>}
          </div>
          {place.booked && (
            <span className="ml-2 shrink-0 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
              Booked
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function ItineraryItemCard({
  item,
  onHover,
  onClick,
}: {
  item: ItineraryItem
  onHover: (i: ItineraryItem | null) => void
  onClick: (i: ItineraryItem) => void
}) {
  const colorDot = CATEGORY_COLORS[item.category] || 'bg-gray-500'

  return (
    <div
      className="flex gap-3 items-start hover:bg-white/5 rounded-lg p-3 -mx-3 transition-colors cursor-pointer"
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(item)}
    >
      {/* Time */}
      <div className="w-14 shrink-0 text-right">
        <span className="text-white/50 text-xs font-mono">{item.time}</span>
      </div>

      {/* Timeline dot */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div className={`w-3 h-3 rounded-full ${colorDot} ring-2 ring-white/20`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">{CATEGORY_ICONS[item.category]}</span>
          <h4 className="text-white text-sm font-medium">{item.name}</h4>
          <span className="text-white/30 text-xs capitalize">{CATEGORY_LABELS[item.category]}</span>
        </div>
        {item.notes && <p className="text-white/40 text-xs mt-0.5">{item.notes}</p>}
        <p className="text-white/30 text-xs mt-0.5 truncate">{item.address}</p>
      </div>
    </div>
  )
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-green-500/20 text-green-400',
  moderate: 'bg-yellow-500/20 text-yellow-400',
  hard: 'bg-red-500/20 text-red-400',
}

const REGION_COLORS: Record<string, string> = {
  hakone: 'bg-cyan-500/20 text-cyan-400',
  kyoto: 'bg-purple-500/20 text-purple-400',
  tokyo: 'bg-pink-500/20 text-pink-400',
}

const PLATFORM_LABELS: Record<string, string> = {
  yamap: 'YAMAP',
  yamakei: 'Yamakei',
  ridgeline: 'Ridgeline',
  alltrails: 'AllTrails',
  other: 'Source',
}

function SolitudeRating({ rating }: { rating: number }) {
  return (
    <span className="text-xs text-white/50" title={`Solitude: ${rating}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'text-emerald-400' : 'text-white/20'}>
          *
        </span>
      ))}
    </span>
  )
}

function TrailCard({
  trail,
  onHover,
  onClick,
}: {
  trail: Trail
  onHover: (t: Trail | null) => void
  onClick: (t: Trail) => void
}) {
  return (
    <div
      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
      onMouseEnter={() => onHover(trail)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(trail)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm">{trail.name}</h3>
          <p className="text-white/40 text-xs mt-0.5">{trail.japanese_name}</p>
        </div>
        <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${REGION_COLORS[trail.region]}`}>
          {trail.region.charAt(0).toUpperCase() + trail.region.slice(1)}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
        <span>{trail.distance_km} km</span>
        <span className="text-white/20">|</span>
        <span>{trail.elevation_gain_m}m gain</span>
        <span className="text-white/20">|</span>
        <span>{trail.duration_hrs}h</span>
      </div>

      {/* Difficulty + Solitude row */}
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[trail.difficulty]}`}>
          {trail.difficulty}
        </span>
        <span className="text-xs text-white/40 ml-1">Solitude:</span>
        <SolitudeRating rating={trail.solitude} />
      </div>

      {/* Description */}
      <p className="text-white/50 text-xs mt-2 line-clamp-3">{trail.description}</p>

      {/* Crowd notes */}
      <p className="text-white/30 text-[11px] mt-1.5 italic">{trail.crowd_notes}</p>

      {/* Access */}
      <p className="text-white/40 text-[11px] mt-1.5">{trail.access}</p>

      {/* Footer: platform + dates */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <a
          href={trail.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-blue-400 hover:text-blue-300"
          onClick={(e) => e.stopPropagation()}
        >
          {PLATFORM_LABELS[trail.platform] || trail.platform}
        </a>
        <span className="text-[10px] text-white/30">
          {trail.best_dates.map((d) => {
            const dt = new Date(d + 'T12:00:00')
            return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }).join(', ')}
        </span>
      </div>
    </div>
  )
}

function AccordionSection({
  title,
  icon,
  count,
  children,
  defaultOpen = true,
}: {
  title: string
  icon: string
  count: number
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-6 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <svg
          className={`w-4 h-4 text-white/60 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M6 4l8 6-8 6V4z" />
        </svg>
        <span className="text-lg font-semibold text-white">{icon} {title}</span>
        <span className="text-white/40 text-sm ml-auto">{count}</span>
      </button>
      {open && <div className="px-6 pb-4">{children}</div>}
    </div>
  )
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function ContentPanel({
  activeView,
  places,
  days,
  trails,
  onItemHover,
  onItemClick,
}: ContentPanelProps) {
  // Trails view
  if (activeView === 'trails') {
    const regions = ['hakone', 'kyoto', 'tokyo'] as const
    const regionLabels: Record<string, string> = { hakone: 'Hakone', kyoto: 'Kyoto', tokyo: 'Tokyo' }
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Hiking Trails</h2>
          <p className="text-white/50 text-sm mt-1">{trails.length} trails researched via YAMAP, Yamakei, Ridgeline Images</p>
          <p className="text-white/30 text-xs mt-1">Prioritizing solitude and beautiful nature over famous crowded trails</p>
        </div>
        {regions.map((region) => {
          const regionTrails = trails.filter((t) => t.region === region)
          return (
            <AccordionSection
              key={region}
              title={regionLabels[region]}
              icon={region === 'hakone' ? '♨' : region === 'kyoto' ? '⛩' : '🗼'}
              count={regionTrails.length}
            >
              <div className="space-y-3">
                {regionTrails.map((trail, i) => (
                  <TrailCard
                    key={i}
                    trail={trail}
                    onHover={(t) => onItemHover(t ? { lat: t.lat, lng: t.lng, name: t.name, category: 'trail' } : null)}
                    onClick={(t) => onItemClick({ lat: t.lat, lng: t.lng, name: t.name, category: 'trail' })}
                  />
                ))}
              </div>
            </AccordionSection>
          )
        })}
      </div>
    )
  }

  // Overview views: filter places by category
  if (!activeView.startsWith('day-')) {
    const categoryMap: Record<string, Place['category']> = {
      hotels: 'hotel',
      restaurants: 'restaurant',
      activities: 'activity',
      transit: 'transit',
    }

    const viewConfig: Record<string, { title: string; icon: string; category: Place['category'] }> = {
      hotels: { title: 'Hotels & Lodging', icon: '🏨', category: 'hotel' },
      restaurants: { title: 'Restaurants', icon: '🍴', category: 'restaurant' },
      'hakone-restaurants': { title: 'Hakone Restaurants', icon: '🍴', category: 'restaurant' },
      'kyoto-restaurants': { title: 'Kyoto Restaurants', icon: '🍴', category: 'restaurant' },
      'tokyo-restaurants': { title: 'Tokyo Restaurants', icon: '🍴', category: 'restaurant' },
      cafes: { title: 'Cafes', icon: '☕', category: 'cafe' },
      bars: { title: 'Bars', icon: '🍺', category: 'bar' },
      activities: { title: 'Places to Visit', icon: '📍', category: 'activity' },
      transit: { title: 'Transit', icon: '🚆', category: 'transit' },
    }

    const config = viewConfig[activeView]
    if (!config) {
      // Show all categories as accordions
      const categories = ['hotel', 'restaurant', 'cafe', 'bar', 'activity', 'transit'] as const
      return (
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Trip Overview</h2>
            <p className="text-white/50 text-sm mt-1">May 6-17, 2026 | Hakone, Kyoto, Tokyo</p>
          </div>
          {categories.map((cat) => {
            const catPlaces = places.filter((p) => p.category === cat)
            return (
              <AccordionSection
                key={cat}
                title={viewConfig[cat === 'hotel' ? 'hotels' : cat === 'restaurant' ? 'restaurants' : cat === 'cafe' ? 'cafes' : cat === 'bar' ? 'bars' : cat === 'activity' ? 'activities' : 'transit'].title}
                icon={CATEGORY_ICONS[cat]}
                count={catPlaces.length}
              >
                <div className="space-y-2">
                  {catPlaces.map((place, i) => (
                    <PlaceCard key={i} place={place} onHover={onItemHover as any} onClick={onItemClick as any} />
                  ))}
                </div>
              </AccordionSection>
            )
          })}
        </div>
      )
    }

    let filtered = places
    if (activeView === 'hakone-restaurants') {
      filtered = places.filter(p => p.category === 'restaurant' && p.address.includes('Hakone'))
    } else if (activeView === 'kyoto-restaurants') {
      filtered = places.filter(p => p.category === 'restaurant' && p.address.includes('Kyoto'))
    } else if (activeView === 'tokyo-restaurants') {
      filtered = places.filter(p => p.category === 'restaurant' && p.address.includes('Tokyo'))
    } else if (activeView === 'restaurants') {
      filtered = places.filter(p => p.category === 'restaurant')
    } else {
      filtered = places.filter((p) => p.category === config.category)
    }

    return (
      <div className="flex-1 overflow-y-auto">
        <AccordionSection title={config.title} icon={config.icon} count={filtered.length}>
          <div className="space-y-2">
            {filtered.map((place, i) => (
              <PlaceCard key={i} place={place} onHover={onItemHover as any} onClick={onItemClick as any} />
            ))}
            {filtered.length === 0 && (
              <p className="text-white/30 text-sm py-4">No items yet.</p>
            )}
          </div>
        </AccordionSection>
      </div>
    )
  }

  // Itinerary day view
  const dateStr = activeView.replace('day-', '')
  const day = days.find((d) => d.date === dateStr)

  if (!day) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/40">Day not found</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-white/10">
        <button className="w-full flex items-center gap-2 px-6 py-4 text-left">
          <svg className="w-4 h-4 text-white/60 rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 4l8 6-8 6V4z" />
          </svg>
          <div>
            <h2 className="text-xl font-bold text-white">{day.label}</h2>
            <p className="text-white/40 text-xs">{day.items.length} items planned</p>
          </div>
        </button>
      </div>

      <div className="px-6 py-4">
        {day.items.map((item, i) => (
          <ItineraryItemCard
            key={i}
            item={item}
            onHover={onItemHover as any}
            onClick={onItemClick as any}
          />
        ))}
      </div>
    </div>
  )
}
