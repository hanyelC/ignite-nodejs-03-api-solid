import { beforeEach, describe, expect, test } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { GetUserMetricsUseCase }      from '@/use-cases/get-user-metrics'

describe('Get user metrics Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: GetUserMetricsUseCase

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  test('should be able to get check-in count from metrics', async () => {
    await checkInsRepository.create({
      gym_id:  'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id:  'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
