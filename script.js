const config = window.siteConfig || {};
const currentPage = location.pathname.split('/').pop() || 'index.html';
const arrow = '<span aria-hidden="true">↗</span>';
const nav = [['contact.html', 'Contact'], ['work.html', 'Work'], ['about.html', 'About']];
const getWhatsAppUrl = (message = config.whatsappMessage || 'Hi! I’d like to discuss a project.') => {
  const number = String(config.whatsappNumber || '').replace(/\D/g, '');
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : 'contact.html';
};
const header = document.querySelector('[data-header]');
if (header) header.innerHTML = `
  <div class="container header-inner">
    <a class="wordmark" href="index.html" aria-label="${config.name || 'Keenan'} home">${config.name || 'Keenan'}<span>.</span></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Open navigation"><span></span><span></span></button>
    <nav id="main-nav" class="main-nav" aria-label="Main navigation">${nav.map(([url, label]) => `<a href="${url}" ${currentPage === url || (url === 'work.html' && currentPage === 'project.html') ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
    <a class="header-cta" href="${getWhatsAppUrl()}" ${config.whatsappNumber ? 'target="_blank" rel="noopener noreferrer"' : ''}>${config.whatsappNumber ? 'WhatsApp me' : 'Let’s talk'} ${arrow}</a>
  </div>`;
const footer = document.querySelector('[data-footer]');
if (footer) footer.innerHTML = `
  <div class="container footer-top"><a href="index.html" class="wordmark">${config.name || 'Keenan'}<span>.</span></a><p>A little thought. A lot of intention.</p><a class="back-top" href="#top">Back to top <span aria-hidden="true">↑</span></a></div>
  <div class="container footer-bottom"><span>© ${new Date().getFullYear()} ${config.name || 'Keenan'}. Made with care.</span><div><a href="contact.html">Contact</a><a href="work.html">Work</a><a href="about.html">About</a></div><span class="footer-location">${config.location || 'South Africa'} <span aria-hidden="true">✳</span></span></div>`;

document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.href = getWhatsAppUrl(link.dataset.whatsappMessage || undefined);
});

const menu = document.querySelector('.menu-toggle');
const closeMenu = () => {
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', 'Open navigation');
  document.querySelector('.main-nav')?.classList.remove('is-open');
};
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  document.querySelector('.main-nav').classList.toggle('is-open', open);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.header-inner')) closeMenu(); });

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    let visible = 0;
    document.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter);
      if (!card.hidden) visible++;
    });
    const count = document.querySelector('[data-results]');
    if (count) count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
  });
});

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const status = document.querySelector('#form-status');
  const emailLabel = document.querySelector('[data-email]');
  const copyButton = document.querySelector('[data-copy-email]');
  if (config.email) {
    document.querySelector('[data-email-block]').hidden = false;
    emailLabel.textContent = config.email;
    emailLabel.href = `mailto:${config.email}`;
    copyButton.hidden = false;
    document.querySelector('[data-contact-note]').textContent = 'Opens a draft in your email app. Review it there before sending.';
    document.querySelector('[data-submit-label]').textContent = 'Prepare email';
  } else {
    emailLabel.textContent = 'A good conversation starts here.';
    emailLabel.removeAttribute('href');
    document.querySelector('[data-contact-note]').textContent = 'Preview mode: this form creates a message you can copy. No messages are sent.';
    document.querySelector('[data-submit-label]').textContent = 'Prepare message';
  }
  if (config.whatsappNumber) {
    document.querySelector('[data-contact-note]').textContent = 'Opens WhatsApp with your message. You choose when to send.';
    document.querySelector('[data-submit-label]').textContent = 'Continue on WhatsApp';
  }
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(config.email);
      copyButton.textContent = 'Copied ✓';
      setTimeout(() => copyButton.textContent = 'Copy email ↗', 2200);
    } catch { status.textContent = 'Copy is unavailable. You can select and copy the email address above.'; }
  });
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const subject = `${data.get('service') || 'New project'} — ${data.get('name')}`;
    const email = String(data.get('email') || '').trim();
    const body = `Hi ${config.name || 'Keenan'},\n\n${data.get('message')}\n\n${data.get('name')}${email ? `\n${email}` : ''}`;
    if (config.whatsappNumber) {
      const link = document.createElement('a');
      link.href = getWhatsAppUrl(`${subject}\n\n${body}`);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
      status.textContent = 'Your draft is ready in WhatsApp. Review it there and tap send when you’re ready.';
    } else if (config.email) {
      const link = document.createElement('a');
      link.href = `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      link.click();
      status.textContent = 'Your email draft is ready. Send it from your email app to get in touch.';
    } else {
      const preview = document.querySelector('#message-preview');
      preview.hidden = false;
      preview.querySelector('textarea').value = `Subject: ${subject}\n\n${body}`;
      status.textContent = 'Your message is ready below. This preview has not sent an email.';
      preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
  document.querySelector('[data-copy-message]')?.addEventListener('click', async e => {
    const field = document.querySelector('#message-preview textarea');
    try { await navigator.clipboard.writeText(field.value); e.target.textContent = 'Message copied ✓'; }
    catch { field.focus(); field.select(); status.textContent = 'Message selected. Use your device’s copy command.'; }
  });
}

const projects = {
  barber: { name: 'Mohammed’s Barber Shop', tagline: 'A fresh cut. A clear head.', type: 'Website design & development', image: 'barber/desktop.webp', imageWidth: 1440, imageHeight: 1000, imageAlt: 'Mohammed’s Barber Shop homepage with bold lime typography and black-and-white barber photography', category: 'Web design · Development', color: 'barber-cover', status: 'Live website · Independent concept', period: 'Built / 2026', liveUrl: 'https://barber-shop-three-theta.vercel.app/', note: 'A working website for a fictional barbershop, designed and built as an independent portfolio project. Photography via Unsplash.', intro: 'A bold, responsive website that brings a neighbourhood barbershop online, from the first impression to a ready-to-send WhatsApp booking request.', challenge: 'Help visitors find a service, understand the price, and request a time without having to work through a complicated booking system. The site also needs to make practical details, like opening hours and location, easy to find on a phone.', approach: 'Oversized typography, a charcoal palette, and sharp lime accents give the shop a confident identity. A three-step booking flow guides visitors through their service, preferred day and time, and first name, with an appointment summary that updates as they go.', outcome: 'A deployed website with six services, clear prices and durations, responsive layouts, and a WhatsApp request builder. Times follow the shop’s opening hours in Cape Town; the shop confirms availability by replying on WhatsApp.', deliverables: ['Visual direction & responsive web design', 'HTML, CSS & JavaScript development', 'Three-step booking request builder', 'WhatsApp message integration', 'Service menu, opening hours & map'], next: 'guest-house', showcase: { title: 'From browse to booking.', videoLabel: 'Silent walkthrough showing the homepage, service selection, preferred time, and WhatsApp message preview', caption: 'The live booking flow: choose a cut, pick a preferred time, and preview the WhatsApp request. No request is sent in this recording.', detail: 'barber/booking.webp', detailAlt: 'Desktop booking interface with a selected Skin Fade, day and time picker, and appointment summary', detailCaption: 'A clear booking flow with a running appointment summary.' } },
  'guest-house': { name: 'Salt & Still', tagline: 'A slower kind of seaside stay.', type: 'Website design & development', image: 'guest-house/desktop.webp', imageWidth: 1440, imageHeight: 1000, imageAlt: 'Salt & Still guest house homepage with coastal imagery, blue typography, and a stay planner', category: 'Web design · Development', color: 'guest-house-cover', status: 'Live website · Independent concept', period: 'Built / 2026', liveUrl: 'https://guest-house-1n3k.vercel.app/', note: 'A working website for a fictional guest house in Wilderness, designed and built as an independent portfolio project. Imagery created with AI. Rates and property details are illustrative; the stay planner does not send enquiries, take payments, or reserve rooms.', intro: 'A coastal guest house website that pairs a relaxed visual identity with practical suite details and an interactive stay planner.', challenge: 'Give visitors a feel for a seaside escape while making it easy to compare suites, explore the area, and understand the cost of a stay. The experience needs to feel just as welcoming and useful on a phone.', approach: 'Ocean blues, warm neutrals, generous space, and coastal imagery set an unhurried pace. Suite dialogs keep room details close at hand, while a date-aware stay planner lets visitors choose a suite and see an estimated total. A local guide and expandable FAQs round out the experience.', outcome: 'A deployed, responsive website with two explorable suites, arrival and departure validation, suite-based price estimates, and a stay preview. Visitors can try the full demo without submitting personal details or making a reservation.', deliverables: ['Visual direction & responsive web design', 'HTML, CSS & JavaScript development', 'Suite details & interactive stay planner', 'Date validation & estimated stay totals', 'Local guide, FAQs & mobile navigation'], next: 'forma', showcase: { title: 'From seaside daydream to stay preview.', videoLabel: 'Silent walkthrough showing the guest house homepage, Ocean Suite details, suite selection, estimated total, and demo stay preview', caption: 'Explore a suite, compare illustrative rates, and preview a stay. This is a portfolio demo; nothing is reserved or sent.', detail: 'guest-house/planner.webp', detailAlt: 'Salt & Still stay planner showing two suite choices, stay dates, and an estimated total', detailCaption: 'Suite choices and a clear estimated total, with the demo status visible.' } },
  forma: { name: 'Forma', tagline: 'A quieter kind of commerce.', type: 'Brand & digital experience', image: 'forma.svg', category: 'Brand identity · Web design', color: 'sage', intro: 'A concept storefront for objects that make everyday living a little more considered.', challenge: 'Homeware stores can feel busy, even when the products are beautifully simple. This concept explores how an online store could feel as calm and intentional as the objects it sells.', approach: 'A warm neutral palette, generous space, and a confident serif identity set the tone. An uncluttered product page gives materials, form, and useful details room to speak.', outcome: 'A cohesive visual direction spanning the brand, storefront, and product browsing experience. The concept puts product discovery first, with a flexible design system that carries across screens.', deliverables: ['Visual identity & art direction', 'Responsive storefront concept', 'Product page design', 'Reusable UI components'], next: 'folio' },
  folio: { name: 'Folio', tagline: 'Space for better work.', type: 'Product design & development', image: 'folio.svg', category: 'Product design · Development', color: 'lavender', intro: 'A focused workspace concept that brings projects, people, and progress into one clear view.', challenge: 'A workspace should make the next step obvious. This concept addresses the noise of scattered tasks, hidden priorities, and dashboards that try to show everything at once.', approach: 'The interface starts with a short overview, then reveals more detail as needed. Clear hierarchy, restrained color, and consistent interaction patterns help people see what needs attention.', outcome: 'An interactive product direction with an overview dashboard, project organization, and a small component system. It demonstrates a considered approach to information architecture and interface craft.', deliverables: ['Information architecture', 'Dashboard interface concept', 'Component library', 'Responsive interaction patterns'], next: 'still' },
  still: { name: 'Still', tagline: 'Make a little room for you.', type: 'Brand & web experience', image: 'still.svg', category: 'Brand identity · Web design', color: 'sand', intro: 'A digital retreat concept for a slower, more intentional approach to everyday wellbeing.', challenge: 'Wellbeing experiences often ask for more attention than they give back. This concept explores a gentler introduction to mindful routines, without pressure or clutter.', approach: 'Soft natural colors and expressive typography create a welcoming rhythm. Simple navigation keeps the focus on discovering a practice and taking a small first step.', outcome: 'A brand and landing page direction that makes a quiet visual statement. The responsive composition balances atmosphere with accessible, practical calls to action.', deliverables: ['Brand strategy concept', 'Art direction & typography', 'Responsive website design', 'Interaction direction'], next: 'barber' },
};

const projectRoot = document.querySelector('[data-project-root]');
if (projectRoot) {
  const slug = new URLSearchParams(location.search).get('project') || 'barber';
  const project = Object.hasOwn(projects, slug) ? projects[slug] : null;
  if (!project) {
    projectRoot.innerHTML = '<section class="container page-intro"><p class="eyebrow">Project not found</p><h1>Let’s get you<br><em>back on track.</em></h1><a class="button button-dark" href="work.html">Explore the work ↗</a></section>';
    document.title = 'Project not found — Keenan';
  } else {
    const showcase = project.showcase;
    const assetDirectory = project.image.split('/').slice(0, -1).join('/');
    document.title = `${project.name} — ${config.name || 'Keenan'}`;
    document.querySelector('meta[name="description"]').content = `${project.name}: ${project.intro}`;
    projectRoot.innerHTML = `
      <section class="container project-intro ${project.liveUrl ? 'project-live' : ''}"><a class="text-link back-link" href="work.html">← Back to work</a><div class="project-heading"><div><p class="eyebrow">${project.type}</p><h1>${project.name}<span class="gold">.</span></h1></div><p>${project.tagline}</p></div><div class="project-meta"><span>${project.status || 'Independent concept'}</span><span>${project.category}</span><span>${project.period || 'Exploration / 2026'}</span></div>${project.liveUrl ? `<div class="project-actions"><a class="button button-dark" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Visit live website ${arrow}</a>${showcase ? '<a class="text-link" href="#walkthrough">Watch the walkthrough <span aria-hidden="true">↓</span></a>' : ''}</div>` : ''}</section>
      <div class="container"><div class="project-cover ${project.color}"><img src="assets/${project.image}" alt="${project.imageAlt || `${project.name} design concept and interface`}" width="${project.imageWidth || 1000}" height="${project.imageHeight || 760}" fetchpriority="high"></div></div>
      <section class="container case-body"><aside><p class="eyebrow">The overview</p><h2>Thought behind<br><em>the details.</em></h2><p class="concept-note">${project.note || 'Self-initiated concept project. Presented to demonstrate design approach; no client results are claimed.'}</p><h3 class="deliverables-title">The scope</h3><ul class="deliverables">${project.deliverables.map(item => `<li>${item}</li>`).join('')}</ul></aside><div class="case-sections"><p class="case-lead">${project.intro}</p><div><span class="step-number">01 / The challenge</span><h3>Start with the right question.</h3><p>${project.challenge}</p></div><div><span class="step-number">02 / The approach</span><h3>Make every choice count.</h3><p>${project.approach}</p></div><div><span class="step-number">03 / The outcome</span><h3>Bring the pieces together.</h3><p>${project.outcome}</p></div></div></section>
      ${showcase ? `<section class="container project-showcase" id="walkthrough" aria-labelledby="walkthrough-title"><div class="section-header"><div><p class="eyebrow">See it in action</p><h2 id="walkthrough-title">${showcase.title}</h2></div><span class="showcase-note">A short tour of the live website</span></div><figure class="walkthrough"><video controls playsinline preload="none" poster="assets/${project.image}" width="1280" height="900" aria-label="${showcase.videoLabel}"><source src="assets/${assetDirectory}/walkthrough.mp4" type="video/mp4"><a href="assets/${assetDirectory}/walkthrough.mp4">Download the walkthrough</a></video><figcaption>${showcase.caption}</figcaption></figure><div class="project-screen-grid"><figure class="booking-screen"><img src="assets/${showcase.detail}" alt="${showcase.detailAlt}" width="1440" height="1080" loading="lazy"><figcaption>${showcase.detailCaption}</figcaption></figure><figure class="mobile-screen"><img src="assets/${assetDirectory}/mobile.webp" alt="${project.name} mobile homepage with responsive typography and clear navigation" width="780" height="1688" loading="lazy"><figcaption>Made to feel at home on a phone.</figcaption></figure></div><a class="text-link" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Explore the live website ${arrow}</a></section>` : ''}
      <section class="next-project container"><span class="eyebrow">Up next</span><a href="project.html?project=${project.next}">${projects[project.next].name}<span aria-hidden="true">↗</span></a></section>`;
  }
}

const scrollArt = document.querySelector('[data-scroll-art]');
if (scrollArt) {
  const heroSection = scrollArt.closest('.hero');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const updateArtwork = () => {
    frame = 0;
    if (reducedMotion.matches) {
      scrollArt.style.removeProperty('--hero-scroll');
      return;
    }
    const bounds = heroSection.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
    const progress = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height)));
    scrollArt.style.setProperty('--hero-scroll', progress.toFixed(4));
  };
  const scheduleArtwork = () => {
    if (!frame) frame = window.requestAnimationFrame(updateArtwork);
  };
  window.addEventListener('scroll', scheduleArtwork, { passive: true });
  window.addEventListener('resize', scheduleArtwork, { passive: true });
  reducedMotion.addEventListener('change', scheduleArtwork);
  scheduleArtwork();
}

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach(el => { el.classList.add('will-reveal'); observer.observe(el); });
}
