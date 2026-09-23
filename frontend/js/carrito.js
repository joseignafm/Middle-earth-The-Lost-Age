/* =========================================================
   MIDDLE-EARTH: THE LOST AGE — Carrito de compras
   Persiste en localStorage para mantenerse entre páginas.
   ========================================================= */

/* CLAVE_CARRITO — nombre de la entrada de localStorage.
   Cambiarlo "vacia" el carrito de todos los usuarios que ya tenian uno
   guardado, porque el carrito viejo queda bajo la clave anterior. */
const CLAVE_CARRITO = 'middle_earth_carrito';
/* CUPONES — codigo -> descuento en tanto por uno (0.10 = 10%).
   Agregar un cupon es agregar una linea aqui; no hay que tocar el HTML. */
const CUPONES = {
  'MITHRIL10': 0.10,
  'VALAR20': 0.20
};

/* Lectura y escritura ------------------------------------- */

/* leerCarrito() -> [{id, cantidad}, ...]
   Lee localStorage y lo convierte de texto a arreglo. El try/catch cubre
   dos casos reales: el navegador en modo privado puede bloquear localStorage,
   y un JSON corrupto reventaria toda la pagina. En ambos devuelve []. */
function leerCarrito(){
  try {
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
  } catch (e) {
    console.warn('No se pudo leer el carrito:', e);
    return [];
  }
}

/* guardarCarrito(carrito)
   Guarda y SIEMPRE actualiza el contador del header. Por eso todas las
   operaciones (agregar, cambiar, quitar, vaciar) pasan por aqui: el
   contador nunca se queda desincronizado. */
function guardarCarrito(carrito){
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch (e) {
    console.warn('No se pudo guardar el carrito:', e);
  }
  actualizarContador();
}

/* Operaciones --------------------------------------------- */

/* agregarAlCarrito(idProducto, cantidad)
   Si el producto ya estaba en el carrito suma la cantidad; si no, crea la
   linea. Solo guarda id y cantidad: el precio y el nombre se leen de
   PRODUCTOS cada vez, asi un cambio de precio se refleja de inmediato.
   La llaman: las tarjetas del mercado y el boton de la ficha de detalle. */
function agregarAlCarrito(idProducto, cantidad){
  const producto = buscarProducto(idProducto);
  if (!producto) return;

  const carrito = leerCarrito();
  const existente = carrito.find(l => l.id === idProducto);

  if (existente){
    existente.cantidad += cantidad;
  } else {
    carrito.push({ id: idProducto, cantidad: cantidad });
  }

  guardarCarrito(carrito);
}

/* cambiarCantidadCarrito(idProducto, nuevaCantidad)
   Math.max(1, ...) evita cantidades 0 o negativas: bajar de 1 no borra la
   linea, se queda en 1. Para quitarla esta quitarDelCarrito(). */
function cambiarCantidadCarrito(idProducto, nuevaCantidad){
  const carrito = leerCarrito();
  const linea = carrito.find(l => l.id === idProducto);
  if (!linea) return;

  linea.cantidad = Math.max(1, nuevaCantidad);
  guardarCarrito(carrito);
  renderCarrito();
}

/* quitarDelCarrito(idProducto) — saca la linea entera del carrito. */
function quitarDelCarrito(idProducto){
  const carrito = leerCarrito().filter(l => l.id !== idProducto);
  guardarCarrito(carrito);
  renderCarrito();
}

/* vaciarCarrito() — guarda un arreglo vacio. Lo llama #btn-vaciar. */
function vaciarCarrito(){
  guardarCarrito([]);
  renderCarrito();
}

/* Cálculos ------------------------------------------------ */

/* totalUnidades() -> numero
   Suma de cantidades, no de lineas: 3 pociones cuentan 3, no 1.
   Es lo que muestra el .cart-count del header. */
function totalUnidades(){
  return leerCarrito().reduce((suma, l) => suma + l.cantidad, 0);
}

/* subtotalCarrito() -> numero
   precio x cantidad de cada linea. Si un producto guardado ya no existe en
   PRODUCTOS, lo ignora en vez de romper la suma. */
function subtotalCarrito(){
  return leerCarrito().reduce((suma, l) => {
    const p = buscarProducto(l.id);
    return p ? suma + (p.precio * l.cantidad) : suma;
  }, 0);
}

/* Contador del header ------------------------------------- */

/* actualizarContador()
   querySelectorAll('.cart-count') y no getElementById porque .cart-count es
   una CLASE que aparece en el header de todas las paginas publicas.
   Se ejecuta en cualquier pagina que cargue carrito.js. */
function actualizarContador(){
  const nodos = document.querySelectorAll('.cart-count');
  const total = totalUnidades();
  nodos.forEach(n => { n.textContent = total; });
}

/* Renderizado de la página del carrito -------------------- */

/* descuentoAplicado — el descuento vigente (0 = ninguno).
   NO se guarda en localStorage: se pierde al recargar o cambiar de pagina.
   Es a proposito, para que el cupon se vuelva a escribir cada vez. */
let descuentoAplicado = 0;

/* renderCarrito()
   Repinta TODAS las lineas de #cart-lines de cero en cada cambio.
   Si #cart-lines no existe (o sea, no estamos en carrito.html) sale de
   inmediato: por eso carrito.js se puede cargar en cualquier pagina.
   Los botones de cada linea no tienen id (se repiten), se identifican por
   data-accion="mas|menos|quitar" + data-id. Los listeners se vuelven a
   enganchar en cada render porque el innerHTML destruye los anteriores.
   Termina llamando a renderResumen(). */
function renderCarrito(){
  const cont = document.getElementById('cart-lines');
  if (!cont) return;

  const carrito = leerCarrito();
  const vacio = document.getElementById('carrito-vacio');
  const resumen = document.getElementById('cart-summary');

  if (carrito.length === 0){
    cont.innerHTML = '';
    if (vacio) vacio.style.display = 'block';
    if (resumen) resumen.style.display = 'none';
    return;
  }

  if (vacio) vacio.style.display = 'none';
  if (resumen) resumen.style.display = 'block';

  cont.innerHTML = carrito.map(linea => {
    const p = buscarProducto(linea.id);
    if (!p) return '';
    const totalLinea = p.precio * linea.cantidad;
    return `
      <div class="cart-line row g-3 align-items-center">
        <div class="col-auto">
          <div class="thumb"><span>${inicialObjeto(p)}</span></div>
        </div>
        <div class="col">
          <h3>${p.nombre}</h3>
          <div class="sub">${nombreRareza(p.rareza)} · ${p.codigo}</div>
        </div>
        <div class="col-auto">
          <div class="qty">
            <button data-accion="menos" data-id="${p.id}" aria-label="Quitar uno">−</button>
            <input type="text" value="${linea.cantidad}" readonly aria-label="Cantidad">
            <button data-accion="mas" data-id="${p.id}" aria-label="Añadir uno">+</button>
          </div>
        </div>
        <div class="col-auto">
          <div class="line-total">${formatearOro(totalLinea)}</div>
        </div>
        <div class="col-auto">
          <button class="remove-btn" data-accion="quitar" data-id="${p.id}" title="Quitar" aria-label="Quitar del carrito">×</button>
        </div>
      </div>
    `;
  }).join('');

  cont.querySelectorAll('button[data-accion]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const actual = leerCarrito().find(l => l.id === id);
      if (!actual) return;

      if (btn.dataset.accion === 'mas')   cambiarCantidadCarrito(id, actual.cantidad + 1);
      if (btn.dataset.accion === 'menos') cambiarCantidadCarrito(id, actual.cantidad - 1);
      if (btn.dataset.accion === 'quitar') quitarDelCarrito(id);
    });
  });

  renderResumen();
}

/* renderResumen() — escribe subtotal, descuento y total.
   La fila del descuento (#fila-descuento) solo se muestra si hay descuento.
   Math.round evita mostrar centavos en una moneda que no los tiene. */
function renderResumen(){
  const sub = subtotalCarrito();
  const desc = Math.round(sub * descuentoAplicado);
  const total = sub - desc;

  const elSub = document.getElementById('sum-subtotal');
  const elDesc = document.getElementById('sum-descuento');
  const elTotal = document.getElementById('sum-total');
  const filaDesc = document.getElementById('fila-descuento');

  if (elSub) elSub.textContent = formatearOro(sub);
  if (elTotal) elTotal.textContent = formatearOro(total);
  if (elDesc) elDesc.textContent = '−' + formatearOro(desc);
  if (filaDesc) filaDesc.style.display = desc > 0 ? 'flex' : 'none';
}

/* aplicarCupon() — lee #cupon, lo normaliza (sin espacios, en mayusculas)
   y lo busca en CUPONES. Escribe el resultado en #cupon-msg y recalcula el
   resumen. Un cupon invalido pone el descuento en 0, no deja el anterior. */
function aplicarCupon(){
  const input = document.getElementById('cupon');
  const aviso = document.getElementById('cupon-msg');
  if (!input) return;

  const codigo = input.value.trim().toUpperCase();

  if (codigo === ''){
    aviso.textContent = 'Ingresa un código de cupón.';
    aviso.className = 'error-msg';
    return;
  }

  if (CUPONES[codigo] !== undefined){
    descuentoAplicado = CUPONES[codigo];
    aviso.textContent = 'Cupón aplicado: ' + (descuentoAplicado * 100) + '% de descuento.';
    aviso.style.color = 'var(--verde-claro)';
  } else {
    descuentoAplicado = 0;
    aviso.textContent = 'Ese cupón no existe en el reino.';
    aviso.style.color = 'var(--rojo-claro)';
  }

  renderResumen();
}

/* Inicio -------------------------------------------------- */

/* ARRANQUE. Corre en toda pagina que cargue carrito.js:
   - actualizarContador() siempre (el header existe en todas)
   - renderCarrito() sale solo si no hay #cart-lines
   - los botones se enganchan solo si existen (if (btnX))
   Ese patron de "comprobar antes de usar" es lo que permite tener un unico
   carrito.js compartido, sin preguntar en que pagina estamos. */
document.addEventListener('DOMContentLoaded', () => {
  actualizarContador();
  renderCarrito();

  const btnCupon = document.getElementById('btn-cupon');
  if (btnCupon) btnCupon.addEventListener('click', aplicarCupon);

  const btnVaciar = document.getElementById('btn-vaciar');
  if (btnVaciar) btnVaciar.addEventListener('click', vaciarCarrito);

  const btnPagar = document.getElementById('btn-pagar');
  if (btnPagar) btnPagar.addEventListener('click', () => {
    if (leerCarrito().length === 0) return;
    alert('El pago se implementa en una etapa posterior del proyecto.');
  });
});
