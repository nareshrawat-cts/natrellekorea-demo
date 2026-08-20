/**
 * Warranty status lookup widget.
 * Renders name + birthdate inputs and a search submit. The original site posts
 * these to a backend lookup; here we wire up client-side validation and leave a
 * submit hook the project can point at the real endpoint.
 * @param {Element} widget The widget block element (contains the fetched HTML)
 */
export default async function decorate(widget) {
  const form = widget.querySelector('.warranty-status-form');
  if (!form) return;

  const birth = form.querySelector('input[name="birth"]');
  if (birth) {
    birth.addEventListener('input', () => {
      birth.value = birth.value.replace(/\D/g, '').slice(0, 6);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('input[name="name"]');
    if (name && !name.value.trim()) {
      name.focus();
      return;
    }
    if (birth && birth.value.trim().length < 6) {
      birth.focus();
      return;
    }
    // Placeholder for the warranty status lookup request.
    // Point this at the real endpoint when available.
    form.setAttribute('data-submitted', 'true');
  });
}
