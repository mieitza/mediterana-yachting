import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  OrganizationSchema,
  LocalBusinessSchema,
  WebsiteSchema,
  YachtCharterServiceSchema,
} from "@/components/seo/StructuredData";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Global Structured Data for SEO */}
      <OrganizationSchema />
      <LocalBusinessSchema />
      <WebsiteSchema />
      <YachtCharterServiceSchema />

      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
