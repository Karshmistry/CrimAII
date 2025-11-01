export const newsData = Array.from({ length: 20 }, (_, i) => {
  const categories = ["Crime", "Missing", "Cybercrime", "Traffic"];
  const category = categories[i % categories.length];
  return {
    id: i,
    title: `News Headline ${i + 1}`,
    description: `Short description for news ${i + 1}`,
    content: `This is the **full content** of news item ${i + 1}. You can put complete article details here.`,
    date: `0${(i % 30) + 1}/10/2025`,
    category: category,
    image: `https://picsum.photos/400/200?random=${i + 1}`,
  };
});
