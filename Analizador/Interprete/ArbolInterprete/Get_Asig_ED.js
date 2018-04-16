function Get_Asig_ED(tipo,pos,val,ed){
    //tipo 1 =>  stack[t1] = t2; entra 2=> sale t2 = stack[t1] 
    //ed 0-> stack 1-> heap
    this.tipo = tipo;
    this.posicion = pos;
    this.valor = val;
    this.ed= ed;

};

module.exports = Get_Asig_ED;