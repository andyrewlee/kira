export type Loc = {
  id: string
  name: string
  business_name?: string
  phone?: string
  address?: { line1?: string; city?: string; region?: string; postal?: string; country?: string }
  coords?: { lat: number; lng: number }
  timezone?: string
  hours?: Record<string, { start: string; end: string }[]>
}

export const LOCATIONS: Loc[] = [
  { id: 'main', name: 'Kira Coffee — Main', phone: '+1 555-0100', address: { line1: '123 Main St', city: 'San Francisco', region: 'CA', postal: '94114', country: 'US' }, coords: { lat: 37.76, lng: -122.43 }, timezone: 'America/Los_Angeles', hours: { MON:[{start:'07:00',end:'18:00'}], TUE:[{start:'07:00',end:'18:00'}], WED:[{start:'07:00',end:'18:00'}], THU:[{start:'07:00',end:'18:00'}], FRI:[{start:'07:00',end:'18:00'}], SAT:[{start:'08:00',end:'17:00'}], SUN:[{start:'08:00',end:'17:00'}] } },
  { id: 'east', name: 'Kira Coffee — East', phone: '+1 555-0101', address: { line1: '456 East Rd', city: 'Oakland', region: 'CA', postal: '94607', country: 'US' }, coords: { lat: 37.80, lng: -122.27 }, timezone: 'America/Los_Angeles' },
  { id: 'mid', name: 'Kira Coffee — Midtown', phone: '+1 555-0102', address: { line1: '789 Midtown Ave', city: 'New York', region: 'NY', postal: '10010', country: 'US' }, coords: { lat: 40.74, lng: -73.98 }, timezone: 'America/New_York' },
]

export function openNow(tz?: string, hours?: Loc['hours']){
  if (!tz || !hours) return null
  const now = new Date()
  const day = ['SUN','MON','TUE','WED','THU','FRI','SAT'][now.getUTCDay()]
  const ranges = hours[day as keyof typeof hours] || []
  for (const r of ranges){
    const [sh,sm] = r.start.split(':').map(Number)
    const [eh,em] = r.end.split(':').map(Number)
    const s = new Date(now); s.setHours(sh,sm,0,0)
    const e = new Date(now); e.setHours(eh,em,0,0)
    if (now >= s && now <= e) return true
  }
  return false
}

