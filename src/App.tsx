import { useState, useEffect } from "react";
import {
  Leaf,
  Droplets,
  Sparkles,
  Shield,
  Heart,
  Recycle,
  ShoppingBag,
  Menu,
  X,
  Star,
  Check,
  Sun,
  Moon,
  ChevronDown,
  MessageCircle,
  Phone,
} from "lucide-react";
import { BangladeshPricingSection } from "./components/BangladeshPricingSection";
import { SEO } from "./components/SEO";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { ReviewPage } from "./pages/ReviewPage";
import {
  detectUserLocation,
  formatPrice,
  getPricingStructure,
} from "./utils/geoDetection";

// Lunaria Logo Component
const LunariaLogo = ({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className={`${size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-12 h-12"}`}
        fill="none"
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="#9B7BB5"
          strokeWidth="1.5"
          fill="none"
        />
        <ellipse cx="20" cy="20" rx="12" ry="8" fill="#D4C8E8" opacity="0.5" />
        <circle cx="20" cy="20" r="4" fill="#9B7BB5" />
        <path
          d="M20 8 L20 12 M20 28 L20 32 M8 20 L12 20 M28 20 L32 20"
          stroke="#9B7BB5"
          strokeWidth="1"
        />
      </svg>
      <span className={`font-tan-grandeur ${sizes[size]} text-[#9B7BB5]`}>
        LUNARIA
      </span>
    </div>
  );
};

// Seed Pod Decoration
const SeedPodDecoration = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 60" className={`opacity-20 ${className}`} fill="none">
    <ellipse cx="25" cy="30" rx="20" ry="25" fill="#D4C8E8" />
    <ellipse cx="50" cy="30" rx="20" ry="25" fill="#9B7BB5" opacity="0.6" />
    <ellipse cx="75" cy="30" rx="20" ry="25" fill="#D4C8E8" />
  </svg>
);

// Navigation
const Navigation = ({ cartCount }: { cartCount: number }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/">
            <LunariaLogo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Ritual", "Ingredients", "How It Works", "Sustainability"].map(
              (item) => {
                const id = item.toLowerCase().replace(/\s+/g, "-");
                return (
                  <a
                    key={item}
                    href={`#${id}`}
                    onClick={(e) => handleNavClick(e, id)}
                    className="text-sm font-medium text-gray-700 hover:text-[#9B7BB5] transition-colors"
                  >
                    {item}
                  </a>
                );
              }
            )}
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-[#D4C8E8]/20 rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#9B7BB5] text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {["Ritual", "Ingredients", "How It Works", "Sustainability"].map(
              (item) => {
                 const id = item.toLowerCase().replace(/\s+/g, "-");
                 return (
                  <a
                    key={item}
                    href={`#${id}`}
                    className="block text-sm font-medium text-gray-700 py-2"
                    onClick={(e) => handleNavClick(e, id)}
                  >
                    {item}
                  </a>
                );
              }
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Section
const HeroSection = ({ 
  onAddToCart, 
  price, 
  currency 
}: { 
  onAddToCart: () => void;
  price: number;
  currency: string;
}) => {
  return (
    <section className="relative min-h-screen bg-lunaria-hero pt-20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-[#D4C8E8]/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#5A8A6E]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-[#9B7BB5]/20">
              <Sparkles className="w-4 h-4 text-[#9B7BB5]" />
              <span className="text-sm font-medium text-[#9B7BB5]">
                Premium care. Light as air.
              </span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-light text-gray-900 leading-tight">
              Pack Light. <br />
              <span className="italic text-[#9B7BB5]">Glow Bright.</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
              The complete 12-step skincare routine—cleanser, toner, essence, serum, eye care, and moisturizer—in one featherlight capsule pack.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onAddToCart}
                className="px-8 py-4 bg-[#9B7BB5] text-white rounded-full font-medium hover:bg-[#8A6AA4] transition-all hover:shadow-lg hover:shadow-[#9B7BB5]/30 flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Ritual — {formatPrice(price, currency)}
              </button>
              <button className="px-8 py-4 border-2 border-[#9B7BB5] text-[#9B7BB5] rounded-full font-medium hover:bg-[#9B7BB5]/5 transition-all">
                Discover More
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4C8E8] to-[#9B7BB5] border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#9B7BB5] text-[#9B7BB5]"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  4.9/5 from 2,000+ reviews
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 animate-float">
              {/* Product Image Container */}
              <div className="aspect-square rounded-[3rem] bg-white shadow-2xl shadow-[#9B7BB5]/20 overflow-hidden border border-[#D4C8E8]/30 flex items-center justify-center">
                <img
                  src="/1770850570579-019c4eea-8314-75a9-917f-82dcdf898b1d.png"
                  alt="Lunaria 7-in-1 Capsule Routine"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-[#D4C8E8]/30">
                <Leaf className="w-6 h-6 text-[#5A8A6E]" />
                <p className="text-xs font-medium text-gray-600 mt-1">
                  100%
                  <br />
                  Natural
                </p>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-[#D4C8E8]/30">
                <Shield className="w-6 h-6 text-[#9B7BB5]" />
                <p className="text-xs font-medium text-gray-600 mt-1">
                  Cruelty
                  <br />
                  Free
                </p>
              </div>
            </div>

            <SeedPodDecoration className="absolute -bottom-10 -right-10 w-48" />
          </div>
        </div>
      </div>
    </section>
  );
};

// The 7 Steps Section
const RitualSection = () => {
  const steps = [
    {
      num: 1,
      name: "Cleanser",
      icon: Droplets,
      desc: "Purify without stripping",
      time: "AM/PM",
    },
    {
      num: 2,
      name: "Toner",
      icon: Droplets,
      desc: "Balance & prepare skin",
      time: "AM/PM",
    },
    {
      num: 3,
      name: "Essence",
      icon: Sparkles,
      desc: "Hydrate and revitalize",
      time: "AM/PM",
    },
    {
      num: 4,
      name: "Serum",
      icon: Sparkles,
      desc: "Deliver potent actives",
      time: "AM/PM",
    },
    {
      num: 5,
      name: "Eye Care",
      icon: Heart,
      desc: "Target delicate areas",
      time: "AM/PM",
    },
    {
      num: 6,
      name: "Moisturizer",
      icon: Shield,
      desc: "Lock in hydration",
      time: "AM/PM",
    },
  ];

  return (
    <section id="ritual" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#D4C8E8]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#9B7BB5] font-medium text-sm tracking-widest uppercase">
            Why Lunaria?
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-gray-900 mt-4">
            Your Complete <span className="italic text-[#9B7BB5]">6-Step</span>{" "}
            AM/PM Ritual
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Each day involves 12 capsules total — 6 in the morning and 6 at night
            for total skin transformation.
          </p>
        </div>

        <div className="grid md:grid-cols-6 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="group relative bg-gradient-to-b from-[#FAF9F7] to-white rounded-2xl p-6 border border-[#D4C8E8]/30 hover:border-[#9B7BB5]/50 transition-all hover:shadow-lg hover:shadow-[#9B7BB5]/10"
            >
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#9B7BB5] text-white rounded-full flex items-center justify-center text-sm font-medium">
                {step.num}
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#D4C8E8]/30 flex items-center justify-center mb-4 group-hover:bg-[#9B7BB5]/20 transition-colors">
                <step.icon className="w-6 h-6 text-[#9B7BB5]" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{step.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{step.desc}</p>
              <div className="flex items-center gap-1 text-xs text-[#5A8A6E]">
                {step.time === "AM" ? (
                  <Sun className="w-3 h-3" />
                ) : step.time === "PM" ? (
                  <Moon className="w-3 h-3" />
                ) : (
                  <>
                    <Sun className="w-3 h-3" />
                    <Moon className="w-3 h-3" />
                  </>
                )}
                <span>{step.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Capsule Visualization */}
        <div className="mt-16 bg-gradient-to-r from-[#D4C8E8]/20 via-white to-[#5A8A6E]/10 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-display text-3xl text-gray-900 mb-4">
                Big glow energy. <span className="italic text-[#9B7BB5]">Tiny to carry.</span>
              </h3>
              <p className="text-gray-600 mb-6">
                We replaced 300g of bulky bottles with a 15g leak-proof capsule pack. It fits in your wallet, slides into your carry-on, and delivers the full hydration your skin craves.
              </p>
              <ul className="space-y-3">
                {[
                  "Hygienic single-use format",
                  "Travel-friendly & spill-free",
                  "Preserves active ingredient potency",
                  "Eco-conscious minimal packaging",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <Check className="w-5 h-5 text-[#5A8A6E]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center relative">
              <div className="relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
                <div className="bg-white p-3 rounded-2xl shadow-xl shadow-[#9B7BB5]/10 border border-[#D4C8E8]/20">
                  <div className="rounded-xl overflow-hidden max-w-sm">
                    <img 
                      src="/H2ad7ec92cc064ab6a2aedc50b6c0e93dL.avif" 
                      alt="Lunaria Pack - Convenient & Hygienic" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#D4C8E8]/20 rounded-full blur-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#5A8A6E]/10 rounded-full blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Results Section
const ResultsSection = () => {
  return (
    <section id="results" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            {/* Abstract Background */}
            <div className="absolute inset-0 bg-[#D4C8E8]/20 blur-3xl rounded-full" />
            
            {/* Before & After Card - Using CSS to crop/focus on the face part of the image if it's a composite, 
                or just showing the image elegantly if it's already separated. 
                Assuming the upload image has faces. */}
            <div className="relative z-10 bg-white p-3 rounded-3xl shadow-xl shadow-[#9B7BB5]/10 border border-[#D4C8E8]/30">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img 
                  src="/Gemini_Generated_Image_bvnipybvnipybvni.png" 
                  alt="Lunaria Before and After Results" 
                  className="w-full h-full object-cover object-center" 
                />
              </div>
              
              <div className="flex justify-between items-center mt-4 px-4 py-3 bg-[#FAF9F7] rounded-2xl">
                <div className="text-center">
                  <p className="text-xl font-display text-gray-900 leading-none">94%</p>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Brighter</p>
                </div>
                <div className="w-px h-6 bg-[#D4C8E8]/30" />
                <div className="text-center">
                  <p className="text-xl font-display text-gray-900 leading-none">89%</p>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Fine Lines</p>
                </div>
                <div className="w-px h-6 bg-[#D4C8E8]/30" />
                <div className="text-center">
                  <p className="text-xl font-display text-gray-900 leading-none">100%</p>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Gentle</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-[#9B7BB5] font-medium text-sm tracking-widest uppercase">Real Results</span>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-gray-900 mt-4 mb-6">
              Transformation You Can <span className="italic text-[#9B7BB5]">See</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              "I never believed a capsule could change my skin so drastically. The uneven tone is gone, and my face feels plumper and more alive than it has in years."
            </p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#FAF9F7] rounded-full flex items-center justify-center font-display text-xl text-[#9B7BB5]">A</div>
              <div>
                <p className="font-medium text-gray-900">Emily R.</p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#9B7BB5] text-[#9B7BB5]" />)}
                  <span className="text-xs text-gray-500 ml-1">Verified Buyer</span>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed italic">
              "Best travel companion ever. I took the 5-pack to Miami and didn't have to worry about my skincare routine at all. My skin stayed hydrated and glowing!"
            </p>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#FAF9F7] rounded-full flex items-center justify-center font-display text-xl text-[#9B7BB5]">S</div>
              <div>
                <p className="font-medium text-gray-900">Sarah K.</p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#9B7BB5] text-[#9B7BB5]" />)}
                  <span className="text-xs text-gray-500 ml-1">Verified Buyer</span>
                </div>
              </div>
            </div>

            <Link to="/reviews" className="text-[#9B7BB5] border-b border-[#9B7BB5] pb-1 hover:text-[#8A6AA4] hover:border-[#8A6AA4] transition-colors">
              Read 2,000+ Reviews
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const IngredientsSection = () => {
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null);

  const ingredients = [
    {
      name: "Squalene",
      benefit: "Deep Hydration",
      desc: "Mimics skin's natural oils",
    },
    {
      name: "Peptides",
      benefit: "Firming",
      desc: "Supports collagen production",
    },
    {
      name: "Vitamin E",
      benefit: "Antioxidant",
      desc: "Protects from free radicals",
    },
    {
      name: "Collagen",
      benefit: "Anti-Aging",
      desc: "Improves skin elasticity",
    },
    {
      name: "Arbutin",
      benefit: "Brightening",
      desc: "Evens skin tone naturally",
    },
    {
      name: "Hyaluronic Acid",
      benefit: "Moisture Lock",
      desc: "Holds 1000x its weight in water",
    },
    {
      name: "Niacinamide",
      benefit: "Barrier Support",
      desc: "Strengthens skin defense",
    },
  ];

  const botanicals = [
    "Centella Asiatica",
    "Chamomile",
    "Licorice Root",
    "Green Tea",
    "Panthenol",
    "Lotus",
  ];

  const ingredientColors = {
    "Squalene": { bg: "bg-purple-100", border: "border-purple-200", text: "text-purple-800", hover: "hover:bg-purple-200" },
    "Peptides": { bg: "bg-pink-100", border: "border-pink-200", text: "text-pink-800", hover: "hover:bg-pink-200" },
    "Vitamin E": { bg: "bg-amber-100", border: "border-amber-200", text: "text-amber-800", hover: "hover:bg-amber-200" },
    "Collagen": { bg: "bg-emerald-100", border: "border-emerald-200", text: "text-emerald-800", hover: "hover:bg-emerald-200" },
    "Arbutin": { bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-800", hover: "hover:bg-blue-200" },
    "Hyaluronic Acid": { bg: "bg-indigo-100", border: "border-indigo-200", text: "text-indigo-800", hover: "hover:bg-indigo-200" },
    "Niacinamide": { bg: "bg-violet-100", border: "border-violet-200", text: "text-violet-800", hover: "hover:bg-violet-200" },
  };

  return (
    <section id="ingredients" className="py-24 lg:py-32 bg-[#FAF9F7] relative overflow-hidden">
      <SeedPodDecoration className="absolute top-20 right-0 w-80 rotate-180 opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Section - Botanicals */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 mb-24 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
                <span className="text-[#5A8A6E] font-semibold text-xs tracking-[0.2em] uppercase pl-1 block mb-6">
                    Pure Botanicals
                </span>
                <h2 className="font-display text-4xl lg:text-5xl font-light text-gray-900 mb-8 leading-tight">
                    Nature's Most <span className="font-normal italic text-[#9B7BB5]">Powerful</span> Actives
                </h2>
                <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-lg">
                    We've curated the finest ingredients from around the world. Each capsule is a potent blend of science and nature, designed to deliver visible results without irritation.
                </p>
                
                {/* Botanical Tags - Lighter/Smaller */}
                <div className="flex flex-wrap gap-2.5 mb-16">
                    {botanicals.map((botanical) => (
                        <span
                        key={botanical}
                        className="px-4 py-1.5 bg-white rounded-full text-xs font-medium text-gray-400 border border-gray-100 shadow-sm"
                        >
                        {botanical}
                        </span>
                    ))}
                </div>

                {/* Active Ingredients - Pill Style with Click to Expand */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {ingredients.map((ing) => {
                      const colors = ingredientColors[ing.name as keyof typeof ingredientColors];
                      const isExpanded = expandedIngredient === ing.name;
                      
                      return (
                        <div key={ing.name} className="contents">
                          <button
                            onClick={() => setExpandedIngredient(isExpanded ? null : ing.name)}
                            className={`px-5 py-2.5 ${colors.bg} ${colors.border} border rounded-full text-sm ${colors.text} ${colors.hover} transition-all shadow-sm hover:shadow-md font-medium flex items-center gap-2`}
                          >
                            {ing.name}
                            <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedIngredient && (
                    <div className="mt-6 p-6 bg-white rounded-2xl border-2 border-[#D4C8E8]/20 shadow-lg animate-fade-in-up">
                      {ingredients.find(ing => ing.name === expandedIngredient) && (
                        <>
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`w-10 h-10 rounded-full ${ingredientColors[expandedIngredient as keyof typeof ingredientColors].bg} flex items-center justify-center`}>
                              <Sparkles className={`w-5 h-5 ${ingredientColors[expandedIngredient as keyof typeof ingredientColors].text}`} />
                            </div>
                            <div>
                              <h4 className={`font-display text-xl ${ingredientColors[expandedIngredient as keyof typeof ingredientColors].text}`}>
                                {expandedIngredient}
                              </h4>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {ingredients.find(ing => ing.name === expandedIngredient)?.desc}
                          </p>
                           <span className={`text-[10px] font-bold uppercase tracking-wider ${ingredientColors[expandedIngredient as keyof typeof ingredientColors].text} bg-white border border-current px-2 py-1 rounded-full inline-block opacity-80`}>
                                {ingredients.find(ing => ing.name === expandedIngredient)?.benefit}
                           </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
            </div>
            
            <div className="lg:col-span-7 order-1 lg:order-2 relative">
                  {/* Background Glow */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-[#5A8A6E]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                 
                  <div className="relative aspect-square rounded-[2.5rem] border border-white/50 bg-white shadow-2xl shadow-[#5A8A6E]/5 overflow-hidden flex items-center justify-center group">
                    {/* Image Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10 pointer-events-none" />
                    
                    {/* Ingredients Composition */}
                    <div className="w-full h-full relative z-0">
                        <img 
                            src="/1770848721745-019c4ece-8f2c-7c98-9f1f-5d05d9213760.png" 
                            alt="Natural Ingredients" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                         {/* Floating Ingredient Badges */}
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/50 animate-float z-20">
                            <Sparkles className="w-5 h-5 text-[#9B7BB5]" />
                        </div>
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/50 animate-float z-20" style={{animationDelay: '1.5s'}}>
                            <Leaf className="w-5 h-5 text-[#5A8A6E]" />
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        {/* Feature Showcase Section */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-[#D4C8E8]/20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Product Image */}
            <div className="flex items-center justify-center">
              <div className="relative max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4C8E8]/30 to-[#9B7BB5]/30 rounded-3xl blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#D4C8E8]/30">
                  <img 
                    src="/b_make_it_super_realis.jpeg"
                    alt="Lunaria Capsule Products"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Brand Story */}
            <div className="flex flex-col justify-center">
              <div className="border-l-4 border-[#9B7BB5] pl-6">
                <h3 className="font-display text-3xl text-gray-900 mb-4">
                  Science Meets <span className="italic text-[#9B7BB5]">Nature</span>
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Every Lunaria capsule is formulated in FDA-registered facilities using only the highest-grade ingredients. We combine cutting-edge Korean skincare science with time-tested botanical wisdom to deliver visible results you can trust.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our unique capsule format isn't just convenient—it preserves the potency of active ingredients by protecting them from air and light until the moment you apply them. Fresh, effective, and perfectly dosed every single time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#9B7BB5] font-medium text-sm tracking-widest uppercase">
            How to Use
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-gray-900 mt-4">
            Get the glow. <span className="italic text-[#9B7BB5]">Good to go.</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            ☀️ AM: Snap, apply, and protect. 🌙 PM: Cleanse, hydrate, and restore.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Twist Open",
              desc: "Twist or pierce open each capsule. Use 6 capsules in the morning and 6 at night as numbered.",
            },
            {
              step: "02",
              title: "Apply & Massage",
              desc: "Apply contents directly to clean, dry skin. Massage gently until fully absorbed.",
            },
            {
              step: "03",
              title: "Layer & Glow",
              desc: "Use entire capsule for face and neck. Proceed to next step immediately for layered benefits.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#D4C8E8] to-[#9B7BB5] flex items-center justify-center text-white text-2xl font-display mb-6">
                {item.step}
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Usage Tips */}
        {/* Skincare Liberated Section */}
        <div className="mt-20">
          <div className="bg-[#FAF9F7] rounded-3xl overflow-hidden border border-[#D4C8E8]/20">
            <div className="grid lg:grid-cols-2">
              <div className="relative overflow-hidden group">
                <img 
                  src="/Hcad648ffb039489c8b4f25d156ad062d5.jpg" 
                  alt="Skincare Liberated - Texture" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8 lg:p-16 flex flex-col justify-center">
                <span className="text-[#9B7BB5] font-medium text-sm tracking-widest uppercase mb-4">
                  Travel & Adventure
                </span>
                <h3 className="font-display text-3xl lg:text-4xl text-gray-900 mb-6">
                  Skincare <span className="italic text-[#9B7BB5]">Liberated</span>
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Ditch the heavy bottles and embrace absolute freedom. Whether you're at home, traveling, or on an adventure, our capsules provide the perfect dose of luxury.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Gym Bag Friendly",
                    "TSA Approved",
                    "Weekend Getaways",
                    "Zero Spillage"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#5A8A6E]">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Sustainability Section
const SustainabilitySection = () => {
  return (
    <section
      id="sustainability"
      className="py-24 bg-gradient-to-b from-[#5A8A6E]/10 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#5A8A6E] font-medium text-sm tracking-widest uppercase">
            Our Promise
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-gray-900 mt-4">
            Transparent <span className="italic text-[#5A8A6E]">Beauty</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Leaf,
              title: "Sustainable Sourcing",
              desc: "Ethically sourced botanicals from trusted suppliers",
            },
            {
              icon: Recycle,
              title: "Recyclable Packaging",
              desc: "Minimal waste with fully recyclable materials",
            },
            {
              icon: Heart,
              title: "Cruelty-Free",
              desc: "Never tested on animals. Certified ethical beauty",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="text-center p-8 bg-white rounded-2xl shadow-sm"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#5A8A6E]/10 flex items-center justify-center mb-4">
                <item.icon className="w-8 h-8 text-[#5A8A6E]" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap justify-center gap-8 items-center py-8 border-t border-b border-[#D4C8E8]/30">
          {["Certified", "Eco-Approved", "Cruelty-Free", "Vegan Friendly"].map(
            (cert) => (
              <div key={cert} className="flex items-center gap-2 text-gray-600">
                <Shield className="w-5 h-5 text-[#9B7BB5]" />
                <span className="text-sm font-medium">{cert}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-[#2D2D2D] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <LunariaLogo className="mb-6" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Pure. Honest. Radiant. Embrace the honest glow of nature with our
              transparent beauty rituals.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Ritual</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  The 7 Steps
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Ingredients
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  How to Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Results
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Private Label
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Connect</h4>
            <a href="tel:+8801787853308" className="block text-sm text-gray-400 mb-2 hover:text-[#9B7BB5] transition-colors">+880 1787 853 308</a>
            <a href="mailto:hello@lunaria.com" className="block text-sm text-gray-400 mb-4 hover:text-[#9B7BB5] transition-colors">hello@lunaria.com</a>
            <div className="flex gap-4">
              {["Instagram", "Facebook", "Pinterest"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#9B7BB5] transition-colors"
                >
                  <span className="text-xs">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2025 Lunaria. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = ({ cartCount, handleAddToCart, heroPrice, currency }: any) => (
  <>
    <HeroSection 
      onAddToCart={handleAddToCart} 
      price={heroPrice} 
      currency={currency} 
    />
    <RitualSection />
    <ResultsSection />
    <IngredientsSection />
    <HowItWorksSection />
    <SustainabilitySection />
    <BangladeshPricingSection />
  </>
);

// Main App Component
export function App() {
  const [cartCount, setCartCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isBangladesh, setIsBangladesh] = useState<boolean | null>(null);

  useEffect(() => {
    const initLocation = async () => {
      const location = await detectUserLocation();
      setIsBangladesh(location.isBangladesh);
    };
    initLocation();
  }, []);

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const pricing = getPricingStructure(isBangladesh ?? false);
  const heroPrice = pricing.packs[0].price;
  const currency = pricing.currency;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAF9F7]">
        <SEO 
          title="Lunaria | 12-in-1 Capsule Routine for Radiant Skin"
          description="Discover the 6-step AM/PM ritual with Lunaria's 12-in-1 capsules. Simplify your skincare with pre-dosed, sustainable beauty for Bangladesh and beyond."
          image="/Gemini_Generated_Image_clo5tmclo5tmclo5.png"
        />
        <Navigation cartCount={cartCount} />

        {/* Cart Notification */}
        {showNotification && (
          <div className="fixed bottom-8 right-8 z-50 bg-[#5A8A6E] text-white px-6 py-4 rounded-2xl shadow-lg animate-fade-in-up flex items-center gap-3">
            <Check className="w-5 h-5" />
            <span>Added to your ritual</span>
          </div>
        )}

        <main>
          <Routes>
            <Route path="/" element={
              <LandingPage 
                cartCount={cartCount} 
                handleAddToCart={handleAddToCart} 
                heroPrice={heroPrice} 
                currency={currency} 
              />
            } />
            <Route path="/reviews" element={<ReviewPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
