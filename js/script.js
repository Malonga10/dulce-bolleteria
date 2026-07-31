const WHATSAPP_NUMBER = "529871173779"; // ajustar si el número no lleva código de país 52

const products = [
  {id:'limon', name:'Panqué de Limón', cats:['clasicos'], desc:'100% casero, suave y esponjoso con un delicioso toque cítrico.', price:270, img:'imgs/panque_limon.jpeg'},
  {id:'naranja', name:'Panqué de Naranja', cats:['clasicos'], desc:'Clásico de la casa con un fresco sabor a naranja natural.',  price:270, img:'imgs/panque_naranja.jpeg'},
  {id:'platano-nuez', name:'Panqué de Plátano con Nuez', cats:['saludables'], desc:'Plátanos maduros, dulzor natural y textura suave y esponjosa.', price:270, img:'imgs/panque_platano_nuez.jpeg'},
  {id:'datil', name:'Panqué de Dátil', cats:['saludables'], desc:'Harina de avena, dátiles maduros y dulzor natural.', price:300, img:'imgs/panque_datil.jpeg'},
  {id:'platano-cafe-datil', name:'Plátano, Café Espresso y Dátil', cats:['clasicos'], desc:'Panqué artesanal elaborado con platanos maduros, café espresso y dátiles.',  price:320, img:'imgs/panque_datil2.jpeg'},
  {id:'zanahoria', name:'Panqué de Zanahoria', cats:['clasicos'], desc:'Panqué clásico de zanahoria, húmedo y lleno de sabor.', price:270, img:'imgs/panque_zanahoria.jpeg'},
  {id:'zanahoria-coco', name:'Panqué de Zanahoria con Coco', cats:['clasicos'], desc:'Nuestra zanahoria clásica con un toque tropical de coco tostado.', price:290, img:'imgs/panque_zana_coco.jpeg'},
  {id:'chocolate', name:'Panqué de Chocolate', cats:['clasicos'], desc:'Suave, húmedo y esponjoso, con un delicioso sabor a chocolate.', price:270, img:'imgs/panque_chocolate_normal.jpeg'},
  {id:'chocolate-relleno', name:'Panqué de Chocolate con Relleno', cats:['clasicos'], desc:'Panqué de chocolate bañado con cobertura de chocolate semiamargo.', price:320, img:'imgs/panque_chocolate.jpeg'},
  {id:'avena-manzana', name:'Panqué de Avena con Manzana', cats:['saludables'], desc:'Harina de avena, manzanas ralladas y dulzor natural.', price:300, img:'imgs/panque_manza_avena.jpeg'},

  {id:'marmoleado', name:'Marmoleado de Café y Vainilla', cats:['especialidades'], desc:'Especialidad de la casa: swirl de café y vainilla en cada rebanada.', price:340, img:'imgs/marmoleado_cafe.jpeg'},
  {id:'fresa', name:'Panqué de Fresa', cats:['especialidades'], desc:'Especialidad de la casa con un delicado sabor a fresa natural.', price:320, img:'imgs/panque_fresa.jpeg'},
  {id:'lechera', name:'Panqué de Lechera', cats:['especialidades'], desc:'Suave y esponjoso, cubierto con glaseado, láminas de almendra y lechera.', price:290, img:'imgs/panque_lechera.jpeg'},
  {id:'mantequilla-holandesa', name:'Panqué de Mantequilla Holandesa', cats:['especialidades'], desc:'Suave, esponjoso y con un delicado sabor a mantequilla holandesa.', price:290, img:'imgs/marmoleado_mante.jpeg'},
  {id:'queso-bola', name:'Panqué de Queso de Bola', cats:['especialidades'], desc:'Panqué suave y humedo elaborado con queso de bola y mantequilla azul, cubierto con cremoso betún.', price:340, img:'imgs/panque_quesobola.jpeg'},

  {id:'pina-colada', name:'Panqué de Piña Colada', cats:['especiales'], desc:'Sabor especial tropical, inspirado en la clásica piña colada.', price:320, img: 'imgs/panque_pina_colada.jpeg'},
  {id:'vino-tinto', name:'Panqué de Vino Tinto', cats:['especiales'], desc:'Edición especial ✨ un sabor sofisticado y único de temporada.', price:320, img: 'imgs/panque_vino.jpeg', special:true},

  {id:'mostachon-mediano', name:'Mostachón', group:'mostachon', sizeLabel:'Mediano', cats:['mostachon'], desc:'Crujiente por fuera, suave por dentro, con relleno de platano y dulce de leche.', price:400, img:'imgs/mostachon.jpeg'},
  {id:'mostachon-grande', name:'Mostachón', group:'mostachon', sizeLabel:'Grande', cats:['mostachon'], desc:'Crujiente por fuera, suave por dentro, con relleno de platano y dulce de leche.', price:650, img:'imgs/mostachon.jpeg'},
  {id:'barras-chocolate', name:'Barras de Chocolate', cats:['saludables'], desc:'Chocolate semiamargo con relleno de cacahuate (6 piezas).', price:150, img:'imgs/barritas_chocolate.jpeg'},
];

const grid = document.getElementById('productGrid');

function renderProducts(filter='all'){
  grid.innerHTML = '';

  const filtered = products.filter(p => filter === 'all' || p.cats.includes(filter));

  // separamos: productos normales vs. productos agrupados por tamaño
  const groups = {};
  const singles = [];
  filtered.forEach(p => {
    if(p.group){
      if(!groups[p.group]) groups[p.group] = [];
      groups[p.group].push(p);
    } else {
      singles.push(p);
    }
  });

  singles.forEach(p => grid.appendChild(buildCard(p)));
  Object.values(groups).forEach(variants => grid.appendChild(buildGroupCard(variants)));
}

function buildCard(p){
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
        <button class="add-btn">Agregar</button>
      </div>
    </div>
  `;
  const btn = card.querySelector('.add-btn');
  btn.addEventListener('click', () => {
    addToCart(p.id);
    btn.textContent = 'Agregado ♥';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = 'Agregar'; btn.classList.remove('added'); }, 1200);
  });
  return card;
}

function buildGroupCard(variants){
  const base = variants[0];
  let selected = 0;

  const card = document.createElement('div');
  card.className = 'card';
  const imgBlock = base.img
    ? `<div class="card-img-wrap"><img src="${base.img}" alt="${base.name}" loading="lazy"></div>`
    : `<div class="card-noimg"><span class="heart-lg">♥</span></div>`;

  card.innerHTML = `
    ${imgBlock}
    <div class="card-body">
      <h3>${base.name}</h3>
      <p>${base.desc}</p>
      <div class="size-select">
        ${variants.map((v,i) => `<div class="size-opt ${i===0?'sel':''}" data-index="${i}">${v.sizeLabel}</div>`).join('')}
      </div>
      <div class="card-foot">
        <span class="price">$${variants[0].price}</span>
        <button class="add-btn">Agregar</button>
      </div>
    </div>
  `;

  const priceEl = card.querySelector('.price');
  const opts = card.querySelectorAll('.size-opt');
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('sel'));
      opt.classList.add('sel');
      selected = parseInt(opt.dataset.index);
      priceEl.textContent = '$' + variants[selected].price;
    });
  });

  const addBtn = card.querySelector('.add-btn');
  addBtn.addEventListener('click', () => {
    addToCart(variants[selected].id);
    addBtn.textContent = 'Agregado ♥';
    addBtn.classList.add('added');
    setTimeout(() => { addBtn.textContent = 'Agregar'; addBtn.classList.remove('added'); }, 1200);
  });

  return card;
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
          <div class="name">${p.name}${p.sizeLabel ? ' (' + p.sizeLabel + ')' : ''}</div>
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
    const label = p.name + (p.sizeLabel ? ' (' + p.sizeLabel + ')' : '');
    msg += `• ${qty}x ${label} — $${p.price * qty}%0A`;
  });
  msg += `%0ATotal estimado: $${total}%0AEnvío a domicilio: $35.00%0A`;
  const note = document.getElementById('noteInput').value.trim();
  if(note) msg += `%0ANotas: ${encodeURIComponent(note)}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}
