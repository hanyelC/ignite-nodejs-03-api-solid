import supertest                                       from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { app }                       from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await supertest(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.status).toEqual(200)
    expect(profileResponse.body).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com'
      })
    )
  })
})
