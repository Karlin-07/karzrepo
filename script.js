const books = [
  {
    id: 1,
    title: "The Atlas of Novel Ideas",
    author: "Maya Sinclair",
    category: "Fiction",
    price: 22.95,
    isbn: "978-0451524935",
    publisher: "Blue Harbor Press",
    year: 2024,
    pages: 384,
    language: "English",
    rating: 4.8,
    stock: 12,
    summary: "A sweeping tale of creativity and courage centered on five characters who rewrite their world with imagination.",
    details: "A contemporary literary novel showing how the power of stories can reshape communities and personal identity. Includes author notes, discussion questions, and a reading guide."
  },
  {
    id: 2,
    title: "Learning JavaScript Today",
    author: "Noah Patel",
    category: "Technology",
    price: 27.50,
    isbn: "978-1492053020",
    publisher: "CodeCraft Books",
    year: 2025,
    pages: 520,
    language: "English",
    rating: 4.7,
    stock: 20,
    summary: "A practical guide for beginners and experienced developers who want to master modern JavaScript concepts and web application building.",
    details: "Includes interactive examples, deep dives into async patterns, modules, browser APIs, and a chapter on deploying a live web store."
  },
  {
    id: 3,
    title: "Mastering Financial Wellness",
    author: "Aisha Martinez",
    category: "Self Help",
    price: 19.99,
    isbn: "978-1982156021",
    publisher: "Growth Path Media",
    year: 2023,
    pages: 288,
    language: "English",
    rating: 4.5,
    stock: 8,
    summary: "A step-by-step handbook for planning budgets, building savings, and investing with confidence at every stage of life.",
    details: "Provides worksheets, simple investing frameworks, tips for paying down debt, and a chapter on goal-oriented money habits."
  },
  {
    id: 4,
    title: "History's Greatest Explorations",
    author: "Luca Hudson",
    category: "History",
    price: 24.00,
    isbn: "978-0143127550",
    publisher: "Maple Street Publishing",
    year: 2022,
    pages: 448,
    language: "English",
    rating: 4.6,
    stock: 5,
    summary: "A visual history of exploration journeys, discoveries, and the people who changed how we understand the world.",
    details: "Features powerful photography, maps, and profiles of explorers from ancient merchants to modern oceanographers."
  },
  {
    id: 5,
    title: "The Art of Healthy Cooking",
    author: "Eva Kim",
    category: "Cooking",
    price: 29.99,
    isbn: "978-1635652029",
    publisher: "Harvest Kitchen Books",
    year: 2024,
    pages: 320,
    language: "English",
    rating: 4.9,
    stock: 14,
    summary: "A culinary cookbook with easy-to-follow recipes, nutritional guidance, and meal plans for balanced home cooking.",
    details: "Includes vegetarian, gluten-free, and family-friendly recipes with step-by-step photos and ingredient substitutions."
  }
];

const cart = [];
const bookList = document.getElementById('bookList');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const detailModal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

const categories = ['all', ...new Set(books.map((book) => book.category))];
categories.forEach((category) => {
  const option = document.createElement('option');
  option.value = category.toLowerCase();
  option.textContent = category;
  categoryFilter.appendChild(option);
});

function renderBooks() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  bookList.innerHTML = '';

  const filtered = books.filter((book) => {
    const matchesCategory = selectedCategory === 'all' || book.category.toLowerCase() === selectedCategory;
    const matchesQuery = [book.title, book.author, book.category, book.isbn]
      .join(' ')
      .toLowerCase()
      .includes(query);

    return matchesCategory && matchesQuery;
  });

  if (filtered.length === 0) {
    bookList.innerHTML = '<p class="no-results">No books match your search.</p>';
    return;
  }

  filtered.forEach((book) => {
    const card = document.createElement('article');
    card.className = 'book-card';

    card.innerHTML = `
      <header>
        <div>
          <h3>${book.title}</h3>
          <div class="book-meta">
            <span>By ${book.author}</span>
            <span>ISBN: ${book.isbn}</span>
          </div>
        </div>
        <span class="badge">${book.category}</span>
      </header>
      <p>${book.summary}</p>
      <div class="book-meta">
        <span>Price: $${book.price.toFixed(2)}</span>
        <span>Rating: ${book.rating} ★</span>
        <span>Stock: ${book.stock}</span>
      </div>
      <div class="card-actions">
        <button class="btn btn-secondary" data-action="details" data-id="${book.id}">View Details</button>
        <button class="btn btn-primary" data-action="buy" data-id="${book.id}">Buy Now</button>
      </div>
    `;

    bookList.appendChild(card);
  });
}

function renderCart() {
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="no-results">Your cart is empty.</p>';
    cartTotal.textContent = '$0.00';
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    total += item.qty * item.price;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <strong>${item.title}</strong>
      <span>Quantity: ${item.qty}</span>
      <span>Subtotal: $${(item.qty * item.price).toFixed(2)}</span>
    `;
    cartItems.appendChild(row);
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function addToCart(bookId) {
  const book = books.find((item) => item.id === bookId);
  if (!book || book.stock === 0) return;

  const cartItem = cart.find((item) => item.id === bookId);
  if (cartItem) {
    cartItem.qty += 1;
  } else {
    cart.push({ ...book, qty: 1 });
  }

  renderCart();
}

function showBookDetails(bookId) {
  const book = books.find((item) => item.id === bookId);
  if (!book) return;

  modalBody.innerHTML = `
    <h2>${book.title}</h2>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>Category:</strong> ${book.category}</p>
    <p><strong>ISBN:</strong> ${book.isbn}</p>
    <p><strong>Publisher:</strong> ${book.publisher}</p>
    <p><strong>Year:</strong> ${book.year}</p>
    <p><strong>Pages:</strong> ${book.pages}</p>
    <p><strong>Language:</strong> ${book.language}</p>
    <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
    <p><strong>Rating:</strong> ${book.rating} ★</p>
    <p><strong>Stock:</strong> ${book.stock}</p>
    <p>${book.details}</p>
  `;

  detailModal.classList.remove('hidden');
}

function closeModal() {
  detailModal.classList.add('hidden');
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty. Add books before checkout.');
    return;
  }

  cart.length = 0;
  renderCart();
  alert('Thank you for your order! Your purchase has been processed successfully.');
}

bookList.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === 'buy') {
    addToCart(id);
  }

  if (action === 'details') {
    showBookDetails(id);
  }
});

searchInput.addEventListener('input', renderBooks);
categoryFilter.addEventListener('change', renderBooks);
checkoutButton.addEventListener('click', checkout);
modalClose.addEventListener('click', closeModal);
detailModal.addEventListener('click', (event) => {
  if (event.target === detailModal) {
    closeModal();
  }
});

renderBooks();
renderCart();
