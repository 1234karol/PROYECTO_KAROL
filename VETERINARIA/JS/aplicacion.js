document.addEventListener('DOMContentLoaded', function() {
    const botonAgregarCita = document.getElementById('boton-agregar-cita');
    const modalCita = document.getElementById('modal-cita');
    const modalConfirmacion = document.getElementById('modal-confirmacion');
    const botonCerrarModal = document.querySelector('.cerrar-modal');
    const botonCancelar = document.getElementById('boton-cerrar');
    const botonCancelarEliminar = document.getElementById('boton-cancelar');
    const botonConfirmarEliminar = document.getElementById('boton-confirmar');
    const formularioCita = document.getElementById('formulario-cita');
    const contenedorCitas = document.getElementById('contenedor-citas');
    const filtroEstado = document.getElementById('filtro-estado');
    const inputBusqueda = document.getElementById('busqueda-input');
    const botonBuscar = document.getElementById('boton-buscar');
    const textareaSintomas = document.getElementById('sintomas');
    const contadorCaracteres = document.getElementById('contador-caracteres');
    const tituloModal = document.getElementById('titulo-modal');
    
    const imagenes = [
        {tipo: "Perro", URL: "https://images.squarespace-cdn.com/content/v1/57a2aeb1ff7c509ef76566c9/1580246160610-AF6NCVORUSWEFLXGCX9Q/ansioso.gif"},
        {tipo: "Gato", URL: "https://www.cutecatgifs.com/wp-content/uploads/2021/02/wow.gif"},
        {tipo: "Pájaro", URL: "https://49.media.tumblr.com/b0ed4f84b28a497935ede29c4d58229d/tumblr_o61j5xcw8J1slstjgo1_400.gif"},
        {tipo: "Conejo", URL: "https://i.pinimg.com/originals/ca/0f/77/ca0f7736b765c349bf192dce2225a2bc.gif"},
        {tipo: "Hamster", URL: "https://i.pinimg.com/originals/61/f3/47/61f347a35f65319d8508457f83cd82bd.gif"},
        {tipo: "Tortuga", URL: "https://31.media.tumblr.com/dee00a821158930f17afd70118674d38/tumblr_noax6wkcwQ1rluhlpo1_400.gif"},
        {tipo: "Pez", URL: "https://img1.picmix.com/output/stamp/normal/6/3/9/4/784936_e356a.gif"},
        {tipo: "Serpiente", URL: "https://media.tenor.com/lpw4aP4SDtAAAAAM/snakes-animal.gif"},
        {tipo: "Iguana", URL: "https://media.tenor.com/OT1jcLYt1-gAAAAM/cant-sleep.gif"}
    ];

    let citas = JSON.parse(localStorage.getItem('citasVeterinarias')) || [];
    let idCitaActual = null;
    let estaEditando = false;
    let idCitaAEliminar = null;
    
    inicializar();
    
    function inicializar() {
        mostrarCitas();
        configurarEventos();
    }
    
    function configurarEventos() {
        botonAgregarCita.addEventListener('click', abrirModalAgregar);
        botonCerrarModal.addEventListener('click', cerrarModal);
        botonCancelar.addEventListener('click', cerrarModal);
        botonCancelarEliminar.addEventListener('click', cerrarModalConfirmacion);
        formularioCita.addEventListener('submit', manejarEnvioFormulario);
        botonConfirmarEliminar.addEventListener('click', confirmarEliminacion);
        filtroEstado.addEventListener('change', mostrarCitas);
        
        // Evento corregido para el botón de búsqueda
        botonBuscar.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarCitas();
        });
        
        inputBusqueda.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                mostrarCitas();
            }
        });
        
        textareaSintomas.addEventListener('input', actualizarContadorCaracteres);
    }
    
    function abrirModalAgregar() {
        estaEditando = false;
        idCitaActual = null;
        tituloModal.textContent = 'Guardar nueva cita';
        formularioCita.reset();
        document.getElementById('contenedor-estado').style.display = 'block';
        document.getElementById('id-cita').value = '';

        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fecha-cita').min = hoy;

        modalCita.classList.add('show');
    }

    function cerrarModal() {
        modalCita.classList.remove('show');
    }
    
    function abrirModalEditar(id) {
        estaEditando = true;
        idCitaActual = id;
        tituloModal.textContent = 'Editar cita';
        
        const cita = citas.find(c => c.id === id);
        
        if (cita) {
            document.getElementById('id-cita').value = cita.id;
            document.getElementById('nombre-mascota').value = cita.nombreMascota;
            document.getElementById('nombre-propietario').value = cita.nombrePropietario;
            document.getElementById('telefono').value = cita.telefono;
            
            const fecha = new Date(cita.fechaHora);
            const fechaFormateada = fecha.toISOString().split('T')[0];
            document.getElementById('fecha-cita').value = fechaFormateada;
            
            const horas = fecha.getHours().toString().padStart(2, '0');
            const minutos = fecha.getMinutes().toString().padStart(2, '0');
            document.getElementById('hora-cita').value = `${horas}:${minutos}`;
            
            document.getElementById('tipo-mascota').value = cita.tipoMascota;
            document.getElementById('sintomas').value = cita.sintomas;
            document.getElementById('estado').value = cita.estado;
            
            actualizarContadorCaracteres();
            modalCita.classList.add('show');
        }
    }
    
    function abrirModalEliminar(id) {
        idCitaAEliminar = id;
        modalConfirmacion.classList.add('show');
    }
    
    function cerrarModalConfirmacion() {
        modalConfirmacion.classList.remove('show');
    }
    
 function manejarEnvioFormulario(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // 1. Validación de Bootstrap
    const form = e.currentTarget;
    form.classList.add('was-validated');
    
    if (!form.checkValidity()) {
        // Muestra un mensaje general si lo deseas
        Swal.fire({
            icon: 'error',
            title: 'Formulario incompleto',
            text: 'Por favor completa todos los campos requeridos',
            confirmButtonColor: '#d33'
        });
        return;
    }
    
    // 2. Tu validación personalizada adicional
    if (!validarFormulario()) {
        return;
    }

        const nombreMascota = document.getElementById('nombre-mascota').value;
        const nombrePropietario = document.getElementById('nombre-propietario').value;
        const telefono = document.getElementById('telefono').value;
        const fechaCita = document.getElementById('fecha-cita').value;
        const horaCita = document.getElementById('hora-cita').value;
        const tipoMascota = document.getElementById('tipo-mascota').value;
        const sintomas = document.getElementById('sintomas').value;
        const estado = document.getElementById('estado').value;
        
        const [anio, mes, dia] = fechaCita.split('-');
        const [horas, minutos] = horaCita.split(':');
        const fechaHora = new Date(anio, mes - 1, dia, horas, minutos);
        
        if (estaEditando) {
            const indice = citas.findIndex(c => c.id === idCitaActual);
            if (indice !== -1) {
                citas[indice] = {
                    ...citas[indice],
                    nombreMascota,
                    nombrePropietario,
                    telefono,
                    fechaHora,
                    tipoMascota,
                    sintomas,
                    estado
                };
            }
        } else {
            const nuevaCita = {
                id: generarId(),
                numeroCita: citas.length + 1,
                nombreMascota,
                nombrePropietario,
                telefono,
                fechaHora,
                tipoMascota,
                sintomas,
                estado: estado,
                fechaCreacion: new Date()
            };
            
            citas.push(nuevaCita);
        }
        
        guardarEnAlmacenamientoLocal();
        mostrarCitas();

        Swal.fire({
            icon: 'success',
            title: 'Cita guardada',
            text: `La cita de ${nombreMascota} fue registrada con éxito.`,
            timer: 2000,
            showConfirmButton: false
        });

        cerrarModal();
    }
    
    function validarFormulario() {
        const nombreMascota = document.getElementById('nombre-mascota').value;
        const nombrePropietario = document.getElementById('nombre-propietario').value;
        const telefono = document.getElementById('telefono').value;
        const fechaCita = document.getElementById('fecha-cita').value;
        const horaCita = document.getElementById('hora-cita').value;
        const tipoMascota = document.getElementById('tipo-mascota').value;
        const sintomas = document.getElementById('sintomas').value;
        
        if (!nombreMascota || !nombrePropietario || !telefono || !fechaCita || !horaCita || !tipoMascota || !sintomas) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos.',
                confirmButtonColor: '#3085d6'
            });
            return false; 
        }

        if (!/^\d+$/.test(telefono)) {
            Swal.fire({
                icon: 'error',
                title: 'Teléfono inválido',
                text: 'El teléfono solo puede contener números.',
                confirmButtonColor: '#d33'
            });
            return false;
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaSeleccionada = new Date(fechaCita);
        if (fechaSeleccionada < hoy) {
            Swal.fire({
                icon: 'error',
                title: 'Fecha inválida',
                text: 'La fecha de la cita no puede ser anterior a hoy.',
                confirmButtonColor: '#d33'
            });
            return false;
        }

        const [horas, minutos] = horaCita.split(':');
        const hora = parseInt(horas);
        if (hora < 8 || hora >= 20) {
            Swal.fire({
                icon: 'error',
                title: 'Horario no permitido',
                text: 'El horario de atención es de 8:00 am a 8:00 pm.',
                confirmButtonColor: '#d33'
            });
            return false;
        }

        if (sintomas.length > 400) {
            Swal.fire({
                icon: 'error',
                title: 'Texto demasiado largo',
                text: 'Los síntomas no pueden exceder los 400 caracteres.',
                confirmButtonColor: '#d33'
            });
            return false;
        }

        return true;  
    }

    function confirmarEliminacion() {
        if (idCitaAEliminar) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    citas = citas.filter(c => c.id !== idCitaAEliminar);
                    citas.forEach((cita, index) => {
                        cita.numeroCita = index + 1;
                    });
                    guardarEnAlmacenamientoLocal();
                    mostrarCitas();
                    cerrarModalConfirmacion();

                    Swal.fire({
                        icon: 'success',
                        title: 'Cita eliminada',
                        text: 'La cita ha sido eliminada correctamente.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            });
        }
    }
    
    function mostrarCitas() {
        contenedorCitas.innerHTML = '';
        
        const filtroEstadoValor = filtroEstado.value;
        const busquedaValor = inputBusqueda.value.trim().toLowerCase();
        
        let citasFiltradas = [...citas];
        
        if (filtroEstadoValor !== 'todos') {
            citasFiltradas = citasFiltradas.filter(c => c.estado === filtroEstadoValor);
        }
        
        if (busquedaValor) {
            citasFiltradas = citasFiltradas.filter(c => 
                c.nombreMascota.toLowerCase().includes(busquedaValor) || 
                c.nombrePropietario.toLowerCase().includes(busquedaValor) ||
                c.telefono.includes(busquedaValor)
            );
        }
        
        citasFiltradas.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));

        if (citasFiltradas.length === 0) {
            contenedorCitas.innerHTML = '<p class="sin-citas">No hay citas que coincidan con los criterios de búsqueda</p>';
            return;
        }
        
        citasFiltradas.forEach(cita => {
            contenedorCitas.appendChild(crearTarjetaCita(cita));
        });
    }
    
    function crearTarjetaCita(cita) {
        const fecha = new Date(cita.fechaHora);
        const opcionesFecha = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const opcionesHora = { hour: '2-digit', minute: '2-digit' };

        const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
        const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-cita';

        let estadoColor = '';
        switch (cita.estado) {
            case 'Abierta':
                estadoColor = 'var(--color-exito)';
                break;
            case 'Terminada':
                estadoColor = 'var(--color-secundario)';
                break;
            case 'Anulada':
                estadoColor = 'var(--color-peligro)';
                break;
        }

        const tipoMascota = cita.tipoMascota.toLowerCase();
        const imagenMascota = imagenes.find(img => img.tipo.toLowerCase() === tipoMascota);
        const urlImagen = imagenMascota ? imagenMascota.URL : 'https://media.tenor.com/9ZtD1kKzo1MAAAAC/animal-pet.gif';

        tarjeta.innerHTML = `
            <div class="encabezado-tarjeta">
                <h3>${cita.nombreMascota}</h3>
                <span class="numero-cita">#${cita.numeroCita}</span>
            </div>
            <img src="${urlImagen}" alt="${cita.tipoMascota}" class="imagen-mascota">
            <div class="cuerpo-tarjeta">
               <p><i class="fas fa-user"></i> <strong>Propietario:</strong> ${cita.nombrePropietario}</p>
               <p><i class="fas fa-phone-alt"></i> <strong>Teléfono:</strong> ${cita.telefono}</p>
               <p><i class="fas fa-calendar-alt"></i> <strong>Fecha:</strong> ${fechaFormateada}</p>
               <p><i class="fas fa-clock"></i> <strong>Hora:</strong> ${horaFormateada}</p>
               <p><i class="fas fa-paw"></i> <strong>Tipo:</strong> ${cita.tipoMascota}</p>
               <p><i class="fas fa-notes-medical"></i> <strong>Síntomas:</strong> ${cita.sintomas}</p>

                <div class="estado-cita" style="background-color: ${estadoColor}">
                    ${cita.estado}
                </div>
            </div>
            <div class="acciones-tarjeta">
                <button class="btn-editar" data-id="${cita.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-eliminar" data-id="${cita.id}">
                    <i class="fas fa-trash-alt"></i> Eliminar
                </button>
            </div>
        `;

        tarjeta.querySelector('.btn-editar').addEventListener('click', (e) => {
            abrirModalEditar(e.target.closest('button').dataset.id);
        });

        tarjeta.querySelector('.btn-eliminar').addEventListener('click', (e) => {
            abrirModalEliminar(e.target.closest('button').dataset.id);
        });

        return tarjeta;
    }
    
    function guardarEnAlmacenamientoLocal() {
        localStorage.setItem('citasVeterinarias', JSON.stringify(citas));
    }
    
    function generarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    function actualizarContadorCaracteres() {
        const longitudActual = textareaSintomas.value.length;
        contadorCaracteres.textContent = `${longitudActual}/400 caracteres`;
        
        if (longitudActual >= 400) {
            contadorCaracteres.style.color = 'var(--color-peligro)';
        } else {
            contadorCaracteres.style.color = 'inherit';
        }
    }
    
    window.addEventListener('click', function(evento) {
        if (evento.target === modalCita) {
            cerrarModal();
        }
        if (evento.target === modalConfirmacion) {
            cerrarModalConfirmacion();
        }
    });
});
