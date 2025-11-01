import React, { useState } from "react";

// 20 sample news items
const newsData = Array.from({ length: 20 }, (_, i) => {
  const categories = ["Crime", "Missing", "Cybercrime", "Traffic"];
  const category = categories[i % categories.length];
  return {
    title: `News Headline ${i + 1}`,
    description: `This is a sample description for news item ${i + 1}. Stay informed about recent updates and events.`,
    content: `Full article content for news item ${i + 1}. Here you can put the complete news text, paragraphs, images, etc.`,
    date: `0${(i % 30) + 1}/10/2025`,
    category: category,
    image: `https://picsum.photos/400/200?random=${i + 1}`,
  };
});

const categories = ["All", "Crime", "Missing", "Cybercrime", "Traffic"];
const categoryColors = {
  Crime: "bg-red-500",
  Missing: "bg-yellow-500",
  Cybercrime: "bg-blue-500",
  Traffic: "bg-green-500",
  All: "bg-gray-500",
};

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState(null); // track which card is open

  const filteredNews = newsData.filter((news) => {
    const matchesCategory = selectedCategory === "All" || news.category === selectedCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-black flex flex-col items-center pt-16 px-4 md:px-10 text-white">
      <h2 className="text-4xl font-extrabold mb-8 text-center tracking-wide">Latest News & Updates</h2>

      <input
        type="text"
        placeholder="Search news..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md px-4 py-3 rounded-2xl text-black focus:outline-none mb-6 shadow-lg"
      />

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {filteredNews.length > 0 ? (
          filteredNews.map((news, index) => (
            <div
              key={index}
              className="relative bg-white/5 rounded-2xl shadow-lg overflow-hidden group cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
              onClick={() => toggleExpand(index)}
            >
              <img
                src={news.image}
                alt={news.title}
                onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=No+Image"; }}
                className="w-full h-48 object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 opacity-80 group-hover:opacity-60 transition"></div>

              <span
                className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold z-10 ${
                  categoryColors[news.category] || "bg-gray-500"
                }`}
              >
                {news.category}
              </span>

              <div className="p-4 relative z-10">
                <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                <p className="text-white/80 mb-2">
                  {expandedIndex === index ? news.content : news.description}
                </p>
                <span className="text-sm text-white/60">{news.date}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-white/70">No news found.</p>
        )}
      </div>

      <button className="mt-10 px-8 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl font-semibold hover:scale-105 transition transform shadow-lg">
        Explore More
      </button>
    </div>
  );
};

export default Explore;
