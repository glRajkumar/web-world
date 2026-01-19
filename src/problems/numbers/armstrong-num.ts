
export function armstrongNum(num: number) {
  const k = num.toString().length
  let sum = 0
  let n = num

  while (n > 0) {
    const ld = n % 10
    sum += Math.pow(ld, k)
    n = Math.floor(n / 10)
  }

  return sum === num
}
