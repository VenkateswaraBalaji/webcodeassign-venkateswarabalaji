const API_URL = 'https://makeup-api.herokuapp.com/api/v1';

async function getMakeupProducts(brand) {
  try {
    const response = await fetch(`${API_URL}/products.json?brand=${brand}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const brand = document.createElement('h2');
  brand.className = 'brand';
  brand.textContent = `Brand: ${product.brand}`;

  const name = document.createElement('h3');
  name.className = 'product-name';
  name.innerHTML = `Product: ${highlightText(product.name)}`;

  const price = document.createElement('p');
  price.className = 'price';
  price.textContent = `Price: $${product.price}`;

  const image = document.createElement('img');
  image.src = product.image_link;
  image.alt = product.name;

  const link = document.createElement('a');
  link.href = product.product_link;
  link.textContent = 'View Product';

  const description = document.createElement('p');
  description.className = 'description';
  description.innerHTML = highlightText(product.description);

  card.appendChild(brand);
  card.appendChild(name);
  card.appendChild(price);
  card.appendChild(image);
  card.appendChild(link);
  card.appendChild(description);

  return card;
}

function filterProducts(products, searchTerm) {
  if (!searchTerm) {
    return products;
  }

  const regex = new RegExp(searchTerm, 'i');
  return products.filter((product) => regex.test(product.name));
}

function highlightText(text) {
  const searchTerm = document.getElementById('search-input').value.trim();

  if (!searchTerm) {
    return text;
  }

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

async function displayMakeupProducts(brand) {
  const searchInput = document.getElementById('search-input');
  const productsContainer = document.getElementById('products-container');
  productsContainer.innerHTML = ''; // Clear previous content

  try {
    const products = await getMakeupProducts(brand);
    const searchTerm = searchInput.value.trim();
    const filteredProducts = filterProducts(products, searchTerm);

    if (filteredProducts.length === 0) {
      const message = document.createElement('p');
      message.textContent = 'No products found for the specified brand.';
      productsContainer.appendChild(message);
      return;
    }

    filteredProducts.forEach((product) => {
      const card = createProductCard(product);
      productsContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error:', error.message);
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'An error occurred while fetching products.';
    productsContainer.appendChild(errorMessage);
  }
}

function handleSearchInput() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(displayMakeupProducts, 300);
}

let timeoutId = null;
const brand = 'maybelline';

document.getElementById('search-input').addEventListener('input', handleSearchInput);

displayMakeupProducts(brand);
