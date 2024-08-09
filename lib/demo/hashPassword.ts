import bcrypt from "bcrypt"

const args = process.argv.slice(2)

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

if (args.length === 0) {
  console.log("Please provide a password to hash")
} else {
  const password = args[0]
  hashPassword(password)
    .then((hashedPassword) => {
      console.log(`Hashed password: ${hashedPassword}`)
    })
    .catch((error) => {
      console.error(error)
    })
}
