import Papa from 'papaparse'
import fs from 'fs'
import path from 'path'

export interface Place {
  name: string
  category: 'hotel' | 'restaurant' | 'activity' | 'transit'
  address: string
  lat: number
  lng: number
  date_start?: string
  date_end?: string
  notes: string
  booked: boolean
}

export interface ItineraryItem {
  date: string
  time: string
  name: string
  category: 'hotel' | 'restaurant' | 'activity' | 'transit'
  address: string
  lat: number
  lng: number
  notes: string
}

export interface DayGroup {
  date: string
  label: string
  items: ItineraryItem[]
}

function readCSV<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), 'data', filename)
  const file = fs.readFileSync(filePath, 'utf-8')
  const result = Papa.parse<T>(file, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    transformHeader: (h) => h.trim(),
    transform: (v) => v.trim(),
  })
  return result.data
}

export function getPlaces(): Place[] {
  const raw = readCSV<Record<string, string>>('places.csv')
  return raw.map((r) => ({
    name: r.name,
    category: r.category as Place['category'],
    address: r.address,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lng),
    date_start: r.date_start || undefined,
    date_end: r.date_end || undefined,
    notes: r.notes,
    booked: r.booked === 'yes',
  }))
}

export function getItinerary(): DayGroup[] {
  const raw = readCSV<Record<string, string>>('itinerary.csv')
  const items: ItineraryItem[] = raw.map((r) => ({
    date: r.date,
    time: r.time,
    name: r.name,
    category: r.category as ItineraryItem['category'],
    address: r.address,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lng),
    notes: r.notes,
  }))

  const grouped = new Map<string, ItineraryItem[]>()
  for (const item of items) {
    const existing = grouped.get(item.date) || []
    existing.push(item)
    grouped.set(item.date, existing)
  }

  const days: DayGroup[] = []
  for (const [date, dayItems] of grouped) {
    const d = new Date(date + 'T12:00:00')
    const label = d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    days.push({ date, label, items: dayItems })
  }

  return days.sort((a, b) => a.date.localeCompare(b.date))
}
