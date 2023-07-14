import Presupuesto from './clases/Presupuesto.js';
import UI from './clases/UI.js';

(function() {
    // VARIABLES
    const containerGastos = document.querySelector('#Todos-gastos');
    const fechaActual = document.querySelector('.fecha-actual');
    const btnAgregarGastos = document.querySelector('#gastos-agregados .agregar');

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

      let tabla = JSON.parse(localStorage.getItem('tabla')) || [];
    
    // EVENTOS
    eventListeners();
    function eventListeners() {
        // Agregar mas gastos
        btnAgregarGastos.addEventListener( 'click', () => window.location.href = 'formulario.html#formulario' );
        
        // Cuando el documento ya este LISTO
        document.addEventListener('DOMContentLoaded', () => {
          // Colocamos la fecha actual
          fechaActual.textContent =  new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, ' ');
           
          // Insertamos el contenido
          crearHTML();

          // Eliminar gatos
          eliminarGasto(containerGastos);

          // Editamos gatos
          setEditarGasto(containerGastos);


          // Guardar cambios
          guardarCambios(containerGastos);

        
        });
    }


    // INSTANCIAS
    let presupuestoUsuario = new Presupuesto();
    const ui = new UI();

     
    // FUNCIONES
    function crearHTML() {

      let { presupuesto, gastos } = presupuestoUsuario;

      // Ordenamos por meses
      presupuesto.sort((a, b) => ordenAnual[a.mes] - ordenAnual[b.mes]);
      
      // Juntamos el prespuesto del mes con su respectivo gasto
      gastos.forEach(gasto => {
          presupuesto = presupuesto.map( presup => {
            if (presup.mes === gasto.mesInsertar) {
              return { ...presup, gastos: [...(presup.gastos || []), gasto ] };
            }
            return { ...presup, gastos: presup.gastos || [] }
          });
        });

        // Creamos el HTML
        ui.crearHTML(presupuesto, containerGastos)

        
        // Actualizamos los graficos
        crearGraficaMeses();

    }
   
    function eliminarGasto(contenedor) {

      contenedor.addEventListener('click', e => {
        if (e.target.classList.contains('eliminar-gasto') || e.target.classList.contains('bi-x-circle') ) {
          
          // Obtenemos el id
          const idGasto = e.target.dataset.id;
          
          // Lo eliminamos
          presupuestoUsuario.eliminarGasto(idGasto);
          
          // Volvemos a crear el HTML
          crearHTML();

        }
      });
    }

    function setEditarGasto(contenedor) {

      contenedor.addEventListener('click', e => {
        if (e.target.classList.contains('editar-gasto') || e.target.classList.contains('bi-pencil-square') ) {
    
          // Obtenemos el id
          const idGasto = e.target.dataset.id;
          
          const gastoEscogido = presupuestoUsuario.gastos.find( gasto => gasto.id === Number(idGasto) );

          localStorage.setItem('editar', JSON.stringify(gastoEscogido) );

          window.location.href = 'formulario.html';
        
        }
      });
    }
    

    function guardarCambios(contenedor) {

      contenedor.addEventListener('click', async e  => {
        if (e.target.classList.contains('guardar-cambios')) {
           
            const confirmacion = await ui.reemplazarPresupuesto('Guardar cambios', '¿Deseas guardar los cambios?', 'Cambio guardado correctamente');
            
            if(confirmacion) {

                // Obtenemos el id
                const idPresupuesto = e.target.dataset.id;
          
                // Fecha y hora de modificacion
                const fechaActual = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
                const horaActual = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });

                const prespuestoSelect = presupuestoUsuario.presupuesto.find( presup => {
                  if(presup.id === Number(idPresupuesto)) {
                    presup.fechaModificacion = `${fechaActual}, ${horaActual}`;
                    return presup;
                  }
                });

                // Verificar si el nuevo presupuesto ya existe en infoTabla
                const presupuestoExistente = tabla.some(presup => presup.id === prespuestoSelect.id); 

                if(presupuestoExistente) {
                  // Si hay un cambio reemplazamos el conetnido anterior
                  tabla = tabla.map( presup => presup.id === prespuestoSelect.id ? prespuestoSelect : presup );

                } else {
            // si no existe agregamos el contenido
                  tabla = [...tabla, prespuestoSelect ];
                }

                localStorage.setItem('tabla', JSON.stringify(tabla) );
           }
    }

  })
}

    function crearGraficaMeses() {
        const containerMeses = document.querySelector('#meses-year');
      ui.graficaMeses(Object.keys(ordenAnual), containerMeses, presupuestoUsuario.presupuesto);
      
     
    }

  

})();


