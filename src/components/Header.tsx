import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Bookmark, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white"
          >
            <Film className="w-6 h-6 text-red-600" />
            <span className={`transition-colors duration-300 ${
              isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
            }`}>
              MoviesAdda
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/categories" 
              className={`transition-colors duration-300 hover:text-red-600 ${
                isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'
              }`}
            >
              Categories
            </Link>
            <Link 
              to="/watchlist" 
              className={`flex items-center space-x-1 transition-colors duration-300 hover:text-red-600 ${
                isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Watchlist</span>
            </Link>
            
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search movies or actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none ${
                  isScrolled 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' 
                    : 'bg-black/30 text-white placeholder:text-gray-300'
                }`}
              />
              <Search className={`absolute left-3 top-2.5 w-4 h-4 ${
                isScrolled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300'
              }`} />
            </form>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center p-2"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${
                isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
              }`} />
            ) : (
              <Menu className={`w-6 h-6 ${
                isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
              }`} />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-xl">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <input
                type="text"
                placeholder="Search movies or actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
              />
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 dark:text-gray-400" />
            </form>
            
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/categories" 
                className="py-2 text-gray-800 dark:text-white hover:text-red-600 dark:hover:text-red-400"
              >
                Categories
              </Link>
              <Link 
                to="/watchlist" 
                className="py-2 flex items-center space-x-2 text-gray-800 dark:text-white hover:text-red-600 dark:hover:text-red-400"
              >
                <Bookmark className="w-5 h-5" />
                <span>Watchlist</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;