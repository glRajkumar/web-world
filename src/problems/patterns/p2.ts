
// Brute Force: TC - O(N^2) SC - O(1)
export function p2_1(n: number) {
  for (let i = 0; i < n; i++) {
    let row = "*"
    for (let j = 0; j < i; j++) {
      row += "*"
    }
    console.log(row)
  }
}

// Method 2: TC - O(N^2) SC - O(1)
export function p2_2(n: number) {
  for (let i = 0; i < n; i++) {
    // console.log(Array(i + 1).fill("*").join("")) // SC - O(N)
    console.log("*".repeat(i + 1))
  }
}
