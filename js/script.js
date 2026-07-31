const WHATSAPP_NUMBER = "529871173779"; // ajustar si el número no lleva código de país 52

const products = [
  {id:'limon', name:'Panqué de Limón', cats:['clasicos'], desc:'100% casero, suave y esponjoso con un delicioso toque cítrico.', price:270, img:'imgs/panque_limon.jpeg'},
  {id:'naranja', name:'Panqué de Naranja', cats:['clasicos'], desc:'Clásico de la casa con un fresco sabor a naranja natural.',  price:270, img:'imgs/panque_naranja.jpeg'},
  {id:'platano-nuez', name:'Panqué de Plátano con Nuez', cats:['clasicos'], desc:'Plátanos maduros, dulzor natural y textura suave y esponjosa.', price:270, img:'imgs/panque_platano_nuez.jpeg'},
  {id:'datil', name:'Panqué de Dátil', cats:['saludables'], desc:'Harina de avena, dátiles maduros y dulzor natural.', price:420, img:'imgs/panque_datil.jpeg'},
  {id:'platano-cafe-datil', name:'Plátano, Café Espresso y Dátil', cats:['clasicos', 'saludables'], desc:'Variante del plátano con nuez, con notas de café espresso y dátil.',  price:320, img:'imgs/panque_platano.jpeg'},
  {id:'zanahoria', name:'Panqué de Zanahoria', cats:['clasicos'], desc:'Panqué clásico de zanahoria, húmedo y lleno de sabor.', price:270, img:'imgs/panque_zanahoria.jpeg'},
  {id:'datil-zanahoria', name:'Panqué de Dátil con Zanahoria', cats:['saludables'], desc:'Harina de avena, dátiles maduros y zanahorias ralladas.', price:200, img:'imgs/panque_datil2.jpeg'},
  {id:'zanahoria-coco', name:'Panqué de Zanahoria con Coco', cats:['clasicos'], desc:'Nuestra zanahoria clásica con un toque tropical de coco tostado.', price:290, img:'imgs/panque_zana_coco.jpeg'},
  {id:'chocolate', name:'Panqué de Chocolate', cats:['clasicos'], desc:'Intensamente chocolatoso, suave y con una cobertura irresistible.', price:270, img:'imgs/panque_chocolate_normal.jpeg'},
  {id:'chocolate-relleno', name:'Panqué de Chocolate con Relleno', cats:['clasicos'], desc:'Nuestro panqué de chocolate con un relleno sorpresa en el centro.', price:320, img:'imgs/panque_chocolate.jpeg'},
  {id:'avena-manzana', name:'Panqué de Avena con Manzana', cats:['saludables'], desc:'Harina de avena, manzanas ralladas y dulzor natural.', price:200, img:'imgs/panque_manza_avena.jpeg'},

  {id:'marmoleado', name:'Marmoleado de Café y Vainilla', cats:['especialidades'], desc:'Especialidad de la casa: swirl de café y vainilla en cada rebanada.', price:340, img:'imgs/marmoleado_cafe.jpeg'},
  {id:'fresa', name:'Panqué de Fresa', cats:['especialidades'], desc:'Especialidad de la casa con un delicado sabor a fresa natural.', price:300, img:'imgs/panque_fresa.jpeg'},
  {id:'lechera', name:'Panqué de Lechera', cats:['especialidades'], desc:'Suave y esponjoso, cubierto con glaseado, láminas de almendra y lechera.', price:290, img:'imgs/panque_lechera.jpeg'},
  {id:'mantequilla-holandesa', name:'Panqué de Mantequilla Holandesa', cats:['especialidades'], desc:'Especialidad de la casa con un toque de mantequilla holandesa.', price:290, img:'imgs/marmoleado_mante.jpeg'},
  {id:'queso-bola', name:'Mantequilla Holandesa con Queso de Bola', cats:['especialidades'], desc:'Nuestra mantequilla holandesa coronada con queso de bola gratinado.', price:340, img:'imgs/panque_quesobola.jpeg'},

  {id:'pina-colada', name:'Panqué de Piña Colada', cats:['especiales'], desc:'Sabor especial tropical, inspirado en la clásica piña colada.', price:320, img: 'imgs/panque_pina_colada.jpeg'},
  {id:'vino-tinto', name:'Panqué de Vino Tinto', cats:['especiales'], desc:'Edición especial ✨ un sabor sofisticado y único de temporada.', price:320, img: 'imgs/panque_vino.jpeg', special:true},

  {id:'mostachon-mediano', name:'Mostachón (mediano)', cats:['mostachon'], desc:'Merengue crujiente, Plátanos maduros, dulzor natural y textura suave y esponjosa.', price:350, img:'imgs/mostachon.jpeg'},
  {id:'mostachon-grande', name:'Mostachón (grande)', cats:['mostachon'], desc:'Merengue crujiente, crema suave, plátano fresco y dulce de leche.', price:650, img:'imgs/mostachon.jpeg'},
  {id:'barras-chocolate', name:'Barras de Chocolate', cats:['saludables'], desc:'Chocolate semiamargo con relleno de cacahuate (6 piezas).', price:150, img:'imgs/barritas_chocolate.jpeg'},
];

const grid = document.getElementById('productGrid');

function renderProducts(filter='all'){
  grid.innerHTML = '';
  products
    .filter(p => filter === 'all' || p.cats.includes(filter))
    .forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      const imgBlock = p.img
        ? `<div class="card-img-wrap"><img src="${p.img}" alt="${p.name}" loading="lazy">${p.special ? '<span class="card-tag">Edición especial</span>' : ''}</div>`
        : `<div class="card-noimg"><span class="heart-lg">♥</span></div>`;
      card.innerHTML = `
        ${imgBlock}
        <div class="card-body">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="card-foot">
            <span class="price">$${p.price}</span>
            <button class="add-btn" data-id="${p.id}">Agregar</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

  grid.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.id);
      btn.textContent = 'Agregado ♥';
      btn.classList.add('added');
      setTimeout(() => { btn.textContent = 'Agregar'; btn.classList.remove('added'); }, 1200);
    });
  });
}

document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderProducts(tab.dataset.filter);
  });
});

renderProducts();

// ---- cart logic ----
let cart = {}; // id -> qty

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}
function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id] += delta;
  if(cart[id] <= 0) delete cart[id];
  renderCart();
}
function removeItem(id){
  delete cart[id];
  renderCart();
}

function renderCart(){
  const body = document.getElementById('drawerBody');
  const ids = Object.keys(cart);
  const countEl = document.getElementById('cartCount');
  const totalCount = ids.reduce((s,id) => s + cart[id], 0);
  countEl.textContent = totalCount;

  if(ids.length === 0){
    body.innerHTML = '<div class="drawer-empty">Aún no has agregado panqués <span class="heart">♥</span></div>';
    document.getElementById('totalPrice').textContent = '$0';
    document.getElementById('waBtn').disabled = true;
    return;
  }

  let total = 0;
  body.innerHTML = ids.map(id => {
    const p = products.find(x => x.id === id);
    const qty = cart[id];
    total += p.price * qty;
    return `
      <div class="cart-item">
        ${p.img ? `<img src="${p.img}" alt="${p.name}">` : `<div style="width:64px;height:64px;border-radius:10px;background:var(--blush);flex-shrink:0;display:flex;align-items:center;justify-content:center;color:var(--rose);">♥</div>`}
        <div class="cart-item-info">
          <div class="name">${p.name}</div>
          <div class="meta">$${p.price} c/u</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty('${id}', -1)">–</button>
            <span>${qty}</span>
            <button class="qty-btn" onclick="changeQty('${id}', 1)">+</button>
            <span class="remove-link" onclick="removeItem('${id}')">Quitar</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('totalPrice').textContent = '$' + total;
  document.getElementById('waBtn').disabled = false;
}

function openCart(){
  document.getElementById('drawer').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}
function closeCart(){
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

function sendOrder(){
  const ids = Object.keys(cart);
  if(ids.length === 0) return;
  let msg = 'Hola Dulce Bolletería 👋 Quisiera hacer el siguiente pedido:%0A%0A';
  let total = 0;
  ids.forEach(id => {
    const p = products.find(x => x.id === id);
    const qty = cart[id];
    total += p.price * qty;
    msg += `• ${qty}x ${p.name} — $${p.price * qty}%0A`;
  });
  msg += `%0ATotal estimado: $${total}%0AEnvío a domicilio: $35.00%0A`;
  const note = document.getElementById('noteInput').value.trim();
  if(note) msg += `%0ANotas: ${encodeURIComponent(note)}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}