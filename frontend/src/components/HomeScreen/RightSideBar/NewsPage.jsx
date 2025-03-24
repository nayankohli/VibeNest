import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import Navbar from "../../NavBarMainScreen/Navbar";
import Loader from "../../Loader";
// Custom function to format time ago (kept unchanged)
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
  
  // Updated API key to match the NewsAPI used in NewsApp component
  const API_KEY = "24ed623baee84e789dc520e9e678b854";
  
  // Updated list of news categories to match NewsAPI.org categories
  const categories = [
    { value: "general", label: "General" },
    { value: "business", label: "Business" },
    { value: "entertainment", label: "Entertainment" },
    { value: "health", label: "Health" },
    { value: "science", label: "Science" },
    { value: "sports", label: "Sports" },
    { value: "technology", label: "Technology" }
  ];

  const fetchNews = async (pageNum) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Use the everything endpoint that works in RightSidebar
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-green-100'}  flex flex-col gap-3 justify-center items-center `}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className={` flex flex-col container p-20 pt-10 rounded-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}  w-[80rem] mt-20 mb-10 relative`}>
        {/* Search bar */}
        <div className="flex w-full justify-center items-start gap-5">
        <div className="mb-6 w-5/6 flex">
          <input
            type="text"
            placeholder="Search news..."
            className={`flex-grow p-2 rounded-l-md border ${
              isDarkMode 
                ? "bg-gray-700 outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-white" 
                : "bg-white outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition duration-200 text-gray-700"
            }`}
            onKeyDown={handleSearch}
            defaultValue={searchQuery}
          />
          <button 
            className={`px-4 py-2 rounded-r-md ${
              isDarkMode 
                ? "bg-green-700 text-white hover:bg-green-600" 
                : "bg-green-600 text-white hover:bg-green-500"
            }`}
            onClick={() => setSearchQuery(document.querySelector('input').value)}
          >
            Search
          </button>
        </div>
        {/* Filter button and dropdown in top-right corner */}
        <div className=" w-1/6 ">
  <button 
    className={`flex items-center justify-self-end gap-2 px-3 py-2 rounded-md ${
      isDarkMode 
        ? "bg-green-700 text-white hover:bg-green-600" 
        : "bg-green-600 text-white hover:bg-green-500"
    }`}
    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
  >
    <span>Filter</span>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  </button>
          
          {showFilterDropdown && (
            <div 
              className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              }`}
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
        
        <h1 className="text-3xl font-bold mb-6 text-green-600">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : `${categories.find(c => c.value === selectedCategory)?.label} News`}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article, index) => {
            if (newsArticles.length === index + 1) {
              return (
                <div 
                  ref={lastNewsElementRef}
                  key={`${article.url}-${index}`}
                  className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:scale-102`}
                >
                  <NewsCard article={article} isDarkMode={isDarkMode} />
                </div>
              );
            } else {
              return (
                <div 
                  key={`${article.url}-${index}`}
                  className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:scale-102`}
                >
                  <NewsCard article={article} isDarkMode={isDarkMode} />
                </div>
              );
            }
          })}
        </div>
        
        {isLoading && (
          <Loader/>
        )}
        
        {!hasMore && newsArticles.length > 0 && (
          <p className="text-center mt-8 text-gray-500">No more news articles to load</p>
        )}
        
        {!isLoading && newsArticles.length === 0 && (
          <div className="text-center mt-8 py-12">
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
      <div className="p-4 h-full flex flex-col">
        {article.urlToImage && (
          <div className="h-48 mb-4 overflow-hidden rounded">
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
        
        <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {article.title}
        </h2>
        
        <p className={`text-sm mb-3 line-clamp-3 flex-grow ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {article.description}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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