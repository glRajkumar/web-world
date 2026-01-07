
// Brute Force: TC - O(N^2) SC - O(1)
export function p5_1(n: number) {
  /*
  for (let i = 0; i < n; i++) {
    let row = ""
    for (let j = n; j > i; j--) {
      row += "*"
    }
    console.log(row)
  }
  */

  for (let i = n; i > 0; i--) {
    let row = ""
    for (let j = 0; j < i; j++) {
      row += "*"
    }
    console.log(row)
  }
}

// Method 2: TC - O(N^2) SC - O(1)
export function p5_2(n: number) {
  for (let i = 0; i < n; i++) {
    // console.log(Array(n - i).fill("*").join("")) // SC - O(N)
    console.log("*".repeat(n - i))
  }
}
