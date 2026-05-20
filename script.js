// ===== NAVBAR: SCROLL Y SOMBRA =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== MENÚ HAMBURGUESA (MÓVIL) =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Cierra el menú al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== ENLACE ACTIVO SEGÚN SECCIÓN VISIBLE =====
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link');

const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -55% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// ===== ANIMACIÓN BARRAS DE HABILIDADES =====
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.width;
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ===== BOTÓN VOLVER ARRIBA =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== FORMULARIO DE CONTACTO REAL (Formspree) =====
const form   = document.getElementById('contactForm');
const FORM_ID = 'xzdwdorj'; // <-- reemplaza esto

function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.add('invalid');
  error.textContent = message;
}

function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.remove('invalid');
  error.textContent = '';
}

function validateForm() {
  let valid = true;

  const nombre  = document.getElementById('nombre').value.trim();
  const email   = document.getElementById('email').value.trim();
  const asunto  = document.getElementById('asunto').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  clearError('nombre',  'errorNombre');
  clearError('email',   'errorEmail');
  clearError('asunto',  'errorAsunto');
  clearError('mensaje', 'errorMensaje');

  if (!nombre) {
    showError('nombre', 'errorNombre', 'El nombre es obligatorio.');
    valid = false;
  }

  if (!email) {
    showError('email', 'errorEmail', 'El correo es obligatorio.');
    valid = false;
  } else if (!emailRegex.test(email)) {
    showError('email', 'errorEmail', 'Ingresa un correo válido.');
    valid = false;
  }

  if (!asunto) {
    showError('asunto', 'errorAsunto', 'El asunto es obligatorio.');
    valid = false;
  }

  if (!mensaje) {
    showError('mensaje', 'errorMensaje', 'El mensaje no puede estar vacío.');
    valid = false;
  } else if (mensaje.length < 10) {
    showError('mensaje', 'errorMensaje', 'Escribe al menos 10 caracteres.');
    valid = false;
  }

  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const btn     = form.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

  const datos = {
    nombre:  document.getElementById('nombre').value.trim(),
    email:   document.getElementById('email').value.trim(),
    asunto:  document.getElementById('asunto').value.trim(),
    message: document.getElementById('mensaje').value.trim()
  };

  try {
    const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json'
      },
      body: JSON.stringify(datos)
    });

    if (res.ok) {
      btn.style.display     = 'none';
      success.style.display = 'block';
      form.reset();

      setTimeout(() => {
        btn.style.display     = 'flex';
        btn.disabled          = false;
        btn.innerHTML         = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
        success.style.display = 'none';
      }, 4000);

    } else {
      throw new Error('Error servidor');
    }

  } catch (err) {
    btn.disabled  = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
    alert('Hubo un error al enviar. Intenta de nuevo.');
  }
});

// Limpiar error al escribir
['nombre', 'email', 'asunto', 'mensaje'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    clearError(id, `error${id.charAt(0).toUpperCase() + id.slice(1)}`);
  });
});