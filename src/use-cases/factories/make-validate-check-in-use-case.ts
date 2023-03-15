import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository'
import { ValidateCheckInUseCase }   from '@/use-cases/validate-check-in'

export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInUseCase(checkInRepository)

  return useCase
}
