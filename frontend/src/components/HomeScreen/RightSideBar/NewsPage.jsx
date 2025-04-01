import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import Navbar from "../../NavBarMainScreen/Navbar";
import Loader from "../../Loaders/Loader";

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return "1 year ago";
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return "1 month ago";
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return "1 day ago";
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hrs ago`;
  if (interval === 1) return "1 hr ago";
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} mins ago`;
  if (interval === 1) return "1 min ago";
  
  return "just now";
};

const NewsPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const loadedUrls = useRef(new Set());
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const filterRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const API_KEY = "24ed623baee84e789dc520e9e678b854";
  
  const categories = [
    { value: "general", label: "General" },
    { value: "business", label: "Business" },
    { value: "entertainment", label: "Entertainment" },
    { value: "health", label: "Health" },
    { value: "science", label: "Science" },
    { value: "sports", label: "Sports" },
    { value: "technology", label: "Technology" }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNews = async (pageNum) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      let apiUrl;
      const searchTerm = searchQuery || selectedCategory;
      
      apiUrl = `https://newsapi.org/v2/everything?q=${searchTerm}&pageSize=10&page=${pageNum}&apiKey=${API_KEY}`;
      
      console.log("Fetching news with URL:", apiUrl);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log("API Response:", data);
      
      if (data.articles && data.articles.length > 0) {
        console.log("Articles before filtering:", data.articles.length);
        
        const newArticles = data.articles.filter(article => {
          if (!article.url || loadedUrls.current.has(article.url)) {
            return false;
          }
          
          if (!article.title) {
            article.title = "No title available";
          }
          
          if (!article.description) {
            article.description = "No description available";
          }
          
          loadedUrls.current.add(article.url);
          return true;
        });
        
        console.log("Articles after filtering:", newArticles.length);
        
        if (newArticles.length > 0) {
          setNewsArticles(prev => [...prev, ...newArticles]);
          setPage(prevPage => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadedUrls.current.clear();
    setNewsArticles([]);
    setPage(1);
    setHasMore(true);
    fetchNews(1);
  }, [selectedCategory, searchQuery]);
  
  useEffect(() => {
    return () => {
      loadedUrls.current.clear();
    };
  }, []);

  const lastNewsElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchNews(page);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, page]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setShowFilterDropdown(false);
  };
  
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchQuery(e.target.value);
    }
  };

  const handleSearchButton = () => {
    if (searchInputRef.current) {
      setSearchQuery(searchInputRef.current.value);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-green-100'} flex p-2 flex-col gap-3 justify-center items-center`}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className={`flex flex-col container p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} w-full sm:w-11/12 md:w-10/12 lg:w-11/12 xl:w-10/12 mt-20 mb-10 mx-auto relative`}>
        {/* Search bar */}
        <div className="flex w-full items-center gap-2 mb-6">
          <div className="flex-grow gap-2 flex">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search news..."
              className={`flex-grow p-2 rounded-md border ${
                isDarkMode 
                  ? "bg-gray-700 outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-white" 
                  : "bg-white outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition duration-200 text-gray-700"
              }`}
              onKeyDown={handleSearch}
              defaultValue={searchQuery}
            />
            <button 
              className={`px-2 sm:px-4 py-2 rounded-md ${
                isDarkMode 
                  ? "bg-green-700 text-white hover:bg-green-600" 
                  : "bg-green-600 text-white hover:bg-green-500"
              }`}
              onClick={handleSearchButton}
              aria-label="Search"
            >
              <span className="hidden sm:inline">Search</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <div ref={filterRef}>
            <button 
              className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md ${
                isDarkMode 
                  ? "bg-green-700 text-white hover:bg-green-600" 
                  : "bg-green-600 text-white hover:bg-green-500"
              }`}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              aria-label="Filter"
            >
              <span className="hidden sm:inline">Filter</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
                
            {showFilterDropdown && (
              <div 
                className={`absolute mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                } right-4 sm:right-auto`}
              >
                {categories.map(category => (
                  <button
                    key={category.value}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      isDarkMode 
                        ? "text-gray-200 hover:bg-gray-600" 
                        : "text-gray-700 hover:bg-gray-100"
                    } ${selectedCategory === category.value ? (isDarkMode ? "bg-gray-600" : "bg-gray-100") : ""}`}
                    onClick={() => handleCategoryChange(category.value)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-green-600 text-center sm:text-left">
        <i className="fas fa-globe mr-3"></i>
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : `${categories.find(c => c.value === selectedCategory)?.label} News`}
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {newsArticles.map((article, index) => {
            if (newsArticles.length === index + 1) {
              return (
                <div 
                  ref={lastNewsElementRef}
                  key={`${article.url}-${index}`}
                  className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:scale-102`}
                >
                  <NewsCard article={article} isDarkMode={isDarkMode} />
                </div>
              );
            } else {
              return (
                <div 
                  key={`${article.url}-${index}`}
                  className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:scale-102`}
                >
                  <NewsCard article={article} isDarkMode={isDarkMode} />
                </div>
              );
            }
          })}
        </div>
        
        {isLoading && (
          <div className="flex justify-center mt-6">
            <Loader/>
          </div>
        )}
        
        {!hasMore && newsArticles.length > 0 && (
          <p className="text-center mt-8 text-gray-500">No more news articles to load</p>
        )}
        
        {!isLoading && newsArticles.length === 0 && (
          <div className="text-center mt-8 py-8 sm:py-12">
            <p className={`text-lg sm:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : `No ${categories.find(c => c.value === selectedCategory)?.label} news articles available`}
            </p>
            <button 
              className={`mt-4 px-4 py-2 rounded ${
                isDarkMode 
                  ? "text-green-200 bg-green-800 hover:bg-green-700" 
                  : "text-green-600 bg-green-100 hover:bg-green-600 hover:text-white"
              }`}
              onClick={() => {
                loadedUrls.current.clear();
                setPage(1);
                setHasMore(true);
                fetchNews(1);
              }}
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NewsCard = ({ article, isDarkMode }) => {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="block h-full">
      <div className="p-3 sm:p-4 h-full flex flex-col">
        {article.urlToImage && (
          <div className="h-40 sm:h-48 mb-3 sm:mb-4 overflow-hidden rounded">
            <img 
              src={article.urlToImage} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/400/300";
              }}
            />
          </div>
        )}
        
        <h2 className={`text-base sm:text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {article.title}
        </h2>
        
        <p className={`text-xs sm:text-sm mb-3 line-clamp-3 flex-grow ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {article.description}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate max-w-[50%]`}>
            {article.source?.name || "Unknown source"}
          </span>
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatTimeAgo(article.publishedAt)}
          </span>
        </div>
      </div>
    </a>
  );
};

export default NewsPage;