import NextAuth from "next-auth"
import { SessionUser } from "./user"

declare module "next-auth" {
  interface User extends SessionUser {}

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: SessionUser
  }
}
