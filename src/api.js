// --- Gemini API Configuration ---

// Uses a standard fetch call as this is the most compatible way to call the
// Gemini API from a client-side (Vite/React) application.

// Access the API key from Vite environment variables.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Base URL for the Google Gemini API (using the high-speed Flash model)
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// System instruction for the Gemini model
const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`;

/**
 * Generates a recipe using the Google Gemini API based on a list of ingredients.
 * Includes exponential backoff for retries.
 * @param {string[]} ingredientsArr - Array of ingredients.
 * @returns {Promise<string>} The generated recipe text or an error message.
 */
export async function getRecipeFromGemini(ingredientsArr) {
    if (!API_KEY) {
        // Return an error message if the key isn't loaded (e.g., server wasn't restarted)
        return "Error: API key not found. Please set VITE_GEMINI_API_KEY in your .env file and restart your Vite server.";
    }

    const ingredientsString = ingredientsArr.join(", ");
    const userQuery = `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        // 🛑 FIX: Changed 'config' to 'generationConfig'
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
                return generatedText || "Sorry, Chef Claude couldn't generate a recipe based on those ingredients.";
            } else if (response.status === 429 || response.status >= 500) {
                // Throttle or server error: retry
                if (i === maxRetries - 1) throw new Error("API call failed after max retries.");
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                // Non-retryable error (400, 401, etc.)
                const errorBody = await response.json();
                throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorBody)}`);
            }
        } catch (error) {
            if (i === maxRetries - 1 || !(error.message.includes("Rate Limit") || error.message.includes("Server Error"))) {
                console.error("Gemini API call failed:", error);
                return `Error: Failed to generate recipe due to a network or configuration error: ${error.message}`;
            }
        }
    }
    return "Error: Could not connect to the recipe server after multiple attempts.";
}