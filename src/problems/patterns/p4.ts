
// Brute Force: TC - O(N^2) SC - O(1)
export function p4_1(n: number) {
  for (let i = 0; i < n; i++) {
    let row = ""
    for (let j = 0; j <= i; j++) {
      row += `${i + 1}`
    }
    console.log(row)
  }
}

// Method 2: TC - O(N^2) SC - O(N)
export function p4_2(n: number) {
  for (let i = 0; i < n; i++) {
    console.log(Array(i + 1).fill(1).map(() => i + 1).join(""))
  }
}
