import ReactMarkdown from "react-markdown"


export default function ClaudeRecipe(props) {
    return (
        <section className="suggested-recipe-container">
            <ReactMarkdown>{props.recipe}</ReactMarkdown>
        </section>
    )
}

// import React from 'react';
// import { marked } from 'marked'; // Ensure you have installed: npm install marked

// export default function ClaudeRecipe(props) {
//     // Check if the recipe text exists before attempting to parse it
//     if (!props.recipe) {
//         // You might want a slightly nicer message here, but this fulfills the structure.
//         return <section className="text-center p-8 text-gray-500">
//             Getting ready to generate your recipe...
//         </section>;
//     }
    
//     // 1. Convert the Markdown string (props.recipe) into an HTML string
//     const formattedHtml = marked(props.recipe);

//     return (
//         <section className="bg-white p-6 rounded-xl shadow-2xl mt-8 border-t-4 border-red-500">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Custom Recipe</h2>
            
//             {/* 2. Use dangerouslySetInnerHTML to render the formatted HTML */}
//             <div 
//                 className="markdown-content space-y-4 text-gray-800"
//                 dangerouslySetInnerHTML={{ __html: formattedHtml }} 
//             />
//         </section>
//     );
// }