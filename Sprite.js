function Sprite(params = {}) {
    var exemplo = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        h: 10,
        w: 10,
        va: 0,
        vm: 0,
        color: "blue",
        imune: 0,
        atirando: 0,
        props: {},
        a: 0,
        cooldown: 0,
        comportar: undefined,
        scene: undefined,
        atirar: undefined,
        imagem: null,
        tiroCorrente: 0,
        modeloTiro: [],
        vidas: 0,
        maxVidas: this.vidas,
        turbo: 0,
        powerUp: 0,
        drop: 0,
        lifebar: 30,
        pontuacao: 0,
        changeCD: 0, 
        turboTrigger:0, 
        teclas: {
            esquerda: 0,
            cima: 0,
            direita: 0,
            baixo: 0,
            espaco: 0,
            turbo: 0,
            survivor: 0,
        }
    }
    Object.assign(this, exemplo, params);
}
Sprite.prototype = new Sprite();
Sprite.prototype.constructor = Sprite;

//desenha o sprite
Sprite.prototype.desenhar = function(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if(this.imune > 0){
      ctx.globalAlpha = 0.5*Math.cos(60*this.imune);
    }
    ctx.rotate(this.a + Math.PI/2);
    ctx.drawImage(this.scene.assets.img(this.imagem),-this.w/2,-this.h/2,this.w,this.h);
    ctx.globalAlpha = 1.0;
    ctx.restore();
};


//move o sprite
Sprite.prototype.mover = function (dt) {
    this.a = this.a + this.va*dt;
    this.vx = this.vm*Math.cos(this.a);
    this.vy = this.vm*Math.sin(this.a);
    this.x = this.x + this.vx*dt;
    this.y = this.y + this.vy*dt;
    this.cooldown = this.cooldown-dt;
    if(this.imune > 0) {
        this.imune = this.imune - 1*dt;
    }

}

//verifica se colidiu com outro sprite
Sprite.prototype.colidiuCom = function(alvo){
    if(alvo.x + alvo.w/2 < this.x-this.w/2) return false;
    if(alvo.x - alvo.w/2 > this.x+this.w/2) return false;

    if(alvo.y + alvo.h/2 < this.y-this.h/2) return false;
    if(alvo.y - alvo.h/2 > this.y+this.h/2) return false;

    return true;
};