import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WatchlistProvider } from './contexts/WatchlistContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import Category from './pages/Category';
import Watchlist from './pages/Watchlist';
import Categories from './pages/Categories';

function App() {
  return (
    <ErrorBoundary>
      <WatchlistProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WatchlistProvider>
    </ErrorBoundary>
  );
}

export default App;