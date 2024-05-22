let categories = [];
let products = [];

document.addEventListener('DOMContentLoaded', function() {
    loadData();

    const categoryForm = document.getElementById('categoryForm');
    const productForm = document.getElementById('productForm');

    categoryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const categoryName = document.getElementById('categoryName').value.trim();
        if (categoryName === '') return;

        addCategory(categoryName);
        saveData();
        categoryForm.reset();
    });

    productForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const productName = document.getElementById('productName').value.trim();
        const productCategory = document.getElementById('productCategory').value;
        const productQuantity = parseInt(document.getElementById('productQuantity').value);

        if (productName === '' || productCategory === '' || isNaN(productQuantity)) return;

        addProduct(productName, productCategory, productQuantity);
        saveData();
        productForm.reset();
    });

    function loadData() {
        fetch('load_data.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar dados. Status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                categories = data.categories || [];
                products = data.products || [];
                populateCategories();
                populateProducts();
            })
            .catch(error => {
                console.error('Erro ao carregar dados:', error);
            });
    }

    function saveData() {
        const data = { categories, products };

        fetch('save_data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao salvar dados. Status: ' + response.status);
                }
                console.log('Dados salvos com sucesso.');
            })
            .catch(error => {
                console.error('Erro ao salvar dados:', error);
            });
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
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.textContent = category;

            const removeButton = document.createElement('i');
            removeButton.className = 'fas fa-trash-alt text-danger me-2';
            removeButton.style.cursor = 'pointer';
            removeButton.addEventListener('click', function() {
                removeCategory(category);
            });
            li.appendChild(removeButton);

            const showProductsButton = document.createElement('button');
            showProductsButton.className = 'btn btn-outline-primary btn-sm';
            showProductsButton.textContent = 'Ver Produtos';
            showProductsButton.style.marginLeft = '10px';
            showProductsButton.addEventListener('click', function() {
                toggleProductsList(category);
            });
            li.appendChild(showProductsButton);

            const productsListContainer = document.createElement('ul');
            productsListContainer.id = `${category}Products`;
            productsListContainer.className = 'list-group mt-2';
            productsListContainer.style.display = 'none'; // Inicialmente oculto

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
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    ${product.name}
                    <div>
                        <span>(${product.quantity})</span>
                        <button class="btn btn-outline-primary btn-sm ms-2" onclick="increaseProductQuantity('${product.name}', '${product.category}')">+</button>
                        <button class="btn btn-outline-primary btn-sm ms-1" onclick="decreaseProductQuantity('${product.name}', '${product.category}')">-</button>
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

    function removeCategory(name) {
        categories = categories.filter(category => category !== name);
        products = products.filter(product => product.category !== name);
        populateCategories();
        saveData();
    }

    window.removeProduct = function(name) {
        products = products.filter(product => product.name !== name);
        populateProducts();
        saveData();
    }

    function toggleProductsList(categoryName) {
        const productsListContainer = document.getElementById(`${categoryName}Products`);
        if (productsListContainer.style.display === 'none') {
            productsListContainer.style.display = 'block';
        } else {
            productsListContainer.style.display = 'none';
        }
    }

    window.increaseProductQuantity = function(productName, categoryName) {
        const product = products.find(prod => prod.name === productName && prod.category === categoryName);
        if (product) {
            product.quantity++;
            saveData();
            populateProducts();
        }
    }

    window.decreaseProductQuantity = function(productName, categoryName) {
        const product = products.find(prod => prod.name === productName && prod.category === categoryName);
        if (product && product.quantity > 0) {
            product.quantity--;
            saveData();
            populateProducts();
        }
    }
});
