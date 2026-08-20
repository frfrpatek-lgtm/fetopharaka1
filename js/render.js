/* ==========================================================================
   Fetop Haraka Limited — render.js
   Fetches CMS-managed content (products.json / testimonials.json) and
   renders it into the page. Editing these files via the CMS at /admin
   updates the site automatically on the next publish — no code changes.
   ========================================================================== */

(function () {
  const WHATSAPP_LINK = 'https://wa.me/254746410955';

  const productMediaHTML = (product) => `
    <div class="product-media">
      <img src="${product.image}" alt="${product.name}" loading="lazy"
           onload="this.classList.add('loaded')"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="img-placeholder" style="display:none;"><i class="fa-solid fa-camera"></i></div>
    </div>
  `;

  const productCardHTML = (product) => `
    <div class="product-card reveal visible" data-category="${product.category}">
      <div style="position:relative;">
        ${productMediaHTML(product)}
        <span class="category-badge">${product.category}</span>
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-price">${product.price ? product.price : ''}</div>
        <div class="product-actions">
          <a href="/contact.html?product=${encodeURIComponent(product.name)}" class="btn btn-dark btn-sm">Enquire Now</a>
          <a href="${WHATSAPP_LINK}" target="_blank" rel="noopener" class="btn btn-primary btn-sm"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
      </div>
    </div>
  `;

  const testimonialCardHTML = (t) => {
    const initials = t.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
    return `
      <div class="testimonial-card reveal visible">
        <div class="quote-icon"><i class="fa-solid fa-quote-left"></i></div>
        <div class="stars">${stars}</div>
        <p class="testimonial-text">"${t.text}"</p>
        <div class="testimonial-author">
          <div class="avatar-circle">${initials}</div>
          <div>
            <div class="author-name">${t.name}</div>
            <div class="author-company">${t.company}</div>
          </div>
        </div>
      </div>
    `;
  };

  async function loadJSON(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load ' + path);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function renderHomeProducts() {
    const grid = document.getElementById('home-products-grid');
    if (!grid) return;
    const data = await loadJSON('/content/products.json');
    if (!data) return;
    grid.innerHTML = data.products.slice(0, 6).map(productCardHTML).join('');
  }

  async function renderAllProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    const data = await loadJSON('/content/products.json');
    if (!data) return;
    grid.innerHTML = data.products.map(productCardHTML).join('');
    if (typeof window.__reinitProductFilter === 'function') {
      window.__reinitProductFilter();
    }
  }

  async function renderTestimonials() {
    const grid = document.getElementById('testimonials-grid');
    if (!grid) return;
    const data = await loadJSON('/content/testimonials.json');
    if (!data) return;
    grid.innerHTML = data.testimonials.map(testimonialCardHTML).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHomeProducts();
    renderAllProducts();
    renderTestimonials();
  });
})();
