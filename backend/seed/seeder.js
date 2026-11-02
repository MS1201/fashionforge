const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const products = [
  {
    name: "Men's Classic Oxford White Shirt",
    description: "Elevate your wardrobe with this timeless Oxford shirt. Crafted from premium 100% cotton fabric, it offers superior breathability and comfort. Perfect for both formal office wear and smart-casual outings. Features a button-down collar, chest pocket, and a tailored slim fit that flatters all body types.",
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    category: "Men",
    subCategory: "Shirts",
    brand: "FashionForge Classic",
    images: [
      { url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80", alt: "White Oxford Shirt Front" },
      { url: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80", alt: "White Oxford Shirt Detail" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Light Blue", hex: "#ADD8E6" }],
    stock: 150,
    rating: 4.5,
    numReviews: 89,
    featured: true,
    trending: true,
    tags: ["shirt", "formal", "office", "cotton"],
    material: "100% Cotton",
    careInstructions: "Machine wash cold, tumble dry low"
  },
  {
    name: "Women's Floral Wrap Midi Dress",
    description: "Turn heads in this stunning floral wrap dress. The flattering wrap silhouette cinches at the waist and flows beautifully into a midi length. Made from lightweight, breathable fabric with a gorgeous floral print that's perfect for summer days, brunches, and garden parties.",
    price: 1899,
    originalPrice: 3499,
    discount: 46,
    category: "Women",
    subCategory: "Dresses",
    brand: "Belle Couture",
    images: [
      { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80", alt: "Floral Wrap Dress" },
      { url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80", alt: "Floral Dress Detail" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [{ name: "Floral Pink", hex: "#FFB6C1" }, { name: "Floral Blue", hex: "#87CEEB" }],
    stock: 85,
    rating: 4.7,
    numReviews: 124,
    featured: true,
    trending: true,
    tags: ["dress", "floral", "summer", "midi"],
    material: "95% Rayon, 5% Spandex",
    careInstructions: "Hand wash cold, lay flat to dry"
  },
  {
    name: "Men's Slim Fit Dark Denim Jeans",
    description: "The perfect everyday slim fit jeans. Made from premium stretch denim, these jeans offer a modern slim silhouette with maximum comfort. Features a classic five-pocket design, zip fly, and button closure. The dark wash makes them versatile — dress up with a blazer or keep it casual.",
    price: 1599,
    originalPrice: 2999,
    discount: 47,
    category: "Men",
    subCategory: "Jeans",
    brand: "DenimCraft",
    images: [
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80", alt: "Dark Slim Jeans" },
      { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80", alt: "Jeans Detail" }
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [{ name: "Dark Blue", hex: "#00008B" }, { name: "Black", hex: "#000000" }],
    stock: 200,
    rating: 4.4,
    numReviews: 201,
    featured: true,
    trending: false,
    tags: ["jeans", "denim", "slim fit", "casual"],
    material: "98% Cotton, 2% Elastane",
    careInstructions: "Machine wash cold, do not bleach"
  },
  {
    name: "Women's Premium Leather Biker Jacket",
    description: "Channel your inner rockstar with this iconic biker jacket. Crafted from genuine leather with asymmetric zip closure, zippered pockets, and quilted panels. The fitted silhouette is universally flattering. A wardrobe investment that only gets better with age.",
    price: 5999,
    originalPrice: 9999,
    discount: 40,
    category: "Women",
    subCategory: "Jackets",
    brand: "LeatherLux",
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", alt: "Leather Jacket" },
      { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", alt: "Leather Jacket Detail" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "Brown", hex: "#8B4513" }],
    stock: 40,
    rating: 4.8,
    numReviews: 67,
    featured: true,
    trending: true,
    tags: ["jacket", "leather", "biker", "premium"],
    material: "100% Genuine Leather",
    careInstructions: "Professional leather clean only"
  },
  {
    name: "Men's Graphic Print Crew Neck T-Shirt",
    description: "Express yourself with this bold graphic tee. Made from ultra-soft combed cotton for all-day comfort. Features a custom artistic print, ribbed crew neck, and a relaxed fit. Perfect for casual days, weekend hangouts, or layering under a jacket.",
    price: 699,
    originalPrice: 1299,
    discount: 46,
    category: "Men",
    subCategory: "T-Shirts",
    brand: "UrbanEdge",
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", alt: "Graphic T-Shirt" },
      { url: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80", alt: "T-Shirt Detail" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#000000" }, { name: "Grey", hex: "#808080" }],
    stock: 300,
    rating: 4.3,
    numReviews: 445,
    featured: false,
    trending: true,
    tags: ["tshirt", "graphic", "casual", "cotton"],
    material: "100% Combed Cotton",
    careInstructions: "Machine wash cold, turn inside out"
  },
  {
    name: "Women's Satin Button-Down Blouse",
    description: "Effortlessly chic, this satin blouse transitions seamlessly from office to evening. The luxurious satin fabric has a beautiful drape and subtle sheen. Features a relaxed fit, button-down front, and long sleeves with cuff buttons. Pair with trousers or tuck into a skirt.",
    price: 1199,
    originalPrice: 2299,
    discount: 48,
    category: "Women",
    subCategory: "Tops",
    brand: "Belle Couture",
    images: [
      { url: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80", alt: "Satin Blouse" },
      { url: "https://images.unsplash.com/photo-1485462537746-965f33f4f4e8?w=800&q=80", alt: "Blouse Detail" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [{ name: "Blush", hex: "#FFB6C1" }, { name: "Ivory", hex: "#FFFFF0" }, { name: "Black", hex: "#000000" }],
    stock: 120,
    rating: 4.6,
    numReviews: 88,
    featured: false,
    trending: true,
    tags: ["blouse", "satin", "formal", "elegant"],
    material: "100% Polyester Satin",
    careInstructions: "Dry clean recommended"
  },
  {
    name: "Men's Tailored Wool Blazer",
    description: "The cornerstone of a sophisticated wardrobe. This tailored blazer is crafted from premium wool blend fabric. Features a notch lapel, two-button front closure, flap pockets, and a clean lining. Perfect for business meetings, formal events, or smart casual looks.",
    price: 3999,
    originalPrice: 6999,
    discount: 43,
    category: "Men",
    subCategory: "Blazers",
    brand: "FashionForge Classic",
    images: [
      { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80", alt: "Wool Blazer" },
      { url: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80", alt: "Blazer Detail" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Navy", hex: "#000080" }, { name: "Charcoal", hex: "#36454F" }, { name: "Camel", hex: "#C19A6B" }],
    stock: 60,
    rating: 4.7,
    numReviews: 54,
    featured: true,
    trending: false,
    tags: ["blazer", "formal", "wool", "tailored"],
    material: "60% Wool, 40% Polyester",
    careInstructions: "Dry clean only"
  },
  {
    name: "Women's High-Waist Yoga Leggings",
    description: "Performance meets style in these high-waist yoga leggings. Made from our 4-way stretch moisture-wicking fabric, they provide full flexibility whether you're in a yoga class or running errands. Features a hidden waistband pocket, flattering seams, and a squat-proof design.",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    category: "Women",
    subCategory: "Activewear",
    brand: "ActiveGlam",
    images: [
      { url: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80", alt: "Yoga Leggings" },
      { url: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80", alt: "Leggings Detail" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "Navy", hex: "#000080" }, { name: "Dusty Rose", hex: "#DCAE96" }],
    stock: 250,
    rating: 4.5,
    numReviews: 312,
    featured: false,
    trending: true,
    tags: ["leggings", "yoga", "activewear", "sports"],
    material: "80% Nylon, 20% Spandex",
    careInstructions: "Machine wash cold, do not iron"
  },
  {
    name: "Men's Premium Bomber Jacket",
    description: "A streetwear staple reimagined for modern fashion. This premium bomber jacket features a ribbed collar, cuffs, and hem for a classic look. Crafted from water-resistant nylon with a satin-like finish and a warm quilted lining. Multiple pockets for practical everyday carry.",
    price: 2799,
    originalPrice: 4999,
    discount: 44,
    category: "Men",
    subCategory: "Jackets",
    brand: "UrbanEdge",
    images: [
      { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", alt: "Bomber Jacket" },
      { url: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80", alt: "Jacket Detail" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Olive Green", hex: "#556B2F" }, { name: "Black", hex: "#000000" }, { name: "Navy", hex: "#000080" }],
    stock: 75,
    rating: 4.6,
    numReviews: 143,
    featured: true,
    trending: true,
    tags: ["bomber", "jacket", "streetwear", "casual"],
    material: "100% Nylon shell, Polyester lining",
    careInstructions: "Machine wash cold"
  },
  {
    name: "Women's Knit Oversized Sweater",
    description: "Stay cozy in style with this chunky knit oversized sweater. The relaxed silhouette is incredibly comfortable and pairs perfectly with leggings, jeans, or even as a mini dress. Features dropped shoulders, ribbed cuffs, and a crew neck. Available in gorgeous seasonal colors.",
    price: 1499,
    originalPrice: 2799,
    discount: 46,
    category: "Women",
    subCategory: "Sweaters",
    brand: "CozyKnits",
    images: [
      { url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80", alt: "Oversized Sweater" },
      { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80", alt: "Sweater Detail" }
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Cream", hex: "#FFFDD0" }, { name: "Camel", hex: "#C19A6B" }, { name: "Burgundy", hex: "#800020" }],
    stock: 100,
    rating: 4.8,
    numReviews: 176,
    featured: true,
    trending: true,
    tags: ["sweater", "knit", "cozy", "winter"],
    material: "60% Acrylic, 40% Wool",
    careInstructions: "Hand wash cold, reshape and lay flat"
  },
  {
    name: "Men's Chino Slim Trousers",
    description: "Versatile and polished, these slim chino trousers are your go-to for smart casual dressing. Made from stretch cotton twill for all-day comfort. Features a flat front, side slash pockets, back welt pockets, and a clean-finished hem. Pair with a shirt or polo for an effortless look.",
    price: 1399,
    originalPrice: 2499,
    discount: 44,
    category: "Men",
    subCategory: "Trousers",
    brand: "FashionForge Classic",
    images: [
      { url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80", alt: "Chino Trousers" },
      { url: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&q=80", alt: "Trousers Detail" }
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [{ name: "Khaki", hex: "#C3B091" }, { name: "Navy", hex: "#000080" }, { name: "Olive", hex: "#808000" }],
    stock: 180,
    rating: 4.4,
    numReviews: 98,
    featured: false,
    trending: false,
    tags: ["chinos", "trousers", "smart casual", "slim"],
    material: "97% Cotton, 3% Elastane",
    careInstructions: "Machine wash 30°C"
  },
  {
    name: "Women's A-Line Mini Skirt",
    description: "A wardrobe essential that never goes out of style. This A-line mini skirt features a high waist, invisible side zipper, and a flared silhouette that's universally flattering. Made from a structured fabric with a slight stretch. Dress it up with heels or keep it casual with sneakers.",
    price: 899,
    originalPrice: 1699,
    discount: 47,
    category: "Women",
    subCategory: "Skirts",
    brand: "Belle Couture",
    images: [
      { url: "https://images.unsplash.com/photo-1583496661160-fb5218afa43f?w=800&q=80", alt: "A-Line Mini Skirt" },
      { url: "https://images.unsplash.com/photo-1594938298603-c8148c4b3f0d?w=800&q=80", alt: "Skirt Detail" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "Red", hex: "#FF0000" }, { name: "Plaid", hex: "#8B0000" }],
    stock: 130,
    rating: 4.5,
    numReviews: 167,
    featured: false,
    trending: true,
    tags: ["skirt", "mini", "a-line", "casual"],
    material: "65% Polyester, 32% Viscose, 3% Elastane",
    careInstructions: "Machine wash cold"
  },
  {
    name: "Men's White Leather Sneakers",
    description: "Clean, minimal, and endlessly versatile — these white leather sneakers are the ultimate everyday shoe. Featuring a premium leather upper, cushioned insole, and rubber outsole. The classic low-top design pairs perfectly with jeans, chinos, or shorts.",
    price: 2499,
    originalPrice: 4499,
    discount: 44,
    category: "Footwear",
    subCategory: "Sneakers",
    brand: "StepUp",
    images: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", alt: "White Leather Sneakers" },
      { url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80", alt: "Sneaker Detail" }
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: [{ name: "White", hex: "#FFFFFF" }, { name: "White/Black", hex: "#F5F5F5" }],
    stock: 90,
    rating: 4.7,
    numReviews: 234,
    featured: true,
    trending: true,
    tags: ["sneakers", "white", "leather", "casual"],
    material: "Genuine Leather upper, Rubber sole",
    careInstructions: "Wipe clean with damp cloth"
  },
  {
    name: "Women's Block Heel Ankle Boots",
    description: "Step into sophistication with these block heel ankle boots. The chunky heel provides stability while adding height. Features a side zip closure, round toe, and a sleek design. Made from faux leather with a cushioned insole for all-day comfort. Perfect for autumn/winter styling.",
    price: 3299,
    originalPrice: 5999,
    discount: 45,
    category: "Footwear",
    subCategory: "Boots",
    brand: "StepUp",
    images: [
      { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", alt: "Ankle Boots" },
      { url: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80", alt: "Boots Detail" }
    ],
    sizes: ["5", "6", "7", "8", "9", "10"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "Tan", hex: "#D2B48C" }],
    stock: 55,
    rating: 4.6,
    numReviews: 89,
    featured: false,
    trending: true,
    tags: ["boots", "ankle", "block heel", "autumn"],
    material: "Faux Leather upper, Synthetic sole",
    careInstructions: "Clean with soft dry cloth"
  },
  {
    name: "Unisex Canvas Backpack",
    description: "The ultimate everyday backpack for work, school, or travel. Made from durable canvas with a water-resistant lining. Features a padded laptop compartment (fits up to 15\"), multiple organizing pockets, adjustable padded shoulder straps, and a front zipper pocket. Comes in multiple colorways.",
    price: 1799,
    originalPrice: 3299,
    discount: 45,
    category: "Accessories",
    subCategory: "Bags",
    brand: "TravelMate",
    images: [
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", alt: "Canvas Backpack" },
      { url: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80", alt: "Backpack Detail" }
    ],
    sizes: ["Free Size"],
    colors: [{ name: "Khaki", hex: "#C3B091" }, { name: "Black", hex: "#000000" }, { name: "Navy", hex: "#000080" }],
    stock: 120,
    rating: 4.5,
    numReviews: 278,
    featured: true,
    trending: true,
    tags: ["backpack", "canvas", "travel", "laptop"],
    material: "100% Canvas with water-resistant lining",
    careInstructions: "Spot clean with damp cloth"
  },
  {
    name: "Women's Crossbody Leather Bag",
    description: "Compact yet spacious, this crossbody bag is your perfect companion for day-to-night wear. Crafted from genuine leather with gold-tone hardware. Features a main zip compartment, interior slip pockets, and an adjustable chain strap. Sophisticated enough for evenings, practical enough for day.",
    price: 2999,
    originalPrice: 5499,
    discount: 45,
    category: "Accessories",
    subCategory: "Bags",
    brand: "LeatherLux",
    images: [
      { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", alt: "Crossbody Bag" },
      { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", alt: "Bag Detail" }
    ],
    sizes: ["Free Size"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "Tan", hex: "#D2B48C" }, { name: "Burgundy", hex: "#800020" }],
    stock: 45,
    rating: 4.8,
    numReviews: 112,
    featured: true,
    trending: true,
    tags: ["crossbody", "leather", "bag", "handbag"],
    material: "Genuine Leather",
    careInstructions: "Wipe with leather conditioner"
  },
  {
    name: "Men's Aviator Sunglasses",
    description: "Channel the classic cool of aviator sunglasses. Featuring UV400 polarized lenses that protect your eyes from harmful rays while reducing glare. The slim metal frame is lightweight yet durable. A timeless accessory that suits every face shape and every occasion.",
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    category: "Accessories",
    subCategory: "Eyewear",
    brand: "ViewPoint",
    images: [
      { url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80", alt: "Aviator Sunglasses" },
      { url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80", alt: "Sunglasses Detail" }
    ],
    sizes: ["Free Size"],
    colors: [{ name: "Gold/Brown", hex: "#B8860B" }, { name: "Silver/Grey", hex: "#C0C0C0" }, { name: "Black", hex: "#000000" }],
    stock: 200,
    rating: 4.4,
    numReviews: 189,
    featured: false,
    trending: true,
    tags: ["sunglasses", "aviator", "uv400", "polarized"],
    material: "Metal frame, Polycarbonate lenses",
    careInstructions: "Clean with microfiber cloth"
  },
  {
    name: "Kids' Colorful Printed Hoodie",
    description: "Keep your little one warm and stylish in this vibrant printed hoodie. Made from soft, cozy fleece fabric that's gentle on sensitive skin. Features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. The fun print makes it a favorite among kids!",
    price: 799,
    originalPrice: 1499,
    discount: 47,
    category: "Kids",
    subCategory: "Hoodies",
    brand: "KidZone",
    images: [
      { url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80", alt: "Kids Hoodie" },
      { url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80", alt: "Hoodie Detail" }
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Blue", hex: "#4169E1" }, { name: "Red", hex: "#FF0000" }, { name: "Green", hex: "#008000" }],
    stock: 150,
    rating: 4.6,
    numReviews: 95,
    featured: false,
    trending: false,
    tags: ["kids", "hoodie", "cozy", "printed"],
    material: "80% Cotton, 20% Polyester Fleece",
    careInstructions: "Machine wash warm, tumble dry low"
  },
  {
    name: "Men's Sports Running Shoes",
    description: "Engineered for performance, these running shoes feature responsive cushioning to absorb impact and propel you forward. The breathable mesh upper keeps your feet cool and dry. Lightweight construction reduces fatigue on long runs. Suitable for road running, gym workouts, and daily wear.",
    price: 3499,
    originalPrice: 5999,
    discount: 42,
    category: "Sports",
    subCategory: "Running",
    brand: "ActiveGlam",
    images: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", alt: "Running Shoes" },
      { url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80", alt: "Shoes Detail" }
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: [{ name: "Black/Red", hex: "#000000" }, { name: "White/Blue", hex: "#FFFFFF" }, { name: "Grey/Green", hex: "#808080" }],
    stock: 100,
    rating: 4.5,
    numReviews: 267,
    featured: true,
    trending: true,
    tags: ["running", "sports", "shoes", "gym"],
    material: "Mesh upper, EVA midsole, Rubber outsole",
    careInstructions: "Remove insoles, air dry only"
  },
  {
    name: "Women's Elegant Maxi Evening Gown",
    description: "Make a grand entrance in this breathtaking maxi evening gown. The floor-sweeping length and sleek silhouette create an effortlessly glamorous look. Features a V-neckline, adjustable straps, and a subtle side slit for ease of movement. Made from luxurious chiffon fabric with a flowing drape.",
    price: 4999,
    originalPrice: 8999,
    discount: 44,
    category: "Women",
    subCategory: "Dresses",
    brand: "Belle Couture",
    images: [
      { url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80", alt: "Evening Gown" },
      { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80", alt: "Gown Detail" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [{ name: "Midnight Blue", hex: "#191970" }, { name: "Emerald Green", hex: "#50C878" }, { name: "Burgundy", hex: "#800020" }],
    stock: 30,
    rating: 4.9,
    numReviews: 43,
    featured: true,
    trending: true,
    tags: ["gown", "evening", "formal", "maxi", "luxury"],
    material: "100% Chiffon with silk lining",
    careInstructions: "Dry clean only"
  },
  {
    name: "Unisex Classic Leather Watch",
    description: "A timeless timepiece that combines classic design with modern precision. Features a stainless steel case, genuine leather strap, and Japanese quartz movement for accurate timekeeping. Scratch-resistant mineral glass and water resistance up to 30m. A perfect gift for any occasion.",
    price: 2999,
    originalPrice: 5499,
    discount: 45,
    category: "Accessories",
    subCategory: "Watches",
    brand: "TimeCraft",
    images: [
      { url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80", alt: "Leather Watch" },
      { url: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=80", alt: "Watch Detail" }
    ],
    sizes: ["Free Size"],
    colors: [{ name: "Brown Strap", hex: "#8B4513" }, { name: "Black Strap", hex: "#000000" }],
    stock: 80,
    rating: 4.7,
    numReviews: 156,
    featured: true,
    trending: false,
    tags: ["watch", "leather", "classic", "unisex"],
    material: "Stainless steel case, Genuine leather strap",
    careInstructions: "Wipe with soft cloth, avoid water immersion"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected'.green);

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Existing data cleared'.red);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@fashionforge.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log(`Admin created: ${admin.email}`.cyan);

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'user@fashionforge.com',
      password: 'user123',
      role: 'user'
    });
    console.log(`Test user created: ${testUser.email}`.cyan);

    // Insert products
    await Product.insertMany(products);
    console.log(`${products.length} products seeded`.green);

    console.log('\n✅ Database seeded successfully!'.green.bold);
    console.log('Admin: admin@fashionforge.com / admin123'.yellow);
    console.log('User:  user@fashionforge.com / user123'.yellow);

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

seedDB();

