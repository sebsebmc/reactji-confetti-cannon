let tries = 10;
let initId = setInterval(init, 500);

function init(){
    let elem = document.querySelector("#activity > span > div > div");
    if (elem || tries-- < 1){
        clearInterval(initId);
        console.log(`Stopping interval after ${10-tries} tries`);
    }else{
        return;
    }

    let origin = elem.getBoundingClientRect();
    let drawing = false;
    let lastTimeout;

    var mutObs = new MutationObserver(function(mutations){
        mutations.forEach(function(mut){
            if(drawing) return;
            if(mut.type==="childList" && mut.addedNodes.length > 0 && mut.addedNodes[0].nodeName == 'DIV'){
                let children = mut.addedNodes[0].childNodes;
                if(children[0].nodeName == "IMG"){
                    if(!children[0].completed) {
                        children[0].onload = () => {
                            startAnimation(children[0].src);
                        }
                    }else {
                        startAnimation(children[0].src);
                    }
                }
            }
        })
    })

    mutObs.observe(elem, {childList:true, subtree:true, attributes: true, attributeFilter: ['src']});

    function startAnimation(src){
        drawing = true;
        makeFetti();
        setSrc(src);
        if(lastTimeout) clearTimeout(lastTimeout);
        lastTimeout = setTimeout(endAnimation, 2500);
        setDisplay('block');

    }

    function endAnimation(){
        currentImg = null; 
        drawing=false;
        lastFrame=undefined;
        lastTimeout=undefined;
        setDisplay('none');
    }

    const CONFETTI_COUNT = 50;
    const FETTI_ELEMS = [];
    for(let i=0; i<CONFETTI_COUNT;i++){
        let img = document.createElement('img');
        img.style.zIndex=2;
        img.style.position='fixed';
        img.style.pointerEvents='none';
        img.style.display='none';
        img.style.width='20px';
        img.style.height='20px';
        elem.appendChild(img);
        FETTI_ELEMS.push(img);
    }

    function setDisplay(disp){
        for(let i=0; i<CONFETTI_COUNT;i++){
            FETTI_ELEMS[i].style.display=disp;
        }
    }

    function setSrc(src){
        for(let i=0; i<CONFETTI_COUNT;i++){
            FETTI_ELEMS[i].src=src;
        }
    }

    let currentImg, lastFrame;
    let fetti = [];

    // this should be called once per new reactji so just make all of them at once
    function makeFetti(){
        fetti = [];
        for(let i=0; i<CONFETTI_COUNT; i++){
            fetti.push({
                vx:30+Math.random()*90,
                vy:-20+Math.random()*20,
                x:origin.x-10,
                y:origin.y+30+(-40+Math.random()*20),
            })
        }
    }

    function draw(ts){
        requestAnimationFrame(draw);
        if(!drawing) return;
        if (lastFrame === undefined) {
        lastFrame = ts;
        }
        let diff = ts - lastFrame;
        for(let i=0;i<CONFETTI_COUNT; i++){
            FETTI_ELEMS[i].style.left = `${fetti[i].x}px`;
            FETTI_ELEMS[i].style.top =  `${fetti[i].y}px`;
            fetti[i].x+=fetti[i].vx*(diff/100);
            fetti[i].y+=fetti[i].vy*(diff/100);
            fetti[i].vy+=(diff/100);
            fetti[i].vy*=.999;
            fetti[i].vx*=.99;
        }
        lastFrame = ts;
    }

    requestAnimationFrame(draw);
}