import supertest                                       from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { app } from '@/app'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to authenticate', async () => {
    await supertest(app.server)
      .post('/users')
      .send({
        name:     'John Doe',
        email:    'johndoe@example.com',
        password: '123456'
      })

    const response = await supertest(app.server)
      .post('/sessions')
      .send({
        email:    'johndoe@example.com',
        password: '123456'
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String)
    })
  })
})
