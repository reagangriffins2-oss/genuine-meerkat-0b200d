import { useEffect, useRef } from 'react'
import type * as Leaflet from 'leaflet'

import { CAMPUS_CENTER, CATEGORY_META, type Place } from '@/data/places'

type Props = {
  places: Place[]
  selectedId?: string
  userPos: { lat: number; lng: number } | null
  onSelect: (id: string) => void
}

// Leaflet touches `window` on import, so it is loaded lazily inside effects (client only).
export default function CampusMap({ places, selectedId, userPos, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Leaflet.Map | null>(null)
  const LRef = useRef<typeof Leaflet | null>(null)
  const markersRef = useRef<Map<string, Leaflet.Marker>>(new Map())
  const layerRef = useRef<Leaflet.LayerGroup | null>(null)
  const meRef = useRef<Leaflet.Marker | null>(null)
  const lineRef = useRef<Leaflet.Polyline | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const readyRef = useRef<Promise<void> | null>(null)

  // Create the map once.
  useEffect(() => {
    let cancelled = false
    readyRef.current = import('leaflet').then((mod) => {
      const L = ((mod as { default?: typeof Leaflet }).default ?? mod) as typeof Leaflet
      if (cancelled || !containerRef.current || mapRef.current) return
      LRef.current = L
      const map = L.map(containerRef.current, {
        center: CAMPUS_CENTER,
        zoom: 16,
        zoomControl: false,
      })
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)
      layerRef.current = L.layerGroup().addTo(map)
      mapRef.current = map
    })
    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current.clear()
    }
  }, [])

  // Sync markers with the filtered list.
  useEffect(() => {
    readyRef.current?.then(() => {
      const L = LRef.current
      const layer = layerRef.current
      if (!L || !layer) return
      layer.clearLayers()
      markersRef.current.clear()
      for (const p of places) {
        const color = CATEGORY_META[p.category].color
        const marker = L.marker([p.lat, p.lng], {
          icon: L.divIcon({
            className: `farm-pin${p.id === selectedId ? ' is-active' : ''}`,
            html: `<span style="background:${color}"></span>`,
            iconSize: [22, 22],
            iconAnchor: [11, 22],
          }),
          title: p.name,
          zIndexOffset: p.id === selectedId ? 1000 : 0,
        })
        marker.bindTooltip(p.name, { direction: 'top', offset: [0, -20] })
        marker.on('click', () => onSelectRef.current(p.id))
        marker.addTo(layer)
        markersRef.current.set(p.id, marker)
      }
    })
  }, [places, selectedId])

  // Fly to the selected place.
  useEffect(() => {
    readyRef.current?.then(() => {
      const map = mapRef.current
      const place = places.find((p) => p.id === selectedId)
      if (!map || !place) return
      map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 17), {
        duration: 0.6,
      })
    })
  }, [selectedId, places])

  // "You are here" dot plus a straight line to the selected place.
  useEffect(() => {
    readyRef.current?.then(() => {
      const L = LRef.current
      const map = mapRef.current
      if (!L || !map) return
      meRef.current?.remove()
      lineRef.current?.remove()
      meRef.current = null
      lineRef.current = null
      if (!userPos) return
      meRef.current = L.marker([userPos.lat, userPos.lng], {
        icon: L.divIcon({ className: 'farm-me', html: '<span></span>', iconSize: [16, 16] }),
        zIndexOffset: 2000,
      })
        .bindTooltip('You are here')
        .addTo(map)
      const place = places.find((p) => p.id === selectedId)
      if (place) {
        lineRef.current = L.polyline(
          [
            [userPos.lat, userPos.lng],
            [place.lat, place.lng],
          ],
          { color: '#8c1515', weight: 3, dashArray: '6 8', opacity: 0.8 },
        ).addTo(map)
        map.fitBounds(lineRef.current.getBounds(), { padding: [60, 60], maxZoom: 17 })
      } else {
        map.flyTo([userPos.lat, userPos.lng], 17, { duration: 0.6 })
      }
    })
  }, [userPos, selectedId, places])

  return <div ref={containerRef} className="h-full w-full" />
}
