export function safeJsonParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    console.error("Failed to parse JSON from storage")
    return null
  }
}

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    const parsed = safeJsonParse(raw)
    return parsed == null ? fallback : parsed
  } catch {
    console.error("Failed to read from storage", key)
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error("Failed to write to storage", key)
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    console.error("Failed to remove from storage", key)
  }
}
