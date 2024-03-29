import { FastifyInstance } from 'fastify'

import { verifyJwt }    from '@/http/middlewares/verify-jwt'
import { authenticate } from './authenticate.controller'
import { profile }      from './profile.controller'
import { register }     from './register.controller'
import { refresh }      from './refresh.controller'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
