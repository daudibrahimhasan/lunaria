import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
  keywords?: string[];
}

export const SEO = ({
  title = "Lunaria | Premium 12-in-1 Capsule Routine",
  description = "Experience pure radiance with Lunaria's 12-in-1 capsule routine. A simplified 6-step AM/PM ritual for glowing, healthy skin, delivered in sustainable single-use capsules.",
  name = "Lunaria Skincare",
  type = "website",
  image = "/preview-image.jpg", // We should update this
  url = "https://lunaria-us.vercel.app",
  keywords = [
    "skincare ritual",
    "capsule skincare",
    "12-in-1 routine",
    "travel skincare",
    "sustainable beauty",
    "Bangladesh skincare",
    "premium serum",
  ]
}: SEOProps) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={name} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional tags */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
