import api from "./API.js"; 

// --------------------Add to Cart Function--------------------
// Function to handle adding products to the cart based on their product ID
async function addToCart(productId) {
    try {
        console.log("Adding product to cart with ID:", productId);

        const items = await api.get(); 
        const product = items.find(item => item.id == productId); 

        console.log("Product found:", product);

        if (product) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            cart.push(product);

            localStorage.setItem("cart", JSON.stringify(cart));

            window.location.href = "./cart.html"; 
        } else {
            console.error("Product not found");
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
    }
}

// --------------------Get and Display Products--------------------

// Function to fetch products from the API and display them dynamically
async function get(searchQuery = "", category = "") {
    let items = await api.get(); 
    let heroSection = document.getElementById("heroSection");

    if (searchQuery) {
        items = items.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (category) {
        items = items.filter(item => item.category === category);
    }

    let itemList = items.map((item) => {
        return `
            <div class="card">
                <div class="card-wrapper">
                    <div class="image">
                     <img src=${item.image} alt="${item.title}">
                    </div>
                    <h1 class="title">${item.title}</h1>
                    <p class="price">${item.price} INR</p>
                    <p class="description">${item.description}</p>
                    <p>
                        <!-- Add-to-cart button with a data-product-id attribute -->
                        <button class="add-to-cart-button" data-product-id="${item.id}">Add to Cart</button>
                    </p>
                </div>
            </div>`;
    });

    // Insert product cards into the hero section
    heroSection.innerHTML = itemList.join("");

    // Add event listener for the cart button using event delegation
    heroSection.addEventListener("click", (event) => {
        if (event.target && event.target.classList.contains("add-to-cart-button")) {
            const productId = event.target.getAttribute("data-product-id");
            addToCart(productId); // Call the addToCart function with the product ID
        }
    });
}

get();

// --------------------Debounce Function--------------------

function debounce(func, delay) {
    let timeoutId; 
    return function (...args) {
        // Clear the previous timeout if it exists
        clearTimeout(timeoutId);
        // Set a new timeout to call the function after the specified delay
        timeoutId = setTimeout(() => {
            func.apply(this, args); 
        }, delay);
    };
}

// --------------------Search Functionality--------------------

// Function to handle the search input
function handleSearch() {
    const searchInput = document.getElementById("search-input"); 
    const debouncedGet = debounce((query) => get(query), 300); 

    // Event listener for input changes in the search field
    searchInput.addEventListener("input", (event) => {
        const query = event.target.value; // Get the current input value
        debouncedGet(query); // Call the debounced function
    });
}

handleSearch();

// --------------------Category Search Functionality--------------------

// Function to handle the category selection
function handleCategorySearch() {
    const categorySelect = document.getElementById("category-select");
    const getButton = document.getElementById("get");

    getButton.addEventListener("click", () => {
        const selectedCategory = categorySelect.value; 
        get("", selectedCategory); 
    });
}

handleCategorySearch();

// --------------------Modal Handling--------------------

// Elements for handling modal functionality
let postModalButton = document.getElementById("post-button");
let closeModalButton = document.getElementById("modal-close-button");
let postData = document.getElementById("post-data");

// Event listener for opening the modal to add a new product
postModalButton.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("form-modal-container").style.display = "block";
});

// Function to close the modal
const modalCloser = () => {
    document.getElementById("form-modal-container").style.display = "none";
};

// Event listener for closing the modal
closeModalButton.addEventListener("click", modalCloser);

// Event listener for handling the form submission
postData.addEventListener("click", formHandler);

// Function to handle form submission for adding a new product
async function formHandler(e) {
    e.preventDefault();

    // Get input values from the modal form
    let title = document.getElementById("product-title").value;
    let description = document.getElementById("product-description").value;
    let image = document.getElementById("product-image").value;
    let category = document.getElementById("product-category").value;
    let price = document.getElementById("product-price").value;

    // Create the product object to be posted
    const postObject = {
        title: title,
        price: price,
        description: description,
        image: image,
        category: category,
    };

    try {
        // Asynchronously post the new product using the API
        let response = await api.post(postObject);
        console.log(response); // Log the response to check if the post is successful
        get(); // Refresh the product list after adding
        modalCloser(); // Close the modal after posting the product
    } catch (error) {
        console.error("Error posting product:", error);
    }
}
