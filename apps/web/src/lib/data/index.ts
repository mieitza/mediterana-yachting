// Yachts
export {
  getAllYachts,
  getFeaturedYachts,
  getYachtBySlug,
  getYachtSlugs,
} from './yachts';
export type { YachtWithDestinations } from './yachts';

// Destinations
export {
  getAllDestinations,
  getDestinationBySlug,
  getDestinationSlugs,
} from './destinations';
export type { DestinationWithYachts } from './destinations';

// Posts
export {
  getAllPosts,
  getLatestPosts,
  getPostBySlug,
  getPostSlugs,
} from './posts';
export type { BlogPost } from './posts';

// Pages
export {
  getSiteSettings,
  getHomePage,
  getAboutPage,
  getContactPage,
  getTeamMembers,
} from './pages';
export type { SiteSettingsData } from './pages';
