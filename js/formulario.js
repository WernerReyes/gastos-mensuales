import Presupuesto from './clases/Presupuesto.js'
import UI from './clases/UI.js';

(function() {
  
  // VARIABLES
  const formularioPresupuesto = document.querySelector('#formulario-presupuesto');
  const formularioRellenarDatos = document.querySelector('#formulario')
  const btnInsetarPresupuesto = document.querySelector('#formulario-presupuesto .insertar')
  const btnRellenarGastos = document.querySelector('#formulario .insertar');
  
 

  let gastosEditar =  JSON.parse(localStorage.getItem('editar')) || []; 



  // EVENTOS
  eventListeners()
  function eventListeners(){
    // Enlaces a otras paginas
    irOtraPagina(document.querySelector('.form-gastos'), '#');
    irOtraPagina(document.querySelector('.index-gastos'), 'index.html');
    irOtraPagina(document.querySelector('.tabla-gastos'), 'ver-gastos.html');


    // Insertar o rellenar gastos
    btnInsetarPresupuesto.addEventListener( 'click', insertarPresupuesto );
    btnRellenarGastos.addEventListener('click', rellenarGastos );
    
    // Cambiar formulario
    const cambiarFormulario = document.querySelector('#formulario .insertar-presupuesto');
    cambiarFormulario.addEventListener('click', e => {
        e.preventDefault();
        formularioPresupuesto.parentElement.classList.toggle('d-none');
        formularioRellenarDatos.parentElement.classList.toggle('d-none');
        reinicarGastos()
    })


    // Editar gasto
    document.addEventListener('DOMContentLoaded', () => {
      if( Object.keys(gastosEditar).length || gastosEditar.length ) {
         getEditarGastos();
         console.log("Hay")
         console.log(gastosEditar);
      } else {
        console.log("NO Hay")
      }
    }); 
    
  }

  // INSTANCIAMOS
  let presupuestoUsuario = new Presupuesto();
  const ui = new UI();


  // FUNCIONES
  async function insertarPresupuesto(e) {
    e.preventDefault();
   
    const presupuesto = document.querySelector('#presupuesto').value;
    const mes = document.querySelector('.mes').value;

    if( [presupuesto, mes].includes('') || mes === 'Selecciona el mes' ){
      ui.motrarAlerta(document.querySelector('.rellenar-gastos'), 'Hay campos vacios', 'error');
      return;
    }

    if(presupuesto<=0) {
      ui.motrarAlerta(document.querySelector('.form-floating'), 'Ingresa un presupuesto mayor a 0', 'error');
      return;
    }
    
    if(comprobarMes(mes)) {
      const respuesta = await ui.reemplazarPresupuesto(`El mes: ${mes} ya fue registrado`,'¿Deseas reemplazar el presupuesto?','Presupuesto reemplazado correctamente!');
          if(respuesta) {
            presupuestoUsuario.editarPresupuesto(presupuesto, mes);
            
            // Reiniciamos el formulario
            formularioPresupuesto.reset();
          }

      return;
    }

    // Insertamos los nuevos presupuestos
    presupuestoUsuario.nuevosPresupuestos({presupuesto, mes, restante: Number(presupuesto), id: Date.now() });
    
    // Mostramos el aviso de que el presupuesto fue insertado correctamente
    ui.motrarAlerta(document.querySelector('.rellenar-gastos'), 'Presupuesto insertado correctamente');

    // Reiniciamos el formulario
    formularioPresupuesto.reset();
  }


  
  // RELLENAR GASTOS
  function rellenarGastos(e) {
    e.preventDefault();
    
    const mesInsertar = document.querySelector('#formulario .mes').value;
    const producto = document.querySelector('#formulario #producto').value;
    const gastoRealizado = document.querySelector('#formulario #monto-gastado').value;
    const categoria = document.querySelector('#formulario .categoria').value;

    if( [ mesInsertar, producto, gastoRealizado, categoria ].includes('') || mesInsertar === 'Selecciona el mes a insertar' || categoria == 'Selecciona la categoria' ){
      ui.motrarAlerta(document.querySelector('.insertar-presupuesto'), 'Hay campos vacios', 'error');
      return;
    }

    if(gastoRealizado<=0) {
      ui.motrarAlerta(document.querySelector('.monto-gasto'), 'Ingresa un presupuesto mayor a 0', 'error');
      return;
    }

    if(!comprobarMes(mesInsertar)) {
      ui.motrarAlerta(document.querySelector('.insertar-presupuesto'), `No existe un presupuesto para el mes: ${mesInsertar}`, 'error')
      return;
    }

    if( Object.keys(gastosEditar).length || gastosEditar.length ) {
         
          if(comprobarGastosEditar(mesInsertar, gastoRealizado, gastosEditar.id)) {
              ui.motrarAlerta(document.querySelector('.insertar-presupuesto'), `¡ERROR! el gasto a editar no puedes exceder el presupuesto del mes: ${mesInsertar}`, 'error');
              return;
            };
          
          // Nuevo gasto
          const nuevoGasto = { mesInsertar, producto, gastoRealizado, categoria, id: gastosEditar.id, hora: new Date().toLocaleTimeString('es-ES', { hour12: false }), fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) };
    
           // Editamos los nuevos gastos
           presupuestoUsuario.editarGastos(nuevoGasto );
           
           // Cambiomos el nombre del btn
           btnRellenarGastos.textContent = 'Insertar';
           
           // Habilitamos el select
           document.querySelector('#formulario .mes').disabled = false;

           // Mostramo un aviso de que el producto se edito correctamente
           ui.motrarAlerta(document.querySelector('.insertar-presupuesto'), `El registro se editó correctamente`);
  

           reinicarGastos();

    
    } else {
     
           if(comprobarGastosInsertar(mesInsertar, gastoRealizado)) {
             ui.motrarAlerta(document.querySelector('.insertar-presupuesto'), `¡ERROR! no puedes exceder el presupuesto del mes: ${mesInsertar}`, 'error');
             return;
           };
           
           const gasto = { mesInsertar, producto, gastoRealizado, categoria, id: Date.now(), hora: new Date().toLocaleTimeString('es-ES', { hour12: false }), fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) };

           // Insertamos los nuevos gastos
           presupuestoUsuario.nuevoGasto( gasto );

           // Mostramos un aviso de que el producto se inserto correctamente
           ui.motrarAlerta(document.querySelector('.insertar-presupuesto'), `Producto "${producto}" insertado correctamente`);
  
    }
    
    // Reiniciamos el formulario
    formularioRellenarDatos.reset();

  }


  function comprobarMes( mes ) {
    if(presupuestoUsuario.presupuesto.some( meses => meses.mes === mes )) {
      return true;
    }
     return false;

  }

  function comprobarGastosInsertar(mes, gastoRealizado) {
    const presupuesto = presupuestoUsuario.presupuesto.find(pres => pres.mes === mes);
    if (presupuesto) {
      return presupuesto.restante - Number(gastoRealizado) < 0;
    }
    return false;
  }

  function comprobarGastosEditar(mes, gastoRealizado, id) {
    let gastoMes;

    const presupuesto = presupuestoUsuario.presupuesto.find(pres => pres.mes === mes);
    const gastos = presupuestoUsuario.gastos.filter( gasto => gasto.id !== id && gasto.mesInsertar === mes );
    
    if(!gastos.length ) {
      gastoMes = 0;
    } else {
      gastoMes = gastos.reduce((suma, gasto) => suma + Number(gasto.gastoRealizado), 0);
    }

    if(presupuesto) {
      return presupuesto.presupuesto < gastoMes+Number(gastoRealizado);
    }
    
    return false;
  }


  function getEditarGastos() {
  
    const mesInsertar = document.querySelector('#formulario .mes');
    mesInsertar.disabled = true;
    mesInsertar.value = gastosEditar.mesInsertar;

    /* Producto */ document.querySelector('#formulario #producto').value = gastosEditar.producto;
    /* Gasto realizado */ document.querySelector('#formulario #monto-gastado').value = gastosEditar.gastoRealizado;
    /* categoria */  document.querySelector('#formulario .categoria').value = gastosEditar.categoria;

    btnRellenarGastos.textContent = 'Guardar cambios';

  }

  function reinicarGastos() {
    localStorage.removeItem('editar');
    formularioRellenarDatos.reset();
    gastosEditar = '';
  }

  function irOtraPagina(contenedor, ruta) {
    contenedor.addEventListener('click', () => {
       window.location.href = ruta;

       reinicarGastos();
    });
  }
  
})();
