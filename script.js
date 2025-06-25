document.addEventListener('DOMContentLoaded', function () {

    // --- CONFIGURACIÓN DE AIRTABLE ---
    const AIRTABLE_BASE_ID = 'app5DBzSEN1zi4zkR';
    const AIRTABLE_TABLE_NAME = 'Frases%20Sabias%20Que';
    
    // ¡¡¡IMPORTANTE!!! Reemplaza esto con tu propio Token de Acceso Personal.
    const AIRTABLE_PERSONAL_TOKEN = 'patGPCkCv3s43udl8.19fe30c773a646170eb9c8f672bb2ee68056ff4620a92c8b7d57dfd580f266e7';

    // Función para inicializar Swiper
    function initializeSwiper(records) {
      new Swiper('.sabias-que-carousel', {
        loop: records && records.length > 1, // El loop solo se activa si hay más de 1 diapositiva
        speed: 800,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }

    // Función para obtener los datos y construir el carrusel (VERSIÓN CORREGIDA)
    async function fetchAndBuildCarousel() {
      const swiperWrapper = document.querySelector('.sabias-que-carousel .swiper-wrapper');
      // Mensaje de carga inicial
      swiperWrapper.innerHTML = `<div class="swiper-slide"><div class="slide-content"><p class="pregunta">Cargando frases...</p></div></div>`;

      if (AIRTABLE_PERSONAL_TOKEN === 'REEMPLAZA_ESTO_CON_TU_TOKEN_DE_ACCESO_PERSONAL') {
          console.error("Error: El Token de Acceso Personal de Airtable no ha sido reemplazado en el código.");
          swiperWrapper.innerHTML = `<div class="swiper-slide"><div class="slide-content"><p class="pregunta">Error de configuración: falta el token de acceso.</p></div></div>`;
          return;
      }

      try {
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
          headers: {
            'Authorization': `Bearer ${AIRTABLE_PERSONAL_TOKEN}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error de red: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const records = data.records;
        
        if (!records || records.length === 0) {
          swiperWrapper.innerHTML = `<div class="swiper-slide"><div class="slide-content"><p class="pregunta">No hay frases para mostrar en este momento.</p></div></div>`;
          return;
        }

        swiperWrapper.innerHTML = ''; // Limpiamos el mensaje de "Cargando..."

        records.forEach(record => {
          const pregunta = record.fields.Pregunta;
          const respuesta = record.fields.Respuesta;

          if (pregunta && respuesta) {
            // ¡¡CAMBIO CLAVE AQUÍ!! Envolvemos los párrafos en un div .slide-content
            const slideHTML = `
              <div class="swiper-slide">
                <div class="slide-content">
                  <p class="pregunta">${pregunta}</p>
                  <p class="respuesta">${respuesta}</p>
                </div>
              </div>`;
            swiperWrapper.insertAdjacentHTML('beforeend', slideHTML);
          }
        });
        
        initializeSwiper(records); // Pasamos los records para saber si activar el loop

      } catch (error) {
        console.error('FALLO AL CARGAR DESDE AIRTABLE:', error);
        swiperWrapper.innerHTML = `<div class="swiper-slide"><div class="slide-content"><p class="pregunta">No se pudieron cargar las frases. Revisa la consola para más detalles.</p></div></div>`;
      }
    }

    fetchAndBuildCarousel();
});