import { getPlaces, getItinerary } from '@/lib/data'
import TripPlanner from '@/components/TripPlanner'

export default function Home() {
  const places = getPlaces()
  const days = getItinerary()

  return <TripPlanner places={places} days={days} />
}
