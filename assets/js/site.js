const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function stripDangerousChars(value) {
  return value.replace(/[<>]/g, '').replace(/[\u0000-\u001F\u007F]/g, '');
}

function sanitizeText(value) {
  return normalizeWhitespace(stripDangerousChars(value));
}

function sanitizeMultiline(value) {
  return stripDangerousChars(value)
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

if (form && status) {
  const nextField = form.querySelector('input[name="_next"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const currentUrl = new URL(window.location.href);
  const thanksUrl = new URL('obrigado.html', currentUrl.href);

  if (nextField) {
    nextField.value = thanksUrl.href;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';

    const endpoint = (form.getAttribute('action') || '').trim();
    if (!endpoint || endpoint.includes('SEU_ENDPOINT_FORMSUBMIT')) {
      status.textContent = 'Configure primeiro o endpoint do FormSubmit no atributo action do formulário.';
      return;
    }

    const nomeEl = document.querySelector('#nome');
    const apelidoEl = document.querySelector('#apelido');
    const emailEl = document.querySelector('#email');
    const telefoneEl = document.querySelector('#telefone');
    const mensagemEl = document.querySelector('#mensagem');
    const consentimentoEl = document.querySelector('#consentimento');
    const honeyEl = form.querySelector('input[name="_honey"]');

    const nome = sanitizeText(nomeEl?.value || '');
    const apelido = sanitizeText(apelidoEl?.value || '');
    const email = stripDangerousChars((emailEl?.value || '').toLowerCase().replace(/[\r\n]/g, '').trim());
    const telefone = stripDangerousChars((telefoneEl?.value || '').replace(/[\r\n]/g, '').trim());
    const mensagem = sanitizeMultiline(mensagemEl?.value || '');
    const honey = sanitizeText(honeyEl?.value || '');

    if (honey) {
      status.textContent = 'Submissão inválida.';
      return;
    }

    nomeEl.value = nome;
    apelidoEl.value = apelido;
    emailEl.value = email;
    telefoneEl.value = telefone;
    mensagemEl.value = mensagem;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const telefoneOk = !telefone || /^\+?[0-9 ()-]{6,30}$/.test(telefone);

    if (nome.length < 2 || nome.length > 80) {
      status.textContent = 'Introduza um nome válido.';
      nomeEl.focus();
      return;
    }

    if (apelido.length > 80) {
      status.textContent = 'O sobrenome excede o tamanho permitido.';
      apelidoEl.focus();
      return;
    }

    if (!emailOk || email.length > 120) {
      status.textContent = 'Introduza um endereço de email válido.';
      emailEl.focus();
      return;
    }

    if (!telefoneOk) {
      status.textContent = 'Introduza um número de telefone válido.';
      telefoneEl.focus();
      return;
    }

    if (mensagem.length < 10 || mensagem.length > 2000) {
      status.textContent = 'A mensagem deve ter entre 10 e 2000 caracteres.';
      mensagemEl.focus();
      return;
    }

    if (!consentimentoEl.checked) {
      status.textContent = 'Tem de autorizar o tratamento dos dados para enviar o pedido.';
      consentimentoEl.focus();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'A enviar…';
    }
    status.textContent = 'A validar e a enviar o pedido…';

    form.submit();
  });
}


function buildFilename(url, index) {
  try {
    const pathname = new URL(url, window.location.href).pathname;
    const base = pathname.split('/').pop() || `imagem-${index + 1}.jpg`;
    return base.replace(/[^a-zA-Z0-9._-]+/g, '-');
  } catch {
    return `imagem-${index + 1}.jpg`;
  }
}

function initGalleryLightbox() {
  const imageNodes = Array.from(document.querySelectorAll('.detail-gallery-item img, .mini-gallery-item img, .portfolio-rich-cover img'));
  if (!imageNodes.length) return;

  const items = imageNodes.map((img, index) => ({
    src: img.currentSrc || img.src,
    alt: img.alt || 'Imagem da galeria',
    filename: buildFilename(img.currentSrc || img.src, index)
  }));

  const overlay = document.createElement('div');
  overlay.className = 'gallery-lightbox';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="gallery-lightbox-inner" role="dialog" aria-modal="true" aria-label="Galeria de imagens">
      <div class="gallery-lightbox-toolbar">
        <div class="gallery-lightbox-counter">Imagem <span data-current>1</span> de <span data-total>${items.length}</span></div>
        <div class="gallery-lightbox-actions">
          <a class="gallery-download-link" data-download href="#" download>Download</a>
          <button class="gallery-lightbox-btn" type="button" data-close>Fechar</button>
        </div>
      </div>
      <div class="gallery-stage">
        <button class="gallery-nav prev" type="button" data-prev aria-label="Imagem anterior">‹</button>
        <div class="gallery-lightbox-image-wrap"><img class="gallery-lightbox-image" alt=""></div>
        <button class="gallery-nav next" type="button" data-next aria-label="Próxima imagem">›</button>
      </div>
      <div class="gallery-lightbox-caption" data-caption></div>
    </div>`;
  document.body.appendChild(overlay);

  const currentEl = overlay.querySelector('[data-current]');
  const captionEl = overlay.querySelector('[data-caption]');
  const imageEl = overlay.querySelector('.gallery-lightbox-image');
  const downloadEl = overlay.querySelector('[data-download]');
  let currentIndex = 0;

  function render(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    imageEl.src = item.src;
    imageEl.alt = item.alt;
    captionEl.textContent = item.alt;
    currentEl.textContent = String(currentIndex + 1);
    downloadEl.href = item.src;
    downloadEl.setAttribute('download', item.filename);
  }

  function openLightbox(index) {
    render(index);
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  imageNodes.forEach((img, index) => {
    const trigger = img.closest('.detail-gallery-item, .mini-gallery-item, .portfolio-rich-cover') || img;
    trigger.tabIndex = 0;
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-label', `Abrir imagem ${index + 1} em galeria`);
    trigger.addEventListener('click', () => openLightbox(index));
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target.hasAttribute('data-close')) closeLightbox();
    if (event.target.hasAttribute('data-prev')) render(currentIndex - 1);
    if (event.target.hasAttribute('data-next')) render(currentIndex + 1);
  });

  document.addEventListener('keydown', (event) => {
    if (!overlay.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') render(currentIndex - 1);
    if (event.key === 'ArrowRight') render(currentIndex + 1);
  });
}

initGalleryLightbox();
