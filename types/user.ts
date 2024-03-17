import { Role } from "@prisma/client"

export interface SessionUser {
  id: string
  email: string
  fullName: string
  role: Role
}
