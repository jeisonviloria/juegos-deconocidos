 // Base de datos en memoria (se reinicia al recargar la página)
        let juegos = [];
        let comentarios = [];
        let juegoActual = null;
        let nextId = 1;

        // Datos de ejemplo para que no esté vacío al inicio
        function cargarDatosEjemplo() {
            juegos = [
                {
                    id: nextId++,
                    titulo: "Cave Story",
                    descripcion: "Un metroidvania indie japonés creado por una sola persona durante 5 años. Historia emotiva sobre un robot amnésico en una isla flotante. Gráficos pixel art hermosos y música memorable.",
                    plataforma: "PC",
                    genero: "Metroidvania",
                    año: 2004,
                    autor_nombre: "GameExplorer",
                    likes: 12,
                    fecha: new Date('2024-01-15')
                },
                {
                    id: nextId++,
                    titulo: "Klonoa: Door to Phantomile",
                    descripcion: "Una joya oculta de PlayStation 1. Plataformas 2.5D con mecánicas únicas usando 'Wind Bullet' para agarrar enemigos. Historia sorprendentemente profunda y emotiva.",
                    plataforma: "PlayStation",
                    genero: "Plataformas",
                    año: 1997,
                    autor_nombre: "RetroGamer",
                    likes: 8,
                    fecha: new Date('2024-02-10')
                },
                {
                    id: nextId++,
                    titulo: "Katana ZERO",
                    descripcion: "Acción frenética en 2D donde el tiempo es tu arma. Cada muerte te hace intentar de nuevo con diferentes estrategias. Soundtrack synthwave increíble y una historia noir cyberpunk alucinante.",
                    plataforma: "Nintendo",
                    genero: "Acción",
                    año: 2019,
                    autor_nombre: "IndieHunter",
                    likes: 15,
                    fecha: new Date('2024-03-01')
                }
            ];
            
            comentarios = [
                {
                    id: 1,
                    juego_id: 1,
                    usuario_nombre: "PixelArtLover",
                    contenido: "¡Qué juegazo! La historia me hizo llorar al final. Los jefes son épicos y la música se queda en tu cabeza por días.",
                    calificacion: 5,
                    fecha: new Date('2024-01-16')
                },
                {
                    id: 2,
                    juego_id: 1,
                    usuario_nombre: "CasualGamer",
                    contenido: "Lo descubrí por casualidad y me encantó. Es increíble que una persona sola haya creado esto.",
                    calificacion: 5,
                    fecha: new Date('2024-01-20')
                }
            ];
            
            actualizarEstadisticas();
            mostrarJuegos(juegos);
        }

        // Actualizar estadísticas
        function actualizarEstadisticas() {
            document.getElementById('total-juegos').textContent = juegos.length;
            document.getElementById('total-comentarios').textContent = comentarios.length;
            document.getElementById('total-likes').textContent = juegos.reduce((sum, j) => sum + j.likes, 0);
        }

        // Mostrar juegos
        function mostrarJuegos(listaJuegos) {
            const container = document.getElementById('juegos-container');
            
            if (listaJuegos.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h2>🎮</h2>
                        <p>¡No se encontraron juegos!</p>
                        <p style="font-size: 16px; margin-top: 15px;">Intenta con otra búsqueda</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = listaJuegos.map(juego => {
                const numComentarios = comentarios.filter(c => c.juego_id === juego.id).length;
                return `
                    <div class="juego-card" onclick="abrirJuego(${juego.id})">
                        <div class="juego-header">
                            <div style="flex: 1;">
                                <div class="juego-titulo">${juego.titulo}</div>
                                <div class="juego-autor">👤 Por ${juego.autor_nombre}</div>
                                <span class="juego-plataforma">${juego.plataforma}</span>
                            </div>
                        </div>
                        <div class="juego-descripcion">${juego.descripcion.substring(0, 150)}${juego.descripcion.length > 150 ? '...' : ''}</div>
                        <div class="juego-meta">
                            <span class="juego-genero">🎯 ${juego.genero || 'Sin género'} ${juego.año ? '• ' + juego.año : ''} • 💬 ${numComentarios}</span>
                            <button class="like-btn" onclick="darLike(event, ${juego.id})">
                                ❤️ <span>${juego.likes}</span>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Buscar juegos
        function buscarJuegos() {
            const query = document.getElementById('busqueda').value.toLowerCase().trim();
            
            if (!query) {
                mostrarJuegos(juegos);
                return;
            }

            const resultados = juegos.filter(juego => 
                juego.titulo.toLowerCase().includes(query) ||
                juego.descripcion.toLowerCase().includes(query) ||
                (juego.genero && juego.genero.toLowerCase().includes(query)) ||
                juego.plataforma.toLowerCase().includes(query)
            );

            mostrarJuegos(resultados);
        }

        // Publicar juego
        document.getElementById('form-juego').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nuevoJuego = {
                id: nextId++,
                titulo: document.getElementById('titulo').value,
                descripcion: document.getElementById('descripcion').value,
                plataforma: document.getElementById('plataforma').value,
                genero: document.getElementById('genero').value || null,
                año: parseInt(document.getElementById('año').value) || null,
                autor_nombre: document.getElementById('autor-nombre').value,
                likes: 0,
                fecha: new Date()
            };

            juegos.unshift(nuevoJuego);
            mostrarAlerta('🎉 ¡Juego publicado exitosamente!', 'success');
            cerrarModal('modalPublicar');
            document.getElementById('form-juego').reset();
            mostrarJuegos(juegos);
            actualizarEstadisticas();
        });

        // Abrir juego
        function abrirJuego(id) {
            juegoActual = juegos.find(j => j.id === id);
            if (!juegoActual) return;
            
            const numComentarios = comentarios.filter(c => c.juego_id === id).length;
            
            document.getElementById('detalles-juego').innerHTML = `
                <h2 style="color: #333; margin-bottom: 20px;">${juegoActual.titulo}</h2>
                <div style="margin-bottom: 15px;">
                    <span class="juego-plataforma">${juegoActual.plataforma}</span>
                    <span style="margin-left: 10px; color: #666;">👤 ${juegoActual.autor_nombre}</span>
                </div>
                <p style="color: #666; margin-bottom: 10px;"><strong>🎯 Género:</strong> ${juegoActual.genero || 'No especificado'}</p>
                ${juegoActual.año ? `<p style="color: #666; margin-bottom: 10px;"><strong>📅 Año:</strong> ${juegoActual.año}</p>` : ''}
                <p style="color: #666; margin-bottom: 15px;"><strong>❤️ Likes:</strong> ${juegoActual.likes} • <strong>💬 Comentarios:</strong> ${numComentarios}</p>
                <p style="margin-top: 20px; line-height: 1.7; color: #444;">${juegoActual.descripcion}</p>
            `;
            
            cargarComentarios(id);
            document.getElementById('modalJuego').style.display = 'block';
        }

        // Cargar comentarios
        function cargarComentarios(juegoId) {
            const comentariosJuego = comentarios.filter(c => c.juego_id === juegoId);
            const lista = document.getElementById('comentarios-lista');
            
            if (comentariosJuego.length === 0) {
                lista.innerHTML = '<p style="color: #888; text-align: center; padding: 30px;">No hay comentarios aún. ¡Sé el primero en opinar! 🎮</p>';
                return;
            }

            lista.innerHTML = comentariosJuego.map(c => `
                <div class="comentario">
                    <div class="comentario-header">
                        <span class="comentario-usuario">👤 ${c.usuario_nombre}</span>
                        <div>
                            <span class="estrellas">${'⭐'.repeat(c.calificacion)}</span>
                            <span class="comentario-fecha">${formatearFecha(c.fecha)}</span>
                        </div>
                    </div>
                    <p style="color: #444; line-height: 1.6;">${c.contenido}</p>
                </div>
            `).join('');
        }

        // Enviar comentario
        document.getElementById('form-comentario').addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!juegoActual) return;

            const nuevoComentario = {
                id: comentarios.length + 1,
                juego_id: juegoActual.id,
                usuario_nombre: document.getElementById('comentario-usuario').value,
                contenido: document.getElementById('comentario-texto').value,
                calificacion: parseInt(document.getElementById('calificacion').value),
                fecha: new Date()
            };

            comentarios.push(nuevoComentario);
            document.getElementById('form-comentario').reset();
            cargarComentarios(juegoActual.id);
            actualizarEstadisticas();
            mostrarAlerta('💬 ¡Comentario publicado!', 'success');
        });
            // Dar like
        function darLike(event, id) {
            event.stopPropagation();
            const juego = juegos.find(j => j.id === id);
            if (juego) {
                juego.likes++;
                mostrarJuegos(juegos);
                actualizarEstadisticas();
            }
        }

        // Formatear fecha
        function formatearFecha(fecha) {
            const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(fecha).toLocaleDateString('es-ES', opciones);
        }

        // Utilidades de modal
        function abrirModalPublicar() {
            document.getElementById('modalPublicar').style.display = 'block';
        }

        function cerrarModal(id) {
            document.getElementById(id).style.display = 'none';
            if (id === 'modalPublicar') {
                document.getElementById('form-juego').reset();
            }
            if (id === 'modalJuego') {
                document.getElementById('form-comentario').reset();
            }
        }

        function mostrarAlerta(mensaje, tipo) {
            const alert = document.getElementById('alert');
            alert.textContent = mensaje;
            alert.className = `alert ${tipo}`;
            alert.style.display = 'block';
            setTimeout(() => alert.style.display = 'none', 4000);
        }

        // Cerrar modal al hacer clic fuera
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        }

        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });

        // Iniciar aplicación
        cargarDatosEjemplo();