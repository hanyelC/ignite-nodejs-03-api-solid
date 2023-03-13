import { beforeEach, describe, expect, test } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { CreateGymUseCase }       from '@/use-cases/create-gym'

describe('Create Gym Use Case', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: CreateGymUseCase

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  test('should to create gym', async () => {
    const { gym } = await sut.execute({
      title:       'JavaScript Gym',
      description: null,
      phone:       null,
      latitude:    -27.2092052,
      longitude:   -49.6401091,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
