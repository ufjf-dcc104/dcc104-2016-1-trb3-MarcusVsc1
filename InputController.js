function InputController() {
		this.nomes = {};
		this.codigos = {};
		this.teclas = {};
		this.joysticks = {};
		this.comandos = {};
		this.movimentos = {};

}


InputController.prototype.setupKeyboard = function(novasTeclas) {
	for (var t = novasTeclas.length - 1; t >= 0; t--) {
		const tecla = novasTeclas[t];
		this.nomes[tecla.codigo] = tecla.nome;
		this.codigos[tecla.nome] = tecla.codigo;
		this.teclas[tecla.nome] = false;
	}
	var that = this;
	addEventListener("keydown", function (e) {
		var nome = that.nomes[e.keyCode];
		if(nome){
			that.teclas[nome] = true;
			e.preventDefault();
		}
	});
	addEventListener("keyup", function (e) {
		var nome = that.nomes[e.keyCode];
		if(nome){
			that.teclas[nome] = false;
			e.preventDefault();
		}
	});
}

InputController.prototype.setupJoysticks = function () {
	var that = this;
	addEventListener("gamepadconnected", function (e) {
		var gamepad = e.gamepad;
		console.log(`${gamepad}.id is connected!`);
		that.joysticks[gamepad.index] = gamepad;
	});
	addEventListener("gamepaddisconnected", function (e) {
		var gamepad = e.gamepad;
		console.log(`${gamepad}.id is disconnected!`);
		delete that.joysticks[gamepad.index];
	});
}

InputController.prototype.updateJoysticks = function () {
	var gamepads = navigator.getGamepads();
	for(var g = 0; g < gamepads.length; g++) {
		var gamepad = gamepads[g];
		if(gamepad) {this.joysticks[gamepad.index] = gamepad;}	
	}
}

InputController.prototype.setupComandos = function (novosComandos) {
   for (var c = 0; c < novosComandos.length; c++) {
       var comando = novosComandos[c];

       this.comandos[comando.comando] = {
           "comando": comando.comando,
           "tecla": comando.tecla,
           "tecla2": comando.tecla2,
           "joystick": comando.joystick,
           "botao": comando.botao,
           "valor": false
       };
   }
};

InputController.prototype.updateComandos = function () {
   this.updateJoysticks();
   for (c in this.comandos) {
       var comando = this.comandos[c];
       var jv = false;
       if (this.joysticks[comando.joystick] && this.joysticks[comando.joystick].buttons[comando.botao]) {
           jv = this.joysticks[comando.joystick].buttons[comando.botao].pressed;
       }
       comando.valor = this.teclas[comando.tecla] || this.teclas[comando.tecla2] || jv || false;
   }
};

InputController.prototype.updateMovimentos = function () {
   for (m in this.movimentos) {
       var movimento = this.movimentos[m];
       var jv = 0;
       if (this.joysticks[movimento.joystick]) {
           jv = this.joysticks[movimento.joystick].axes[movimento.eixo];
       }
       var tv = 1 * this.teclas[movimento.positivo] - 1 * this.teclas[movimento.negativo];
       movimento.valor = jv || tv || 0.0;
   }
};

InputController.prototype.setupMovimentos = function(novosMovimentos){
	for (var c = 0; c < novosMovimentos.length; c++) {
       var movimento = novosMovimentos[c];

       this.movimentos[movimento.movimento] = {
       	   "movimento": movimento.movimento,
           "eixo": movimento.eixo,
           "positivo": movimento.positivo,
           "joystick": movimento.joystick,
           "negativo": movimento.negativo
       };
   }
}


InputController.prototype.update = function () {
   this.updateJoysticks();
   this.updateComandos();
   this.updateMovimentos();
}