import { useState } from 'react'
import './App.css'

function App() {
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: "Spaghetti Carbonara",
      cuisine: "Italian",
      ingredients: ["spaghetti", "eggs", "bacon", "parmesan cheese", "black pepper"],
      instructions: "Cook spaghetti. Fry bacon. Mix eggs and cheese. Combine everything while pasta is hot.",
      imageUrl: "https://source.unsplash.com/random/400x300?spaghetti"
    },
    {
      id: 2,
      name: "Chicken Curry",
      cuisine: "Indian",
      ingredients: ["chicken", "curry powder", "onions", "tomatoes", "coconut milk"],
      instructions: "Cook chicken with onions. Add curry powder and tomatoes. Simmer with coconut milk.",
      imageUrl: "https://source.unsplash.com/random/400x300?curry"
    },
    {
      id: 3,
      name: "Sushi Rolls",
      cuisine: "Japanese",
      ingredients: ["rice", "nori", "fish", "cucumber", "avocado"],
      instructions: "Cook and season rice. Place rice on nori. Add fillings. Roll tightly and slice.",
      imageUrl: "https://source.unsplash.com/random/400x300?sushi"
    }
  ])

  const [selectedRecipe, setSelectedRecipe] = useState(null)

  return (
    <div className="App">
      <header className="header">
        <h1>👨‍🍳 Chef Claude's Recipe Book</h1>
      </header>
      <main>
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <div 
              key={recipe.id} 
              className="recipe-card"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <img src={recipe.imageUrl} alt={recipe.name} className="recipe-image" />
              <div className="recipe-info">
                <h2>{recipe.name}</h2>
                <p className="cuisine">{recipe.cuisine}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedRecipe && (
          <div className="recipe-detail">
            <button className="close-btn" onClick={() => setSelectedRecipe(null)}>×</button>
            <h2>{selectedRecipe.name}</h2>
            <p className="cuisine-badge">{selectedRecipe.cuisine}</p>
            <img src={selectedRecipe.imageUrl} alt={selectedRecipe.name} className="detail-image" />
            <div className="detail-section">
              <h3>Ingredients:</h3>
              <ul>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className="detail-section">
              <h3>Instructions:</h3>
              <p>{selectedRecipe.instructions}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
