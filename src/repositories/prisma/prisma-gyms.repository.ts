import { Gym, Prisma } from '@prisma/client'

import { prisma }                               from '@/lib/prisma'
import { FindManyNearbyParams, GymsRepository } from '@/repositories/gyms.repository'

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data
    })

    return gym
  }
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id
      }
    })

    return gym
  }
  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }
  async searchMany(search: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          mode:     'insensitive',
          contains: search
        }
      },
      skip: (page - 1) * 20,
      take: 20
    })

    return gyms
  }
}
