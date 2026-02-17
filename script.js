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








let count = 0;
const updateCart = () => {
    count++;
    document.getElementById('cart-count').innerText = count;
};


showPage('home');