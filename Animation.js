function Animation(params ={}) {
    exemplo = {
        x: 0,
        y: 0,
        frame: 0,
        w: 40,
        h: 40,
        imagem: null,
        props: {
            tipo: "boom"
        },
    }
    Object.assign(this, exemplo, params);
}

Animation.prototype.mover = function(dt){
    this.frame += 26*dt;
    if(Math.floor(this.frame) > 16){
        this.scene.toRemove.push(this);
    }
}

Animation.prototype.desenhar = function(){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.a + Math.PI/2);
    var F = Math.floor(this.frame);
    ctx.drawImage(
        this.scene.assets.img(this.imagem),
        (F%4)*64,
        Math.floor(F/4)*64,
        64,
        64,
        -this.w/2,
        -this.h/2,
        this.w,
        this.h 
    );
    ctx.restore();
}

Animation.prototype.comportar = function(){

}

Animation.prototype.colidiuCom = function(){
    return false;
}