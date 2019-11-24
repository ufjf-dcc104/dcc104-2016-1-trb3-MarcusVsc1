function GameManager(pc) {
    this.pc = pc;
    this.estagios = [];
    this.criarEstagios();
    this.tema = new Audio();
    this.globalVar = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
}

GameManager.prototype.criarEstagios = function() {
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
                    if(this.pcs[i].vidas <= 5 && this.survivor == 0){
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

    eventoLista = [];
    bg = "bg4";

    evento = function() {
        return function(t) {
            if((this.countRespawn >=6 && this.spritesE.length == 0) || tempo>=108){
                this.stageIndex++;
                this.pcs[0].pontuacao += Math.floor((108-tempo)*60);
                if(this.survivor == 0){
                    for(var i = 0; i < this.pcs.length; i++)
                        if(this.pcs[i].vidas<7){this.pcs[i].vidas++;}
                };
                this.musica.src = "assets/tema4.mp3"
                this.musica.play();
                this.countRespawn = 0;
                this.tempoTotal = t - this.startPoint;
                this.startPoint=t;
                this.newEnemy(5,this.pcs[Math.floor(Math.random()*this.pcs.length)]);
            }
            if(((this.respawner <= 0) || (this.spritesE.length == 0 && this.countRespawn < 5))){
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