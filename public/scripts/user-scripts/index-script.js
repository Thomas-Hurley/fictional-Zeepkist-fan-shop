const selectedCatagory = document.getElementById('selectedCatagory');
const productSection = document.getElementById('productSection');

// GET DATA --------------------------------------------------------------------------------------------------------

fetch('../../db/products-data.json')
    .then(response => response.text())
    .then(data => verwerkData(JSON.parse(data)));

function verwerkData(data) {
    let dataStringified = JSON.stringify(data);

    const localStorageInStockData = localStorage.getItem('productsInStock');
    if (localStorageInStockData == null) {
        localStorage.setItem('productsInStock', dataStringified);
    }

    let dataDestringified = JSON.parse(localStorage.getItem('productsInStock'));

    createProductCard(dataDestringified);
}

// CREATE PRODUCT CARDS--------------------------------------------------------------------------------------------------------

function createProductCard(usableData) {
    for (let i = 0; i < usableData.length; i++) {
        let newProduct = document.createElement('div');
        newProduct.classList = 'card col-span-2 lg:col-span-1 p-5 bg-white rounded-lg shadow-lg shadow-gray-500 font-mono';
        newProduct.innerHTML = `
                <p class="stock">In Stock:<span>${usableData[i].inStock}</span></p>
                <div class="flex flex-col items-center gap-1">
                    <img class="w-50 aspect-square my-5" src="${usableData[i].image}" alt="productimage${usableData[i].id}">
                    <p class="text-md lg:text-lg">${usableData[i].name}</p>
                    <p class="price text-lg font-black" id="currentProductAmount${i}">€<span>${Number.parseFloat(usableData[i].price).toFixed(2)}</span></p>
                    <div class="flex flex-col lg:flex-row gap-1">
                        <button data-product-id="${usableData[i].id}" id="addItemButton" class="hover:cursor-pointer border-solid border-1 p-1 text-sm rounded-md hover:bg-green-200">Add to cart</button>
                        <button data-product-id="${usableData[i].id}" id="removeItemButton" class="hover:cursor-pointer border-solid border-1 p-1 text-sm rounded-md hover:bg-red-200">Remove from cart</button>
                    </div>
                </div>
            `;
        productSection.appendChild(newProduct);
    }
    changeProductBtnsListener();
}

// FILTER PRODUCT CARDS --------------------------------------------------------------------------------------------------------

function filterProductCards(productType) {
    const productsForFilter = JSON.parse(localStorage.getItem('productsInStock'));
    let backupData = JSON.stringify(productsForFilter);
    if (productType == 'beanies') {
        let toBeSentDataBeanies = [];
        for (let i = 0; i < productsForFilter.length; i++) {
            const selectedProductType = productsForFilter[i].catagory;
            if (selectedProductType == 'beanies') {
                toBeSentDataBeanies.push(productsForFilter[i]);
                localStorage.setItem('productsInStock', toBeSentDataBeanies);
            }
        }
        productSection.innerHTML = '';
        createProductCard(toBeSentDataBeanies);
    }

    if (productType == 'helmets') {
        let toBeSentDataHelmets = [];
        for (let i = 0; i < productsForFilter.length; i++) {
            const selectedProductType = productsForFilter[i].catagory;
            if (selectedProductType == 'racing helmets') {
                toBeSentDataHelmets.push(productsForFilter[i]);
                localStorage.setItem('productsInStock', toBeSentDataHelmets);
            }
        }
        productSection.innerHTML = '';
        createProductCard(toBeSentDataHelmets);
    }

    if (productType == 'tophats') {
        let toBeSentDataTopHats = [];
        for (let i = 0; i < productsForFilter.length; i++) {
            const selectedProductType = productsForFilter[i].catagory;
            if (selectedProductType == 'top hats') {
                toBeSentDataTopHats.push(productsForFilter[i]);
                localStorage.setItem('productsInStock', toBeSentDataTopHats);
            }
        }
        productSection.innerHTML = '';
        createProductCard(toBeSentDataTopHats);
    }

    if (productType == 'all') {
        let toBeSentDataAll = [];
        for (let i = 0; i < productsForFilter.length; i++) {
            toBeSentDataAll.push(productsForFilter[i]);
            localStorage.setItem('productsInStock', toBeSentDataAll);
        }
        productSection.innerHTML = '';
        createProductCard(toBeSentDataAll);
    }

    localStorage.setItem('productsInStock', backupData);
}

const filterall = document.getElementById('filter-all');
const filterlg = document.getElementById('filter-beanies');
const filtermd = document.getElementById('filter-helmets');
const filtersm = document.getElementById('filter-tophats');

filterall.addEventListener('click', () => filterProductCards('all'));
filterlg.addEventListener('click', () => filterProductCards('beanies'));
filtermd.addEventListener('click', () => filterProductCards('helmets'));
filtersm.addEventListener('click', () => filterProductCards('tophats'));

// CHANGE PRODUCT AMOUNT --------------------------------------------------------------------------------------------------------

const shoppingCartAmount = document.getElementById('shoppingCartAmount');

let productsInCartList;

if (localStorage.getItem('productsInCartList') == null) {
    productsInCartList = {};
} else {
    productsInCartList = JSON.parse(localStorage.getItem('productsInCartList'));
}

function changeProductAmount(ev, changeValue) {
    const productInStockDisplay = ev.target.closest(".card").querySelector(".stock span").innerText;

    if ((changeValue == -1 && productsInCartList[ev.target.dataset.productId] > 0) || (changeValue == 1 && productInStockDisplay > 0)) {
        const totalInCartAmount = localStorage.getItem('itemInCartAmount');
        if (totalInCartAmount == null) {
            localStorage.setItem(`itemInCartAmount`, changeValue);
        } else {
            const totalInCartAmountParsed = JSON.parse(totalInCartAmount);
            const totalInCartAmountStringified = JSON.stringify(totalInCartAmountParsed + changeValue);
            localStorage.setItem(`itemInCartAmount`, totalInCartAmountStringified);
        }

        const products = JSON.parse(localStorage.getItem('productsInStock'));

        let stock = ev.target.closest(".card").querySelector(".stock span").innerText;
        stock -= changeValue;
        ev.target.closest(".card").querySelector(".stock span").innerText = stock;

        for (let i = 0; i < products.length; i++) {
            const selectedProduct = products[i].id;
            if (selectedProduct == ev.target.dataset.productId) {
                const productNewAmount = stock;
                products[i].inStock = productNewAmount;

                let productNewAmountStringified = JSON.stringify(products);

                localStorage.setItem('productsInStock', productNewAmountStringified);

                if (Object.hasOwn(productsInCartList, `${ev.target.dataset.productId}`)) {
                    productsInCartList[ev.target.dataset.productId] += changeValue;
                    if (productsInCartList[ev.target.dataset.productId] == 0) {
                        delete productsInCartList[ev.target.dataset.productId];
                    }
                    
                } else {
                    productsInCartList[ev.target.dataset.productId] = changeValue;
                }
                const toBeStoredCartData = JSON.stringify(productsInCartList);
                localStorage.setItem(`productsInCartList`, toBeStoredCartData);
            }
        }

        shoppingCartIconAmount();
    }

}

toBeShownPrice = localStorage.getItem('itemInCartPrice');
if (toBeShownPrice == null) {
    localStorage.setItem('itemInCartPrice', 0);
}

function shoppingCartPrice(ev) {
    localStorage.setItem(`itemInCartPrice`, JSON.parse(localStorage.getItem('itemInCartPrice')) + JSON.parse(ev.target.closest(".card").querySelector('.price span').innerText));
}

function changeProductBtnsListener() {
    const addButtons = document.querySelectorAll('#addItemButton');
    const removeButtons = document.querySelectorAll('#removeItemButton');

    for (let i = 0; i < addButtons.length; i++) {
        const addButton = addButtons[i];

        addButton.addEventListener('click', function (ev) {
            changeProductAmount(ev, 1);
        });
        addButton.addEventListener('click', function (ev) {
            shoppingCartPrice(ev);
        });
    }

    for (let i = 0; i < removeButtons.length; i++) {
        const removeButton = removeButtons[i];

        removeButton.addEventListener('click', function (ev) {
            changeProductAmount(ev, -1);
        });
        removeButton.addEventListener('click', function (ev) {
            shoppingCartPrice(ev);
        });
    }
}

function shoppingCartIconAmount() {
    toBeShownAmount = localStorage.getItem('itemInCartAmount')
    if (toBeShownAmount == null) {
        localStorage.setItem('itemInCartAmount', 0);
        shoppingCartAmount.innerText = 0;
    } else {
        shoppingCartAmount.innerText = toBeShownAmount;
    }

}

shoppingCartIconAmount();

// VIEW SHOPPING CART --------------------------------------------------------------------------------------------------------

const shoppingCartButton = document.getElementById('shoppingCartButton');
shoppingCartButton.addEventListener('click', () => document.location='shopping-cart.html');