import { compare }                            from 'bcrypt'
import { beforeEach, describe, expect, test } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { UsersRepository }         from '@/repositories/users.repository'
import { UserAlreadyExistsError }  from '@/use-cases/errors/user-already-exists.error'
import { RegisterUseCase }         from '@/use-cases/register'

describe('Register Use Case', () => {
  let usersRepository: UsersRepository
  let sut: RegisterUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  test('should be able to register', async () => {
    const { user } = await sut.execute({
      name:     'John Doe',
      email:    'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name:     'John Doe',
      email:    'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  test('should not be able to register with same email twice', async () => {
    const userData = {
      name:     'John Doe',
      email:    'johndoe@example.com',
      password: '123456',
    }

    await sut.execute(userData)

    await expect(() => sut.execute(userData))
      .rejects
      .toBeInstanceOf(UserAlreadyExistsError)
  })
})
