import { compare } from 'bcrypt'
import { describe, expect, test } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemory-users.repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/UserAlreadyExists.error'
import { RegisterUseCase } from '@/use-cases/register'

describe('Register Use Case', () => {
  test('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  test('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    }

    await registerUseCase.execute(userData)

    await expect(() => registerUseCase.execute(userData))
      .rejects
      .toBeInstanceOf(UserAlreadyExistsError)
  })
})
