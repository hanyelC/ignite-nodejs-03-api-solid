import supertest                                       from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { app }                       from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    const response = await supertest(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title:       'JavaScript Gym',
        description: 'Some description.',
        phone:       '1199999999',
        latitude:    -27.2092052,
        longitude:   -49.6401091,
      })

    expect(response.statusCode).toEqual(201)
  })
})
