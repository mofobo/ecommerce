let product;
let sliderHeightRef;
let sliderWidthRef;
let sliderGridRef;

function createElements() {
    // product
    product = new DrawProduct(1);

    //color palette
    var colorArray = [
        "#2ecc71"
        , "#3498db"
        , "#f1c40f"
        , "#e74c3c"
        , "black"];

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