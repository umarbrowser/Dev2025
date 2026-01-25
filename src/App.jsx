import { useEffect, useMemo, useRef, useState } from "react"
import "./App.css"
import Die from "./components/Die"
import StatsBar from "./components/StatsBar"
import { checkWin, createDiceSet, rollUnheldDice, toggleHold } from "./lib/dice"
import { readStorage, removeStorage, writeStorage } from "./lib/storage"

const BEST_KEY = "tenzies.best.v1"

function normalizeBest(value) {
  if (!value || typeof value !== "object") return null
  const rolls = Number(value.rolls)
  const timeSeconds = Number(value.timeSeconds)
  if (!Number.isFinite(rolls) || !Number.isFinite(timeSeconds)) return null
  if (rolls <= 0 || timeSeconds < 0) return null
  return { rolls, timeSeconds }
}

export default function App() {
  const [dice, setDice] = useState(() => createDiceSet())
  const [isWon, setIsWon] = useState(false)
  const [rolls, setRolls] = useState(0)
  const [timeSeconds, setTimeSeconds] = useState(0)
  const [best, setBest] = useState(() => normalizeBest(readStorage(BEST_KEY, null)))

  const actionButtonRef = useRef(null)
  const actionsRef = useRef({ rollOrReset: null, resetGame: null })

  const targetValue = useMemo(() => {
    const held = dice.find((d) => d.isHeld)
    return held ? held.value : null
  }, [dice])

  useEffect(() => {
    const won = checkWin(dice)
    setIsWon(won)
  }, [dice])

  useEffect(() => {
    if (isWon) {
      actionButtonRef.current?.focus()
    }
  }, [isWon])

  useEffect(() => {
    if (isWon) return
    const id = window.setInterval(() => {
      setTimeSeconds((t) => t + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [isWon])

  useEffect(() => {
    if (!isWon) return
    const candidate = { rolls: Math.max(rolls, 0), timeSeconds: Math.max(timeSeconds, 0) }
    if (candidate.rolls === 0) return

    const shouldReplace =
      !best ||
      candidate.rolls < best.rolls ||
      (candidate.rolls === best.rolls && candidate.timeSeconds < best.timeSeconds)

    if (shouldReplace) {
      setBest(candidate)
      writeStorage(BEST_KEY, candidate)
    }
  }, [isWon, rolls, timeSeconds, best])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.repeat) return
      if (e.key === "r" || e.key === "R") {
        e.preventDefault()
        actionsRef.current.rollOrReset?.()
      }
      if (e.key === "n" || e.key === "N") {
        e.preventDefault()
        actionsRef.current.resetGame?.()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function resetGame() {
    setDice(createDiceSet())
    setIsWon(false)
    setRolls(0)
    setTimeSeconds(0)
  }

  function rollOrReset() {
    if (isWon) {
      resetGame()
      return
    }
    setDice((old) => rollUnheldDice(old))
    setRolls((r) => r + 1)
  }

  actionsRef.current.rollOrReset = rollOrReset
  actionsRef.current.resetGame = () => {
    if (isWon) resetGame()
  }

  function handleToggleHold(id) {
    if (isWon) return
    setDice((old) => toggleHold(old, id))
  }

  const diceElements = dice.map((die, index) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      onToggleHold={() => handleToggleHold(die.id)}
      index={index}
    />
  ))

  return (
    <div className="page">
      <main className="card">
        <header className="header">
          <div className="badge" aria-hidden="true">
            TENZIES
          </div>
          <h1 className="title">Tenzies</h1>
          <p className="instructions">
            Roll until all dice match. Click (or tab + space) to hold dice between rolls.
          </p>
        </header>

        <div aria-live="polite" className="srOnly">
          {isWon ? "You won. Press New Game to play again." : "Game in progress."}
        </div>

        <StatsBar rolls={rolls} timeSeconds={timeSeconds} best={best} />

        <section className="status" aria-label="Target">
          <div className="statusItem">
            <span className="statusLabel">Target</span>
            <span className="statusValue">
              {targetValue == null ? "Hold any die" : `Make all ${targetValue}s`}
            </span>
          </div>
          <div className="statusHint">
            Shortcuts: <kbd>R</kbd> roll, <kbd>N</kbd> new game
          </div>
        </section>

        <section className="diceGrid" aria-label="Dice">
          {diceElements}
        </section>

        <div className="actions">
          <button
            ref={actionButtonRef}
            type="button"
            className="primary"
            onClick={rollOrReset}
          >
            {isWon ? "New Game" : "Roll"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              removeStorage(BEST_KEY)
              setBest(null)
            }}
          >
            Reset Best
          </button>
        </div>

        {isWon ? <div className="winGlow" aria-hidden="true" /> : null}
      </main>
    </div>
  )
}
