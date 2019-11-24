function Scene(params) {
    var exemplo ={
        spritesE: [],
        spritesT: [],
        spritesPoder: [],
        spritesTE: [],
        spritesXP: [],
        ctx: null,
        w: 300,
        h: 300,	
        colorir: undefined,
        musica: undefined,
        toRemove: [],
        img: null,
        pcs: [],
        gameStart: 0,
        stage: 0, 
        startPoint: 0,
        respawner: 20,
        countRespawn: 0,
        newEnemy: undefined,
        criarPoder: undefined,
        tempoTotal: 0,
        endGame: 0,
        tempoFinal:0,
        survivor: 0,
        assets: null,
        gamer: null,
        stageIndex: 0,
        tipoB1: "botao1",
        tipoB2: "botao2",
        multiplier: 1,
        eventIndex: 0,
        eventoCorrente: undefined
    }
    Object.assign(this, exemplo, params);
}

Scene.prototype = new Scene();
Scene.prototype.constructor = Scene;

//adiciona os sprites ao objeto scene em arrays
Scene.prototype.adicionar = function(sprite){
    if(sprite.props.tipo == "pc"){
        this.pcs.push(sprite);
    }
    if(sprite.props.tipo == "tiro"){
        this.spritesT.push(sprite);
    }
    if(sprite.props.tipo == "npc"){
        this.spritesE.push(sprite);
    }
    if(sprite.props.tipo == "poder"){
        this.spritesPoder.push(sprite);
    }
    if(sprite.props.tipo == "tiroE"){
        this.spritesTE.push(sprite);
    }
    if(sprite.props.tipo == "boom"){
        this.spritesXP.push(sprite);
    }
    
    sprite.scene = this;
};

//chama a funcao desenhar de cada sprite
Scene.prototype.desenhar = function(){
    for(var i = 0; i<this.spritesE.length; i++){
        this.spritesE[i].desenhar(this.ctx);
    }  
    for(var i = 0; i<this.spritesT.length; i++){
        this.spritesT[i].desenhar(this.ctx);
    }  
    for(var i = 0; i<this.spritesPoder.length; i++){
        this.spritesPoder[i].desenhar(this.ctx);
    } 
    for(var i = 0; i<this.spritesTE.length; i++){
        this.spritesTE[i].desenhar(this.ctx);
    } 
    for(var i = 0; i<this.spritesXP.length; i++){
        this.spritesXP[i].desenhar(this.ctx);
    } 

    for(var i = 0; i<this.pcs.length; i++){
        if(this.pcs[i].desenhar){this.pcs[i].desenhar(this.ctx);}
    } 

    
};

//funcao para mover os sprites
Scene.prototype.mover = function(dt){
    for(var i = 0; i<this.spritesE.length; i++){
        this.spritesE[i].mover(dt);
    }  
    for(var i = 0; i<this.spritesT.length; i++){
        this.spritesT[i].mover(dt);
    }  
    for(var i = 0; i<this.spritesPoder.length; i++){
        this.spritesPoder[i].mover(dt);
    } 
    for(var i = 0; i<this.spritesTE.length; i++){
        this.spritesTE[i].mover(dt);
    } 

    for(var i = 0; i<this.pcs.length; i++){
        if(this.pcs[i] != null){
            this.pcs[i].mover(dt);
            if(((this.pcs[i].x <= 0 - this.pcs[i].w/2) || (this.pcs[i].y <= 0 - this.pcs[i].h/2) || 
              (this.pcs[i].x >= this.w + this.pcs[i].w/2) || (this.pcs[i].y >= this.h - 100 + this.pcs[i].h/2)) && this.endGame == 0)
                {this.pcs[i].a = this.pcs[i].a-(3*Math.PI/2)}
        }
        
    } 
    for(var i = 0; i<this.spritesXP.length; i++){
        this.spritesXP[i].mover(dt);
    } 
    
    if(this.stage == 0){
        for(var i = 0; i < this.pcs.length; i++){
            this.pcs[i].a = 3*Math.PI/2;
        }
    }
    
};

//funcao que faz o comportamento de cada sprite
Scene.prototype.comportar = function(){
    for(var i = 0; i<this.spritesE.length; i++){
        if(this.spritesE[i].comportar){
            this.spritesE[i].comportar();
        }
    } 
    for(var i = 0; i<this.spritesT.length; i++){
        if(this.spritesT[i].comportar){
            this.spritesT[i].comportar();
        }
    }
    for(var i = 0; i<this.spritesTE.length; i++){
        if(this.spritesTE[i].comportar){
            this.spritesTE[i].comportar();
        }
    }
    for(var i = 0; i < this.pcs.length; i++){
        if(this.pcs[i] != null && this.pcs[i].comportar){
            this.pcs[i].comportar();
        }  
    }
};


Scene.prototype.limpar = function(){
    this.ctx.clearRect(0,0, this.w, this.h);
};

//funcao de verificar colisao (em ordem: inimigo-usuario, inimigo-tiro, powerup-usuario, tiroInimigo-usuario)
Scene.prototype.checaColisao = function(){

    for(var i = 0; i < this.spritesE.length; i++){
        for(var k = 0; k < this.pcs.length; k++){
            if(this.spritesE[i].colidiuCom(this.pcs[k])){
                if(this.pcs[k].imune <= 0){
                    this.pcs[k].vidas--;
                    this.pcs[k].imune=2;
                    if(this.pcs[k].vidas != 0){this.assets.play("paralyze");}
                    else{
                        this.adicionar(new Animation({x: this.pcs[k].x, y:this.pcs[k].y, imagem: "explosion"}));
                        this.assets.play("explosion");
                        this.toRemove.push(this.pcs[k]);
                    }
                }    
            } 
        }
    
    for(var j = 0; j < this.spritesT.length; j++){
        if(this.spritesE[i].colidiuCom(this.spritesT[j])){
            if(this.spritesT[j].props.atravessa == 0){this.toRemove.push(this.spritesT[j]);}
            this.spritesE[i].vidas--;
            if(this.spritesE[i].vidas == 0){
                this.adicionar(new Animation({x: this.spritesE[i].x, y:this.spritesE[i].y, imagem: "explosion"}));
                this.assets.play("explosion");
                this.toRemove.push(this.spritesE[i]);
                if(this.spritesE[i].drop == 0){
                    this.spritesT[j].jogador.pontuacao += this.spritesE[i].pontuacao;
                    var chance = Math.random()*100;                    if(chance>=90 && this.spritesE[i].drop == 0) {
                        this.criarPoder(this.spritesE[i].powerUp,this.spritesE[i].x,this.spritesE[i].y)
                    }
                    this.spritesE[i].drop = 1;
                }
        }
        if(this.spritesT[j] != null){
            if(((this.spritesT[j].x <= 0 - this.spritesT[j].w/2) || (this.spritesT[j].y <= 0 - this.spritesT[j].h/2) || 
                (this.spritesT[j].x >= this.w + this.spritesT[j].w/2) || (this.spritesT[j].y >= this.h - 100 + this.spritesT[j].h/2)))
                {this.toRemove.push(this.spritesT[j]);}
        }
            
        }
    }
    }

    for(var i = 0; i < this.spritesPoder.length; i++){
        for(var m = 0; m < this.pcs.length; m++) {
            if(this.spritesPoder[i].colidiuCom(this.pcs[m])){
                this.assets.play("item");
                this.pcs[m].modeloTiro.push(this.spritesPoder[i].powerUp);
                this.toRemove.push(this.spritesPoder[i]);
                if(this.pcs[m].modeloTiro[this.pcs[m].tiroCorrente] < this.spritesPoder[i].powerUp){
                    this.pcs[m].tiroCorrente = this.pcs[m].modeloTiro.indexOf(this.spritesPoder[i].powerUp);
                }
                this.pcs[m].pontuacao += 50*this.spritesPoder[i].powerUp;
            }
            this.pcs[m].modeloTiro = this.pcs[m].modeloTiro.filter((este, i) => this.pcs[m].modeloTiro.indexOf(este) === i); 
        }
    }
    
    for(var i = 0; i < this.spritesTE.length; i++){
        for(var j = 0; j < this.pcs.length; j++){
            if(this.spritesTE[i].colidiuCom(this.pcs[j])){
                if(this.pcs[j].imune<=0){
                    this.toRemove.push(this.spritesTE[i]);
                    this.assets.play("paralyze");
                    this.pcs[j].vidas--;
                    this.pcs[j].imune=2;
                    if(this.pcs[j].vidas == 0){
                        this.adicionar(new Animation({x: this.pcs[j].x, y:this.pcs[j].y, imagem: "explosion"}));
                        this.assets.play("explosion");
                        this.toRemove.push(this.pcs[j]);
                    }
                }
            }
            if(this.spritesTE[i] != null){
                if(((this.spritesTE[i].x <= 0 - this.spritesTE[i].w/2) || (this.spritesTE[i].y <= 0 - this.spritesTE[i].h/2) || 
              (this.spritesTE[i].x >= this.w + this.spritesTE[i].w/2) || (this.spritesTE[i].y >= this.h - 100 + this.spritesTE[i].h/2)))
                {this.toRemove.push(this.spritesTE[i]);}
            }
        }   
    }
    var fim;
    for(fim = 0; fim < this.pcs.length; fim++){
        if(this.pcs[fim].vidas != 0){
            break;
        } 
    }
    if(fim == this.pcs.length){
        this.endGame = 2;
        this.finalizarGame("assets/gameover.mp3"); 
    }
};

//funcao de remocao de sprites
Scene.prototype.removeSprites = function(){
	for (var i = 0; i < this.toRemove.length; i++) {
        if(this.toRemove[i].props.tipo == "npc"){
    		var idx = this.spritesE.indexOf(this.toRemove[i]);
    		if(idx>=0){
    			this.spritesE.splice(idx,1);
    		}
        }
        if(this.toRemove[i] != null && this.toRemove[i].props.tipo == "boom"){
            var idx = this.spritesXP.indexOf(this.toRemove[i]);
            if(idx>=0){
                this.spritesXP.splice(idx,1);
            }
        }
        if(this.toRemove[i] != null &&this.toRemove[i].props.tipo == "tiro"){
            var idx = this.spritesT.indexOf(this.toRemove[i]);
            if(idx>=0){
                this.spritesT.splice(idx,1);
            }
        }
        if(this.toRemove[i].props.tipo == "poder"){
            var idx = this.spritesPoder.indexOf(this.toRemove[i]);
            if(idx>=0){
                this.spritesPoder.splice(idx,1);
            }
        }
        if(this.toRemove[i] != null && this.toRemove[i].props.tipo == "tiroE"){
            var idx = this.spritesTE.indexOf(this.toRemove[i]);
            if(idx>=0){
                this.spritesTE.splice(idx,1);
            }
        }
        if(this.toRemove[i] != null && this.toRemove[i].props.tipo == "pc"){
            var idx = this.pcs.indexOf(this.toRemove[i]);
            if(idx>=0){
                this.pcs.splice(idx,1);
            }
        }

	}
	this.toRemove = [];

}

//cria a imagem de fundo da tela
Scene.prototype.background = function(){
    ctx.drawImage(this.assets.img(this.estagio.background),0,0);    
};

//cria a barra da parte de baixo da tela
Scene.prototype.navigationBar = function(t){
    ctx.fillStyle = "black";
    ctx.fillRect(0,this.h-100,this.w,100);
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    //texto do inicio do jogo
    if(this.stage==0){
        ctx.font = "10px Arial";
        ctx.fillText("Seu universo corre perigo! Invasores de outra galáxia pretendem conquistar tudo e todos.",20,this.h-76);
        ctx.fillText("Defenda o o universo com uma nave poderosa!",20,this.h-56);
        ctx.fillText("Controles P1 - Direcionais: WASD / Tiro: J / Turbo: K / Mudar tipo de tiro: L ::: Controles P2"+ 
        "- Direcionais: Numpad da direita 8546 / Tiro: + / Turbo: Enter / Mudar tipo de tiro:  .",20,this.h-36);
        ctx.fillText("Aperte T para entrar ou sair do modo Survivor.",20,this.h-16);
        ctx.font = "30px Eurostile";
        ctx.fillText("Flew Far Faster",333,this.h-645);
        if(this.survivor == 1){
            ctx.font = "20px Eurostile";
            ctx.fillStyle = "lightblue";
            ctx.fillText("Survivor",235,this.h-625);       
        }
        //teste
        function Botao(x,y,w,h){
           this.x = x;
           this.y = y;
           this.w = w;
           this.h = h;
        }

        var bt = new Botao(40,20,110,50);
        var bt2 = new Botao(this.w - 150,20,110,50);
        
        canvas.onmousemove = function(evt){
            var rectNav = canvas.getBoundingClientRect();
            var pos = {
                x: evt.clientX - rectNav.left,
                y: evt.clientY - rectNav.top
             };
            if((pos.x> bt.x && pos.x < (bt.x+bt.w) && pos.y>bt.y && pos.y<(bt.y+bt.h)) ||
                (pos.x> bt2.x && pos.x < (bt2.x+bt2.w) && pos.y>bt2.y && pos.y<(bt2.y+bt2.h))){
                canvas.style.cursor = "pointer";
                cena1.tipoB1 = "botao1hover";
                cena1.tipoB2 = "botao2hover";

            }
            else{
                canvas.style.cursor = "auto";
                cena1.tipoB1 = "botao1";
                cena1.tipoB2 = "botao2";
            }
        }
        ctx.drawImage(this.assets.img(this.tipoB1),bt.x,bt.y,bt.w,bt.h);    
        ctx.drawImage(this.assets.img(this.tipoB2),bt2.x,bt2.y,bt2.w,bt2.h); 

        canvas.onclick = function(evt){
            var rectNav = canvas.getBoundingClientRect();
            var pos = {
                x: evt.clientX - rectNav.left,
                y: evt.clientY - rectNav.top
             };
            if(pos.x> bt.x && pos.x < (bt.x+bt.w) && pos.y>bt.y && pos.y<(bt.y+bt.h)){
                cena1.gameStart = 1;
                adicionarListeners();
                cena1.pcs.splice(1,1);
            }
            if(pos.x> bt2.x && pos.x < (bt2.x+bt2.w) && pos.y>bt2.y && pos.y<(bt2.y+bt2.h)){
                cena1.gameStart = 1;
                adicionarListeners();
                cena1.multiplier = 1.5;
            }
        }

        //fim do teste
    }else{
        switch(this.endGame){
            case 0:
                //jogo correndo
                if(this.stageIndex == 3){
                    ctx.font = "30px Eurostile";
                    ctx.fillText("FASE EXTRA",365,this.h-645);
                }
                ctx.fillStyle = "white";
                ctx.font = "10px Arial";
                ctx.fillText("Tempo:"+this.tempoFinal,450,this.h-50);
                ctx.fillText("Fase "+Math.floor(this.stageIndex+1),450,this.h-20);
                if(this.endGame==0){this.tempoFinal = (Math.round(t-this.startPoint+this.tempoTotal)/1000).toFixed(2);}
                if(pc.vidas > 0){
                    ctx.fillText("Turbo",200,this.h-50);
                    ctx.fillText("Vidas",20,this.h-50);
                    ctx.fillText("Pontos: "+pc.pontuacao,20,this.h-20);
                    ctx.fillText("Arma: ",200,this.h-20);
                    var tipoTiro;
                    //mostra qual o tipo de tiro
                    switch(pc.modeloTiro[pc.tiroCorrente]){
                        case 0:
                            tipoTiro = "Pistola";
                            ctx.fillStyle = "green";
                            break;
                        case 1:
                            tipoTiro = "Escopeta";
                            ctx.fillStyle = "pink";
                            break;
                        case 2:
                            tipoTiro = "Metralhadora";
                            ctx.fillStyle = "magenta";
                            break;
                        case 3:
                            tipoTiro = "Canhão";
                            ctx.fillStyle = "powderblue";
                            break;
                        case 4:
                            tipoTiro = "Míssil";
                            ctx.fillStyle = "coral";
                            break;
                    }
                    ctx.fillText(tipoTiro,230,this.h-20);
                    ctx.fillStyle = "white";
                    //desenha a barra de turbo
                    ctx.fillStyle = "white";
                    ctx.fillRect(240,this.h-60,150,15);
                    if(pc.turbo >= 0){
                        ctx.fillStyle = "blue";
                        ctx.fillRect(240,this.h-60,pc.turbo*30,15);
                    }
                    //desenha as vidas
                    var posCoracao = 50;
                    for(var i = 0; i < pc.vidas; i++){
                        ctx.drawImage(this.assets.img("heart"),posCoracao,this.h-60);
                        posCoracao = posCoracao + 20;
                    }
                }
                else{
                    ctx.font = "20px Eurostile";
                    ctx.fillText("GAME OVER",125,this.h-40);
                }
                if(this.multiplier == 1.5){

                    if(pc2.vidas > 0){
                        ctx.fillStyle = "white";
                        ctx.font = "10px Arial";
                        ctx.fillText("Turbo",700,this.h-50);
                        ctx.fillText("Vidas",520,this.h-50);
                        ctx.fillText("Pontos: "+pc2.pontuacao,520,this.h-20);
                        ctx.fillText("Arma: ",700,this.h-20);
                        var tipoTiro;
                        //mostra qual o tipo de tiro
                        switch(pc2.modeloTiro[pc2.tiroCorrente]){
                            case 0:
                                tipoTiro = "Pistola";
                                ctx.fillStyle = "green";
                                break;
                            case 1:
                                tipoTiro = "Escopeta";
                                ctx.fillStyle = "pink";
                                break;
                            case 2:
                                tipoTiro = "Metralhadora";
                                ctx.fillStyle = "magenta";
                                break;
                            case 3:
                                tipoTiro = "Canhão";
                                ctx.fillStyle = "powderblue";
                                break;
                            case 4:
                            tipoTiro = "Míssil";
                            ctx.fillStyle = "coral";
                            break;
                        }
                        ctx.fillText(tipoTiro,730,this.h-20);
                        ctx.fillStyle = "white";
                        //desenha a barra de turbo
                        ctx.fillStyle = "white";
                        ctx.fillRect(740,this.h-60,150,15);
                        if(pc2.turbo >= 0){
                            ctx.fillStyle = "blue";
                            ctx.fillRect(740,this.h-60,pc2.turbo*30,15);
                        }
                        //desenha as vidas
                        var posCoracao = 550;
                        for(var i = 0; i < pc2.vidas; i++){
                            ctx.drawImage(this.assets.img("heart"),posCoracao,this.h-60);
                            posCoracao = posCoracao + 20;
                        }
                    }
                    else{
                        ctx.font = "20px Eurostile";
                        ctx.fillStyle = "white";
                        ctx.fillText("GAME OVER",this.w-360,this.h-40);
                    }
                }
                break;
            case 1:
                //fim de jogo com vitoria
                ctx.font = "10px Arial";
                ctx.fillText("Os inimigos foram derrotados e o universo está a salvo.",20,this.h-70);
                ctx.fillText("Tempo: "+this.tempoFinal+"  Pontuação P1: "+pc.pontuacao+
                    "  Pontuação P2: "+pc2.pontuacao,20,this.h-50);
                ctx.fillText("Jogo feito por Marcus Vinícius V. A. Cunha",395,this.h-50);
                ctx.fillText("Aperte F5 caso queira reiniciar o jogo.",20,this.h-30);
                ctx.fillText("Matrícula 201776013 marcus.vasconcelos@ice.ufjf.br",345,this.h-30);
                ctx.font = "30px Eurostile";
                ctx.fillText("Você venceu o combate!",60,this.h-645);
                if(this.survivor == 1){
                    ctx.fillStyle = "gold";
                    ctx.fillText("ULTIMATE SURVIVOR",65,this.h/2);
                    console.log("Se você conseguiu fechar o jogo, meus parabéns. Você é um absoluto MADMAN.")
                }
                break;
            case 2:
                //situacao de derrota
                ctx.font = "10px Arial";
                ctx.fillText("Os inimigos se saíram vitoriosos e irão escravizar a galáxia.",20,this.h-70);
                ctx.fillText("Tempo: "+this.tempoFinal+"  Pontuação P1: "+pc.pontuacao+
                    "  Pontuação P2: "+pc2.pontuacao,20,this.h-50);
                ctx.fillText("Jogo feito por Marcus Vinícius V. A. Cunha",395,this.h-50);
                ctx.fillText("Aperte F5 caso queira reiniciar o jogo.",20,this.h-30);
                ctx.fillText("Matrícula 201776013 marcus.vasconcelos@ice.ufjf.br",345,this.h-30);
                ctx.font = "30px Eurostile";
                ctx.fillText("Você perdeu!",20,this.h-645);
                break;
        }
           
    }
}

//funcao de tocar som
Scene.prototype.tocarMusica = function(tema){
    this.musica = new Audio(tema);
    this.musica.muted = false;
    this.musica.play();
}

//funcao que finaliza o jogo, independentemente de ganhar ou perder
Scene.prototype.finalizarGame = function(tema){
    this.estagio.eventos = [];
    this.musica.src = tema;
    this.musica.loop = true;
    this.musica.play();
    console.log("finalizou");
    for(var i = 0; i <this.pcs.length; i++){
        console.log("mudou comportamento")
        this.pcs[i].comportar = undefined;
    }
    if(this.endGame==1){
        for(var i = 0; i <this.pcs.length; i++){
            this.pcs[i].a = 3*Math.PI/2;
            this.pcs[i].vm = 100;
            this.pcs[i].va = 0;     
        }  
    } else {
        for(var i = 0; i < this.spritesE.length; i++){
            this.spritesE[i].comportar = undefined;
            this.spritesE[i].a = Math.PI/2;
            this.spritesE[i].vm = 100; 
            this.spritesE[i].va = 0;
        }

    }
}



Scene.prototype.rodarEvento = function(evento, t) {
    tempo = (Math.round(t-this.startPoint)/1000).toFixed(2);
    this.eventoCorrente = evento();
    this.eventoCorrente(t);
}

Scene.prototype.gameDefiner = function (t) {
    this.estagio = this.gamer.estagios[this.stageIndex];
    if(this.endGame == 0){this.rodarEvento(this.estagio.eventos[this.eventIndex],t);}
    this.background();
}

//funcao que controla o jogo em si
Scene.prototype.passo = function(t,dt){
    this.limpar();
    this.gameDefiner(t);
    if(this.gameStart == 0){
        this.startPoint = t;
    }
    this.comportar();
    this.mover(dt);
    this.desenhar();
    this.navigationBar(t);
    if(this.endGame == 0){
      this.checaColisao();
      this.removeSprites();
    }
};