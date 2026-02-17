// ১. পেজ সুইচিং ফাংশন
function showPage(pageId) {
    const homePage = document.getElementById('home-page');
    const productsPage = document.getElementById('all-products-page');
    const navHome = document.getElementById('nav-home');
    const navProducts = document.getElementById('nav-products');

    if (pageId === 'home') {
        homePage.classList.remove('hidden');
        productsPage.classList.add('hidden');
        navHome.classList.add('text-primary', 'font-bold');
        navProducts.classList.remove('text-primary', 'font-bold');
        loadTrending(); 
    } else {
        homePage.classList.add('hidden');
        productsPage.classList.remove('hidden');
        navProducts.classList.add('text-primary', 'font-bold');
        navHome.classList.remove('text-primary', 'font-bold');
        loadCategories(); 
        loadAllProducts('all'); 
    }
}


const loadTrending = async () => {
    const res = await fetch('https://fakestoreapi.com/products?limit=3');
    const data = await res.json();
    const container = document.getElementById('trending-container');
    container.innerHTML = '';
    renderCards(data, container);
};

const loadCategories = async () => {
    try {
        const res = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await res.json();
        const container = document.getElementById('category-container');
        container.innerHTML = ''; 


        const allBtn = document.createElement('button');
        allBtn.innerText = "All";
        allBtn.className = "btn btn-primary btn-sm rounded-full px-6";
        allBtn.onclick = (e) => loadAllProducts('all', e.target);
        container.appendChild(allBtn);

       
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.innerText = cat;
            btn.className = "btn btn-ghost border-gray-300 btn-sm rounded-full px-6 capitalize";
            
          
            btn.addEventListener('click', (e) => {
                loadAllProducts(cat, e.target);
            });
            
            container.appendChild(btn);
        });
    } catch (err) {
        console.error("Category loading failed:", err);
    }
};




const loadAllProducts = async (category, btn = null) => {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = `<div class="col-span-full text-center py-20"><span class="loading loading-spinner loading-lg text-primary"></span></div>`;


    if(btn) {
        document.querySelectorAll('#category-container button').forEach(b => {
            b.classList.remove('btn-primary');
            b.classList.add('btn-ghost', 'border-gray-300');
        });
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-ghost', 'border-gray-300');
    }

    try {
        const url = category === 'all' 
            ? 'https://fakestoreapi.com/products' 
            : `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;
            
        const res = await fetch(url);
        const data = await res.json();
        grid.innerHTML = '';
        renderCards(data, grid);
    } catch (error) {
        grid.innerHTML = `<p class="col-span-full text-center text-error">Something went wrong!</p>`;
    }
};



const renderCards = (data, container) => {
    data.forEach(product => {
        const card = document.createElement('div');
        card.className = "card bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all";
        card.innerHTML = `
            <figure class="p-6 h-56 bg-white"><img src="${product.image}" class="h-full object-contain"/></figure>
            <div class="card-body p-5">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold uppercase">${product.category}</span>
                    <span class="text-xs font-bold text-orange-400">⭐ ${product.rating.rate} (${product.rating.count})</span>
                </div>
                <h2 class="text-sm font-bold h-10 overflow-hidden leading-tight">${product.title}</h2>
                <p class="text-lg font-extrabold mt-1">$${product.price}</p>
                <div class="grid grid-cols-2 gap-2 mt-4">
                    <button onclick="showDetails(${product.id})" class="btn btn-xs btn-outline rounded">Details</button>
                    <button onclick="updateCart()" class="btn btn-xs btn-primary rounded">Add</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
};


const showDetails = async (id) => {
    const modal = document.getElementById('product_modal');
    const content = document.getElementById('modal-content');
    modal.showModal();
    content.innerHTML = `<div class="p-10 text-center"><span class="loading loading-spinner text-primary"></span></div>`;

    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const data = await res.json();
    content.innerHTML = `
        <div class="flex flex-col md:flex-row p-6 gap-6">
            <img src="${data.image}" class="w-full md:w-1/2 h-64 object-contain rounded-xl bg-white p-4" />
            <div class="flex flex-col justify-center">
                <h3 class="font-bold text-xl">${data.title}</h3>
                <p class="py-4 text-sm text-gray-500">${data.description}</p>
                <p class="text-2xl font-bold text-primary mb-6">$${data.price}</p>
                <div class="modal-action mt-auto flex gap-2">
                   <button class="btn btn-primary flex-1">Buy Now</button>
                   <form method="dialog"><button class="btn">Close</button></form>
                </div>
            </div>
        </div>
    `;
};


let count = 0;
const updateCart = () => {
    count++;
    document.getElementById('cart-count').innerText = count;
};


showPage('home');