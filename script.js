// الكود الكامل لـ JavaScript
let products = {
    main: [],
    secondary: []
};

const translations = {
    en: {
        site_title: 'Marketing World',
        main1_title: 'Main Product Name Here', main1_price: '$99.99', main1_desc: 'Short description highlighting features and benefits.',
        main2_title: 'Secondary Product Name', main2_price: '$79.99', main2_desc: 'Short description for the secondary product.',
        s1_title: 'Small Product 1', s1_price: '$49.99', s2_title: 'Small Product 2', s2_price: '$39.99',
        s3_title: 'Small Product 3', s3_price: '$29.99', btn_preview: 'Preview', btn_buy: 'Buy Now',
        email_placeholder: 'Enter your email to get exclusive offers', btn_subscribe: 'Subscribe Now',
        add_main: 'Add Main Product', add_secondary: 'Add Secondary Product', save_all: 'Save All',
        export_data: 'Export Data', import_data: 'Import Data',
        footer_text: '© 2025 Marketing World. All rights reserved.', saved_text: '💾 All changes saved'
    },
    ar: {
        site_title: 'عالم التسويق',
        main1_title: 'اسم المنتج الرئيسي هنا', main1_price: '$99.99', main1_desc: 'وصف مختصر يبرز مميزات وفوائد المنتج.',
        main2_title: 'اسم المنتج الثانوي', main2_price: '$79.99', main2_desc: 'وصف مختصر للمنتج الثانوي.',
        s1_title: 'منتج مصغر 1', s1_price: '$49.99', s2_title: 'منتج مصغر 2', s2_price: '$39.99',
        s3_title: 'منتج مصغر 3', s3_price: '$29.99', btn_preview: 'معاينة', btn_buy: 'اشتري الآن',
        email_placeholder: 'أدخل بريدك الإلكتروني للحصول على عروض حصرية', btn_subscribe: 'اشترك الآن',
        add_main: 'إضافة منتج رئيسي', add_secondary: 'إضافة منتج ثانوي', save_all: 'حفظ الكل',
        export_data: 'تصدير البيانات', import_data: 'استيراد البيانات',
        footer_text: '© 2025 عالم التسويق. جميع الحقوق محفوظة.', saved_text: '💾 تم حفظ كل التغييرات'
    }
};

let currentLang = 'en';

async function main() {
    await loadSavedData();
    setupEventListeners();
    setupDragAndDrop();
    loadLanguagePreference();
    renderAllProducts();
}

main();

function loadLanguagePreference() {
    const saved = localStorage.getItem('mw_lang');
    if (saved) currentLang = saved;
    applyLanguage(currentLang);
}

function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('arabic', lang === 'ar');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) el.placeholder = translations[lang][key];
    });

    localStorage.setItem('mw_lang', lang);
}

function setupEventListeners() {
    document.getElementById('btnEnglish').addEventListener('click', () => {
        applyLanguage('en');
        showNotification('🌐 English selected');
        renderAllProducts();
    });

    document.getElementById('btnArabic').addEventListener('click', () => {
        applyLanguage('ar');
        showNotification('🌐 تم التبديل إلى العربية');
        renderAllProducts();
    });

    document.getElementById('subscribeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('emailInput').value;
        if (isValidEmail(email)) {
            showNotification('🎉 ' + (currentLang === 'ar' ? 'شكراً للاشتراك!' : 'Thanks for subscribing!'));
            document.getElementById('emailInput').value = '';
        }
    });

    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

function setupDragAndDrop() {
    document.querySelectorAll('.product-image').forEach(el => {
        el.addEventListener('dragover', function(e) {
            e.preventDefault();
            el.classList.add('drag-over');
        });

        el.addEventListener('dragleave', function() {
            el.classList.remove('drag-over');
        });

        el.addEventListener('drop', function(e) {
            e.preventDefault();
            el.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) handleImageUpload(files[0], el);
        });

        el.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                if (e.target.files[0]) handleImageUpload(e.target.files[0], el);
            };
            input.click();
        });
    });
}

function handleImageUpload(file, el) {
    if (!file.type.startsWith('image/')) {
        showNotification('❌ ' + (currentLang === 'ar' ? 'الرجاء اختيار صورة فقط' : 'Please select an image only'));
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const productEl = el.closest('[data-id]');
        const productId = parseInt(productEl.dataset.id);
        const product = findProductById(productId);
        if (product) {
            product.image = e.target.result;
            renderAllProducts();
            saveToLocalStorage();
            showNotification('✅ ' + (currentLang === 'ar' ? 'تم تحميل الصورة' : 'Image uploaded'));
        }
    };
    reader.readAsDataURL(file);
}

function previewProduct(productId) {
    const product = findProductById(productId);
    if (!product) return;

    const modal = document.getElementById('previewModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');

    modalTitle.textContent = product.title;
    modalPrice.textContent = product.price;

    if (product.image) {
        modalImage.src = product.image;
        modalImage.style.display = 'block';
    } else {
        modalImage.style.display = 'none';
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('previewModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function buyProduct(link) {
    if (link && link !== '#') {
        window.open(link, '_blank');
    } else {
        showNotification('❌ ' + (currentLang === 'ar' ? 'رابط الشراء غير متوفر' : 'Purchase link not available'));
    }
}

function addNewProduct(type) {
    document.getElementById('addProductType').value = type;
    document.getElementById('addModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function handleAddFormSubmit(e) {
    e.preventDefault();
    const type = document.getElementById('addProductType').value;
    const newProduct = {
        id: Date.now(),
        title: document.getElementById('addTitle').value,
        price: document.getElementById('addPrice').value,
        description: document.getElementById('addDescription').value,
        image: document.getElementById('addImage').value,
        link: document.getElementById('addLink').value
    };

    if (type === 'main') {
        products.main.push(newProduct);
    } else {
        products.secondary.push(newProduct);
    }

    closeAddModal();
    renderAllProducts();
    saveToLocalStorage();
    showNotification('✅ ' + (currentLang === 'ar' ? 'تمت الإضافة' : 'Product added'));
    document.getElementById('addForm').reset();
}

function deleteProduct(productId) {
    if (confirm(currentLang === 'ar' ? 'هل تريد الحذف؟' : 'Delete this product?')) {
        products.main = products.main.filter(p => p.id !== productId);
        products.secondary = products.secondary.filter(p => p.id !== productId);
        renderAllProducts();
        saveToLocalStorage();
        showNotification('✅ ' + (currentLang === 'ar' ? 'تم الحذف' : 'Product deleted'));
    }
}

function replaceImage(productId) {
    const product = findProductById(productId);
    if (!product) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        if (e.target.files[0]) handleImageUpload(e.target.files[0], document.querySelector(`[data-id="${productId}"] .product-image`));
    };
    input.click();
}

function findProductById(productId) {
    return [...products.main, ...products.secondary].find(p => p.id === productId);
}

function renderAllProducts() {
    renderProducts('.main-products', products.main, 'large');
    renderProducts('.secondary-products', products.secondary, 'small');
    setupDragAndDrop();
}

function renderProducts(selector, productList, type) {
    const container = document.querySelector(selector);
    if (!container) return;

    container.innerHTML = productList.map(product => `
        <div class="product-${type}" data-id="${product.id}">
            <div class="product-image" draggable="true">
                ${product.image ? `<img src="${product.image}" alt="${product.title}">` : ''}
                <div class="image-actions">
                    <button class="btn-edit" onclick="openEditModal(${product.id})">✏️</button>
                    <button class="btn-replace" onclick="replaceImage(${product.id})">🔄</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">🗑️</button>
                </div>
            </div>
            <div class="product-title">${product.title}</div>
            <div class="product-price">${product.price}</div>
            ${type === 'large' ? `<div class="product-description">${product.description || ''}</div>` : ''}
            <div class="product-buttons">
                <button class="btn-preview" onclick="previewProduct(${product.id})">${translations[currentLang].btn_preview}</button>
                <button class="btn-buy" onclick="buyProduct('${product.link}')">${type === 'large' ? translations[currentLang].btn_buy : (currentLang === 'ar' ? 'شراء' : 'Buy')}</button>
            </div>
        </div>
    `).join('');
}

function updateProductText(element) {
    const productElement = element.closest('[data-id]');
    const productId = parseInt(productElement.dataset.id);
    const product = findProductById(productId);
    if (!product) return;

    const value = element.textContent.trim();
    if (element.classList.contains('product-title')) product.title = value;
    if (element.classList.contains('product-price')) product.price = value;
    if (element.classList.contains('product-description')) product.description = value;

    saveToLocalStorage();
    showNotification('💾 ' + (currentLang === 'ar' ? 'تم الحفظ' : 'Saved'));
}

function saveToLocalStorage() {
    localStorage.setItem('marketingProducts', JSON.stringify(products));
}

async function loadSavedData() {
    const saved = localStorage.getItem('marketingProducts');
    if (saved) {
        try {
            products = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading data from localStorage', e);
        }
    } else {
        try {
            const response = await fetch('products-backup.json');
            products = await response.json();
        } catch (error) {
            console.error('Error loading initial products:', error);
        }
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function saved_text() {
    return translations[currentLang].saved_text;
}

window.previewProduct = previewProduct;
window.buyProduct = buyProduct;
window.addNewProduct = addNewProduct;
window.deleteProduct = deleteProduct;
window.replaceImage = replaceImage;
window.openEditModal = openEditModal;
window.exportData = exportData;
window.importData = importData;

document.getElementById('editModalCloseBtn').addEventListener('click', closeEditModal);
document.getElementById('editForm').addEventListener('submit', handleEditFormSubmit);
document.getElementById('addModalCloseBtn').addEventListener('click', closeAddModal);
document.getElementById('addForm').addEventListener('submit', handleAddFormSubmit);

function openEditModal(productId) {
    const product = findProductById(productId);
    if (!product) return;

    document.getElementById('editProductId').value = product.id;
    document.getElementById('editTitle').value = product.title;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editDescription').value = product.description || '';
    document.getElementById('editLink').value = product.link || '';

    document.getElementById('editModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function handleEditFormSubmit(e) {
    e.preventDefault();
    const productId = parseInt(document.getElementById('editProductId').value);
    const product = findProductById(productId);
    if (!product) return;

    product.title = document.getElementById('editTitle').value;
    product.price = document.getElementById('editPrice').value;
    product.description = document.getElementById('editDescription').value;
    product.link = document.getElementById('editLink').value;

    closeEditModal();
    renderAllProducts();
    saveToLocalStorage();
    showNotification('✅ ' + (currentLang === 'ar' ? 'تم تحديث المنتج' : 'Product updated'));
}

function exportData() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products-backup.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('✅ ' + (currentLang === 'ar' ? 'تم تصدير البيانات' : 'Data exported'));
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const importedProducts = JSON.parse(e.target.result);
                if (importedProducts.main && importedProducts.secondary) {
                    products = importedProducts;
                    renderAllProducts();
                    saveToLocalStorage();
                    showNotification('✅ ' + (currentLang === 'ar' ? 'تم استيراد البيانات' : 'Data imported'));
                } else {
                    showNotification('❌ ' + (currentLang === 'ar' ? 'ملف غير صالح' : 'Invalid file format'));
                }
            } catch (error) {
                showNotification('❌ ' + (currentLang === 'ar' ? 'خطأ في قراءة الملف' : 'Error reading file'));
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
