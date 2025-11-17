document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const addMainProductBtn = document.getElementById('add-main-product');
    const addSecondaryProductBtn = document.getElementById('add-secondary-product');
    const saveAllBtn = document.getElementById('save-all');
    const exportDataBtn = document.getElementById('export-data');
    const importDataBtn = document.getElementById('import-data');
    const clearDataBtn = document.getElementById('clear-data');

    const previewModal = document.getElementById('preview-modal');
    const editModal = document.getElementById('edit-modal');
    const addModal = document.getElementById('add-modal');

    const closeButtons = document.querySelectorAll('.close-button');

    const addForm = document.getElementById('add-form');
    const editForm = document.getElementById('edit-form');
    let editingIndex = null;

    let products = [];

    function saveProducts() {
        localStorage.setItem('products', JSON.stringify(products));
    }

    async function loadProducts() {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
            renderProducts();
        } else {
            try {
                const response = await fetch('products.json');
                products = await response.json();
                renderProducts();
            } catch (error) {
                console.error('Error loading initial products:', error);
            }
        }
    }

    function renderProducts() {
        console.log("Rendering products:", JSON.stringify(products));
        productsContainer.innerHTML = '';
        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.imageUrl || 'https://via.placeholder.com/150'}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <p>${product.description}</p>
                <button class="preview-btn" data-index="${index}">Preview</button>
                <a href="${product.buyLink}" target="_blank"><button>Buy Now</button></a>
                <button class="edit-btn" data-index="${index}">🔄</button>
                <button class="delete-btn" data-index="${index}">🗑️</button>
            `;
            productsContainer.appendChild(productCard);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                products.splice(index, 1);
                saveProducts();
                renderProducts();
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                editingIndex = index;
                const product = products[index];
                document.getElementById('edit-title').value = product.title;
                document.getElementById('edit-price').value = product.price;
                document.getElementById('edit-description').value = product.description;
                document.getElementById('edit-buy-link').value = product.buyLink;
                openModal(editModal);
            });
        });

        document.querySelectorAll('.preview-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                const product = products[index];
                document.getElementById('preview-image').src = product.imageUrl || 'https://via.placeholder.com/150';
                document.getElementById('preview-title').innerText = product.title;
                document.getElementById('preview-price').innerText = `$${product.price}`;
                openModal(previewModal);
            });
        });
    }

    addMainProductBtn.addEventListener('click', () => {
        addForm.reset();
        openModal(addModal);
    });

    addSecondaryProductBtn.addEventListener('click', () => {
        addForm.reset();
        openModal(addModal);
    });

    saveAllBtn.addEventListener('click', saveProducts);

    clearDataBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all data?')) {
            localStorage.removeItem('products');
            location.reload();
        }
    });

    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProduct = {
            title: document.getElementById('add-title').value,
            price: document.getElementById('add-price').value,
            description: document.getElementById('add-description').value,
            buyLink: document.getElementById('add-buy-link').value,
            imageUrl: document.getElementById('add-image-url').value
        };
        products.push(newProduct);
        saveProducts();
        renderProducts();
        closeModal(addModal);
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (editingIndex !== null) {
            const updatedProduct = {
                title: document.getElementById('edit-title').value,
                price: document.getElementById('edit-price').value,
                description: document.getElementById('edit-description').value,
                buyLink: document.getElementById('edit-buy-link').value,
                imageUrl: products[editingIndex].imageUrl // Keep original image url
            };
            products[editingIndex] = updatedProduct;
            saveProducts();
            renderProducts();
            closeModal(editModal);
            editingIndex = null;
        }
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(previewModal);
            closeModal(editModal);
            closeModal(addModal);
        });
    });

    function openModal(modal) {
        modal.style.display = 'block';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    window.addEventListener('click', (event) => {
        if (event.target == previewModal) closeModal(previewModal);
        if (event.target == editModal) closeModal(editModal);
        if (event.target == addModal) closeModal(addModal);
    });

    loadProducts();
});
