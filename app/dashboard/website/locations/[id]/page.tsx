"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import { LOCATIONS } from "../../fixtures"

export default function LocationDetail(){
  const { id } = useParams<{ id: string }>()
  const loc = useMemo(()=> LOCATIONS.find(l => l.id === id), [id])
  if (!loc) return <div className="text-sm text-muted-foreground">Not found</div>
  const addr = loc.address
  const jsonLd = {
    '@context':'https://schema.org', '@type':'LocalBusiness', name: loc.name, telephone: loc.phone||undefined,
    address: addr ? { '@type':'PostalAddress', streetAddress: addr.line1, addressLocality: addr.city, addressRegion: addr.region, postalCode: addr.postal, addressCountry: addr.country } : undefined,
    geo: loc.coords ? { '@type':'GeoCoordinates', latitude: loc.coords.lat, longitude: loc.coords.lng } : undefined
  }
  return (
    <div className="space-y-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g,'\\u003c')}} />
      <h1 className="text-2xl font-semibold">{loc.name}</h1>
      {addr && (
        <div className="text-sm">{addr.line1}<br/>{addr.city} {addr.region} {addr.postal}<br/>{addr.country}</div>
      )}
      {loc.phone && <div className="text-sm">{loc.phone}</div>}
      {loc.coords && <div><a className="underline text-sm" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${loc.coords.lat},${loc.coords.lng}`}>View on Google Maps</a></div>}
    </div>
  )
}
