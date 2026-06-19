import { InvitacionDatos, PaqueteConfig, TemaConfig } from "./types";

export const paquetes: Record<"basico" | "premium" | "deluxe", PaqueteConfig> = {
  basico: {
    nombre: "Básico",
    precio: "$499 MXN",
    maxFotos: 4,
    secciones: [
      "apertura",
      "portada",
      "cuenta",
      "mensaje",
      "ceremonia",
      "recepcion",
      "itinerario",
      "vestimenta",
      "galeria",
      "confirmacion",
      "cierre"
    ]
  },
  premium: {
    nombre: "Premium",
    precio: "$799 MXN",
    maxFotos: 8,
    secciones: [
      "apertura",
      "portada",
      "cuenta",
      "mensaje",
      "ceremonia",
      "recepcion",
      "itinerario",
      "vestimenta",
      "familia",
      "regalos",
      "galeria",
      "hashtag",
      "calendario",
      "confirmacion",
      "cierre"
    ]
  },
  deluxe: {
    nombre: "Deluxe",
    precio: "$1,199 MXN",
    maxFotos: 12,
    secciones: [
      "apertura",
      "portada",
      "cuenta",
      "mensaje",
      "ceremonia",
      "recepcion",
      "itinerario",
      "vestimenta",
      "familia",
      "regalos",
      "galeria",
      "hashtag",
      "calendario",
      "pases",
      "confirmacion",
      "cierre"
    ]
  }
};

export const temas: TemaConfig[] = [
  {
    id: "dorado-clasico",
    nombre: "Dorado Clásico ✨",
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
    nombre: "Vuelo de Mariposas 🦋",
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
    nombre: "Floral Acuarela 🌸",
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
    nombre: "Místico Celestial 🌙 (Noche)",
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
    nombre: "Eucalipto Botánico 🌿",
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
    nombre: "Glam Rose Oro 💖",
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
    nombre: "Rustique Boho Chic 🌾",
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
    nombre: "Princesa Elegante 👑 (Gala)",
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
    nombre: "Mármol & Oro Geométrico 📐",
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

export const fotosFicticiasDefault: Record<string, string[]> = {
  "dorado-clasico": [
    "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=600&auto=format&fit=crop&q=80", // Vestido elegante
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80", // Tiara / tocado
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&auto=format&fit=crop&q=80", // Detalles anillo/flores
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80", // Luces de fiesta
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&auto=format&fit=crop&q=80", // Salón decorado
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&auto=format&fit=crop&q=80", // Copas brindis
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80", // Globos dorados
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80", // Rosas beige
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80", // Pastel de boda/XV
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80", // Zapatillas
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80", // Altar ceremonial
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80"  // Textura elegante
  ],
  "mariposas": [
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80", // Campo mágico flores
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80", // Rosas rosa pastel
    "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=600&auto=format&fit=crop&q=80", // Vestido de hada/quince
    "https://images.unsplash.com/photo-1562184552-997c461abbe6?w=600&auto=format&fit=crop&q=80", // Corona de brillantes
    "https://images.unsplash.com/photo-1512418490979-92798cec1380?w=600&auto=format&fit=crop&q=80", // Brillos mágicos y luces
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80", // Fondos pastel
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80", // Zapatillas cristal
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80", // Mariposas fantasía
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80", // Pastel rosas
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&auto=format&fit=crop&q=80", // Brindis elegante
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&auto=format&fit=crop&q=80", // Salón lila / rosa
    "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=600&auto=format&fit=crop&q=80"  // Ramo hermoso
  ]
};

export const getFotosPorTema = (temaId: string): string[] => {
  // Retorna fotos ficticias predefinidas para el tema o las generales
  return fotosFicticiasDefault[temaId] || fotosFicticiasDefault["dorado-clasico"];
};

export const datosDefault: Record<"basico" | "premium" | "deluxe", InvitacionDatos> = {
  basico: {
    paquete: "basico",
    tema: "dorado-clasico",
    nombre: "Sophia Valeria",
    fecha: "2026-10-18T18:00:00",
    mensajeBienvenida: "Hay momentos que son inolvidables, pero compartirlos con quienes más amamos los hace eternos. Hoy celebro mis quince años y me encantaría contar con tu presencia.",
    ceremonia: {
      lugar: "Parroquia de San Juan Bautista",
      hora: "17:00",
      direccion: "Plaza Centenario #12, Centro Histórico, Coyoacán, CDMX",
      maps: "https://maps.app.goo.gl/9u8nZED52U1A827y9"
    },
    recepcion: {
      lugar: "Salón de Eventos Las Gardenias",
      hora: "19:30",
      direccion: "Calzada de Tlalpan #3240, Col. Bosques, CDMX",
      maps: "https://maps.app.goo.gl/tWp7tN69J9yA829y2"
    },
    itinerario: [
      { hora: "17:00", evento: "Solemne Misa de Acción de Gracias" },
      { hora: "19:00", evento: "Recepción de Invitados en el Salón" },
      { hora: "20:00", evento: "Presentación de la Quinceañera & Vals Familiar" },
      { hora: "21:00", evento: "Cena de Gala" },
      { hora: "22:30", evento: "Brindis & Apertura de la Pista de Baile" }
    ],
    dressCode: "Gala Formal - Caballeros de Traje, Damas de Vestido Largo",
    colorSugerido: ["#D4AF37", "#E9D295", "#FFFFFF"],
    padres: [
      "Roberto Gómez Herrera",
      "Valeria Mendoza Castillo"
    ],
    padrinos: [
      "Carlos Mendoza Castillo",
      "Elena Rivas de Mendoza"
    ],
    mesaRegalos: "Liverpool (No. Evento: 50942851) y Amazon Wishlist",
    datosBancarios: "Banco: BBVA\nBeneficiaria: Sophia Valeria Gómez\nCLABE: 0121 8001 2345 6789 01\nConcepto: Regalo Sophia XV",
    fotos: [], // Se llenan con fotos ficticias según el tema si está vacío
    hashtag: "#SophiaValeriaXV",
    whatsappConfirmacion: "525512345678",
    cancion: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    linkPersonalizado: "sophia-gomez-xv",
    invitados: [
      { nombre: "Familia Gómez Mendoza", pases: 4 },
      { nombre: "Tío Ernesto & Acompañante", pases: 2 }
    ]
  },
  premium: {
    paquete: "premium",
    tema: "mariposas",
    nombre: "Emma Elizabeth",
    fecha: "2026-11-21T18:00:00",
    mensajeBienvenida: "Bajo las alas del amor de mi familia, hoy emprendo un nuevo vuelo. Te espero para celebrar juntos el día más esperado de mi juventud: mis 15 años.",
    ceremonia: {
      lugar: "Capilla del Santo Relicario",
      hora: "16:30",
      direccion: "Av. de la Paz #45, Col. San Ángel, CDMX",
      maps: "https://maps.app.goo.gl/9u8nZED52U1A827y9"
    },
    recepcion: {
      lugar: "Finca Santa Rosa de las Rosas",
      hora: "19:00",
      direccion: "Camino Real a Toluca Km 14.5, Álvaro Obregón, CDMX",
      maps: "https://maps.app.goo.gl/tWp7tN69J9yA829y2"
    },
    itinerario: [
      { hora: "16:30", evento: "Misa de Ceremonia" },
      { hora: "18:00", evento: "Cóctel de Bienvenida en Finca" },
      { hora: "19:30", evento: "Entrada de Emma & Vals de Honor" },
      { hora: "20:30", evento: "Cena Exquisita de Tres Tiempos" },
      { hora: "22:00", evento: "Show Sorpresa Especial" },
      { hora: "22:30", evento: "DJ Live Set & Fiesta" }
    ],
    dressCode: "Formal de Gala (Por favor evitar el color Lila o Morado ya que están reservados para la Quinceañera)",
    colorSugerido: ["#F3D5FF", "#FCF5FE", "#AB70D5"],
    padres: [
      "Ing. Fernando Soto Cruz",
      "Dra. Elizabeth Reyes de Soto"
    ],
    padrinos: [
      "Lic. Hugo Reyes Martínez",
      "Carmen Ortiz de Reyes"
    ],
    mesaRegalos: "El Palacio de Hierro (Evento: EMMA15XV)",
    datosBancarios: "Banco: Santander\nCLABE: 0141 8000 9876 5432 10\nBeneficiario: Emma Elizabeth Soto\n¡Lluvia de sobres en la entrada también es bienvenida!",
    fotos: [],
    hashtag: "#EmmaXVVuela",
    whatsappConfirmacion: "525598765432",
    cancion: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    linkPersonalizado: "emma-soto-15",
    invitados: [
      { nombre: "Sr. Francisco Soto y Familia", pases: 5 },
      { nombre: "Dra. Sofía Rentería", pases: 1 }
    ]
  },
  deluxe: {
    paquete: "deluxe",
    tema: "celestial",
    nombre: "Luna Isabella",
    fecha: "2026-12-05T19:00:00",
    mensajeBienvenida: "Bajo la luz del sol crecí, pero es bajo el brillo de las estrellas de esta noche inolvidable que quiero bailar contigo mis quince primaveras.",
    ceremonia: {
      lugar: "Basílica de Nuestra Señora del Carmen",
      hora: "18:00",
      direccion: "Av. Universidad #1900, Col. Florida, CDMX",
      maps: "https://maps.app.goo.gl/9u8nZED52U1A827y9"
    },
    recepcion: {
      lugar: "Hacienda del Bosque / Jardín de las Estrellas",
      hora: "20:30",
      direccion: "Antigua Vía del Desierto de los Leones #78, Álvaro Obregón, CDMX",
      maps: "https://maps.app.goo.gl/tWp7tN69J9yA829y2"
    },
    itinerario: [
      { hora: "18:00", evento: "Misa de Acción de Gracias" },
      { hora: "20:30", evento: "Alfombra Azul de Bienvenida" },
      { hora: "21:00", evento: "Vals de las Velas & Coronación" },
      { hora: "22:00", evento: "Banquete Imperial de Gala" },
      { hora: "23:00", evento: "Espectáculo de Fuegos Artificiales Fríos" },
      { hora: "23:30", evento: "Mariachi en Vivo & Gran Baile" }
    ],
    dressCode: "Etiqueta Rigurosa / Black Tie (Hombres de Esmóquin, Mujeres de Vestido de Alta Costura)",
    colorSugerido: ["#0B132B", "#1C3B57", "#FFD700", "#7F9FDC"],
    padres: [
      "Gabriel Montes Arriaga",
      "Beatriz Alatorre de Montes"
    ],
    padrinos: [
      "Samuel Montes Arriaga",
      "Patricia Robles de Montes"
    ],
    mesaRegalos: "Mesa Digital de Regalos (Efectivo) Walmart y Liverpool No. 876115",
    datosBancarios: "Banco: Banorte\nCLABE: 0721 8000 1234 5678 99\nBeneficiaria: Luna Isabella Montes",
    hashtag: "#MilMilagrosLunaXV",
    fotos: [],
    whatsappConfirmacion: "525544332211",
    cancion: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    linkPersonalizado: "luna-isabella-xv",
    invitados: [
      { nombre: "Héctor Montes & Sra.", pases: 2 },
      { nombre: "Familia Alatorre Silva", pases: 6 },
      { nombre: "Danna Paola (Amiga)", pases: 1 }
    ]
  }
};
