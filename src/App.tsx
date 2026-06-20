import { useState, useEffect, useRef, ChangeEvent } from "react";
import { 
  Sparkles, 
  Settings, 
  FileText, 
  Clipboard, 
  Trash2, 
  Plus, 
  Download, 
  RefreshCw, 
  Smartphone, 
  Copy, 
  Check, 
  Upload, 
  Layers, 
  UserPlus, 
  MapPin, 
  Calendar, 
  Gift, 
  Music, 
  Image as ImageIcon,
  Share2,
  ListOrdered
} from "lucide-react";
import { InvitacionDatos, TemaConfig } from "./types";
import { temas, paquetes, datosDefault, getFotosPorTema } from "./data";
import { generarHTMLFinal } from "./templates";

// Helper functions for UTF-8 safe and compact Base64 encoding/decoding of state in URLs
const encodeState = (obj: any): string => {
  try {
    const copy = JSON.parse(JSON.stringify(obj));
    // Remove very large base64 images from URL state to prevent exceeding browser 2KB limits (which causes 414 URI Too Long errors)
    if (copy.fotos && copy.fotos.length > 0) {
      copy.fotos = copy.fotos.map((f: string) => {
        if (f && f.startsWith("data:image")) {
          // If it's a base64 local image, we replace it with "default" so it falls back to the beautiful matching theme design
          return "default";
        }
        return f;
      });
    }
    // Filter heavy base64 background images from state to guarantee short, clean, healthy sharing links
    if (copy.bgImages) {
      const filteredBg: Record<string, string> = {};
      for (const [k, v] of Object.entries(copy.bgImages)) {
        const bgVal = v as string;
        if (bgVal && !bgVal.startsWith("data:")) {
          filteredBg[k] = bgVal;
        }
      }
      copy.bgImages = filteredBg;
    }
    const str = JSON.stringify(copy);
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    console.error("Error al codificar estado para compartir:", e);
    return "";
  }
};

const decodeState = (str: string): any => {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(str))));
  } catch (e) {
    console.error("Error al decodificar estado desde compartir:", e);
    return null;
  }
};

export default function App() {
  // Cargar estado inicial desde la URL si existe para la vista compartida o el editor precargado
  const getInitialState = (): { initialDatos: InvitacionDatos; initialTemaId: string; isView: boolean; isCatalog: boolean; initialCatalogTemaId: string | null } => {
    try {
      const params = new URLSearchParams(window.location.search);
      const isView = params.get("v") === "1" || params.get("view") === "true";
      const isCatalog = params.get("catalog") === "true" || params.get("catalogo") === "true";
      const initialCatalogTemaId = params.get("tema") || null;
      let targetTema = params.get("tema") || "mariposas";

      const d = params.get("d");
      if (d) {
        const decoded = decodeState(d);
        if (decoded && typeof decoded === "object") {
          return {
            initialDatos: {
              ...datosDefault.premium,
              ...decoded
            },
            initialTemaId: decoded.tema || targetTema,
            isView,
            isCatalog,
            initialCatalogTemaId
          };
        }
      }
      return {
        initialDatos: { ...datosDefault.premium },
        initialTemaId: targetTema,
        isView,
        isCatalog,
        initialCatalogTemaId
      };
    } catch (e) {
      return {
        initialDatos: { ...datosDefault.premium },
        initialTemaId: "mariposas",
        isView: false,
        isCatalog: false,
        initialCatalogTemaId: null
      };
    }
  };

  const { initialDatos, initialTemaId, isView: isViewMode, isCatalog: isCatalogInitial, initialCatalogTemaId } = getInitialState();

  // Estado principal de los datos de la invitación
  const [datos, setDatos] = useState<InvitacionDatos>(initialDatos);

  // Estado del tema seleccionado
  const [selectedTemaId, setSelectedTemaId] = useState<string>(initialTemaId);

  // Estados para el catálogo de demostración de temas
  const [isCatalogMode, setIsCatalogMode] = useState<boolean>(isCatalogInitial);
  const [selectedCatalogTemaId, setSelectedCatalogTemaId] = useState<string | null>(initialCatalogTemaId);

  // Manejo de carga de imágenes de fondo por tema por separado
  const handleBgImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen es demasiado grande. Elige una menor a 10MB con una resolución óptima.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 640;
        const MAX_HEIGHT = 960;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.55);
          
          setDatos(prev => {
            const currentBgImages = prev.bgImages || {};
            return {
              ...prev,
              bgImages: {
                ...currentBgImages,
                [selectedTemaId]: compressedBase64
              }
            };
          });
          alert(`¡Imagen de fondo cargada y optimizada con éxito para "${temaActual.nombre}"! 🌸`);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleBgImageUrlChange = (url: string) => {
    setDatos(prev => {
      const currentBgImages = prev.bgImages || {};
      return {
        ...prev,
        bgImages: {
          ...currentBgImages,
          [selectedTemaId]: url
        }
      };
    });
  };

  const handleClearBgImage = () => {
    setDatos(prev => {
      const currentBgImages = { ...(prev.bgImages || {}) };
      delete currentBgImages[selectedTemaId];
      return {
        ...prev,
        bgImages: currentBgImages
      };
    });
    alert(`Se ha de restablecido el fondo por defecto del tema "${temaActual.nombre}".`);
  };

  // Estado para la pestaña de configuración activa en el panel lateral
  const [panelPestana, setPanelPestana] = useState<"ajustes" | "quince" | "lugares" | "itincode" | "familia" | "regalos" | "fotos" | "invitados">("ajustes");

  // Estado para controles de copiado temporal
  const [htmlCopiado, setHtmlCopiado] = useState(false);
  const [datosCopiados, setDatosCopiados] = useState(false);
  const [generandoEnlace, setGenerandoEnlace] = useState(false);

  // Estados para compartir por WhatsApp
  const [whatsappDestino, setWhatsappDestino] = useState("522217445410");
  const [whatsappTemplateId, setWhatsappTemplateId] = useState("completo");
  const [selectedInvitadoIndex, setSelectedInvitadoIndex] = useState<number>(-1);

  // Estados locales para nuevos elementos interactivos de listas
  const [nuevoItinHora, setNuevoItinHora] = useState("");
  const [nuevoItinEvento, setNuevoItinEvento] = useState("");
  
  const [nuevoPadre, setNuevoPadre] = useState("");
  const [nuevoPadrino, setNuevoPadrino] = useState("");

  const [nuevoInvitadoNombre, setNuevoInvitadoNombre] = useState("");
  const [nuevoInvitadoPases, setNuevoInvitadoPases] = useState(2);

  const [nuevoFotoUrl, setNuevoFotoUrl] = useState("");

  // Referencia al iframe para actualizar la vista previa de forma aislada
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Tema seleccionado real
  const temaActual = temas.find(t => t.id === selectedTemaId) || temas[0];

  // Sincronizar tema de datos cuando elegimos tema
  useEffect(() => {
    setDatos(prev => ({
      ...prev,
      tema: selectedTemaId
    }));
  }, [selectedTemaId]);

  // Actualizar la vista previa dentro del iframe de simulación de smartphone
  const actualizarVistaPrevia = () => {
    if (!iframeRef.current) return;
    const htmlString = generarHTMLFinal(datos, temaActual);
    
    // Asignamos el HTML al iframe usando srcdoc para evitar contaminación global de estilos y permitir scripts
    iframeRef.current.srcdoc = htmlString;

    setGenerandoEnlace(true);
    setTimeout(() => {
      setGenerandoEnlace(false);
    }, 1200);
  };

  // Escucha cambios en datos o tema para refrescar la visualización en vivo
  useEffect(() => {
    actualizarVistaPrevia();
  }, [datos, temaActual]);

  // Aplicar plantilla completa predefinida de un paquete
  const handleCambiarPaquete = (paqKey: "basico" | "premium" | "deluxe") => {
    const confirmacion = window.confirm(
      `Al cambiar al paquete "${paqKey.toUpperCase()}", cargaremos los datos de prueba idóneos para ese nivel de secciones. ¿Deseas proceder? Se reemplazarán tus cambios actuales.`
    );
    if (confirmacion) {
      const datosBase = datosDefault[paqKey];
      setDatos({
        ...datosBase,
        paquete: paqKey
      });
      setSelectedTemaId(datosBase.tema);
      setPanelPestana("ajustes");
    }
  };

  // Limpiar formulario completo
  const handleLimpiarFormulario = () => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas reiniciar todos los campos del generador a su estado inicial?");
    if (confirmacion) {
      setDatos({
        paquete: "basico",
        tema: "dorado-clasico",
        nombre: "",
        fecha: new Date().toISOString().substring(0, 16),
        mensajeBienvenida: "Estás invitado a compartir conmigo la alegría de mis quince años.",
        ceremonia: { lugar: "", hora: "", direccion: "", maps: "" },
        recepcion: { lugar: "", hora: "", direccion: "", maps: "" },
        itinerario: [],
        dressCode: "Formal",
        colorSugerido: ["#D4AF37", "#FFFFFF"],
        padres: [],
        padrinos: [],
        mesaRegalos: "",
        datosBancarios: "",
        fotos: [],
        hashtag: "",
        whatsappConfirmacion: "52",
        cancion: "",
        linkPersonalizado: "",
        invitados: []
      });
      setSelectedTemaId("dorado-clasico");
    }
  };

  // Descargar el archivo index.html standalone
  const handleDescargarHTML = () => {
    const htmlCompleto = generarHTMLFinal(datos, temaActual);
    const blob = new Blob([htmlCompleto], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    // Nombre del archivo personalizado según la quinceañera
    const slugName = (datos.nombre || "invitacion").toLowerCase().replace(/[^a-z0-9]/g, "-");
    a.download = `index-${slugName}-${datos.paquete}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copiar código HTML final al portapapeles
  const handleCopiarHTML = () => {
    const htmlCompleto = generarHTMLFinal(datos, temaActual);
    navigator.clipboard.writeText(htmlCompleto)
      .then(() => {
        setHtmlCopiado(true);
        setTimeout(() => setHtmlCopiado(false), 2000);
      })
      .catch(err => alert("Error al copiar HTML: " + err));
  };

  // Copiar objeto de datos JSON al portapapeles para guardado futuro
  const handleCopiarDatos = () => {
    const datosJson = JSON.stringify(datos, null, 2);
    navigator.clipboard.writeText(datosJson)
      .then(() => {
        setDatosCopiados(true);
        setTimeout(() => setDatosCopiados(false), 2000);
      })
      .catch(err => alert("Error al copiar datos JSON: " + err));
  };

  // Generar URL del catálogo de demos
  const getCatalogUrl = () => {
    let appUrl = window.location.origin + window.location.pathname;
    if (
      window.location.origin.includes("run.app") || 
      window.location.origin.includes("localhost") || 
      window.location.origin.includes("127.0.0.1") ||
      window.location.origin.includes("google")
    ) {
      appUrl = "https://generadorpruebaxv1.vercel.app/";
    }
    return `${appUrl}?catalog=true`;
  };

  // Generar URL de compartir con todos los datos y el invitado seleccionado
  const getShareUrl = (invitadoIndex = selectedInvitadoIndex) => {
    let appUrl = window.location.origin + window.location.pathname;
    if (
      window.location.origin.includes("run.app") || 
      window.location.origin.includes("localhost") || 
      window.location.origin.includes("127.0.0.1") ||
      window.location.origin.includes("google")
    ) {
      appUrl = "https://generadorpruebaxv1.vercel.app/";
    }
    
    // Sincronizar el tema activo de forma explícita en los datos decodificables antes de codificar la URL
    const datosListos = {
      ...datos,
      tema: selectedTemaId
    };

    let url = `${appUrl}?v=1&d=${encodeState(datosListos)}`;
    if (invitadoIndex !== -1 && datos.invitados && datos.invitados[invitadoIndex]) {
      url += `&g=${encodeURIComponent(datos.invitados[invitadoIndex].nombre)}`;
    }
    return url;
  };

  // Compartir datos de la invitación final por WhatsApp
  const handleEnviarWhatsApp = (overrideInvitadoIndex?: number) => {
    const targetIndex = typeof overrideInvitadoIndex === "number" ? overrideInvitadoIndex : selectedInvitadoIndex;
    const urlFinal = getShareUrl(targetIndex);
    const nombreQuince = datos.nombre || "Sophia Valeria";
    
    let fechaBonita = datos.fecha;
    try {
      if (datos.fecha) {
        const d = new Date(datos.fecha);
        fechaBonita = d.toLocaleDateString("es-MX", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    } catch (e) {
      // Usar tal cual si falla
    }

    const hasGuest = targetIndex !== -1 && datos.invitados && datos.invitados[targetIndex];
    const invitado = hasGuest ? datos.invitados[targetIndex] : null;

    let msg = "";
    if (whatsappTemplateId === "link-only") {
      if (invitado) {
        msg = `🌸 ¡Hola *${invitado.nombre}*! Te comparto tu pase digital personalizado con *${invitado.pases} boleto(s)* para los XV Años de *${nombreQuince}*: ${urlFinal}`;
      } else {
        msg = `🌸 ¡Hola! Te comparto el enlace de la invitación digital interactiva de XV Años de *${nombreQuince}*: ${urlFinal}`;
      }
    } else {
      if (invitado) {
        msg = `¡Hola *${invitado.nombre}*! Ya está lista tu invitación digital personalizada de XV Años para *${nombreQuince}*. 🌸✨\n\n🎟️ Tienen asignados: **${invitado.pases} pase(s)** familiares\n📅 *Fecha:* ${fechaBonita}\n💒 *Misa:* ${datos.ceremonia.lugar || "Sin especificar"} (${datos.ceremonia.hora || "Sin especificar"} hrs)\n🎉 *Recepción:* ${datos.recepcion.lugar || "Sin especificar"}\n\n👉 Puedes ver tu pase interactivo ingresando a este enlace:\n${urlFinal}`;
      } else {
        msg = `¡Hola! Ya está lista la propuesta de invitación digital de XV Años para *${nombreQuince}*. 🌸✨\n\n📅 *Fecha:* ${fechaBonita}\n💒 *Misa:* ${datos.ceremonia.lugar || "Sin especificar"} (${datos.ceremonia.hora || "Sin especificar"} hrs)\n🎉 *Recepción:* ${datos.recepcion.lugar || "Sin especificar"} (${datos.recepcion.hora || "Sin especificar"} hrs)\n\n👉 Puedes ver la invitación digital interactiva ingresando a este enlace:\n${urlFinal}`;
      }
    }

    const numberClean = whatsappDestino.replace(/[^0-9]/g, "");
    const waUrl = `https://api.whatsapp.com/send?phone=${numberClean}&text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  // Procesar archivo cargado localmente (Convertir a Base64)
  const handleLeerFotoLocal = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxFotosPermitidas = paquetes[datos.paquete].maxFotos;
    const fotosActuales = [...(datos.fotos || [])];

    if (fotosActuales.length >= maxFotosPermitidas) {
      alert(`Límite alcanzado: El paquete ${datos.paquete.toUpperCase()} solo permite un máximo de ${maxFotosPermitidas} fotos.`);
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64Str = event.target.result as string;
        setDatos(prev => ({
          ...prev,
          fotos: [...(prev.fotos || []), base64Str]
        }));
      }
    };
    reader.readAsDataURL(file);
    // Reiniciar input
    e.target.value = "";
  };

  // Agregar una URL de foto pegada
  const handleAgregarFotoUrl = () => {
    if (!nuevoFotoUrl.trim()) return;
    
    const maxFotosPermitidas = paquetes[datos.paquete].maxFotos;
    const fotosActuales = [...(datos.fotos || [])];

    if (fotosActuales.length >= maxFotosPermitidas) {
      alert(`Límite alcanzado: El paquete ${datos.paquete.toUpperCase()} solo permite un máximo de ${maxFotosPermitidas} fotos.`);
      return;
    }

    setDatos(prev => ({
      ...prev,
      fotos: [...(prev.fotos || []), nuevoFotoUrl.trim()]
    }));
    setNuevoFotoUrl("");
  };

  // Eliminar foto individual
  const handleEliminarFoto = (index: number) => {
    setDatos(prev => ({
      ...prev,
      fotos: (prev.fotos || []).filter((_, i) => i !== index)
    }));
  };

  // Itinerario: Agregar evento
  const handleAgregarItinerario = () => {
    if (!nuevoItinHora || !nuevoItinEvento) {
      alert("Por favor rellena ambos campos: Hora y Evento.");
      return;
    }
    setDatos(prev => ({
      ...prev,
      itinerario: [
        ...(prev.itinerario || []),
        { hora: nuevoItinHora, evento: nuevoItinEvento }
      ]
    }));
    setNuevoItinHora("");
    setNuevoItinEvento("");
  };

  // Itinerario: Eliminar evento
  const handleEliminarItinerario = (index: number) => {
    setDatos(prev => ({
      ...prev,
      itinerario: (prev.itinerario || []).filter((_, i) => i !== index)
    }));
  };

  // Padres: Agregar
  const handleAgregarPadre = () => {
    if (!nuevoPadre.trim()) return;
    setDatos(prev => ({
      ...prev,
      padres: [...(prev.padres || []), nuevoPadre.trim()]
    }));
    setNuevoPadre("");
  };

  // Padres: Eliminar
  const handleEliminarPadre = (index: number) => {
    setDatos(prev => ({
      ...prev,
      padres: (prev.padres || []).filter((_, i) => i !== index)
    }));
  };

  // Padrinos: Agregar
  const handleAgregarPadrino = () => {
    if (!nuevoPadrino.trim()) return;
    setDatos(prev => ({
      ...prev,
      padrinos: [...(prev.padrinos || []), nuevoPadrino.trim()]
    }));
    setNuevoPadrino("");
  };

  // Padrinos: Eliminar
  const handleEliminarPadrino = (index: number) => {
    setDatos(prev => ({
      ...prev,
      padrinos: (prev.padrinos || []).filter((_, i) => i !== index)
    }));
  };

  // Invitados: Agregar
  const handleAgregarInvitado = () => {
    if (!nuevoInvitadoNombre.trim()) {
      alert("Por favor escribe el nombre de la familia o invitado.");
      return;
    }
    setDatos(prev => ({
      ...prev,
      invitados: [
        ...(prev.invitados || []),
        { nombre: nuevoInvitadoNombre.trim(), pases: nuevoInvitadoPases }
      ]
    }));
    setNuevoInvitadoNombre("");
    setNuevoInvitadoPases(2);
  };

  // Invitados: Eliminar
  const handleEliminarInvitado = (index: number) => {
    setDatos(prev => ({
      ...prev,
      invitados: (prev.invitados || []).filter((_, i) => i !== index)
    }));
  };

  // Código de Vestimenta: Agregar color sugerido
  const [nuevoColor, setNuevoColor] = useState("#b76e79");
  const handleAgregarColorSugerido = () => {
    if (datos.colorSugerido.includes(nuevoColor)) return;
    setDatos(prev => ({
      ...prev,
      colorSugerido: [...prev.colorSugerido, nuevoColor]
    }));
  };

  // Código de Vestimenta: Eliminar color
  const handleEliminarColorSugerido = (color: string) => {
    setDatos(prev => ({
      ...prev,
      colorSugerido: prev.colorSugerido.filter(c => c !== color)
    }));
  };

  // Reemplazar el DOM de la página para la vista de los invitados (isViewMode = true)
  // Esto elimina las restricciones severas de iframe y sandbox del navegador,
  // permitiendo que el copiado de cuentas de banco, itinerarios, música y mapas funcionen de manera nativa y confiable.
  useEffect(() => {
    if (isViewMode) {
      let htmlContent = generarHTMLFinal(datos, temaActual);
      
      // Inyectar un elegante botón flotante de control para poder volver al editor privado si lo desea
      const buttonHtml = `
        <button
          onclick="window.location.href = window.location.origin + window.location.pathname"
          style="position: fixed; bottom: 16px; right: 16px; z-index: 99999; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: white; font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; font-weight: 600; padding: 7px 14px; border-radius: 9999px; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 4px 12px rgba(0,0,0,0.25); cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;"
          onmouseover="this.style.background='rgba(15, 23, 42, 1)'; this.style.transform='scale(1.03)';"
          onmouseout="this.style.background='rgba(15, 23, 42, 0.85)'; this.style.transform='scale(1)';"
        >
          <svg style="width: 13px; height: 13px;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>Ajustes Generador</span>
        </button>
      `;
      
      // Adjuntar el botón justo antes de la etiqueta de cierre </body>
      htmlContent = htmlContent.replace("</body>", `${buttonHtml}</body>`);

      document.open();
      document.write(htmlContent);
      document.close();
    }
  }, [isViewMode, datos, temaActual]);

  if (isViewMode) {
    return (
      <div className="w-screen h-screen fixed inset-0 flex flex-col items-center justify-center bg-slate-50 z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
        <p className="text-xs text-slate-500 font-medium font-sans">Abriendo tu invitación digital de 15 años...</p>
      </div>
    );
  }

  if (isCatalogMode) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col animate-fadeIn">
        {/* ENCABEZADO DENTRO DE VISTA CATALOGO */}
        {selectedCatalogTemaId ? (
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCatalogTemaId(null)}
                className="p-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-705 text-xs font-bold rounded-lg transition active:scale-95 cursor-pointer"
              >
                ← Volver al Catálogo
              </button>
              <div>
                <h2 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Visualizando Demo Interactiva</h2>
                <p className="text-xs font-extrabold text-indigo-600 flex items-center gap-1">
                  {temas.find(t => t.id === selectedCatalogTemaId)?.nombre || "Tema Elegido"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a
                href="https://w.app/invitamx"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span className="hidden sm:inline">¡Me interesa este Tema!</span>
                <span>Pedir por WhatsApp 💬</span>
              </a>
            </div>
            

          </div>
        ) : (
          <header className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white py-10 px-6 text-center shrink-0">
            <div className="max-w-4xl mx-auto space-y-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-extrabold tracking-wider text-indigo-200 uppercase">
                Colección Premium XV Años ⚜️
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Catálogo de Invitaciones Digitales Interactivas
              </h1>
              <p className="text-xs md:text-sm text-indigo-200 max-w-2xl mx-auto leading-relaxed">
                Explora cada uno de nuestros 9 temas exclusivos con todos los efectos interactivos en vivo: música, mapas de ceremonia, control de pases de invitados y galerías de fotos.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsCatalogMode(false)}
                  className="px-4 py-1.5 bg-white hover:bg-indigo-50 text-indigo-900 text-xs font-bold rounded-lg transition shadow-md active:scale-95 cursor-pointer"
                >
                  Regresar al Generador Privado ✍️
                </button>
              </div>
            </div>
          </header>
        )}

        {/* CONTAINER DEL CONTENIDO */}
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6">
          {selectedCatalogTemaId ? (
            /* Render del Demo en vivo dentro de un iframe interactivo */
            <div className="w-full h-[calc(100vh-140px)] rounded-2xl border border-slate-200 overflow-hidden shadow-xl bg-white">
              <iframe
                srcDoc={generarHTMLFinal(datosDefault.premium, temas.find(t => t.id === selectedCatalogTemaId) || temas[0])}
                className="w-full h-full border-0"
                title="Invitación Demo en Vivo"
              />
            </div>
          ) : (
            /* Listado de tarjetas de catálogo de todos los temas */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {temas.map((t) => {
                  const isDarkTheme = t.id === "celestial" || t.id === "princesa-elegante" || t.id === "neon";
                  let descripcion = "Un diseño lujoso y resplandeciente.";
                  if (t.id === "dorado-clasico") descripcion = "Tradicional, majestuoso, elegante. Con detalles dorados clásicos e impecables decoraciones heráldicas ⚜️";
                  if (t.id === "mariposas") descripcion = "Mágico, etéreo y romántico. Cascadas de hermosas mariposas revoloteando sobre una tipografía artesanal 🦋";
                  if (t.id === "floral-acuarela") descripcion = "Fresco, primaveral y sumamente artístico. Ramos florales en acuarela pintados a mano en tonos rosa pastel 🌸";
                  if (t.id === "celestial") descripcion = "Místico, nocturno y estrellado. Un firmamento azul profundo con lunas y constelaciones doradas brillando celestialmente 🌙";
                  if (t.id === "botanico") descripcion = "Natural, orgánico y minimalista. Un santuario de eucalipto fresco y sutiles hojas verdes para una vibra moderna 🌿";
                  if (t.id === "glam-rose") descripcion = "Moderno, ultra glamuroso y chic. Tonos oro rosa metálicos y polvos de escarcha para celebraciones alegres 💖";
                  if (t.id === "boho-chic") descripcion = "Rústico, cálido y bohemio. Tonos terracotas, pastos secos y flores de pampa con libre expresión artística 🌾";
                  if (t.id === "princesa-elegante") descripcion = "Digno de la realeza. Distinguido, clásico y de alta alcurnia, con tiaras heráldicas y estética principesca 👑";
                  if (t.id === "marmol-oro") descripcion = "Sofisticado, contemporáneo y ultra premium. Vetas de mármol pulido realzado con costuras de oro pulido 💎";
                  if (t.id === "neon") descripcion = "Ciberpunk, vibrante y electrizante. Un fondo oscuro de noche urbana iluminado con espectaculares destellos de luz de neón rosa, cian y amarillo-bizarro ⚡";

                  return (
                    <div 
                      key={t.id} 
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col h-full"
                    >
                      {/* Cabecera visual del tema + Mini Vista Previa Interactiva en Vivo en forma de Celular */}
                      <div className="relative h-64 overflow-hidden border-b border-slate-150 group flex items-center justify-center select-none" style={{ backgroundColor: t.colors.light || '#f8fafc' }}>
                        
                        {/* Fondo de estudio decorativo claro adaptado al color de fondo y primario del tema */}
                        <div 
                          className="absolute inset-0 transition-colors duration-500" 
                          style={{
                            background: `radial-gradient(circle at 50% 50%, ${(t.colors.primary || '#6366f1')}15 0%, ${(t.colors.light || '#f8fafc')} 70%, ${(t.colors.bg || '#f1f5f9')} 100%)`
                          }}
                        />
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-slate-200/40" />

                        {/* Círculos de luz flotantes decorativos claros y suaves con colores del tema */}
                        <div 
                          className="absolute -top-10 -left-10 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none transition-all duration-500 group-hover:scale-110" 
                          style={{ backgroundColor: t.colors.primary }}
                        />
                        <div 
                          className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none transition-all duration-500 group-hover:scale-110" 
                          style={{ backgroundColor: t.colors.accent || t.colors.secondary || t.colors.primary }}
                        />

                        {/* Rejilla decorativa translúcida suave alineada al color del tema */}
                        <div 
                          className="absolute inset-0 opacity-10"
                          style={{ 
                            backgroundImage: `linear-gradient(to right, ${t.colors.primary}25 1px, transparent 1px), linear-gradient(to bottom, ${t.colors.primary}25 1px, transparent 1px)`,
                            backgroundSize: '14px 14px'
                          }}
                        />

                        {/* Maqueta del Celular Realista */}
                        <div className="relative z-10 w-[128px] h-[224px] bg-slate-900 rounded-[28px] p-[3px] border-[2px] border-slate-800 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.12),0_8px_16px_-6px_rgba(15,23,42,0.08)] flex flex-col transition-all duration-300 group-hover:scale-105 group-hover:border-slate-700 group-hover:shadow-[0_16px_36px_-8px_rgba(99,102,241,0.2),0_6px_14px_rgba(15,23,42,0.1)]">
                          
                          {/* Botones físicos laterales simulados */}
                          <div className="absolute top-10 -left-[2.5px] w-[2.5px] h-6 bg-slate-700 rounded-l transition-colors duration-300 group-hover:bg-slate-600" />
                          <div className="absolute top-18 -left-[2.5px] w-[2.5px] h-6 bg-slate-700 rounded-l transition-colors duration-300 group-hover:bg-slate-600" />
                          <div className="absolute top-14 -right-[2.5px] w-[2.5px] h-10 bg-slate-700 rounded-r transition-colors duration-300 group-hover:bg-slate-600" />

                          {/* Pantalla del celular */}
                          <div className="w-full h-full rounded-[24px] bg-slate-950 overflow-hidden relative border border-slate-850 flex items-center justify-center">
                            
                            {/* Isla Dinámica / Muesca superior */}
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-11 h-2.5 bg-black rounded-full z-20 flex items-center justify-start px-1 shadow-inner">
                              <span className="w-1 h-1 rounded-full bg-slate-900 block opacity-80" />
                            </div>

                            {/* Ranura del Auricular de llamadas */}
                            <div className="absolute top-[1.5px] left-1/2 -translate-x-1/2 w-3 h-[0.75px] bg-slate-800/90 rounded-full z-20" />

                            {/* Barra de inicio / Swipe Bar inferior (iOS Style) */}
                            <div className="absolute bottom-1 w-8 h-0.5 bg-white/40 rounded-full left-1/2 -translate-x-1/2 z-20 shadow-xs" />

                            {/* Iframe minificado cargando el HTML final y ajustado exactamente al tamaño de la pantalla */}
                            <div className="w-full h-full overflow-hidden absolute inset-0 bg-slate-950">
                              <iframe 
                                srcDoc={generarHTMLFinal(datos || datosDefault.premium, t)}
                                className="absolute border-0 pointer-events-none select-none"
                                style={{
                                  width: "354px",
                                  height: "642px",
                                  transform: "scale(0.333333)",
                                  transformOrigin: "top left",
                                  top: "0",
                                  left: "0"
                                }}
                                title={`Mini-vista ${t.nombre}`}
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Capa de degrade de brillo suave sobre el panel de cabecera */}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/5 to-transparent pointer-events-none z-10" />

                        {/* Indicadores visuales y etiquetas */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                          <span className="text-2xl drop-shadow-sm">{t.decorativeEmoji}</span>
                          <div className="flex gap-1">
                            {isDarkTheme && (
                              <span className="bg-slate-900/95 border border-slate-700 text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded text-indigo-300 shadow-sm backdrop-blur-xs">
                                Nocturno 🌙
                              </span>
                            )}
                            <span className="bg-white/95 border border-slate-200/80 text-[8px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded text-slate-700 shadow-sm backdrop-blur-xs">
                              Vista Previa ⚡
                            </span>
                          </div>
                        </div>

                        <div className="absolute bottom-3 left-4 right-4 pointer-events-none z-20 flex items-center justify-between">
                          <span className="text-xs font-bold tracking-tight text-slate-800 bg-white/90 backdrop-blur-xs border border-slate-100 px-2 py-0.5 rounded-lg shadow-sm">
                            {t.nombre}
                          </span>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider scale-90 origin-right bg-white/90 backdrop-blur-xs border border-slate-100 px-1.5 py-0.5 rounded-lg shadow-sm">
                            Demo Activo
                          </span>
                        </div>
                      </div>

                      {/* Cuerpo de detalles */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">
                            {descripcion}
                          </p>

                          {/* Estilo tipográfico */}
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-2">
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">Título Principal</span>
                              <span 
                                className="text-sm text-slate-800 font-semibold"
                                style={{ fontFamily: t.fontHeading }}
                              >
                                Sofía Valeria
                              </span>
                            </div>
                            {t.fontCursive && (
                              <div>
                                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">Firma Cursiva</span>
                                <span 
                                  className="text-base text-slate-700 block"
                                  style={{ fontFamily: t.fontCursive }}
                                >
                                  Mis Quince Años
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Paleta de colores */}
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-extrabold mb-1">Paleta Oficial</span>
                            <div className="flex gap-2">
                              {Object.entries(t.colors).map(([key, val]) => (
                                <div key={key} className="flex flex-col items-center">
                                  <div 
                                    className="w-5.5 h-5.5 rounded-full border border-slate-200 shadow-2xs" 
                                    style={{ backgroundColor: val }}
                                    title={key}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="pt-1 flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => setSelectedCatalogTemaId(t.id)}
                            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition active:scale-95 cursor-pointer text-center shadow-xs"
                          >
                            Ver Demo 👁️✨
                          </button>
                          <a
                            href="https://w.app/invitamx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-750 border border-emerald-500/10 text-white text-[11px] font-bold rounded-lg transition active:scale-94 cursor-pointer text-center shadow-xs flex items-center justify-center gap-1"
                          >
                            Pedir por WhatsApp 💬
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* HEADER PRINCIPAL DE LA HERRAMIENTA PRIVADA */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">GENERADOR PRIVADO XV</h1>
              <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                ADMIN WORKSPACE
              </span>
            </div>
            <p className="text-xs text-slate-500">Diseña, compila y exporta invitaciones de 15 años profesionales en segundos.</p>
          </div>
        </div>

        {/* ACCIONES DEL FORMULARIO */}
        <div id="control-panel-actions" className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={actualizarVistaPrevia} 
            className={`px-3.5 py-2 ${generandoEnlace ? 'bg-emerald-650 text-white border-emerald-600 font-extrabold scale-102 shadow-md' : 'bg-white hover:bg-indigo-50/20 hover:border-indigo-200 text-slate-700 border border-slate-200'} text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-sm`}
            title="Sincronizar y generar enlace con tus cambios actuales"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generandoEnlace ? 'text-white animate-spin' : 'text-indigo-600'}`} />
            <span>{generandoEnlace ? "¡Sincronizado! ✨" : "Generar invitación"}</span>
          </button>

          <button 
            onClick={handleCopiarHTML} 
            className={`px-3.5 py-2 ${htmlCopiado ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'} text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm`}
          >
            {htmlCopiado ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{htmlCopiado ? "Copiado" : "Copiar HTML"}</span>
          </button>

          <button 
            onClick={handleCopiarDatos} 
            className={`px-3.5 py-2 ${datosCopiados ? 'bg-emerald-600 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'} text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm`}
            title="Copiar configuración JSON del cliente"
          >
            {datosCopiados ? <Check className="w-3.5 h-3.5 text-white" /> : <Clipboard className="w-3.5 h-3.5 text-slate-500" />}
            <span>{datosCopiados ? "JSON Copiado" : "Copiar Datos"}</span>
          </button>

          <button 
            onClick={handleLimpiarFormulario} 
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Limpiar</span>
          </button>

          <button 
            onClick={handleDescargarHTML} 
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer transform active:scale-95"
            id="descargar-btn"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Descargar index.html</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD PRINCIPAL DE TRABAJO */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        
        {/* PANEL IZQUIERDO: SECCIONES DE CONFIGURACIÓN Y FORMULARIO */}
        <aside className="w-full lg:w-[48%] xl:w-[45%] border-r border-slate-200 flex flex-col bg-white shrink-0">
          
          {/* BARRA DE PESTAÑAS DEL EXPEDIENTE */}
          <div className="flex border-b border-slate-200 bg-white overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
            <button 
              onClick={() => setPanelPestana("ajustes")}
              className={`px-4 py-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${panelPestana === "ajustes" ? "border-indigo-600 text-indigo-600 bg-indigo-50/20" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"}`}
              id="pestana-ajustes"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Tema/Paquete</span>
            </button>
            <button 
              onClick={() => setPanelPestana("quince")}
              className={`px-4 py-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${panelPestana === "quince" ? "border-indigo-600 text-indigo-600 bg-indigo-50/20" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Quinceañera</span>
            </button>
            <button 
              onClick={() => setPanelPestana("lugares")}
              className={`px-4 py-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${panelPestana === "lugares" ? "border-indigo-600 text-indigo-600 bg-indigo-50/20" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"}`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Direcciones</span>
            </button>
            <button 
              onClick={() => setPanelPestana("itincode")}
              className={`px-4 py-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${panelPestana === "itincode" ? "border-indigo-600 text-indigo-600 bg-indigo-50/20" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda y Vestido</span>
            </button>
            <button 
              onClick={() => setPanelPestana("familia")}
              className={`px-4 py-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${panelPestana === "familia" ? "border-indigo-600 text-indigo-600 bg-indigo-50/20" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"}`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Familia</span>
            </button>
            <button 
              onClick={() => setPanelPestana("regalos")}
              className={`px-4 py-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${panelPestana === "regalos" ? "border-indigo-600 text-indigo-600 bg-indigo-50/20" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"}`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Regalos</span>
            </button>
            <button 
              onClick={() => setPanelPestana("fotos")}
              className={`px-4 py-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${panelPestana === "fotos" ? "border-indigo-600 text-indigo-600 bg-indigo-50/20" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"}`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Álbum</span>
            </button>
            <button 
              onClick={() => setPanelPestana("invitados")}
              className={`px-4 py-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${panelPestana === "invitados" ? "border-indigo-600 text-indigo-600 bg-indigo-50/20" : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"}`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Lista Pases</span>
            </button>
          </div>

          {/* CONTENIDOR DEL FORMULARIO CON SCROLL */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* TAB 1: PAQUETES Y TEMAS */}
            {panelPestana === "ajustes" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* SELECTOR DE PAQUETE */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    1. Selección de Paquete (Activa / Desactiva Secciones)
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(paquetes) as Array<"basico" | "premium" | "deluxe">).map((key) => {
                      const paq = paquetes[key];
                      const isSelected = datos.paquete === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleCambiarPaquete(key)}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition h-28 cursor-pointer ${isSelected ? 'border-indigo-600 bg-indigo-50/70 shadow-sm' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'}`}
                        >
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Nivel</span>
                            <span className="text-sm font-extrabold text-slate-800 block capitalize">{paq.nombre}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Máx. Fotos: {paq.maxFotos}</span>
                            <span className="text-xs font-mono font-bold text-indigo-600">{paq.precio}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    <span className="font-bold text-slate-700 block mb-1">Secciones Habilitadas en este Paquete:</span>
                    <div className="flex flex-wrap gap-1">
                      {paquetes[datos.paquete].secciones.map(secName => (
                        <span key={secName} className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-medium">
                          {secName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SELECTOR DE TEMAS */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    2. Tema de la Invitación (CSS y Visuales Propios)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="temas-grid">
                    {temas.map((t) => {
                      const isSelected = selectedTemaId === t.id;
                      const isDarkTheme = t.id === "celestial" || t.id === "princesa-elegante" || t.id === "neon";
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTemaId(t.id)}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer h-24 ${isSelected ? 'border-indigo-600 bg-indigo-50/70 shadow-sm' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'}`}
                          style={{
                            borderLeft: `4px solid ${t.colors.primary}`
                          }}
                        >
                          <div className="w-full flex items-center justify-between">
                            <span className="text-[13px] font-bold text-slate-800 block truncate">{t.nombre}</span>
                            {isDarkTheme && (
                              <span className="text-[9px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-1.5 rounded font-semibold">Noche</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1.5 mt-2 overflow-hidden w-full">
                            <span className="text-xs text-slate-500 truncate">Fuente: {t.fontHeading}</span>
                          </div>

                          <div className="flex gap-1.5 mt-2">
                            <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: t.colors.primary }}></span>
                            <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: t.colors.accent }}></span>
                            <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: t.colors.light }}></span>
                            <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: t.colors.dark }}></span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* CARGADOR DE FONDO POR TEMA */}
                  <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/70 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-600 rounded-lg text-white animate-pulse">
                        <Upload className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Fondo para {temaActual.nombre}</h4>
                        <p className="text-[11px] text-slate-500">Carga un fondo único para este tema por separado.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Indicador de estado */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium font-sans">Estado del fondo:</span>
                        {datos.bgImages?.[selectedTemaId] ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                            Personalizado ({datos.bgImages[selectedTemaId].startsWith("data:") ? "Archivo" : "URL"})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-medium font-sans">
                            Predeterminado (Gradiente del Tema)
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {/* Subir archivo */}
                        <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-indigo-200 rounded-xl bg-white hover:bg-indigo-50/20 active:scale-[0.98] transition-all cursor-pointer text-center group shadow-xs">
                          <Upload className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 mb-1" />
                          <span className="text-xs font-bold text-indigo-700 font-sans">Subir Archivo 📁</span>
                          <span className="text-[9px] text-slate-400 mt-0.5 font-sans">Automáticamente optimizado</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBgImageUpload}
                            className="hidden"
                          />
                        </label>

                        {/* Restaurar */}
                        <button
                          type="button"
                          onClick={handleClearBgImage}
                          disabled={!datos.bgImages?.[selectedTemaId]}
                          className={`flex flex-col items-center justify-center p-3 border rounded-xl font-sans transition-all active:scale-[0.98] text-center shadow-xs ${
                            datos.bgImages?.[selectedTemaId]
                              ? "bg-white border-rose-205 hover:bg-rose-50/50 cursor-pointer text-rose-700"
                              : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <Trash2 className="w-5 h-5 mb-1" />
                          <span className="text-xs font-bold font-sans">Restablecer Fondo</span>
                          <span className="text-[9px] opacity-75 mt-0.5 font-sans font-medium">Volver a los valores por defecto</span>
                        </button>
                      </div>

                      {/* Pegar URL */}
                      <div>
                        <label className="block text-xs font-bold text-slate-705 mb-1 font-sans">O Pegar Enlace Directo de Imagen 🔗</label>
                        <input
                          type="text"
                          value={datos.bgImages?.[selectedTemaId] && !datos.bgImages[selectedTemaId].startsWith("data:") ? datos.bgImages[selectedTemaId] : ""}
                          onChange={(e) => handleBgImageUrlChange(e.target.value)}
                          placeholder="Ej. https://images.unsplash.com/photo-..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none font-sans"
                          title="Puedes pegar un link público de Unsplash, Pinterest u otro hosting de fotos."
                        />
                        <p className="text-[10px] text-slate-400 mt-1 font-sans">
                          Utilizar un enlace directo a Internet es idóneo para evitar sobrecargar la capacidad del link codificado.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COMPARTIR POR WHATSAPP */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
                    3. Compartir por WhatsApp (Envío Directo)
                  </h3>
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Comparte el link para ver y editar esta invitación directamente en WhatsApp. El link se genera de manera dinámica combinando tus opciones, temas e invitados.
                    </p>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Para Invitado Especial (Opcional)</label>
                      <select
                        value={selectedInvitadoIndex}
                        onChange={(e) => setSelectedInvitadoIndex(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-emerald-500 outline-none font-sans"
                      >
                        <option value="-1">-- Todos / Invitación General --</option>
                        {datos.invitados && datos.invitados.map((item, index) => (
                          <option key={index} value={index}>
                            {item.nombre} ({item.pases} pases)
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Número de Destinatario</label>
                        <input
                          type="text"
                          value={whatsappDestino}
                          onChange={(e) => setWhatsappDestino(e.target.value)}
                          placeholder="Ej. 22177445410"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-emerald-500 outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Formato de Invitación</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setWhatsappTemplateId("completo")}
                            className={`p-2 text-center rounded-lg border text-xs font-semibold transition cursor-pointer ${
                              whatsappTemplateId === "completo"
                                ? "bg-emerald-600/10 border-emerald-500 text-emerald-800"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            Detalle Completo
                          </button>
                          <button
                            type="button"
                            onClick={() => setWhatsappTemplateId("link-only")}
                            className={`p-2 text-center rounded-lg border text-xs font-semibold transition cursor-pointer ${
                              whatsappTemplateId === "link-only"
                                ? "bg-emerald-600/10 border-emerald-500 text-emerald-800"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            Solo Enlace
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Enlace de Invitación Resultante (Elección Actual)</label>
                        <div className="flex gap-1.5 w-full">
                          <input
                            type="text"
                            readOnly
                            value={getShareUrl()}
                            className="flex-1 px-3 py-2 bg-white/75 border border-slate-200 rounded-lg text-slate-600 text-[10px] outline-none font-mono truncate"
                            title="Este enlace incluye toda tu configuración guardada encriptada en tiempo real"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(getShareUrl())
                                .then(() => alert("¡Enlace de invitación copiado con éxito! 🌸✨"))
                                .catch(err => alert("Error al copiar enlace: " + err));
                            }}
                            className="px-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-xs"
                            title="Copiar enlace"
                          >
                            <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleEnviarWhatsApp}
                      className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer shadow-sm shadow-emerald-500/10"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.714-1.458L0 24zm12.035-2.024c1.801 0 3.559-.483 5.097-1.397l.365-.217 3.793.994-.101-3.693.24-.382c.983-1.566 1.502-3.39 1.501-5.275C22.99 5.8 18.055 1.12 12.01 1.12c-2.926 0-5.677 1.14-7.747 3.212C2.193 6.405 1.05 9.155 1.05 12.08c0 2.923.77 5.666 2.23 7.728l.243.344-.997 3.642 3.743-.981.36.214a10.932 10.932 0 0 0 5.406 1.413h.001zM17.47 15.3c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      Enviar por WhatsApp
                    </button>
                    
                    <div className="border-t border-emerald-100/50 pt-2.5">
                      <p className="text-[10px] text-slate-500 font-medium">
                        El link de edición se actualizará automáticamente con tus cambios actuales para que el destinatario los visualice en su simulación.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ENLACE DEL CATÁLOGO DE DEMOS */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    4. Catálogo Digital de Temas (Demos Interactivas)
                  </h3>
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100/70 rounded-xl space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      Genera y comparte un link público para que tus clientes o invitados visualicen un precioso catálogo con botones para probar en vivo la demo interactiva de cada uno de los 9 temas.
                    </p>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">Enlace de Tu Catálogo de Temas 🔗</label>
                      <div className="flex gap-1.5 w-full">
                        <input
                          type="text"
                          readOnly
                          value={getCatalogUrl()}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-[10px] outline-none font-mono truncate"
                          title="Haz clic en copiar para compartir este link de catálogo de demostraciones en vivo"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const catUrl = getCatalogUrl();
                            navigator.clipboard.writeText(catUrl)
                              .then(() => alert("¡Enlace del Catálogo de Temas copiado con éxito! 📂✨ Admite navegación por todos los demos en vivo."))
                              .catch(err => alert("Error al copiar enlace: " + err));
                          }}
                          className="px-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-xs"
                          title="Copiar enlace del catálogo"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCatalogMode(true);
                        }}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer shadow-sm shadow-indigo-500/10 font-sans"
                      >
                        <Sparkles className="w-4 h-4" />
                        Abrir / Probar Catálogo de Temas 👁️
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: QUINCE_AÑERA DATOS BÁSICOS */}
            {panelPestana === "quince" && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-semibold text-indigo-600 mb-2">Información Esencial</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-650 mb-1.5">Nombre de la Quinceañera *</label>
                  <input
                    type="text"
                    value={datos.nombre}
                    onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                    placeholder="Ej. Sophia Valeria"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-indigo-600 outline-none"
                    id="input-nombre-quince"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-650 mb-1.5">Fecha y Hora del Evento Principal *</label>
                  <input
                    type="datetime-local"
                    value={datos.fecha ? datos.fecha.substring(0, 16) : ""}
                    onChange={(e) => setDatos({ ...datos, fecha: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-indigo-600 outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Usa la hora de la Ceremonia Principal para calcular la cuenta regresiva.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-650 mb-1.5">Mensaje de Bienvenida / Agradecimiento</label>
                  <textarea
                    rows={4}
                    value={datos.mensajeBienvenida}
                    onChange={(e) => setDatos({ ...datos, mensajeBienvenida: e.target.value })}
                    placeholder="Escribe el poema, dedicatoria o palabras de bienvenida para los invitados..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-indigo-600 outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-650 mb-1.5">Hashtag de Redes Sociales (Opcional)</label>
                  <input
                    type="text"
                    value={datos.hashtag}
                    onChange={(e) => setDatos({ ...datos, hashtag: e.target.value })}
                    placeholder="Ej. #SophiaValeriaXV"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-650 mb-1.5">WhatsApp de Confirmación de Asistencia (Lada + Número)*</label>
                  <input
                    type="text"
                    value={datos.whatsappConfirmacion}
                    onChange={(e) => setDatos({ ...datos, whatsappConfirmacion: e.target.value })}
                    placeholder="Ej. 525512345678 (Solo números sin espacios)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-indigo-600 outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Indispensable código de país al inicio (52 para México).</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-650 mb-1.5">Enlace a Música de Fondo (Debe ser un .mp3 público)*</label>
                  <input
                    type="text"
                    value={datos.cancion}
                    onChange={(e) => setDatos({ ...datos, cancion: e.target.value })}
                    placeholder="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-indigo-600 outline-none font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Sugerencia: Puedes colocar links de canciones libres de derechos alojadas públicamente o dejarse en blanco.</p>
                </div>
              </div>
            )}

            {/* TAB 3: UBICACIONES (CEREMONIA Y RECEPCION) */}
            {panelPestana === "lugares" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* UBICACION DE CEREMONIA */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="text-xs uppercase font-extrabold text-indigo-600 flex items-center gap-1.5">
                    <span className="p-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600"><MapPin className="w-3 h-3" /></span>
                    Ceremonia Religiosa / Misa
                  </h4>
                  
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-semibold">Templo / Iglesia</label>
                    <input
                      type="text"
                      value={datos.ceremonia.lugar}
                      onChange={(e) => setDatos({
                        ...datos,
                        ceremonia: { ...datos.ceremonia, lugar: e.target.value }
                      })}
                      placeholder="Ej. Parroquia de San Juan Bautista"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-semibold">Hora Misa</label>
                      <input
                        type="text"
                        value={datos.ceremonia.hora}
                        onChange={(e) => setDatos({
                          ...datos,
                          ceremonia: { ...datos.ceremonia, hora: e.target.value }
                        })}
                        placeholder="Ej. 17:05"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-semibold">Dirección Física Completa</label>
                    <input
                      type="text"
                      value={datos.ceremonia.direccion}
                      onChange={(e) => setDatos({
                        ...datos,
                        ceremonia: { ...datos.ceremonia, direccion: e.target.value }
                      })}
                      placeholder="Calle, Número, Colonia, Ciudad"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-semibold">Enlace de Compartir Google Maps</label>
                    <input
                      type="text"
                      value={datos.ceremonia.maps}
                      onChange={(e) => setDatos({
                        ...datos,
                        ceremonia: { ...datos.ceremonia, maps: e.target.value }
                      })}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* UBICACION DE RECEPCION */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                  <h4 className="text-xs uppercase font-extrabold text-indigo-600 flex items-center gap-1.5">
                    <span className="p-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600"><MapPin className="w-3 h-3" /></span>
                    Recepción / Salón de Fiestas
                  </h4>
                  
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-semibold">Salón o Finca</label>
                    <input
                      type="text"
                      value={datos.recepcion.lugar}
                      onChange={(e) => setDatos({
                        ...datos,
                        recepcion: { ...datos.recepcion, lugar: e.target.value }
                      })}
                      placeholder="Ej. Salón de Eventos Las Gardenias"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-semibold">Hora Recepción</label>
                      <input
                        type="text"
                        value={datos.recepcion.hora}
                        onChange={(e) => setDatos({
                          ...datos,
                          recepcion: { ...datos.recepcion, hora: e.target.value }
                        })}
                        placeholder="Ej. 19:30"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-semibold">Dirección Física Completa</label>
                    <input
                      type="text"
                      value={datos.recepcion.direccion}
                      onChange={(e) => setDatos({
                        ...datos,
                        recepcion: { ...datos.recepcion, direccion: e.target.value }
                      })}
                      placeholder="Calle, Número, Colonia, Ciudad"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-semibold">Enlace de Compartir Google Maps</label>
                    <input
                      type="text"
                      value={datos.recepcion.maps}
                      onChange={(e) => setDatos({
                        ...datos,
                        recepcion: { ...datos.recepcion, maps: e.target.value }
                      })}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none font-mono"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: ITINERARIO Y CODIGO VESTIMENTA */}
            {panelPestana === "itincode" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* ITINERARIO DINÁMICO */}
                <div>
                  <h3 className="text-sm font-semibold text-indigo-600 mb-3">Cronograma de Eventos Dinámico</h3>
                  
                  {/* Lista de eventos actuales */}
                  <div className="space-y-2 mb-4">
                    {datos.itinerario && datos.itinerario.length > 0 ? (
                      datos.itinerario.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                          <div>
                            <span className="inline-block px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold rounded mr-2">
                              {item.hora} hrs
                            </span>
                            <span className="text-xs font-semibold text-slate-850">{item.evento}</span>
                          </div>
                          <button 
                            onClick={() => handleEliminarItinerario(index)} 
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition overflow-hidden"
                            title="Eliminar evento"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No hay momentos cargados en el itinerario de la fiesta.</p>
                    )}
                  </div>

                  {/* Formulario rápido para añadir evento al itinerario */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Añadir Nuevo Suceso</span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={nuevoItinHora}
                        onChange={(e) => setNuevoItinHora(e.target.value)}
                        placeholder="Hora (Ej. 21:00)"
                        className="col-span-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                      />
                      <input
                        type="text"
                        value={nuevoItinEvento}
                        onChange={(e) => setNuevoItinEvento(e.target.value)}
                        placeholder="Suceso (Ej. Cena de Gala)"
                        className="col-span-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                      />
                    </div>
                    <button
                      onClick={handleAgregarItinerario}
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition text-white cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Añadir al Cronograma
                    </button>
                  </div>
                </div>

                {/* VESTIMENTA Y COLORES SUGERIDOS */}
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="text-sm font-semibold text-indigo-600">Vestimenta y Colores Sugeridos</h3>
                  
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5 font-semibold">Regla o Código para la Invitación</label>
                    <input
                      type="text"
                      value={datos.dressCode}
                      onChange={(e) => setDatos({ ...datos, dressCode: e.target.value })}
                      placeholder="Ej. Gala Formal - Caballeros de Traje, Damas de Vestido Largo"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-indigo-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5 font-semibold">Colores Sugeridos e Inspiración</label>
                    
                    {/* Burbujitas actuales */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {datos.colorSugerido && datos.colorSugerido.length > 0 ? (
                        datos.colorSugerido.map((color, index) => (
                          <div 
                            key={index}
                            className="bg-slate-100 px-2.5 py-1.5 rounded-full border border-slate-200 flex items-center gap-2"
                          >
                            <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: color }}></span>
                            <span className="text-[10px] font-mono font-bold text-slate-700">{color.toUpperCase()}</span>
                            <button 
                              onClick={() => handleEliminarColorSugerido(color)}
                              className="text-slate-400 hover:text-rose-600 text-xs select-none font-bold"
                            >
                              &times;
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">No hay colores sugeridos aún.</p>
                      )}
                    </div>

                    {/* Selector y añadidor */}
                    <div className="flex items-center gap-2 max-w-xs">
                      <input 
                        type="color"
                        value={nuevoColor}
                        onChange={(e) => setNuevoColor(e.target.value)}
                        className="w-10 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <button
                        onClick={handleAgregarColorSugerido}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-white transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        Añadir este color
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: FAMILIA (PADRES Y PADRINOS) */}
            {panelPestana === "familia" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* PADRES */}
                <div>
                  <h3 className="text-sm font-semibold text-indigo-600 mb-3">Padres de la Quinceañera</h3>
                  
                  <div className="space-y-2 mb-4">
                    {datos.padres && datos.padres.length > 0 ? (
                      datos.padres.map((nombre, index) => (
                        <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 shadow-xs">
                          <span className="text-xs text-slate-800 font-medium">{nombre}</span>
                          <button 
                            onClick={() => handleEliminarPadre(index)} 
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition overflow-hidden"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No hay nombres de padres guardados aún.</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nuevoPadre}
                      onChange={(e) => setNuevoPadre(e.target.value)}
                      placeholder="Nombre del Padre o Madre"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                    />
                    <button
                      onClick={handleAgregarPadre}
                      className="px-4 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-lg text-white transition cursor-pointer"
                    >
                      Añadir
                    </button>
                  </div>
                </div>

                {/* PADRINOS */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-semibold text-indigo-600 mb-3">Padrinos de Honor</h3>
                  
                  <div className="space-y-2 mb-4">
                    {datos.padrinos && datos.padrinos.length > 0 ? (
                      datos.padrinos.map((nombre, index) => (
                        <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 shadow-xs">
                          <span className="text-xs text-slate-800 font-medium">{nombre}</span>
                          <button 
                            onClick={() => handleEliminarPadrino(index)} 
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition overflow-hidden"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No hay nombres de padrinos guardados aún.</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nuevoPadrino}
                      onChange={(e) => setNuevoPadrino(e.target.value)}
                      placeholder="Nombre de los Padrinos"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                    />
                    <button
                      onClick={handleAgregarPadrino}
                      className="px-4 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-lg text-white transition cursor-pointer"
                    >
                      Añadir
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 6: MESA DE REGALOS / LLUVIA DE SOBRES / BANCO */}
            {panelPestana === "regalos" && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-semibold text-indigo-600 mb-2">Sección Regalos</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Mesa de Regalos (Liverpool, Amazon, Palacio, etc.)</label>
                  <input
                    type="text"
                    value={datos.mesaRegalos}
                    onChange={(e) => setDatos({ ...datos, mesaRegalos: e.target.value })}
                    placeholder="Ej. Liverpool (No. Evento: 50942851) y Amazon Wishlist"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Datos Bancarios para Transferencia (Lluvia de Sobres)</label>
                  <textarea
                    rows={6}
                    value={datos.datosBancarios}
                    onChange={(e) => setDatos({ ...datos, datosBancarios: e.target.value })}
                    placeholder="Banco: BBVA&#10;Beneficiario: Sophia Valeria Gómez&#10;CLABE: 0121 8001 2345 6789 01"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:border-indigo-600 outline-none leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Este texto se mostrará tal cual está justificado con un botón para que el invitado lo copie en un solo clic.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 7: FOTOS DEL ÁLBUM / GALERÍA */}
            {panelPestana === "fotos" && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-sm font-semibold text-indigo-600 mb-3">Galería de Fotos</h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    Las fotos se organizan según el cupo permitido por el paquete. Puedes subir fotos locales (se insertarán embebidas en formato Base64) o pegar enlaces públicos.
                  </p>

                  {/* Fotos actuales */}
                  <div className="mb-6 space-y-2">
                    <span className="text-[11px] uppercase font-bold text-slate-500 block mb-2">
                      Fotos agregadas ({datos.fotos?.length || 0} de {paquetes[datos.paquete].maxFotos} permitidas):
                    </span>

                    {datos.fotos && datos.fotos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {datos.fotos.map((foto, index) => (
                          <div key={index} className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-3/4 group">
                            <img src={foto} alt="Thumbnail de Galería" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center">
                              <button 
                                onClick={() => handleEliminarFoto(index)}
                                className="p-1.5 bg-rose-600 font-bold hover:bg-rose-700 text-white rounded-full transition overflow-hidden text-xs cursor-pointer"
                                title="Eliminar de mi galería"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-white uppercase">
                              #{index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-500 text-xs">
                        ⚠️ No has subido fotos personalizadas. Se usarán imágenes ficticias súper elegantes diseñadas especialmente para el tema seleccionado.
                      </div>
                    )}
                  </div>

                  {/* CARGAR FOTO / ENLACES */}
                  <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2 font-semibold">Método A: Subir imagen local (Base64 embebido)</span>
                      <label className="flex flex-col items-center justify-center p-3 border border-dashed border-slate-300 bg-white rounded-lg hover:bg-slate-50 cursor-pointer transition">
                        <Upload className="w-5 h-5 text-indigo-600 mb-1" />
                        <span className="text-xs text-slate-650 font-medium">Seleccionar Imagen Solicitada</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLeerFotoLocal} 
                          className="hidden" 
                        />
                      </label>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 font-semibold">Método B: Pegar Enlace Público</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={nuevoFotoUrl}
                          onChange={(e) => setNuevoFotoUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/... o link de Cloudinary"
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs outline-none"
                        />
                        <button
                          onClick={handleAgregarFotoUrl}
                          className="px-4.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                        >
                          Añadir URL
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 8: INVITADOS Y BOLETOS (PASES / DELUXE) */}
            {panelPestana === "invitados" && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-sm font-semibold text-indigo-600 mb-2">Buscador de Pases Personalizados</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Introduce los nombres de las familias para que puedan consultarlo con el buscador interactivo del pase.
                  </p>

                  {/* Formulario nuevo invitado */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4 space-y-3 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Nuevo Invitado / Pase Familiar</span>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={nuevoInvitadoNombre}
                        onChange={(e) => setNuevoInvitadoNombre(e.target.value)}
                        placeholder="Ej. Familia Gómez Mendoza"
                        className="col-span-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                      />
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={nuevoInvitadoPases}
                        onChange={(e) => setNuevoInvitadoPases(parseInt(e.target.value) || 1)}
                        className="col-span-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:border-indigo-600 outline-none"
                      />
                    </div>

                    <button
                      onClick={handleAgregarInvitado}
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition text-white cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Agregar a la Lista de Invitados
                    </button>
                  </div>

                  {/* Listado */}
                  <div className="space-y-2">
                    <span className="text-[11px] uppercase font-bold text-slate-500 block mb-2">
                      Invitados inscritos ({datos.invitados?.length || 0}):
                    </span>

                    {datos.invitados && datos.invitados.length > 0 ? (
                      <div className="max-h-72 overflow-y-auto space-y-1.5 border border-slate-200 rounded-lg p-2 bg-slate-50">
                        {datos.invitados.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-slate-250 hover:bg-slate-100">
                            <div>
                              <span className="text-xs font-semibold text-slate-800">{item.nombre}</span>
                              <span className="ml-2 text-[10px] text-indigo-600 font-extrabold font-mono">({item.pases} pases)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {/* Botón copiar link del invitado */}
                              <button
                                onClick={() => {
                                  const customLink = getShareUrl(index);
                                  navigator.clipboard.writeText(customLink)
                                    .then(() => alert(`¡Enlace de invitación personalizado para "${item.nombre}" copiado al portapapeles! 🌸`))
                                    .catch(err => alert("Error al copiar: " + err));
                                }}
                                className="p-1 hover:bg-slate-50 text-indigo-600 hover:text-indigo-800 rounded transition cursor-pointer"
                                title="Copiar enlace personalizado"
                              >
                                <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                              </button>

                              {/* Botón enviar por WhatsApp */}
                              <button
                                onClick={() => handleEnviarWhatsApp(index)}
                                className="p-1 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 rounded transition cursor-pointer"
                                title="Enviar invitación personalizada directo por WhatsApp"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.714-1.458L0 24zm12.035-2.024c1.801 0 3.559-.483 5.097-1.397l.365-.217 3.793.994-.101-3.693.24-.382c.983-1.566 1.502-3.39 1.501-5.275C22.99 5.8 18.055 1.12c-2.926 0-5.677 1.14-7.747 3.212C2.193 6.405 1.05 9.155 1.05 12.08c0 2.923.77 5.666 2.23 7.728l.243.344-.997 3.642 3.743-.981.36.214a10.932 10.932 0 0 0 5.406 1.413h.001zM17.47 15.3c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                </svg>
                              </button>

                              <button 
                                onClick={() => handleEliminarInvitado(index)}
                                className="p-1 hover:text-rose-600 text-slate-400 rounded transition overflow-hidden cursor-pointer"
                                title="Eliminar invitado"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No hay invitados cargados para pases familiares.</p>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* PIE DE PANEL INFORMAL */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
            <span className="text-[10px] text-slate-500 font-sans font-medium">Generador de Invitaciones de XV Años</span>
            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Acceso Privado</span>
          </div>

        </aside>

        {/* PANEL DERECHO: VISTA PREVIA DEL SMARTPHONE */}
        <section className="flex-1 bg-slate-100 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Fondo sutil degradado */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-3xl rounded-full"></div>
          
          <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
            
            {/* Indicador superior del Simulador */}
            <div className="w-full flex items-center justify-between mb-3.5 px-2">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">Vista Previa Móvil</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse"></span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Sincronizado</span>
              </div>
            </div>

            {/* MARCO VISUAL DEL TELÉFONO */}
            <div className="relative w-full max-w-[375px] h-[720px] bg-slate-950 rounded-[40px] p-3.5 shadow-2xl border-4 border-slate-800 ring-4 ring-slate-200/50 flex flex-col overflow-hidden">
              
              {/* Altavoz y Cámara frontal del Smartphone (Notch) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-950 rounded-b-2xl z-30 flex items-center justify-center gap-1.5">
                <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
              </div>

              {/* CONTENEDOR DEL IFRAME DE SIMULACIÓN */}
              <div className="flex-1 w-full h-full rounded-[26px] overflow-hidden bg-white relative">
                <iframe 
                  ref={iframeRef}
                  title="Live Smartphone Invitation Simulation"
                  className="w-full h-full border-0 select-none"
                  id="preview-iframe"
                />
              </div>

              {/* Botón Home Virtual del Smartphone */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-800 rounded-full z-20"></div>

            </div>

            {/* Aviso breve */}
            <p className="text-[10px] text-slate-500 font-medium text-center mt-3 leading-relaxed px-6">
              La simulación representa cómo se verá el archivo HTML final en Safari y Chrome móvil. Toda animación y recurso multimedia está incluido.
            </p>

          </div>
        </section>

      </div>

    </div>
  );
}
