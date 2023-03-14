import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { ValidateCheckInUseCase }     from '@/use-cases/validate-checkin'
import { ResourceNotFoundError }      from './errors/resource-not-found.error'

describe('Check-in Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: ValidateCheckInUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useRealTimers()
  })

  test('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id:  'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  test('should not be able to validate inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
