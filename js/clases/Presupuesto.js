class Presupuesto {
    constructor() {
        this.presupuesto = JSON.parse(localStorage.getItem('presupuesto')) || [];
        this.gastos = JSON.parse(localStorage.getItem('gastos')) || [];
     }
   
     // PRESUPUESTOS
     nuevosPresupuestos( presupuesto ) {
        this.presupuesto = [...this.presupuesto, presupuesto ]
        console.log(this.presupuesto)
        this.sincronizarStorage('presupuesto', this.presupuesto);
     }

     editarPresupuesto(presup, mes) {
        let gastoMes;

        const gastosPorMes = this.gastos.filter(gasto => gasto.mesInsertar === mes);
        
        if(!gastosPorMes.length ){
         gastoMes = 0
        } else {
         gastoMes = gastosPorMes.reduce((suma, gasto) => suma + Number(gasto.gastoRealizado), 0);
        }

        const nuevoPresupuesto = this.presupuesto.map( obj => {
          if (obj.mes === mes) {
            return { ...obj, presupuesto: presup, restante: Number(presup) - gastoMes };
          }
          return obj;
        });
      
        this.presupuesto = [...nuevoPresupuesto];
        this.sincronizarStorage('presupuesto', this.presupuesto);
      }

     
      // GASTOS
      nuevoGasto( gasto ) {
         this.gastos = [...this.gastos, gasto];
         this.restanteGastos(gasto, 'insertando');
         
         this.sincronizarStorage('gastos', this.gastos);

      }

      eliminarGasto( id ) {
        this.gastos = this.gastos.filter( gasto => {
         if(gasto.id !== Number(id)) {
            return gasto;
         }
         this.restanteGastos(gasto);
      });
        this.sincronizarStorage('gastos', this.gastos); 
      }

      editarGastos( nuevoGasto ) {
         // Obtenemos el gasto antiguo
         const gastoAntiguo = this.gastos.find(gasto => gasto.id === nuevoGasto.id).gastoRealizado;
         nuevoGasto.gastoAntiguo = gastoAntiguo;
     
        this.gastos = this.gastos.map( gasto => {
          if(gasto.id === nuevoGasto.id) {
            this.restanteGastos(nuevoGasto, 'editando');
            return nuevoGasto;
          } 
          return gasto;
        })
        this.sincronizarStorage('gastos', this.gastos); 
      }

      restanteGastos(gasto, tipo) {
         this.presupuesto = this.presupuesto.map( presup => {
          if(presup.mes === gasto.mesInsertar ) {
   
             if(tipo === 'insertando') {
             return {...presup, restante: presup.restante - Number(gasto.gastoRealizado) };
             } else if(tipo === 'editando') {
                return {...presup, restante: (presup.restante+Number(gasto.gastoAntiguo)) - Number(gasto.gastoRealizado) };
             }
             return {...presup, restante: presup.restante + Number(gasto.gastoRealizado) }; 
             
          }
          return presup;
         })
         this.sincronizarStorage('presupuesto', this.presupuesto);
   
      }

     sincronizarStorage(nombre, valor) {
        localStorage.setItem(nombre, JSON.stringify(valor) );
     }

     
}

export default Presupuesto;