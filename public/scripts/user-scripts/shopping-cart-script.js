// SHOPPING CART AMOUNT AND PRICE --------------------------------------------------------------------------------------------------------

const shoppingCartAmount = document.getElementById('shoppingCartAmount');

toBeShownAmount = localStorage.getItem('itemInCartAmount');

function getShoppingCartIconAmount() {
    if (toBeShownAmount == null) {
        localStorage.setItem('itemInCartAmount', 0);
        shoppingCartAmount.innerText = 0;
    } else {
        shoppingCartAmount.innerText = toBeShownAmount;
    }

}

getShoppingCartIconAmount();

const totalPriceHolder = document.getElementById('totalPriceHolder');

function getShoppingCartPrice() {
    toBeShownPrice = localStorage.getItem('itemInCartPrice');
    if (toBeShownPrice == null) {
        localStorage.setItem('itemInCartPrice', 0);
        totalPriceHolder.innerText = `€${Number.parseFloat(JSON.parse(toBeShownPrice)).toFixed(2)}`;
    } else {
        totalPriceHolder.innerText = `€${Number.parseFloat(JSON.parse(toBeShownPrice)).toFixed(2)}`;
    }
}

getShoppingCartPrice();

// BACK TO SHOPPING --------------------------------------------------------------------------------------------------------

const backToShoppingButton = document.getElementById('backToShoppingButton');
backToShoppingButton.addEventListener('click', () => document.location='index.html');

// CREATE PRODUCT(S) IN CART LIST --------------------------------------------------------------------------------------------------------

const productsinStockData = JSON.parse(localStorage.getItem(`productsInStock`));
const productsInCartData = JSON.parse(localStorage.getItem(`productsInCartList`));

const productSection = document.getElementById('productSection');

const productList = document.getElementById('productList');

function createProductListItem(allProductsData, chosenProductsData) {
    if (chosenProductsData !== null) {
        for (let j = 0; j < Object.keys(chosenProductsData).length; j++) {
            for (let i = 0; i < allProductsData.length; i++) {
                if (Object.keys(chosenProductsData)[j] == allProductsData[i].id) {
                    let newProductSectionItem = document.createElement('div');
                    newProductSectionItem.classList = 'card grid grid-cols-12 py-5 items-center';
                    newProductSectionItem.innerHTML = `
                            <div class="col-span-2">
                                <p class="productAmount">Amount: <span>${chosenProductsData[Object.keys(chosenProductsData)[j]]}</span></p>
                                <p class="stock">In Stock:<span>${allProductsData[i].inStock}</span></p>
                            </div>
                            <img class="w-15 aspect-square col-span-1" src="${allProductsData[i].image}" alt="productimage${allProductsData[i].id}">
                            <p class="font-bold text-2xl col-span-4 px-10">${allProductsData[i].name}</p>
                            <p class="price text-lg col-span-2">€<span>${Number.parseFloat(allProductsData[i].price).toFixed(2)}</span></p>
                            <div class="col-span-1 text-center">
                                <button data-product-id="${allProductsData[i].id}" id="addItemButton"
                                class="hover:cursor-pointer hover:bg-green-600 bg-green-500 rounded-md w-9 h-9 text-white text-xl">+</button>
                            </div>
                            <div class="col-span-1 text-center">
                                <button data-product-id="${allProductsData[i].id}" id="removeItemButton"
                                class="hover:cursor-pointer hover:bg-red-600 bg-red-500 rounded-md w-9 h-9 text-white text-xl">-</button>
                            </div>
                            <div class="col-span-1 text-center">
                                <button data-product-id="${allProductsData[i].id}" id="removeAllItemButton"
                                class="hover:cursor-pointer hover:bg-red-950 bg-red-800 rounded-md w-9 h-9 text-white text-xl">x</button>
                            </div>
                        `;
                    productSection.appendChild(newProductSectionItem);
                    
                    let newProductListItem = document.createElement('div');
                    newProductListItem.classList = 'flex justify-between';
                    newProductListItem.innerHTML = `
                    <p>${chosenProductsData[Object.keys(chosenProductsData)[j]]}x ${allProductsData[i].name}</p>
                    <p>€${Number.parseFloat(allProductsData[i].price * JSON.parse(chosenProductsData[Object.keys(chosenProductsData)[j]])).toFixed(2)}</p>
                    `;
                    productList.appendChild(newProductListItem);
                }
            }
        }
    } else {
        let emptyCartMessage = document.createElement('h1');
        emptyCartMessage.classList = 'text-red-500 text-3xl font-bold';
        emptyCartMessage.innerText = 'There is nothing in your shopping cart :(';
        productSection.appendChild(emptyCartMessage);
    }
    changeItemAmountBtnsListener();
}

createProductListItem(productsinStockData, productsInCartData);

function changeItemInCartAmount(ev, changeValue) {
    let newItemAmount = {};
    const currentItemAmount = JSON.parse(localStorage.getItem(`productsInCartList`));
    newItemAmount = currentItemAmount;
    newItemAmount[ev] += changeValue;
    localStorage.setItem(`productsInCartList`, JSON.stringify(newItemAmount));
    productSection.innerHTML = '';
    productList.innerHTML = '';
    createProductListItem(productsinStockData, newItemAmount);
}

function changeShoppingCartPrice(changeValue) {
    localStorage.setItem(`itemInCartPrice`, JSON.parse(localStorage.getItem('itemInCartPrice')) + changeValue);
    getShoppingCartPrice();
}


function changeItemAmountBtnsListener() {
    const addButtons = document.querySelectorAll('#addItemButton');
    const removeButtons = document.querySelectorAll('#removeItemButton');
    const removeAllButtons = document.querySelectorAll('#removeAllItemButton');
    for (let i = 0; i < addButtons.length; i++) {
        const addButton = addButtons[i];
    
        addButton.addEventListener('click', function (ev) {
            changeItemInCartAmount(ev.target.dataset.productId, 1);
        });
        addButton.addEventListener('click', function (ev) {
            changeShoppingCartPrice(ev, JSON.parse(ev.target.closest(".card").querySelector('.price span').innerText));
        });
    }
    
    for (let i = 0; i < removeButtons.length; i++) {
        const removeButton = removeButtons[i];
    
        removeButton.addEventListener('click', function (ev) {
            changeItemInCartAmount(ev.target.dataset.productId, -1);
        });
        removeButton.addEventListener('click', function (ev) {
            changeShoppingCartPrice(ev, -JSON.parse(ev.target.closest(".card").querySelector('.price span').innerText));
        });
    }
    
    for (let i = 0; i < removeAllButtons.length; i++) {
        const removeAllButton = removeAllButtons[i];
        
        removeAllButton.addEventListener('click', function (ev) {
            const allItemAmount = JSON.parse(ev.target.closest(".card").querySelector(".productAmount span").innerText);
            changeItemInCartAmount(ev.target.dataset.productId, -allItemAmount);
        });
        removeAllButton.addEventListener('click', function (ev) {
            changeShoppingCartPrice(ev, -JSON.parse(ev.target.closest(".card").querySelector('.price span').innerText) * JSON.parse(ev.target.closest(".card").querySelector('.productAmount span').innerText));
        });
    }
}