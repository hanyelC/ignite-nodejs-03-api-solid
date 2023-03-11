import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { CheckInUseCase }             from '@/use-cases/check-in'

describe('Check-in Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: CheckInUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId:  'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  test('should no be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 10, 0))

    const checkInData = {
      gymId:  'gym-01',
      userId: 'user-01',
    }

    await sut.execute(checkInData)

    await expect(() => sut.execute(checkInData))
      .rejects
      .toBeInstanceOf(Error)
  })

  test('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 10, 0))

    const checkInData = {
      gymId:  'gym-01',
      userId: 'user-01',
    }

    await sut.execute(checkInData)

    vi.setSystemTime(new Date(2023, 0, 1, 11, 0))

    const { checkIn } = await sut.execute(checkInData)

    expect(checkIn.id).toBe(expect.any(String))
  })
})
