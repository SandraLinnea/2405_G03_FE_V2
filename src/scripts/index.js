import { fetchProducts, fetchCategories } from "../utils/api.js";

//document.addEventListener("DOMContentLoaded", loadCategories);

let selectedCategory = "Alla kategorier";

let shoppingCart = JSON.parse(localStorage.getItem("Products"));
if (shoppingCart !== null) {
  let cartMobilemenu = document.getElementById("cart-mobilemenu");
  cartMobilemenu.innerHTML = `Varukorg ( ${shoppingCart.length} )`;
  let cartHeader = document.getElementById("cart-header");
  cartHeader.innerHTML = `<span class="material-symbols-outlined">shopping_basket</span><div>(${shoppingCart.length})</div>`;
}

loadCategories();

document.querySelectorAll("#categorylist").forEach((btn) => {
  //console.log(btn);
  btn.addEventListener("click", (e) => {
    selectedCategory = e.target.id;
    //selectedCategory = e.target.innerHTML;
    console.log(selectedCategory);
    //selectedCategory = "alla";
    filterProductsByCategory(selectedCategory);
  });
});

filterProductsByCategory(selectedCategory);

// Function to fetch and render products
async function loadCategories() {
  const categoriesContainer = document.querySelector("#categorylist");
  categoriesContainer.innerHTML = "<p>Loading category...</p>"; // Temporary message while loading

  try {
    const categories = await fetchCategories();
    console.log(categories);
    categoriesContainer.innerHTML = ""; // Clear loading text
    if (categories.length > 0) {
      const element = document.createElement("div");
      element.className = "Alla kategorier";
      element.innerHTML = `<button id="Alla kategorier">Alla kategorier</button>`;
      categoriesContainer.appendChild(element);
      categories.forEach((category) => {
        //const categoriesList = createCategoriesList(category);
        const element = document.createElement("div");
        element.className = category.name;
        element.innerHTML = `<button id="${category.name}">${category.name}</button>`;
        categoriesContainer.appendChild(element);
      });
      categories.forEach((category) => {
        //const categoriesList = createCategoriesList(category);
        const element = document.createElement("div");
        element.className = category.name;
        element.innerHTML = `<button id="${category.name}">${category.name}</button>`;
        categoriesContainer.appendChild(element);
      });
      categories.forEach((category) => {
        //const categoriesList = createCategoriesList(category);
        const element = document.createElement("div");
        element.className = category.name;
        element.innerHTML = `<button id="${category.name}">${category.name}</button>`;
        categoriesContainer.appendChild(element);
      });
      categories.forEach((category) => {
        //const categoriesList = createCategoriesList(category);
        const element = document.createElement("div");
        element.className = category.name;
        element.innerHTML = `<button id="${category.name}">${category.name}</button>`;
        categoriesContainer.appendChild(element);
      });
    } else {
      categoriesContainer.innerHTML = "<p>No categories available.</p>";
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    categoriesContainer.innerHTML = "<p>Failed to load categories.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);

async function filterProductsByCategory(category) {
  const products = await fetchProducts();
  //console.log(products);
  //console.log(category);
  if (category === "Alla kategorier" || category === "") {
    let filterdProducts = products.filter((prod) => prod.category);
    loadProducts(filterdProducts);
    console.log(filterdProducts);
    //return filterdProducts;
  } else {
    let filterdProducts = products.filter((prod) => prod.category == category);
    loadProducts(filterdProducts);
    console.log(filterdProducts);
    //return filterdProducts;
  }
}

async function filterProductsBySearch(searchInput) {
  const products = await fetchProducts();
  //let category = "Alla kategorier";
  //console.log(products);
  if (searchInput === "") {
    let filterdProducts = products.filter((prod) => prod.title);

    loadProducts(filterdProducts);
    console.log(filterdProducts);
    //return filterdProducts;
  } else {
    let filteredProducts = products.filter((prod) =>
      prod.title.toLowerCase().includes(searchInput.toLowerCase())
    );

    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));

    loadProducts(filteredProducts);
    console.log(filteredProducts);

    //return filterdProducts;
  }

  //return filterdProducts;
}

// Function to fetch and render products
async function loadProducts(filterdProducts) {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p>Loading products...</p>"; // Temporary message while loading

  try {
    //const products = await fetchProducts();
    //const products = await filterProducts(category);
    let products = filterdProducts;
    productsContainer.innerHTML = ""; // Clear loading text
    if (products.length > 0) {
      products.forEach((product) => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
      });
    } else {
      productsContainer.innerHTML = "<p>No products available.</p>";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "<p>Failed to load products.</p>";
  }
}

// Function to create an individual product card
function createProductCard(product) {
  const element = document.createElement("div");
  let cartValue = 0;
  element.className = "product-card";

  let shoppingCart = JSON.parse(localStorage.getItem("Products"));

  if (shoppingCart !== null) {
    for (let i = 0; i < shoppingCart.length; i++) {
      if (shoppingCart[i].title === product.title) {
        cartValue++;
      }
    }
  }

  if (shoppingCart !== null && cartValue > 0) {
    element.innerHTML = `
    <div class="product-card-background"></div>
    <div class="product-card-info">
    <div class="product-card-img-container">
      <img src="${product.image}" alt="${product.title}"
        onerror="this.onerror=null; this.src='./src/images/products/placeholder.jpg';" class="product-card-img" />
    </div>
    <h3>${product.title}</h3>
    <div class="product-card-extra-info">
      <P>${product.description}</p>
      <P>${product.weight}</p>
      <P>${product.producer}</p>
      <P>${product.category}</p>
    </div>
    <p>${product.price.toFixed(0)} kr</p>
    <div class="cart-button-array">
      <div id="cartbuttonminus" class="cart-button-minus material-symbols-outlined">remove</div>
      <div id="cartbuttoncount" class="cart-button-count">Varukorg (${cartValue})</div>
      <div id="cartbuttonplus" class="cart-button-plus material-symbols-outlined">add</div>
    </div>
    <div id="cardbutton" class="card-button"><button class="add-to-cart-btn"><span>Köp</span></button></div>
    </div>
  `;
    element.querySelector(".cart-button-array").style.display = "flex";
    element.querySelector("#cardbutton").style.display = "none";
    element.querySelector(".product-card-extra-info").style.display = "none";
  } else {
    element.innerHTML = `
    <div class="product-card-background"></div>
    <div class="product-card-info">
    <div class="product-card-img-container">
      <img src="${product.image}" alt="${product.title}"
        onerror="this.onerror=null; this.src='./src/images/products/placeholder.jpg';" class="product-card-img" />
    </div>
    <h3>${product.title}</h3>
    <div class="product-card-extra-info">
      <P>${product.description}</p>
      <P>${product.weight}</p>
      <P>${product.producer}</p>
      <P>${product.category}</p>
    </div>
    <p>${product.price.toFixed(0)} kr</p>
    <div class="cart-button-array">
      <div id="cartbuttonminus" class="cart-button-minus material-symbols-outlined">remove</div>
      <div id="cartbuttoncount" class="cart-button-count">Varukorg (0)</div>
      <div id="cartbuttonplus" class="cart-button-plus material-symbols-outlined">add</div>
    </div>
    <div id="cardbutton" class="card-button"><button class="add-to-cart-btn"><span>Köp</span></button></div>
    </div>
  `;
    element.querySelector(".product-card-extra-info").style.display = "none";
  }

  element.addEventListener("click", (e) => {
    if (
      e.target.closest(".add-to-cart-btn") ||
      e.target.classList.contains("cart-button-plus") ||
      e.target.classList.contains("cart-button-minus")
    ) {
      return;
    }
    const mainProductCardContainer = document.querySelector(
      "#productCardBackground"
    );

    const mainProductCardItem = document.createElement("div");
    mainProductCardItem.className = "main-product-card-item";
    mainProductCardItem.innerHTML = `
           <div id="infocardbutton" class="info-card-button"><button class="modal-close-button"><span class="material-symbols-outlined">close</span></button></div>
    <div class="product-card-info">
        <img src="${product.image}" alt="${product.title}"
          onerror="this.onerror=null; this.src='./src/images/products/placeholder.jpg';" class="product-card-img" />
        <h3>${product.title}</h3>
        <div class="product-card-extra-info-view">
          <p>${product.description}</p>
          <p>${product.weight}</p>
          <p>${product.producer}</p>
          <p>${product.category}</p>
        </div>
        <p class="product-card-extra-info-price">${product.price.toFixed(
          0
        )} kr</p>
      </div>
    `;

    document.querySelector(".main-product-card-content").style.display =
      "block";

    mainProductCardContainer.appendChild(mainProductCardItem);

    document.querySelector("#infocardbutton").addEventListener("click", () => {
      const mainProductCardContainer = document.querySelector(
        ".main-product-card-item"
      );
      mainProductCardContainer.remove();
      document.querySelector(".main-product-card-content").style.display = "none";
    });
  });
  

  element.querySelector(".cart-button-plus").addEventListener("click", () => {
    cartValue++;
    let shoppingCart = JSON.parse(localStorage.getItem("Products"));
    shoppingCart.push(product);
    localStorage.setItem("Products", JSON.stringify(shoppingCart));
    shoppingCart = JSON.parse(localStorage.getItem("Products"));
    let cartCardView = element.querySelector("#cartbuttoncount");
    cartCardView.innerHTML = `Varukorg (${cartValue})`;
    let cartHeader = document.getElementById("cart-header");
    cartHeader.innerHTML = `<span class="material-symbols-outlined">shopping_basket</span><div>(${shoppingCart.length})</div>`;
    let cartMobilemenu = document.getElementById("cart-mobilemenu");
    cartMobilemenu.innerHTML = `Varukorg ( ${shoppingCart.length} )`;
  });

  element.querySelector(".cart-button-minus").addEventListener("click", () => {
    cartValue--;
    let shoppingCart = JSON.parse(localStorage.getItem("Products"));

    let index = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
      if (shoppingCart[i].title === product.title) {
        index = i;
      }
    }
    shoppingCart.splice(index, 1);
    localStorage.setItem("Products", JSON.stringify(shoppingCart));
    shoppingCart = JSON.parse(localStorage.getItem("Products"));
    let cartCardView = element.querySelector("#cartbuttoncount");
    cartCardView.innerHTML = `Varukorg (${cartValue})`;
    let cartHeader = document.getElementById("cart-header");
    cartHeader.innerHTML = `<span class="material-symbols-outlined">shopping_basket</span><div>(${shoppingCart.length})</div>`;
    let cartMobilemenu = document.getElementById("cart-mobilemenu");
    cartMobilemenu.innerHTML = `Varukorg ( ${shoppingCart.length} )`;

    if (cartValue === 0) {
      element.querySelector(".cart-button-array").style.display = "none";
      element.querySelector("#cardbutton").style.display = "block";
    }

    if (shoppingCart.length === 0) {
      localStorage.removeItem("Products");
    }
  });

  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    element.querySelector(".cart-button-array").style.display = "flex";
    element.querySelector("#cardbutton").style.display = "none";
    let shoppingCart = JSON.parse(localStorage.getItem("Products"));
    if (shoppingCart !== null) {
      console.log(shoppingCart);
      shoppingCart.push(product);
      localStorage.setItem("Products", JSON.stringify(shoppingCart));
    } else {
      let products = [];
      products.push(product);
      shoppingCart = localStorage.setItem("Products", JSON.stringify(products));
    }

    shoppingCart = JSON.parse(localStorage.getItem("Products"));
    console.log(shoppingCart.length);
    let cartHeader = document.getElementById("cart-header");
    cartHeader.innerHTML = `<span class="material-symbols-outlined">shopping_basket</span><div>(${shoppingCart.length})</div>`;
    let cartMobilemenu = document.getElementById("cart-mobilemenu");
    cartMobilemenu.innerHTML = `Varukorg ( ${shoppingCart.length} )`;
    cartValue++;
    let cartCardView = element.querySelector("#cartbuttoncount");
    cartCardView.innerHTML = `Varukorg (${cartValue})`;
  });

  return element;
}

// Function to toggle sidemenu on mobile view
const togglesidebar = document.getElementById("togglesidebar");
togglesidebar.addEventListener("click", mySidebarToggle);

function mySidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}

document.querySelector("#cart-header").addEventListener("click", displayCart);
document.querySelector("#cart-mobilemenu").addEventListener("click", displayCart);

/* document
  .querySelector(".product-card-background")
  .addEventListener("click", () => {
    const mainProductCardContainer = document.querySelector(
      ".main-product-card-item"
    );
    mainProductCardContainer.remove();
    document.querySelector(".main-product-card-content").style.display = "none";
  }); */



let input = document.getElementById("site-header-search");
// input.addEventListener("keypress", (e) => {
//   let input = document.getElementById("site-header-search").value;
//   filterProductsBySearch(input);
//   if (e.key === "Enter") {
//     e.preventDefault();
//   }
// });

input.addEventListener("input", () => {
  const inputValue = document.getElementById("site-header-search").value;
  filterProductsBySearch(inputValue);
});


// JL CART //
async function displayCart() {
  const cartContent = document.querySelector(".cart-content");
  const cartContainer = document.querySelector(".cart-list");
  
  if (!cartContent || !cartContainer) {
      console.error("Cannot open cart: Modal elements not found.");
      return; 
  }

  cartContainer.innerHTML = "";

  const cartFunctionsWrapper = document.createElement("div");
  cartFunctionsWrapper.className = "cart-functions-wrapper";

  const emptyCartWrapper = document.createElement("div");
  emptyCartWrapper.className = "empty-cart-button-wrapper";
  const emptyButton = document.createElement("button");
  emptyButton.className = "empty-cart-button";
  emptyButton.textContent = "Töm varukorg";
  emptyButton.addEventListener("click", (e) => {
    localStorage.clear();
    alert("Varukorgen har tömts!");
    location.reload()
  });
  emptyCartWrapper.appendChild(emptyButton);
  cartFunctionsWrapper.appendChild(emptyCartWrapper);

  const closeButtonWrapper = document.createElement("div");
  closeButtonWrapper.className = "cart-close-button-wrapper"; 
  const closeButton = document.createElement("button");
  closeButton.className = "modal-close-button"; 
  closeButton.className = "cart-close-btn";
  closeButton.setAttribute("aria-label", "Close cart");
  const closeIconSpan = document.createElement("span");
  closeIconSpan.className = "material-symbols-outlined"; 
  closeIconSpan.textContent = "close"; 
  closeButton.appendChild(closeIconSpan);
  //const closeSpan = document.createElement("span");
  //closeSpan.textContent = "X"; 
  //closeButton.appendChild(closeSpan);
  closeButtonWrapper.appendChild(closeButton);
  cartFunctionsWrapper.appendChild(closeButtonWrapper); 
  cartContainer.appendChild(cartFunctionsWrapper); 

  const titleElement = document.createElement("h1");
  titleElement.innerHTML = `Varukorg`;
  cartContainer.appendChild(titleElement);

  
  let shoppingCart = JSON.parse(localStorage.getItem("Products")) || []; 
  const aggregatedCart = {}; 
  let overallTotal = 0;

  if (shoppingCart.length > 0) {
      shoppingCart.forEach(product => {
          const key = product._id || product.title; 
          if (aggregatedCart[key]) {
              aggregatedCart[key].quantity += 1;
          } else {
              aggregatedCart[key] = {
                  product: product,
                  quantity: 1
              };
          }
      });

      
      const table = document.createElement('table');
      table.className = 'cart-table';

      const thead = table.createTHead();
      const headerRow = thead.insertRow();
      const headers = ['Produkt', 'Antal', 'Pris'];
      headers.forEach(text => {
          const th = document.createElement('th');
          th.textContent = text;
          headerRow.appendChild(th);
      });

      
      const tbody = table.createTBody();
      for (const key in aggregatedCart) {
          const item = aggregatedCart[key];
          const product = item.product;
          const quantity = item.quantity;
          const lineTotal = (product.price || 0) * quantity;
          overallTotal += lineTotal; 

          const row = tbody.insertRow();
          
          const cellProduct = row.insertCell();
          cellProduct.textContent = product.title || 'Okänd produkt';

          
          const cellQuantity = row.insertCell();
          cellQuantity.textContent = quantity;
          cellQuantity.style.textAlign = 'center'; 

          
          const cellPrice = row.insertCell();
          cellPrice.textContent = `${lineTotal.toFixed(2)} kr`; 
          cellPrice.style.textAlign = 'right'; // 
      }

  
      const tfoot = table.createTFoot();
      const footerRow = tfoot.insertRow();
      const cellTotalLabel = footerRow.insertCell();
      cellTotalLabel.colSpan = 2; 
      cellTotalLabel.textContent = 'Totalt:';
      cellTotalLabel.style.fontWeight = 'bold';
      cellTotalLabel.style.textAlign = 'right';

      const cellTotalValue = footerRow.insertCell();
      cellTotalValue.textContent = `${overallTotal.toFixed(2)} kr`;
      cellTotalValue.style.fontWeight = 'bold';
      cellTotalValue.style.textAlign = 'right';

      cartContainer.appendChild(table); 

      const elementOrder = document.createElement("div");
      elementOrder.innerHTML = `<a href="/order.html">Till kassan</a>`; 
      cartContainer.appendChild(elementOrder);

  } else {
      
      const emptyMessage = document.createElement("p"); 
      emptyMessage.innerHTML = `Varukorgen är tom`;
      emptyMessage.style.textAlign = 'center';
      emptyMessage.style.marginTop = '1rem';
      cartContainer.appendChild(emptyMessage);
  }

  if(cartContent) { 
      cartContent.style.display = "block"; 
  }
}

function closeCartModal() {
  const cartContent = document.querySelector(".cart-content");
  if (cartContent) {
    cartContent.style.display = "none"; 
  }
}
const cartBackground = document.querySelector(".cart-background");
if (cartBackground) {
  cartBackground.addEventListener("click", (event) => {
      
      if (event.target === event.currentTarget || event.target.closest(".cart-close-btn")) {
          closeCartModal();
      }
  });
}