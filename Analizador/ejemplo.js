var Clase = require("./Arbol/Clase");

var nuevo = new Clase();

nuevo.setValores("persona","individuos",[]);
console.log(nuevo.getNombre());
console.log("Hereda de " + nuevo.getHerencia());

/*
nuevo.setValores("persona","individio",[]);
console.log(nuevo.getNombre());
console.log(nuevo.getHerencia());*/

