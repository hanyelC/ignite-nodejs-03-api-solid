import supertest                                       from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { app }                       from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to search gyms by title', async () => {
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
        latitude:    -27.2092052,
        longitude:   -49.6401091,
      })

    const response = await supertest(app.server)
      .get('/gyms/search')
      .query({
        search: 'JavaScript',
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
