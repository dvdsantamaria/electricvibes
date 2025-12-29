document.addEventListener('DOMContentLoaded', () => {
  initVideoFilters();
  initContactForm();
});

// Simple category filter for the video grid
// how it works: toggles .is-active on the button and shows items by data-cat
function initVideoFilters() {
  const buttons = document.querySelectorAll('#filters button');
  const items = document.querySelectorAll('#video-grid .video-card');

  if (!buttons.length) {
    return;
  }

  function applyFilter(filter) {
    items.forEach(card => {
      const cat = card.getAttribute('data-cat');
      const show = filter === 'all' || filter === cat;
      card.hidden = !show; // native hidden attribute
    });
  }

  // default
  applyFilter('all');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      applyFilter(btn.dataset.filter);
    });
  });
}

// Handles Formspark submission without leaving the site and provides a toast message
function initContactForm() {
  const form = document.querySelector('[data-formspark]');
  if (!form) {
    return;
  }

  const endpoint = form.getAttribute('data-formspark');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalLabel = submitBtn ? submitBtn.textContent : '';
  const toast = getToastElement();
  let toastTimeout;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!endpoint) {
      return;
    }

    const formData = new FormData(form);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      form.reset();
      showToast('Message sent! We will be in touch soon.');
    } catch (error) {
      console.error('Formspark submission error:', error);
      showToast('Something went wrong. Please try again.', true);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  });

  function showToast(message, isError = false) {
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.remove('toast--error');
    if (isError) {
      toast.classList.add('toast--error');
    }
    toast.classList.add('is-visible');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4000);
  }
}

function getToastElement() {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  return toast;
}
