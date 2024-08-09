import { Role } from "@prisma/client"

export interface SessionUser {
  id: string
  masjidId: string
  email: string
  fullName: string
  role: Role
}

export interface EmailPasswordLoginRequest {
  email: string
  password: string
}
