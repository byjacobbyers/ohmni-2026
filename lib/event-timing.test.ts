import { describe, expect, it } from 'vitest'
import {
  classifyEventTiming,
  filterAndSortPastEvents,
  filterAndSortUpcomingEvents,
} from '@/lib/event-timing'

const today = '2026-07-23'

describe('classifyEventTiming', () => {
  it('marks in-range events as happening', () => {
    expect(
      classifyEventTiming({ startDate: '2026-07-20', endDate: '2026-07-25' }, today)
    ).toBe('happening')
    expect(classifyEventTiming({ startDate: '2026-07-23' }, today)).toBe('happening')
  })

  it('keeps yesterday-ended events as happening (grace day)', () => {
    expect(classifyEventTiming({ startDate: '2026-07-22' }, today)).toBe('happening')
    expect(
      classifyEventTiming({ startDate: '2026-07-20', endDate: '2026-07-22' }, today)
    ).toBe('happening')
  })

  it('marks events ended 2+ days ago as past', () => {
    expect(classifyEventTiming({ startDate: '2026-07-21' }, today)).toBe('past')
    expect(
      classifyEventTiming({ startDate: '2026-07-01', endDate: '2026-07-10' }, today)
    ).toBe('past')
  })

  it('marks future starts as upcoming', () => {
    expect(classifyEventTiming({ startDate: '2026-07-24' }, today)).toBe('upcoming')
    expect(classifyEventTiming({ startDate: '2026-08-01' }, today)).toBe('upcoming')
  })
})

describe('filterAndSortUpcomingEvents', () => {
  it('puts happening before upcoming and sorts closest first', () => {
    const sorted = filterAndSortUpcomingEvents(
      [
        { _id: 'far', startDate: '2026-08-10' },
        { _id: 'soon', startDate: '2026-07-25' },
        { _id: 'grace', startDate: '2026-07-22' },
        { _id: 'past', startDate: '2026-07-20' },
      ],
      today
    )
    expect(sorted.map((e) => e._id)).toEqual(['grace', 'soon', 'far'])
  })
})

describe('filterAndSortPastEvents', () => {
  it('orders most recently past first', () => {
    const sorted = filterAndSortPastEvents(
      [
        { _id: 'old', startDate: '2026-06-01' },
        { _id: 'newer', startDate: '2026-07-21' },
        { _id: 'mid', startDate: '2026-07-01', endDate: '2026-07-15' },
        { _id: 'live', startDate: '2026-07-23' },
      ],
      today
    )
    expect(sorted.map((e) => e._id)).toEqual(['newer', 'mid', 'old'])
  })
})
