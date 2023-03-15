import supertest                               from 'supertest'
import { afterAll, beforeAll, describe, test } from 'vitest'

import { app } from '@/app'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to register', async () => {
    await supertest(app.server)
      .post('/users')
      .send({
        name:     'John Doe',
        email:    'johndoe@example.com',
        password: '123456'
      })
      .expect(201)
  })
})
