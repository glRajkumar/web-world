
// Brute Force: TC - O(N^2) SC - O(1)
export function p16(n: number) {
  for (let i = 0; i < n; i++) {
    let row = ""

    for (let j = 0; j <= i; j++) {
      row += String.fromCharCode(65 + i)
    }

    console.log(row)
  }
}
