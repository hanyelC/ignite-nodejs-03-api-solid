import { CheckIn, Prisma } from '@prisma/client'
import dayjs               from 'dayjs'
import { randomUUID }      from 'node:crypto'

import { CheckInsRepository } from '@/repositories/check-ins.repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((checkIn) => checkIn.user_id === userId).length
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id:           randomUUID(),
      created_at:   new Date(),
      gym_id:       data.gym_id,
      user_id:      data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null
    }

    this.items.push(checkIn)

    return structuredClone(checkIn)
  }

  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }

    return structuredClone(checkIn)
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return structuredClone(checkInOnSameDate)
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    }

    return checkIn
  }
}
