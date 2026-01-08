
// Brute Force: TC - O(N^2) SC - O(1)
export function p13(n: number) {
  let curr = 1
  for (let i = 0; i < n; i++) {
    curr = curr + i
    let row = `${curr}`

    for (let j = 0; j < i; j++) {
      row += curr + j + 1
    }

    console.log(row)
  }
}
