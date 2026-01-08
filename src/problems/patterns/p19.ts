
// Brute Force: TC - O(N^2) SC - O(1)
export function p19(n: number) {
  for (let i = 0; i < n; i++) {
    let firstHalf = ""
    let secondHalf = ""

    for (let j = 0; j < n; j++) {
      let curr = n - i > j ? "*" : " "
      firstHalf += curr
      secondHalf = curr + secondHalf
    }

    console.log(firstHalf + secondHalf)
  }

  for (let i = 0; i < n; i++) {
    let firstHalf = ""
    let secondHalf = ""

    for (let j = 0; j < n; j++) {
      let curr = i + j + 1 > n - 1 ? "*" : " "
      firstHalf = curr + firstHalf
      secondHalf += curr
    }

    console.log(firstHalf + secondHalf)
  }
}
