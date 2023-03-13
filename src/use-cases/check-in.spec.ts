import { Decimal }                                           from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { InMemoryGymsRepository }     from '@/repositories/in-memory/in-memory-gyms.repository'
import { CheckInUseCase }             from '@/use-cases/check-in'
import { MaxDistanceError }           from '@/use-cases/errors/max-distance.error'
import { MaxNumberOfCheckInsError }   from '@/use-cases/errors/max-number-of-check-ins.error'

describe('Check-in Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: CheckInUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items = [{
      description: 'NodeJs Gym',
      id:          'gym-01',
      latitude:    new Decimal(-21.069951),
      longitude:   new Decimal(-40.836458),
      phone:       '',
      title:       ''
    }]

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId:         'gym-01',
      userId:        'user-01',
      userLatitude:  -21.069951,
      userLongitude: -40.836458
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  test('should no be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 10, 0))

    const checkInData = {
      gymId:         'gym-01',
      userId:        'user-01',
      userLatitude:  -21.069661,
      userLongitude: -40.836434
    }

    await sut.execute(checkInData)

    await expect(() => sut.execute(checkInData))
      .rejects
      .toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  test('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 10, 0))

    const checkInData = {
      gymId:         'gym-01',
      userId:        'user-01',
      userLatitude:  -21.069951,
      userLongitude: -40.836458
    }

    await sut.execute(checkInData)

    vi.setSystemTime(new Date(2023, 0, 2, 11, 0))

    const { checkIn } = await sut.execute(checkInData)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  test('should not be able to check in on distant gym', async () => {
    await expect(() =>
      sut.execute({
        gymId:         'gym-01',
        userId:        'user-01',
        userLatitude:  -21.068048,
        userLongitude: -40.836260
      }),

    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
