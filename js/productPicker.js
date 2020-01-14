let product;
let sliderHeightRef;
let sliderWidthRef;
let sliderGridRef;

(function(root) {
    function Piklor(sel, colors, options) {
        var self = this;
        options = options || {};
        options.open = self.getElm(options.open);
        options.openEvent = options.openEvent || "click";
        options.style = Object(options.style);
        options.style.display = options.style.display || "block";
        options.closeOnBlur = options.closeOnBlur || false;
        options.template = options.template || '<div data-col="{color}" style="background-color: {color}"></div>';
        self.elm = self.getElm(sel);
        self.cbs = [];
        self.isOpen = true;
        self.colors = colors;
        self.options = options;
        self.render();
        if (options.open) {
            options.open.addEventListener(options.openEvent, function(ev) {
                self.isOpen ? self.close() : self.open()
            })
        }
        self.elm.addEventListener("click", function(ev) {
            var col = ev.target.getAttribute("data-col");
            if (!col) {
                return
            }
            self.set(col);
            self.close()
        });
        if (options.closeOnBlur) {
            window.addEventListener("click", function(ev) {
                if (ev.target != options.open && ev.target != self.elm && self.isOpen) {
                    self.close()
                }
            })
        }
        if (options.autoclose !== false) {
            self.close()
        }
    }
    Piklor.prototype.getElm = function(el) {
        if (typeof el === "string") {
            return document.querySelector(el)
        }
        return el
    };
    Piklor.prototype.render = function() {
        var self = this,
            html = "";
        self.colors.forEach(function(c) {
            html += self.options.template.replace(/\{color\}/g, c)
        });
        self.elm.innerHTML = html
    };
    Piklor.prototype.close = function() {
        this.elm.style.display = "none";
        this.isOpen = false
    };
    Piklor.prototype.open = function() {
        this.elm.style.display = this.options.style.display;
        this.isOpen = true
    };
    Piklor.prototype.colorChosen = function(cb) {
        this.cbs.push(cb)
    };
    Piklor.prototype.set = function(c, p) {
        var self = this;
        self.color = c;
        if (p === false) {
            return
        }
        self.cbs.forEach(function(cb) {
            cb.call(self, c)
        })
    };
    root.Piklor = Piklor
})(this);

function createElements() {
    // product
    product = new DrawProduct(1);

    //color palette
    var colorArray = [
        "#3498DB"
        ,"#2ECC71"
        , "#F1C40F"
        , "#E67E22"
        , "#E74C3C"
        , "#000000"];

    var pk = new Piklor(".color-picker", colorArray, {open: ".picker-wrapper .btnn"});
    // color-picker callback function
    pk.colorChosen(function (col) {
        document.getElementById("ColorButton").style.background = col;
        product.updateShirtColor(col);

    });

    // sliders
    new Slider('sliderHeight', 30, 50, 1, 44, 'hauteur ', ' cm');
    new Slider('sliderWidth', 35, 55, 1, 44, 'largeur ', ' cm');
    new Slider('sliderGrid', 0.5, 20, 0.5, 5, 'grille ', ' cm');

    // siders call back functions
    sliderGridRef = document.getElementById('sliderGrid');
    sliderGridRef.noUiSlider.on('update', function (values, handle) {
        product.setGridInterval = sliderGridRef.noUiSlider.get();
        product.changeGridScale();
    });


    // siders call back functions
    sliderHeightRef = document.getElementById('sliderHeight');
    sliderWidthRef = document.getElementById('sliderWidth');
    sliderHeightRef.noUiSlider.on('update', function (values, handle) {
        product.updateShirtSizes(sliderHeightRef.noUiSlider.get(), sliderWidthRef.noUiSlider.get());
    });

    sliderWidthRef.noUiSlider.on('update', function (values, handle) {
        product.updateShirtSizes(sliderHeightRef.noUiSlider.get(), sliderWidthRef.noUiSlider.get());
    });
}

function redraw() {
    product.updateGrid();
    product.updateShirtSizes(sliderHeightRef.noUiSlider.get(), sliderWidthRef.noUiSlider.get());
}

window.onresize = redraw;