// Use placeholder images for book covers
const bookPlaceholder = "/images/book-placeholder.svg";

const imgFrame1881 = bookPlaceholder;
const imgFrame1885 = bookPlaceholder;
const imgFrame1880 = bookPlaceholder;
const imgFrame1882 = bookPlaceholder;
const imgFrame1890 = bookPlaceholder;
const imgFrame1887 = bookPlaceholder;
const imgFrame1883 = bookPlaceholder;
const imgHaightGiffBook1 = bookPlaceholder;
const imgHaight1 = bookPlaceholder;
const imgHaightGiffBook2 = bookPlaceholder;

// Additional images use same placeholder
const imgImage = bookPlaceholder;
const imgImage1 = bookPlaceholder;
const imgImage2 = bookPlaceholder;
const imgImage3 = bookPlaceholder;
const imgImage4 = bookPlaceholder;
const imgImage5 = bookPlaceholder;
const imgImage6 = bookPlaceholder;
const imgImage7 = bookPlaceholder;
const imgImage8 = bookPlaceholder;
const imgImage9 = bookPlaceholder;
const imgImage10 = bookPlaceholder;
const imgImage11 = bookPlaceholder;
const imgImageCase = bookPlaceholder;
const imgImageCase1 = bookPlaceholder;
const imgScreenshot20250521At1256461 = bookPlaceholder;
const imgImageCase2 = bookPlaceholder;
const imgImageCase3 = bookPlaceholder;
const imgImageCase4 = bookPlaceholder;
const imgImageCase5 = bookPlaceholder;
const imgImageCase6 = bookPlaceholder;
const imgImageCase7 = bookPlaceholder;
const imgImageCase8 = bookPlaceholder;
const imgImageCase9 = bookPlaceholder;
const img7070010TshirtLightLinenMc2 = bookPlaceholder;
const img05BC1 = bookPlaceholder;
const imgA = bookPlaceholder;
const imgAutoref2332231 = bookPlaceholder;
const imgAutorefDomMaria = bookPlaceholder;
const imgAutoref3 = bookPlaceholder;
const imgScreenshot20250611At1554431 = bookPlaceholder;
const imgImage12 = bookPlaceholder;
const imgImage13 = bookPlaceholder;
const imgImage14 = bookPlaceholder;
const imgScreenshot20250715At1458181 = bookPlaceholder;
const imgScreenshot20250715At1458411 = bookPlaceholder;
const imgScreenshot20250715At1459431 = bookPlaceholder;
const imgScreenshot20250715At1459591 = bookPlaceholder;
const imgScreenshot20250715At1500461 = bookPlaceholder;
const imgScreenshot20250715At1501021 = bookPlaceholder;
const imgScreenshot20250715At1503241 = bookPlaceholder;
const imgScreenshot20250715At1503561 = bookPlaceholder;
const imgScreenshot20250715At1505491 = bookPlaceholder;
const imgScreenshot20250715At1506251 = bookPlaceholder;
const imgScreenshot20250715At1506501 = bookPlaceholder;
const imgImage15 = bookPlaceholder;
const imgImage16 = bookPlaceholder;
const imgIOsIconMockup1 = bookPlaceholder;
const imgStaytementPost1 = bookPlaceholder;
const imgDtsObjectsDanielFaroPhotosId73692 = bookPlaceholder;
const imgDtsSoftLuxeDanielFaroPhotosId10794 = bookPlaceholder;
const imgScreenshot20241119At1820161 = bookPlaceholder;
const imgDainer0102361 = bookPlaceholder;
const imgImage17 = bookPlaceholder;
const imgImage18 = bookPlaceholder;
const imgImage19 = bookPlaceholder;
const imgScreenshot20250327At2005211 = bookPlaceholder;
const imgFloraOriginalA1Bf847E1 = bookPlaceholder;
const imgFjFoundation1 = bookPlaceholder;
const imgA1 = bookPlaceholder;
const imgScreenShot20230406At202718 = bookPlaceholder;
const imgScreenShot20230406At202835 = bookPlaceholder;
const imgScreenShot20230406At202935 = bookPlaceholder;
const imgScreenShot20230406At203700 = bookPlaceholder;

export interface Article {
  id: number;
  title: string;
  image: string;
  category: string;
}

export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseVx: number; // Original velocity for interpolation
  baseVy: number; // Original velocity for interpolation
  baseVz: number; // Original z velocity for tunnel effect
  size: number;
  article: Article;
  screenX: number; // Projected 2D coordinates
  screenY: number;
  screenSize: number; // Size after perspective projection
}

export interface ModalType {
  id: number;
  title: string;
  theme: string;
  categories: string[];
  color: string;
}

// Book cover images array - greatly expanded for variety
export const bookImages = [
  // Original book covers
  imgFrame1881,
  imgFrame1885, 
  imgFrame1880,
  imgFrame1882,
  imgFrame1890,
  imgFrame1887,
  imgFrame1883,
  imgHaightGiffBook1,
  imgHaight1,
  imgHaightGiffBook2,
  
  // Additional portfolio images for more variety
  imgImage,
  imgImage1,
  imgImage2,
  imgImage3,
  imgImage4,
  imgImage5,
  imgImage6,
  imgImage7,
  imgImage8,
  imgImage9,
  imgImage10,
  imgImage11,
  imgImageCase,
  imgImageCase1,
  imgImageCase2,
  imgImageCase3,
  imgImageCase4,
  imgImageCase5,
  imgImageCase6,
  imgImageCase7,
  imgImageCase8,
  imgImageCase9,
  img7070010TshirtLightLinenMc2,
  img05BC1,
  imgA,
  imgAutoref2332231,
  imgAutorefDomMaria,
  imgAutoref3,
  imgScreenshot20250611At1554431,
  imgImage12,
  imgImage13,
  imgImage14,
  imgScreenshot20250715At1458181,
  imgScreenshot20250715At1458411,
  imgScreenshot20250715At1459431,
  imgScreenshot20250715At1459591,
  imgScreenshot20250715At1500461,
  imgScreenshot20250715At1501021,
  imgScreenshot20250715At1503241,
  imgScreenshot20250715At1503561,
  imgScreenshot20250715At1505491,
  imgScreenshot20250715At1506251,
  imgScreenshot20250715At1506501,
  imgImage15,
  imgImage16,
  imgIOsIconMockup1,
  imgStaytementPost1,
  imgDtsObjectsDanielFaroPhotosId73692,
  imgDtsSoftLuxeDanielFaroPhotosId10794,
  imgScreenshot20241119At1820161,
  imgDainer0102361,
  imgImage17,
  imgImage18,
  imgImage19,
  imgScreenshot20250327At2005211,
  imgFloraOriginalA1Bf847E1,
  imgFjFoundation1,
  imgA1,
  imgScreenShot20230406At202718,
  imgScreenShot20230406At202835,
  imgScreenShot20230406At202935,
  imgScreenShot20230406At203700
];

// Modal types with different themes
export const modalTypes: ModalType[] = [
  {
    id: 0,
    title: "Tech Innovation Hub",
    theme: "technology",
    categories: ['Technology', 'Innovation', 'AI'],
    color: "from-blue-600 to-cyan-600"
  },
  {
    id: 1,
    title: "Science Discovery Lab",
    theme: "science",
    categories: ['Science', 'Research', 'Medicine'],
    color: "from-green-600 to-emerald-600"
  },
  {
    id: 2,
    title: "Design Studio Collective",
    theme: "design",
    categories: ['Design', 'Art', 'Creative'],
    color: "from-purple-600 to-pink-600"
  },
  {
    id: 3,
    title: "Business Strategy Center",
    theme: "business",
    categories: ['Business', 'Finance', 'Leadership'],
    color: "from-orange-600 to-red-600"
  },
  {
    id: 4,
    title: "Space Exploration Zone",
    theme: "space",
    categories: ['Space', 'Astronomy', 'Future'],
    color: "from-indigo-600 to-purple-600"
  },
  {
    id: 5,
    title: "Nature Conservation Hub",
    theme: "nature",
    categories: ['Nature', 'Environment', 'Climate'],
    color: "from-green-500 to-teal-600"
  },
  {
    id: 6,
    title: "Digital Art Gallery",
    theme: "art",
    categories: ['Art', 'Digital', 'NFT'],
    color: "from-pink-600 to-rose-600"
  },
  {
    id: 7,
    title: "Future Tech Laboratory",
    theme: "future",
    categories: ['Future', 'Quantum', 'Emerging'],
    color: "from-cyan-600 to-blue-600"
  },
  {
    id: 8,
    title: "Health & Wellness Center",
    theme: "health",
    categories: ['Health', 'Wellness', 'Biotech'],
    color: "from-emerald-600 to-green-600"
  },
  {
    id: 9,
    title: "Global Culture Network",
    theme: "culture",
    categories: ['Culture', 'Society', 'Global'],
    color: "from-yellow-600 to-orange-600"
  }
];

// Simple word array for search component (from thematic words)
export const searchWords = [
  'ai', 'quantum', 'design', 'health', 'space', 'nature', 'art', 'future',
  'technology', 'science', 'business', 'culture', 'innovation', 'research',
  'code', 'data', 'digital', 'creative', 'wellness', 'discovery'
];

// Extended thematic words for more variety
export const thematicWords: { [key: string]: string[] } = {
  'technology': ['ai', 'code', 'data', 'cloud', 'apps', 'digital', 'cyber', 'tech', 'neural', 'smart'],
  'science': ['research', 'lab', 'theory', 'discovery', 'study', 'atoms', 'genes', 'physics', 'biology', 'chemistry'],
  'design': ['ui', 'brand', 'visual', 'creative', 'layout', 'color', 'typography', 'interface', 'motion', 'graphic'],
  'business': ['strategy', 'growth', 'market', 'revenue', 'team', 'profit', 'startup', 'scale', 'invest', 'venture'],
  'space': ['mars', 'orbit', 'galaxy', 'cosmos', 'rocket', 'stellar', 'lunar', 'solar', 'asteroid', 'nebula'],
  'nature': ['earth', 'ocean', 'forest', 'climate', 'green', 'eco', 'bio', 'wild', 'flora', 'fauna'],
  'art': ['canvas', 'digital', 'nft', 'gallery', 'create', 'paint', 'sculpt', 'draw', 'craft', 'aesthetic'],
  'future': ['quantum', 'nano', 'bio', 'neural', 'next', 'emerging', 'evolve', 'progress', 'advance', 'tomorrow'],
  'health': ['wellness', 'therapy', 'medical', 'care', 'life', 'healing', 'fitness', 'vitality', 'recovery', 'medicine'],
  'culture': ['global', 'society', 'human', 'world', 'people', 'heritage', 'tradition', 'community', 'diversity', 'identity']
};

const allCategories = ['Technology', 'Science', 'Design', 'Business', 'Art', 'Nature', 'Space', 'Innovation', 'AI', 'Research', 'Medicine', 'Creative', 'Finance', 'Leadership', 'Astronomy', 'Future', 'Environment', 'Climate', 'Digital', 'NFT', 'Quantum', 'Emerging', 'Health', 'Wellness', 'Biotech', 'Culture', 'Society', 'Global'];

const titles = [
  'Revolutionary AI Breakthrough Changes Everything We Know About Machine Intelligence and Cognitive Computing',
  'The Future of Sustainable Energy Solutions and Their Impact on Global Climate Change',
  'Minimalist Design Principles for Modern Apps',
  'Startup Success Stories from Silicon Valley and the Entrepreneurial Ecosystem That Drives Innovation',
  'Digital Art in the Age of NFTs',
  'Climate Change and Ocean Conservation: A Comprehensive Study of Marine Ecosystem Preservation',
  'Mars Colony Plans Revealed by NASA',
  'Quantum Computing Reaches New Milestone in Error Correction and Computational Supremacy',
  'The Psychology of User Experience Design',
  'Blockchain Technology Beyond Cryptocurrency: Revolutionizing Supply Chain and Digital Identity',
  'Renewable Energy Grid Transformations',
  'Space Tourism Becomes Reality with Private Companies Leading the Next Frontier of Human Exploration',
  'AI Ethics in Healthcare Applications',
  'The Rise of Remote Work Culture and Its Long-Term Effects on Corporate Productivity and Employee Wellbeing',
  'Biotechnology Advances in Medicine',
  'Virtual Reality in Education Systems: Transforming Learning Through Immersive Technology Experiences',
  'Sustainable Architecture for Cities',
  'Machine Learning in Financial Markets: Algorithmic Trading and Risk Assessment in the Digital Economy',
  'Creative Coding and Generative Art',
  'Ocean Plastic Cleanup Innovations and Technologies for Marine Environment Restoration',
  'Interplanetary Communication Networks',
  'Brain-Computer Interface Progress: Neurotechnology Breakthroughs in Human-Machine Integration',
  'Renewable Energy Storage Solutions',
  'Digital Privacy in Social Media: Protecting Personal Data in the Age of Information Surveillance',
  'Gene Therapy Clinical Breakthroughs',
  'Urban Farming Technology Advances: Vertical Agriculture and Food Security in Metropolitan Areas',
  'Autonomous Vehicle Safety Systems',
  'Cryptocurrency Market Evolution: Decentralized Finance and the Future of Digital Asset Management',
  'Augmented Reality Shopping Experience',
  'Space Debris Cleanup Technologies and Orbital Sustainability for Future Space Missions'
];

// Mock article data generator using imported book cover images
export const generateMockArticle = (id: number): Article => {
  const category = allCategories[id % allCategories.length];
  const title = titles[id % titles.length];
  // Use imported book cover images instead of random images
  const imageIndex = id % bookImages.length;
  const bookCoverImage = bookImages[imageIndex];
  
  return {
    id,
    title,
    image: bookCoverImage,
    category
  };
};
