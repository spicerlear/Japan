import { getPlaces, getItinerary, getTrails } from '@/lib/data'
import TripPlanner from '@/components/TripPlanner'

export default function Home() {
  const places = getPlaces()
  const days = getItinerary()
  const trails = getTrails()

  return <TripPlanner places={places} days={days} trails={trails} />
}
