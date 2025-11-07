let carrinho = [];
let produtos = [
  { id: 1, nome: 'Air Force 1', preco: 650, categoria: 'nike', img: 'https://imgnike-a.akamaihd.net/360x360/01113751A2.jpg' },
  { id: 2, nome: 'Air Jordan 1 Low', preco: 759, categoria: 'jordan', img: 'https://imgnike-a.akamaihd.net/360x360/05835751A1.jpg' },
  { id: 3, nome: 'Dunk Syracuse', preco: 779, categoria: 'dunk', img: 'https://imgnike-a.akamaihd.net/768x768/09349456A1.jpg' },
  { id: 4, nome: 'Dunk Panda', preco: 749, categoria: 'dunk', img: 'https://imgnike-a.akamaihd.net/360x360/017075IDA10.jpg' },
  { id: 5, nome: 'Dunk University Blue', preco: 749, categoria: 'dunk', img: 'https://droper-lapse.us-southeast-1.linodeobjects.com/20241121141946213-475.webp' },
  { id: 6, nome: 'Air Max 90', preco: 699, categoria: 'nike', img: 'https://imgnike-a.akamaihd.net/768x768/0093187TA2.jpg' }
];

// Renderizar produtos
function renderizarProdutos(produtosParaMostrar = produtos) {
  const grid = document.getElementById('produtoGrid');
  grid.innerHTML = '';

  produtosParaMostrar.forEach(produto => {
    const card = `
      <div class="produto-card" data-categoria="${produto.categoria}">
        <img src="${produto.img}" alt="${produto.nome}">
        <h3>${produto.nome}</h3>
        <p>R$ ${produto.preco.toFixed(2)}</p>
        <button onclick="adicionarCarrinho(${produto.id})">Comprar</button>
      </div>
    `;
    grid.innerHTML += card;
  });

  // Reobservar cards
  document.querySelectorAll('.produto-card').forEach(card => observer.observe(card));
}

// Buscar produtos
function buscarProdutos() {
  const termo = document.getElementById('searchInput').value.toLowerCase();
  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(termo)
  );
  renderizarProdutos(produtosFiltrados);
}

// Filtrar por categoria
function filtrarProdutos(categoria) {
  // Atualizar botões ativos
  document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  if (categoria === 'todos') {
    renderizarProdutos(produtos);
  } else {
    const produtosFiltrados = produtos.filter(p => p.categoria === categoria);
    renderizarProdutos(produtosFiltrados);
  }
}

// Loader
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
  }, 1800);
  renderizarProdutos();
  carregarCarrinho();
});

// Particles
particlesJS('particles-js', {
  particles: {
    number: { value: 40, density: { enable: true, value_area: 800 } },
    color: { value: '#FF4500' },
    shape: { type: 'circle' },
    opacity: { value: 0.3, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
    size: { value: 3, random: true },
    move: { enable: true, speed: 1.5, direction: 'none', random: true, out_mode: 'out' }
  },
  interactivity: {
    events: { onhover: { enable: true, mode: 'repulse' } }
  },
  retina_detect: true
});

// Scroll Header
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Cards aparecer
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('aparecer');
      }, index * 100);
    }
  });
}, { threshold: 0.2 });

// Mobile Menu
function toggleMenu() {
  document.getElementById('nav').classList.toggle('active');
}

// Carrinho
function adicionarCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  carrinho.push(produto);
  atualizarContador();
  mostrarMensagem();
  salvarCarrinho();
}

function atualizarContador() {
  document.getElementById('cartCount').textContent = carrinho.length;
}

function mostrarMensagem() {
  const msg = document.getElementById('successMessage');
  msg.classList.add('show');
  setTimeout(() => {
    msg.classList.remove('show');
  }, 3000);
}

function abrirCarrinho() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio! Adicione produtos primeiro.');
    return;
  }

  document.getElementById('modalCarrinho').classList.add('active');
  renderizarCarrinho();
}

function fecharModal() {
  document.getElementById('modalCarrinho').classList.remove('active');
}

function renderizarCarrinho() {
  const container = document.getElementById('carrinhoItens');
  container.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco;
    container.innerHTML += `
      <div class="carrinho-item">
        <div class="carrinho-item-info">
          <h4>${item.nome}</h4>
          <p>R$ ${item.preco.toFixed(2)}</p>
        </div>
        <button class="carrinho-remove" onclick="removerDoCarrinho(${index})">Remover</button>
      </div>
    `;
  });

  document.getElementById('carrinhoTotal').textContent = `R$ ${total.toFixed(2)}`;
}

function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  atualizarContador();
  renderizarCarrinho();
  salvarCarrinho();

  if (carrinho.length === 0) {
    fecharModal();
  }
}

function limparCarrinho() {
  if (confirm('Deseja limpar todo o carrinho?')) {
    carrinho = [];
    atualizarContador();
    salvarCarrinho();
    fecharModal();
  }
}

function finalizarCompra() {
  let mensagem = '🛍️ *Olá! Gostaria de fazer um pedido:*\n\n';
  let total = 0;

  carrinho.forEach((item, index) => {
    mensagem += `${index + 1}. ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
    total += item.preco;
  });

  mensagem += `\n💰 *Total: R$ ${total.toFixed(2)}*`;

  const whatsappURL = `https://wa.me/5599985103084?text=${encodeURIComponent(mensagem)}`;
  window.open(whatsappURL, '_blank');
}

function salvarCarrinho() {
  // Comentado pois localStorage não funciona no Claude.ai
  // Quando colocar no seu servidor, descomente as linhas abaixo:

  // localStorage.setItem('couture_carrinho', JSON.stringify(carrinho));
}

function carregarCarrinho() {
  // Comentado pois localStorage não funciona no Claude.ai
  // Quando colocar no seu servidor, descomente as linhas abaixo:

  // const salvo = localStorage.getItem('couture_carrinho');
  // if (salvo) {
  //   carrinho = JSON.parse(salvo);
  //   atualizarContador();
  // }
}

// Contato
function enviarContato(e) {
  e.preventDefault();
  const form = e.target;
  const nome = form.querySelector('input[type="text"]').value;
  const email = form.querySelector('input[type="email"]').value;
  const tel = form.querySelector('input[type="tel"]').value;
  const msg = form.querySelector('textarea').value;

  const mensagem = `*Novo Contato - Couture Store*\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n*WhatsApp:* ${tel}\n*Mensagem:* ${msg}`;

  const whatsappURL = `https://wa.me/5599985103084?text=${encodeURIComponent(mensagem)}`;
  window.open(whatsappURL, '_blank');

  form.reset();
  alert('Obrigado! Você será redirecionado para o WhatsApp.');
}

// Newsletter
function inscreverNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;

  const mensagem = `📬 *Nova inscrição na Newsletter*\n\nE-mail: ${email}`;
  const whatsappURL = `https://wa.me/5599985103084?text=${encodeURIComponent(mensagem)}`;

  window.open(whatsappURL, '_blank');
  e.target.reset();
  alert('Obrigado por se inscrever! 🎉');
}