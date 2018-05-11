
function EtiquetasSalto(){
    this.etiquetas = [];
}


EtiquetasSalto.prototype.insertarEtiqueta = function(etiqueta){
    this.etiquetas.unshift(etiqueta);
};

EtiquetasSalto.prototype.obtenerActual = function (){
    return this.etiquetas[0];
};

EtiquetasSalto.prototype.eliminarActual = function(){
    return this.etiquetas.shift();
};

module.exports = EtiquetasSalto;
