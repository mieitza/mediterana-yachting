import siteSettings from "./siteSettings";
import yacht from "./yacht";
import destination from "./destination";
import post from "./post";
import page from "./page";
import teamMember from "./teamMember";
import aboutPage from "./aboutPage";
import contactPage from "./contactPage";
import homePage from "./homePage";
import externalImage from "./objects/externalImage";
import blockContent from "./objects/blockContent";

export const schemaTypes = [
  // Singleton Pages
  siteSettings,
  homePage,
  aboutPage,
  contactPage,
  // Collections
  yacht,
  destination,
  post,
  teamMember,
  page,
  // Objects
  externalImage,
  blockContent,
];
