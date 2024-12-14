import React, { useContext, useEffect, useState, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { GET_FILMS } from "../../graphql/getFilms";
import { LanguageContext } from "../../context/LanguageContext";
import FilmsFilters, { applyFilters } from "../FilmsFilter/FilmsFilters";
import { format } from "date-fns";
import "./FilmsList.css"; 

const FilmsList = () => {
  const { translations } = useContext(LanguageContext);

  const [films, setFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);


  const { loading, error, data, fetchMore } = useQuery(GET_FILMS, {
    variables: { first: 5, offset: 0 },
    onCompleted: (data) => {
      if (data?.allFilms?.films) {
        setFilms(data.allFilms.films);
        setFilteredFilms(data.allFilms.films);
        console.log("Initial films loaded:", data.allFilms.films);
      } else {
        console.error("No films data available");
      }
    },
  });


  const loadMoreFilms = useCallback(() => {
    console.log("Attempting to load more films");

    if (loadingMore) {
      console.log("Already loading, skipping...");
      return;
    }
    if (films.length >= data?.allFilms?.totalCount) {
      console.log("All films are already loaded");
      return;
    }

    setLoadingMore(true);
    fetchMore({
      variables: { first: 5, offset: offset + 5 },
    })
      .then(({ data }) => {
        console.log("Fetched data:", data);
        if (data?.allFilms?.films?.length > 0) {
          const newFilms = data.allFilms.films;
          const updatedFilms = [...films, ...newFilms];
          setFilms(updatedFilms);
          setFilteredFilms(applyFilters(updatedFilms));
          setOffset((prevOffset) => prevOffset + 5);
          console.log("Films updated:", updatedFilms);
        } else {
          console.log("No more films to fetch");
        }
      })
      .catch((error) => {
        console.error("Error fetching more films:", error);
      })
      .finally(() => {
        setLoadingMore(false);
      });
  }, [loadingMore, films, offset, fetchMore, data]);


  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const documentHeight = document.documentElement.offsetHeight;

      console.log(`scrollPosition: ${scrollPosition}, documentHeight: ${documentHeight}`);

      if (scrollPosition >= documentHeight - 100) {
        console.log("Scrolled to bottom, trying to load more films");
        loadMoreFilms();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreFilms]);

  if (loading && films.length === 0) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>{translations.title}</h2>
      <FilmsFilters films={films} setFilteredFilms={setFilteredFilms} />
      <ul>
        {filteredFilms.map((film, index) => (
          <li key={`${film.id} ${index}`}>
            <h3>{film.title}</h3>
            <p>{translations.director}: {film.director}</p>
            <p>{translations.releaseDate}: {format(new Date(film.releaseDate), "MMMM d, yyyy")}</p>
            <p>{translations.producers}: {film.producers.join(", ")}</p>
            <p>{translations.episodeID}: {film.episodeID}</p>
          </li>
        ))}
      </ul>
      {loadingMore && <p>Loading more films...</p>}
    </div>
  );
};

export default FilmsList;
