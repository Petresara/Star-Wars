import React, { useState } from "react";
import "./FilmsFilter.css"; 

export const applyFilters = (films, director, sortField) => {
  let filtered = films;

  if (director) {
    filtered = filtered.filter(film =>
      film.director?.toLowerCase().includes(director.toLowerCase())
    );
  }

  if (sortField) {
    filtered = [...filtered].sort((a, b) => {
      if (sortField === 'releaseDate') {
        return new Date(a[sortField]) - new Date(b[sortField]);
      } else {
        return a[sortField || ''].localeCompare(b[sortField || '']);
      }
    });
  }

  return filtered;
};

const FilmsFilters = ({ films, setFilteredFilms }) => {
  const [director, setDirector] = useState('');
  const [sortField, setSortField] = useState('');

  const handleFilter = () => {
    const filtered = applyFilters(films, director, sortField);
    setFilteredFilms(filtered);

    if (filtered.length === 0) {
        setFilteredFilms([{ title: "No films found" }]);
    }
  };

  return (
    <div className="filters-container">
      <input
        type="text"
        className="director-input"
        placeholder="Filter by Director"
        value={director}
        onChange={e => setDirector(e.target.value)}
      />
      <select className="sort-select" onChange={e => setSortField(e.target.value)}>
        <option value="">Sort By</option>
        <option value="title">Title</option>
        <option value="releaseDate">Release Date</option>
      </select>
      <button className="apply-button" onClick={handleFilter}>Apply</button>
    </div>
  );
};

export default FilmsFilters;
