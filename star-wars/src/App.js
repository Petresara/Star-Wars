import React from 'react';
import FilmsList from './components/FilmsList/FilmsList';
import Navbar from './components/Navbar/Navbar';
import './App.css';


function App() {
  return (
    <div className="App">
      <Navbar />
        <FilmsList />
    </div>
  );
}

export default App;
