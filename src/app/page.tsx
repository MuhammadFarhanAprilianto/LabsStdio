import Hero from "@/components/Hero";
import ShowcaseCardSection from "@/components/ShowcaseCardSection";
import ServicesHeadlineSection from "@/components/ServicesHeadlineSection";
import ServicesCardsCarousel from "@/components/ServicesCardsCarousel";
import ProjectsCompletedSection from "@/components/ProjectsCompletedSection";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import OurProcessSection from "@/components/OurProcessSection";
import ConsultationBannerSection from "@/components/ConsultationBannerSection";
import Footer from "@/components/Footer";
import FooterBrandShowcase from "@/components/FooterBrandShowcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-['Agrandir',sans-serif]">
      {/* Hero Section dengan Animasi Titik Ombak / Handshake Dot Matrix */}
      <Hero />

      {/* Section Kotak Interaktif Membesar saat Di-scroll (Showcase Video Card) */}
      <ShowcaseCardSection />

      {/* Section Headline Layanan dengan Foto Interaktif Muncul di Tengah Teks */}
      <ServicesHeadlineSection />

      {/* Section Looping Marquee Cards Layanan (Kanan ke Kiri & Hover / Click Pause) */}
      <ServicesCardsCarousel />

      {/* Section Projects Completed For (3 Baris Marquee Bersilangan Kanan-Kiri & Kiri-Kanan) */}
      <ProjectsCompletedSection />

      {/* Section Our Portfolio dengan Filter Tabs & Interaksi Cursor See Full Project */}
      <PortfolioSection />

      {/* Section Testimonials (Words from the People We've Worked With) */}
      <TestimonialsSection />

      {/* Section Why Choose Us */}
      <WhyChooseUsSection />

      {/* Section Our Process (How We Get It Done) */}
      <OurProcessSection />

      {/* Section Consult Strategy & Free Consultation Banner */}
      <ConsultationBannerSection />

      {/* Footer Section */}
      <Footer />

      {/* 3-Layer Brand Finale Banner (Globe 3D -> Black 50% Overlay -> Promethean Labs Logo) */}
      <FooterBrandShowcase />
    </main>
  );
}

