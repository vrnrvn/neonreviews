"use client";

import { useState, useEffect } from 'react';

interface Review {
  id: number;
  showId: number;
  rating: number;
  comment: string;
  author?: string;
  date?: string;
  spoiler?: boolean;
  recommendedFor?: string;
}

interface Show {
  id: number;
  name: string;
  genre: string[];
  reviews: Review[];
  image: string;
  releaseYear: number;
  network: string;
}

const initialShows: Show[] = [
  { 
    id: 1, 
    name: "The Witcher", 
    genre: ["action", "fantasy", "drama"], 
    reviews: [
      { id: 1, showId: 1, rating: 4, comment: "Geralt's character is on point, just like the books.", author: "triss", date: "March 15, 2025", spoiler: false, recommendedFor: "Fantasy fans" },
      { id: 2, showId: 1, rating: 5, comment: "Henry Cavill is the only correct choice for Geralt!", author: "Whitewolf", date: "April 2, 2025", spoiler: false, recommendedFor: "Book readers" }
    ],
    image: "https://images.unsplash.com/photo-1622643048696-883eafe4d8dc?q=80&w=3027&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    releaseYear: 2019,
    network: "Netflix"
  },
  { 
    id: 2, 
    name: "Outlander", 
    genre: ["romance", "history", "drama"], 
    reviews: [
      { id: 1, showId: 2, rating: 5, comment: "What a beautiful story, the characters have so much chemistry.", author: "HistoryRomance", date: "March 20, 2025", spoiler: false, recommendedFor: "Romance enthusiasts" }
    ],
    image: "https://images.unsplash.com/photo-1685444904215-8447ec425e9b?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    releaseYear: 2014,
    network: "Starz"
  },
  { 
    id: 3, 
    name: "Good Omens", 
    genre: ["comedy", "fantasy", "drama"], 
    reviews: [],
    image: "https://images.unsplash.com/photo-1611054476057-5266d752ff4c?q=80&w=2786&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    releaseYear: 2019,
    network: "Amazon Prime"
  },
  { 
    id: 4, 
    name: "Altered Carbon", 
    genre: ["cyberpunk", "sci-fi", "action"], 
    reviews: [
      { id: 1, showId: 4, rating: 4, comment: "Really cool sci-fi, great acting. My favorite cyberpunk show!", author: "Neo", date: "March 25, 2025", spoiler: false, recommendedFor: "Cyberpunk enthusiasts" }
    ],
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    releaseYear: 2018,
    network: "Netflix"
  },
  { 
    id: 5, 
    name: "Westworld", 
    genre: ["sci-fi", "drama", "mystery"], 
    reviews: [
      { id: 1, showId: 5, rating: 5, comment: "The first season is a masterpiece.", author: "TheGuy", date: "April 5, 2025", spoiler: false, recommendedFor: "Fans of complex narratives" }
    ],
    image: "https://images.unsplash.com/photo-1612281423255-b152cacea3e1?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    releaseYear: 2016,
    network: "HBO"
  },
];

const allGenres = ["action", "romance", "comedy", "fantasy", "history", "drama", "cyberpunk", "sci-fi", "mystery"];
const allNetworks = ["Netflix", "HBO", "Amazon Prime", "Starz", "Disney+", "AppleTV+"];

function App() {
  const [shows, setShows] = useState(initialShows);
  const [filteredShows, setFilteredShows] = useState(initialShows);
  const [activeGenres, setActiveGenres] = useState<string[]>([]);
  const [activeNetworks, setActiveNetworks] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2025]);
  const [sortOrder, setSortOrder] = useState<string>("nameAsc");
  const [searchQuery, setSearchQuery] = useState("");
  const [newReview, setNewReview] = useState({ 
    rating: 0, 
    comment: "", 
    author: "", 
    spoiler: false,
    recommendedFor: ""
  });
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [isViewingReviews, setIsViewingReviews] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [userName, setUserName] = useState("Guest");
  const [showFilters, setShowFilters] = useState(false);
  const [reviewSort, setReviewSort] = useState("newest");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  useEffect(() => {
    setUserName("User" + Math.floor(Math.random() * 1000));
  }, []);

  useEffect(() => {
    let results = [...shows];
    
    if (activeGenres.length > 0) {
      results = results.filter(show => 
        activeGenres.some(genre => show.genre.includes(genre))
      );
    }
    
    if (activeNetworks.length > 0) {
      results = results.filter(show => activeNetworks.includes(show.network));
    }
    
    results = results.filter(show => 
      show.releaseYear >= yearRange[0] && show.releaseYear <= yearRange[1]
    );
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(show => 
        show.name.toLowerCase().includes(query) ||
        show.genre.some(g => g.toLowerCase().includes(query)) ||
        show.network.toLowerCase().includes(query)
      );
    }
    
    switch(sortOrder) {
      case "nameAsc":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "yearDesc":
        results.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case "yearAsc":
        results.sort((a, b) => a.releaseYear - b.releaseYear);
        break;
      case "ratingDesc":
        results.sort((a, b) => {
          const avgA = a.reviews.length > 0 
            ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length 
            : 0;
          const avgB = b.reviews.length > 0 
            ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length 
            : 0;
          return avgB - avgA;
        });
        break;
      case "popularityDesc":
        results.sort((a, b) => b.reviews.length - a.reviews.length);
        break;
    }
    
    setFilteredShows(results);
  }, [activeGenres, activeNetworks, yearRange, shows, sortOrder, searchQuery]);

  const toggleGenreFilter = (genre: string) => {
    setActiveGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleNetworkFilter = (network: string) => {
    setActiveNetworks(prev => 
      prev.includes(network)
        ? prev.filter(n => n !== network)
        : [...prev, network]
    );
  };

  const resetFilters = () => {
    setActiveGenres([]);
    setActiveNetworks([]);
    setYearRange([2000, 2025]);
    setSortOrder("nameAsc");
    setSearchQuery("");
  };

  const handleAddReview = (showId: number) => {
    const show = shows.find((s) => s.id === showId);
    if (show && newReview.rating > 0 && newReview.comment.trim()) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      
      const newReviewWithMetadata = { 
        id: Math.max(0, ...show.reviews.map(r => r.id)) + 1,
        showId, 
        rating: newReview.rating, 
        comment: newReview.comment,
        author: userName,
        date: formattedDate,
        spoiler: newReview.spoiler,
        recommendedFor: newReview.recommendedFor
      };
      
      const updatedShows = shows.map((s) => 
        s.id === showId 
          ? { ...s, reviews: [...s.reviews, newReviewWithMetadata] } 
          : s
      );
      
      setShows(updatedShows);
      setNewReview({ rating: 0, comment: "", author: "", spoiler: false, recommendedFor: "" });
      setSelectedShow(null);
      setIsViewingReviews(false);
      
      setNotification({
        show: true,
        message: `Your review for "${show.name}" has been posted!`,
        type: "success"
      });
      
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" });
      }, 3000);
    }
  };

  const viewShowReviews = (show: Show) => {
    setSelectedShow(show);
    setIsViewingReviews(true);
  };

  const openReviewForm = (show: Show) => {
    setSelectedShow(show);
    setIsViewingReviews(false);
  };

  const closeModal = () => {
    setSelectedShow(null);
    setIsViewingReviews(false);
    setNewReview({ rating: 0, comment: "", author: "", spoiler: false, recommendedFor: "" });
  };

  const displayStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star}
            className={`text-lg ${star <= rating ? 'text-cyan-400' : 'text-gray-700'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getSortedReviews = (reviews: Review[]) => {
    if (!reviews.length) return [];
    
    const sortedReviews = [...reviews];
    
    switch(reviewSort) {
      case "newest":
        return sortedReviews.sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      case "oldest":
        return sortedReviews.sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
      case "highest":
        return sortedReviews.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sortedReviews.sort((a, b) => a.rating - b.rating);
      default:
        return sortedReviews;
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono">
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900 via-black to-black"></div>
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, #0f0f0f 1px, transparent 1px), linear-gradient(to bottom, #0f0f0f 1px, transparent 1px)', 
          backgroundSize: '50px 50px', 
          backgroundPosition: 'center'
        }}></div>
      </div>

      <div className="fixed inset-0 z-10 pointer-events-none bg-scan-line opacity-5"></div>
      
      <header className="relative z-20 py-8 px-4 border-b border-cyan-900">
        <div className="max-w-7xl mx-auto">
          <div className="glitch-text text-center">
            <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-600 text-transparent bg-clip-text pb-2">
              NEON REVIEWS
            </h1>
            <p className="text-lg text-center text-cyan-600 mt-1 tracking-wider">THE ONE PLACE FOR FANTASY</p>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-2/3 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shows, genres, networks..."
                className="w-full py-3 px-4 pl-10 bg-gray-900 border border-cyan-900 focus:border-cyan-500 rounded-lg text-cyan-400 placeholder-cyan-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <svg className="w-5 h-5 absolute left-3 top-3.5 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="w-full md:w-1/3 flex justify-end items-center text-right">
              <div className="mr-3">
                <p className="text-cyan-400 mb-1">
                  <span className="text-xs uppercase tracking-wider text-cyan-700">LOGGED IN AS</span>
                </p>
                <p className="text-lg bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text font-bold">{userName}</p>
              </div>
              <button 
                onClick={() => setShowUsernameModal(true)}
                className="bg-gray-900 border border-cyan-900 p-2 rounded-lg hover:bg-gray-800 hover:border-cyan-700 transition-all"
              >
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative z-20 max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
  <button 
    onClick={() => setShowFilters(!showFilters)}
    className="flex items-center space-x-2 bg-gray-900 border border-cyan-900 px-4 py-2 rounded-lg hover:bg-gray-800 hover:border-cyan-700 transition-all"
  >
    <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
    <span className="text-cyan-400">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
  </button>
  
  <div className="flex items-center space-x-2 w-full md:w-auto">
    <label className="text-cyan-600 text-sm whitespace-nowrap">Sort by:</label>
    <select 
      value={sortOrder} 
      onChange={(e) => setSortOrder(e.target.value)}
      className="w-full md:w-48 bg-gray-900 border border-cyan-900 px-3 py-2 rounded-lg text-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
    >
      <option value="nameAsc">Name (A-Z)</option>
      <option value="nameDesc">Name (Z-A)</option>
      <option value="yearDesc">Newest First</option>
      <option value="yearAsc">Oldest First</option>
      <option value="ratingDesc">Highest Rated</option>
      <option value="popularityDesc">Most Popular</option>
    </select>
  </div>
</div>
        
        {showFilters && (
          <div className="mb-10 p-6 border border-cyan-900 rounded-lg bg-gray-900 bg-opacity-50 backdrop-blur">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3 border-b border-cyan-900 pb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map(genre => (
                    <button 
                      key={genre}
                      onClick={() => toggleGenreFilter(genre)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        activeGenres.includes(genre)
                          ? "bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-black"
                          : "bg-gray-800 text-cyan-600 hover:bg-gray-700"
                      }`}
                      style={{ margin: '2px' }}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3 border-b border-cyan-900 pb-2">Networks</h3>
                <div className="flex flex-wrap gap-2">
                  {allNetworks.map(network => (
                    <button 
                      key={network}
                      onClick={() => toggleNetworkFilter(network)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        activeNetworks.includes(network)
                          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-black"
                          : "bg-gray-800 text-cyan-600 hover:bg-gray-700"
                      }`}
                      style={{ margin: '2px' }}
                    >
                      {network}
                    </button>
                  ))}
                </div>
              </div>
              
             <div className="flex-1">
  <h3 className="text-lg font-semibold text-cyan-400 mb-3 border-b border-cyan-900 pb-2">Release Year</h3>
  <div className="px-2">
    <div className="flex justify-between mb-2">
      <span className="text-xs text-cyan-600">{yearRange[0]}</span>
      <span className="text-xs text-cyan-600">{yearRange[1]}</span>
    </div>
    
    {/* Dual-thumb slider */}
    <div className="relative mt-5 mb-8">
      <div className="h-2 bg-gray-700 rounded-lg">
        <div 
          className="absolute h-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg" 
          style={{ 
            left: `${((yearRange[0] - 2000) / 25) * 100}%`, 
            width: `${((yearRange[1] - yearRange[0]) / 25) * 100}%` 
          }}
        ></div>
      </div>
      
      {/* Min thumb */}
      <input
        type="range"
        min="2000"
        max="2025"
        value={yearRange[0]}
        onChange={(e) => {
          const newMin = parseInt(e.target.value);
          setYearRange([
            newMin > yearRange[1] ? yearRange[1] : newMin,
            yearRange[1]
          ]);
        }}
        className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer pointer-events-none"
        style={{ 
          top: "0px",
          zIndex: "30",
          WebkitAppearance: "none",
        }}
      />
      
      {/* Max thumb */}
      <input
        type="range"
        min="2000"
        max="2025"
        value={yearRange[1]}
        onChange={(e) => {
          const newMax = parseInt(e.target.value);
          setYearRange([
            yearRange[0],
            newMax < yearRange[0] ? yearRange[0] : newMax
          ]);
        }}
        className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer pointer-events-none"
        style={{ 
          top: "0px",
          zIndex: "30",
          WebkitAppearance: "none",
        }}
      />
      
      {/* Custom thumb styling */}
      <style jsx>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: all;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 40;
        }
        
        input[type=range]:nth-child(2)::-webkit-slider-thumb {
          background: #06b6d4; /* cyan-500 */
        }
        
        input[type=range]:nth-child(3)::-webkit-slider-thumb {
          background: #d946ef; /* fuchsia-500 */
        }
        
        input[type=range]::-moz-range-thumb {
          pointer-events: all;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 40;
          border: none;
        }
        
        input[type=range]:nth-child(2)::-moz-range-thumb {
          background: #06b6d4; /* cyan-500 */
        }
        
        input[type=range]:nth-child(3)::-moz-range-thumb {
          background: #d946ef; /* fuchsia-500 */
        }
      `}</style>
    </div>
    
    <div className="flex justify-between text-xs text-cyan-600 mt-4">
      <span>2000</span>
      <span>2010</span>
      <span>2020</span>
      <span>2025</span>
    </div>
  </div>
</div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-800 text-cyan-400 rounded-lg hover:bg-gray-700 transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {activeGenres.length > 0 && (
              <div className="flex items-center">
                <span className="text-xs text-cyan-600 mr-2">Genres:</span>
                {activeGenres.map(genre => (
                  <span key={genre} className="inline-flex items-center bg-cyan-900 bg-opacity-30 text-cyan-400 rounded px-2 py-1 text-xs mr-1">
                    {genre}
                    <button 
                      onClick={() => toggleGenreFilter(genre)}
                      className="ml-1 text-cyan-600 hover:text-cyan-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {activeNetworks.length > 0 && (
              <div className="flex items-center">
                <span className="text-xs text-cyan-600 mr-2">Networks:</span>
                {activeNetworks.map(network => (
                  <span key={network} className="inline-flex items-center bg-violet-900 bg-opacity-30 text-violet-400 rounded px-2 py-1 text-xs mr-1">
                    {network}
                    <button 
                      onClick={() => toggleNetworkFilter(network)}
                      className="ml-1 text-violet-600 hover:text-violet-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {(yearRange[0] > 2000 || yearRange[1] < 2025) && (
              <div className="flex items-center">
                <span className="text-xs text-cyan-600 mr-2">Years:</span>
                <span className="inline-flex items-center bg-fuchsia-900 bg-opacity-30 text-fuchsia-400 rounded px-2 py-1 text-xs">
                  {yearRange[0]} - {yearRange[1]}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {filteredShows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShows.map((show) => {
              const avgRating = show.reviews.length > 0 
                ? (show.reviews.reduce((acc, review) => acc + review.rating, 0) / show.reviews.length).toFixed(1) 
                : "N/A";
                
              return (
                <div key={show.id} className="relative group overflow-hidden transform transition-transform duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gray-900 border border-cyan-900 rounded-xl transform transition-transform duration-500 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-cyan-900 bg-opacity-20 rounded-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                  
                  <div className="relative z-10">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={show.image} 
                        alt={show.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                      
                      <div className="absolute top-2 right-2 flex items-center">
                        <span className="bg-black bg-opacity-70 text-cyan-400 px-2 py-1 rounded text-xs">
                          {show.releaseYear}
                        </span>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <h2 className="text-2xl font-bold text-white tracking-wide">{show.name}</h2>
                        <p className="text-cyan-400 text-sm">{show.network}</p>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex flex-wrap gap-1 mb-4">
                        {show.genre.map(g => (
                          <span 
                            key={g} 
                            className="text-xs px-2 py-1 rounded bg-gradient-to-r from-cyan-900 to-fuchsia-900 bg-opacity-30 text-cyan-400"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-white font-bold">{avgRating}</span>
                          <span className="ml-1 text-sm text-cyan-600">
                            ({show.reviews.length} {show.reviews.length === 1 ? 'review' : 'reviews'})
                          </span>
                        </div>
                        
                        <button 
                          className={`text-xs px-2 py-1 rounded-lg transition-all ${
                            show.reviews.length > 0 
                              ? "bg-gray-800 text-cyan-400 hover:bg-gray-700 cursor-pointer" 
                              : "bg-gray-800 text-gray-600 cursor-not-allowed"
                          }`}
                          onClick={() => show.reviews.length > 0 ? viewShowReviews(show) : null}
                          disabled={show.reviews.length === 0}
                        >
                          {show.reviews.length > 0 ? "VIEW REVIEWS" : "NO REVIEWS YET"}
                        </button>
                      </div>
                      
                      <button 
                        className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-glow"
                        onClick={() => openReviewForm(show)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        ADD REVIEW
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-cyan-900 rounded-xl bg-gray-900 bg-opacity-50 text-center">
            <svg className="w-16 h-16 text-cyan-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl text-cyan-400 mb-2">No shows found</h3>
            <p className="text-cyan-600 mb-6">Your search or filter combination didn't match any shows in our database.</p>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-black font-bold rounded-lg transition-all"
              onClick={resetFilters}
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
        
        {selectedShow && !isViewingReviews && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-cyan-900 rounded-xl max-w-md w-full shadow-xl shadow-cyan-900/20 overflow-hidden">
              <div className="border-b border-cyan-900 p-4 flex justify-between items-center bg-black bg-opacity-40">
                <h2 className="text-xl font-bold text-white">Review {selectedShow.name}</h2>
                <button 
                  onClick={closeModal}
                  className="text-cyan-600 hover:text-cyan-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-cyan-400 mb-2 text-sm">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`text-3xl transition-all ${
                          star <= newReview.rating ? 'text-cyan-400 hover:text-cyan-300' : 'text-gray-700 hover:text-gray-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-cyan-400 mb-2 text-sm">Your Review</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your thoughts about this show..."
                    className="w-full p-3 rounded-lg bg-gray-800 border border-cyan-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500"
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="block text-cyan-400 mb-2 text-sm">Recommended For (Optional)</label>
                  <input
                    type="text"
                    value={newReview.recommendedFor}
                    onChange={(e) => setNewReview({ ...newReview, recommendedFor: e.target.value })}
                    placeholder="E.g., 'Fantasy fans', 'Action lovers'"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-cyan-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="spoilerCheck"
                    checked={newReview.spoiler}
                    onChange={(e) => setNewReview({ ...newReview, spoiler: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 bg-gray-800 border-cyan-900 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="spoilerCheck" className="ml-2 text-sm text-cyan-400">
                    This review contains spoilers
                  </label>
                </div>
              </div>
              
              <div className="border-t border-cyan-900 p-4 bg-black bg-opacity-40 flex gap-3">
                <button
                  className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                    newReview.rating > 0 && newReview.comment.trim()
                      ? "bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-black font-bold"
                      : "bg-gray-800 text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() => handleAddReview(selectedShow.id)}
                  disabled={!(newReview.rating > 0 && newReview.comment.trim())}
                >
                  SUBMIT REVIEW
                </button>
                <button
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-cyan-400 font-medium py-2 px-4 rounded-lg transition-all"
                  onClick={closeModal}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
        
        {selectedShow && isViewingReviews && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-cyan-900 rounded-xl max-w-2xl w-full shadow-xl shadow-cyan-900/20 max-h-screen overflow-hidden flex flex-col">
              <div className="border-b border-cyan-900 p-4 flex justify-between items-center bg-black bg-opacity-40">
                <h2 className="text-xl font-bold text-white">Reviews for {selectedShow.name}</h2>
                <div className="flex items-center gap-4">
                  <div>
                    <select 
                      value={reviewSort} 
                      onChange={(e) => setReviewSort(e.target.value)}
                      className="bg-gray-800 border border-cyan-900 px-2 py-1 rounded text-cyan-400 text-sm focus:outline-none"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                    </select>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="text-cyan-600 hover:text-cyan-400 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto flex-grow">
                {selectedShow.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {getSortedReviews(selectedShow.reviews).map((review) => (
                      <div key={review.id} className={`border ${review.spoiler ? 'border-red-900' : 'border-cyan-900'} rounded-lg overflow-hidden`}>
                        <div className={`p-4 ${review.spoiler ? 'bg-red-900 bg-opacity-20' : 'bg-cyan-900 bg-opacity-20'}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-lg text-white">{review.author || 'Anonymous'}</span>
                              <span className="text-xs text-cyan-600 ml-2">{review.date || 'No date'}</span>
                            </div>
                            {displayStars(review.rating)}
                          </div>
                        </div>
                        
                        <div className={`p-4 ${review.spoiler ? 'bg-gray-900' : 'bg-gray-800'} bg-opacity-40`}>
                          {review.spoiler && (
                            <div className="mb-2 bg-red-900 bg-opacity-30 px-3 py-1 rounded text-xs inline-block text-red-400">
                              CONTAINS SPOILERS
                            </div>
                          )}
                          <p className="text-gray-300">{review.comment}</p>
                          
                          {review.recommendedFor && (
                            <div className="mt-3 text-sm">
                              <span className="text-cyan-600">Recommended for: </span>
                              <span className="text-white">{review.recommendedFor}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <svg className="w-12 h-12 text-cyan-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <h3 className="text-xl text-cyan-400 mb-2">No reviews yet</h3>
                    <p className="text-cyan-600">Be the first to share your thoughts on this show!</p>
                  </div>
                )}
              </div>
              
              <div className="border-t border-cyan-900 p-4 bg-black bg-opacity-40">
                <button
                  className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-black font-bold py-2 px-4 rounded-lg transition-all"
                  onClick={() => setIsViewingReviews(false)}
                >
                  WRITE A REVIEW
                </button>
              </div>
            </div>
          </div>
        )}
        
        {notification.show && (
          <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-cyan-900 to-fuchsia-900 text-white' 
              : 'bg-red-900 text-white'
          }`}>
            {notification.type === 'success' ? (
              <svg className="w-6 h-6 text-cyan-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <p>{notification.message}</p>
          </div>
        )}

        {showUsernameModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-cyan-900 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl text-cyan-400 mb-4">Set Username</h3>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 border border-cyan-900 rounded-lg text-cyan-400 focus:outline-none focus:border-cyan-500"
                placeholder="Enter your username"
              />
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-black py-2 rounded-lg transition-all"
                  onClick={() => {
                    if (tempUsername.trim()) setUserName(tempUsername.trim());
                    setShowUsernameModal(false);
                  }}
                >
                  Confirm
                </button>
                <button
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-cyan-400 py-2 rounded-lg transition-all"
                  onClick={() => setShowUsernameModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="relative z-20 py-8 border-t border-cyan-900 mt-20 bg-gray-900 bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-sm text-cyan-600 mb-4">© 2025 NEON REVIEWS</div>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="text-cyan-500 hover:text-cyan-400 transition-colors">Terms</a>
            <a href="#" className="text-cyan-500 hover:text-cyan-400 transition-colors">Privacy</a>
            <a href="#" className="text-cyan-500 hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      { <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .bg-scan-line {
          position: absolute;
          width: 100%;
          height: 100px;
          background: linear-gradient(to bottom, 
            rgba(255,255,255,0) 0%,
            rgba(176, 224, 230, 0.1) 50%, 
            rgba(255,255,255,0) 100%);
          animation: scanline 8s linear infinite;
        }
        
        .shadow-glow {
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
        }
        
        .glitch-text:hover {
          animation: glitch 0.5s linear infinite;
        }
        
        @keyframes glitch {
          0% { transform: translate(2px, 0) skew(0deg); }
          20% { transform: translate(-2px, 0) skew(0deg); }
          40% {
            transform: translate(2px, 0) skew(0deg);
            text-shadow: 3px 3px rgba(203, 61, 188, 0.5), -3px -3px rgba(64, 224, 208, 0.5);
          }
          60% { transform: translate(-2px, 0) skew(0deg); }
          80% { transform: translate(0, 0) skew(5deg); }
          100% { transform: translate(0, 0) skew(0deg); }
        }
      `}</style> }
    </div>
  );
}

export default App;