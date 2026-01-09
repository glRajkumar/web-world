
// Brute Force: TC - O(N^2) SC - O(1)
export function p21(n: number) {
  for (let i = 0; i < n; i++) {
    let row = ""

    // if (i === 0 || i + 1 === n) {
    //   row = "*".repeat(n)
    // }
    // else {
    //   for (let j = 0; j < n; j++) {
    //     row += (j === 0 || j + 1 === n) ? "*" : " "
    //   }
    // }

    for (let j = 0; j < n; j++) {
      if (i === 0 || j === 0 || i === n - 1 || j === n - 1)
        row += "*"
      else
        row += " "
    }

    console.log(row)
  }
}
