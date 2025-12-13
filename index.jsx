import { createRoot } from "react-dom/client"
const root = createRoot(document.getElementById("root"))

root.render(
    <main>
        <img src="myLogo.jpg" width="100px" alt="my logo" />
        <h1>services we offer</h1>
        <ul>
            <li>Sewing of men clothes</li>
            <li>Selling of sewing materials</li>
            <li>Cafe services</li>
            <li>Software development</li>
            <li>Computer Hardware maintenance</li>
            <li>software installation</li>

        </ul>
    </main>
)