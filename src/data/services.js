export const services = [
  {
    id: 'regular',
    name: 'Regular Clean',
    tagline: '3–4 hours · Up to 3 bedrooms',
    price: 990,
    includes: [
      'Vacuuming & mopping all floors',
      'Bathroom scrub & sanitize',
      'Kitchen surfaces & sink',
      'Dusting furniture & shelves',
    ],
  },
  {
    id: 'deep',
    name: 'Deep Clean',
    tagline: '5–6 hours · Full property',
    price: 1590,
    popular: true,
    includes: [
      'Everything in Regular Clean',
      'Inside cabinets & drawers',
      'Baseboards, vents & light fixtures',
      'Balcony & utility area',
    ],
  },
  {
    id: 'moveout',
    name: 'Move-out Clean',
    tagline: '6–8 hours · Deposit-ready finish',
    price: 2490,
    includes: [
      'Everything in Deep Clean',
      'Inside all appliances',
      'Wall spot cleaning',
      'Before/after photo report',
    ],
  },
]

export const addons = [
  { id: 'fridge', name: 'Inside fridge', price: 200 },
  { id: 'oven', name: 'Inside oven', price: 200 },
  { id: 'windows', name: 'Interior windows', price: 150 },
  { id: 'laundry', name: 'Laundry & fold', price: 250 },
]

export const districts = [
  'Asok', 'Bang Na', 'Bang Rak', 'Chatuchak', 'Ekkamai',
  'Lat Phrao', 'On Nut', 'Pathum Wan', 'Phaya Thai', 'Phra Khanong',
  'Phrom Phong', 'Ratchathewi', 'Sathorn', 'Silom', 'Sukhumvit',
  'Thong Lo', 'Udom Suk', 'Victory Monument', 'Wang Thonglang',
]

export const timeSlots = [
  { id: '09:00', label: '9:00 AM' },
  { id: '11:00', label: '11:00 AM' },
  { id: '13:00', label: '1:00 PM' },
  { id: '15:00', label: '3:00 PM' },
]

// Simulate some fully booked dates
export const fullyBookedDates = new Set([
  '2026-04-22', '2026-04-25', '2026-04-29',
  '2026-05-03', '2026-05-07', '2026-05-12',
])

// Simulate some fully booked time slots per date
export const bookedSlots = {
  '2026-04-23': ['13:00'],
  '2026-04-24': ['09:00', '11:00'],
  '2026-04-26': ['15:00'],
  '2026-05-01': ['11:00', '13:00'],
}
