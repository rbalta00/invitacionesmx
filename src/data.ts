import { InvitacionDatos, PaqueteConfig, TemaConfig } from "./types";
import { TEMAS_MAESTRO } from "./temas-maestro";

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

export const temas: TemaConfig[] = TEMAS_MAESTRO;

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
