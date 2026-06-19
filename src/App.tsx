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

export default function App() {
  // Estado principal de los datos de la invitación
  const [datos, setDatos] = useState<InvitacionDatos>({
    ...datosDefault.premium // Empezamos por defecto con Premium para mostrar más secciones
  });

  // Estado del tema seleccionado
  const [selectedTemaId, setSelectedTemaId] = useState<string>("mariposas");

  // Estado para la pestaña de configuración activa en el panel lateral
  const [panelPestana, setPanelPestana] = useState<"ajustes" | "quince" | "lugares" | "itincode" | "familia" | "regalos" | "fotos" | "invitados">("ajustes");

  // Estado para controles de copiado temporal
  const [htmlCopiado, setHtmlCopiado] = useState(false);
  const [datosCopiados, setDatosCopiados] = useState(false);

  // Estados para compartir por WhatsApp
  const [whatsappDestino, setWhatsappDestino] = useState("522217445410");
  const [whatsappTemplateId, setWhatsappTemplateId] = useState("completo");

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
  };

  // Escucha cambios en datos o tema para refrescar la visualización
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

  // Compartir datos de la invitación final por WhatsApp
  const handleEnviarWhatsApp = () => {
    const urlFinal = "https://ais-pre-gt7763na7jvvj2sv6undpi-53430969538.us-west2.run.app";
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

    let msg = "";
    if (whatsappTemplateId === "link-only") {
      msg = `¡Hola! Te comparto el enlace final del Generador de Invitaciones de XV Años para personalizar la tuya: ${urlFinal}`;
    } else {
      msg = `¡Hola! Ya está lista la propuesta de invitación digital de XV Años para *${nombreQuince}*. 🌸✨\n\n📅 *Fecha:* ${fechaBonita}\n💒 *Misa:* ${datos.ceremonia.lugar || "Sin especificar"} (${datos.ceremonia.hora || "Sin especificar"} hrs)\n🎉 *Recepción:* ${datos.recepcion.lugar || "Sin especificar"} (${datos.recepcion.hora || "Sin especificar"} hrs)\n\n👉 Puedes ver la vista previa del diseño responsivo en tiempo real interactivo ingresando a este enlace:\n${urlFinal}`;
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
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            title="Refrescar Vista Previa Celular"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Generar</span>
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
                      const isDarkTheme = t.id === "celestial" || t.id === "princesa-elegante";
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
                </div>

                {/* COMPARTIR POR WHATSAPP */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
                    3. Compartir por WhatsApp (Envío Directo)
                  </h3>
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Comparte el link para ver y editar esta invitación directamente en WhatsApp.
                    </p>
                    
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
                            <button 
                              onClick={() => handleEliminarInvitado(index)}
                              className="p-1 hover:text-rose-600 text-slate-400 rounded transition overflow-hidden cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            </button>
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
