class UI {
   
    motrarAlerta(insercion, mensaje, tipo) {
        
        const existe = document.querySelector('.text-center.alert');
        
      if(!existe) {
        // Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert', 'mx-5', 'p-2', 'mb-3');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;
        
        // Insertamos en el HTML
        insercion.insertAdjacentElement('afterend', divMensaje);

        // Quitar el mensaje del HTML
        setTimeout( () => {
         divMensaje.remove();
        },3000);

       }
    }

    reemplazarPresupuesto(mensaje, pregunta, confirmacion) {
        return new Promise( resolve => {
          Swal.fire({
            title: mensaje,
            text: pregunta,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(confirmacion, "", "success").then(
                () => {
                  resolve(true);
                }
              );
            } else {
              resolve(false);
            }
          });
        });
      }

    crearHTML(datosCompletos, container) {

      this.limpiarHTML(container);
  
    if(datosCompletos.length ) {
   
      
      datosCompletos.forEach( presup => {

        const { presupuesto, mes, gastos, restante, id } = presup;

        const gastoMes = document.createElement('DIV');
        gastoMes.classList.add('gasto-mes');
            const divMesPresupuesto = document.createElement('DIV');
            divMesPresupuesto.className = 'd-flex mx-3 justify-content-between';
                const nombreMes = document.createElement('H2');
                nombreMes.classList.add('mb-0');
                nombreMes.style.fontSize = '20px';
                nombreMes.textContent = mes.toUpperCase();
                const presupuestoMes = document.createElement('H2');
                presupuestoMes.classList.add('mb-0');
                presupuestoMes.style.fontSize = '25px';
                presupuestoMes.textContent = `S/. ${presupuesto}`;
            divMesPresupuesto.appendChild(nombreMes);
            divMesPresupuesto.appendChild(presupuestoMes);
        
        gastoMes.appendChild(divMesPresupuesto); // 1
        
        // Si existe algún gasto
        if(  gastos ) {
           gastos.forEach( gasto => {

            const { id, producto, gastoRealizado, categoria, hora, fecha } = gasto;
            
            const divGastos = document.createElement('DIV');
            divGastos.classList.add('mb-2');
                const fechaRegistro = document.createElement('P');
                fechaRegistro.classList.add('mb-0','fecha-registrado');
                fechaRegistro.textContent = (fecha === new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })) ? 'Hoy' : fecha;
                const separadorFecha = document.createElement('DIV');
                separadorFecha.classList.add('separator-fecha');
                const gastos = document.createElement('DIV');
                gastos.className = 'gastos d-flex justify-content-between';
                    const elementFlex = document.createElement('DIV');
                    elementFlex.classList.add('elemento','d-flex');
                        const divCircle = document.createElement('DIV');
                        divCircle.classList.add('circle','mb-0');
                        this.mostrarCategoria(divCircle,categoria);
                        const divColumn = document.createElement('DIV');
                        divColumn.className = 'd-flex flex-column mx-1';
                        divColumn.innerHTML = `
                        <span class="ml-2 nombre">${producto}</span>
                        <span class="ml-2 hora">${hora}</span>
                        `
                        const montoGastado = document.createElement('DIV');
                        montoGastado.classList.add('monto-gastado');
                        montoGastado.textContent = `-${gastoRealizado}`;
                        const btnGroup = document.createElement('DIV');
                        btnGroup.classList.add('btn-group');
                            const btnEliminar = document.createElement('BUTTON');
                            btnEliminar.classList.add('btn','btn-primary', 'eliminar-gasto');
                            btnEliminar.dataset.id = id;
                            btnEliminar.innerHTML = `<i class="bi bi-x-circle" data-id="${id}"></i>`;
                            const btnEditar = document.createElement('BUTTON');
                            btnEditar.classList.add('btn','btn-primary', 'editar-gasto');
                            btnEditar.dataset.id = id;
                            btnEditar.innerHTML = `<i class="bi bi-pencil-square" data-id="${id}"></i>`;
                            
                        btnGroup.appendChild(btnEliminar);
                        btnGroup.appendChild(btnEditar);
                    elementFlex.appendChild(divCircle);
                    elementFlex.appendChild(divColumn);
                gastos.appendChild(elementFlex);
                gastos.appendChild(montoGastado);
                gastos.appendChild(btnGroup);
            divGastos.appendChild(fechaRegistro);
            divGastos.appendChild(separadorFecha);
            divGastos.appendChild(gastos);
        
        gastoMes.appendChild(divGastos); // 2

           }) 

          }
           
            const divBtnGuardarCambios = document.createElement('DIV');
            divBtnGuardarCambios.classList.add('text-center','mt-4');
            divBtnGuardarCambios.innerHTML = `<p class="mb-0">RESTANTE: S/.${restante}</p>`
            divBtnGuardarCambios.style.fontWeight = 600;
            divBtnGuardarCambios.style.fontSize = '20px';
                const btnGuardarCambios = document.createElement('BUTTON');
                btnGuardarCambios.className = 'btn btn-primary guardar-cambios';
                btnGuardarCambios.textContent = 'Guardar cambios';
                btnGuardarCambios.dataset.id = id;

            divBtnGuardarCambios.appendChild(btnGuardarCambios); // Insertamos
      
        
        gastoMes.appendChild(divBtnGuardarCambios); // 3

        // Insertamos en el HTML
        container.appendChild(gastoMes);
      
          });

        } else {

          const pVacio = document.createElement('P');
          pVacio.classList.add('text-center')
          pVacio.textContent = "No hay nigun registro";
          pVacio.style.fontFamily = 'Poppins';
          pVacio.style.fontSize = '30px'
          pVacio.style.fontWeight = 600;
        
         container.appendChild(pVacio);
        }


    }


    mostrarCategoria(circulo, categoria) {
      switch (categoria) {
        case 'compras':
          circulo.style.backgroundColor = '#32A7E2';
          circulo.innerHTML = '<i class="bi bi-cart-fill d-flex justify-content-center"></i>';
          break;
        
        case 'transporte':
          circulo.style.backgroundColor = '#B548C6';
          circulo.innerHTML = '<i class="bi bi-car-front-fill d-flex justify-content-center"></i>';
          break;
        
        case 'entretenimiento':
          circulo.style.backgroundColor = '#4BA83D';
          circulo.innerHTML = '<i class="bi bi-play-circle-fill d-flex justify-content-center"></i>';
          break;
      
        default:
          circulo.style.backgroundColor = '#DC3434';
          circulo.innerHTML = '<i class="bi bi-cup-straw d-flex justify-content-center"></i>';
          break;
      }
    }


    graficaMeses(meses, container, presupuesto) {

      this.limpiarHTML(container);

      const yearActual = document.createElement('DIV');
      yearActual.classList.add('text-center','mt-3')
      yearActual.textContent = `Meses del año ${new Date().getFullYear()}`;

      container.appendChild(yearActual);

      meses.forEach( (mes,index) => {

        const contenedorMeses = document.createElement('DIV');
        contenedorMeses.classList.add('mes');
           const titleMes = document.createElement('P');
           titleMes.classList.add('title','mb-0');
           titleMes.textContent = mes.charAt(0).toUpperCase()+mes.slice(1); // Insertamos los nombres
           const divProgress = document.createElement('DIV');
           divProgress.classList.add('progress');
           divProgress.setAttribute('role', 'progressbar');
           divProgress.setAttribute('aria-valuenow', `${this.porcentajeMeses(presupuesto[index])}`)
           divProgress.setAttribute('aria-valuemin', '0')
           divProgress.setAttribute('aria-valuemax', '100')
           divProgress.style.height = '20px';
               const divProgressBar = document.createElement('DIV');
               divProgressBar.classList.add('progress-bar',`${this.coloresMeses(this.porcentajeMeses(presupuesto[index]))}`);
               divProgressBar.style.width = `${this.porcentajeMeses(presupuesto[index])}%`;
               divProgressBar.textContent = `${this.porcentajeMeses(presupuesto[index])}%`;
               
          divProgress.appendChild(divProgressBar);
        contenedorMeses.appendChild(titleMes);
        contenedorMeses.appendChild(divProgress);
        

        // Insertamos en el HTML
        container.appendChild(contenedorMeses);

      } )
    }

   
    tablaHTML(tabla, tbody) {

      if( tabla.length ) {

      tabla.forEach( (datos,index) => {
          const { presupuesto, restante, fechaModificacion } = datos;

          const tr = document.createElement('TR');
              const tdNro = document.createElement('TD');
              tdNro.textContent = (index+1)
              const tdProgress = document.createElement('TD');
                  const divProgress = document.createElement('DIV');
                  divProgress.classList.add('progress');
                  divProgress.innerHTML = `
                      <div class="progress-bar ${this.coloresMeses(this.porcentajeMeses(datos))}" 
                           role="progressbar" style="width: ${this.porcentajeMeses(datos)}px;" 
                           aria-valuenow="${this.porcentajeMeses(datos)}" 
                           aria-valuemin="0" 
                           aria-valuemax="100">
                           ${this.porcentajeMeses(datos)}%
                      </div>`
              tdProgress.appendChild(divProgress);
              const tdMontoGastado = document.createElement('TD');
              tdMontoGastado.textContent = `S/.${(Number(presupuesto)-restante)}`;
              const tdRestante = document.createElement('TD');
              tdRestante.textContent = `S/.${restante}`;
              const tdTotal = document.createElement('TD');
              tdTotal.textContent = `S/.${presupuesto}`;
              const fechaModi = document.createElement('TD');
              fechaModi.textContent = fechaModificacion;
          

          tr.appendChild(tdNro);
          tr.appendChild(tdNro);
          tr.appendChild(tdProgress);
          tr.appendChild(tdMontoGastado);
          tr.appendChild(tdRestante);
          tr.appendChild(tdTotal);
          tr.appendChild(fechaModi);

          // Insertamos en el HTML
          tbody.appendChild(tr);
                  
      } )

      return;

    }

      const tr = document.createElement('TR');
          const td = document.createElement('TD');
          td.classList.add('text-center');
          td.setAttribute('colspan','6');
          td.textContent = 'SIN REGISTROS';
          td.style.fontSize = '20px';
          td.style.fontWeight = 600;
      tr.appendChild(td);

          // Insertamos que no hay anda
         tbody.appendChild(tr);

    }


    porcentajeMeses(presup) {

      if(presup) {
        const { presupuesto, restante } = presup;

        return Math.round(100-(restante*100/(Number(presupuesto))),2);
      }

      return 0;
    }

    coloresMeses(porcentaje) {
      if(porcentaje < 50) {
        return 'bg-success';
      } else if(porcentaje < 80) {
        return 'bg-warning';
      } 

      return 'bg-danger';
    }


    limpiarHTML(container) {
      while( container.firstChild ) {
        container.removeChild(container.firstChild);
      }
    }

}


export default UI;