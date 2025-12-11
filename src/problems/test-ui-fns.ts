
export function calculateSum(firstNumber: number, secondNumber: number) {
  return firstNumber + secondNumber;
}

export function createUser(
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

export function processOrder(
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

export function mixedParamsFunction(
  name: string,
  age: number,
  isActive: boolean,
  address: {
    street: string
    city: string
    coordinates: { lat: number; lng: number }
  },
  skills: string[],
  scores: number[],
  items: { id: number; label: string }[],
  settings: {
    theme: string
    shortcuts: string[]
    permissions: boolean[]
  },
  meta: Record<string, any>,
  flags: boolean[],
  tupleExample: [string, number, boolean],
  idOrName: number | string,
  mixedArray: (string | number | boolean)[],
  preferences: {
    ui: { mode: "light" | "dark"; scale: number }
    notifications: { email: boolean; sms: boolean }
    categories: string[]
  },
  status: "pending" | "active" | "disabled"
) {
  return {
    name,
    age,
    isActive,
    address,
    skills,
    scores,
    items,
    settings,
    meta,
    flags,
    tupleExample,
    idOrName,
    mixedArray,
    preferences,
    status,
  }
}
