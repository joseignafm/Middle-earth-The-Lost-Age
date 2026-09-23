/* =========================================================
   MIDDLE-EARTH: THE LOST AGE — Catálogo de productos
   Arreglo de productos y renderizado de la grilla.
   Sin backend: los datos viven en este arreglo.
   ========================================================= */

/* PRODUCTOS — la unica "base de datos" del sitio.
   12 objetos escritos a mano. Lo leen: la grilla del mercado,
   la ficha de detalle, el carrito (para saber el precio) y la
   tabla de admin/productos.html. Es UNA sola fuente: editar un
   precio aqui lo cambia en las cuatro vistas a la vez.

   Campos de cada objeto:
     id            numero unico; es el ?id=N de la URL de la ficha
     codigo        codigo interno que se muestra en el panel
     tipo          ARMA | ARMADURA | ESCUDO | ACCESORIO | POCION | PODER | MEJORA
                   (son los data-valor de los filtros de productos.html)
     rareza        COMUN | INUSUAL | RARO | EPICO | LEGENDARIO
     precio        entero, en oro
     stock         numero, o null = sin limite (se muestra como infinito)
     bonos         objeto con fuerza/destreza/sabiduria/vitalidad */
const PRODUCTOS = [
  {
    id: 1,
    codigo: 'ARM-LEG-001',
    nombre: 'Filo de Elbereth',
    tipo: 'ARMA',
    rareza: 'LEGENDARIO',
    precio: 48500,
    nivelMinimo: 42,
    razaRequerida: 'Élfico',
    peso: 6,
    stock: 3,
    descripcion: 'Forjada bajo la luz de la primera estrella, esta espada élfica canta en presencia de la oscuridad.',
    bonos: { fuerza: 18, destreza: 24, sabiduria: 6, vitalidad: 0 }
  },
  {
    id: 2,
    codigo: 'ESC-EPI-014',
    nombre: 'Escudo de Roble Ancestral',
    tipo: 'ESCUDO',
    rareza: 'EPICO',
    precio: 11200,
    nivelMinimo: 28,
    razaRequerida: 'Enano',
    peso: 12,
    stock: 8,
    descripcion: 'Tallado de un roble que sobrevivió tres eras. La madera recuerda cada golpe que ha detenido.',
    bonos: { fuerza: 4, destreza: 0, sabiduria: 0, vitalidad: 22 }
  },
  {
    id: 3,
    codigo: 'POC-RAR-007',
    nombre: 'Aliento de los Valar',
    tipo: 'POCION',
    rareza: 'RARO',
    precio: 2850,
    nivelMinimo: 1,
    razaRequerida: 'Ninguna',
    peso: 1,
    stock: null,
    descripcion: 'El único objeto capaz de devolver la vida a un héroe caído. Se consume al usarse.',
    bonos: { fuerza: 0, destreza: 0, sabiduria: 0, vitalidad: 0 },
    objetoClave: true
  },
  {
    id: 4,
    codigo: 'ACC-INU-032',
    nombre: 'Anillo del Viajero',
    tipo: 'ACCESORIO',
    rareza: 'INUSUAL',
    precio: 620,
    nivelMinimo: 10,
    razaRequerida: 'Ninguna',
    peso: 1,
    stock: null,
    descripcion: 'Un aro sencillo que alivia el peso del camino. Los mercaderes de ruta nunca salen sin uno.',
    bonos: { fuerza: 0, destreza: 6, sabiduria: 3, vitalidad: 2 }
  },
  {
    id: 5,
    codigo: 'ARM-COM-101',
    nombre: 'Botas de Cuero Curtido',
    tipo: 'ARMADURA',
    rareza: 'COMUN',
    precio: 90,
    nivelMinimo: 3,
    razaRequerida: 'Ninguna',
    peso: 3,
    stock: null,
    descripcion: 'Cuero honesto, suela gruesa. No impresionan a nadie, pero llegan a destino.',
    bonos: { fuerza: 0, destreza: 2, sabiduria: 0, vitalidad: 1 }
  },
  {
    id: 6,
    codigo: 'POD-RAR-021',
    nombre: 'Furia del Istari',
    tipo: 'PODER',
    rareza: 'RARO',
    precio: 8400,
    nivelMinimo: 25,
    razaRequerida: 'Istari',
    peso: 0,
    stock: null,
    descripcion: 'Aprende este poder antes de alcanzar el nivel que normalmente lo desbloquea.',
    bonos: { fuerza: 0, destreza: 0, sabiduria: 0, vitalidad: 0 }
  },
  {
    id: 7,
    codigo: 'MEJ-EPI-002',
    nombre: 'Ampliación de Inventario',
    tipo: 'MEJORA',
    rareza: 'EPICO',
    precio: 3200,
    nivelMinimo: 1,
    razaRequerida: 'Ninguna',
    peso: 0,
    stock: null,
    descripcion: 'Aumenta la capacidad de carga de tu héroe. Cada ampliación cuesta más que la anterior.',
    bonos: { fuerza: 0, destreza: 0, sabiduria: 0, vitalidad: 0 }
  },
  {
    id: 8,
    codigo: 'ARM-COM-054',
    nombre: 'Hacha de Guerra Orca',
    tipo: 'ARMA',
    rareza: 'COMUN',
    precio: 140,
    nivelMinimo: 6,
    razaRequerida: 'Orco',
    peso: 9,
    stock: null,
    descripcion: 'Pesada, tosca y sin gracia. Cumple exactamente con lo que promete.',
    bonos: { fuerza: 9, destreza: 0, sabiduria: 0, vitalidad: 0 }
  },
  {
    id: 9,
    codigo: 'ARM-RAR-076',
    nombre: 'Cota de Mithril',
    tipo: 'ARMADURA',
    rareza: 'RARO',
    precio: 9600,
    nivelMinimo: 22,
    razaRequerida: 'Ninguna',
    peso: 4,
    stock: null,
    descripcion: 'Ligera como el lino, dura como el acero de los enanos. Vale más que una aldea entera.',
    bonos: { fuerza: 0, destreza: 5, sabiduria: 0, vitalidad: 18 }
  },
  {
    id: 10,
    codigo: 'ACC-LEG-003',
    nombre: 'Amuleto de la Estrella Vespertina',
    tipo: 'ACCESORIO',
    rareza: 'LEGENDARIO',
    precio: 52000,
    nivelMinimo: 50,
    razaRequerida: 'Élfico',
    peso: 1,
    stock: 2,
    descripcion: 'Guarda una chispa de luz que no se apaga ni en la más profunda mazmorra.',
    bonos: { fuerza: 0, destreza: 8, sabiduria: 26, vitalidad: 10 }
  },
  {
    id: 11,
    codigo: 'POD-INU-009',
    nombre: 'Canto de Reposo',
    tipo: 'PODER',
    rareza: 'INUSUAL',
    precio: 540,
    nivelMinimo: 8,
    razaRequerida: 'Ninguna',
    peso: 0,
    stock: null,
    descripcion: 'Un poder de curación básico, al alcance de cualquier linaje.',
    bonos: { fuerza: 0, destreza: 0, sabiduria: 0, vitalidad: 0 }
  },
  {
    id: 12,
    codigo: 'MEJ-EPI-005',
    nombre: 'Ampliación de Poderes',
    tipo: 'MEJORA',
    rareza: 'EPICO',
    precio: 4100,
    nivelMinimo: 1,
    razaRequerida: 'Ninguna',
    peso: 0,
    stock: null,
    descripcion: 'Permite a tu héroe tener un poder aprendido más de forma simultánea.',
    bonos: { fuerza: 0, destreza: 0, sabiduria: 0, vitalidad: 0 }
  }
];

/* Utilidades compartidas ---------------------------------- */

/* formatearOro(valor) -> texto
   Separa los miles al estilo chileno: 48500 -> "48.500".
   La usan la grilla, la ficha, el carrito y la tabla del panel. */
function formatearOro(valor){
  return valor.toLocaleString('es-CL');
}

/* claseRareza(rareza) -> "var(--r-xxx)"
   Traduce el dato interno (EPICO) al nombre de la variable CSS del color.
   El resultado se inyecta INLINE en el HTML como style="--rareza:...",
   y styles.css lo usa para el borde y el acento de la tarjeta.
   Si la rareza no existe en el mapa, devuelve el color comun. */
function claseRareza(rareza){
  const mapa = {
    COMUN: 'var(--r-comun)',
    INUSUAL: 'var(--r-inusual)',
    RARO: 'var(--r-raro)',
    EPICO: 'var(--r-epico)',
    LEGENDARIO: 'var(--r-legendario)'
  };
  return mapa[rareza] || 'var(--r-comun)';
}

/* Nombre legible de cada rareza: el dato interno sigue
   siendo COMUN, EPICO, etc.                                  */
const NOMBRE_RAREZA = {
  COMUN: 'Común', INUSUAL: 'Inusual', RARO: 'Raro',
  EPICO: 'Épico', LEGENDARIO: 'Legendario'
};

/* nombreRareza(r) -> texto legible
   EPICO -> "Epico". El dato interno nunca cambia; esto es solo la etiqueta
   que ve el usuario. */
function nombreRareza(r){
  return NOMBRE_RAREZA[r] || r;
}

/* Marca tipográfica del objeto: la inicial de su nombre.
   Sustituye a los iconos que usábamos antes.                 */
function inicialObjeto(p){
  return p.nombre.trim().charAt(0).toUpperCase();
}

/* buscarProducto(id) -> objeto de PRODUCTOS, o undefined
   Number(id) porque el id que llega de la URL es texto ("3" !== 3).
   La usan: detalle-producto.html, admin/producto-editar.html y
   carrito.js (para conocer precio y nombre de cada linea guardada). */
function buscarProducto(id){
  return PRODUCTOS.find(p => p.id === Number(id));
}

/* Renderizado de la grilla -------------------------------- */

/* plantillaProducto(p) -> texto HTML de UNA tarjeta
   Devuelve el HTML como string; no lo inserta. Quien lo inserta es
   renderProductos(). Cambiar como se ve una tarjeta del mercado se hace
   AQUI, no en productos.html: ese archivo solo tiene el contenedor vacio.
   La tarjeta incluye el boton .add-btn con data-id, que renderProductos()
   usa despues para enganchar el click. */
function plantillaProducto(p){
  const extra = p.tipo === 'PODER' ? ' · Poder'
              : p.tipo === 'MEJORA' ? ' · Mejora' : '';
  return `
    <div class="col">
      <article class="item-card h-100" style="--rareza:${claseRareza(p.rareza)}">
        <div class="item-thumb"><span>${inicialObjeto(p)}</span></div>
        <span class="item-rareza">${nombreRareza(p.rareza)}${extra}</span>
        <a href="detalle-producto.html?id=${p.id}">
          <h3 class="item-name">${p.nombre}</h3>
        </a>
        <div class="item-meta">
          <span>${p.nivelMinimo > 1 ? 'Nivel ' + p.nivelMinimo : 'Sin nivel'}</span>
          <span>${p.razaRequerida}</span>
        </div>
        <div class="item-price"><span class="coin"></span> ${formatearOro(p.precio)}</div>
        <button class="btn btn-linea btn-sm add-btn" data-id="${p.id}">Añadir al carrito</button>
      </article>
    </div>
  `;
}

/* renderProductos(lista, contenedorId)
     lista         arreglo YA filtrado de productos (esta funcion no filtra)
     contenedorId  id del elemento donde pintar
   Pinta las tarjetas y, recien despues de insertarlas, engancha el click de
   cada .add-btn -> agregarAlCarrito(id, 1). El orden importa: antes del
   innerHTML esos botones todavia no existen en el DOM.
   Si la lista viene vacia, limpia el contenedor y muestra #sin-resultados.
   La llaman: el inline de productos.html (aplicarFiltros). */
function renderProductos(lista, contenedorId){
  const cont = document.getElementById(contenedorId);
  if (!cont) return;

  if (lista.length === 0){
    cont.innerHTML = '';
    const vacio = document.getElementById('sin-resultados');
    if (vacio) vacio.style.display = 'block';
    return;
  }

  const vacio = document.getElementById('sin-resultados');
  if (vacio) vacio.style.display = 'none';

  cont.innerHTML = lista.map(plantillaProducto).join('');

  cont.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      agregarAlCarrito(Number(btn.dataset.id), 1);
      const texto = btn.textContent;
      btn.textContent = 'Añadido';
      setTimeout(() => { btn.textContent = texto; }, 900);
    });
  });
}
