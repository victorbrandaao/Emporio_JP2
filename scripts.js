let categories = [];
let products = [];

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    const categoryForm = document.getElementById('categoryForm');
    const productForm = document.getElementById('productForm');

    categoryForm.addEventListener('submit', handleCategoryFormSubmit);
    productForm.addEventListener('submit', handleProductFormSubmit);

    document.getElementById('categoriesList').addEventListener('click', handleCategoryListClick);
    document.getElementById('productsContainer').addEventListener('click', handleProductContainerClick);

    function handleCategoryFormSubmit(event) {
        event.preventDefault();
        const categoryName = document.getElementById('categoryName').value.trim();
        if (categoryName === '') return;

        addCategory(categoryName);
        saveData();
        categoryForm.reset();
    }

    function handleProductFormSubmit(event) {
        event.preventDefault();
        const productName = document.getElementById('productName').value.trim();
        const productCategory = document.getElementById('productCategory').value;
        const productQuantity = parseInt(document.getElementById('productQuantity').value);

        if (productName === '' || productCategory === '' || isNaN(productQuantity)) return;

        addProduct(productName, productCategory, productQuantity);
        saveData();
        productForm.reset();
    }

    async function loadData() {
        try {
            const response = await fetch('load_data.php');
            if (!response.ok) {
                throw new Error(`Erro ao carregar dados. Status: ${response.status}`);
            }
            const data = await response.json();
            categories = data.categories || [];
            products = data.products || [];
            populateCategories();
            populateProducts();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    async function saveData() {
        const data = { categories, products };

        try {
            const response = await fetch('save_data.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`Erro ao salvar dados. Status: ${response.status}`);
            }
            console.log('Dados salvos com sucesso.');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    function addCategory(name) {
        if (!categories.includes(name)) {
            categories.push(name);
            populateCategories();
        }
    }

    function addProduct(name, category, quantity) {
        const product = { name, category, quantity };
        products.push(product);
        populateProducts();
    }

    function populateCategories() {
        const categoriesList = document.getElementById('categoriesList');
        categoriesList.innerHTML = '';

        categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'category-item';
            li.textContent = category;

            const removeButton = document.createElement('i');
            removeButton.className = 'fas fa-trash-alt text-danger';
            removeButton.style.cursor = 'pointer';
            removeButton.dataset.action = 'remove-category';
            removeButton.dataset.category = category;
            li.appendChild(removeButton);

            const showProductsButton = document.createElement('button');
            showProductsButton.className = 'button is-small is-light';
            showProductsButton.textContent = 'Ver Produtos';
            showProductsButton.style.marginLeft = '10px';
            showProductsButton.dataset.action = 'toggle-products';
            showProductsButton.dataset.category = category;
            li.appendChild(showProductsButton);

            const productsListContainer = document.createElement('ul');
            productsListContainer.id = `${category}Products`;
            productsListContainer.className = 'list';
            productsListContainer.style.display = 'none';

            li.appendChild(productsListContainer);
            categoriesList.appendChild(li);
        });

        updateProductFormCategories();
    }

    function populateProducts() {
        categories.forEach(category => {
            const categoryProducts = products.filter(product => product.category === category);
            const productsListContainer = document.getElementById(`${category}Products`);
            productsListContainer.innerHTML = '';

            categoryProducts.forEach(product => {
                const li = document.createElement('li');
                li.className = 'list-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    ${product.name}
                    <div>
                        <span>(${product.quantity})</span>
                        <button class="button is-small is-info" data-action="increase-quantity" data-name="${product.name}" data-category="${product.category}">+</button>
                        <button class="button is-small is-info" data-action="decrease-quantity" data-name="${product.name}" data-category="${product.category}">-</button>
                    </div>
                `;
                productsListContainer.appendChild(li);
            });
        });
    }

    function updateProductFormCategories() {
        const productCategorySelect = document.getElementById('productCategory');
        productCategorySelect.innerHTML = '<option selected disabled>Selecione a categoria</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            productCategorySelect.appendChild(option);
        });
    }

    function handleCategoryListClick(event) {
        const action = event.target.dataset.action;
        const category = event.target.dataset.category;

        if (action === 'remove-category') {
            removeCategory(category);
        } else if (action === 'toggle-products') {
            toggleProductsList(category);
        }
    }

    function handleProductContainerClick(event) {
        const action = event.target.dataset.action;
        const name = event.target.dataset.name;
        const category = event.target.dataset.category;

        if (action === 'increase-quantity') {
            increaseProductQuantity(name, category);
        } else if (action === 'decrease-quantity') {
            decreaseProductQuantity(name, category);
        }
    }

    function removeCategory(name) {
        categories = categories.filter(category => category !== name);
        products = products.filter(product => product.category !== name);
        populateCategories();
        populateProducts();
        saveData();
    }

    function toggleProductsList(categoryName) {
        const productsListContainer = document.getElementById(`${categoryName}Products`);
        productsListContainer.style.display = productsListContainer.style.display === 'none' ? 'block' : 'none';
    }

    function increaseProductQuantity(productName, categoryName) {
        const product = products.find(prod => prod.name === productName && prod.category === categoryName);
        if (product) {
            product.quantity++;
            saveData();
            populateProducts();
        }
    }

    function decreaseProductQuantity(productName, categoryName) {
        const product = products.find(prod => prod.name === productName && prod.category === categoryName);
        if (product && product.quantity > 0) {
            product.quantity--;
            saveData();
            populateProducts();
        }
    }
});
