import { Star, Check, ArrowLeft, Camera, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";

// Mock review data with images from public/review
const reviews = [
  {
    id: 1,
    name: "Emily R.",
    verified: true,
    rating: 5,
    date: "2 days ago",
    title: "Transformation You Can See",
    content: "I never believed a capsule could change my skin so drastically. The uneven tone is gone, and my face feels plumper and more alive than it has in years.",
    image: "/review/2.jpeg",
    helpful: 124
  },
  {
    id: 2,
    name: "Sarah K.",
    verified: true,
    rating: 5,
    date: "1 week ago",
    title: "Perfect for travel!",
    content: "Took these on my trip to Tulum. No spills, perfect dose every time. My skin stayed glowing despite the sun and sand.",
    image: "/review/3.png",
    helpful: 89
  },
  {
    id: 3,
    name: "Jessica M.",
    verified: true,
    rating: 5,
    date: "2 weeks ago",
    title: "Finally a routine I can stick to",
    content: "The 6 steps morning and night are so easy to follow. My skin texture has improved so much in just 12 days.",
    image: "/review/4.png",
    helpful: 56
  },
  {
    id: 4,
    name: "Ashley T.",
    verified: true,
    rating: 4,
    date: "3 weeks ago",
    title: "Good results, fast delivery",
    content: "Delivery to New York was super fast (2 days). The product itself is very premium. Love the glass skin effect.",
    image: "/review/5.jpeg", 
    helpful: 34
  },
  {
    id: 5,
    name: "Jennifer L.",
    verified: true,
    rating: 5,
    date: "1 month ago",
    title: "Worth every penny",
    content: "This is cheaper than buying serum, moisturizer, and toner separately. Plus the quality is top notch Korean standard.",
    image: "/review/6.jpeg",
    helpful: 42
  }
];

export const ReviewPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <SEO 
        title="Real Reviews | Lunaria 12-in-1 Capsule Routine"
        description="See real results from thousands of happy customers. Discover why 2,000+ women trust Lunaria for their daily skincare ritual."
      />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-[#9B7BB5] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <span className="font-display text-xl text-[#9B7BB5]">
            <span className="font-tan-grandeur mr-1">Lunaria</span> Reviews
          </span>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Hero Video Banner */}
      <div className="relative w-full overflow-hidden" style={{ maxHeight: '420px' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ maxHeight: '420px' }}
        >
          <source src="/review/1.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] via-transparent to-black/20" />
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white text-lg font-medium tracking-wide drop-shadow-lg">Real People. Real Results.</p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#D4C8E8]/30 mb-12 text-center">
          <h1 className="font-display text-4xl text-gray-900 mb-4">2,348 Real Reviews</h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex text-[#9B7BB5]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 fill-current" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">4.9</span>
          </div>
          <p className="text-gray-500">Based on verified purchases</p>
        </div>

        {/* Reviews List */}
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4C8E8]/30 flex items-center justify-center text-[#9B7BB5] font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{review.name}</h3>
                    {review.verified && (
                      <div className="flex items-center gap-1 text-xs text-[#5A8A6E]">
                        <Check className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>

              <div className="flex text-[#9B7BB5] mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <h4 className="font-medium text-lg text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">{review.content}</p>

              {review.image && (
                <div className="mb-6 rounded-xl overflow-hidden border border-gray-100 w-full max-w-md">
                   <img 
                    src={review.image} 
                    alt={`Review by ${review.name}`}
                    className="w-full h-auto object-cover max-h-80"
                    loading="lazy"
                  />
                  <div className="bg-gray-50 px-3 py-2 flex items-center gap-2 text-xs text-gray-500">
                    <Camera className="w-3 h-3" />
                    <span>Real photo from customer</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#9B7BB5] transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 hover:border-[#9B7BB5] transition-all">
                Load More Reviews
            </button>
        </div>

      </main>
    </div>
  );
};
