function retorno(){
    this.tipo;
    this.valor;
}


retorno.prototype.setValorVacio = function(){
    this.tipo= "NULO2";
    this.tipo = 36;
};

retorno.prototype.setValorEntero = function(valor){
    this.tipo = "ENTERO";
    this.valor = valor;
};

retorno.prototype.setValorChar = function(valor){
    this.tipo = "CARACTER";
    this.valor = valor;
};

retorno.prototype.setValorDecimal = function(valor){
    this.tipo = "DECIMAL";
    this.valor = valor;
};

retorno.prototype.setValorBooleano = function(valor){
    this.tipo = "BOOLEANO";
    this.valor = valor;
};

retorno.prototype.setValores = function(tipo,valor){
    this.tipo = tipo;
    this.valor = valor;
};

retorno.prototype.setValoresNulos= function(){
    this.tipo= "nulo";
    this.valor ="nulo";
}

module.exports = retorno;


