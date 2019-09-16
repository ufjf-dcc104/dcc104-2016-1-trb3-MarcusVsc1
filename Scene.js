function Scene(params) {
    var exemplo ={
        spritesE: [],
        spritesT: [],
        spritesPoder: [],
        spritesTE: [],
        ctx: null,
        w: 300,
        h: 300,	
        colorir: undefined,
        musica: undefined,
        toRemove: [],
        img: null,
        pc: null,
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
    }
    Object.assign(this, exemplo, params);
}

Scene.prototype = new Scene();
Scene.prototype.constructor = Scene;

//adiciona os sprites ao objeto scene em arrays
Scene.prototype.adicionar = function(sprite){
    if(sprite.props.tipo == "pc"){
        this.pc = sprite;
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
    if(this.pc.desenhar){this.pc.desenhar(this.ctx);}
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
    if(this.pc != null){
        this.pc.mover(dt);
        if(((this.pc.x <= 0 - this.pc.w/2) || (this.pc.y <= 0 - this.pc.h/2) || 
          (this.pc.x >= this.w + this.pc.w/2) || (this.pc.y >= this.h - 100 + this.pc.h/2)) && this.endGame == 0)
            {this.pc.a = this.pc.a-(3*Math.PI/2)}
    }
    
    if(this.stage == 0){this.pc.a = 3*Math.PI/2}
    
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
    if(this.pc != null && this.pc.comportar){
        this.pc.comportar();
    } 
};


Scene.prototype.limpar = function(){
    this.ctx.clearRect(0,0, this.w, this.h);
};

//funcao de verificar colisao (em ordem: inimigo-usuario, inimigo-tiro, powerup-usuario, tiroInimigo-usuario)
Scene.prototype.checaColisao = function(){
    for(var i = 0; i < this.spritesE.length; i++){
        if(this.spritesE[i].colidiuCom(this.pc)){
            if(this.pc.imune <= 0){
                this.pc.vidas--;
                this.pc.imune=2;
            }    
        }
        for(var j = 0; j < this.spritesT.length; j++){
            if(this.spritesE[i].colidiuCom(this.spritesT[j])){
                if(this.spritesT[j].props.atravessa == 0){this.toRemove.push(this.spritesT[j]);}
                this.spritesE[i].vidas--;
                if(this.spritesE[i].vidas == 0){
                this.toRemove.push(this.spritesE[i]);
                var chance = Math.random()*100;
                if(this.spritesE[i].drop == 0){this.pc.pontuacao += this.spritesE[i].pontuacao;}
                if(chance>=90 && this.spritesE[i].drop == 0) {
                    this.criarPoder(this.spritesE[i].powerUp,this.spritesE[i].x,this.spritesE[i].y)}
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
    for(var i = 0; i < this.spritesPoder.length; i++){
        if(this.spritesPoder[i].colidiuCom(this.pc)){
            this.pc.modeloTiro.push(this.spritesPoder[i].powerUp);
            this.toRemove.push(this.spritesPoder[i]);
            if(this.pc.modeloTiro[this.pc.tiroCorrente] < this.spritesPoder[i].powerUp){
                this.pc.tiroCorrente = this.pc.modeloTiro.indexOf(this.spritesPoder[i].powerUp);
            }
            this.pc.pontuacao += 50*this.spritesPoder[i].powerUp;
        }
        this.pc.modeloTiro = this.pc.modeloTiro.filter((este, i) => this.pc.modeloTiro.indexOf(este) === i);
    }
    for(var i = 0; i < this.spritesTE.length; i++){
        if(this.spritesTE[i].colidiuCom(this.pc)){
            if(this.pc.imune<=0){
                this.toRemove.push(this.spritesTE[i]);
            this.pc.vidas--;
            this.pc.imune=2;
            }
        }
        if(this.spritesTE[i] != null){
            if(((this.spritesTE[i].x <= 0 - this.spritesTE[i].w/2) || (this.spritesTE[i].y <= 0 - this.spritesTE[i].h/2) || 
          (this.spritesTE[i].x >= this.w + this.spritesTE[i].w/2) || (this.spritesTE[i].y >= this.h - 100 + this.spritesTE[i].h/2)))
            {this.toRemove.push(this.spritesTE[i]);}
        }
        
    }
    if(this.pc.vidas == 0){
        this.finalizarGame("mp3/gameover.mp3");
        this.endGame = 2;
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

	}
	this.toRemove = [];

}

//cria a imagem de fundo da tela
Scene.prototype.background = function(){
    ctx.drawImage(this.img,0,0);
    
    
};

//cria a barra da parte de baixo da tela
Scene.prototype.navigationBar = function(t){
    ctx.fillStyle = "black";
    ctx.fillRect(0,this.h-100,this.w,100);
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    if(this.stage==0){
        ctx.font = "10px Arial";
        ctx.fillText("Seu universo corre perigo! Invasores de outra galáxia pretendem conquistar tudo e todos.",20,this.h-76);
        ctx.fillText("Defenda o o universo com uma nave poderosa!",20,this.h-56);
        ctx.fillText("Controles - Direcionais: WASD / Tiro: J / Turbo: K / Mudar tipo de tiro: L. "+ 
        "Mova-se para iniciar o jogo.",20,this.h-36);
        ctx.fillText("Aperte T para entrar ou sair do modo Survivor.",20,this.h-16);
        ctx.font = "30px Eurostile";
        ctx.fillText("Flew Far Faster",133,this.h-645);
        if(this.survivor == 1){
            ctx.font = "20px Eurostile";
            ctx.fillStyle = "lightblue";
            ctx.fillText("Survivor",235,this.h-625);
            
                
        }
    }else{
        switch(this.endGame){
            case 0:
                ctx.fillText("Turbo",200,this.h-50);
                ctx.fillText("Vidas",20,this.h-50);
                ctx.fillText("Pontos: "+this.pc.pontuacao,20,this.h-20);
                if(this.endGame==0){this.tempoFinal = (Math.round(t-this.startPoint+this.tempoTotal)/1000).toFixed(2);}
                ctx.fillText("Tempo:"+this.tempoFinal,480,this.h-50);
                ctx.fillText("Fase "+Math.floor(this.stage),480,this.h-20);
                ctx.fillText("Arma: ",200,this.h-20);
                var tipoTiro;
                switch(this.pc.modeloTiro[this.pc.tiroCorrente]){
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
                }
                ctx.fillText(tipoTiro,230,this.h-20);
                ctx.fillStyle = "white";
                var coracao = new Image();
                coracao.src = "img/heart.png"
                var posCoracao = 50;
                ctx.fillStyle = "white";
                ctx.fillRect(240,this.h-60,150,15);
                if(this.pc.turbo >= 0){
                    ctx.fillStyle = "white";
                    ctx.fillRect(240,this.h-60,150,15);
                    ctx.fillStyle = "blue";
                    ctx.fillRect(240,this.h-60,pc.turbo*30,15);

                }
                for(var i = 0; i < this.pc.vidas; i++){
                    ctx.drawImage(coracao,posCoracao,this.h-60);
                    posCoracao = posCoracao + 20;
                }
                break;
            case 1:
                ctx.font = "10px Arial";
                ctx.fillText("Os inimigos foram derrotados e o universo está a salvo.",20,this.h-70);
                ctx.fillText("Tempo: "+this.tempoFinal+"  Pontuação: "+this.pc.pontuacao,20,this.h-50);
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
                ctx.font = "10px Arial";
                ctx.fillText("Os inimigos se saíram vitoriosos e irão escravizar a galáxia.",20,this.h-70);
                ctx.fillText("Tempo: "+this.tempoFinal+"  Pontuação: "+this.pc.pontuacao,20,this.h-50);
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
    this.musica.src = tema;
    this.musica.loop = true;
    this.musica.play();
    this.pc.comportar = undefined;
    if(this.endGame==1){
        this.pc.a = 3*Math.PI/2;
        this.pc.vm = 100;
        this.pc.va = 0;       
    } else {
        for(var i = 0; i < this.spritesE.length; i++){
            
            this.spritesE[i].comportar = undefined;
            this.spritesE[i].a = Math.PI/2;
            this.spritesE[i].vm = 100; 
            this.spritesE[i].va = 0;
        }
        this.pc.desenhar = undefined;
    }
}


//funcao para controle das fases do jogo
Scene.prototype.stageControl = function(t){
    tempo = (Math.round(t-this.startPoint)/1000).toFixed(2);
    //jogo ainda nao iniciado
    if(this.stage==0){
            for(var i = 0; i < 10; i++){
            this.newEnemy(0);
        }
        this.tocarMusica("mp3/tema.mp3");
        this.stage++;
    }
    //fase 1
    if(this.stage==1){
        if((this.countRespawn >= 7 && this.spritesE.length == 0) || tempo>=110){
            this.stage=2;
            if(this.pc.vidas<7 && this.survivor == 0){this.pc.vidas++};
            this.musica.src = "mp3/tema2.mp3"
            this.musica.play();
            this.pc.pontuacao += Math.floor((110-tempo)*40);
            this.img = new Image();
            this.img.src = "img/bg2.jpg";
            this.tempoTotal = t - this.startPoint;
            this.startPoint = t;
            this.countRespawn = 0;
            for(var i = 0; i < 2; i++){
                this.newEnemy(2);
            }
            this.respawner = 20;
        }
        if(((this.respawner<=0) || (this.spritesE.length == 0 && this.countRespawn < 7)) && this.stage==1){
            for(var i = 0; i < 10; i++){
            this.newEnemy(0);
            }
            this.respawner = 20;
            this.countRespawn++;
            
        }
        else{this.respawner -= 1/60;}
    }
    //fase 2
    if(this.stage == 2){
        if((this.countRespawn >= 7 && this.spritesE.length == 0) || tempo>=118){
            this.stage=3;
            this.pc.pontuacao += Math.floor((118-tempo)*40);
            if(this.pc.vidas<7 && this.survivor == 0){this.pc.vidas++};
            this.musica.src = "mp3/tema3.mp3"
            this.musica.play();
            this.img = new Image();
            this.img.src = "img/bg3.jpg"
            this.countRespawn = 0;
            this.tempoTotal = t - this.startPoint;
            this.startPoint=t;
            for(var i = 0; i < 2; i++){
                this.newEnemy(3);
            }
        }
        if(((this.respawner <= 0) || (this.spritesE.length == 0 && this.countRespawn < 7)) && this.stage == 2){
            if(this.countRespawn%2==0){
                for(var i = 0; i < 5; i++){
                this.newEnemy(1);
                }
            }
            else{
                for(var i = 0; i < 3; i++){
                this.newEnemy(2);
                }
            }
            this.respawner = 20;
            this.countRespawn++;
        }
        else{this.respawner -= 1/60;}
    }
    //fase 3
    if(this.stage == 3){
        if((this.countRespawn >=6 && this.spritesE.length == 0) || tempo>=113){
            this.stage=4;
            this.pc.pontuacao += Math.floor((113-tempo)*40);
            if(this.pc.vidas<7 && this.survivor == 0){this.pc.vidas++};
            this.musica.src = "mp3/tema4.mp3"
            this.musica.play();
            this.img = new Image();
            this.img.src = "img/bg4.jpg"
            this.countRespawn = 0;
            this.tempoTotal = t - this.startPoint;
            this.startPoint=t;
            this.newEnemy(5);
        }
        if(((this.respawner <= 0) || (this.spritesE.length == 0 && this.countRespawn < 6)) && this.stage == 3){
            if(this.countRespawn%2!=0){
                for(var i = 0; i < this.countRespawn+3; i++){
                this.newEnemy(3);
                }
            }
            else{
                for(var i = 0; i < this.countRespawn+3; i++){
                this.newEnemy(4);
                }
            }
            this.respawner = 20;
            this.countRespawn++;
        }
        else{this.respawner -= 1/60;}
    }
    //fase 4
    if(this.stage >= 4){
        //se acabar o tempo
        if(tempo>=167){
            this.endGame = 2;
            this.pc.pontuacao += Math.floor((113-tempo)*40);
            this.finalizarGame("mp3/gameover.mp3");
        }else{
            //vitoria
            if(this.spritesE.length == 0){
                this.endGame = 1;
                this.pc.pontuacao += Math.floor((167-tempo)*40);
                this.finalizarGame("mp3/victory.mp3");
                this.stage == 5;
            }
            else{
                //a partir daqui eh o comprtamento normal da fase 4
                //contador de 5 segundos do especial do chefe
                if(tempo>= 123 && tempo < 128){
                    ctx.fillStyle = "white";
                    ctx.font = "30px Eurostile";
                    ctx.fillText(Math.floor(128-tempo),295,this.h-645);
                }
                if(this.respawner<=0 && tempo<128){
                    this.newEnemy(Math.floor(Math.random()*3 + 1));
                    this.respawner = 12;
                    this.countRespawn++;
                    
                }
                else{if(this.stage == 4)this.respawner -= 1/60;}
                //especial do chefe
                if(tempo>=127 && this.stage == 4){
                    
                    this.stage = 4.3;
                    var i;
                    for(i = 0; i < this.spritesE.length;i++){
                        if(this.spritesE[i].props.chefe != undefined){
                            break;
                        }
                    }
                    if(i!=this.spritesE.length){
                        this.spritesE[i].vm = 0;
                        this.spritesE[i].comportar = function(){
                            this.va = +0.2;
                            this.props.spawn -= 1;
                            if(this.props.spawn <= 0){
                                this.props.spawn = 2;
                                var tiro = new Sprite({
                                x: this.x, y: this.y, a: this.a-0.3,
                                vm:500, color: "navajowhite", w:6, h: 3, props:{tipo:"tiroE", atravessa:0}
                                })
                                this.scene.adicionar(tiro); 
                                tiro = new Sprite({
                                x: this.x, y: this.y, a: this.a+0.3,
                                vm:500, color: "navajowhite", w:6, h: 3, props:{tipo:"tiroE", atravessa:0}
                                })
                                this.scene.adicionar(tiro); 
                                }
                    }
                    } 

                }
                //parte final do chefe
                if(tempo>143 && this.stage == 4.3){
                    var i = 0;
                    this.stage = 4.5;

                    for(i = 0; i < this.spritesE.length;i++){
                        if(this.spritesE[i].props.chefe != undefined){
                            break;
                        }
                    }                     
                    var comportamentoFinal = function(alvo){
                        return function(){
                        alfa = calculoAngulo(this,alvo);    
                        
                        if(this.x <= alvo.x && this.y <= alvo.y)
                            this.a = alfa*-1;
                        else {
                            if(this.x < alvo.x && this.y > alvo.y)
                                this.a = alfa;
                        else {
                            if(this.x > alvo.x && this.y < alvo.y)
                                this.a = (alfa+Math.PI);
                        else{
                            this.a = (alfa+Math.PI)*-1;
                        }}}
                        this.vx = this.vm*Math.cos(this.a);
                        this.vy = this.vm*Math.sin(this.a);
                        this.props.spawn -= 1/60;
                        if(this.props.spawn <= 0){
                            this.props.spawn = 2.75;
                                var novo = new Sprite({
                                x: this.x, y: this.y, vm: 70*Math.random()+50, comportar: persegue(alvo), drop: 1, maxVidas: 3,
                                vidas: 3, 
                                color: "crimson", props:{tipo:"npc"}
                         });
                        this.scene.adicionar(novo);
                        }
                }
                    }
                 if(i != this.spritesE.length){
                     this.spritesE[i].vm = 40;
                     this.spritesE[i].comportar = comportamentoFinal(this.pc);
                 }
                }
        }
        }    
    }
}

//funcao que controla o jogo em si
Scene.prototype.passo = function(t,dt){
    this.limpar();
    this.background(img);  
    if(this.gameStart == 1 && this.endGame == 0){
        this.stageControl(t);
    }
    else{
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