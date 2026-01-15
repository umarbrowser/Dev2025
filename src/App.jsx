import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [rolls, setRolls] = useState(0)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    
    if (allHeld && allSameValue) {
      setTenzies(true)
    }
  }, [dice])

  useEffect(() => {
    let interval = null
    if (!tenzies) {
      interval = setInterval(() => {
        setTime(time => time + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [tenzies])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: Math.random()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    if (tenzies) {
      setDice(allNewDice())
      setTenzies(false)
      setRolls(0)
      setTime(0)
    } else {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld 
          ? die 
          : generateNewDie()
      }))
      setRolls(prevRolls => prevRolls + 1)
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id 
        ? {...die, isHeld: !die.isHeld}
        : die
    }))
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const diceElements = dice.map(die => (
    <Die 
      key={die.id} 
      value={die.value} 
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  return (
    <div className="App">
      <main>
        {tenzies && <div className="confetti"></div>}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
        </p>
        <div className="stats">
          <div className="stat">Rolls: {rolls}</div>
          <div className="stat">Time: {formatTime(time)}</div>
        </div>
        <div className="dice-container">
          {diceElements}
        </div>
        <button 
          className="roll-dice" 
          onClick={rollDice}
        >
          {tenzies ? "New Game" : "Roll"}
        </button>
      </main>
    </div>
  )
}

function Die({ value, isHeld, holdDice }) {
  return (
    <div 
      className={`die ${isHeld ? "held" : ""}`}
      onClick={holdDice}
    >
      <h2 className="die-num">{value}</h2>
    </div>
  )
}

export default App
