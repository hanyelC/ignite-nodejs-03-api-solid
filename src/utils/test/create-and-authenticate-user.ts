import { hash }            from 'bcrypt'
import { FastifyInstance } from 'fastify'
import supertest           from 'supertest'

import { prisma } from '@/lib/prisma'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  role: 'ADMIN' | 'MEMBER' = 'MEMBER'
) {
  await prisma.user.create({
    data: {
      name:          'John Doe',
      email:         'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role
    }
  })

  const authResponse = await supertest(app.server).post('/sessions').send({
    email:    'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
