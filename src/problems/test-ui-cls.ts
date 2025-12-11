
function hashFn(str: string = "", tableSize: number) {
  let hash = 13
  const len = str.length

  for (let i = 0; i < len; i++) {
    hash = (hash * str.charCodeAt(i)) % tableSize
  }

  return hash
}

export class HashTable {
  #count = 0
  size: number
  table: Map<string, any>[]

  constructor(size?: number) {
    this.size = size || 7
    this.table = new Array(this.size)

    for (let i = 0; i < this.size; i++) {
      this.table[i] = new Map()
    }
  }

  #resize() {
    const newTable = new Array(this.size * 2)
    const newSize = newTable.length

    for (let i = 0; i < newSize; i++) {
      newTable[i] = new Map()
    }

    this.table.forEach((item) => {
      if (item.size > 0) {
        item.forEach((val, key) => {
          const id = hashFn(key, newSize)
          newTable[id].set(key, val)
        })
      }
    })

    this.table = newTable
    this.size = this.size * 2
  }

  add(key: string, data: any) {
    const loadFactor = this.#count / this.size
    if (loadFactor > 0.8) {
      this.#resize()
    }

    const id = hashFn(key, this.size)
    this.table[id].set(key, data)
    this.#count++
  }

  remove(key: string) {
    const id = hashFn(key, this.size)
    this.table[id].delete(key)
    this.#count--
  }

  find(key: string) {
    const id = hashFn(key, this.size)
    return this.table[id].get(key)
  }

  isEmpty() {
    return this.#count === 0
  }

  getData() {
    return this.table
  }

  getLength() {
    return this.#count
  }
}

export class MathTools {
  multiply(a: number, b: number): number {
    return a * b
  }

  async delayedMultiply(a: number, b: number): Promise<number> {
    await new Promise((r) => setTimeout(r, 200))
    return a * b
  }
}

export class UserProfile {
  public name: string
  public age: number

  public readonly id: string

  private password: string
  private loginAttempts: number = 0

  constructor(name: string, age: number, id: string, password: string) {
    this.name = name
    this.age = age
    this.id = id
    this.password = password
  }

  public updateAge(newAge: number): void {
    this.age = newAge
  }

  public authenticate(pass: string): boolean {
    const isValid = this.validatePassword(pass)
    this.loginAttempts++

    return isValid
  }

  private validatePassword(pass: string): boolean {
    return pass === this.password
  }

  public getProfile() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      loginAttempts: this.loginAttempts,
    }
  }
}
