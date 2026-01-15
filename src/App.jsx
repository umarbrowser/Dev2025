import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    randomImage: "http://i.imgflip.com/1bij.jpg"
  })
  const [allMemes, setAllMemes] = useState([])

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(res => res.json())
      .then(data => setAllMemes(data.data.memes))
  }, [])

  function getMemeImage() {
    const randomNumber = Math.floor(Math.random() * allMemes.length)
    const url = allMemes[randomNumber].url
    setMeme(prevMeme => ({
      ...prevMeme,
      randomImage: url
    }))
  }

  function handleChange(event) {
    const {name, value} = event.target
    setMeme(prevMeme => ({
      ...prevMeme,
      [name]: value
    }))
  }

  return (
    <div className="App">
      <header className="header">
        <h1>Meme Generator</h1>
      </header>
      <main>
        <div className="form">
          <input 
            type="text"
            placeholder="Top text"
            className="form-input"
            name="topText"
            value={meme.topText}
            onChange={handleChange}
          />
          <input 
            type="text"
            placeholder="Bottom text"
            className="form-input"
            name="bottomText"
            value={meme.bottomText}
            onChange={handleChange}
          />
          <button 
            className="form-button"
            onClick={getMemeImage}
          >
            Get a new meme image 🖼
          </button>
        </div>
        <div className="meme">
          <img src={meme.randomImage} className="meme-image" alt="meme" />
          <h2 className="meme-text top">{meme.topText}</h2>
          <h2 className="meme-text bottom">{meme.bottomText}</h2>
        </div>
      </main>
    </div>
  )
}

export default App
