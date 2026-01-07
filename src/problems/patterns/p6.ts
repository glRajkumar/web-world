
// Brute Force: TC - O(N^2) SC - O(1)
export function p6_1(n: number) {
  for (let i = n; i > 0; i--) {
    let row = ""
    for (let j = 0; j < i; j++) {
      row += `${j + 1}`
    }
    console.log(row)
  }
}

// Method 2: TC - O(N^2) SC - O(N)
export function p6_2(n: number) {
  for (let i = 0; i < n; i++) {
    console.log(Array(n - i).fill(1).map((_, j) => j + 1).join(""))
  }
}
