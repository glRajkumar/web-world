
// Brute Force: TC - O(N^2) SC - O(1)
export function p22(n: number) {
  for (let i = 0; i < 2 * n - 1; i++) {
    let row = ""

    for (let j = 0; j < 2 * n - 1; j++) {
      let top = i
      let left = j
      let bottom = (2 * n - 2) - i
      let right = (2 * n - 2) - j

      let minDist = Math.min(top, bottom, left, right)

      row += (n - minDist) + " "
    }

    console.log(row)
  }
}
