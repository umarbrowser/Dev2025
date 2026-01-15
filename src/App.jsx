import React from "react"
import { languages } from "./languages"

export default function AssemblyEndgame() {
  
  // programming languages list 
  const langCard = languages.map((lang) =>{
    const style = {
      backgroundColor: lang.backgroundColor, 
      color: lang.color
    }
  
    return (    
      <span className = "language" key={lang.name} style={style}>
      {lang.name}
      </span>
      )
  })

  
  // selected word place holder and state variable
  const [word, setWord] = React.useState("python")
  const letterElements = word.toUpperCase().split("").map((char, index) => (
    <span key={index}>{char}</span>
  ))


  // keyboard keys
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const keyBoardButtons = alphabet.toUpperCase().split("").map((char, index) => (
    <button key={index}>{char}</button>
  ))


    return (
        <main>
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the 
                programming world safe from Assembly!</p>
            </header>
            <main>
              <section className="message">
                <h2>You Win</h2>
                <p>Well done! 🎉</p>
              </section>
              <section className="languages">
                {langCard}
              </section>
              <section className="selected-word">
                {letterElements}
              </section>
              <section className="keyboard">
                {keyBoardButtons}
              </section>
              <button className="new-game">New Game</button>
            </main>
        </main>
    )
}
