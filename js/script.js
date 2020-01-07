// Section du DOM dédié à l'affichage des produits en vente
var productsDisplay = document.querySelector("#products-display");

// Section du DOM dédié à l'affichage du panier
var cartTotal = document.querySelector("#cart-total");

var overlayContent = document.querySelector("#overlay-content");
var emptyCartBtn = document.querySelector("#empty-cart");
var checkOutCartBtn = document.querySelector("#check-out");

var owner = document.querySelector('#owner'),
    cardNumber = document.querySelector('#cardNumber'),
    cardNumberField = document.querySelector('#card-number-field'),
    CVV = document.querySelector("#cvv"),
    mastercard = document.querySelector("#mastercard"),
    confirmButton = document.querySelector('#confirm-purchase'),
    visa = document.querySelector("#visa"),
    amex = document.querySelector("#amex");


class Catalog {

    constructor() {
        this.productList = new Array();
        this.initCatalog();
    }

    initCatalog() {
        this.productList.push(new Product(1, 'T-shirt', 'courtes', 12,));
        this.productList.push(new Product(2, 'T-shirt', 'longues', 13));
        this.productList.push(new Product(3, 'shirt', 'courtes', 25, 3));
        this.productList.push(new Product(4, 'shirt', 'longues', 28));
        this.productList.push(new Product(5, 'polo', 'courtes', 15));
        this.productList.push(new Product(6, 'polo', 'longues', 17));
        this.productList.push(new Product(7, 'T-shirt', 'courtes', 12));
        this.productList.push(new Product(8, 'T-shirt', 'longues', 13));
        this.productList.push(new Product(9, 'shirt', 'courtes', 25));
        this.productList.push(new Product(10, 'shirt', 'longues', 28));
        this.productList.push(new Product(11, 'polo', 'courtes', 15));
        this.productList.push(new Product(12, 'polo', 'longues', 17));
        this.productList.push(new Product(13, 'T-shirt', 'courtes', 12));
        this.productList.push(new Product(14, 'T-shirt', 'longues', 13));
        this.productList.push(new Product(15, 'shirt', 'courtes', 25));
        this.productList.push(new Product(16, 'shirt', 'longues', 28));
        this.productList.push(new Product(17, 'polo', 'courtes', 15));
        this.productList.push(new Product(18, 'polo', 'longues', 17));
    }

    getCatalogItem(productId) {
        return this.productList.find(product => product.id === productId);
    }
}

class Product {

    constructor(id, type, sleeve, unitPrice, color = 'white', size = 'M', image = 'null') {
        this.id = id;
        this.type = type;
        this.sleeve = sleeve;
        this.unitPrice = unitPrice;
        this.color = color;
        this.size = size;
        this.image = image;
        this.buy = document.createElement("button");
    }

    // Méthode qui crée l'illustration (SVG) pour le produit
    createIllustration() {
        let svg = document.createElement("svg");
        // svg.innerHTML = this.image; A COMPLETER UNE FOIS QUE LES SVG SONT FONCTIONNELS

        let iframe = document.createElement("iframe");
        iframe.setAttribute('src', svg);
        iframe.setAttribute('width', '150px');
        iframe.setAttribute('height', '150px');

        return iframe;
    }

    // Méthode qui crée la description pour le produit
    createDescription() {
        let div = document.createElement("div");
        div.innerHTML = `${this.type} avec manches ${this.sleeve} <br>
                         ${this.color} - ${this.size} <br>
                         CHF ${this.unitPrice}`;

        return div;
    }

    // Méthode qui crée une carte pour le produit contenant l'illustration, la description et le bouton pour le rajouter au panier
    createCard() {
        let card = document.createElement("div");
        // card.appendChild(this.createIllustration()); // A REACTIVER UNE FOIS QUE LE SVG EST OPERATIONNEL
        let icon = document.createElement("i"); // A EFFACER UNE FOIS QUE LE SVG EST OPERATIONNEL
        icon.classList.add("fas");
        icon.classList.add("fa-tshirt");
        icon.classList.add("fa-7x");
        card.appendChild(icon);
        card.appendChild(this.createDescription());


        this.buy.addEventListener("click", (e) => {
            cart.addOneItem(this)
        });

        let iTag = document.createElement("i");

        this.buy.classList.add("btn");
        iTag.classList.add(["fa", "fa-home"]);
        this.buy.appendChild(iTag);
        //this.buy.innerHTML = "Add to basket";
        card.appendChild(this.buy);

        return card;
    }
}

class CartItem {

    constructor(product, qty = 0) {
        this.id = product.id;
        this.type = product.type;
        this.sleeve = product.sleeve;
        this.unitPrice = product.unitPrice;
        this.color = product.color;
        this.size = product.size;
        this.qty = qty;
        this.totalPrice = function () {
            return this.qty * this.unitPrice;
        }
    }
}

class Cart {

    constructor() {
        this.itemsMap = new Map();
        this.totalPrice = () => {
            let result = 0;
            this.itemsMap.forEach(value => result += value.totalPrice());
            return result;
        }
    }

    addOneItem(product) {
        if (this.itemsMap.has(product.id)) {
            this.itemsMap.get(product.id).qty++;
        } else {
            let newCartItem = new CartItem(product, 1);
            this.itemsMap.set(newCartItem.id, newCartItem)
        }
        this.updateCartView(true);
    }

    restoreItems(product, qty) {
        let newCartItem = new CartItem(product, qty);
        this.itemsMap.set(newCartItem.id, newCartItem)
        this.updateCartView(false);
    }

    removeOneItem(cartItemId) {
        if (this.itemsMap.has(cartItemId)) {
            let cartItem = this.itemsMap.get(cartItemId);
            if (cartItem.qty === 1) {
                this.deleteItem(cartItem.id);
            } else {
                cartItem.qty--;
            }
            this.updateCartView(true);
        }
    }

    deleteItem(cartItemId) {
        this.itemsMap.delete(cartItemId);
        this.updateCartView(true);
        if (this.isEmpty()) {
            this.hide();
        }
    }

    emptyCart() {
        localStorage.clear();
        this.itemsMap.clear();
        this.updateCartView(true);
        this.hide();
    }

    isEmpty() {
        return this.itemsMap.size === 0;
    }

    updateCartView(clearLocalStorage) {

        if (cart.isEmpty()) {
            emptyCartBtn.style.visibility = "hidden";
            checkOutCartBtn.style.visibility = "hidden";
        } else {
            emptyCartBtn.style.visibility = "visible"
            checkOutCartBtn.style.visibility = "visible";
        }

        if (clearLocalStorage) localStorage.clear();
        this.updateTotal();
        this.updateItemList()
    }

    updateTotal() {
        cartTotal.innerHTML = "";
        let totalCart = document.createElement("div");
        localStorage.setItem("totalCart", cart.totalPrice());
        totalCart.innerHTML = `CHF ${cart.totalPrice()}`;
        cartTotal.appendChild(totalCart);
    }

    updateItemList() {
        overlayContent.innerHTML = "";
        this.itemsMap.forEach(item => {
            localStorage.setItem(item.id, item.qty);
            overlayContent.appendChild(createCartItemCard(item));
        });
    }

    show() {
        if (!this.isEmpty()) document.getElementById("overlay").style.display = "block";
    };

    hide() {
        document.getElementById("overlay").style.display = "none";
    };
}

class CheckOutProcess {

    constructor(cart) {
        this.cart=cart;
    }


    validateEmail() {
        var value = document.getElementById("e-mail").value;
        console.log(value);

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
        {
            return true;
        }
        alert("You have entered an invalid email address!")
        return false;
    }

    validateOwner() {
        var value = document.getElementById("owner").value;
        console.log(value);

        if(value.length<3){
            alert("The minimum length of the card owner must be 3")
            return false;
        }
        return true;
    }


    validateCVV() {
        var value = document.getElementById("cvv").value;
        console.log(value);

        var cvvRegex = /^(?:[0-9]{3})$/;

        if(value.match(cvvRegex)){
            return true;
        }
        alert("You must provide a valid CVV number!");
        return false;
    }


    /*
    American Express :- Starting with 34 or 37, length 15 digits.
    Visa :- Starting with 4, length 13 or 16 digits.
    MasterCard :- Starting with 51 through 55, length 16 digits.
     */
    validateCardNumber() {
        var value = document.getElementById("cardNumber").value;
        console.log(value);

        var creditCartRegex;
        var creditCartType;

        var amexRegex = /^(?:3[47][0-9]{13})$/;
        var visaRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        var mastercardRegex = /^(?:5[1-5][0-9]{14})$/;

        if(value.length<15)
        {
            alert("Not a valid credit card number!");
            return false;
        }
        
        
        
        switch (value.charAt(0)) {
            case "3":
                creditCartRegex=amexRegex;
                creditCartType="American Express";
                break;
            case "4":
                creditCartRegex=visaRegex;
                creditCartType="Visa";
                break;
            case "5":
                creditCartRegex=mastercardRegex;
                creditCartType="Master Card";
                break;
            default:
                alert("Not a supported credit card number!");
                return false;
        }

        if(value.match(creditCartRegex))
        {
            return true;
        }
        else
        {
            alert("Not a valid "+creditCartType+" number!");
            return false;
        }

    }

    validateExpirationDate() {
        console.log(document.getElementById("validMonth").value);
        console.log(document.getElementById("validYear").value);
        return true;
    }

    confirmCheckOut() {
        if(this.validateEmail() &&
        this.validateOwner() &&
        this.validateCVV() &&
        this.validateCardNumber() &&
        this.validateExpirationDate()){
            console.log("everything ok")
            this.hideCheckOutCart();
            this.cart.emptyCart();
            alert("thanks for purchasing our products on JS Shop!!!")
        }
    }

    showCheckOutCart() {
        document.getElementById("check-out-overlay").style.display = "block";
    }

    hideCheckOutCart() {
        document.getElementById("check-out-overlay").style.display = "none";
    }
}

var catalog = new Catalog();
var cart = new Cart();
var checkOutProcess = new CheckOutProcess(cart);


/* =========================================================================================================

   ========================================================================================================= */

function createCartItemCard(cartItem) {

    let deleteItemBtn = document.createElement("button");
    deleteItemBtn.innerHTML = "x";
    deleteItemBtn.addEventListener("click", () => {
        cart.deleteItem(cartItem.id);
    });

    let decreaseItemBtn = document.createElement("button");
    decreaseItemBtn.innerHTML = "-";
    decreaseItemBtn.addEventListener("click", () => {
        cart.removeOneItem(cartItem.id);
    });

    let increaseItemBtn = document.createElement("button");
    increaseItemBtn.innerHTML = "+";
    increaseItemBtn.addEventListener("click", () => {
        cart.addOneItem(catalog.getCatalogItem(cartItem.id));
    });


    let itemDescription = document.createElement("span");
    itemDescription.innerHTML = `${cartItem.type} - ${cartItem.sleeve} - ${cartItem.color} - ${cartItem.size}`;
    itemDescription.appendChild(deleteItemBtn);

    let quantityAndUnitPrice = document.createElement("span");
    quantityAndUnitPrice.innerHTML = `CHF ${cartItem.unitPrice} x ${cartItem.qty}`;
    quantityAndUnitPrice.appendChild(decreaseItemBtn);
    quantityAndUnitPrice.appendChild(increaseItemBtn);

    let div = document.createElement("div");
    div.classList.add("basketItem");
    div.appendChild(itemDescription);
    div.appendChild(quantityAndUnitPrice);
    return div;
}

var filterAndDisplayCatalog = () => {
    let result = catalog.productList.slice();

    let type = productTypeFilter.value;
    let sleeve = sleevesOptionFilter.value;

    if (type !== "all")
        result = result.filter(product => product.type === type);

    if (sleeve !== "all")
        result = result.filter(product => product.sleeve === sleeve);

    productsDisplay.innerHTML = "";

    result.forEach(element => {
        productsDisplay.appendChild(element.createCard())
    })
};


productTypeFilter = document.querySelector("#product-type");
sleevesOptionFilter = document.querySelector("#sleeves-option");

productTypeFilter.addEventListener("change", filterAndDisplayCatalog);
sleevesOptionFilter.addEventListener("change", filterAndDisplayCatalog);

function restoreCartFromLocalStorage() {
    let totalCart = localStorage.getItem("totalCart");
    catalog.productList.forEach(value => {
        let qty = localStorage.getItem(value.id);
        if (qty) {
            cart.restoreItems(catalog.getCatalogItem(value.id), qty);
        }
    })
}

restoreCartFromLocalStorage();

filterAndDisplayCatalog();

this.cart.updateCartView(false)