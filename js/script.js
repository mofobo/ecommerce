// Section du DOM dédié à l'affichage des produits en vente
var productsDisplay = document.querySelector("#products-display");

// Section du DOM dédié à l'affichage du panier
var cartTotal = document.querySelector("#cart-total");

var overlayContent = document.querySelector("#overlay-content");
var emptyCartBtn = document.querySelector("#empty-cart");
var checkOutCartBtn = document.querySelector("#check-out");

class DrawProduct
{
    constructor(type)
    {
        // Constants
        this.BoxSize = 1000;// [mm]
        this.GridInterval = 50; //[mm]
        this.xmlns ="http://www.w3.org/2000/svg";
        this.AOcm = 220; //[mm] -> M size

        // Enum
        this.eSizes = {WIDTH : 0, HEIGHT : 1};

        // Every segment is relatif to A0. Proportionm array stores the relatifs values for each segment
        if (type === 1) // Tshirt variant 1
            this.proportions = [1, 	 1, 	 1.3, 	 1.7,  	 0.7, 	 2,		 1.8,	 2.6, 	 3.2,  	 2.7];
        else if (type === 2) // Tshirt variant 2
            this.proportions = [1, 	 1, 	 1.3, 	 1.7,  	 0.7, 	 2,		 1.8,	 2.6, 	 3.2,  	 1.7];

        this.eVectors={AO : 0, BO : 1, CO : 2, DO : 3, EO : 4, AB : 5, AC : 6, AD : 7, AE : 8, AF : 9};


        // Size Div container
        let container = this.getDrawContainer();
        let sizes = this.getContainerSize(container);
        container.style.height = sizes[this.eSizes.WIDTH]+'px';

        // Create svg element
        let svgElment = document.createElementNS(this.xmlns, "svg");
        svgElment.setAttribute('id','IdSvg')
        svgElment.setAttributeNS(null, 'width' ,  '100%');
        svgElment.setAttributeNS(null, 'height',  '100%');
        this.getDrawContainer().appendChild(svgElment);

        // create shirt (path)
        sizes = this.getContainerSize(this.getDrawContainer());
        // find the center of the container xc, yc
        let xc = sizes[this.eSizes.WIDTH]/2;
        let yc = sizes[this.eSizes.HEIGHT]/2;

        // AO vector in px
        let AOpx = sizes[this.eSizes.WIDTH] / this.BoxSize * this.AOcm;

        let VectorSizePx = new Array;
        for (let i of this.proportions) // visit the element in the order it has been declared
        {
            // compute the length for each segment in pixel based on the values stored in "Proportion"
            VectorSizePx.push(AOpx * i);
        }

        // create the path element
        let path = document.createElementNS(this.xmlns, 'path');
        path.setAttribute('id','IdPath');

        // build the path string
        // v -> relatif vertical movement
        // h -> relatif horizontal movement
        // l -> relatif linear movement
        // q -> ralatif quadratic bezièr curve

        // A
        let sd = 'M ' + (xc - VectorSizePx[this.eVectors.AO]) + ' ' + (yc + VectorSizePx[this.eVectors.AE]/2) + ' ';
        // AB
        sd += 'v ' + (-VectorSizePx[this.eVectors.AB]);
        // BC
        sd += 'l ' + (VectorSizePx[this.eVectors.BO] - VectorSizePx[this.eVectors.CO]) + ' ' + (VectorSizePx[this.eVectors.AB] - VectorSizePx[this.eVectors.AC]) + ' ';
        // CD
        sd += 'l ' + (VectorSizePx[this.eVectors.CO] - VectorSizePx[this.eVectors.DO]) + ' ' + (VectorSizePx[this.eVectors.AC] - VectorSizePx[this.eVectors.AD]) + ' ';
        // DE
        sd += 'l ' + (VectorSizePx[this.eVectors.DO] - VectorSizePx[this.eVectors.EO]) + ' ' + (VectorSizePx[this.eVectors.AD] - VectorSizePx[this.eVectors.AE]) + ' ';

        // symmetry
        // EE'
        sd += 'q ' + VectorSizePx[this.eVectors.EO] + ' ' + (VectorSizePx[this.eVectors.AE] - VectorSizePx[this.eVectors.AF]) + ',' + VectorSizePx[this.eVectors.EO]*2 + ' ' + '0' + ' ';
        // E'D'
        sd += 'l ' + (VectorSizePx[this.eVectors.DO] - VectorSizePx[this.eVectors.EO]) + ' ' + (VectorSizePx[this.eVectors.AE] - VectorSizePx[this.eVectors.AD]) + ' ';
        // D'C'
        sd += 'l ' + (VectorSizePx[this.eVectors.CO] - VectorSizePx[this.eVectors.DO]) + ' ' + (VectorSizePx[this.eVectors.AD] - VectorSizePx[this.eVectors.AC]) + ' ';
        // C'B'
        sd += 'l ' + (VectorSizePx[this.eVectors.BO] - VectorSizePx[this.eVectors.CO]) + ' ' + (VectorSizePx[this.eVectors.AC] - VectorSizePx[this.eVectors.AB]) + ' ';
        // B'A'
        sd += 'v ' + (VectorSizePx[this.eVectors.AB]) +' ';
        // A'A
        sd += 'h ' + (-VectorSizePx[this.eVectors.AO]*2);

        path.setAttributeNS(null, 'd',sd);
        path.style.stroke='black';
        path.style.strokeWidth='1px';
        path.style.fill='black';

        this.getSvgContainer().appendChild(path);
    }

    getDrawContainer() // square DIV
    {
        let drawContainer = document.getElementById('IdDrawBox');
        return drawContainer;
    }

    getSvgContainer() // svg element
    {
        let drawContainer = document.getElementById('IdSvg');
        return drawContainer;
    }

    getPathElement()
    {
        let drawContainer = document.getElementById('IdPath');
        return drawContainer;
    }

    getContainerSize(container)
    {
        let arraySize = new Array;
        arraySize[this.eSizes.WIDTH] = container.offsetWidth;
        arraySize[this.eSizes.HEIGHT] = container.offsetHeight;
        return arraySize;
    }

    set setGridInterval(value)
    {
        this.GridInterval = value * 10; // cm->mm
    }

    changeGridScale() // change grid scale, red
    {
        // create grid
        let container = this.getDrawContainer();
        let sizes = this.getContainerSize(container);
        let gridLinesNbr = this.BoxSize/this.GridInterval;	// number of lines
        let gridLinesOffsetPx = sizes[this.eSizes.WIDTH]/this.BoxSize*this.GridInterval; // Offset between lines in px
        let svgParent = this.getSvgContainer();
        let position = gridLinesOffsetPx;

        let existingLines = document.getElementsByTagName('line');

        while(existingLines.length > 0) // erase old lines
        {
            svgParent.removeChild(existingLines[0]);
        }

        //Draw each horizontal and vertical line of the grid
        for (var i = 1; i<gridLinesNbr; i++)
        {
            //x
            this.drawline(svgParent,position,0,position,sizes[this.eSizes.WIDTH],'black',1,'Lx'+i);
            //y
            this.drawline(svgParent,0,position,sizes[this.eSizes.WIDTH],position,'black',1,'Ly'+i);
            position += gridLinesOffsetPx;
        }
    }

    // for responsive behavior
    updateGrid()
    {
        // Size Div container
        let container = this.getDrawContainer();
        let sizes = this.getContainerSize(container);
        container.style.height = sizes[this.eSizes.WIDTH]+'px'; // width = heigth

        // grid
        let gridLinesNbr = this.BoxSize/this.GridInterval;
        let gridLinesOffsetPx = sizes[this.eSizes.WIDTH]/this.BoxSize*this.GridInterval;
        let svgParent = this.getSvgContainer();
        let position = gridLinesOffsetPx;

        for (let i = 1; i<gridLinesNbr; i++)
        {
            document.getElementById('Lx'+i);
            //x
            this.updateLine(svgParent,position,0,position,sizes[this.eSizes.WIDTH],'black',1,'Lx'+i);
            //y
            this.updateLine(svgParent,0,position,sizes[this.eSizes.WIDTH],position,'black',1,'Ly'+i);
            position += gridLinesOffsetPx;
        }
    }

    drawline(svgParent,X1,Y1,X2,Y2,strokeColor,strokeWidth,id)
    {
        let line = document.createElementNS(this.xmlns, 'line');
        line.setAttribute('id',id);
        line.setAttributeNS(null, 'x1', X1);
        line.setAttributeNS(null, 'y1', Y1);
        line.setAttributeNS(null, 'x2', X2);
        line.setAttributeNS(null, 'y2', Y2);
        line.style.stroke=strokeColor;
        line.style.strokeWidth=strokeWidth;
        line.style.strokeOpacity ='0.3';

        svgParent.appendChild(line)
    }

    updateLine(svgParent,X1,Y1,X2,Y2,strokeColor,strokeWidth,id)
    {
        let line = document.getElementById(id);
        line.setAttributeNS(null, 'x1', X1);
        line.setAttributeNS(null, 'y1', Y1);
        line.setAttributeNS(null, 'x2', X2);
        line.setAttributeNS(null, 'y2', Y2);
        line.style.stroke=strokeColor;
        line.style.strokeWidth=strokeWidth;

    }

    updateShirtColor(color)
    {
        // get path element
        let path = this.getPathElement();
        path.style.fill=color;
    }

    updateShirtSizes(height,width)
    {
        // create shirt (path)
        let sizes = this.getContainerSize(this.getDrawContainer());

        // find the center of the container xc, yc
        let xc = sizes[this.eSizes.WIDTH]/2;
        let yc = sizes[this.eSizes.HEIGHT]/2;

        // AO vector in px
        let AOpx = sizes[this.eSizes.WIDTH] / this.BoxSize * width*10/2; // *10 -> cm-> mm
        // AB vector in px
        let ABpx =  sizes[this.eSizes.WIDTH] / this.BoxSize * height*10;

        let VectorSizePx = new Array;
        for (let i of this.proportions) 	// for-of -> visit the element in the order it has been declared
        {
            VectorSizePx.push(AOpx * i);	// compute the leght for each segment in pixel based on the values stored in "Proportion"
        }

        // get path element
        let path = this.getPathElement();

        // build the path string
        // v -> relatif vertical movement
        // h -> relatif horizontal movement
        // l -> relatif linear movement
        // q -> ralatif quadratic bezièr curve

        // A
        let sd = 'M ' + (xc - AOpx) + ' ' + (yc + (VectorSizePx[this.eVectors.AE]-VectorSizePx[this.eVectors.AB] + ABpx)/2) + ' ';
        // AB
        sd += 'v ' + -ABpx + ' '; //(-VectorSizePx[this.eVectors.AB]);
        // BC
        sd += 'l ' + (VectorSizePx[this.eVectors.BO] - VectorSizePx[this.eVectors.CO]) + ' ' + (VectorSizePx[this.eVectors.AB] - VectorSizePx[this.eVectors.AC]) + ' ';
        // CD
        sd += 'l ' + (VectorSizePx[this.eVectors.CO] - VectorSizePx[this.eVectors.DO]) + ' ' + (VectorSizePx[this.eVectors.AC] - VectorSizePx[this.eVectors.AD]) + ' ';
        // DE
        sd += 'l ' + (VectorSizePx[this.eVectors.DO] - VectorSizePx[this.eVectors.EO]) + ' ' + (VectorSizePx[this.eVectors.AD] - VectorSizePx[this.eVectors.AE]) + ' ';

        // symmetry
        // EE'
        sd += 'q ' + VectorSizePx[this.eVectors.EO] + ' ' + (VectorSizePx[this.eVectors.AE] - VectorSizePx[this.eVectors.AF]) + ',' + VectorSizePx[this.eVectors.EO]*2 + ' ' + '0' + ' ';
        // E'D'
        sd += 'l ' + (VectorSizePx[this.eVectors.DO] - VectorSizePx[this.eVectors.EO]) + ' ' + (VectorSizePx[this.eVectors.AE] - VectorSizePx[this.eVectors.AD]) + ' ';
        // D'C'
        sd += 'l ' + (VectorSizePx[this.eVectors.CO] - VectorSizePx[this.eVectors.DO]) + ' ' + (VectorSizePx[this.eVectors.AD] - VectorSizePx[this.eVectors.AC]) + ' ';
        // C'B'
        sd += 'l ' + (VectorSizePx[this.eVectors.BO] - VectorSizePx[this.eVectors.CO]) + ' ' + (VectorSizePx[this.eVectors.AC] - VectorSizePx[this.eVectors.AB]) + ' ';
        // B'A'
        sd += 'v ' + ABpx + ' '; //(VectorSizePx[this.eVectors.AB]) +' ';
        // A'A
        sd += 'h ' + (-AOpx*2);

        path.setAttributeNS(null, 'd',sd);
    }
}

class Slider
{
    constructor(id,min,max,step,startValue,sPrefix,sSuffix)
    {
        var slider = document.getElementById(id);

        noUiSlider.create(slider,
            {
                start: [startValue],
                range: {
                    'min': min,
                    'max': max
                },
                step: step,
                tooltips : wNumb({prefix : sPrefix, suffix : sSuffix, decimals: 1})
            });
    }
}

class Catalog {

    constructor() {
        this.productList = new Array();
        this.initCatalog();
    }

    initCatalog() {
        this.productList.push(new Product(1, 't-shirt', 'homme', 12,"black"));
        this.productList.push(new Product(2, 't-shirt', 'homme', 12,"red"));
        this.productList.push(new Product(3, 't-shirt', 'homme', 12,"yellow"));
        this.productList.push(new Product(4, 't-shirt', 'homme', 12,"green"));
        this.productList.push(new Product(5, 't-shirt', 'homme', 12,"blue"));
        this.productList.push(new Product(6, 't-shirt', 'homme', 12,"orange"));

        this.productList.push(new Product(7, 't-shirt', 'femme', 14,"black"));
        this.productList.push(new Product(8, 't-shirt', 'femme', 14,"red"));
        this.productList.push(new Product(9, 't-shirt', 'femme', 14,"yellow"));
        this.productList.push(new Product(10, 't-shirt', 'femme', 14,"green"));
        this.productList.push(new Product(11, 't-shirt', 'femme', 14,"blue"));
        this.productList.push(new Product(12, 't-shirt', 'femme', 14,"orange"));

        this.productList.push(new Product(13, 'suit', 'homme', 50,"black"));
        this.productList.push(new Product(14, 'suit', 'homme', 50,"red"));
        this.productList.push(new Product(15, 'suit', 'homme', 50,"yellow"));
        this.productList.push(new Product(16, 'suit', 'homme', 50,"green"));
        this.productList.push(new Product(17, 'suit', 'homme', 50,"blue"));
        this.productList.push(new Product(18, 'suit', 'homme', 50,"orange"));

        this.productList.push(new Product(19, 'suit', 'femme', 60,"black"));
        this.productList.push(new Product(20, 'suit', 'femme', 60,"red"));
        this.productList.push(new Product(21, 'suit', 'femme', 60,"yellow"));
        this.productList.push(new Product(22, 'suit', 'femme', 60,"green"));
        this.productList.push(new Product(23, 'suit', 'femme', 60,"blue"));
        this.productList.push(new Product(24, 'suit', 'femme', 60,"orange"));
    }

    getCatalogItem(productId) {
        return this.productList.find(product => product.id === productId);
    }
}

class Product {

    constructor(id, type, gender, unitPrice, color, size = 'M') {
        this.id = id;
        this.type = type;
        this.gender = gender;
        this.unitPrice = unitPrice;
        this.color = color;
        this.size = size;
        this.buy = document.createElement("button");
    }

    // Méthode qui crée l'illustration (SVG) pour le produit
    createIllustration() {
        let svg = document.createElement("svg");
        let iframe = document.createElement("iframe");
        iframe.setAttribute('src', svg);
        iframe.setAttribute('width', '150px');
        iframe.setAttribute('height', '150px');

        return iframe;
    }

    // Méthode qui crée la description pour le produit
    createDescription() {
        let div = document.createElement("div");
        div.innerHTML = `${this.type=="suit"?"Costume":"T-Shirt"} pour ${this.gender} <br>
                         ${this.color} - ${this.size} <br>
                         CHF ${this.unitPrice}`;

        return div;
    }

    // Méthode qui crée une carte pour le produit contenant l'illustration, la description et le bouton pour le rajouter au panier
    createCard(type, gender, color) {
        let card = document.createElement("div");

        var elem = document.createElement("img");
        elem.setAttribute("src", "./img/"+type+"-"+gender+"-"+color+".png");
        elem.setAttribute("height", "100");
        elem.setAttribute("width", "100");
        elem.setAttribute("alt", "image");
        card.appendChild(elem);
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
        this.gender = product.gender;
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

var submitButton = document.getElementById("submit_form");
var form = document.getElementById("email_form");
form.addEventListener("submit", function (e) {
    setTimeout(function() {
        submitButton.value = "Sending...";
        submitButton.disabled = true;
    }, 1);
});

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
    itemDescription.innerHTML = `${cartItem.type} - ${cartItem.gender} - ${cartItem.color} - ${cartItem.size}`;
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
    let gender = genderOptionFilter.value;

    if (type !== "all")
        result = result.filter(product => product.type === type);

    if (gender !== "all")
        result = result.filter(product => product.gender === gender);

    productsDisplay.innerHTML = "";

    result.forEach(element => {
        productsDisplay.appendChild(element.createCard(element.type,element.gender,element.color))
    })
};


productTypeFilter = document.querySelector("#product-type");
genderOptionFilter = document.querySelector("#gender-option");

productTypeFilter.addEventListener("change", filterAndDisplayCatalog);
genderOptionFilter.addEventListener("change", filterAndDisplayCatalog);

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