// ============================================================
// FUENTE ÚNICA DE VERDAD — temas-maestro.ts
// Archivo IDÉNTICO en catprueba2 y generadorpruebaxv1.
// Para cambiar un tema edita aquí; el cambio aplica en ambos repos.
// ============================================================

export interface TemaMaestro {
  id: string;
  nombre: string;         // Nombre definitivo (sin emojis)
  fontHeading: string;
  fontBody: string;
  fontCursive: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    dark: string;
    light: string;
    bg: string;
    border: string;
  };
  bgGradient: string;
  textDark: string;
  textLight: string;
  iconStyle: string;
  decorativeEmoji: string;
  customStyle: string;
  esNoche: boolean;       // true = fondo oscuro (tema de gala nocturna)
}

export const TEMAS_MAESTRO: TemaMaestro[] = [
  {
    id: "dorado-clasico",
    nombre: "Dorado Clásico",
    fontHeading: "Playfair Display",
    fontBody: "Inter",
    fontCursive: "Great Vibes",
    colors: {
      primary: "#D4AF37",
      secondary: "#DFBA54",
      accent: "#B8860B",
      dark: "#2A2415",
      light: "#FCF9F2",
      bg: "#FDFBF7",
      border: "#E9D295"
    },
    bgGradient: "linear-gradient(135deg, #FCF9F2 0%, #F5EEDB 100%)",
    textDark: "#3A321B",
    textLight: "#FFFFFF",
    iconStyle: "border-2 border-[#D4AF37] rounded-full text-[#D4AF37] p-2 bg-[#FCF9F2]",
    decorativeEmoji: "⚜️",
    esNoche: false,
    customStyle: `
      .theme-container {
        font-family: 'Inter', sans-serif;
        background-color: #FDFBF7;
        color: #3A321B;
      }
      .heading-text {
        font-family: 'Playfair Display', serif;
        color: #B8860B;
        letter-spacing: 0.05em;
      }
      .cursive-text {
        font-family: 'Great Vibes', cursive;
        color: #D4AF37;
      }
      .gold-card {
        border: 1px solid #E9D295;
        background: linear-gradient(145deg, #FFFFFF, #FCF9F2);
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.1);
      }
    `
  },
  {
    id: "mariposas",
    nombre: "Mariposas Mágicas",
    fontHeading: "Cormorant Garamond",
    fontBody: "Inter",
    fontCursive: "Alex Brush",
    colors: {
      primary: "#E0B0FF",
      secondary: "#F3D5FF",
      accent: "#AB70D5",
      dark: "#2D1D3A",
      light: "#FCF5FE",
      bg: "#FFF9FF",
      border: "#E8C1F5"
    },
    bgGradient: "linear-gradient(135deg, #FCF5FE 0%, #FAECFC 100%)",
    textDark: "#3E2B4B",
    textLight: "#FFFFFF",
    iconStyle: "border border-[#AB70D5] rounded-full text-[#AB70D5] p-2 bg-[#FCF5FE] shadow-sm",
    decorativeEmoji: "🦋",
    esNoche: false,
    customStyle: `
      .theme-container {
        font-family: 'Inter', sans-serif;
        background-color: #FFF9FF;
        color: #3E2B4B;
      }
      .heading-text {
        font-family: 'Cormorant Garamond', serif;
        color: #AB70D5;
        font-weight: 600;
        letter-spacing: 0.03em;
      }
      .cursive-text {
        font-family: 'Alex Brush', cursive;
        color: #8E44AD;
      }
      .gold-card {
        border: 1px solid #E8C1F5;
        background: linear-gradient(145deg, #FFFFFF, #FCF5FE);
        box-shadow: 0 4px 15px rgba(171, 112, 213, 0.08);
        border-radius: 20px;
      }
    `
  },
  {
    id: "floral-acuarela",
    nombre: "Floral Acuarela",
    fontHeading: "Lora",
    fontBody: "Inter",
    fontCursive: "Pinyon Script",
    colors: {
      primary: "#E2879F",
      secondary: "#FCD0D9",
      accent: "#AF5B71",
      dark: "#401B24",
      light: "#FCF6F7",
      bg: "#FFFDFD",
      border: "#F5C9D3"
    },
    bgGradient: "linear-gradient(135deg, #FCF6F7 0%, #FAEDF0 100%)",
    textDark: "#4D2831",
    textLight: "#FFFFFF",
    iconStyle: "border border-[#E2879F] rounded-full text-[#E2879F] p-2 bg-[#FCF6F7]",
    decorativeEmoji: "💐",
    esNoche: false,
    customStyle: `
      .theme-container {
        font-family: 'Inter', sans-serif;
        background-color: #FFFDFD;
        color: #4D2831;
      }
      .heading-text {
        font-family: 'Lora', serif;
        color: #AF5B71;
        letter-spacing: 0.01em;
      }
      .cursive-text {
        font-family: 'Pinyon Script', cursive;
        color: #E2879F;
        font-size: 2.2rem;
      }
      .gold-card {
        border: 1px solid #F5C9D3;
        background: linear-gradient(145deg, #FFFFFF, #FCF6F7);
        box-shadow: 0 4px 15px rgba(226, 135, 159, 0.08);
      }
    `
  },
  {
    id: "celestial",
    nombre: "Fantasía Celestial",
    fontHeading: "Cinzel",
    fontBody: "Inter",
    fontCursive: "Monsieur La Doulaise",
    colors: {
      primary: "#87CEEB",
      secondary: "#1C3B57",
      accent: "#FFD700",
      dark: "#080C14",
      light: "#111B30",
      bg: "#0B132B",
      border: "#1C3B57"
    },
    bgGradient: "linear-gradient(185deg, #070B19 0%, #111B30 100%)",
    textDark: "#E2E8F0",
    textLight: "#FFFFFF",
    iconStyle: "border border-[#87CEEB]/40 rounded-full text-[#FFD700] p-2 bg-[#0B132B] shadow-[0_0_10px_rgba(135,206,235,0.2)]",
    decorativeEmoji: "✨",
    esNoche: true,
    customStyle: `
      .theme-container {
        font-family: 'Inter', sans-serif;
        background-color: #070B19;
        color: #E2E8F0;
      }
      .heading-text {
        font-family: 'Cinzel', serif;
        color: #FFD700;
        letter-spacing: 0.12em;
        text-shadow: 0 1px 8px rgba(255, 215, 0, 0.3);
      }
      .cursive-text {
        font-family: 'Monsieur La Doulaise', cursive;
        color: #87CEEB;
        font-size: 2.5rem;
      }
      .gold-card {
        border: 1px solid rgba(135, 206, 235, 0.2);
        background: linear-gradient(145deg, #111B30, #0B132B);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      }
    `
  },
  {
    id: "botanico",
    nombre: "Botánico Elegante",
    fontHeading: "Cormorant Garamond",
    fontBody: "Inter",
    fontCursive: "Petit Formal Script",
    colors: {
      primary: "#556B2F",
      secondary: "#D0E1D4",
      accent: "#B89D4B",
      dark: "#1C281F",
      light: "#F4F7F5",
      bg: "#F8FAF8",
      border: "#C1D2C6"
    },
    bgGradient: "linear-gradient(135deg, #F4F7F5 0%, #E8EDE9 100%)",
    textDark: "#26352A",
    textLight: "#FFFFFF",
    iconStyle: "border border-[#556B2F] rounded-full text-[#556B2F] p-2 bg-[#F4F7F5]",
    decorativeEmoji: "🌿",
    esNoche: false,
    customStyle: `
      .theme-container {
        font-family: 'Inter', sans-serif;
        background-color: #F8FAF8;
        color: #26352A;
      }
      .heading-text {
        font-family: 'Cormorant Garamond', serif;
        color: #556B2F;
        font-weight: 600;
        letter-spacing: 0.04em;
      }
      .cursive-text {
        font-family: 'Petit Formal Script', cursive;
        color: #B89D4B;
        font-size: 1.25rem;
      }
      .gold-card {
        border: 1px solid #C1D2C6;
        background: linear-gradient(145deg, #FFFFFF, #F4F7F5);
        box-shadow: 0 4px 15px rgba(85, 107, 47, 0.05);
      }
    `
  },
  {
    id: "glam-rose",
    nombre: "Glam Rose & Glitter",
    fontHeading: "Outfit",
    fontBody: "Inter",
    fontCursive: "Great Vibes",
    colors: {
      primary: "#B76E79",
      secondary: "#FCD5DB",
      accent: "#9E5561",
      dark: "#3B2226",
      light: "#FAF3F4",
      bg: "#FDF9FA",
      border: "#E8B9C1"
    },
    bgGradient: "linear-gradient(135deg, #FAF3F4 0%, #F5E3E6 100%)",
    textDark: "#4D3135",
    textLight: "#FFFFFF",
    iconStyle: "border border-[#B76E79] rounded-full text-[#B76E79] p-2 bg-[#FAF3F4] shadow-pink",
    decorativeEmoji: "💖",
    esNoche: false,
    customStyle: `
      .theme-container {
        font-family: 'Inter', sans-serif;
        background-color: #FDF9FA;
        color: #4D3135;
      }
      .heading-text {
        font-family: 'Outfit', sans-serif;
        color: #9E5561;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      .cursive-text {
        font-family: 'Great Vibes', cursive;
        color: #B76E79;
      }
      .gold-card {
        border: 1px solid #E8B9C1;
        background: linear-gradient(145deg, #FFFFFF, #FAF3F4);
        box-shadow: 0 4px 15px rgba(183, 110, 121, 0.1);
      }
    `
  },
  {
    id: "boho-chic",
    nombre: "Boho Terracota",
    fontHeading: "Playfair Display",
    fontBody: "Inter",
    fontCursive: "WindSong",
    colors: {
      primary: "#C27A5B",
      secondary: "#EED9C4",
      accent: "#A0522D",
      dark: "#361D13",
      light: "#FDF8F5",
      bg: "#FEFBF9",
      border: "#E9CDBC"
    },
    bgGradient: "linear-gradient(135deg, #FDF8F5 0%, #F9EFE7 100%)",
    textDark: "#472A1E",
    textLight: "#FFFFFF",
    iconStyle: "border border-[#C27A5B] rounded-full text-[#C27A5B] p-2 bg-[#FDF8F5]",
    decorativeEmoji: "🌾",
    esNoche: false,
    customStyle: `
      .theme-container {
        font-family: 'Inter', sans-serif;
        background-color: #FEFBF9;
        color: #472A1E;
      }
      .heading-text {
        font-family: 'Playfair Display', serif;
        color: #C27A5B;
        font-weight: 600;
      }
      .cursive-text {
        font-family: 'WindSong', cursive;
        color: #A0522D;
        font-size: 2.2rem;
      }
      .gold-card {
        border: 1px solid #E9CDBC;
        background: linear-gradient(145deg, #FFFFFF, #FDF8F5);
        box-shadow: 0 4px 12px rgba(194, 122, 91, 0.07);
        border-radius: 12px;
      }
    `
  },
  {
    id: "princesa-elegante",
    nombre: "Princesa Real",
    fontHeading: "Cinzel",
    fontBody: "Inter",
    fontCursive: "Pinyon Script",
    colors: {
      primary: "#1A365D",
      secondary: "#BFDBFE",
      accent: "#93C5FD",
      dark: "#0F172A",
      light: "#F0F4FE",
      bg: "#F8FAFF",
      border: "#93C5FD"
    },
    bgGradient: "linear-gradient(135deg, #F0F4FE 0%, #DCE4FC 100%)",
    textDark: "#1E293B",
    textLight: "#FFFFFF",
    iconStyle: "border-2 border-[#1A365D] rounded-full text-[#1A365D] p-2 bg-[#F0F4FE] shadow-sm",
    decorativeEmoji: "👑",
    esNoche: false,
    customStyle: `
      .theme-container {
        font-family: 'Inter', sans-serif;
        background-color: #F8FAFF;
        color: #1E293B;
      }
      .heading-text {
        font-family: 'Cinzel', serif;
        color: #1A365D;
        letter-spacing: 0.08em;
      }
      .cursive-text {
        font-family: 'Pinyon Script', cursive;
        color: #1A365D;
        font-size: 2.6rem;
      }
      .gold-card {
        border: 1px solid #BFDBFE;
        background: linear-gradient(145deg, #FFFFFF, #F0F4FE);
        box-shadow: 0 4px 15px rgba(26, 54, 93, 0.08);
      }
    `
  },
  {
    id: "marmol-oro",
    nombre: "Mármol y Oro Líquido",
    fontHeading: "Syne",
    fontBody: "Inter",
    fontCursive: "Sacramento",
    colors: {
      primary: "#C59B27",
      secondary: "#E5E5E5",
      accent: "#1A1A1A",
      dark: "#1A1A1A",
      light: "#F4F4F4",
      bg: "#FAFAFA",
      border: "#E5C572"
    },
    bgGradient: "linear-gradient(145deg, #F9F9F9 0%, #EFEFEF 100%)",
    textDark: "#222222",
    textLight: "#FFFFFF",
    iconStyle: "border-2 border-[#C59B27] rounded-none rotate-45 text-[#1A1A1A] p-2 bg-white",
    decorativeEmoji: "⚜️",
    esNoche: false,
    customStyle: `
      .theme-container {
        font-family: 'Inter', sans-serif;
        background-color: #FAFAFA;
        color: #222222;
        background-image: radial-gradient(rgba(197, 155, 39, 0.04) 1px, transparent 0);
        background-size: 20px 20px;
      }
      .heading-text {
        font-family: 'Syne', sans-serif;
        color: #1A1A1A;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
      .cursive-text {
        font-family: 'Sacramento', cursive;
        color: #C59B27;
        font-size: 2.5rem;
      }
      .gold-card {
        border: 1.5px solid #E5C572;
        background: #FFFFFF;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        border-radius: 0;
      }
    `
  }
];
