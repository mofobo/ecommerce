
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
			this.proportions = new Array(1, 	 1, 	 1.3, 	 1.7,  	 0.7, 	 2,		 1.8,	 2.6, 	 3.2,  	 2.7);
		else if (type === 2) // Tshirt variant 2
			this.proportions = new Array(1, 	 1, 	 1.3, 	 1.7,  	 0.7, 	 2,		 1.8,	 2.6, 	 3.2,  	 1.7); 

		this.eVectors	 = 			{AO : 0, BO : 1, CO : 2, DO : 3, EO : 4, AB : 5, AC : 6, AD : 7, AE : 8, AF : 9};
										

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
			VectorSizePx.push(AOpx * i);	// compute the leght for each segment in pixel based on the values stored in "Proportion"
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
       	path.style.fill='balck';

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

	updateGrid() // for responsive behaivior 
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
