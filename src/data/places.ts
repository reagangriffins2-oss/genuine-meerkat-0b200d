// Campus places shown on the map and selectable as timetable locations.
// Coordinates are approximate building centres — good enough for wayfinding on foot or by bike.

export type PlaceCategory =
  | 'academics'
  | 'libraries'
  | 'food'
  | 'housing'
  | 'landmarks'
  | 'recreation'
  | 'health'
  | 'transit'

export type Place = {
  id: string
  name: string
  category: PlaceCategory
  lat: number
  lng: number
  blurb: string
  tip?: string
}

export const CATEGORY_META: Record<
  PlaceCategory,
  { label: string; color: string }
> = {
  academics: { label: 'Classes', color: '#8C1515' },
  libraries: { label: 'Libraries', color: '#5D4B3C' },
  food: { label: 'Food & coffee', color: '#E98300' },
  housing: { label: 'Dorms', color: '#6A7F3A' },
  landmarks: { label: 'Landmarks', color: '#175E54' },
  recreation: { label: 'Rec & sports', color: '#006CB8' },
  health: { label: 'Health', color: '#B1040E' },
  transit: { label: 'Getting around', color: '#53284F' },
}

export const CAMPUS_CENTER: [number, number] = [37.4275, -122.1697]

export const PLACES: Place[] = [
  // Landmarks
  {
    id: 'main-quad',
    name: 'Main Quad',
    category: 'landmarks',
    lat: 37.4274,
    lng: -122.1697,
    blurb:
      'The sandstone heart of campus. Most humanities classes live in the numbered buildings around the arcade.',
    tip: 'Building numbers go clockwise from the front — 01 is next to the main arch, 200 is Lane History Corner.',
  },
  {
    id: 'memorial-church',
    name: 'Memorial Church',
    category: 'landmarks',
    lat: 37.4268,
    lng: -122.1703,
    blurb: 'The mosaic-fronted church at the back of the Main Quad.',
    tip: 'Free organ recitals some weekday afternoons — a great quiet break between classes.',
  },
  {
    id: 'hoover-tower',
    name: 'Hoover Tower',
    category: 'landmarks',
    lat: 37.4277,
    lng: -122.1665,
    blurb: 'The tallest thing on campus and the easiest way to reorient yourself.',
    tip: 'The observation deck gives you the whole campus layout in one look.',
  },
  {
    id: 'the-oval',
    name: 'The Oval & Palm Drive',
    category: 'landmarks',
    lat: 37.4302,
    lng: -122.1692,
    blurb: 'The big lawn at the end of Palm Drive — the classic front door to campus.',
  },
  {
    id: 'cantor',
    name: 'Cantor Arts Center',
    category: 'landmarks',
    lat: 37.4330,
    lng: -122.1703,
    blurb: 'Free art museum, plus the Rodin Sculpture Garden right next door.',
  },
  {
    id: 'white-plaza',
    name: 'White Plaza',
    category: 'landmarks',
    lat: 37.4249,
    lng: -122.1696,
    blurb: 'Student-life crossroads with club tables, the Claw fountain and the bookstore.',
  },
  {
    id: 'bing',
    name: 'Bing Concert Hall',
    category: 'landmarks',
    lat: 37.4296,
    lng: -122.1658,
    blurb: 'Concert hall with cheap student tickets for most shows.',
  },

  // Academics
  {
    id: 'gates',
    name: 'Gates Computer Science',
    category: 'academics',
    lat: 37.4300,
    lng: -122.1733,
    blurb: 'Home of CS. Office hours, CS106 sections and lots of late nights.',
  },
  {
    id: 'huang',
    name: 'Huang Engineering Center',
    category: 'academics',
    lat: 37.4277,
    lng: -122.1745,
    blurb: 'Big lecture halls and study tables in the Science & Engineering Quad.',
    tip: 'The basement has some of the best group study rooms on campus.',
  },
  {
    id: 'y2e2',
    name: 'Y2E2 (Environment & Energy)',
    category: 'academics',
    lat: 37.4271,
    lng: -122.1752,
    blurb: 'Sustainability classes and the Coupa Café cart out front.',
  },
  {
    id: 'hewlett',
    name: 'Hewlett Teaching Center',
    category: 'academics',
    lat: 37.4290,
    lng: -122.1724,
    blurb: 'Large intro lectures — Hewlett 200 is one of the biggest rooms on campus.',
  },
  {
    id: 'lane-history',
    name: 'Lane History Corner (Bldg 200)',
    category: 'academics',
    lat: 37.4278,
    lng: -122.1690,
    blurb: 'History department classrooms on the corner of the Main Quad.',
  },
  {
    id: 'encina',
    name: 'Encina Hall',
    category: 'academics',
    lat: 37.4273,
    lng: -122.1656,
    blurb: 'Economics, political science and international studies.',
  },
  {
    id: 'cubberley',
    name: 'Cubberley Auditorium',
    category: 'academics',
    lat: 37.4264,
    lng: -122.1667,
    blurb: 'School of Education building with a big lecture auditorium.',
  },
  {
    id: 'gsb',
    name: 'Knight Management Center (GSB)',
    category: 'academics',
    lat: 37.4282,
    lng: -122.1612,
    blurb: 'The Graduate School of Business campus, across from the arts district.',
  },
  {
    id: 'law',
    name: 'Stanford Law School',
    category: 'academics',
    lat: 37.4238,
    lng: -122.1680,
    blurb: 'Crown Quad, near the bookstore end of White Plaza.',
  },

  // Libraries
  {
    id: 'green-library',
    name: 'Green Library',
    category: 'libraries',
    lat: 37.4269,
    lng: -122.1673,
    blurb: 'The main library. The Bender Room is the quietest reading room on campus.',
    tip: 'Use the east entrance facing Meyer Green — it’s closer to the stacks.',
  },
  {
    id: 'lathrop',
    name: 'Lathrop Library',
    category: 'libraries',
    lat: 37.4262,
    lng: -122.1667,
    blurb: 'Tech lounge, printing and late-night study space beside Meyer Green.',
  },
  {
    id: 'engineering-library',
    name: 'Engineering Library (Huang)',
    category: 'libraries',
    lat: 37.4279,
    lng: -122.1742,
    blurb: 'Compact, quiet library inside Huang — good for problem sets.',
  },

  // Food & coffee
  {
    id: 'tresidder',
    name: 'Tresidder Union',
    category: 'food',
    lat: 37.4243,
    lng: -122.1709,
    blurb: 'Food court, coffee, the post office and meeting rooms all in one place.',
  },
  {
    id: 'coupa-y2e2',
    name: 'Coupa Café (Y2E2)',
    category: 'food',
    lat: 37.4274,
    lng: -122.1755,
    blurb: 'The default coffee meeting spot for engineering students.',
  },
  {
    id: 'arrillaga-dining',
    name: 'Arrillaga Family Dining Commons',
    category: 'food',
    lat: 37.4256,
    lng: -122.1774,
    blurb: 'Big dining hall with the widest menu on west campus.',
  },
  {
    id: 'stern-dining',
    name: 'Stern Dining',
    category: 'food',
    lat: 37.4243,
    lng: -122.1653,
    blurb: 'Dining hall close to Wilbur and Stern — handy after east-campus classes.',
  },
  {
    id: 'lakeside',
    name: 'Lakeside Dining',
    category: 'food',
    lat: 37.4236,
    lng: -122.1756,
    blurb: 'Dining hall by Lake Lagunita, with outdoor seating.',
  },

  // Housing
  {
    id: 'flomo',
    name: 'Florence Moore Hall (FloMo)',
    category: 'housing',
    lat: 37.4224,
    lng: -122.1715,
    blurb: 'A cluster of first-year houses with its own dining hall.',
  },
  {
    id: 'wilbur',
    name: 'Wilbur Hall',
    category: 'housing',
    lat: 37.4242,
    lng: -122.1630,
    blurb: 'First-year dorm complex on the east side of campus.',
  },
  {
    id: 'stern',
    name: 'Stern Hall',
    category: 'housing',
    lat: 37.4250,
    lng: -122.1655,
    blurb: 'First-year and upperclass houses beside Stern Dining.',
  },
  {
    id: 'roble',
    name: 'Roble Hall',
    category: 'housing',
    lat: 37.4258,
    lng: -122.1757,
    blurb: 'One of the oldest dorms, next to the Roble gym and fields.',
  },

  // Recreation
  {
    id: 'aoerc',
    name: 'Arrillaga Outdoor Education & Rec Center',
    category: 'recreation',
    lat: 37.4232,
    lng: -122.1745,
    blurb: 'Main gym, climbing wall and pool. Bring your student ID.',
  },
  {
    id: 'lagunita',
    name: 'Lake Lagunita',
    category: 'recreation',
    lat: 37.4221,
    lng: -122.1772,
    blurb: 'A (usually dry) lake with a loop path — great for an easy walk or run.',
  },
  {
    id: 'stadium',
    name: 'Stanford Stadium',
    category: 'recreation',
    lat: 37.4346,
    lng: -122.1612,
    blurb: 'Football Saturdays. Students get in free with ID.',
  },
  {
    id: 'maples',
    name: 'Maples Pavilion',
    category: 'recreation',
    lat: 37.4302,
    lng: -122.1627,
    blurb: 'Basketball and volleyball games.',
  },
  {
    id: 'dish',
    name: 'The Dish Trailhead',
    category: 'recreation',
    lat: 37.4100,
    lng: -122.1683,
    blurb: 'A 3.5-mile loop up into the foothills past the big radio telescope.',
    tip: 'Go just before sunset. Open dawn to dusk only — no bikes or dogs.',
  },

  // Health
  {
    id: 'vaden',
    name: 'Vaden Health Center',
    category: 'health',
    lat: 37.4221,
    lng: -122.1649,
    blurb: 'Student health and counseling (CAPS). Book appointments online.',
  },
  {
    id: 'hospital',
    name: 'Stanford Hospital',
    category: 'health',
    lat: 37.4337,
    lng: -122.1757,
    blurb: 'Emergency department is open 24/7. In an emergency, call 911.',
  },

  // Transit
  {
    id: 'caltrain',
    name: 'Palo Alto Caltrain',
    category: 'transit',
    lat: 37.4434,
    lng: -122.1650,
    blurb: 'Trains to San Francisco and San José. The free Marguerite shuttle stops here.',
  },
  {
    id: 'bookstore',
    name: 'Stanford Bookstore',
    category: 'transit',
    lat: 37.4247,
    lng: -122.1689,
    blurb: 'Main Marguerite shuttle hub on campus — the Y and X lines stop nearby.',
  },
  {
    id: 'shopping-center',
    name: 'Stanford Shopping Center',
    category: 'transit',
    lat: 37.4434,
    lng: -122.1717,
    blurb: 'Groceries, pharmacy and food — about a 10 minute bike ride from the Quad.',
  },
]

export function getPlace(id: string | undefined | null) {
  if (!id) return undefined
  return PLACES.find((p) => p.id === id)
}

// Straight-line distance in metres.
export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Rough travel times. Paths on campus wind a bit, so add 25% to the straight line.
export function travelMinutes(meters: number) {
  const route = meters * 1.25
  return {
    walk: Math.max(1, Math.round(route / 80)),
    bike: Math.max(1, Math.round(route / 250)),
  }
}

export function directionsUrl(place: Place, mode: 'walking' | 'bicycling' = 'walking') {
  return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&travelmode=${mode}`
}
