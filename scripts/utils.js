export function toCamelCase(str) {
  return str
    .trim()
    .replace(/[-_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ""))
    .replace(/^(.)/, m => m.toLowerCase());
}

export function toPascalCase(str) {
  return str
    .split(/[-_]/g)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}

export function toTitle(str) {
  return str
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase())
}
