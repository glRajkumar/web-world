
export function countDigits(n: number) {
  let result = 0

  while (n > 0) {
    result += 1
    n = Math.floor(n / 10)
  }

  return result

  // return Math.floor(Math.log10(n) + 1)

  // return `${n}`.length
}
