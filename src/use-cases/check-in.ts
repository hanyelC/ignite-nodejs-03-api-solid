import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/repositories/check-ins.repository'

interface CheckInUseCaseRequest {
  gymId: string
  userId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    gymId,
    userId
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(userId, new Date())

    if (checkInOnSameDay) {
      throw new Error()
    }

    const checkIn = await this.checkInRepository.create({
      gym_id:  gymId,
      user_id: userId
    })

    return { checkIn }
  }
}
