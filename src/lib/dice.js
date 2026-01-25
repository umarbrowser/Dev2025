export const DICE_COUNT = 10
export const DIE_MIN = 1
export const DIE_MAX = 6

function randomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createDie(overrides = {}) {
  return {
    id: makeId(),
    value: randomIntInclusive(DIE_MIN, DIE_MAX),
    isHeld: false,
    ...overrides,
  }
}

export function createDiceSet(count = DICE_COUNT) {
  return new Array(count).fill(0).map(() => createDie())
}

export function rollUnheldDice(dice) {
  return dice.map((die) => (die.isHeld ? die : createDie({ id: die.id })))
}

export function toggleHold(dice, id) {
  return dice.map((die) => (die.id === id ? { ...die, isHeld: !die.isHeld } : die))
}

export function checkWin(dice) {
  if (dice.length === 0) return false
  const allHeld = dice.every((d) => d.isHeld)
  const firstValue = dice[0].value
  const allSame = dice.every((d) => d.value === firstValue)
  return allHeld && allSame
}
