
// Brute Force: TC - O(N^2) SC - O(1)
export function p1_1(n: number) {
  for (let i = 0; i < n; i++) {
    let row = ""
    for (let j = 0; j < n; j++) {
      row += "* "
    }
    console.log(row.trim())
  }
}


// Optimised
export function p1_2(n: number) {
  for (let i = 0; i < n; i++) {
    console.log(Array(n).fill("*").join(" "))
  }
}
