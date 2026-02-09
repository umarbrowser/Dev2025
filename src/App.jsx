import React from "react"
import { languages } from "./languages"
import clsx from 'clsx';
import {getFarewellText, generateWord} from "./utils"
import Confetti from "react-confetti"

export default function AssemblyEndgame() {

  // state values
  const [guessedLetters, setGuessedLetters] = React.useState([])
  const [word, setWord] = React.useState(() =>generateWord())


  // static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"


  // derived values
  const wrongGuessCount = guessedLetters.filter(letter => !word.toUpperCase().split("").includes(letter)).length
  // console.log(guessedLetters)
  console.log("wrong guess coutnt: ", wrongGuessCount)
  const isGameWon = word.toUpperCase().split("").every(letter => guessedLetters.includes(letter))
  console.log("is game won: ", isGameWon)
  const isGameLost = wrongGuessCount >= languages.length -1
  const isGameOver = isGameWon || isGameLost
  console.log("is game over: ", isGameOver)
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !word.toUpperCase().includes(lastGuessedLetter)
  const fareWellTextMessage = isLastGuessIncorrect && (wrongGuessCount - 1) < languages.length
    ? getFarewellText(languages[wrongGuessCount - 1].name) 
    : ""
  
  
  // programming languages list 
  const langCard = languages.map((lang, index) =>{
    const style = {
      backgroundColor: lang.backgroundColor, 
      color: lang.color
    }

 
  
    return (    
      <span className = {clsx({
        language: true,
        lost : wrongGuessCount > index,

      })} 
      key={index} 
      style={style}>
      {lang.name}
      </span>
      )
  })

  
  // selected word place holder and state variable
  const letterElements = word.toUpperCase().split("").map((char, index) => {
    const isGuessed = guessedLetters.includes(char)
    if(isGuessed){
      return(
        <span key={index}>{char}</span>
      )
    }else{
      return(
        <span key={index}></span>
      )
    }
  })

  
  // console.log(guessedLetters)

  // keyboard keys
    const keyBoardButtons = alphabet.toUpperCase().split("").map((char, index) => {
    const isGuessed = guessedLetters.includes(char)

    const isCorrect = isGuessed && word.toUpperCase().split("").includes(char)
    const isWrong = isGuessed && !word.toUpperCase().split("").includes(char)

    

    return(
    <button 
    onClick={handleKeyboardClick}
    disabled={isGameOver}
    className={clsx(isCorrect && "correct", isWrong && "wrong")}
    key={index}>{char}</button>
    )
})



  function handleKeyboardClick(e) {
    // collect the button text from event object e
    const letter = e.target.innerText
    // add previous values to a set in order to avoid duplicate, then convert it to array
    setGuessedLetters(prevGuessedLetters => {
      const lettersSet = new Set(prevGuessedLetters)
      lettersSet.add(letter)
      return Array.from(lettersSet)
    })
    console.log(guessedLetters)
  }
 
  function reset() {
    setGuessedLetters([])
    setWord(generateWord())
  }


  const className = clsx({
    message: true,
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
    })

    return (
        <main>
            {isGameWon && <Confetti />}
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the 
                programming world safe from Assembly!</p>
            </header>
            <main>
              
              
                <section className={className}>
                  {
                    isGameWon? (
                      <>
                      <h2>You Win</h2>
                      <p>Well done! 🎉</p>
                      </>
                    ) : (
                      isGameLost? (
                        <>
                        <h2>Game over!</h2>
                        <p>You lose! Better start learning Assembly 😭</p>
                        </>
                      ) : (
                        fareWellTextMessage && (
                          <p>{fareWellTextMessage}</p>
                        )
                      )
                    )
                  }
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
              
              {isGameOver  && (<button className="new-game" onClick={reset}>New Game</button>)}
            </main>
        </main>
    )
}
