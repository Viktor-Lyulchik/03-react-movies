import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import css from './App.module.css';
import type { Movie } from '../../types/movie';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import { fetchMovies } from '../../services/movieService';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const closeMovieModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = async (query: string) => {
    try {
      setMovies([]);
      setIsLoading(true);
      setIsError(false);

      const data = (await fetchMovies(query)) as Movie[];

      if (data.length === 0) {
        toast.error('No movies found for your request.');
      }

      setMovies(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <>
      <div className={css.app}>
        <Toaster />
        <SearchBar onSubmit={handleSearch} />
        {isError ? (
          <ErrorMessage />
        ) : (
          movies.length > 0 && (
            <MovieGrid onSelect={handleSelectMovie} movies={movies} />
          )
        )}
        {isLoading && <Loader />}
        {selectedMovie && (
          <MovieModal
            onClose={closeMovieModal}
            movie={selectedMovie}
          ></MovieModal>
        )}
      </div>
    </>
  );
}
