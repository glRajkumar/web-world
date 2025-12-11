

export function calculateSum(firstNumber: number, secondNumber: number) {
  return firstNumber + secondNumber;
}

export async function createUser(
  username: string,
  isActive: boolean,
  tags: string[],
  metadata: Record<string, any>
) {
  return {
    id: Math.floor(Math.random() * 1000000),
    username,
    isActive,
    tags,
    metadata,
    createdAt: new Date().toISOString(),
  };
}

export async function processOrder(
  orderId: string,
  items: Array<{ name: string; qty: number; price: number }>,
  shipping: { address: string; city: string; express: boolean }
) {
  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return {
    orderId,
    items,
    shipping,
    total,
    status: shipping.express ? "EXPRESS_PROCESSING" : "PENDING",
  };
}

export function parseValue(value: string, parseAsNumber: boolean) {
  if (parseAsNumber) {
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  }
  return String(value);
}

export function filterNumbers(
  numbers: number[],
  threshold: number,
  includeEqual: boolean
) {
  return numbers.filter((n) =>
    includeEqual ? n >= threshold : n > threshold
  );
}

export function logMessage(
  message: string,
  severity: string = "info",
  timestamp: boolean = false
) {
  const tag = `[${severity.toUpperCase()}]`;
  const time = timestamp ? ` @ ${new Date().toISOString()}` : "";
  return `${tag} ${message}${time}`;
}

export class MathTools {
  multiply(a: number, b: number): number {
    return a * b;
  }

  async delayedMultiply(a: number, b: number): Promise<number> {
    await new Promise((r) => setTimeout(r, 200));
    return a * b;
  }
}
