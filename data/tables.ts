export type Table = {
  id: string
  name: string
  area: string // Inside / Outside / Co-Working / Pickup
}
export const tables: Table[] = [
  // Inside tables
  { id: 'inside-1', name: 'Inside 1', area: 'Inside' },
  { id: 'inside-2', name: 'Inside 2', area: 'Inside' },
  { id: 'inside-3', name: 'Inside 3', area: 'Inside' },
  { id: 'inside-4', name: 'Inside 4', area: 'Inside' },
  { id: 'inside-5', name: 'Inside 5', area: 'Inside' },
  { id: 'inside-6', name: 'Inside 6', area: 'Inside' },

  // Outside tables
  { id: 'outside-1', name: 'Outside 1', area: 'Outside' },
  { id: 'outside-2', name: 'Outside 2', area: 'Outside' },
  { id: 'outside-3', name: 'Outside 3', area: 'Outside' },
  { id: 'outside-4', name: 'Outside 4', area: 'Outside' },
  { id: 'outside-5', name: 'Outside 5', area: 'Outside' },

  // Co-working (6 separate bills)
  { id: 'co-1', name: 'Co-Work Seat 1', area: 'Co-Working' },
  { id: 'co-2', name: 'Co-Work Seat 2', area: 'Co-Working' },
  { id: 'co-3', name: 'Co-Work Seat 3', area: 'Co-Working' },
  { id: 'co-4', name: 'Co-Work Seat 4', area: 'Co-Working' },
  { id: 'co-5', name: 'Co-Work Seat 5', area: 'Co-Working' },
  { id: 'co-6', name: 'Co-Work Seat 6', area: 'Co-Working' },

  // Pickup orders (virtual table)
  { id: 'pickup', name: 'Pickup Orders', area: 'Pickup' },
]
