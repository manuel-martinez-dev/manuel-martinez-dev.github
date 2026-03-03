const PHONE_DATA = {
  salt: 'IWu3oGdTMZiq131mNDAwQQ==',
  iv:   'zIKtr1LAtRaUrOj7',
  ct:   'J0HMRDReNl3HfNDxKIiR9iXg9NsacR8ZSmhqt+pK93g9'
};

const EMAIL_DATA = {
  salt: 'RS5yM/F3TjxuIKrUC5A2Rg==',
  iv:   'gv7M+gdFPYa8hqiZ',
  ct:   'LTpKfYzMd2D1gIyKlnRSpbybNxw32NI6c5KlXE2ySW/w6bcIkfIJm46XB76ztQ=='
};

const fromB64 = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

async function decrypt(data, password) {
  const enc = new TextEncoder();
  try {
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: fromB64(data.salt), iterations: 200000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromB64(data.iv) },
      key,
      fromB64(data.ct)
    );
    return new TextDecoder().decode(plaintext);
  } catch {
    return null;
  }
}

const overlay   = document.getElementById('modalOverlay');
const passInput = document.getElementById('passInput');
const errorEl   = document.getElementById('modalError');
const phoneEl   = document.getElementById('phoneValue');
const emailEl   = document.getElementById('emailValue');
const submitBtn = document.getElementById('submitBtn');

document.getElementById('dlBtn').addEventListener('click', () => {
  passInput.value = '';
  errorEl.textContent = '';
  overlay.classList.add('active');
  setTimeout(() => passInput.focus(), 50);
});

document.getElementById('closeBtn').addEventListener('click', () => {
  overlay.classList.remove('active');
});

overlay.addEventListener('click', e => {
  if (e.target === overlay) overlay.classList.remove('active');
});

passInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') submitBtn.click();
});

submitBtn.addEventListener('click', async () => {
  const password = passInput.value;
  if (!password) return;

  submitBtn.disabled = true;
  submitBtn.textContent = '...';
  errorEl.textContent = '';

  const [phone, email] = await Promise.all([
    decrypt(PHONE_DATA, password),
    decrypt(EMAIL_DATA, password)
  ]);

  submitBtn.disabled = false;
  submitBtn.textContent = '↵';

  if (!phone || !email) {
    errorEl.textContent = 'Error: authentication failed';
    passInput.value = '';
    passInput.focus();
    return;
  }

  phoneEl.textContent = phone;
  emailEl.textContent = email;
  overlay.classList.remove('active');
  passInput.value = '';

  window.addEventListener('afterprint', () => {
    phoneEl.textContent = '';
    emailEl.textContent = '';
  }, { once: true });

  window.print();
});
