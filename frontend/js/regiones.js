/* =========================================================
   MIDDLE-EARTH: THE LOST AGE — Regiones y comunas de Chile
   Arreglo usado por los selects encadenados de los
   formularios de registro y de usuario del administrador.
   ========================================================= */

const REGIONES = [
  {
    nombre: 'Región de Arica y Parinacota',
    comunas: ['Arica', 'Camarones', 'Putre', 'General Lagos']
  },
  {
    nombre: 'Región de Tarapacá',
    comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica', 'Huara']
  },
  {
    nombre: 'Región de Antofagasta',
    comunas: ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones', 'Taltal', 'San Pedro de Atacama']
  },
  {
    nombre: 'Región de Atacama',
    comunas: ['Copiapó', 'Vallenar', 'Caldera', 'Chañaral', 'Huasco', 'Tierra Amarilla']
  },
  {
    nombre: 'Región de Coquimbo',
    comunas: ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Vicuña', 'Los Vilos', 'Salamanca']
  },
  {
    nombre: 'Región de Valparaíso',
    comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Quillota', 'Los Andes', 'San Felipe', 'Concón']
  },
  {
    nombre: 'Región Metropolitana de Santiago',
    comunas: ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'La Florida', 'Maipú', 'Puente Alto', 'San Bernardo', 'Vitacura', 'La Reina', 'Recoleta', 'Independencia', 'Peñalolén', 'Macul', 'Estación Central']
  },
  {
    nombre: "Región del Libertador General Bernardo O'Higgins",
    comunas: ['Rancagua', 'San Fernando', 'Santa Cruz', 'Rengo', 'Machalí', 'Pichilemu', 'Graneros']
  },
  {
    nombre: 'Región del Maule',
    comunas: ['Talca', 'Curicó', 'Linares', 'Constitución', 'Cauquenes', 'Molina', 'Longaví', 'Parral']
  },
  {
    nombre: 'Región de Ñuble',
    comunas: ['Chillán', 'Chillán Viejo', 'San Carlos', 'Bulnes', 'Quirihue', 'Yungay', 'Coihueco']
  },
  {
    nombre: 'Región del Biobío',
    comunas: ['Concepción', 'Talcahuano', 'Los Ángeles', 'Coronel', 'San Pedro de la Paz', 'Chiguayante', 'Hualpén', 'Lota', 'Arauco']
  },
  {
    nombre: 'Región de La Araucanía',
    comunas: ['Temuco', 'Padre Las Casas', 'Villarrica', 'Angol', 'Pucón', 'Victoria', 'Lautaro', 'Nueva Imperial']
  },
  {
    nombre: 'Región de Los Ríos',
    comunas: ['Valdivia', 'La Unión', 'Río Bueno', 'Panguipulli', 'Los Lagos', 'Paillaco']
  },
  {
    nombre: 'Región de Los Lagos',
    comunas: ['Puerto Montt', 'Osorno', 'Castro', 'Ancud', 'Puerto Varas', 'Calbuco', 'Quellón']
  },
  {
    nombre: 'Región de Aysén',
    comunas: ['Coyhaique', 'Puerto Aysén', 'Chile Chico', 'Cochrane']
  },
  {
    nombre: 'Región de Magallanes y la Antártica Chilena',
    comunas: ['Punta Arenas', 'Puerto Natales', 'Porvenir', 'Cabo de Hornos']
  }
];

/* Selects encadenados ------------------------------------- */

/* inicializarRegiones(idRegion, idComuna)
   Encadena dos <select>: al elegir region se llenan y habilitan las comunas.
   El value de cada <option> de region es el INDICE del arreglo REGIONES
   (0, 1, 2...), no el nombre. Por eso admin/usuario-editar.html precarga
   region con un numero (region:6) y no con texto.
   El de comuna si es el nombre de la comuna.
   #comuna nace disabled y vuelve a quedar disabled si se deselecciona region.
   La llama iniciarFormUsuario() de validaciones.js; se ejecuta en
   registro.html, admin/usuario-nuevo.html y admin/usuario-editar.html.
   Para agregar una region o comuna se edita SOLO el arreglo REGIONES. */
function inicializarRegiones(idRegion, idComuna){
  const selRegion = document.getElementById(idRegion);
  const selComuna = document.getElementById(idComuna);
  if (!selRegion || !selComuna) return;

  selRegion.innerHTML = '<option value="">-- Selecciona la región --</option>' +
    REGIONES.map((r, i) => `<option value="${i}">${r.nombre}</option>`).join('');

  selComuna.innerHTML = '<option value="">-- Selecciona la comuna --</option>';
  selComuna.disabled = true;

  selRegion.addEventListener('change', () => {
    const indice = selRegion.value;

    if (indice === ''){
      selComuna.innerHTML = '<option value="">-- Selecciona la comuna --</option>';
      selComuna.disabled = true;
      return;
    }

    const comunas = REGIONES[indice].comunas;
    selComuna.innerHTML = '<option value="">-- Selecciona la comuna --</option>' +
      comunas.map(c => `<option value="${c}">${c}</option>`).join('');
    selComuna.disabled = false;
  });
}
