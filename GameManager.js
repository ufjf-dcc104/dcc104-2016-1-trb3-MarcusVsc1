function GameManager(pc) {
    this.pc = pc;
    this.estagios = [];
    this.criarEstagios();
    this.tema = new Audio();
    this.globalVar = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
}

GameManager.prototype.criarEstagios = function() {

    //fase 1
    var eventoLista = [];
    var bg = "bg1";
    
    evento = function() {
        return function(t){
            if(this.gameStart == 1){
                this.stage = 1;
                this.eventIndex++;
                this.endgame == 0;
                this.tocarMusica("assets/tema.mp3");
            }
        }
    }
    eventoLista.push(evento);

    evento = function() {
        console.log("entrou")
        return function(t){
            for(var i = 0; i < 10; i++){
                this.newEnemy(0,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
            }
            this.eventIndex++;
        }
    }
    eventoLista.push(evento);

    evento = function() {
        return function(t){
            if((this.countRespawn >= 7 && this.spritesE.length == 0) || tempo>=110){
                this.stageIndex++;
                this.eventIndex=0;
                if(this.survivor == 0){
                    for(var i = 0; i < this.pcs.length; i++)
                        if(this.pcs[i].vidas<7){this.pcs[i].vidas++;}
                };
                this.musica.src = "assets/tema2.mp3"
                this.musica.play();
                for(var i = 0; i < this.pcs.size; i++){
                    this.pcs[i].pontuacao+= Math.floor((110-tempo)*40);
                }
                this.tempoTotal = t - this.startPoint;
                this.startPoint = t;
                this.countRespawn = 0;
                for(var i = 0; i < 2; i++){
                    this.newEnemy(2,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                }
                this.respawner = 20;
        }
        if(((this.respawner<=0) || (this.spritesE.length == 0 && this.countRespawn < 7))){
            for(var i = 0; i < 10; i++){
                this.newEnemy(0,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
            }
            this.respawner = 20;
            this.countRespawn++;
        }
        else{this.respawner -= 1/60;}
        }
    }
    eventoLista.push(evento);

    this.estagios.push(this.fabricaDeEstagios(bg, eventoLista));

    //fase 2
    eventoLista = [];
    bg = "bg2";

    evento = function(){
        return function(t){
            if((this.countRespawn >= 7 && this.spritesE.length == 0) || tempo>=118){
                this.stageIndex++;
                this.eventIndex = 0;
                for (var i = 0; i < this.pcs.length; i++) {
                    this.pcs[i].pontuacao += Math.floor((118-tempo)*40);
                }
                if(this.survivor == 0){
                    for(var i = 0; i < this.pcs.length; i++)
                        if(this.pcs[i].vidas<7){this.pcs[i].vidas++;}
                };
                this.musica.src = "assets/tema3.mp3"
                this.musica.play();
                this.countRespawn = 0;
                this.tempoTotal = t - this.startPoint;
                this.startPoint=t;
                this.respawner = 20;
                for(var i = 0; i < 2; i++){
                    this.newEnemy(3,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                }
        }
        if(((this.respawner <= 0) || (this.spritesE.length == 0 && this.countRespawn < 7))){
            if(this.countRespawn%2==0){
                for(var i = 0; i < 5; i++){
                this.newEnemy(1,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                }
            }
            else{
                for(var i = 0; i < 3; i++){
                this.newEnemy(2,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                }
            }
            this.respawner = 20;
            this.countRespawn++;
        }
        else{this.respawner -= 1/60;}
        }
    }
    eventoLista.push(evento);

    this.estagios.push(this.fabricaDeEstagios(bg, eventoLista));

    //fase 3
    eventoLista = [];
    bg = "bg3";

    evento = function() {
        return function(t) {
            if((this.countRespawn >=6 && this.spritesE.length == 0) || tempo>=113){
                
                this.pcs[0].pontuacao += Math.floor((113-tempo)*40);
                if(this.survivor == 0){
                    for(var i = 0; i < this.pcs.length; i++)
                        if(this.pcs[i].vidas<7){this.pcs[i].vidas++;}
                };
                
                
                this.countRespawn = 0;
                this.tempoTotal = t - this.startPoint;
                this.startPoint=t;

                var proxFase = true;

                for(var i = 0;  i < this.pcs.length; i++){
                    if(this.pcs[i].vidas <= 4 && this.survivor == 0){
                        proxFase = false;
                    }
                }

                if(!proxFase){
                    this.stageIndex+=2;
                    this.newEnemy(5,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                    this.musica.src = "assets/tema5.mp3"
                } else {
                    this.stageIndex++;
                    for(var i = 0; i < 2; i++){
                        this.newEnemy(7,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                    }
                    this.musica.src = "assets/tema4.mp3"
                }
                this.musica.play();
                this.respawner = 20;
            }
            if(((this.respawner <= 0) || (this.spritesE.length == 0 && this.countRespawn < 6))){
                if(this.countRespawn%2!=0){
                    for(var i = 0; i < this.countRespawn+3; i++){
                    this.newEnemy(3,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                    }
                }
                else{
                    for(var i = 0; i < this.countRespawn+3; i++){
                    this.newEnemy(4,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                    }
                }
                this.respawner = 20;
                this.countRespawn++;
            }
        else{this.respawner -= 1/60;}
        }
    }
    eventoLista.push(evento);

    this.estagios.push(this.fabricaDeEstagios(bg, eventoLista));

    //fase 4
    eventoLista = [];
    bg = "bg4";

    evento = function() {
        return function(t) {
            if((this.countRespawn >= 4 && this.spritesE.length == 0) || tempo>=108){
                this.pcs[0].pontuacao += Math.floor((108-tempo)*60);
                if(this.survivor == 0){
                    for(var i = 0; i < this.pcs.length; i++)
                        if(this.pcs[i].vidas<7){this.pcs[i].vidas++;}
                }
                for(var i = 0; i < this.spritesE.length; i++){
                    this.assets.play("explosion");
                    this.adicionar(new Animation({x: this.spritesE[i].x, y:this.spritesE[i].y, imagem: "explosion"}));
                    this.toRemove.push(this.spritesE[i]);
                }
                for(var i = 0; i < this.spritesTE.length; i++){
                    this.assets.play("explosion");
                    this.adicionar(new Animation({x: this.spritesTE[i].x, y:this.spritesTE[i].y, imagem: "explosion"}));
                    this.toRemove.push(this.spritesTE[i]);
                }
                this.stageIndex++;
                this.musica.src = "assets/tema5.mp3"
                this.musica.play();
                this.countRespawn = 0;
                this.tempoTotal = t - this.startPoint;
                this.startPoint=t;
                this.newEnemy(5,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                this.respawner = 20;
            }
            if(((this.respawner <= 0) || (this.spritesE.length == 0 && this.countRespawn < 4))){
                if(this.countRespawn%2!=0){
                    for(var i = 0; i < this.countRespawn+3; i++){
                    this.newEnemy(7,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                    }
                }
                else{
                    for(var i = 0; i < this.countRespawn+3; i++){
                    this.newEnemy(6,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                    }
                }
                this.respawner = 20;
                this.countRespawn++;
            }
        else{this.respawner -= 1/60;}
        }
    }
    eventoLista.push(evento);

    this.estagios.push(this.fabricaDeEstagios(bg, eventoLista));

    //fase 5
    eventoLista = [];
    bg = "bg5";

    //parte inicial da fase 5, com inimigos aparecendo enquanto o chefe atira
    evento = function(){
        return function(t){
            //vitoria
            if(this.spritesE.length == 0){
                this.endGame = 1;
                for (var i = 0; i < this.pcs.length; i++) {
                    this.pcs[i].pontuacao += Math.floor((167-tempo)*40);
                }
                this.finalizarGame("assets/victory.mp3");
            }
            //contador de 5 segundos do especial do chefe
            if(tempo > 123){
                console.log(128-tempo);
                ctx.font = "30px Eurostile";
                ctx.fillStyle = "white";
                ctx.fillText(Math.floor(128-tempo),495,this.h-645);
            }
            if(this.respawner<=0){
                this.newEnemy(Math.floor(Math.random()*3 + 1),this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                this.respawner = 8;
            }
            else{
                this.respawner -= 1/60;
            }
            if(tempo >= 128){
                this.eventIndex++;
            }
        }
    }
    eventoLista.push(evento);

    //especial do chefe
    evento = function(){
        return function(){
            for(var i = 0; i < this.spritesE.length;i++){
                if(this.spritesE[i].props.chefe != undefined){
                    this.spritesE[i].vm = 0;
                    this.spritesE[i].comportar = especialDoChefe();
                }
            }
            this.eventIndex++;
        }
    }
    eventoLista.push(evento);

    //parte final da fase 5
    evento = function(){
        return function(){
            //derrota
            if(tempo>=167){
            this.endGame = 2;
            this.finalizarGame("assets/gameover.mp3");
            }else{
                //vitoria
                if(this.spritesE.length == 0){
                    this.endGame = 1;
                    for (var i = 0; i < this.pcs.length; i++) {
                        this.pcs[i].pontuacao += Math.floor((167-tempo)*40);
                    }
                    this.finalizarGame("assets/victory.mp3");
                } 
            }
            if(tempo > 143){
                for(i = 0; i < this.spritesE.length;i++){
                    if(this.spritesE[i].props.chefe != undefined){
                        this.spritesE[i].vm = 40;
                        this.spritesE[i].comportar = comportamentoFinal(this.pcs[Math.floor(Math.random()*this.pcs.length)]);
                    }
                }
            }
        }
    }
    eventoLista.push(evento);

    this.estagios.push(this.fabricaDeEstagios(bg, eventoLista));





}

GameManager.prototype.fabricaDeEstagios = function (bg, eventoLista) {
    var estagio = {
        background: null,
        eventos: [],
    }
    estagio.background = bg;
    estagio.eventos = eventoLista;
    return estagio;
}