const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

// Altera este email para receber os pedidos enviados pelo formulario.
const FORM_RECEIVER_EMAIL = 'reliquiasdabairrada@gmail.com';

if (toggle && nav) {
  const navLinks = Array.from(nav.querySelectorAll('a'));

  function setMenu(isOpen) {
    nav.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen && window.innerWidth <= 820 ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => {
    setMenu(!nav.classList.contains('open'));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) setMenu(false);
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

function setFormStatus(message, state = '') {
  if (!status) return;
  status.textContent = message;
  if (state) {
    status.dataset.state = state;
  } else {
    delete status.dataset.state;
  }
}

function buildCaptcha(formNode) {
  const submitButton = formNode.querySelector('button[type="submit"]');
  if (!submitButton) return null;

  const captchaRow = document.createElement('div');
  captchaRow.className = 'form-row captcha-row';
  captchaRow.innerHTML = `
    <label for="captcha-answer">Verificacao anti-spam</label>
    <div class="captcha-box">
      <p class="captcha-question" id="captcha-question"></p>
      <button class="captcha-refresh" type="button">Nova conta</button>
    </div>
    <input autocomplete="off" id="captcha-answer" inputmode="numeric" maxlength="3" placeholder="Resposta" required type="text">
  `;

  formNode.insertBefore(captchaRow, submitButton);

  const questionEl = captchaRow.querySelector('.captcha-question');
  const refreshButton = captchaRow.querySelector('.captcha-refresh');
  const answerInput = captchaRow.querySelector('#captcha-answer');
  let expectedAnswer = '';

  function refreshCaptcha() {
    const first = Math.floor(Math.random() * 8) + 1;
    const second = Math.floor(Math.random() * 8) + 1;
    expectedAnswer = String(first + second);
    questionEl.textContent = `Quanto e ${first} + ${second}?`;
    answerInput.value = '';
  }

  refreshButton.addEventListener('click', refreshCaptcha);
  refreshCaptcha();

  return {
    answerInput,
    refreshCaptcha,
    isValid() {
      return answerInput.value.trim() === expectedAnswer;
    }
  };
}

if (form && status) {
  const submitButton = form.querySelector('button[type="submit"]');
  const currentUrl = new URL(window.location.href);
  const receiverEmail = FORM_RECEIVER_EMAIL.trim();
  const formEndpoint = receiverEmail ? `https://formsubmit.co/${encodeURIComponent(receiverEmail)}` : '';
  const ajaxEndpoint = receiverEmail ? `https://formsubmit.co/ajax/${encodeURIComponent(receiverEmail)}` : '';
  const captcha = buildCaptcha(form);
  const defaultButtonText = submitButton ? submitButton.textContent : 'Enviar';

  if (formEndpoint) {
    form.setAttribute('action', formEndpoint);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormStatus('', '');

    if (!receiverEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receiverEmail)) {
      setFormStatus('Configure primeiro o email em FORM_RECEIVER_EMAIL no ficheiro assets/js/site.js.', 'error');
      return;
    }

    if (!captcha || !captcha.isValid()) {
      setFormStatus('Confirme a conta anti-spam antes de enviar.', 'error');
      captcha?.refreshCaptcha();
      captcha?.answerInput.focus();
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
      setFormStatus('Submissao invalida.', 'error');
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
      setFormStatus('Introduza um nome valido.', 'error');
      nomeEl.focus();
      return;
    }

    if (apelido.length > 80) {
      setFormStatus('O apelido excede o tamanho permitido.', 'error');
      apelidoEl.focus();
      return;
    }

    if (!emailOk || email.length > 120) {
      setFormStatus('Introduza um endereco de email valido.', 'error');
      emailEl.focus();
      return;
    }

    if (!telefoneOk) {
      setFormStatus('Introduza um numero de telefone valido.', 'error');
      telefoneEl.focus();
      return;
    }

    if (mensagem.length < 10 || mensagem.length > 2000) {
      setFormStatus('A mensagem deve ter entre 10 e 2000 caracteres.', 'error');
      mensagemEl.focus();
      return;
    }

    if (!consentimentoEl.checked) {
      setFormStatus('Tem de autorizar o tratamento dos dados para enviar o pedido.', 'error');
      consentimentoEl.focus();
      return;
    }

    const formData = new FormData(form);
    formData.set('_url', currentUrl.href);
    formData.set('_captcha', 'true');

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'A enviar...';
      }
      setFormStatus('A enviar o pedido...', 'pending');

      const response = await fetch(ajaxEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      });

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok || responseData.success === false) {
        throw new Error(responseData.message || 'Falha no envio.');
      }

      form.innerHTML = '<p class="form-success-message" role="status" aria-live="polite">Obrigado.</p>';
    } catch (error) {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
      }
      captcha.refreshCaptcha();
      setFormStatus('Nao foi possivel enviar o pedido. Tente novamente.', 'error');
    }
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
        <button class="gallery-nav prev" type="button" data-prev aria-label="Imagem anterior"><</button>
        <div class="gallery-lightbox-image-wrap"><img class="gallery-lightbox-image" alt=""></div>
        <button class="gallery-nav next" type="button" data-next aria-label="Proxima imagem">></button>
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
