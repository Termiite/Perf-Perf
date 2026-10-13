import pg from "pg";

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL must be set");

// Prices are in cents of NEXT_PUBLIC_CURRENCY. Adjust freely; re-running the seed updates them.
const products = [
  {
    slug: "tom-ford-oud-wood",
    name: "Oud Wood",
    brand: "Tom Ford",
    collection: "men",
    concentration: "Eau de Parfum",
    size_ml: 100,
    price_cents: 590000,
    tagline: "Rare. Exotic. Distinctive.",
    description:
      "One of the most rare, precious and expensive ingredients in a perfumer's arsenal, oud wood is smoothed with exotic rosewood, cardamom and sandalwood for a smoky, sensual signature.",
    notes_top: ["Rosewood", "Cardamom", "Chinese Pepper"],
    notes_heart: ["Oud Wood", "Sandalwood", "Vetiver"],
    notes_base: ["Tonka Bean", "Vanilla", "Amber"],
    image: "/images/tom-ford-oud-wood.jpg",
    stock: 6,
    featured: true,
  },
  {
    slug: "tom-ford-black-orchid",
    name: "Black Orchid",
    brand: "Tom Ford",
    collection: "men",
    concentration: "Eau de Toilette",
    size_ml: 100,
    price_cents: 320000,
    tagline: "Dark. Luxurious. Unforgettable.",
    description:
      "A luxurious and sensual fragrance of rich, dark accords and an alluring potion of black orchids and spice, reimagined with a brighter, fresher heart.",
    notes_top: ["Mandarin", "Bergamot", "Black Truffle"],
    notes_heart: ["Black Orchid", "Jasmine", "Spice"],
    notes_base: ["Patchouli", "Vanilla", "Incense"],
    image: "/images/tom-ford-black-orchid.jpg",
    stock: 5,
    featured: true,
  },
  {
    slug: "jo-malone-oud-bergamot",
    name: "Oud & Bergamot",
    brand: "Jo Malone London",
    collection: "men",
    concentration: "Cologne Intense",
    size_ml: 100,
    price_cents: 395000,
    tagline: "Smoky. Bright. Bold.",
    description:
      "The smouldering richness of oud is balanced by sparkling citrus bergamot. An intense, distinctive and elegant scent with wonderful depth.",
    notes_top: ["Bergamot", "Lemon"],
    notes_heart: ["Cedarwood"],
    notes_base: ["Oud", "Smoky Woods"],
    image: "/images/jo-malone-oud-bergamot.jpg",
    stock: 4,
    featured: false,
  },
  {
    slug: "jo-malone-myrrh-tonka",
    name: "Myrrh & Tonka",
    brand: "Jo Malone London",
    collection: "men",
    concentration: "Cologne Intense",
    size_ml: 100,
    price_cents: 395000,
    tagline: "Warm. Resinous. Addictive.",
    description:
      "Inspired by the deep resins of Namibian myrrh, warmed by the almond-like sweetness of tonka bean and a touch of lavender. Intense and mesmerising.",
    notes_top: ["Lavender"],
    notes_heart: ["Myrrh"],
    notes_base: ["Tonka Bean", "Vanilla", "Almond"],
    image: "/images/jo-malone-myrrh-tonka.jpg",
    stock: 4,
    featured: false,
  },
  {
    slug: "lancome-la-vie-est-belle-iris-absolu",
    name: "La Vie est Belle Iris Absolu",
    brand: "Lancôme",
    collection: "women",
    concentration: "L'Eau de Parfum",
    size_ml: 100,
    price_cents: 260000,
    tagline: "Happiness, in full bloom.",
    description:
      "A radiant reinterpretation of the iconic La Vie est Belle. Powdery iris absolute meets a gourmand trail of praline and vanilla for a joyful, luminous signature.",
    notes_top: ["Pear", "Blackcurrant"],
    notes_heart: ["Iris Absolute", "Jasmine", "Orange Blossom"],
    notes_base: ["Praline", "Vanilla", "Patchouli"],
    image: "/images/lancome-la-vie-est-belle-iris-absolu.jpg",
    stock: 6,
    featured: true,
  },
  {
    slug: "armani-my-way-parfum",
    name: "My Way Parfum",
    brand: "Giorgio Armani",
    collection: "women",
    concentration: "Parfum",
    size_ml: 50,
    price_cents: 245000,
    tagline: "Your way. Intensified.",
    description:
      "The most intense expression of My Way. A luminous white floral heart of tuberose and orange blossom, deepened with vanilla and cedarwood. Refillable.",
    notes_top: ["Bergamot", "Orange Blossom"],
    notes_heart: ["Tuberose", "Jasmine"],
    notes_base: ["Vanilla", "Cedarwood", "White Musk"],
    image: "/images/armani-my-way-parfum.jpg",
    stock: 5,
    featured: true,
  },
  {
    slug: "armani-my-way-sunny-vanilla",
    name: "My Way Sunny Vanilla",
    brand: "Giorgio Armani",
    collection: "women",
    concentration: "Eau de Parfum",
    size_ml: 50,
    price_cents: 225000,
    tagline: "Sunshine, bottled.",
    description:
      "A sun-kissed take on My Way. Creamy vanilla is warmed by golden florals and a bright citrus glow for a carefree, radiant trail.",
    notes_top: ["Bergamot", "Mandarin"],
    notes_heart: ["Orange Blossom", "Tuberose"],
    notes_base: ["Bourbon Vanilla", "Musk"],
    image: "/images/armani-my-way-sunny-vanilla.jpg",
    stock: 5,
    featured: false,
  },
  {
    slug: "mugler-alien-goddess",
    name: "Alien Goddess",
    brand: "Mugler",
    collection: "women",
    concentration: "Eau de Parfum",
    size_ml: 60,
    price_cents: 220000,
    tagline: "Radiant. Powerful. Divine.",
    description:
      "A solar, floral-woody amber. Bergamot sparkles over a heart of jasmine and Bourbon vanilla, wrapped in a warm cashmeran glow. Refillable talisman.",
    notes_top: ["Bergamot", "Calabrian Bergamot"],
    notes_heart: ["Jasmine Grandiflorum"],
    notes_base: ["Bourbon Vanilla", "Cashmeran"],
    image: "/images/mugler-alien-goddess.jpg",
    stock: 5,
    featured: false,
  },
  {
    slug: "valentino-voce-viva-intensa",
    name: "Voce Viva Intensa",
    brand: "Valentino",
    collection: "women",
    concentration: "Eau de Parfum Intense",
    size_ml: 50,
    price_cents: 230000,
    tagline: "Speak louder.",
    description:
      "A bold, intense floral. Orange blossom and gardenia vibrate over a sensual base of vanilla and moss — a voice that refuses to be quiet.",
    notes_top: ["Bergamot", "Mandarin"],
    notes_heart: ["Orange Blossom", "Gardenia"],
    notes_base: ["Vanilla", "Moss", "Woods"],
    image: "/images/valentino-voce-viva-intensa.jpg",
    stock: 4,
    featured: false,
  },
  {
    slug: "jo-malone-peony-blush-suede",
    name: "Peony & Blush Suede",
    brand: "Jo Malone London",
    collection: "women",
    concentration: "Cologne",
    size_ml: 100,
    price_cents: 275000,
    tagline: "Charming. Flirtatious. Soft.",
    description:
      "The essence of charm. Peonies in lavish bloom with the juicy bite of red apple, softly embraced by the velvet touch of suede.",
    notes_top: ["Red Apple"],
    notes_heart: ["Peony", "Jasmine", "Rose", "Gillyflower"],
    notes_base: ["Suede"],
    image: "/images/jo-malone-peony-blush-suede.jpg",
    stock: 6,
    featured: false,
  },
  {
    slug: "emporio-armani-in-love-with-you",
    name: "In Love With You",
    brand: "Emporio Armani",
    collection: "women",
    concentration: "Eau de Parfum",
    size_ml: 100,
    price_cents: 210000,
    tagline: "Sweet. Playful. Romantic.",
    description:
      "A gourmand fragrance for the young at heart. Cherry and raspberry liqueur melt into praline and vanilla for an irresistible, joyful trail.",
    notes_top: ["Cherry", "Raspberry"],
    notes_heart: ["Jasmine Sambac"],
    notes_base: ["Praline", "Vanilla", "Musk"],
    image: "/images/armani-in-love-with-you.jpg",
    stock: 5,
    featured: false,
  },
  {
    slug: "emporio-armani-power-of-you",
    name: "Power of You",
    brand: "Emporio Armani",
    collection: "women",
    concentration: "Eau de Parfum",
    size_ml: 50,
    price_cents: 175000,
    tagline: "Confidence you can wear.",
    description:
      "A vibrant woody-floral. Juicy pear and bergamot open onto a heart of jasmine, settling on a confident base of vanilla and woods.",
    notes_top: ["Pear", "Bergamot"],
    notes_heart: ["Jasmine", "Iris"],
    notes_base: ["Vanilla", "Woods"],
    image: "/images/armani-power-of-you.jpg",
    stock: 5,
    featured: false,
  },
];

const client = new pg.Client({ connectionString });
await client.connect();
try {
  await client.query("BEGIN");
  for (const p of products) {
    await client.query(
      `INSERT INTO products
        (slug, name, brand, collection, concentration, size_ml, price_cents, tagline, description,
         notes_top, notes_heart, notes_base, image, stock, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name, brand = EXCLUDED.brand, collection = EXCLUDED.collection,
         concentration = EXCLUDED.concentration, size_ml = EXCLUDED.size_ml,
         price_cents = EXCLUDED.price_cents, tagline = EXCLUDED.tagline,
         description = EXCLUDED.description, notes_top = EXCLUDED.notes_top,
         notes_heart = EXCLUDED.notes_heart, notes_base = EXCLUDED.notes_base,
         image = EXCLUDED.image, featured = EXCLUDED.featured`,
      [
        p.slug, p.name, p.brand, p.collection, p.concentration, p.size_ml, p.price_cents,
        p.tagline, p.description, p.notes_top, p.notes_heart, p.notes_base, p.image,
        p.stock, p.featured,
      ],
    );
  }
  await client.query("COMMIT");
  console.log(`Seeded ${products.length} products.`);
} catch (err) {
  await client.query("ROLLBACK");
  throw err;
} finally {
  await client.end();
}
