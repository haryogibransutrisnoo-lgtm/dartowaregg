const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });

  document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
    });
  });
}

const orders = [];
const orderList = document.querySelector('.order-list');
const orderEmpty = document.querySelector('.order-empty');
const orderTotalValue = document.querySelector('.order-total span');
const orderForm = document.querySelector('.order-form');
const menuCards = document.querySelectorAll('.menu-card');

function formatRupiah(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function updateOrderUI() {
  if (!orderList || !orderEmpty || !orderTotalValue) return;

  orderList.innerHTML = '';

  if (orders.length === 0) {
    orderEmpty.style.display = 'block';
    orderTotalValue.textContent = '0';
    return;
  }

  orderEmpty.style.display = 'none';

  orders.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'order-item';
    listItem.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div>${item.quantity} x Rp ${formatRupiah(item.price)}</div>
      </div>
      <span>Rp ${formatRupiah(item.price * item.quantity)}</span>
      <button type="button" class="button button-secondary remove-order" data-index="${index}">Hapus</button>
    `;
    orderList.appendChild(listItem);
  });

  const total = orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
  orderTotalValue.textContent = formatRupiah(total);
}

function addToOrder(name, price) {
  const existing = orders.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    orders.push({ name, price, quantity: 1 });
  }
  updateOrderUI();
}

function removeFromOrder(index) {
  orders.splice(index, 1);
  updateOrderUI();
}

updateOrderUI();

if (menuCards.length && orderList) {
  menuCards.forEach((card) => {
    const title = card.querySelector('h3');
    const priceEl = card.querySelector('.menu-price');
    const cardCopy = card.querySelector('.menu-card-copy');

    if (!title || !priceEl || !cardCopy) return;

    const name = title.textContent.trim();
    const price = Number(priceEl.textContent.replace(/[^0-9]/g, ''));
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button-secondary order-button';
    button.textContent = 'Pesan Sekarang';
    button.addEventListener('click', () => addToOrder(name, price));

    cardCopy.appendChild(button);
  });
}

if (orderList) {
  orderList.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('remove-order')) {
      const index = Number(target.dataset.index);
      removeFromOrder(index);
    }
  });
}

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameField = document.querySelector('#order-name');
    const phoneField = document.querySelector('#order-phone');

    if (orders.length === 0) {
      alert('Silakan pilih menu terlebih dahulu sebelum mengirim pesanan.');
      return;
    }

    const customerName = nameField ? nameField.value.trim() : '';
    const customerPhone = phoneField ? phoneField.value.trim() : '';

    if (!customerName || !customerPhone) {
      alert('Silakan lengkapi nama dan nomor HP Anda.');
      return;
    }

    const summary = orders
      .map((item) => `${item.quantity}x ${item.name} = Rp ${formatRupiah(item.price * item.quantity)}`)
      .join('\n');
    const total = orders.reduce((sum, item) => sum + item.price * item.quantity, 0);

    alert(
      `Pesanan berhasil dikirim!\n\nNama: ${customerName}\nHP: ${customerPhone}\n\n${summary}\n\nTotal: Rp ${formatRupiah(total)}`
    );

    orders.length = 0;
    updateOrderUI();
    orderForm.reset();
  });
}

const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Terima kasih! Pesan Anda telah dikirim. Kami akan menghubungi Anda segera.');
    form.reset();
  });
}
