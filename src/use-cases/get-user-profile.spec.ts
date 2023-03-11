import { hash }                               from 'bcrypt'
import { beforeEach, describe, expect, test } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { UsersRepository }         from '@/repositories/users.repository'
import { ResourceNotFoundError }   from '@/use-cases/errors/resource-not-found.error'
import { GetUserProfileUseCase }   from '@/use-cases/get-user-profile'

describe('Get user profile Use Case', () => {
  let usersRepository: UsersRepository
  let sut: GetUserProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  test('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name:          'John Doe',
      email:         'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      id: createdUser.id
    })

    expect(user.name).toEqual(createdUser.name)
  })

  test('should not be able to get user profile with wrong id', async () => {
    await expect(() => sut.execute({ id: 'non-existing-id' }))
      .rejects
      .toBeInstanceOf(ResourceNotFoundError)
  })
})
