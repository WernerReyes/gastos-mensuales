import Presupuesto from "./clases/Presupuesto.js";
import UI from "./clases/UI.js"

( function() {
     // VARIABLES
     const bodyFilas = document.querySelector('#tabla-gastos-total .body-filas');

    let tabla = JSON.parse(localStorage.getItem('tabla')) || [];

     // EVENTOS
     eventListeners();
     function eventListeners() {
       
          document.addEventListener('DOMContentLoaded', crearTablaHTML );

     }


     // INSTANCIAS
     const iu = new UI();
     


     // FUNCIONES
     function crearTablaHTML() {
          console.log(bodyFilas)

       iu.tablaHTML(tabla, bodyFilas);

     }


} )();
