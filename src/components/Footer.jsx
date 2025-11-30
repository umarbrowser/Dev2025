import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        Developed by <a href="https://umarbrowser.github.io/" target="_blank" rel="noopener noreferrer">Umar Haruna Abdullahi</a>
      </p>
      <p className="copyright">
        &copy; {currentYear} All rights reserved.
      </p>
    </footer>
  );
}

