import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID }      from 'node:crypto'

import { CheckInsRepository } from '@/repositories/check-ins.repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id:           randomUUID(),
      created_at:   new Date(),
      gym_id:       data.gym_id,
      user_id:      data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null
    }

    this.items.push(checkIn)

    return checkIn
  }
}
