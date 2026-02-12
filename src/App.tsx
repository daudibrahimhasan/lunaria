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
} from "lucide-react";
import { BangladeshPricingSection } from "./components/BangladeshPricingSection";
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <LunariaLogo />

          <div className="hidden md:flex items-center gap-8">
            {["Ritual", "Ingredients", "How It Works", "Sustainability"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium text-gray-700 hover:text-[#9B7BB5] transition-colors"
                >
                  {item}
                </a>
              ),
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
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block text-sm font-medium text-gray-700 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ),
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
                7 Steps. One Pack. Pure Radiance.
              </span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-light text-gray-900 leading-tight">
              Glow with <br />
              <span className="italic text-[#9B7BB5]">Honesty</span> & <br />
              <span className="italic text-[#9B7BB5]">Radiance</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
              Discover the pure essence of effortless skincare. Our 7-in-1
              Capsule Routine delivers a complete daily regimen in pre-dosed,
              single-use capsules.
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
            The Ritual
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
                Precision in Every Capsule
              </h3>
              <p className="text-gray-600 mb-6">
                Each capsule contains the perfect single-use dose, ensuring
                freshness and potency. No waste, no guesswork—just pure skincare
                perfection.
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
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#FAF9F7] rounded-full flex items-center justify-center font-display text-xl text-[#9B7BB5]">A</div>
              <div>
                <p className="font-medium text-gray-900">Anika Rahman</p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#9B7BB5] text-[#9B7BB5]" />)}
                  <span className="text-xs text-gray-500 ml-1">Verified Buyer</span>
                </div>
              </div>
            </div>

            <button className="text-[#9B7BB5] border-b border-[#9B7BB5] pb-1 hover:text-[#8A6AA4] hover:border-[#8A6AA4] transition-colors">
              Read 2,000+ Reviews
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Ingredients Section
const IngredientsSection = () => {
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

  return (
    <section id="ingredients" className="py-24 bg-[#FAF9F7] relative">
      <SeedPodDecoration className="absolute top-20 right-0 w-64 rotate-180" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 mb-16 items-center">
            <div className="order-2 lg:order-1">
                <span className="text-[#5A8A6E] font-medium text-sm tracking-widest uppercase">
                    Pure Botanicals
                </span>
                <h2 className="font-display text-4xl lg:text-5xl font-light text-gray-900 mt-4 mb-6">
                    Nature's Most <span className="italic text-[#9B7BB5]">Powerful</span> Actives
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    We've curated the finest ingredients from around the world. Each capsule is a potent blend of science and nature, designed to deliver visible results without irritation.
                </p>
                <div className="flex flex-wrap gap-3">
                    {botanicals.map((botanical) => (
                        <span
                        key={botanical}
                        className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 border border-[#D4C8E8]/30 shadow-sm"
                        >
                        {botanical}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
                 <div className="absolute inset-0 bg-[#5A8A6E]/5 rounded-full blur-3xl" />
                  <div className="relative aspect-square rounded-3xl border border-[#D4C8E8]/30 bg-white shadow-2xl shadow-[#5A8A6E]/10 overflow-hidden flex items-center justify-center">
                    {/* Ingredients Composition */}
                    <div className="w-full h-full relative">
                        <img 
                            src="/1770848721745-019c4ece-8f2c-7c98-9f1f-5d05d9213760.png" 
                            alt="Natural Ingredients" 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                         {/* Floating Ingredient Badges */}
                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-[#D4C8E8]/20 animate-float">
                            <Sparkles className="w-5 h-5 text-[#9B7BB5]" />
                        </div>
                        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-[#5A8A6E]/20 animate-float" style={{animationDelay: '1s'}}>
                            <Leaf className="w-5 h-5 text-[#5A8A6E]" />
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ingredients.map((ing) => (
            <div
              key={ing.name}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-[#D4C8E8]/20"
            >
              <div className="w-10 h-10 rounded-full bg-[#D4C8E8]/30 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-[#9B7BB5]" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{ing.name}</h3>
              <span className="text-xs font-medium text-[#5A8A6E] bg-[#5A8A6E]/10 px-2 py-1 rounded-full">
                {ing.benefit}
              </span>
              <p className="text-sm text-gray-500 mt-3">{ing.desc}</p>
            </div>
          ))}
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
            Simple Ritual
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-gray-900 mt-4">
            How to <span className="italic text-[#9B7BB5]">Apply</span>
          </h2>
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
    <div className="min-h-screen bg-[#FAF9F7]">
      <Navigation cartCount={cartCount} />

      {/* Cart Notification */}
      {showNotification && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#5A8A6E] text-white px-6 py-4 rounded-2xl shadow-lg animate-fade-in-up flex items-center gap-3">
          <Check className="w-5 h-5" />
          <span>Added to your ritual</span>
        </div>
      )}

      <main>
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
      </main>

      <Footer />
    </div>
  );
}
