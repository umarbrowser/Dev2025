// --- API Client Code (Copied for Self-Contained Test) ---
// This code is copied from src/api.js to make the test runnable.

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. Format your response in markdown.
`;

async function getRecipeFromGemini(ingredientsArr) {
    if (!API_KEY) {
        return "Error: API key not found. Please set VITE_GEMINI_API_KEY in your .env file.";
    }

    const ingredientsString = ingredientsArr.join(", ");
    const userQuery = `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { maxOutputTokens: 1024 } 
    };

    const maxRetries = 3;
    let delay = 1000;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
                return generatedText || "Sorry, Chef Claude couldn't generate a recipe.";
            } else if (response.status === 429 || response.status >= 500) {
                if (i === maxRetries - 1) throw new Error("API call failed after max retries.");
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                const errorBody = await response.json();
                throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorBody)}`);
            }
        } catch (error) {
            if (i === maxRetries - 1 || !(error.message.includes("Rate Limit") || error.message.includes("Server Error"))) {
                console.error("Gemini API call failed:", error);
                return `Error: Failed to generate recipe: ${error.message}`;
            }
        }
    }
    return "Error: Could not connect to the recipe server after multiple attempts.";
}

// --- Test Execution ---

async function runTest() {
    console.log("--- Starting Gemini API Test ---");
    
    const testIngredients = ["chicken breast", "broccoli", "white rice", "soy sauce"];
    console.log(`Testing recipe for: ${testIngredients.join(', ')}`);
    console.log("Awaiting API response...");
    
    const recipe = await getRecipeFromGemini(testIngredients);
    
    console.log("\n--- GENERATED RECIPE OUTPUT ---");
    console.log(recipe);
    console.log("-------------------------------\n");
}

runTest();