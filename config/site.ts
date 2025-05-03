export const siteConfig = {
    name: "BestWareHub",
    title: "Where variety sparks the opportunity",
    titleShort: "BestWareHub", 
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    //url: "https://bestwarehub.com",
    ogImage: "https://res.cloudinary.com/dt68y8kue/image/upload/v1746213468/youtube_banner_lbymfy.png",
    description:
      "BestWareHub is your one-stop destination, from the latest Gadgets, Stylish Home Decor, Electronics,Appliances, Fashion, Tools, Office Supplies, Kitchen Supplies, Furniture, Groceries, Beauty and Care, Baby Care, and much more in Bangladesh. Explore our collection and discover the perfect items to enhance your lifestyle.",
    links: {
      twitter: "https://twitter.com/bestwarehub",
      github: "https://github.com/bestwarehub",
      facebook: "https://www.facebook.com/bestwarehub",
    },
  };
   
  export type SiteConfig = typeof siteConfig;