import supertest                                       from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { app }                       from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    await supertest(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title:       'JavaScript Gym',
        description: 'Some description.',
        phone:       '1199999999',
        latitude:    -27.2092052,
        longitude:   -49.6401091,
      })

    await supertest(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title:       'TypeScript Gym',
        description: 'Some description.',
        phone:       '1199999999',
        latitude:    -27.0610928,
        longitude:   -49.5229501,
      })

    const response = await supertest(app.server)
      .get('/gyms/nearby')
      .query({
        latitude:  -27.2092052,
        longitude: -49.6401091,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
