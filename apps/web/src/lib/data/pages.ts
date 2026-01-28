import { db, homePage, aboutPage, contactPage, siteSettings, teamMembers } from '@/lib/db';
import { asc } from 'drizzle-orm';
import { resolveImage } from './utils';

export interface SiteSettingsData {
  siteName: string;
  siteDescription: string | null;
  logo: { url: string; alt?: string } | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  twitter: string | null;
  youtube: string | null;
  whatsapp: string | null;
  footerTagline: string | null;
  footerLinks: Array<{ label: string; href: string }> | null;
  copyrightText: string | null;
  featuredYachts: string[] | null;
  defaultSeoImage: string | null;
  twitterHandle: string | null;
}

export async function getSiteSettings(): Promise<SiteSettingsData | null> {
  const settings = db.select().from(siteSettings).get();

  if (!settings) return null;

  return {
    siteName: settings.siteName || 'Mediterana Yachting',
    siteDescription: settings.siteDescription,
    logo: resolveImage(settings.logo ? JSON.parse(settings.logo) : null),
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    contactAddress: settings.contactAddress,
    instagram: settings.instagram,
    facebook: settings.facebook,
    linkedin: settings.linkedin,
    twitter: settings.twitter,
    youtube: settings.youtube,
    whatsapp: settings.whatsapp,
    footerTagline: settings.footerTagline,
    footerLinks: settings.footerLinks ? JSON.parse(settings.footerLinks) : null,
    copyrightText: settings.copyrightText,
    featuredYachts: settings.featuredYachts ? JSON.parse(settings.featuredYachts) : null,
    defaultSeoImage: settings.defaultSeoImage,
    twitterHandle: settings.twitterHandle,
  };
}

export async function getHomePage() {
  const page = db.select().from(homePage).get();

  if (!page) return null;

  return {
    ...page,
    heroImage: resolveImage(page.heroImage ? JSON.parse(page.heroImage) : null),
    heroCtas: page.heroCtas ? JSON.parse(page.heroCtas) : null,
    whyMediteranaFeatures: page.whyMediteranaFeatures ? JSON.parse(page.whyMediteranaFeatures) : null,
    processSteps: page.processSteps ? JSON.parse(page.processSteps) : null,
  };
}

export async function getAboutPage() {
  const page = db.select().from(aboutPage).get();

  if (!page) return null;

  return {
    ...page,
    heroImage: resolveImage(page.heroImage ? JSON.parse(page.heroImage) : null),
    storyImage: resolveImage(page.storyImage ? JSON.parse(page.storyImage) : null),
    statistics: page.statistics ? JSON.parse(page.statistics) : null,
    values: page.values ? JSON.parse(page.values) : null,
    processSteps: page.processSteps ? JSON.parse(page.processSteps) : null,
  };
}

export async function getContactPage() {
  const page = db.select().from(contactPage).get();

  if (!page) return null;

  return {
    ...page,
    heroImage: resolveImage(page.heroImage ? JSON.parse(page.heroImage) : null),
    officeHours: page.officeHours ? JSON.parse(page.officeHours) : null,
    faqItems: page.faqItems ? JSON.parse(page.faqItems) : null,
  };
}

export async function getTeamMembers() {
  const rows = db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.order), asc(teamMembers.name))
    .all();

  return rows.map((member) => ({
    ...member,
    image: resolveImage(member.image ? JSON.parse(member.image) : null),
  }));
}
