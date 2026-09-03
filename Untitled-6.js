< !DOCTYPE html >
    <html lang="es">
        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Cacao Valley - Estilo Pixel Art</title>

                    <style>
                        *{
                            margin:0;
                        padding:0;
                        box-sizing:border-box;
                        touch-action:none;
                        user-select:none;
                        image-rendering:pixelated; /* CLAVE para el estilo pixel nítido */
                        font-family:"Courier New", monospace;
}

                        body{
                            overflow:hidden;
                        background:#a8d8a8;
}

                        canvas{
                            display:block;
                        background:#8bc34a;
                        border:4px solid #5a2e0a;
}

                        /* HUD con estilo del juego */
                        #hud{
                            position:absolute;
                        top:12px;
                        left:12px;
                        background:rgba(255,255,255,0.9);
                        border:3px solid #5a2e0a;
                        padding:10px 15px;
                        border-radius:8px;
                        font-weight:bold;
                        color:#3a1f07;
                        font-size:16px;
                        box-shadow:3px 3px 0 rgba(0,0,0,0.2);
}

                        /* Controles móviles */
                        #controls{
                            position:absolute;
                        bottom:25px;
                        left:25px;
                        width:180px;
                        height:180px;
                        opacity:0.9;
}

                        .btn{
                            position:absolute;
                        width:65px;
                        height:65px;
                        border:3px solid #5a2e0a;
                        border-radius:50%;
                        background:rgba(255,255,255,0.8);
                        font-size:28px;
                        font-weight:bold;
                        cursor:pointer;
                        color:#3a1f07;
                        box-shadow:2px 2px 0 rgba(0,0,0,0.2);
                        transition:0.1s;
}

                        .btn:active{
                            transform:scale(2px 2px);
                        background:rgba(255,255,255,1);
}

                        #up{left:60px;top:0;}
                        #left{left:0;top:60px;}
                        #right{left:120px;top:60px;}
                        #down{left:60px;top:120px;}

                        /* Ocultar controles en PC */
                        @media (min-width: 900px){
                            #controls{display:none;}
}
                    </style>

                </head>

                <body>

                    <div id="hud">
                        💰 Monedas: <span id="coins">100</span><br>
                            ⭐ Nivel: <span id="level">1</span><br>
                                🌾 Experiencia: <span id="exp">0</span>/100
                            </div>

                            <canvas id="game"></canvas>

                            <div id="controls">
                                <button id="up" class="btn">▲</button>
                                <button id="left" class="btn">◀</button>
                                <button id="right" class="btn">▶</button>
                                <button id="down" class="btn">▼</button>
                            </div>

                            <script>
                                const canvas=document.getElementById("game");
                                const ctx=canvas.getContext("2d");

                                // Ajustar tamaño del lienzo
                                function resize(){
                                    canvas.width = innerWidth;
                                canvas.height=innerHeight;
}
                                resize();
                                addEventListener("resize",resize);

                                // DATOS DEL JUGADOR
                                const player={
                                    x:1500,
                                y:1500,
                                speed:4,
                                coins:100,
                                level:1,
                                exp:0,
                                expMax:100,
                                direccion:"abajo"
};

                                // CONTROLES
                                const keys={ };
document.onkeydown=e=>{
                                    keys[e.key] = true;
                                if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
};
document.onkeyup=e=>keys[e.key]=false;

                                // Configurar controles táctiles
                                function touch(id,key){
const b=document.getElementById(id);
b.ontouchstart=e=>{e.preventDefault();keys[key]=true;};
b.ontouchend=e=>{e.preventDefault();keys[key]=false;};
b.onmousedown=()=>keys[key]=true;
b.onmouseup=b.onmouseleave=()=>keys[key]=false;
}
                                touch("up","ArrowUp");
                                touch("down","ArrowDown");
                                touch("left","ArrowLeft");
                                touch("right","ArrowRight");

                                // --------------------------
                                // ELEMENTOS DEL MAPA (IGUAL A TU IMAGEN)
                                // --------------------------
                                // Edificios principales
                                const edificios={
                                    casaGrande: {x:1400,y:100,ancho:220,largo:180},
                                casaPequeña: {x:1050,y:120,ancho:140,largo:150},
                                tienda: {x:1780,y:120,ancho:160,largo:150},
                                almacen: {x:1200,y:320,ancho:180,largo:120}
};

                                // Corrales y animales
                                const zonas={
                                    ovejas: {x:1000,y:350,ancho:200,largo:130, animales:["🐑","🐏","☁️"]},
                                gallinas: {x:1000,y:520,ancho:180,largo:140, animales:["🐔","🐓","🐣"]},
                                cerdos: {x:1000,y:1100,ancho:210,largo:130, animales:["🐷","🐖"]},
                                vacas: {x:1750,y:450,ancho:220,largo:140, animales:["🐄","🐮"]},
                                conejos: {x:1400,y:400,ancho:100,largo:100, animales:["🐇"]},
                                patos: {x:1750,y:850,ancho:150,largo:120, animales:["🦆"]}
};

                                // Recursos y decoración
                                const recursos={
                                    cacao: [],
                                arboles: [],
                                flores: [],
                                rocas: [],
                                estanque: {x:1800,y:1050,ancho:320,largo:180},
                                camino: {x:1450,y:250,ancho:100,largo:900}
};

                                // Generar elementos naturales
                                for(let i=0;i<150;i++) recursos.arboles.push({x:Math.random()*3000,y:Math.random()*3000});
                                for(let i=0;i<200;i++) recursos.flores.push({x:Math.random()*3000,y:Math.random()*3000,tipo:Math.random()>0.5?"🌸":"🌼"});
                                for(let i=0;i<60;i++) recursos.rocas.push({x:Math.random()*3000,y:Math.random()*3000});
                                for(let i=0;i<40;i++) recursos.cacao.push({x:Math.random()*2800+100,y:Math.random()*2800+100,listo:Math.random()>0.6});

                                // --------------------------
                                // FUNCIONES DE DIBUJO DETALLADAS
                                // --------------------------
                                // Dibujar edificio con techo rojo estilo pixel
                                function dibujarEdificio(objeto,colorPared,colorTecho){
                                    let cx=objeto.x-camX;
                                let cy=objeto.y-camY;

                                // Paredes
                                ctx.fillStyle=colorPared;
                                ctx.fillRect(cx,cy,objeto.ancho,objeto.largo);

                                // Techo triangular rojo
                                ctx.fillStyle=colorTecho;
                                ctx.beginPath();
                                ctx.moveTo(cx-20,cy);
                                ctx.lineTo(cx+objeto.ancho/2,cy-60);
                                ctx.lineTo(cx+objeto.ancho+20,cy);
                                ctx.closePath();
                                ctx.fill();

                                // Detalles de madera
                                ctx.strokeStyle="#3a1f07";
                                ctx.lineWidth=3;
                                ctx.strokeRect(cx,cy,objeto.ancho,objeto.largo);
}

                                // Dibujar corral con cercas
                                function dibujarCorral(objeto){
                                    let cx=objeto.x-camX;
                                let cy=objeto.y-camY;

                                // Fondo del corral
                                ctx.fillStyle="rgba(139,90,43,0.2)";
                                ctx.fillRect(cx,cy,objeto.ancho,objeto.largo);

                                // Cercas de madera
                                ctx.strokeStyle="#795548";
                                ctx.lineWidth=4;
                                ctx.strokeRect(cx,cy,objeto.ancho,objeto.largo);

                                // Postes de cerca
                                for(let i=0;i<objeto.ancho;i+=40){
                                    ctx.fillStyle = "#5d4037";
                                ctx.fillRect(cx+i,cy-5,8,10);
                                ctx.fillRect(cx+i,cy+objeto.largo-5,8,10);
}

// Dibujar animales dentro
objeto.animales.forEach((anim,idx)=>{
                                    let posX=cx+30+(idx*70);
                                let posY=cy+40;
                                ctx.font="36px serif";
                                ctx.fillText(anim,posX,posY);
});
}

                                // Dibujar matas de cacao reales
                                function dibujarCacao(x,y,listo){
                                    ctx.font = "32px serif";
                                ctx.fillStyle=listo?"#8B4513":"#228B22";
                                ctx.fillText(listo?"🌰":"🌱",x,y);
}

                                // Dibujar camino de tierra
                                function dibujarCamino(){
                                    let cx=recursos.camino.x-camX;
                                let cy=recursos.camino.y-camY;
                                ctx.fillStyle="#d7b98c";
                                ctx.fillRect(cx,cy,recursos.camino.ancho,recursos.camino.largo);
                                ctx.strokeStyle="#b89a6c";
                                ctx.lineWidth=2;
                                ctx.strokeRect(cx,cy,recursos.camino.ancho,recursos.camino.largo);
}

                                // Dibujar estanque
                                function dibujarEstanque(){
                                    let cx=recursos.estanque.x-camX;
                                let cy=recursos.estanque.y-camY;
                                ctx.fillStyle="#5aa9ff";
                                ctx.beginPath();
                                ctx.ellipse(cx+recursos.estanque.ancho/2,cy+recursos.estanque.largo/2,recursos.estanque.ancho/2,recursos.estanque.largo/2,0,0,Math.PI*2);
                                ctx.fill();
                                // Borde de agua
                                ctx.strokeStyle="#1976d2";
                                ctx.lineWidth=4;
                                ctx.stroke();
                                // Bote de goma
                                ctx.font="40px serif";
                                ctx.fillText("🛶",cx+50,cy+80);
}

                                // Dibujar árbol pixelado
                                function dibujarArbol(x,y){
                                    ctx.fillStyle = "#6d4425";
                                ctx.fillRect(x-6,y,12,25);
                                ctx.fillStyle="#2e7d32";
                                ctx.beginPath();
                                ctx.arc(x,y-10,28,0,Math.PI*2);
                                ctx.fill();
                                ctx.fillStyle="#388e3c";
                                ctx.beginPath();
                                ctx.arc(x+12,y-5,22,0,Math.PI*2);
                                ctx.fill();
}

                                // --------------------------
                                // BUCLE PRINCIPAL DEL JUEGO
                                // --------------------------
                                let camX, camY;

                                function dibujarTodo(){
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                                // Cámara que sigue al jugador
                                camX=player.x-canvas.width/2;
                                camY=player.y-canvas.height/2;

                                // Fondo de pasto estilo pixel
                                ctx.fillStyle="#8bc34a";
                                ctx.fillRect(0,0,canvas.width,canvas.height);

                                // Dibujar elementos en orden de fondo a frente
                                dibujarCamino();

recursos.arboles.forEach(t=>dibujarArbol(t.x-camX,t.y-camY));
recursos.flores.forEach(f=>{ctx.font = "20px serif";ctx.fillText(f.tipo,f.x-camX,f.y-camY);});
recursos.rocas.forEach(r=>{ctx.fillStyle = "#757575";ctx.beginPath();ctx.arc(r.x-camX,r.y-camY,12,0,Math.PI*2);ctx.fill();});
recursos.cacao.forEach(c=>dibujarCacao(c.x-camX,c.y-camY,c.listo));

                                // Edificios iguales a tu imagen
                                dibujarEdificio(edificios.casaPequeña,"#d7ccc8","#e53935");
                                dibujarEdificio(edificios.casaGrande,"#a1887f","#c62828");
                                dibujarEdificio(edificios.tienda,"#ffcc80","#ff9800");
                                dibujarEdificio(edificios.almacen,"#8d6e63","#5d4037");

// Zonas de animales
Object.values(zonas).forEach(z=>dibujarCorral(z));

                                dibujarEstanque();

                                // Dibujar jugador con estilo granjero
                                ctx.font="42px serif";
                                let jugadorEmoji="👨‍🌾";
                                if(player.direccion=="izquierda") ctx.save(),ctx.scale(-1,1),ctx.fillText(jugadorEmoji, -(player.x-camX)-30,player.y-camY+15),ctx.restore();
                                else ctx.fillText(jugadorEmoji,player.x-camX-20,player.y-camY+15);
}

                                function actualizarJuego(){
// Movimiento y dirección
if(keys["ArrowUp"] && player.y>50) {player.y -= player.speed;player.direccion="arriba";}
                                if(keys["ArrowDown"] && player.y<2950) {player.y += player.speed;player.direccion="abajo";}
if(keys["ArrowLeft"] && player.x>50) {player.x -= player.speed;player.direccion="izquierda";}
                                if(keys["ArrowRight"] && player.x<2950) {player.x += player.speed;player.direccion="derecha";}

                                // Actualizar interfaz
                                document.getElementById("coins").textContent=player.coins;
                                document.getElementById("level").textContent=player.level;
                                document.getElementById("exp").textContent=player.exp;

// Sistema de niveles
if(player.exp>=player.expMax){
                                    player.exp -= player.expMax;
                                player.level++;
                                player.expMax=Math.round(player.expMax*1.5);
                                alert(`🎉 ¡Subiste al NIVEL ${player.level}!`);
}
}

                                function bucle(){
                                    actualizarJuego();
                                dibujarTodo();
                                requestAnimationFrame(bucle);
}

                                // INICIAR EL JUEGO
                                bucle();
                            </script>

                        </body>
                    </html>