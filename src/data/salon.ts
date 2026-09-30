/**
 * LUMIÈRE — site content.
 *
 * NOTE FOR THE SALON: every number, name, price and statistic below is PLACEHOLDER
 * content so the site can ship fully populated. Replace the values in this single
 * file with your real details before launch — nothing is hard-coded in components.
 */

import { publicAsset } from '../lib/assets'

export type ServiceCategory = 'hair' | 'beauty' | 'bridal'

export interface Service {
  id: string
  category: ServiceCategory
  name: string
  description: string
  /** Duration in minutes */
  duration: number
  /** Starting price in INR */
  price: number
  image: string
  includes: string[]
}

export interface Category {
  id: ServiceCategory
  label: string
  title: string
  intro: string
}

export const SITE = {
  name: 'LUMIÈRE',
  tagline: 'Salon & Beauty Studio',
  phone: '+91 22 4000 1180',
  phoneHref: 'tel:+912240001180',
  email: 'studio@lumiere-salon.example',
  address: {
    line1: '14 Turner Road, Bandra West',
    line2: 'Mumbai, Maharashtra 400050',
    country: 'India',
  },
  hours: [
    { days: 'Tuesday — Saturday', time: '10:00 — 20:00' },
    { days: 'Sunday', time: '11:00 — 18:00' },
    { days: 'Monday', time: 'Closed' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/' },
  ],
  /** PLACEHOLDER figures — replace with verified studio data before launch. */
  stats: {
    rating: 4.9,
    reviews: 412,
    years: 12,
    clients: '9,400+',
    services: '38,000+',
  },
}

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Stylists', href: '#stylists' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
] as const

export const CATEGORIES: Category[] = [
  {
    id: 'hair',
    label: 'Hair',
    title: 'Hair',
    intro: 'Cut, colour and care shaped to your bone structure, texture and life.',
  },
  {
    id: 'beauty',
    label: 'Beauty',
    title: 'Beauty & Skin',
    intro: 'Considered skin work and artistry that lets you look like yourself, only rested.',
  },
  {
    id: 'bridal',
    label: 'Bridal',
    title: 'Bridal',
    intro: 'A calm, unhurried suite, a trial before the day, and a look that holds until the last dance.',
  },
]

const IMG = {
  hair: publicAsset('/img/service-hair.jpg'),
  beauty: publicAsset('/img/service-beauty.jpg'),
  bridal: publicAsset('/img/service-bridal.jpg'),
  detail: publicAsset('/img/gallery-1.jpg'),
}

export const SERVICES: Service[] = [
  // ── HAIR ────────────────────────────────────────────────────────────────
  {
    id: 'haircut',
    category: 'hair',
    name: 'Precision Haircut',
    description:
      'A consultation, then a dry-cut check before we wet it. Your shape is built around how your hair actually falls.',
    duration: 60,
    price: 1800,
    image: IMG.hair,
    includes: ['Consultation & face mapping', 'Signature cleanse', 'Cut & finish'],
  },
  {
    id: 'hair-styling',
    category: 'hair',
    name: 'Hair Styling',
    description:
      'Blow-dry, tongs or an editorial set — finished with heat protection and a light setting mist.',
    duration: 45,
    price: 1500,
    image: IMG.hair,
    includes: ['Style consultation', 'Heat-protective prep', 'Blow-dry or set'],
  },
  {
    id: 'hair-colour',
    category: 'hair',
    name: 'Global Hair Colour',
    description:
      'Ammonia-free gloss or full coverage, matched to your skin undertone under daylight-balanced lamps.',
    duration: 120,
    price: 4500,
    image: IMG.hair,
    includes: ['Undertone matching', 'Ammonia-free colour', 'Bond-building treatment'],
  },
  {
    id: 'highlights',
    category: 'hair',
    name: 'Hand-Painted Highlights',
    description:
      'Freehand balayage painted strand by strand for a grow-out that stays soft for months.',
    duration: 150,
    price: 6500,
    image: IMG.hair,
    includes: ['Freehand placement', 'Custom toner', 'Gloss & treatment'],
  },
  {
    id: 'hair-treatment',
    category: 'hair',
    name: 'Repair & Scalp Treatment',
    description:
      'A steamer, a scalp analysis and a protein rebuild for hair that has been through heat or colour.',
    duration: 75,
    price: 3200,
    image: IMG.detail,
    includes: ['Scalp analysis', 'Steam infusion', 'Protein rebuild', 'Head massage'],
  },

  // ── BEAUTY ──────────────────────────────────────────────────────────────
  {
    id: 'facial',
    category: 'beauty',
    name: 'Signature Facial',
    description:
      'Deep cleanse, lymphatic drainage and a temperature-controlled mask. Skin leaves calm, not flushed.',
    duration: 75,
    price: 3500,
    image: IMG.beauty,
    includes: ['Skin analysis', 'Extraction if needed', 'Lymphatic massage', 'Mask & SPF'],
  },
  {
    id: 'skin-treatment',
    category: 'beauty',
    name: 'Advanced Skin Treatment',
    description:
      'Targeted work for pigmentation, texture or acne — prescribed after a proper look at your skin.',
    duration: 60,
    price: 4200,
    image: IMG.beauty,
    includes: ['Consultation & plan', 'Targeted active work', 'Aftercare protocol'],
  },
  {
    id: 'makeup',
    category: 'beauty',
    name: 'Makeup Artistry',
    description:
      'Evening, event or simply a very good version of your face. Breathable, photograph-safe finishes.',
    duration: 60,
    price: 3800,
    image: IMG.beauty,
    includes: ['Shade matching', 'Lash application', 'Setting & touch-up kit advice'],
  },
  {
    id: 'brows',
    category: 'beauty',
    name: 'Brow Design',
    description:
      'Threading, shaping and tint mapped to your brow bone — as full or as clean as you like.',
    duration: 30,
    price: 900,
    image: IMG.beauty,
    includes: ['Brow mapping', 'Shape or thread', 'Tint (optional)'],
  },
  {
    id: 'lashes',
    category: 'beauty',
    name: 'Lash Extensions',
    description: 'Classic, hybrid or volume sets, applied lash by lash with a weight that respects your naturals.',
    duration: 90,
    price: 2600,
    image: IMG.beauty,
    includes: ['Lash mapping', 'Classic / hybrid / volume', 'Aftercare kit'],
  },

  // ── BRIDAL ──────────────────────────────────────────────────────────────
  {
    id: 'bridal-makeup',
    category: 'bridal',
    name: 'Bridal Makeup',
    description:
      'A trial, a timeline, and a look built to survive ceremony lights, tears and twelve hours.',
    duration: 180,
    price: 25000,
    image: IMG.bridal,
    includes: ['Trial session', 'Skin prep ritual', 'Long-wear application', 'On-day touch-up support'],
  },
  {
    id: 'bridal-hair',
    category: 'bridal',
    name: 'Bridal Hair',
    description:
      'Pinned architecture that still looks soft in photographs — and comes down without a battle.',
    duration: 90,
    price: 12000,
    image: IMG.bridal,
    includes: ['Trial styling', 'Veil & accessory fitting', 'Set with hold for the full day'],
  },
  {
    id: 'pre-bridal',
    category: 'bridal',
    name: 'Pre-Bridal Package',
    description:
      'Six to eight weeks of scheduled skin, hair and body work that ends with your best skin.',
    duration: 120,
    price: 18000,
    image: IMG.bridal,
    includes: ['Skin calendar', 'Hair repair series', 'Body polish & massage', 'Final pre-day facial'],
  },
]

/* ── Stylists ─────────────────────────────────────────────────────────── */

export interface Expert {
  id: string
  name: string
  role: string
  experience: string
  specialty: string
  bio: string
  image: string
  services: ServiceCategory[]
}

export const EXPERTS: Expert[] = [
  {
    id: 'arjun',
    name: 'Arjun Sharma',
    role: 'Creative Hair Director',
    experience: '12+ years',
    specialty: 'Precision cutting · Colour architecture',
    bio: 'Trained in London and Milan, Arjun builds shapes around how hair moves — never around a trend board. He leads our cutting and colour education.',
    image: publicAsset('/img/expert-1.jpg'),
    services: ['hair'],
  },
  {
    id: 'meera',
    name: 'Meera Kapoor',
    role: 'Beauty & Skin Director',
    experience: '9 years',
    specialty: 'Advanced skin · Corrective facials',
    bio: 'A clinical aesthetician by training, Meera reads skin before she treats it. Her protocols are slow, evidence-led and results you can see in daylight.',
    image: publicAsset('/img/expert-2.jpg'),
    services: ['beauty'],
  },
  {
    id: 'anaya',
    name: 'Anaya Iyer',
    role: 'Bridal Artistry Lead',
    experience: '8 years',
    specialty: 'Bridal hair · Editorial makeup',
    bio: 'Anaya has dressed over two hundred brides. She plans a wedding look backwards from the last photograph of the night, so nothing moves.',
    image: publicAsset('/img/expert-3.jpg'),
    services: ['bridal', 'beauty'],
  },
]

/* ── Choose Your Look ─────────────────────────────────────────────────── */

export interface Look {
  id: string
  name: string
  subtitle: string
  description: string
  image: string
  /** Ambient palette applied to the section when the look is selected */
  palette: { base: string; surface: string; text: string; accent: string }
  /** Typography nuance so each look reads differently */
  typeStyle: { tracking: string; italic: boolean }
  services: string[]
}

export const LOOKS: Look[] = [
  {
    id: 'classic',
    name: 'The Classic',
    subtitle: 'Timeless · Polished',
    description:
      'A glossy blowout, a low chignon, skin that looks like skin. Elegant at forty as it was at twenty.',
    image: publicAsset('/img/look-classic.jpg'),
    palette: { base: '#F7F3EC', surface: '#E9E1D4', text: '#1A1917', accent: '#A9884E' },
    typeStyle: { tracking: '0.02em', italic: false },
    services: ['haircut', 'hair-styling', 'hair-colour', 'makeup'],
  },
  {
    id: 'modern',
    name: 'The Modern',
    subtitle: 'Architectural · Clean',
    description:
      'A blunt bob, glass-smooth lengths, a graphic line of liner. Sharp where it matters, quiet everywhere else.',
    image: publicAsset('/img/look-modern.jpg'),
    palette: { base: '#EFEDE9', surface: '#D8D4CE', text: '#141413', accent: '#8C8378' },
    typeStyle: { tracking: '-0.02em', italic: false },
    services: ['haircut', 'hair-colour', 'brows', 'makeup'],
  },
  {
    id: 'bold',
    name: 'The Bold',
    subtitle: 'Dramatic · Warm',
    description:
      'Volume, copper and a deep berry lip. For the evenings you want to be remembered for.',
    image: publicAsset('/img/look-bold.jpg'),
    palette: { base: '#1A1714', surface: '#2A2420', text: '#F7F3EC', accent: '#C8A87C' },
    typeStyle: { tracking: '0.01em', italic: true },
    services: ['hair-colour', 'highlights', 'makeup', 'lashes'],
  },
  {
    id: 'natural',
    name: 'The Natural',
    subtitle: 'Undone · Radiant',
    description:
      'Air-dried texture, a warm gloss, bare skin with a lit-from-within finish. Nothing heavy, nothing hidden.',
    image: publicAsset('/img/look-natural.jpg'),
    palette: { base: '#F3EDE3', surface: '#E2D7C6', text: '#26221C', accent: '#B08D5E' },
    typeStyle: { tracking: '0.03em', italic: false },
    services: ['hair-treatment', 'facial', 'brows', 'pre-bridal'],
  },
]

/* ── Before / After ───────────────────────────────────────────────────── */

export const TRANSFORMATION = {
  before: publicAsset('/img/before.jpg'),
  after: publicAsset('/img/after.jpg'),
  beforeAlt:
    'Before: dry, flat, unstyled hair photographed in cool, unflattering consultation light',
  afterAlt:
    'After: the same hair after a colour gloss, bond repair and a blow-dry — warm, glossy caramel-bronde',
  caption: 'Colour gloss, bond repair & finish — 2 hours',
  stylist: 'Styled by Arjun Sharma',
}

/* ── Studio hotspots ──────────────────────────────────────────────────── */

export interface Hotspot {
  id: string
  title: string
  description: string
  /** Percentage coordinates on the studio panorama */
  x: number
  y: number
  /** Which photograph the hotspot belongs to */
  image: 'wide' | 'colour' | 'bridal'
}

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'styling',
    title: 'Styling Area',
    description:
      'Six stations, each with daylight-balanced lamps and a mirror wide enough to see the back of your own head. No shouting across the room.',
    x: 62,
    y: 58,
    image: 'wide',
  },
  {
    id: 'colour',
    title: 'Colour Studio',
    description:
      'A separate mixing room so the smell of developer never follows you home. Every formula is recorded against your name.',
    x: 24,
    y: 62,
    image: 'colour',
  },
  {
    id: 'beauty',
    title: 'Private Beauty Room',
    description:
      'One treatment bed, one client, one therapist. Soundproofed, dimmable, and closed to the salon floor.',
    x: 74,
    y: 46,
    image: 'wide',
  },
  {
    id: 'bridal',
    title: 'Bridal Suite',
    description:
      'A curtained room with a full-length mirror, a chaise for your mother, and a lockable door. Yours for the day.',
    x: 46,
    y: 40,
    image: 'bridal',
  },
]

/* ── Products (rendered as real 3D objects) ───────────────────────────── */

export interface Product {
  id: string
  name: string
  kind: 'serum' | 'shampoo' | 'conditioner' | 'mask'
  notes: string
  detail: string
  volume: string
  price: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'serum',
    name: 'Lumière Glass Serum',
    kind: 'serum',
    notes: 'Camellia · Squalane · Rice protein',
    detail: 'Three drops, mid-length to ends. Weightless shine without a single drop of silicone.',
    volume: '50 ml',
    price: 3200,
  },
  {
    id: 'shampoo',
    name: 'Silk Cleanse Shampoo',
    kind: 'shampoo',
    notes: 'Amino-acid surfactants · Oat',
    detail: 'Colour-safe, sulphate-free, and kind enough for a daily wash in Mumbai humidity.',
    volume: '250 ml',
    price: 2400,
  },
  {
    id: 'conditioner',
    name: 'Weightless Conditioner',
    kind: 'conditioner',
    notes: 'Bamboo · Panthenol',
    detail: 'Detangles instantly but rinses clean — no coating, no heaviness at the root.',
    volume: '250 ml',
    price: 2600,
  },
  {
    id: 'mask',
    name: 'Deep Recovery Mask',
    kind: 'mask',
    notes: 'Bond builders · Murumuru butter',
    detail: 'Ten minutes once a week to undo what heat and colour have done all month.',
    volume: '200 ml',
    price: 3800,
  },
]

/* ── Testimonials ─────────────────────────────────────────────────────── */

export interface Testimonial {
  id: string
  quote: string
  name: string
  context: string
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      'Absolutely loved the experience. The attention to detail was incredible — they checked the colour in daylight before I left.',
    name: 'Ritika Menon',
    context: 'Balayage & finish',
    rating: 5,
  },
  {
    id: 't2',
    quote:
      'I have never had a facial that felt this considered. Meera explained every step and my skin behaved for weeks afterwards.',
    name: 'Sana Qureshi',
    context: 'Advanced skin treatment',
    rating: 5,
  },
  {
    id: 't3',
    quote:
      'They did my wedding hair and makeup. Twelve hours, a lot of crying, and it did not move once in a single photograph.',
    name: 'Aditi Raghunathan',
    context: 'Bridal artistry',
    rating: 5,
  },
  {
    id: 't4',
    quote:
      'The first salon where nobody tried to sell me six products. I got the haircut I asked for, and it still looks good three months on.',
    name: 'Farah D’Souza',
    context: 'Precision haircut',
    rating: 5,
  },
]

/* ── Booking helpers ──────────────────────────────────────────────────── */

export const TIME_SLOTS = [
  '10:00',
  '11:00',
  '12:00',
  '13:30',
  '15:00',
  '16:30',
  '18:00',
  '19:00',
] as const

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

export const formatDuration = (mins: number) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}

export const getService = (id: string | null) => SERVICES.find((s) => s.id === id) ?? null
export const getExpert = (id: string | null) => EXPERTS.find((e) => e.id === id) ?? null
