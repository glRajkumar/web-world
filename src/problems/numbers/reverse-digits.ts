
export function reverseDigits(n: number) {
  let revNum = 0

  while (n > 0) {
    let lastDigit = n % 10
    revNum = revNum * 10 + lastDigit

    n = Math.floor(n / 10)
  }

  return revNum

  // return n.toString().split("").reverse()
}
