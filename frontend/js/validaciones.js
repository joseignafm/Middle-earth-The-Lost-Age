/* =========================================================
   MIDDLE-EARTH: THE LOST AGE — Validación de formularios
   Reglas de negocio del anexo, validadas en tiempo real.
   ========================================================= */

/* DOMINIOS_PERMITIDOS — unica lista de correos aceptados de todo el sitio.
   La usa validarCorreo() en login, contacto, registro y el panel.
   Agregar un dominio se hace SOLO aqui; los <span class="hint"> del HTML
   que lo mencionan hay que actualizarlos a mano (no se generan). */
const DOMINIOS_PERMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

/* ---------------------------------------------------------
   Utilidades de presentación
   --------------------------------------------------------- */

/* marcarError(input, mensaje) -> SIEMPRE false
   Pone .invalid al campo (el CSS lo pinta rojo) y escribe el mensaje en
   el <span> de error. Ese <span> lo encuentra armando el id como
   'err-' + input.id. ESA ES LA CONVENCION CLAVE del proyecto: si un campo
   es id="correo", su mensaje debe estar en id="err-correo".
   Devuelve false para poder escribir: return marcarError(...) */
function marcarError(input, mensaje){
  input.classList.add('invalid');
  input.classList.remove('valid');
  const cont = document.getElementById('err-' + input.id);
  if (cont) cont.textContent = mensaje;
  return false;
}

/* marcarValido(input) -> SIEMPRE true
   El espejo de marcarError: quita .invalid, pone .valid y borra el mensaje.
   Devolver true/false es lo que permite juntar todas las validaciones
   en un arreglo y resolverlo con .every(Boolean). */
function marcarValido(input){
  input.classList.remove('invalid');
  input.classList.add('valid');
  const cont = document.getElementById('err-' + input.id);
  if (cont) cont.textContent = '';
  return true;
}

/* mostrarAlerta(idAlerta, mensaje, tipo)
     tipo: 'ok' (verde) o 'bad' (rojo)
   Reescribe className entero a 'form-alert ok|bad', asi el estado anterior
   se borra solo. Todas las paginas con formulario tienen su
   <div class="form-alert" id="alerta"> justo encima del <form>. */
function mostrarAlerta(idAlerta, mensaje, tipo){
  const alerta = document.getElementById(idAlerta);
  if (!alerta) return;
  alerta.textContent = mensaje;
  alerta.className = 'form-alert ' + tipo;
}

/* ---------------------------------------------------------
   Validadores individuales
   --------------------------------------------------------- */

/* validarCorreo(input, obligatorio) -> true/false
   obligatorio=false (contacto.html): vacio se considera VALIDO.
   obligatorio=true  (login, registro, panel): vacio es error.
   Orden de las reglas: vacio -> largo -> tiene @ -> dominio permitido.
   La comparacion de dominio es en minusculas, asi DUOC.CL tambien pasa. */
function validarCorreo(input, obligatorio){
  const valor = input.value.trim();

  if (valor === ''){
    return obligatorio
      ? marcarError(input, 'El correo es obligatorio.')
      : marcarValido(input);
  }
  if (valor.length > 100){
    return marcarError(input, 'El correo no puede superar los 100 caracteres.');
  }
  if (!valor.includes('@') || valor.indexOf('@') === 0){
    return marcarError(input, 'Escribe un correo válido, por ejemplo nombre@duoc.cl');
  }

  const dominioOk = DOMINIOS_PERMITIDOS.some(d => valor.toLowerCase().endsWith(d));
  if (!dominioOk){
    return marcarError(input, 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl y @gmail.com');
  }

  return marcarValido(input);
}

/* validarPassword(input) -> true/false
   Obligatoria, entre 4 y 10 caracteres. NO usa .trim(): un espacio es un
   caracter valido dentro de una contrasena. */
function validarPassword(input){
  const valor = input.value;

  if (valor === '')       return marcarError(input, 'La contraseña es obligatoria.');
  if (valor.length < 4)   return marcarError(input, 'La contraseña debe tener al menos 4 caracteres.');
  if (valor.length > 10)  return marcarError(input, 'La contraseña no puede superar los 10 caracteres.');

  return marcarValido(input);
}

/* validarConfirmacion(input, inputOriginal) -> true/false
   Compara la repeticion contra la contrasena original. Solo se usa en
   registro.html; el panel no pide confirmar. */
function validarConfirmacion(input, inputOriginal){
  if (input.value === '')                 return marcarError(input, 'Confirma la contraseña.');
  if (input.value !== inputOriginal.value) return marcarError(input, 'Las contraseñas no coinciden.');
  return marcarValido(input);
}

/* validarTexto(input, obligatorio, max, etiqueta, min) -> true/false
     etiqueta  texto con que empieza el mensaje: "El nombre es obligatorio."
     min       opcional; solo el codigo de producto lo usa (minimo 3)
   Es el validador generico: nombre, apellidos, direccion, descripcion,
   comentario y codigo pasan todos por aqui con distintos parametros. */
function validarTexto(input, obligatorio, max, etiqueta, min){
  const valor = input.value.trim();

  if (valor === ''){
    return obligatorio
      ? marcarError(input, etiqueta + ' es obligatorio.')
      : marcarValido(input);
  }
  if (min && valor.length < min){
    return marcarError(input, etiqueta + ' debe tener al menos ' + min + ' caracteres.');
  }
  if (valor.length > max){
    return marcarError(input, etiqueta + ' no puede superar los ' + max + ' caracteres.');
  }

  return marcarValido(input);
}

/* RUN chileno: sin puntos ni guion, entre 7 y 9 caracteres.
   Se valida además el dígito verificador con módulo 11. */
/* validarRun(input) -> true/false
   RUN chileno SIN puntos ni guion, entre 7 y 9 caracteres.
   Separa cuerpo (todo menos el ultimo caracter) y digito verificador
   (el ultimo), comprueba que el cuerpo sea solo numeros y que el dv sea
   un numero o K, y por ultimo verifica el dv con calcularDv().
   Esa ultima comprobacion es la estricta: un RUN con formato correcto
   pero dv equivocado se rechaza. RUN de ejemplo valido: 190110222. */
function validarRun(input){
  const valor = input.value.trim().toUpperCase();

  if (valor === '') return marcarError(input, 'El RUN es obligatorio.');

  if (valor.includes('.') || valor.includes('-')){
    return marcarError(input, 'Escribe el RUN sin puntos ni guion. Ejemplo: 19011022K');
  }
  if (valor.length < 7)  return marcarError(input, 'El RUN debe tener al menos 7 caracteres.');
  if (valor.length > 9)  return marcarError(input, 'El RUN no puede superar los 9 caracteres.');

  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1);

  if (!/^\d+$/.test(cuerpo)){
    return marcarError(input, 'El cuerpo del RUN debe contener solo números.');
  }
  if (!/^[0-9K]$/.test(dv)){
    return marcarError(input, 'El dígito verificador debe ser un número o la letra K.');
  }

  if (calcularDv(cuerpo) !== dv){
    return marcarError(input, 'El RUN no es válido. Revisa el dígito verificador.');
  }

  return marcarValido(input);
}

/* calcularDv(cuerpo) -> '0'..'9' o 'K'   (algoritmo modulo 11)
   Recorre el cuerpo de DERECHA a IZQUIERDA multiplicando por la serie
   2,3,4,5,6,7 y volviendo a 2 (por eso el multiplicador === 7 ? 2 : +1).
   Suma todo, calcula 11 - (suma % 11) y traduce los dos casos especiales:
   11 -> '0' y 10 -> 'K'. Es el mismo algoritmo oficial del Registro Civil. */
function calcularDv(cuerpo){
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--){
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
}

/* validarSelect(input, etiqueta) -> true/false
   Un <select> esta "vacio" cuando su value es '': ese es el valor del
   <option> de placeholder ("-- Selecciona ... --"). Por eso todos los
   selects obligatorios del proyecto llevan esa primera opcion. */
function validarSelect(input, etiqueta){
  if (input.value === '') return marcarError(input, 'Selecciona ' + etiqueta + '.');
  return marcarValido(input);
}

/* validarNumero(input, obligatorio, min, soloEnteros, etiqueta) -> true/false
   precio: soloEnteros=false (admite decimales), min=0 (0 es valido: gratis).
   stock y stock critico: soloEnteros=true.
   Number('') es 0, por eso el caso vacio se resuelve ANTES de convertir. */
function validarNumero(input, obligatorio, min, soloEnteros, etiqueta){
  const valor = input.value.trim();

  if (valor === ''){
    return obligatorio
      ? marcarError(input, etiqueta + ' es obligatorio.')
      : marcarValido(input);
  }

  const numero = Number(valor);

  if (isNaN(numero))        return marcarError(input, etiqueta + ' debe ser un número.');
  if (numero < min)         return marcarError(input, etiqueta + ' no puede ser menor que ' + min + '.');
  if (soloEnteros && !Number.isInteger(numero)){
    return marcarError(input, etiqueta + ' debe ser un número entero.');
  }

  return marcarValido(input);
}

/* ---------------------------------------------------------
   Enganche de validación en tiempo real
   --------------------------------------------------------- */

/* enTiempoReal(input, funcionValidadora)
   El corazon de la validacion "en vivo", con dos comportamientos distintos:
     blur  (al salir del campo)  -> valida SIEMPRE
     input (mientras se escribe) -> revalida SOLO si el campo ya esta .invalid
   Ese segundo caso es lo que evita marcar error a alguien que recien
   empezo a escribir, pero si le borra el error apenas lo corrige.
   El if (!input) return permite llamarla con campos que no existen en
   esa pagina sin tener que preguntar antes. */
function enTiempoReal(input, funcionValidadora){
  if (!input) return;
  input.addEventListener('blur', funcionValidadora);
  input.addEventListener('input', () => {
    if (input.classList.contains('invalid')) funcionValidadora();
  });
}

/* ---------------------------------------------------------
   FORMULARIO: Inicio de sesión
   --------------------------------------------------------- */

/* iniciarFormLogin() — formulario #form-login (login.html)
   Si #form-login no esta en la pagina, sale sin hacer nada. Ese patron se
   repite en las cuatro funciones iniciarFormX() y es lo que permite cargar
   un unico validaciones.js en todas las paginas.
   Campos: #correo (obligatorio) y #password.
   e.preventDefault() impide que el formulario se envie y recargue: no hay
   servidor a donde mandarlo. Si todo valida, limpia el form y le saca la
   clase .valid a los campos para que no queden en verde estando vacios. */
function iniciarFormLogin(){
  const form = document.getElementById('form-login');
  if (!form) return;

  const correo = document.getElementById('correo');
  const pass   = document.getElementById('password');

  enTiempoReal(correo, () => validarCorreo(correo, true));
  enTiempoReal(pass,   () => validarPassword(pass));

  form.addEventListener('submit', e => {
    e.preventDefault();

    const ok = [
      validarCorreo(correo, true),
      validarPassword(pass)
    ].every(Boolean);

    if (ok){
      mostrarAlerta('alerta', 'Sesión iniciada. Bienvenido de vuelta al reino.', 'ok');
      form.reset();
      form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
    } else {
      mostrarAlerta('alerta', 'Revisa los campos marcados antes de continuar.', 'bad');
    }
  });
}

/* ---------------------------------------------------------
   FORMULARIO: Contacto
   --------------------------------------------------------- */

/* iniciarFormContacto() — formulario #form-contacto (contacto.html)
   Campos: #nombre (obligatorio), #correo (OPCIONAL) y #comentario.
   Ademas de validar, monta el contador de caracteres de #contador-comentario
   con su propio listener de 'input'. Al enviar con exito lo resetea a
   "0 / 500 caracteres" a mano, porque form.reset() vacia el textarea pero
   no vuelve a disparar el evento input. */
function iniciarFormContacto(){
  const form = document.getElementById('form-contacto');
  if (!form) return;

  const nombre     = document.getElementById('nombre');
  const correo     = document.getElementById('correo');
  const comentario = document.getElementById('comentario');

  enTiempoReal(nombre,     () => validarTexto(nombre, true, 100, 'El nombre'));
  enTiempoReal(correo,     () => validarCorreo(correo, false));
  enTiempoReal(comentario, () => validarTexto(comentario, true, 500, 'El comentario'));

  if (comentario){
    const contador = document.getElementById('contador-comentario');
    comentario.addEventListener('input', () => {
      if (contador) contador.textContent = comentario.value.length + ' / 500 caracteres';
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const ok = [
      validarTexto(nombre, true, 100, 'El nombre'),
      validarCorreo(correo, false),
      validarTexto(comentario, true, 500, 'El comentario')
    ].every(Boolean);

    if (ok){
      mostrarAlerta('alerta', 'Mensaje enviado. Un escriba del reino te responderá pronto.', 'ok');
      form.reset();
      form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
      const contador = document.getElementById('contador-comentario');
      if (contador) contador.textContent = '0 / 500 caracteres';
    } else {
      mostrarAlerta('alerta', 'Revisa los campos marcados antes de enviar.', 'bad');
    }
  });
}

/* ---------------------------------------------------------
   FORMULARIO: Registro / Usuario
   Comparten las mismas reglas. El campo "tipo de usuario"
   solo existe en la vista del administrador.
   --------------------------------------------------------- */

/* iniciarFormUsuario() — formulario #form-usuario
   UNA funcion para DOS paginas: registro.html (tienda) y
   admin/usuario-nuevo.html / usuario-editar.html (panel). Funciona porque
   los tres usan el mismo id de formulario y los mismos ids de campo.
   Las diferencias entre ambas vistas se resuelven preguntando si el campo
   existe (if (tipo), if (pass), if (pass2)):
     #tipo-usuario  solo en el panel
     #password/#password2  solo en registro.html
   Llama a inicializarRegiones('region','comuna') para encadenar los selects.
   Al guardar con exito devuelve #comuna a vacio y disabled, su estado inicial:
   form.reset() no lo haria, porque sus <option> los creo el JS. */
function iniciarFormUsuario(){
  const form = document.getElementById('form-usuario');
  if (!form) return;

  const run       = document.getElementById('run');
  const nombre    = document.getElementById('nombre');
  const apellidos = document.getElementById('apellidos');
  const correo    = document.getElementById('correo');
  const nacim     = document.getElementById('nacimiento');
  const tipo      = document.getElementById('tipo-usuario');
  const region    = document.getElementById('region');
  const comuna    = document.getElementById('comuna');
  const direccion = document.getElementById('direccion');
  const pass      = document.getElementById('password');
  const pass2     = document.getElementById('password2');

  inicializarRegiones('region', 'comuna');

  enTiempoReal(run,       () => validarRun(run));
  enTiempoReal(nombre,    () => validarTexto(nombre, true, 50, 'El nombre'));
  enTiempoReal(apellidos, () => validarTexto(apellidos, true, 100, 'Los apellidos'));
  enTiempoReal(correo,    () => validarCorreo(correo, true));
  enTiempoReal(direccion, () => validarTexto(direccion, true, 300, 'La dirección'));

  if (pass)  enTiempoReal(pass,  () => validarPassword(pass));
  if (pass2) enTiempoReal(pass2, () => validarConfirmacion(pass2, pass));
  if (tipo)  enTiempoReal(tipo,  () => validarSelect(tipo, 'el tipo de usuario'));

  if (region) region.addEventListener('change', () => validarSelect(region, 'una región'));
  if (comuna) comuna.addEventListener('change', () => validarSelect(comuna, 'una comuna'));

  form.addEventListener('submit', e => {
    e.preventDefault();

    const revisiones = [
      validarRun(run),
      validarTexto(nombre, true, 50, 'El nombre'),
      validarTexto(apellidos, true, 100, 'Los apellidos'),
      validarCorreo(correo, true),
      validarSelect(region, 'una región'),
      validarSelect(comuna, 'una comuna'),
      validarTexto(direccion, true, 300, 'La dirección')
    ];

    if (tipo)  revisiones.push(validarSelect(tipo, 'el tipo de usuario'));
    if (pass)  revisiones.push(validarPassword(pass));
    if (pass2) revisiones.push(validarConfirmacion(pass2, pass));

    if (revisiones.every(Boolean)){
      mostrarAlerta('alerta', 'Datos guardados correctamente.', 'ok');
      form.reset();
      form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
      if (comuna){
        comuna.innerHTML = '<option value="">-- Selecciona la comuna --</option>';
        comuna.disabled = true;
      }
    } else {
      mostrarAlerta('alerta', 'Revisa los campos marcados antes de guardar.', 'bad');
    }
  });
}

/* ---------------------------------------------------------
   FORMULARIO: Producto (administrador)
   --------------------------------------------------------- */

/* iniciarFormProducto() — formulario #form-producto
   Comun a admin/producto-nuevo.html y admin/producto-editar.html: las
   reglas se escriben una sola vez. La precarga de la edicion NO esta aqui,
   sino en el <script> inline de producto-editar.html.
   Contiene revisarStockCritico(), que corre en cada tecla de #stock o
   #stock-critico (no al enviar) y pinta #aviso-stock en rojo si el stock
   quedo en o bajo el critico.
   Unica regla de negocio propia: si el precio es 0, agrega a la alerta
   "El producto quedo marcado como gratuito." */
function iniciarFormProducto(){
  const form = document.getElementById('form-producto');
  if (!form) return;

  const codigo       = document.getElementById('codigo');
  const nombre       = document.getElementById('nombre');
  const descripcion  = document.getElementById('descripcion');
  const precio       = document.getElementById('precio');
  const stock        = document.getElementById('stock');
  const stockCritico = document.getElementById('stock-critico');
  const categoria    = document.getElementById('categoria');

  enTiempoReal(codigo,       () => validarTexto(codigo, true, 100, 'El código', 3));
  enTiempoReal(nombre,       () => validarTexto(nombre, true, 100, 'El nombre'));
  enTiempoReal(descripcion,  () => validarTexto(descripcion, false, 500, 'La descripción'));
  enTiempoReal(precio,       () => validarNumero(precio, true, 0, false, 'El precio'));
  enTiempoReal(stock,        () => validarNumero(stock, true, 0, true, 'El stock'));
  enTiempoReal(stockCritico, () => validarNumero(stockCritico, false, 0, true, 'El stock crítico'));
  enTiempoReal(categoria,    () => validarSelect(categoria, 'una categoría'));

  /* Aviso cuando el stock está en o bajo el nivel crítico */
  function revisarStockCritico(){
    const aviso = document.getElementById('aviso-stock');
    if (!aviso) return;

    const s = Number(stock.value);
    const c = Number(stockCritico.value);

    if (stock.value !== '' && stockCritico.value !== '' && s <= c){
      aviso.textContent = 'Atención: el stock (' + s + ') está en o bajo el nivel crítico (' + c + ').';
      aviso.className = 'form-alert bad';
    } else {
      aviso.className = 'form-alert';
      aviso.textContent = '';
    }
  }

  if (stock)        stock.addEventListener('input', revisarStockCritico);
  if (stockCritico) stockCritico.addEventListener('input', revisarStockCritico);

  form.addEventListener('submit', e => {
    e.preventDefault();

    const ok = [
      validarTexto(codigo, true, 100, 'El código', 3),
      validarTexto(nombre, true, 100, 'El nombre'),
      validarTexto(descripcion, false, 500, 'La descripción'),
      validarNumero(precio, true, 0, false, 'El precio'),
      validarNumero(stock, true, 0, true, 'El stock'),
      validarNumero(stockCritico, false, 0, true, 'El stock crítico'),
      validarSelect(categoria, 'una categoría')
    ].every(Boolean);

    if (ok){
      const gratis = Number(precio.value) === 0 ? ' El producto quedó marcado como gratuito.' : '';
      mostrarAlerta('alerta', 'Producto guardado correctamente.' + gratis, 'ok');
    } else {
      mostrarAlerta('alerta', 'Revisa los campos marcados antes de guardar.', 'bad');
    }
  });
}

/* ---------------------------------------------------------
   Arranque
   --------------------------------------------------------- */

/* ARRANQUE. Al cargar el DOM llama a las cuatro funciones sin preguntar
   en que pagina estamos: cada una busca su formulario por id y, si no lo
   encuentra, se va sin hacer nada. Ese es el motivo de que el mismo
   validaciones.js sirva para login, contacto, registro y las cuatro
   pantallas del panel, sin un solo if de "que pagina es esta". */
document.addEventListener('DOMContentLoaded', () => {
  iniciarFormLogin();
  iniciarFormContacto();
  iniciarFormUsuario();
  iniciarFormProducto();
});
