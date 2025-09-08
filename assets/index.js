let cartItems = [];
let totalPrice = 0;

// Spinner
const manageSpinner = (status) => {
  document.getElementById("spinner").classList.toggle("hidden", !status);
  document.getElementById("cart-containar").classList.toggle("hidden", status);
};

// Add to Cart
const addToCart = (title, price) => {
  alert(`${title} has been added to the cart`);
  cartItems.push({ title, price });
  totalPrice += price;

  const cartContainer = document.getElementById("your-cart");
  const createDiv = document.createElement("div");
  createDiv.className = "flex justify-between items-center text-center border p-1 rounded mt-1";

  createDiv.innerHTML = `
    <span>${title} <br> ${price} tk</span>
    <i class="fa-solid fa-xmark cursor-pointer"></i>
  `;

  createDiv.querySelector("i").addEventListener("click", () => {
    cartContainer.removeChild(createDiv);
    totalPrice -= price;
    document.getElementById("total-price").innerText = totalPrice;
  });

  cartContainer.appendChild(createDiv);
  document.getElementById("total-price").innerText = totalPrice;
};

// Display plants
const displayPlants = (carts, containerId) => {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!carts || carts.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500">No plants found</p>`;
    return;
  }

  carts.forEach((cart) => {
    const div = document.createElement("div");
    div.className = "bg-white rounded shadow-lg p-2 space-y-2";

    div.innerHTML = `
      <img src="${cart.image}" alt="${cart.name}" class="w-full h-40 object-cover rounded">
      <h1 class="font-bold">${cart.name}</h1>
      <p>${cart.description}</p>
      <div class="flex justify-between items-center">
        <button onclick="loadCategoryDetail(${cart.id})" class="bg-[#DCFCE7] p-2 rounded-sm">${cart.category}</button>
        <p>${cart.price} tk</p>
      </div>
      <button class="add-to-cart-btn p-2 bg-[#15803D] text-white w-full mt-2 rounded">
        Add to Cart
      </button>
    `;

    div.querySelector(".add-to-cart-btn").addEventListener("click", () => addToCart(cart.name, cart.price));
    container.appendChild(div);
  });
};

// Load all plants
const loadAllPlants = () => {
  manageSpinner(true);
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      if (data && data.plants) {
        displayPlants(data.plants, "all-plants-containar");
      }
    })
    .catch((err) => console.error(err))
    .finally(() => manageSpinner(false));
};

// Load category plants
const loadCategoryPlants = (categoryId) => {
  manageSpinner(true);
  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("all-plants-containar").innerHTML = ""; 
      if (data && data.plants) {
        displayPlants(data.plants, "cart-containar");
      }
    })
    .catch((err) => console.error(err))
    .finally(() => manageSpinner(false));
};

// Load categories
const loadCategories = () => {
  manageSpinner(true);
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categoriesContainer = document.getElementById("categories-containar");
      categoriesContainer.innerHTML = "";

      data.categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.innerText = category.category_name;
        btn.className = "btn w-full rounded-sm text-black p-1 mt-3 hover:bg-[#15803D]";

        btn.addEventListener("click", () => {
          // Active class
          document.querySelectorAll("#categories-containar button").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          loadCategoryPlants(category.id);
        });

        categoriesContainer.appendChild(btn);
      });
    })
    .catch((err) => console.error(err))
    .finally(() => manageSpinner(false));
};

// Modal
const loadCategoryDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  manageSpinner(true);
  try {
    const res = await fetch(url);
    const details = await res.json();
    const detailsPlantsBox = document.getElementById("datelis-containar");
    detailsPlantsBox.innerHTML = `
      <div class="p-2">
        <h1 class="font-bold">${details.plants.category}</h1>
        <img class="mt-2 h-70 w-full" src="${details.plants.image}" alt="">
        <h1 class="mt-2"><span class="font-bold">Name:</span> ${details.plants.name}</h1>
        <h1 class="font-bold">Price: 💲<span>${details.plants.price}</span></h1>
        <p class="mt-2"><span class="font-bold">Description:</span> ${details.plants.description}</p>
      </div>
    `;
    document.getElementById("my_modal_5").showModal();
  } catch (err) {
    console.error(err);
  } finally {
    manageSpinner(false);
  }
};

// Initial load
loadAllPlants();
loadCategories();
