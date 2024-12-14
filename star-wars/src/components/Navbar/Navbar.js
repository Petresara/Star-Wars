import React, { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import { translations } from "../../context/translations";
import './Navbar.css';

const Navbar = () => {
    const { language, toggleLanguage } = useContext(LanguageContext);

    return (
        <nav className="navbar">
            <p className="language-text">Language: {language}</p>
            <button className="language-toggle" onClick={toggleLanguage}>
                {translations.switchLanguage}Switch Language
            </button>
        </nav>
    );
};

export default Navbar;