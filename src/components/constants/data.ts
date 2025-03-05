import { images } from "./images";

export const silder = [
  {
    id: "1",
    title: "New Waterproof Jewelry",
    dec: "Shower, exercise or swim with tarnish-free jewelry made from stainless steel.",
    image: images.slider1,
  },
  {
    id: "2",
    title: "Elegant Watch Collection",
    dec: "Explore our range of premium watches for every occasion.",
    image: images.slider2,
  },
  {
    id: "3",
    title: "Classic Gold Rings",
    dec: "Timeless designs made from high-quality gold for your everyday look.",
    image: images.slider3,
  },
];

export const reviews = [
  {
    id: 1,
    text: "I love every item I have ordered from Beautiful Earth! They are all well made and look exactly like the images on the website, if not more beautiful in person!",
    author: "Sarah M.",
    rating: 5,
  },
  {
    id: 2,
    text: "Absolutely stunning pieces! The quality is exceptional and the customer service is outstanding. Will definitely be ordering again!",
    author: "Emily R.",
    rating: 4,
  },
  {
    id: 3,
    text: "Beautiful products that exceed expectations. The attention to detail is remarkable. These pieces make perfect gifts!",
    author: "Jessica K.",
    rating: 5,
  },
];

export const filterData =[
  {
    id: "sort",
    title: "SORT",
    expanded: true,
    options: [
      { id: "featured", label: "Featured", checked: false },
      { id: "price-low-high", label: "Price, low to high", checked: false },
      { id: "price-high-low", label: "Price, high to low", checked: false },
      { id: "new-arrivals", label: "New Arrivals", checked: false },
    ],
  },
  {
    id: "style",
    title: "STYLE",
    expanded: false,
    options: [
      { id: "hoops", label: "Hoops", checked: false },
      { id: "huggies", label: "Huggies", checked: false },
      { id: "adjustable", label: "Adjustable", checked: false },
    ],
  },
  { id: "color", title: "COLOR", expanded: false ,options: [
      { id: "gold", label: "Gold", checked: false },
      { id: "silver", label: "Silver", checked: false },
    ],},
  { id: "material", title: "MATERIAL", expanded: false ,options: [
      { id: "crystals", label: "Crystals", checked: false },
      { id: "Waterproof", label: "Waterproof", checked: false },
    ],},
    {
      id: "price",
      title: "PRICE",
      expanded: false,
      priceRange: [0, 60],
      minPrice: 0,
      maxPrice: 60,
    },
  { id: "type", title: "TYPE", expanded: false,options: [
      { id: "earrings", label: "Earrings", checked: false },
      { id: "rings", label: "Rings", checked: false },
      { id: "necklaces", label: "Necklaces", checked: false },
      { id: "bracelets", label: "Bracelets", checked: false },
    ], },
] 
