
// Brute Force: TC - O(N^2) SC - O(1)
export function p10_1(n: number) {
  for (let i = 0; i < 2 * n; i++) {
    let row = ""

    const stars = i > n ? 2 * n - i : i
    for (let j = 0; j < stars; j++) {
      row += "*"
    }

    console.log(row)
  }
}

// Method 2: TC - O(N^2) SC - O(1)
export function p10_2(n: number) {
  for (let i = 0; i < 2 * n; i++) {
    let row = ""
    const stars = i > n ? 2 * n - i : i
    row += "*".repeat(stars)
    console.log(row)
  }
}