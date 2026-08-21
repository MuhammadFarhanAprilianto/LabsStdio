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
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-['Questrial',sans-serif]">
      {/* Hero Section dengan Animasi Titik Ombak / Handshake Dot Matrix */}
      <Hero />

      {/* Section Kotak Interaktif Membesar saat Di-scroll (Showcase Video Card) */}
      <ScrollReveal distance={50} duration={900}>
        <ShowcaseCardSection />
      </ScrollReveal>

      {/* Section Headline Layanan dengan Foto Interaktif Muncul di Tengah Teks */}
      <ScrollReveal distance={50} duration={900}>
        <ServicesHeadlineSection />
      </ScrollReveal>

      {/* Section Looping Marquee Cards Layanan (Kanan ke Kiri & Hover / Click Pause) */}
      <ScrollReveal distance={50} duration={900}>
        <ServicesCardsCarousel />
      </ScrollReveal>

      {/* Section Projects Completed For (3 Baris Marquee Bersilangan Kanan-Kiri & Kiri-Kanan) */}
      <ScrollReveal distance={50} duration={900}>
        <ProjectsCompletedSection />
      </ScrollReveal>

      {/* Section Our Portfolio dengan Filter Tabs & Interaksi Cursor See Full Project */}
      <ScrollReveal distance={50} duration={900}>
        <PortfolioSection />
      </ScrollReveal>

      {/* Section Testimonials (Words from the People We've Worked With) */}
      <ScrollReveal distance={50} duration={900}>
        <TestimonialsSection />
      </ScrollReveal>

      {/* Section Why Choose Us */}
      <ScrollReveal distance={50} duration={900}>
        <WhyChooseUsSection />
      </ScrollReveal>

      {/* Section Our Process (How We Get It Done) */}
      <ScrollReveal distance={50} duration={900}>
        <OurProcessSection />
      </ScrollReveal>

      {/* Section Consult Strategy & Free Consultation Banner */}
      <ScrollReveal distance={50} duration={900}>
        <ConsultationBannerSection />
      </ScrollReveal>

      {/* Footer Section */}
      <ScrollReveal distance={40} duration={850}>
        <Footer />
      </ScrollReveal>

      {/* 3-Layer Brand Finale Banner (Globe 3D -> Black 50% Overlay -> Promethean Labs Logo) */}
      <ScrollReveal distance={40} duration={850}>
        <FooterBrandShowcase />
      </ScrollReveal>
    </main>
  );
}
