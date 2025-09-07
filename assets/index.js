let cartItems = [];
let totalPrice = 0;

//  Display Cart
const displayCart = (carts) => {
  const cartContainer = document.getElementById("cart-containar");
  cartContainer.innerHTML = "";

  if (!carts || carts.length === 0) {
    cartContainer.innerHTML = `<p class="text-center text-gray-500">No plants found</p>`;
    return;
  }

  carts.forEach(cart => {
    const div = document.createElement("div");
    div.className = "bg-white rounded shadow p-2 space-y-2";

    div.innerHTML = `
      <img src="${cart.image}" alt="" class="w-full h-40 object-cover rounded">
      <h1 class="font-bold">${cart.name}</h1>
      <p>${cart.description}</p>
      <div class="flex justify-between items-center">
        <p class="bg-[#DCFCE7] p-2 rounded-sm">${cart.category}</p>
        <p>${cart.price} tk</p>
      </div>
      <button class="add-to-cart-btn p-2 bg-[#15803D] text-white w-full mt-2 rounded">
        Add to Cart
      </button>
    `;

    // Add event listener per button
    div.querySelector(".add-to-cart-btn").addEventListener("click", () => {
      addToCart(cart.name, cart.price);
    });

    cartContainer.appendChild(div);
  });
};

//  Add to Cart Btn function
const addToCart = (title, price) => {
  alert(`${title} has been added to the cart`);

  cartItems.push({ title, price });
  totalPrice += price;

  const cartContainer = document.getElementById("your-cart");

  const creatDiv = document.createElement("div");
  creatDiv.className = "flex justify-between items-center text-center border p-1 rounded mt-1";

  creatDiv.innerHTML = `
    <span>${title} - ${price} tk</span>
    <i class="fa-solid fa-xmark cursor-pointer"></i>
  `;

  // Remove item
  creatDiv.querySelector("i").addEventListener("click", () => {
    cartContainer.removeChild(creatDiv);
    totalPrice -= price;
    document.getElementById("total-price").innerText = totalPrice;
  });

  cartContainer.appendChild(creatDiv);

  document.getElementById("total-price").innerText = totalPrice;
};



// Display Categories
// remove active class (categories)
const removeCategoryActive = () => {
  document.querySelectorAll("#categories-containar button").forEach((btn) => {
    btn.classList.remove("active");
  });
};

// display categories
const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById("categories-containar");
  categoriesContainer.innerHTML = "";

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.innerText = category.category_name;
    btn.className = "btn w-full rounded-sm text-black p-1 mt-3 hover:bg-[#15803D]";

    btn.addEventListener("click", () => {
      removeCategoryActive();  
      btn.classList.add("active"); 
      loadCategoryPlants(category.id);
    });

    categoriesContainer.appendChild(btn);
  });
};



// Load Categories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then(data => {
      if(data && data.categories) displayCategories(data.categories);

      // category plants 
      if(data.categories && data.categories.length > 0) {
        loadCategoryPlants(data.categories[0].id);
      }
    })
    .catch(err => console.error(err));
};

//  Load Plants by Category
const loadCategoryPlants = (categoryId) => {
  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then(res => res.json())
    .then(data => {
      if(data && data.plants) displayCart(data.plants);
    })
    .catch(err => console.error(err));
};


loadCategories();
