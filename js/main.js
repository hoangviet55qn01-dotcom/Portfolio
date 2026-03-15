/* ============================================
   MAIN.JS — Common utilities & page renderers
   ============================================ */

// ─── DATA FETCHING ─────────────────────────────────────────────────

async function fetchJSON(path) {
  // Try localStorage override first (from admin panel)
  const lsKey = path.replace(/^\//, '').replace(/\//g, '_').replace('.json', '');
  const lsData = localStorage.getItem('portfolio_' + lsKey);
  if (lsData) {
    try { return JSON.parse(lsData); } catch(e) {}
  }
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch(e) {
    return null;
  }
}

// ─── SLUG HELPER ───────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ─── SOCIAL ICONS SVG ──────────────────────────────────────────────

const SOCIAL_ICONS = {
  dribbble: `<svg viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm7.369 5.227c1.31 1.566 2.102 3.565 2.127 5.745-2.97-.629-5.681-.551-8.12.19-.217-.492-.44-.974-.678-1.453 2.647-1.074 4.836-2.61 6.671-4.482zM12 2.104c2.211 0 4.247.782 5.845 2.075-1.668 1.716-3.717 3.13-6.161 4.129A43.64 43.64 0 008.1 2.677 10.04 10.04 0 0112 2.104zM5.93 3.64a41.73 41.73 0 013.689 5.394C7.18 9.944 4.68 10.467 2.141 10.467c-.033-.157-.05-.318-.065-.48A10.047 10.047 0 015.93 3.64zM2.104 12l.002-.12c2.765.013 5.491-.569 8.021-1.71.228.44.446.885.652 1.332-2.826 1.017-5.17 2.866-6.932 5.35A9.967 9.967 0 012.104 12zm3.327 6.506c1.621-2.327 3.781-4.093 6.39-5.102a43.54 43.54 0 011.998 7.11 9.97 9.97 0 01-8.388-2.008zm10.565 1.57a45.53 45.53 0 00-1.895-6.797c2.181-.306 4.52-.17 6.943.546a9.998 9.998 0 01-5.048 6.25z"/></svg>`,
  behance: `<svg viewBox="0 0 24 24"><path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.598.41.27.733.618.96 1.04.225.42.34.92.34 1.5 0 .645-.15 1.18-.443 1.61-.294.43-.722.78-1.28 1.048.757.195 1.313.57 1.67 1.127.356.555.534 1.228.534 2.017 0 .65-.123 1.206-.37 1.662-.246.46-.577.833-.993 1.12-.42.286-.9.49-1.44.614-.547.123-1.1.186-1.66.186H0V4.503h6.938zM3.29 9.61h3.157c.61 0 1.107-.145 1.49-.43.38-.287.572-.742.572-1.365 0-.33-.063-.604-.188-.823-.126-.217-.3-.39-.516-.51-.218-.12-.47-.204-.754-.247-.284-.043-.58-.064-.893-.064H3.29V9.61zm0 5.675h3.29c.34 0 .664-.032.97-.097.308-.065.583-.175.82-.332.238-.16.43-.376.573-.646.145-.27.217-.613.217-1.026 0-.8-.235-1.37-.702-1.705-.468-.336-1.077-.503-1.824-.503H3.29v4.31zM17.79 12.27c.24-.95.36-1.963.36-3.04 0-.508-.04-.994-.12-1.46H12.6v2.15h3.04c-.133.67-.387 1.22-.76 1.65-.374.43-.86.73-1.463.905v1.75h2.384c1.394-1.29 2.14-3.196 2.14-5.472H24v14h-6.21V12.27zm-4.14 4.01v1.695h2.17c-.68 1.022-1.74 1.533-3.183 1.533-1.01 0-1.87-.34-2.576-1.017-.707-.677-1.06-1.59-1.06-2.738 0-1.17.352-2.097 1.055-2.777.704-.68 1.57-1.02 2.6-1.02.614 0 1.16.133 1.638.4.478.267.84.64 1.09 1.12l1.84-1.1c-.42-.77-1.03-1.38-1.83-1.833-.8-.45-1.72-.675-2.76-.675-1.67 0-3.07.56-4.2 1.684-1.13 1.12-1.697 2.54-1.697 4.257 0 1.715.566 3.12 1.697 4.213 1.13 1.094 2.53 1.64 4.2 1.64 1.74 0 3.12-.558 4.14-1.675 1.02-1.117 1.53-2.638 1.53-4.563H13.65v1.85z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  framer: `<svg viewBox="0 0 24 24"><path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/></svg>`
};

function renderSocialIcons(social, className = 'social-icons') {
  if (!social) return '';
  const items = ['dribbble', 'behance', 'linkedin', 'framer']
    .filter(k => social[k])
    .map(k => `<a href="${social[k]}" target="_blank" rel="noopener" class="social-icon" aria-label="${k}">${SOCIAL_ICONS[k]}</a>`)
    .join('');
  return `<div class="${className}">${items}</div>`;
}

// ─── THUMBNAIL HOVER (VIDEO SWAP) ─────────────────────────────────

function initCardHover() {
  document.querySelectorAll('.project-card').forEach(card => {
    const thumb = card.querySelector('.card-thumb');
    const video = card.querySelector('.card-video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

// ─── CATEGORY FORMATTER ────────────────────────────────────────────

function formatCategories(cats) {
  if (!cats || !cats.length) return '';
  return cats.filter(Boolean).join(' · ');
}

// ─── RENDER PROJECT CARD ───────────────────────────────────────────

function renderProjectCard(p) {
  const videoHtml = p.thumbnailVideo
    ? `<video class="card-video" src="${p.thumbnailVideo}" muted loop playsinline preload="none"></video>`
    : '';
  const thumbStyle = !p.thumbnail ? `style="background:var(--color-border-light)"` : '';
  return `
    <a class="project-card" href="/project/${p.slug}.html">
      <div class="project-card-media">
        <img class="card-thumb" src="${p.thumbnail || ''}" alt="${p.name}"
          onerror="this.style.display='none'"
          ${thumbStyle}>
        ${videoHtml}
      </div>
      <div class="project-card-info">
        <span class="project-card-name">${p.name}</span>
        <span class="project-card-cats">${formatCategories(p.categories)}</span>
      </div>
    </a>
  `;
}

// ─── PAGE: HOME ─────────────────────────────────────────────────────

async function initHomePage() {
  const [profile, projects] = await Promise.all([
    fetchJSON('/data/profile.json'),
    fetchJSON('/data/projects.json')
  ]);
  if (!profile || !projects) return;

  const sorted = [...projects].sort((a, b) => (a.order || 99) - (b.order || 99));

  // Sidebar
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sidebar-avatar">
        <img src="${profile.avatar}" alt="${profile.name}" onerror="this.style.display='none'">
      </div>
      <h1 class="sidebar-name">${profile.name}</h1>
      <p class="sidebar-bio">${profile.bio1 ? profile.bio1.substring(0, 200) + '...' : profile.subtitle}</p>
      ${renderSocialIcons(profile.social)}
      <div class="sidebar-cta">
        <a href="/about.html" class="btn btn-secondary">About Me</a>
        <a href="mailto:${profile.email}" class="btn btn-primary">Email</a>
      </div>
    `;
  }

  // Projects
  const projectsList = document.getElementById('projects-list');
  if (projectsList) {
    projectsList.innerHTML = sorted.map(renderProjectCard).join('');
    initCardHover();
  }

  // Clients
  const clientsEl = document.getElementById('clients-logos');
  if (clientsEl && profile.clients) {
    clientsEl.innerHTML = profile.clients.map(c =>
      `<img src="${c.logo}" alt="${c.name}" onerror="this.style.display='none'">`
    ).join('');
  }
}

// ─── PAGE: ABOUT ────────────────────────────────────────────────────

async function initAboutPage() {
  const [profile, experiences] = await Promise.all([
    fetchJSON('/data/profile.json'),
    fetchJSON('/data/experiences.json')
  ]);
  if (!profile) return;

  const el = id => document.getElementById(id);

  if (el('about-title')) el('about-title').textContent = profile.tagline;
  if (el('about-subtitle')) el('about-subtitle').textContent = profile.subtitle;
  if (el('about-social')) el('about-social').innerHTML = renderSocialIcons(profile.social);
  if (el('about-profile-img')) {
    el('about-profile-img').src = profile.profileImage;
    el('about-profile-img').alt = profile.name;
  }
  if (el('about-bio-1')) el('about-bio-1').textContent = profile.bio1;
  if (el('about-bio-2')) el('about-bio-2').textContent = profile.bio2;
  if (el('about-email')) el('about-email').href = `mailto:${profile.email}`;

  if (el('experience-list') && experiences) {
    const sorted = [...experiences].sort((a, b) => (a.order || 99) - (b.order || 99));
    el('experience-list').innerHTML = sorted.map(exp => `
      <div class="experience-item">
        <div class="experience-left">
          <div class="experience-logo">
            <img src="${exp.logo}" alt="${exp.company}" onerror="this.style.display='none'">
          </div>
          <span class="experience-company">${exp.company}</span>
        </div>
        <span class="experience-period">${exp.startDate} – ${exp.endDate || 'Present'}</span>
      </div>
    `).join('');
  }
}

// ─── PAGE: PROJECT DETAIL ──────────────────────────────────────────

async function initProjectDetailPage() {
  const slug = window.location.pathname.split('/').pop().replace('.html', '');
  const [projects] = await Promise.all([fetchJSON('/data/projects.json')]);
  if (!projects) return;

  const project = projects.find(p => p.slug === slug);
  if (!project) {
    document.body.innerHTML = '<div style="padding:80px;text-align:center"><h2>Project not found</h2><a href="/">← Back</a></div>';
    return;
  }

  const el = id => document.getElementById(id);

  document.title = `${project.name} — Portfolio`;
  if (el('project-name')) el('project-name').textContent = project.name;
  if (el('project-description')) el('project-description').textContent = project.description;
  if (el('project-header-img')) {
    el('project-header-img').src = project.headerImage;
    el('project-header-img').alt = project.name;
  }
  if (el('project-rich-content')) el('project-rich-content').innerHTML = project.content || '';
  if (el('project-live-btn')) {
    if (project.liveUrl) {
      el('project-live-btn').href = project.liveUrl;
      el('project-live-btn').style.display = 'inline-flex';
    } else {
      el('project-live-btn').style.display = 'none';
    }
  }

  // Meta table
  const metaRows = [
    ['Type', formatCategories(project.categories)],
    ['Date', project.date],
    ['Outcome', project.outcome]
  ].filter(([, v]) => v);

  if (el('project-meta')) {
    el('project-meta').innerHTML = metaRows.map(([label, value]) => `
      <tr>
        <td>${label}</td>
        <td>${value}</td>
      </tr>
    `).join('');
  }

  // More work
  const others = projects.filter(p => p.slug !== slug).slice(0, 3);
  if (el('more-work-grid')) {
    el('more-work-grid').innerHTML = others.map(p => `
      <a class="more-work-card" href="/project/${p.slug}.html">
        <div class="more-work-thumb">
          <img src="${p.thumbnail}" alt="${p.name}" onerror="this.style.background='var(--color-border-light)';this.style.display='none'">
        </div>
        <div class="more-work-name">${p.name}</div>
        <div class="more-work-cats">${formatCategories(p.categories)}</div>
      </a>
    `).join('');
  }
}

// ─── AUTO INIT ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  if (body.dataset.page === 'home') initHomePage();
  if (body.dataset.page === 'about') initAboutPage();
  if (body.dataset.page === 'project-detail') initProjectDetailPage();
});
