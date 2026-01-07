
// Brute Force: TC - O(N^2) SC - O(1)
export function p9_1(n: number) {
  // top pyramid
  for (let i = 0; i < n; i++) {
    let row = ""

    for (let j = 0; j < n - i - 1; j++) {
      row += " "
    }

    for (let j = 0; j < 2 * i + 1; j++) {
      row += "*"
    }

    for (let j = 0; j < n - i - 1; j++) {
      row += " "
    }

    console.log(row)
  }

  // bottom - inverted pyramid
  for (let i = 0; i < n; i++) {
    let row = ""

    for (let j = 0; j < i; j++) {
      row += " "
    }

    const till = 2 * n - (2 * i + 1)
    for (let j = 0; j < till; j++) {
      row += "*"
    }

    for (let j = 0; j < i; j++) {
      row += " "
    }

    console.log(row)
  }
}

// Method 2: TC - O(N^2) SC - O(1)
export function p9_2(n: number) {
  // top pyramid
  for (let i = 0; i < n; i++) {
    let row = ""
    const spaces = " ".repeat(n - i - 1)
    const stars = "*".repeat(2 * i + 1)
    row += `${spaces}${stars}${spaces}`
    console.log(row)
  }

  // bottom - inverted pyramid
  for (let i = 0; i < n; i++) {
    let row = ""
    const spaces = " ".repeat(i)
    const stars = "*".repeat(2 * n - (2 * i + 1))
    row += `${spaces}${stars}${spaces}`
    console.log(row)
  }
}