import UI from "./clases/UI.js"

( function() {
     // VARIABLES
     const bodyFilas = document.querySelector('#tabla-gastos-total .body-filas');

    let tabla = JSON.parse(localStorage.getItem('tabla')) || [];

    const ordenAnual = {
     enero: 1,
     febrero: 2,
     marzo: 3,
     abril: 4,
     mayo: 5,
     junio: 6,
     julio: 7,
     agosto: 8,
     septiembre: 9,
     octubre: 10,
     noviembre: 11,
     diciembre: 12
   };

     // EVENTOS
     eventListeners();
     function eventListeners() {
       
          document.addEventListener('DOMContentLoaded', crearTablaHTML );

     }


     // INSTANCIAS
     const iu = new UI();
     
    

     // FUNCIONES
     function crearTablaHTML() {
       
        // Ordenamos por meses
        tabla.sort((a, b) => ordenAnual[a.mes] - ordenAnual[b.mes]);

       iu.tablaHTML(tabla, bodyFilas);

     }


} )();
