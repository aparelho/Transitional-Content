// Use actual project images - optimized webp versions for better performance
const imgFrame1881 = "/images/webp/a.webp";
const imgFrame1885 = "/images/webp/akasite.webp";
const imgFrame1880 = "/images/webp/b.webp";
const imgFrame1882 = "/images/webp/c.webp";
const imgFrame1890 = "/images/webp/d.webp";
const imgFrame1887 = "/images/webp/e.webp";
const imgFrame1883 = "/images/webp/img1.webp";
const imgHaightGiffBook1 = "/images/webp/img2.webp";
const imgHaight1 = "/images/webp/img3.webp";
const imgHaightGiffBook2 = "/images/webp/img4.webp";

// Additional images use different project images for variety
const imgImage = "/images/webp/img5.webp";
const imgImage1 = "/images/webp/img6.webp";
const imgImage2 = "/images/webp/img7.webp";
const imgImage3 = "/images/webp/img8.webp";
const imgImage4 = "/images/webp/img9.webp";
const imgImage5 = "/images/webp/img10.webp";
const imgImage6 = "/images/webp/img11.webp";
const imgImage7 = "/images/webp/img12.webp";
const imgImage8 = "/images/webp/img13.webp";
const imgImage9 = "/images/webp/AP165-Osklen-Mockup-Desktop-SL06.webp";
const imgImage10 = "/images/webp/AP165-Osklen-Mockup-Mobile-BL11.webp";
const imgImage11 = "/images/webp/AP165-Osklen-Mockup-Mobile-BL11-b.webp";
const imgImageCase = "/images/webp/DTS_AURA_Fanette_Guilloud_Photos_ID12959.webp";
const imgImageCase1 = "/images/webp/FLORA-Apply Metallic Material-a65103ba.webp";
const imgScreenshot20250521At1256461 = "/images/webp/dainer18.webp";
const imgImageCase2 = "/images/webp/a.webp";
const imgImageCase3 = "/images/webp/b.webp";
const imgImageCase4 = "/images/webp/c.webp";
const imgImageCase5 = "/images/webp/d.webp";
const imgImageCase6 = "/images/webp/e.webp";
const imgImageCase7 = "/images/webp/img1.webp";
const imgImageCase8 = "/images/webp/img2.webp";
const imgImageCase9 = "/images/webp/img3.webp";
const img7070010TshirtLightLinenMc2 = "/images/webp/img4.webp";
const img05BC1 = "/images/webp/img5.webp";
const imgA = "/images/webp/img6.webp";
const imgAutoref2332231 = "/images/webp/img7.webp";
const imgAutorefDomMaria = "/images/webp/img8.webp";
const imgAutoref3 = "/images/webp/img9.webp";
const imgScreenshot20250611At1554431 = "/images/webp/img10.webp";
const imgImage12 = "/images/webp/img11.webp";
const imgImage13 = "/images/webp/img12.webp";
const imgImage14 = "/images/webp/img13.webp";
const imgScreenshot20250715At1458181 = "/images/webp/akasite.webp";
const imgScreenshot20250715At1458411 = "/images/webp/AP165-Osklen-Mockup-Desktop-SL06.webp";
const imgScreenshot20250715At1459431 = "/images/webp/AP165-Osklen-Mockup-Mobile-BL11.webp";
const imgScreenshot20250715At1459591 = "/images/webp/AP165-Osklen-Mockup-Mobile-BL11-b.webp";
const imgScreenshot20250715At1500461 = "/images/webp/DTS_AURA_Fanette_Guilloud_Photos_ID12959.webp";
const imgScreenshot20250715At1501021 = "/images/webp/FLORA-Apply Metallic Material-a65103ba.webp";
const imgScreenshot20250715At1503241 = "/images/webp/dainer18.webp";
const imgScreenshot20250715At1503561 = "/images/webp/a.webp";
const imgScreenshot20250715At1505491 = "/images/webp/b.webp";
const imgScreenshot20250715At1506251 = "/images/webp/c.webp";
const imgScreenshot20250715At1506501 = "/images/webp/d.webp";
const imgImage15 = "/images/webp/e.webp";
const imgImage16 = "/images/webp/img1.webp";
const imgIOsIconMockup1 = "/images/webp/img2.webp";
const imgStaytementPost1 = "/images/webp/img3.webp";
const imgDtsObjectsDanielFaroPhotosId73692 = "/images/webp/img4.webp";
const imgDtsSoftLuxeDanielFaroPhotosId10794 = "/images/webp/img5.webp";
const imgScreenshot20241119At1820161 = "/images/webp/img6.webp";
const imgDainer0102361 = "/images/webp/img7.webp";
const imgImage17 = "/images/webp/img8.webp";
const imgImage18 = "/images/webp/img9.webp";
const imgImage19 = "/images/webp/img10.webp";
const imgScreenshot20250327At2005211 = "/images/webp/img11.webp";
const imgFloraOriginalA1Bf847E1 = "/images/webp/img12.webp";
const imgFjFoundation1 = "/images/webp/img13.webp";
const imgA1 = "/images/webp/akasite.webp";
const imgScreenShot20230406At202718 = "/images/webp/AP165-Osklen-Mockup-Desktop-SL06.webp";
const imgScreenShot20230406At202835 = "/images/webp/AP165-Osklen-Mockup-Mobile-BL11.webp";
const imgScreenShot20230406At202935 = "/images/webp/DTS_AURA_Fanette_Guilloud_Photos_ID12959.webp";
const imgScreenShot20230406At203700 = "/images/webp/FLORA-Apply Metallic Material-a65103ba.webp";

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

// Optimized image array - using only unique images for better performance
export const bookImages = [
  "/images/webp/a.webp",
  "/images/webp/akasite.webp",
  "/images/webp/b.webp",
  "/images/webp/c.webp",
  "/images/webp/d.webp",
  "/images/webp/e.webp",
  "/images/webp/img1.webp",
  "/images/webp/img2.webp",
  "/images/webp/img3.webp",
  "/images/webp/img4.webp",
  "/images/webp/img5.webp",
  "/images/webp/img6.webp",
  "/images/webp/img7.webp",
  "/images/webp/img8.webp",
  "/images/webp/img9.webp",
  "/images/webp/img10.webp",
  "/images/webp/img11.webp",
  "/images/webp/img12.webp",
  "/images/webp/img13.webp",
  "/images/webp/AP165-Osklen-Mockup-Desktop-SL06.webp",
  "/images/webp/AP165-Osklen-Mockup-Mobile-BL11.webp",
  "/images/webp/AP165-Osklen-Mockup-Mobile-BL11-b.webp",
  "/images/webp/DTS_AURA_Fanette_Guilloud_Photos_ID12959.webp",
  "/images/webp/FLORA-Apply Metallic Material-a65103ba.webp",
  "/images/webp/dainer18.webp"
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
