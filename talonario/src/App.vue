<template>
  <!-- Modal de configuración inicial -->
  <div v-if="mostrarModalConfig" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2>CONFIGURA TU TALONARIO</h2>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label>Ingrese el premio de la rifa</label>
          <input 
            type="text" 
            v-model="configuracion.premio" 
            placeholder="Ej: $10.000.000"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>Ingrese valor de la boleta</label>
          <input 
            type="text" 
            v-model="configuracion.valorBoleta" 
            placeholder="Ej: $10.000"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>Seleccione la lotería</label>
          <select v-model="configuracion.loteria" class="form-input">
            <option value="">Seleccione...</option>
            <option value="Cruz Roja">Cruz Roja</option>
            <option value="La Perla">La Perla</option>
            <option value="Santander">Santander</option>
            <option value="Baloto">Baloto</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Cantidad de Boletas</label>
          <input 
            type="number" 
            v-model="configuracion.cantidadBoletas" 
            min="1" 
            max="100"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>Fecha del sorteo</label>
          <input 
            type="date" 
            v-model="configuracion.fechaSorteo" 
            class="form-input"
          >
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="guardarConfiguracion" class="btn-guardar">
          Guardar Configuración
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de personalización -->
  <div v-if="mostrarModalPersonalizar" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2>PERSONALIZAR TALONARIO</h2>
        <button @click="mostrarModalPersonalizar = false" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="color-section">
          <h3>Colores Header</h3>
          <div class="color-options">
            <button 
              v-for="(color, index) in coloresHeader" 
              :key="'header-'+index"
              class="color-option"
              :style="{ backgroundColor: color.value }"
              @click="seleccionarColor('header', color)"
              :class="{ selected: configuracionColor.header === color.value }"
            >
              {{ color.nombre }}
            </button>
          </div>
        </div>
        
        <div class="color-section">
          <h3>Colores Footer</h3>
          <div class="color-options">
            <button 
              v-for="(color, index) in coloresFooter" 
              :key="'footer-'+index"
              class="color-option"
              :style="{ backgroundColor: color.value }"
              @click="seleccionarColor('footer', color)"
              :class="{ selected: configuracionColor.footer === color.value }"
            >
              {{ color.nombre }}
            </button>
          </div>
        </div>
        
        <div class="color-section">
          <h3>Colores Botones</h3>
          <div class="color-options">
            <button 
              v-for="(color, index) in coloresBotones" 
              :key="'botones-'+index"
              class="color-option"
              :style="{ backgroundColor: color.value }"
              @click="seleccionarColor('botones', color)"
              :class="{ selected: configuracionColor.botones === color.value }"
            >
              {{ color.nombre }}
            </button>
          </div>
        </div>
        
        <div class="color-section">
          <button @click="aplicarColoresPorDefecto" class="btn-default">
            Colores por Defecto
          </button>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="aplicarColores" class="btn-guardar">
          Aplicar Colores
        </button>
        <button @click="mostrarModalPersonalizar = false" class="btn-cerrar">
          Cerrar
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de detalle de boleta -->
  <div v-if="mostrarModalBoleta" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header" :style="{ backgroundColor: configuracionColor.header }">
        <h2>Boleta {{ boletaSeleccionada }}</h2>
        <button @click="mostrarModalBoleta = false" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="boleta-status" :class="{
          'status-reservada': estadoBoleta(boletaSeleccionada) === 'Reservada',
          'status-pagada': estadoBoleta(boletaSeleccionada) === 'Pagada',
          'status-entregada': estadoBoleta(boletaSeleccionada) === 'Entregada',
          'status-disponible': !estadoBoleta(boletaSeleccionada)
        }">
          Estado: {{ estadoBoleta(boletaSeleccionada) || 'Disponible' }}
        </div>
        
        <div class="form-group">
          <label>Ingrese nombre del comprador</label>
          <input 
            type="text" 
            v-model="comprador.nombre" 
            placeholder="Nombre completo"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>Ingrese dirección del comprador</label>
          <input 
            type="text" 
            v-model="comprador.direccion" 
            placeholder="Dirección completa"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>Ingrese número telefónico</label>
          <input 
            type="text" 
            v-model="comprador.telefono" 
            placeholder="Número de contacto"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>Seleccione el estado de la boleta</label>
          <select v-model="comprador.estado" class="form-input">
            <option value="Reservada">Reservada</option>
            <option value="Pagada">Pagada</option>
            <option value="Entregada">Entregada</option>
          </select>
        </div>
      </div>
      
      <div class="modal-footer" :style="{ backgroundColor: configuracionColor.footer }">
        <button 
          v-if="estadoBoleta(boletaSeleccionada)" 
          @click="eliminarBoleta" 
          class="btn-eliminar"
        >
          <i class="fas fa-trash"></i> Eliminar
        </button>
        <button @click="guardarComprador" class="btn-guardar" :style="{ backgroundColor: configuracionColor.botones }">
          <i class="fas" :class="estadoBoleta(boletaSeleccionada) ? 'fa-save' : 'fa-check'"></i>
          {{ estadoBoleta(boletaSeleccionada) ? 'Actualizar' : 'Registrar' }}
        </button>
        <button @click="mostrarModalBoleta = false" class="btn-cerrar">
          <i class="fas fa-times"></i> Cerrar
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de listado de boletas -->
  <div v-if="mostrarModalListado" class="modal-overlay">
    <div class="modal-container" style="max-width: 900px;">
      <div class="modal-header">
        <h2>LISTADO DE BOLETAS</h2>
        <button @click="mostrarModalListado = false" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="table-responsive">
          <table class="boletas-table">
            <thead>
              <tr>
                <th>Nombre Comprador</th>
                <th>Dirección</th>
                <th>Número Telefónico</th>
                <th>Fecha Compra Boleta</th>
                <th>Estado Boleta</th>
                <th>N. Boleta</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="boleta in boletasSeleccionadas" :key="boleta.numero">
                <td>{{ boleta.comprador.nombre || '-' }}</td>
                <td>{{ boleta.comprador.direccion || '-' }}</td>
                <td>{{ boleta.comprador.telefono || '-' }}</td>
                <td>{{ boleta.fechaCompra || 'No registrada' }}</td>
                <td>
                  <span class="estado-badge" :class="{
                    'reservada': boleta.estado === 'Reservada',
                    'pagada': boleta.estado === 'Pagada',
                    'entregada': boleta.estado === 'Entregada'
                  }">
                    {{ boleta.estado }}
                  </span>
                </td>
                <td>{{ boleta.numero }}</td>
              </tr>
              <tr v-if="boletasSeleccionadas.length === 0">
                <td colspan="6" class="text-center">No hay boletas registradas</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="totales-section">
          <div class="total-item">
            <span class="total-label">Dinero recaudado:</span>
            <span class="total-value">$ {{ formatCurrency(calcularRecaudado()) }}</span>
          </div>
          <div class="total-item">
            <span class="total-label">Deuda total:</span>
            <span class="total-value">$ {{ formatCurrency(calcularDeuda()) }}</span>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="generarArchivo" class="btn-guardar">
          <i class="fas fa-file-export"></i> GENERAR ARCHIVO
        </button>
        <button @click="mostrarModalListado = false" class="btn-cerrar">
          Cerrar
        </button>
      </div>
    </div>
  </div>

  <!-- Contenido principal del talonario -->
  <div v-if="!mostrarModalConfig" class="talonario-container">
    <header class="header" :style="{ backgroundColor: configuracionColor.header }">
      <div class="title-container">
        <h1 class="title">TALONARIO DE RIFAS</h1>
        <div class="loteria-badge">{{ configuracion.loteria }}</div>
      </div>
      <div class="header-details">
        <div class="detail-item">
          <span class="detail-label">Fecha:</span>
          <span class="detail-value">{{ configuracion.fechaSorteo }}</span>
        </div>
      </div>
    </header>
    
    <div class="info-section card">
      <div class="section-header">
        <h2 class="section-title">
          <i class="fas fa-info-circle icon"></i>
          Información del Talonario
        </h2>
        <button @click="editarInformacion" class="edit-btn">
          <i class="fas fa-pencil-alt"></i>
          <span class="edit-text">Editar</span>
        </button>
      </div>
      <ul class="info-list">
        <li class="info-item">
          <span class="info-label">
            <i class="fas fa-trophy icon"></i>
            Premio:
          </span>
          <span class="info-value highlight">{{ configuracion.premio }}</span>
        </li>
        <li class="info-item">
          <span class="info-label">
            <i class="fas fa-ticket-alt icon"></i>
            Valor boleta:
          </span>
          <span class="info-value highlight">{{ configuracion.valorBoleta }}</span>
        </li>
        <li class="info-item">
          <span class="info-label">
            <i class="fas fa-hashtag icon"></i>
            Total boletas:
          </span>
          <span class="info-value">{{ configuracion.cantidadBoletas }}</span>
        </li>
        <li class="info-item">
          <span class="info-label">
            <i class="fas fa-chart-pie icon"></i>
            Estado de boletas:
          </span>
          <span class="info-value">
            <span class="status-badge disponible">{{ contarBoletasPorEstado().disponibles }} Disponibles</span>
            <span class="status-badge reservada">{{ contarBoletasPorEstado().reservadas }} Reservadas</span>
            <span class="status-badge pagada">{{ contarBoletasPorEstado().pagadas }} Pagadas</span>
            <span class="status-badge entregada">{{ contarBoletasPorEstado().entregadas }} Entregadas</span>
          </span>
        </li>
      </ul>
    </div>
    
    <div class="divider"></div>
    
    <div class="boletas-section card">
      <h2 class="section-title">
        <i class="fas fa-list-ol icon"></i>
        Boletas Disponibles
      </h2>
      <div class="boletas-grid">
        <button 
          v-for="numero in numerosBoletas" 
          :key="numero"
          class="boleta-btn"
          :class="{ 
            'reservada': estadoBoleta(numero) === 'Reservada',
            'pagada': estadoBoleta(numero) === 'Pagada',
            'entregada': estadoBoleta(numero) === 'Entregada',
            'last-ten': numero >= (configuracion.cantidadBoletas - 10),
            'first-row': numero < 10
          }"
          @click="mostrarDetalleBoleta(numero)"
        >
          <span class="boleta-number">{{ numero }}</span>
          <span v-if="estadoBoleta(numero)" class="status-icon">
            <i v-if="estadoBoleta(numero) === 'Reservada'" class="fas fa-clock"></i>
            <i v-if="estadoBoleta(numero) === 'Pagada'" class="fas fa-check-circle"></i>
            <i v-if="estadoBoleta(numero) === 'Entregada'" class="fas fa-box-open"></i>
          </span>
        </button>
      </div>
    </div>
    
    <div class="divider"></div>
    
    <div class="actions-section card">
      <h2 class="section-title">
        <i class="fas fa-cogs icon"></i>
        Acciones
      </h2>
      <div class="action-buttons">
        <button @click="personalizarTalonario" class="action-btn personalizar-btn" :style="{ backgroundColor: configuracionColor.botones }">
          <i class="fas fa-paint-brush btn-icon"></i>
          <span class="btn-text">PERSONALIZAR</span>
        </button>
        <button @click="listarBoletas" class="action-btn listar-btn" :style="{ backgroundColor: configuracionColor.botones }">
          <i class="fas fa-list-ol btn-icon"></i>
          <span class="btn-text">LISTAR BOLETAS</span>
        </button>
      </div>
    </div>
    
    <footer class="footer" :style="{ backgroundColor: configuracionColor.footer }">
      <div class="copyright">
        <p>© 2024 Sistema de Talonarios de Rifas. Todos los derechos reservados.</p>
        <p class="version">Versión 2.0.0</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import Swal from 'sweetalert2';

// Estado del modal
const mostrarModalConfig = ref(true);
const mostrarModalPersonalizar = ref(false);
const mostrarModalBoleta = ref(false);
const mostrarModalListado = ref(false);
const boletaSeleccionada = ref(null);

// Configuración del talonario
const configuracion = reactive({
  premio: '',
  valorBoleta: '',
  loteria: '',
  cantidadBoletas: 100,
  fechaSorteo: new Date().toISOString().split('T')[0]
});

// Configuración de colores
const configuracionColor = reactive({
  header: '#4e73df',
  footer: '#4e73df',
  botones: '#1cc88a'
});

// Opciones de colores
const coloresHeader = ref([
  { nombre: 'Color Amarillo', value: '#ffc107' },
  { nombre: 'Color Verde', value: '#28a745' },
  { nombre: 'Color Rosa', value: '#e83e8c' },
  { nombre: 'Color Naranja', value: '#fd7e14' }
]);

const coloresFooter = ref([
  { nombre: 'Color Amarillo', value: '#ffc107' },
  { nombre: 'Color Verde', value: '#28a745' },
  { nombre: 'Color Rosa', value: '#e83e8c' },
  { nombre: 'Color Naranja', value: '#fd7e14' }
]);

const coloresBotones = ref([
  { nombre: 'Color Amarillo', value: '#ffc107' },
  { nombre: 'Color Verde', value: '#28a745' },
  { nombre: 'Color Rosa', value: '#e83e8c' },
  { nombre: 'Color Naranja', value: '#fd7e14' }
]);

// Datos del comprador
const comprador = reactive({
  nombre: '',
  direccion: '',
  telefono: '',
  estado: 'Reservada'
});

// Boletas seleccionadas
const boletasSeleccionadas = ref([]);

// Generar números de boletas basado en la cantidad configurada
const numerosBoletas = computed(() => {
  return Array.from({ length: configuracion.cantidadBoletas }, (_, i) => i + 1);
});

// Mostrar detalle de boleta
const mostrarDetalleBoleta = (numero) => {
  boletaSeleccionada.value = numero;
  mostrarFormularioComprador();
  mostrarModalBoleta.value = true;
};

// Cargar datos del comprador o resetear formulario
const mostrarFormularioComprador = () => {
  const boleta = boletasSeleccionadas.value.find(b => b.numero === boletaSeleccionada.value);
  
  if (boleta) {
    comprador.nombre = boleta.comprador.nombre;
    comprador.direccion = boleta.comprador.direccion;
    comprador.telefono = boleta.comprador.telefono;
    comprador.estado = boleta.estado;
  } else {
    comprador.nombre = '';
    comprador.direccion = '';
    comprador.telefono = '';
    comprador.estado = 'Reservada';
  }
};

// Obtener estado de una boleta
const estadoBoleta = (numero) => {
  const boleta = boletasSeleccionadas.value.find(b => b.numero === numero);
  return boleta ? boleta.estado : null;
};

// Contar boletas por estado
const contarBoletasPorEstado = () => {
  const total = configuracion.cantidadBoletas;
  const reservadas = boletasSeleccionadas.value.filter(b => b.estado === 'Reservada').length;
  const pagadas = boletasSeleccionadas.value.filter(b => b.estado === 'Pagada').length;
  const entregadas = boletasSeleccionadas.value.filter(b => b.estado === 'Entregada').length;
  const disponibles = total - (reservadas + pagadas + entregadas);
  
  return {
    total,
    disponibles,
    reservadas,
    pagadas,
    entregadas
  };
};

// Guardar datos del comprador
const guardarComprador = async () => {
  try {
    // Validación del nombre (campo requerido)
    if (!comprador.nombre || comprador.nombre.trim() === '') {
      await Swal.fire({
        title: 'Campo requerido',
        text: 'Por favor ingrese el nombre del comprador',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Buscar si la boleta ya existe
    const boletaExistenteIndex = boletasSeleccionadas.value.findIndex(
      b => b.numero === boletaSeleccionada.value
    );

    // Preparar el objeto de boleta
    const boletaActualizada = {
      numero: boletaSeleccionada.value,
      estado: comprador.estado,
      comprador: {
        nombre: comprador.nombre.trim(),
        direccion: comprador.direccion.trim(),
        telefono: comprador.telefono.trim()
      },
      fechaCompra: new Date().toISOString().split('T')[0]
    };

    if (boletaExistenteIndex !== -1) {
      // Actualizar boleta existente
      boletasSeleccionadas.value[boletaExistenteIndex] = boletaActualizada;
      
      await Swal.fire({
        title: '¡Boleta actualizada!',
        html: `La boleta <strong>${boletaSeleccionada.value}</strong> ha sido actualizada como <strong>${comprador.estado}</strong>`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } else {
      // Añadir nueva boleta
      boletasSeleccionadas.value.push(boletaActualizada);
      
      await Swal.fire({
        title: '¡Boleta registrada!',
        html: `La boleta <strong>${boletaSeleccionada.value}</strong> ha sido registrada como <strong>${comprador.estado}</strong>`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    }

    mostrarModalBoleta.value = false;
  } catch (error) {
    console.error('Error en guardarComprador:', error);
    await Swal.fire({
      title: 'Error',
      text: 'Ocurrió un error al guardar la boleta. Por favor intente nuevamente.',
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
  }
};

// Eliminar boleta
const eliminarBoleta = async () => {
  const confirmacion = await Swal.fire({
    title: '¿Eliminar boleta?',
    text: `¿Estás seguro de eliminar la boleta ${boletaSeleccionada.value}? Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#e74a3b',
    cancelButtonColor: '#858796'
  });
  
  if (confirmacion.isConfirmed) {
    // Filtrar el array para eliminar la boleta
    boletasSeleccionadas.value = boletasSeleccionadas.value.filter(
      b => b.numero !== boletaSeleccionada.value
    );
    
    await Swal.fire({
      title: '¡Boleta eliminada!',
      text: `La boleta ${boletaSeleccionada.value} ha sido eliminada correctamente.`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
    
    mostrarModalBoleta.value = false;
  }
};

// Guardar la configuración
const guardarConfiguracion = async () => {
  if (!await validarConfiguracion()) {
    return;
  }
  
  mostrarModalConfig.value = false;
  await Swal.fire({
    title: '¡Configuración guardada!',
    text: 'Tu talonario ha sido configurado correctamente',
    icon: 'success',
    confirmButtonText: 'Continuar'
  });
};

// Validación de configuración
const validarConfiguracion = async () => {
  if (!configuracion.premio) {
    await Swal.fire({
      title: 'Campo requerido',
      text: 'Por favor ingrese el premio de la rifa',
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
    return false;
  }
  
  if (!configuracion.valorBoleta) {
    await Swal.fire({
      title: 'Campo requerido',
      text: 'Por favor ingrese el valor de la boleta',
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
    return false;
  }
  
  if (!configuracion.loteria) {
    await Swal.fire({
      title: 'Campo requerido',
      text: 'Por favor seleccione la lotería',
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
    return false;
  }
  
  if (configuracion.cantidadBoletas < 1) {
    await Swal.fire({
      title: 'Cantidad inválida',
      text: 'La cantidad de boletas debe ser al menos 1',
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
    return false;
  }
  
  return true;
};

// Funciones para personalización de colores
const seleccionarColor = (tipo, color) => {
  configuracionColor[tipo] = color.value;
};

const aplicarColores = () => {
  mostrarModalPersonalizar.value = false;
  Swal.fire({
    title: '¡Colores aplicados!',
    text: 'La personalización de colores se ha aplicado correctamente',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
};

const aplicarColoresPorDefecto = () => {
  configuracionColor.header = '#4e73df';
  configuracionColor.footer = '#4e73df';
  configuracionColor.botones = '#1cc88a';
  Swal.fire({
    title: 'Colores por defecto',
    text: 'Se han restablecido los colores predeterminados',
    icon: 'info',
    confirmButtonText: 'Aceptar'
  });
};

// Funciones para el modal de listado de boletas
const listarBoletas = () => {
  mostrarModalListado.value = true;
};

const calcularRecaudado = () => {
  const valorBoleta = parseFloat(configuracion.valorBoleta.replace(/[^0-9]/g, '')) || 0;
  const boletasPagadas = boletasSeleccionadas.value.filter(b => b.estado === 'Pagada' || b.estado === 'Entregada').length;
  return boletasPagadas * valorBoleta;
};

const calcularDeuda = () => {
  const valorBoleta = parseFloat(configuracion.valorBoleta.replace(/[^0-9]/g, '')) || 0;
  const boletasReservadas = boletasSeleccionadas.value.filter(b => b.estado === 'Reservada').length;
  return boletasReservadas * valorBoleta;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const generarArchivo = async () => {
  try {
    // Mostrar opciones al usuario
    const { value: formato } = await Swal.fire({
      title: 'Seleccione formato',
      input: 'select',
      inputOptions: {
        csv: 'CSV (Excel)',
        json: 'JSON',
        pdf: 'PDF'
      },
      inputPlaceholder: 'Seleccione formato',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Debe seleccionar un formato';
        }
      }
    });
    
    if (!formato) return;
    
    // Generar el archivo según el formato seleccionado
    switch (formato) {
      case 'csv':
        generarCSV();
        break;
      case 'json':
        generarJSON();
        break;
      case 'pdf':
        generarPDF();
        break;
    }
    
  } catch (error) {
    await Swal.fire({
      title: 'Error',
      text: 'No se pudo generar el archivo: ' + error.message,
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
  }
};

// Generar CSV
const generarCSV = () => {
  const headers = ['Número', 'Nombre', 'Dirección', 'Teléfono', 'Estado', 'Fecha Compra'];
  
  // Crear contenido CSV
  let csvContent = headers.join(',') + '\n';
  
  boletasSeleccionadas.value.forEach(boleta => {
    const row = [
      boleta.numero,
      `"${boleta.comprador.nombre || '-'}"`,
      `"${boleta.comprador.direccion || '-'}"`,
      `"${boleta.comprador.telefono || '-'}"`,
      boleta.estado,
      boleta.fechaCompra || '-'
    ];
    csvContent += row.join(',') + '\n';
  });
  
  // Crear archivo y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `boletas_${configuracion.loteria}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  Swal.fire({
    title: 'Archivo CSV generado',
    text: 'El archivo se ha descargado correctamente',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
};

// Generar JSON
const generarJSON = () => {
  const data = {
    configuracion: { ...configuracion },
    boletas: boletasSeleccionadas.value,
    totales: {
      recaudado: calcularRecaudado(),
      deuda: calcularDeuda()
    },
    fechaGeneracion: new Date().toISOString()
  };
  
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `boletas_${configuracion.loteria}_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  Swal.fire({
    title: 'Archivo JSON generado',
    text: 'El archivo se ha descargado correctamente',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
};

// Generar PDF (simplificado)
const generarPDF = async () => {
  await Swal.fire({
    title: 'Preparando PDF',
    text: 'Se abrirá el diálogo de impresión. Seleccione "Guardar como PDF" en las opciones de impresión.',
    icon: 'info',
    confirmButtonText: 'Continuar'
  });
  
  window.print();
};

// Funciones del talonario
const personalizarTalonario = () => {
  mostrarModalPersonalizar.value = true;
};

const editarInformacion = () => {
  mostrarModalConfig.value = true;
};
</script>

<style scoped>
/* Estilos base */
:root {
  --primary: #4e73df;
  --secondary: #858796;
  --success: #1cc88a;
  --info: #36b9cc;
  --warning: #f6c23e;
  --danger: #e74a3b;
  --light: #f8f9fa;
  --dark: #5a5c69;
  
  /* Colores para estados */
  --reservada: #ffc107;
  --pagada: #28a745;
  --entregada: #17a2b8;
  --disponible: #d1e7dd;
}

body {
  font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

/* Estilos para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-container {
  background-color: white;
  border-radius: 0.35rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  overflow: hidden;
  border: none;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-body {
  padding: 1.25rem;
  background-color: #f8f9fc;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--dark);
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d3e2;
  border-radius: 0.35rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #bac8f3;
  box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
}

.modal-footer {
  padding: 1rem;
  background-color: #f8f9fc;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  gap: 0.5rem;
}

.btn-guardar {
  background-color: var(--success);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-guardar:hover {
  background-color: #17a673;
}

.btn-cerrar {
  background-color: var(--secondary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-cerrar:hover {
  background-color: #6c757d;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--secondary);
  cursor: pointer;
  padding: 0.25rem;
}

.close-btn:hover {
  color: var(--dark);
}

/* Estilos para personalización de colores */
.color-section {
  margin-bottom: 1.5rem;
}

.color-section h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: var(--dark);
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-option {
  flex: 1;
  min-width: 100px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  font-weight: 600;
}

.color-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.color-option.selected {
  border: 2px solid var(--dark);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.btn-default {
  background-color: var(--secondary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
  width: 100%;
}

.btn-default:hover {
  background-color: #6c757d;
}

/* Estilos para el estado de la boleta */
.boleta-status {
  padding: 0.75rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
}

.status-disponible {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-reservada {
  background-color: #fdd346;
  color: #664d03;
}

.status-pagada {
  background-color: #38b854;
  color: #0f5132;
}

.status-entregada {
  background-color: #31bedd;
  color: #055160;
}

/* Estilos para el talonario */
.talonario-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #f8f9fc;
}

.header {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e3e6f0;
  border-radius: 10px;
  color: white;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
}

.loteria-badge {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.header-details {
  display: flex;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.detail-value {
  font-weight: 600;
  color: white;
}

.card {
  background-color: white;
  border-radius: 0.35rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.1);
  border: 1px solid #e3e6f0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark);
  margin-top: 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  color: var(--primary);
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px dashed #e3e6f0;
  align-items: center;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: var(--secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-value {
  font-weight: 700;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.highlight {
  color: var(--success);
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.disponible {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-badge.reservada {
  background-color: #ecc953;
  color: #664d03;
}

.status-badge.pagada {
  background-color: #3bdd61;
  color: #155724;
}

.status-badge.entregada {
  background-color: #38cef0;
  color: #055160;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e3e6f0, transparent);
  margin: 1.5rem 0;
}

.boletas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.75rem;
}

.boleta-btn {
  position: relative;
  padding: 0.75rem 0.5rem;
  background-color: #f8f9fc;
  border: 1px solid #e3e6f0;
  border-radius: 0.35rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
}

.boleta-btn:hover {
  background-color: #eaecf4;
  transform: translateY(-2px);
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.boleta-btn.first-row {
  background-color: #eaecf4;
  font-weight: bold;
}

.boleta-btn.last-ten {
  background-color: #eaecf4;
}

/* Estilos para estados de boletas */
.boleta-btn.reservada {
  background-color: rgba(255, 193, 7, 0.2);
  border-color: var(--reservada);
}

.boleta-btn.pagada {
  background-color: rgba(40, 167, 69, 0.2);
  border-color: var(--pagada);
}

.boleta-btn.entregada {
  background-color: rgba(23, 162, 184, 0.2);
  border-color: var(--entregada);
}

.boleta-number {
  font-size: 1rem;
  font-weight: 700;
  color: var(--dark);
}

.status-icon {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  font-size: 0.75rem;
}

.boleta-btn.reservada .status-icon {
  color: var(--reservada);
}

.boleta-btn.pagada .status-icon {
  color: var(--pagada);
}

.boleta-btn.entregada .status-icon {
  color: var(--entregada);
}
.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 150px;
  padding: 0.75rem;
  border: none;
  border-radius: 0.35rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.print-btn {
  background-color: var(--info);
  color: white;
}

.print-btn:hover {
  background-color: #2c9faf;
}

.finish-btn {
  background-color: var(--success);
  color: white;
}

.finish-btn:hover {
  background-color: #17a673;
}

.config-btn {
  background-color: var(--warning);
  color: #856404;
}

.config-btn:hover {
  background-color: #dda20a;
}

.btn-icon {
  font-size: 1rem;
}

.btn-text {
  font-size: 0.875rem;
}

.footer {
  margin-top: 2rem;
  text-align: center;
  color: var(--secondary);
  font-size: 0.875rem;
}

.version {
  font-size: 0.75rem;
  color: #b7b9cc;
  margin-top: 0.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.edit-btn {
  background-color: transparent;
  border: 1px solid var(--secondary);
  color: var(--secondary);
  border-radius: 0.35rem;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 600;
}

.edit-btn:hover {
  background-color: #eaecf4;
  border-color: var(--dark);
  color: var(--dark);
}
/* Estilos para el modal de listado */
.boletas-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.boletas-table th, .boletas-table td {
  padding: 0.75rem;
  border: 1px solid #e3e6f0;
  text-align: left;
}

.boletas-table th {
  background-color: #f8f9fc;
  font-weight: 600;
  color: var(--dark);
}

.boletas-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.boletas-table tr:hover {
  background-color: #f1f1f1;
}

.estado-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.estado-badge.reservada {
  background-color: #fdd346;
  color: #664d03;
}

.estado-badge.pagada {
  background-color: #38b854;
  color: #0f5132;
}

.estado-badge.entregada {
  background-color: #31bedd;
  color: #055160;
}

.totales-section {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fc;
  border-radius: 0.35rem;
}

.total-item {
  display: flex;
  flex-direction: column;
}

.total-label {
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 0.25rem;
}

.total-value {
  font-weight: 700;
  font-size: 1.1rem;
}

.text-center {
  text-align: center;
}
/* Estilos para botones - Versión mejorada con fondos sólidos */

/* Botones principales */
.btn-guardar {
  color: rgb(0, 0, 0) !important;
  border: none !important;
  padding: 0.6rem 1.2rem !important;
  border-radius: 0.5rem !important;
  font-size: 0.9rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.5rem !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
  min-width: 120px !important;
  background-color: cornflowerblue;
}

.btn-cerrar {
  background-color: rgb(199, 48, 48);
  color: rgb(0, 0, 0) !important;
  border: none !important;
  padding: 0.6rem 1.2rem !important;
  border-radius: 0.5rem !important;
  font-size: 0.9rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
}

/* Botones de acción */
.action-btn {
  color: rgb(0, 0, 0) !important;
  border: none !important;
  padding: 0.8rem 1.5rem !important;
  border-radius: 0.5rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.5rem !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
  min-width: 180px !important;
}
/* Estilo para el botón de eliminar */
.btn-eliminar {
  background-color: #e74a3b;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
  margin-right: auto;
}

.btn-eliminar:hover {
  background-color: #c5301c;
}

/* Mejorar disposición de botones en el footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
}

/* Ajustar iconos en botones */
.btn-guardar i,
.btn-eliminar i,
.btn-cerrar i {
  margin-right: 0.5rem;
}
/* Botones de boletas */
.boleta-btn {
  background-color: #e9ecef !important;
  color: var(--dark) !important;
  border: 2px solid #d1d3e2 !important;
  border-radius: 0.5rem !important;
  padding: 0.8rem !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  aspect-ratio: 1 !important;
  width: 60px !important;
  height: 60px !important;
  font-weight: 700 !important;
  box-shadow: 0 2px 3px rgba(0,0,0,0.05) !important;
}

/* Estados de boletas */
.boleta-btn.reservada {
  background-color: var(--reservada) !important;
  color: #000 !important;
  border-color: #ffc107 !important;
}

.boleta-btn.pagada {
  background-color: var(--pagada) !important;
  color: white !important;
  border-color: #28a745 !important;
}

.boleta-btn.entregada {
  background-color: var(--entregada) !important;
  color: white !important;
  border-color: #17a2b8 !important;
}

.boleta-btn.first-row,
.boleta-btn.last-ten {
  background-color: #d1d7e0 !important;
  font-weight: bold !important;
}

/* Botón de editar */
.edit-btn {
  background-color: var(--warning) !important;
  color: #000 !important;
  border: none !important;
  padding: 0.5rem 1rem !important;
  border-radius: 0.5rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
}

/* Efectos hover */
.btn-guardar:hover,
.btn-cerrar:hover,
.action-btn:hover,
.boleta-btn:hover,
.edit-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
  opacity: 0.9 !important;
}

/* Botón close */
.close-btn {
  background-color: transparent !important;
  border: none !important;
  color: var(--dark) !important;
  font-size: 1.5rem !important;
  cursor: pointer !important;
  padding: 0.5rem !important;
  transition: all 0.2s !important;
}

.close-btn:hover {
  color: var(--danger) !important;
  transform: scale(1.1) !important;
}

/* Botones de opciones de color */
.color-option {
  color: white !important;
  border: 2px solid transparent !important;
  padding: 0.6rem !important;
  border-radius: 0.5rem !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 1px rgba(0,0,0,0.3) !important;
  min-width: 110px !important;
  text-align: center !important;
}

.color-option.selected {
  border-color: var(--dark) !important;
  box-shadow: 0 0 0 3px rgba(0,0,0,0.1) !important;
  transform: scale(1.05) !important;
}

/* Botón por defecto */
.btn-default {
  background-color: rgb(121, 120, 120);
  color: rgb(255, 255, 255) !important;
  border: none !important;
  padding: 0.6rem 1.2rem !important;
  border-radius: 0.5rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
  width: 100% !important;
}


/* Responsive */
@media (max-width: 992px) {
  .boletas-grid {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .header-details {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .modal-container {
    width: 95%;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .boletas-grid {
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 0.5rem;
  }
  
  .boleta-number {
    font-size: 0.875rem;
  }
}


</style>