// Section du DOM dédié à l'affichage des produits en vente
var productsDisplay = document.querySelector("#products-display");

// Section du DOM dédié à l'affichage du panier
var basket = document.querySelector("#basket");

// Collection pour stocker les produits
var products = new Array();

// On crée une copie qui contient la liste de tous les produits avant filtrage
var productsUnfiltered = products.slice();

/* =========================================================================================================
    La classe Product représente les produits offerts à la vente.
   ========================================================================================================= */

class Product {

    constructor(productType, sleevesOption, price, color='white', size='M', image='null') {
        this.productType = productType;
        this.sleevesOption = sleevesOption;
        this.price = price;
        this.color = color;
        this.size = size;
        this.image = image;
        this.buy = document.createElement("button"); // Hack : le bouton qui permet de rajouter un produit au panier fait partie de l'objet Product
        products.push(this); // On rajoute chaque instance de Product à la collection products
        productsUnfiltered = products.slice(); // On tient à jour la copie des produits non-filtrés
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
        div.innerHTML = `${this.productType} avec manches ${this.sleevesOption} <br>
                         ${this.color} - ${this.size} <br>
                         CHF ${this.price}`;

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
            updateBasket(e); 
            displayBasket();
        });
        this.buy.innerHTML = "Add to basket";
        card.appendChild(this.buy);

        return card;
    }

    // Méthode qui vérifie le type de produit
    filterType() {
        return (this.productType == productTypeFilter.value);
    }

    // Méthode qui vérifie l'option "manches" du produit
    filterSleeves() {
        return (this.sleevesOption == sleevesOptionFilter.value);
    }

}

/* =========================================================================================================

   ========================================================================================================= */

    // Tag HTML "select" pour filtrer les produits

    var productTypeFilter = document.querySelector("#product-type");
    var sleevesOptionFilter = document.querySelector("#sleeves-option");

    // Fonction qui restaure la liste des produits avant tous filtrage
    function resetProducts() {
        products = productsUnfiltered.slice();
    }

    // Fonction qui affiche une collection de produits en appelant la méthode createCard() pour chaque instance
    function displayProducts(collection) {
        productsDisplay.innerHTML = ""; // reset

        collection.forEach(element => {
            productsDisplay.appendChild(element.createCard());
        
        console.log(productTypeFilter.value);
        console.log(sleevesOptionFilter.value);
        });
    }

    // Fonction qui restreint la liste de produits à ceux qui correspondent aux deux filtres
    function updateProducts() {
        resetProducts();
        products = products.filter(product => product.filterType()).filter(product => product.filterSleeves());
    } 

    // Couplage de l'appel des fonctions de mise a jour de la liste produits et d'affichage au changement de valeur des filtres
    productTypeFilter.addEventListener("change", () => {
        updateProducts();
        displayProducts(products);
    });
    sleevesOptionFilter.addEventListener("change", () => {
        updateProducts();
        displayProducts(products);
    });

/* =========================================================================================================
    La classe BasketItem représente les produits rajoutés au panier
   ========================================================================================================= */

    // Définition d'un dictionnaire qui représente le contenu du panier {produit => quantité, ...}
    var basketItems = new Map(); 

    class BasketItem {

        // On instanciera une nouvelle instance à chaque fois qu'un nouveau produit est rajouté au panier
        constructor(Product) {
            this.Product = Product;
            this.quantity = 1; // On initialise la quantité à 1
            basketItems.set(this.Product, this.quantity); // On maintient la collection de produits dans le panier

            console.log(basketItems);
        }

    }

/* =========================================================================================================

   ========================================================================================================= */

    // Fonction appelée quand un bouton "buy" est cliqué
    function updateBasket(e) {
        products.forEach(product => {
            if (e.target == product.buy) {
                // si le produit existe deja dans le panier, on incrémente sa quantité
                if(basketItems.has(product)) {
                    basketItems.set(product, basketItems.get(product) + 1);
                // sinon on instancie un nouvel objet BasketItem
                } else {
                    new BasketItem(product);
                }
            }
        });
        console.log(basketItems);

    }

    // Fonction qui calcule le montant total du panier
    function basketTotal() {
        let total = 0;

        for (var [key, value] of basketItems) {
            total += key.price * value;
        };

        return total;
    }

    // Fonction qui crée la structure prête à être afficher pour un produit dans le panier
    function createBasketCard(key) {
        let div = document.createElement("div");
        div.classList.add("basketItem");

        // Description du produit
        let spanLeft = document.createElement("span");
        spanLeft.innerHTML = `${key.productType} - ${key.sleevesOption} - ${key.color} - ${key.size}`;
        div.appendChild(spanLeft);

        // Prix et quantité du produit
        let spanRight = document.createElement("span");
        spanRight.innerHTML = `CHF ${key.price} x ${basketItems.get(key)}`;
        
        // Bouton qui permet de décrémenter la quantité d'un produit
        let minus = document.createElement("button");
        minus.innerHTML = "-";

        minus.addEventListener("click", function() {
            console.log(basketItems.get(key));
            if (basketItems.get(key) > 0) {
                basketItems.set(key, basketItems.get(key) - 1);
            }
            console.log(basketItems.get(key));
            
            displayBasket();
        });

        spanRight.appendChild(minus);

        // Bouton qui permet d'incrémenter la quantité d'un produit
        let plus = document.createElement("button");
        plus.innerHTML = "+";

        plus.addEventListener("click", function() {
            console.log(basketItems.get(key));
            basketItems.set(key, basketItems.get(key) + 1);
            console.log(basketItems.get(key));
            
            displayBasket();
        });
        
        spanRight.appendChild(plus);

        div.appendChild(spanRight);

        // Si la quantité du produit est nulle, on cache le div correspondant en rajoutant une classe CSS
        if (basketItems.get(key) == 0) {
            div.classList.add("hidden");
            basketItems.delete(key);
        }

        return div;
    }

    // Fonction qui itère sur les produits du panier pour les afficher, puis rajoute le montant total du panier
    function displayBasket() {
        basket.innerHTML = ""; // reset (pas nécessaire, mais pourquoi pas...)

        for (var key of basketItems.keys()) {
            basket.appendChild(createBasketCard(key));
        };

        let divTotal = document.createElement("div");
        divTotal.innerHTML = `CHF ${basketTotal()}`;
        basket.appendChild(divTotal);

    }

/* =========================================================================================================
    Instanciations de quelques produits pour tester
   ========================================================================================================= */

    // A REMPLACER PAR LA REQUETE A LA BASE DE DONNEES, 
    // PAS LA PEINE DE FILTRER LORS DE LA REQUETE, LE FILTRAGE SE FAIT EN AVAL DANS LE JAVASCRIPT
    // POUR CHAQUE N-UPPLET, IL FAUT INSTANCIER UN NOUVEAU Product COMME FAIT ICI AVEC LES DONNEES COLLECTEES
    var product1 = new Product('T-shirt', 'courtes', 12);
    var product2 = new Product('T-shirt', 'longues', 13);
    var product3 = new Product('shirt', 'courtes', 25);
    var product4 = new Product('shirt', 'longues', 28);
    var product5 = new Product('polo', 'courtes', 15);
    var product6 = new Product('polo', 'longues', 17);
    var product7 = new Product('T-shirt', 'courtes', 12);
    var product8 = new Product('T-shirt', 'longues', 13);
    var product9 = new Product('shirt', 'courtes', 25);
    var product10 = new Product('shirt', 'longues', 28);
    var product11 = new Product('polo', 'courtes', 15);
    var product12 = new Product('polo', 'longues', 17);
    var product13 = new Product('T-shirt', 'courtes', 12);
    var product14 = new Product('T-shirt', 'longues', 13);
    var product15 = new Product('shirt', 'courtes', 25);
    var product16 = new Product('shirt', 'longues', 28);
    var product17 = new Product('polo', 'courtes', 15);
    var product18 = new Product('polo', 'longues', 17);

    console.log(products);
    console.log(basketItems);

    // A FAIRE:
    // UTILISER LES ENTREES FORMULAIRES width ET height POUR EDITER LES SVG
    // SVG DOIVENT CONTENIR DES VARIABLES PREDEFINIES ${width} ET ${height} PRETES A ETRE MODIFIEE