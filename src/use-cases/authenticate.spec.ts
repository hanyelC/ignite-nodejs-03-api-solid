import { hash } from 'bcrypt'
import { beforeEach, describe, expect, test } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { UsersRepository } from '@/repositories/users.repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials.error'

describe('Authenticate Use Case', () => {
  let usersRepository: UsersRepository
  let sut: AuthenticateUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  test('should be able to authenticate', async () => {
    await usersRepository.create({
      name:          'John Doe',
      email:         'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email:    'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email:    'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  test('should not be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name:          'John Doe',
      email:         'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email:    'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
