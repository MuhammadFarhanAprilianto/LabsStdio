"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  Layers01Icon,
  Globe02Icon,
  SmartPhone01Icon,
  PaintBoardIcon,
  CodeIcon,
  Layout01Icon,
  ShoppingBag01Icon,
  BrowserIcon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  Menu01Icon,
  Cancel01Icon,
} from "hugeicons-react";

interface SubServiceItem {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
}

const designServices: SubServiceItem[] = [
  {
    title: "UI/UX Design",
    desc: "Web & Mobile app design",
    href: "/services/ui-ux",
    icon: <Layers01Icon className="w-4 h-4 text-white" />,
  },
  {
    title: "Web Design",
    desc: "Modern websites that convert.",
    href: "/services/web-design",
    icon: <Globe02Icon className="w-4 h-4 text-white" />,
  },
  {
    title: "Mobile App Design",
    desc: "Seamless iOS & Android design.",
    href: "/services/mobile-apps",
    icon: <SmartPhone01Icon className="w-4 h-4 text-white" />,
  },
  {
    title: "Branding",
    desc: "Identity that stands out.",
    href: "/services/branding",
    icon: <PaintBoardIcon className="w-4 h-4 text-white" />,
  },
];

const developmentServices: SubServiceItem[] = [
  {
    title: "Web Development",
    desc: "Built for speed & growth.",
    href: "/services/web-development",
    icon: <CodeIcon className="w-4 h-4 text-white" />,
  },
  {
    title: "WordPress Development",
    desc: "Easy to manage & scale.",
    href: "/services/wordpress",
    icon: <Layout01Icon className="w-4 h-4 text-white" />,
  },
  {
    title: "Shopify Development",
    desc: "Sell more with Shopify.",
    href: "/services/shopify",
    icon: <ShoppingBag01Icon className="w-4 h-4 text-white" />,
  },
  {
    title: "Webflow Development",
    desc: "Custom sites, no compromises.",
    href: "/services/webflow",
    icon: <BrowserIcon className="w-4 h-4 text-white" />,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    if (pathname === href) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  };

  const handleServicesEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleServicesLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 180);
  };

  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 400 && !isMobileMenuOpen) {
        setIsVisible(false);
        setIsServicesOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] font-['Agrandir',sans-serif] ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      {/* Navbar Container */}
      <nav
        className={`pointer-events-auto relative flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-visible ${
          isScrolled
            ? "mt-4 w-full max-w-5xl rounded-full bg-white/60 text-gray-900 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.85),inset_0_-1px_1.5px_rgba(0,0,0,0.04)] backdrop-blur-md backdrop-saturate-150 px-5 sm:px-7 py-2.5 sm:py-3 border border-white/60 ring-1 ring-black/[0.05]"
            : "mt-0 w-full max-w-7xl rounded-none bg-transparent text-gray-900 px-4 sm:px-6 py-4 sm:py-5 border-none shadow-none"
        }`}
      >
        {/* Specular Ambient Light Flare */}
        <div
          className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-700 overflow-hidden ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255, 255, 255, 0.75), transparent 70%)",
          }}
        />

        {/* Brand / Logo */}
        <Link
          href="/"
          onClick={() => handleNavClick("/")}
          className="relative z-10 shrink-0 transition-all duration-700 hover:opacity-90 flex items-center"
        >
          <Logo className="h-9 sm:h-11 w-auto" inverted={false} />
        </Link>

        {/* Menu Navigasi Desktop */}
        <div className="relative z-10 hidden md:flex items-center gap-6 lg:gap-8 text-base lg:text-[18px] tracking-wide transition-all duration-700 text-gray-800">
          {/* Services Menu Item dengan Mega Menu Dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={handleServicesEnter}
            onMouseLeave={handleServicesLeave}
          >
            <button
              type="button"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className={`inline-flex items-center gap-1.5 transition-colors duration-200 cursor-pointer font-medium ${
                isServicesOpen ? "text-[#84c405] font-bold" : "text-gray-800 hover:text-[#84c405]"
              }`}
            >
              <span>Services</span>
              <ArrowDown01Icon
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isServicesOpen ? "rotate-180 text-[#84c405]" : "text-gray-500"
                }`}
              />
            </button>

            {/* Mega Menu Dropdown Container */}
            <div
              className={`fixed left-1/2 -translate-x-1/2 w-[92vw] max-w-[940px] pt-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 ${
                isScrolled ? "top-[76px]" : "top-[78px]"
              } ${
                isServicesOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto visible"
                  : "opacity-0 -translate-y-3 pointer-events-none invisible"
              }`}
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              {/* Triangular Notch Arrow di atas */}
              <div className="absolute top-2 left-1/2 -translate-x-32 w-4 h-4 bg-white border-t border-l border-neutral-200/80 rotate-45 z-10" />

              {/* Main White Mega Menu Box */}
              <div className="relative rounded-[32px] bg-white border border-neutral-200/90 shadow-[0_30px_70px_rgba(0,0,0,0.16)] p-7 sm:p-8 text-neutral-900 grid grid-cols-1 md:grid-cols-12 gap-7">
                {/* Column 1: Design Services (4 cols) */}
                <div className="md:col-span-4 space-y-4">
                  {/* Category Pill Heading */}
                  <div className="inline-block px-3.5 py-1 rounded-full bg-[#f6f3ff] border border-[#ede9fe] text-xs font-bold text-neutral-800 tracking-wide font-['Agrandir',sans-serif]">
                    Design Services
                  </div>

                  {/* List of Design Services */}
                  <div className="space-y-3.5">
                    {designServices.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className="group flex items-start gap-3.5 p-2 rounded-2xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#d4f938] group-hover:text-black transition-colors">
                          <span className="group-hover:text-black">{item.icon}</span>
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-neutral-900 font-['Agrandir',sans-serif] group-hover:text-black">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-500 font-['Agrandir',sans-serif]">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 2: Development Services (4 cols) */}
                <div className="md:col-span-4 space-y-4">
                  {/* Category Pill Heading */}
                  <div className="inline-block px-3.5 py-1 rounded-full bg-[#fff4eb] border border-[#fee7d6] text-xs font-bold text-neutral-800 tracking-wide font-['Agrandir',sans-serif]">
                    Development Services
                  </div>

                  {/* List of Development Services */}
                  <div className="space-y-3.5">
                    {developmentServices.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className="group flex items-start gap-3.5 p-2 rounded-2xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#d4f938] group-hover:text-black transition-colors">
                          <span className="group-hover:text-black">{item.icon}</span>
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-bold text-neutral-900 font-['Agrandir',sans-serif] group-hover:text-black">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-500 font-['Agrandir',sans-serif]">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 3: Featured Showcase Card / Our Product (4 cols) */}
                <div className="md:col-span-4 rounded-[26px] bg-[#eef7fb] border border-[#d8eef7] p-5 flex flex-col justify-between font-['Agrandir',sans-serif]">
                  <div>
                    {/* Top Tag: Our Product */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-[11px] font-semibold mb-3 font-['Agrandir',sans-serif]">
                      <span className="w-2 h-2 rounded-full bg-[#d4f938]" />
                      <span>Our Product</span>
                    </div>

                    {/* Product Brand & Title */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[#0f766e] font-bold text-sm font-['Agrandir',sans-serif]">
                        <span className="w-4 h-4 rounded bg-[#10b981] flex items-center justify-center text-white text-[10px] font-black font-['Agrandir',sans-serif]">
                          M
                        </span>
                        <span className="text-neutral-900 font-bold font-['Agrandir',sans-serif]">Webpagehealth</span>
                      </div>
                      <p className="text-xs text-neutral-500 font-['Agrandir',sans-serif]">
                        AI-Powered Website Analysis
                      </p>
                    </div>

                    {/* Full Mockup Preview Card (Tanpa Terpotong) */}
                    <div className="mt-3.5 rounded-2xl overflow-hidden border border-white/90 shadow-sm bg-white p-1.5">
                      <img
                        src="/images/product_mockup.webp"
                        alt="Webpagehealth Dashboard Laptop Mockup"
                        className="w-full h-auto aspect-[16/10] object-cover rounded-xl shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Explore Button */}
                  <Link
                    href="/services"
                    onClick={() => handleNavClick("/services")}
                    className="mt-4 w-full py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-center text-xs font-bold font-['Agrandir',sans-serif] tracking-wider uppercase shadow-md transition-all hover:shadow-lg active:scale-98 block"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/about"
            onClick={() => handleNavClick("/about")}
            className="transition-colors duration-200 hover:text-[#84c405]"
          >
            About Us
          </Link>
          <Link
            href="/work"
            onClick={() => handleNavClick("/work")}
            className="transition-colors duration-200 hover:text-[#84c405]"
          >
            Work
          </Link>
          <Link
            href="/blog"
            onClick={() => handleNavClick("/blog")}
            className="transition-colors duration-200 hover:text-[#84c405]"
          >
            Blog
          </Link>
        </div>

        {/* Action Button Desktop: Tell Me More */}
        <div className="relative z-10 hidden md:block shrink-0 transition-all duration-700">
          <Link
            href="/contact"
            onClick={() => handleNavClick("/contact")}
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-gray-300/80 bg-white/70 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-[16px] font-medium tracking-wide text-gray-900 shadow-sm transition-all duration-300 hover:border-[#a6f30d] hover:shadow-md"
          >
            <span className="absolute inset-0 z-0 bg-[#a6f30d] -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0" />
            <span className="relative z-10 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-black/5 transition-all duration-300 group-hover:bg-black/10 group-hover:translate-x-0.5">
              <ArrowRight02Icon className="h-3.5 w-3.5 text-gray-800 transition-colors duration-300 group-hover:text-black" />
            </span>
            <span className="relative z-10 font-medium text-gray-900 transition-colors duration-300 group-hover:text-black">
              Tell Me More
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="relative z-20 md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors focus:outline-none cursor-pointer"
        >
          {isMobileMenuOpen ? (
            <Cancel01Icon className="w-5 h-5 text-gray-900" />
          ) : (
            <Menu01Icon className="w-5 h-5 text-gray-900" />
          )}
        </button>
      </nav>

      {/* Mobile Drawer Dropdown Menu */}
      <div
        className={`pointer-events-auto md:hidden w-full max-w-sm transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0 pointer-events-none"
        }`}
      >
        <div className="rounded-[28px] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.12)] p-6 flex flex-col gap-3 text-left">
          {/* Mobile Services Accordion */}
          <div className="py-1">
            <div className="font-bold text-gray-900 text-base mb-2">Services</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
              <Link href="/services/ui-ux" onClick={() => handleNavClick("/services/ui-ux")} className="hover:text-black">
                UI/UX Design
              </Link>
              <Link href="/services/web-development" onClick={() => handleNavClick("/services/web-development")} className="hover:text-black">
                Web Development
              </Link>
              <Link href="/services/web-design" onClick={() => handleNavClick("/services/web-design")} className="hover:text-black">
                Web Design
              </Link>
              <Link href="/services/shopify" onClick={() => handleNavClick("/services/shopify")} className="hover:text-black">
                Shopify Dev
              </Link>
              <Link href="/services/branding" onClick={() => handleNavClick("/services/branding")} className="hover:text-black">
                Branding
              </Link>
              <Link href="/services/wordpress" onClick={() => handleNavClick("/services/wordpress")} className="hover:text-black">
                WordPress Dev
              </Link>
            </div>
          </div>

          <Link
            href="/about"
            onClick={() => handleNavClick("/about")}
            className="text-base font-medium text-gray-800 hover:text-[#84c405] py-1 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/work"
            onClick={() => handleNavClick("/work")}
            className="text-base font-medium text-gray-800 hover:text-[#84c405] py-1 transition-colors"
          >
            Work
          </Link>
          <Link
            href="/blog"
            onClick={() => handleNavClick("/blog")}
            className="text-base font-medium text-gray-800 hover:text-[#84c405] py-1 transition-colors"
          >
            Blog
          </Link>

          <div className="pt-2 border-t border-gray-200/60">
            <Link
              href="/contact"
              onClick={() => handleNavClick("/contact")}
              className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#d4f938] py-3 text-sm font-bold text-black shadow-sm active:scale-95 transition-transform font-['Agrandir',sans-serif]"
            >
              <span>Tell Me More</span>
              <ArrowRight01Icon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
