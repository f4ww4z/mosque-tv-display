import jwt from "jsonwebtoken"
import { SessionUser } from "types/user"

export function generateJWTToken(user: SessionUser) {
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
  return token
}

export function verifyAndDecodeJWTToken<T>(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET) as T
}

export function saveJWTToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

export function removeJWTToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
  }
}

export function getJWTToken() {
  if (typeof window === "undefined") {
    return null
  }

  return localStorage.getItem("token")
}
