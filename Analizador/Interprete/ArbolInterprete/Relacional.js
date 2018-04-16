function Relacional(simb,op1,op2,etV,etF){
    this.signo = simb;
    this.operando1= op1;
    this.operando2= op2;
    this.etiquetaV= etV;
    this.etiquetaF = etF;
}

module.exports = Relacional;