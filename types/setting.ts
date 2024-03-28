interface Setting {
  id: string
  name:
    | "Time until iqamah (mins)"
    | "Prayer mode duration after iqamah (mins)"
    | "Prayer mode duration tarawih (mins)"
  value: string
}
