// Load listener
window.addEventListener('load', () => {

    // select canvas, context
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // ==Controls==
    const randomizerButton = document.getElementById('randomize');
    const resetButton = document.getElementById('reset');

    let slider_sides = document.getElementById('sides');

    let slider_scale = document.getElementById('scale');
    let slider_level = document.getElementById('level');
    let slider_spread = document.getElementById('spread');

    let sliders = document.querySelectorAll('.slider');


    //Labels
    const label_spread = document.querySelector('[for=spread]');
    const label_sides = document.querySelector('[for=sides]');



    // ==Global effects==
    let size = canvas.width < canvas.height ? canvas.width * 0.3: canvas.height * 0.3; 
    let maxLevel = 5; // depth (careful!)
    let branches = 2; // number of parent branches



    let linewidth =  20;
    let sides = 8;
    let scale = Math.random() * 0.4 + 0.4;
    let spread = 1; // Rotation of each branch relative to parent
    // Random hue on load
    let color = 'hsl('+ Math.random(0, 360) * 360 +', 100%, 50%)';


    // Line styles. unaffected by fill styles
    ctx.lineWidth = linewidth;
    ctx.lineCap = 'round';

    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;
    ctx.imageSmoothingEnabled = false;


    function drawBranch(level){

        if(level > maxLevel) return;

        // New start, end point. draw line
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(size, 0);
        ctx.stroke();


        for(let i = 0; i < branches; i++){
            //Outer save/restore
            ctx.save(); 
            ctx.translate(size - (size/branches) * i, 0);
            ctx.scale(scale,scale);

            //Inner save and restore for both positive and negative rotations
            ctx.save(); 
            ctx.rotate(spread);
            drawBranch(level + 1);
            ctx.restore();

            
      
            ctx.restore();
        }
        // Circle for each level
        ctx.beginPath();    
        // start 0, size of branch. radius 50. start angle 0. end angle 360deg(PI*2);
        ctx.arc(0,size, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawFractal(){
        ctx.clearRect(0,0, canvas.width, canvas.height);

        ctx.save();
        ctx.lineWidth = linewidth;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 10;
        ctx.imageSmoothingEnabled = false;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        // Rotates around 0,0 (top left) by default. set new axis with translate 
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(0);
        // h,v scale based on axis
        ctx.scale(1,1);

        
        for(let i = 0; i < sides; i++){
            // rotate the next line (additive)
            // Math.PI * 2 = 360deg (draw whole circle for each side) slice circle into even sections given number of sides
            ctx.rotate((Math.PI * 2)/sides);
            drawBranch(0);

            

        }
        ctx.restore();

        updateSliders();
        randomizerButton.style.backgroundColor = color;
    }
    
    drawFractal();

    function randomizeFractal() {
        // Clear entire canvas
        ctx.clearRect(0,0, canvas.width, canvas.height);
        // math.floor required to return integer from random. Random() * value + min value = max possible value
        sides = Math.floor(Math.random() * 7 + 2);
        scale = Math.random() * 0.4 + 0.4;
        maxLevel = Math.floor(Math.random() * 6 + 2); 
        spread = Math.random() * 2.9 + 0.1;  
        branches = Math.floor(Math.random() * 2 + 2); 
        color = 'hsl('+ Math.random() * 360 +', 100%, 50%)';
    }

    function updateSliders() {
        slider_spread.value = spread;
        // console.log(this.value);
        // Slider returns string value, convert to number with 2 decimal places
        label_spread.innerText = 'Spread: ' + Number(spread).toFixed(2); 
    }
    updateSliders(); // On load

    function resetFractal() {
        // size = canvas.width < canvas.height ? canvas.width * 0.3: canvas.height * 0.3; 
        // linewidth = 15;
        sides = 5;
        scale = 0.5;
        maxLevel = 5; 
        spread = 1; 
        branches = 2; 
        color = 'hsl(290, 100%, 50%)';

    }

    // ==Listeners==
    randomizerButton.addEventListener("click", () => {
        randomizeFractal();
        drawFractal();
    });

    resetButton.addEventListener("click", () => {
        resetFractal();
        drawFractal();
    });

    slider_spread.addEventListener('change', (event) => {
        spread = event.target.value;
        drawFractal();
    });

    // Responsive canvas
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        size = canvas.width < canvas.height ? canvas.width * 0.3: canvas.height * 0.3; 
        drawFractal();
    });

    // slider_sides.addEventListener('change', (event) => {
    //     sides = event.target.value;
    //     updateSliders();
    //     drawFractal();
    // });

    // Trying to not repeat event listeners
    // let slidersArray = Array.from(sliders);
    // slidersArray.forEach(slider => {
    //     slider.addEventListener('change', function update(e){
    //         let newValue = e.target.value;

    //         let targetName = "slider_" + this.name;
    //         // if(targetName == this.name)
            
    //         console.log(this);
    //         drawFractal();
    //     });
    // });
    
});