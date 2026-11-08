const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const menu = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
function closeMenu() { menu?.setAttribute('aria-expanded', 'false'); if (mobileNav) mobileNav.hidden = true; }
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); mobileNav.hidden = !open; });
$$('.mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));
window.matchMedia('(min-width: 981px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
$$('.nav-dropdown').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.nav-dropdown').forEach(other => { if (other !== d) other.open = false; }); }));
document.addEventListener('click', e => { if (!e.target.closest('.nav-dropdown')) $$('.nav-dropdown').forEach(d => d.open = false); if (!e.target.closest('.site-header')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const searchDialog = $('#search-dialog'); if (searchDialog?.open) { searchDialog.close(); e.preventDefault(); } if (menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } $$('.nav-dropdown[open]').forEach(d => { d.open = false; $('summary', d).focus(); }); } });

const industries = {
  construction: ['Bring greater visibility to site safety, equipment activity and operational reporting.', 'construction AI solutions', '/aisi-design-preview/industries/construction/'],
  manufacturing: ['Explore ways to connect production knowledge, automate routine reporting and spot operational risks.', 'manufacturing AI solutions', '/aisi-design-preview/industries/manufacturing/'],
  facilities: ['Explore smarter monitoring, maintenance workflows and day-to-day coordination across your facilities.', 'facilities AI solutions', '/aisi-design-preview/industries/facilities-management/'],
  logistics: ['Connect operational data and explore intelligent support for warehouse activity and document workflows.', 'logistics AI solutions', '/aisi-design-preview/industries/logistics/'],
  government: ['Explore how video intelligence and connected information can support public services and urban operations.', 'public sector AI solutions', '/aisi-design-preview/industries/government/']
};
function selectIndustry(key) { const data = industries[key]; if (!data || !$('#industry-detail')) return; $$('[data-industry]').forEach(b => { const active = b.dataset.industry === key; b.setAttribute('aria-selected', String(active)); b.tabIndex = active ? 0 : -1; b.classList.toggle('active', active); }); $('#industry-detail').setAttribute('aria-labelledby', 'industry-' + key); $('#industry-description').textContent = data[0]; $('#industry-link').href = data[2]; $('#industry-link').setAttribute('aria-label', 'Explore ' + data[1]); }
$$('[data-industry]').forEach(b => b.addEventListener('click', () => selectIndustry(b.dataset.industry)));
const solutions = {
  enterprise: { kicker: 'From disconnected to connected', title: 'Make your systems work together.', description: 'Connect knowledge, tools and workflows with AI that fits your existing environment. Build a foundation that can grow with your organisation.', link: 'Explore enterprise AI', url: '/aisi-design-preview/solutions/ai-enterprise/', outcome: 'Better decisions. Connected operations.', icon: '#i-chip' },
  agents: { kicker: 'More time for meaningful work', title: 'Give your people a capable partner.', description: 'Put useful knowledge within reach and simplify repetitive workflows. AI agents help your team find information, prepare documents and keep everyday work moving.', link: 'Explore AI agents', url: '/aisi-design-preview/solutions/ai-agents/', outcome: 'Less routine. More human possibility.', icon: '#i-nodes' },
  vision: { kicker: 'From footage to foresight', title: 'See more. Understand sooner.', description: 'Turn existing camera feeds into useful operational intelligence. Identify safety risks, understand activity and support more timely, informed action.', link: 'Explore video analytics', url: '/aisi-design-preview/solutions/ai-video-analytics/', outcome: 'A clearer view. An informed response.', icon: '#i-camera' }
};
function selectSolution(key) { const data = solutions[key]; if (!data || !$('#solution-panel')) return; $$('[data-solution]').forEach(b => { const active = b.dataset.solution === key; b.setAttribute('aria-selected', String(active)); b.tabIndex = active ? 0 : -1; }); $('#solution-panel').setAttribute('aria-labelledby', 'tab-' + key); $('#solution-kicker').textContent = data.kicker; $('#solution-title').textContent = data.title; $('#solution-description').textContent = data.description; $('#solution-link').href = data.url; $('#solution-link').firstChild.textContent = data.link + ' '; $('#diagram-outcome').textContent = data.outcome; $('.diagram-core use').setAttribute('href', data.icon); }
$$('[data-solution]').forEach(b => b.addEventListener('click', () => selectSolution(b.dataset.solution)));
$$('[data-select-solution]').forEach(a => a.addEventListener('click', () => { selectSolution(a.dataset.selectSolution); $$('.nav-dropdown').forEach(d => d.open = false); }));
$$('[role="tablist"]').forEach(list => list.addEventListener('keydown', e => { const tabs = $$('[role="tab"]', list); const index = tabs.indexOf(document.activeElement); if (index < 0) return; let next; if (['ArrowRight', 'ArrowDown'].includes(e.key)) next = (index + 1) % tabs.length; else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) next = (index - 1 + tabs.length) % tabs.length; else if (e.key === 'Home') next = 0; else if (e.key === 'End') next = tabs.length - 1; if (next !== undefined) { e.preventDefault(); tabs[next].click(); tabs[next].focus(); } }));

const dialog = $('#search-dialog');
let searchPages = [{ title: 'Enterprise AI integration', path: '/aisi-design-preview/solutions/ai-enterprise/', type: 'Solution' }, { title: 'AI agents', path: '/aisi-design-preview/solutions/ai-agents/', type: 'Solution' }, { title: 'Video analytics', path: '/aisi-design-preview/solutions/ai-video-analytics/', type: 'Solution' }, { title: 'Industries', path: '/aisi-design-preview/industries/', type: 'Explore' }, { title: 'Case studies', path: '/aisi-design-preview/case-studies/', type: 'Client work' }, { title: 'About AISI', path: '/aisi-design-preview/about/', type: 'Company' }, { title: 'Insights & articles', path: '/aisi-design-preview/blog/', type: 'Resources' }, { title: 'Contact our team', path: '/aisi-design-preview/contact/', type: 'Contact' }];
fetch('/aisi-design-preview/search-index.json').then(r => r.ok ? r.json() : null).then(data => { if (Array.isArray(data)) searchPages = data; }).catch(() => {});
function renderSearch() { const q = $('#site-search').value.trim().toLowerCase(); const matches = searchPages.filter(p => (p.title + ' ' + p.type).toLowerCase().includes(q)).slice(0, 12); $('#search-status').textContent = q ? `${matches.length} ${matches.length === 1 ? 'result' : 'results'}${matches.length ? '' : ' — try “agents”, “safety” or “contact”'}` : 'Explore AISI'; $('#search-results').replaceChildren(...matches.map(p => { const a = document.createElement('a'); a.href = p.path; const title = document.createElement('span'); title.textContent = p.title; const type = document.createElement('span'); type.textContent = p.type + ' ↗'; a.append(title, type); a.addEventListener('click', () => dialog.close()); return a; })); }
$$('.search-toggle').forEach(b => b.addEventListener('click', () => { renderSearch(); dialog.showModal(); $('#site-search').focus(); }));
$('.close-search')?.addEventListener('click', () => dialog.close());
$('#site-search')?.addEventListener('input', renderSearch);
dialog?.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
$$('[data-filter]').forEach(b => b.addEventListener('click', () => { const filter = b.dataset.filter; $$('[data-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); $$('[data-category]').forEach(card => card.hidden = filter !== 'all' && !card.dataset.category.includes(filter)); const count = $$('[data-category]').filter(c => !c.hidden).length; if ($('#filter-status')) $('#filter-status').textContent = `${count} ${count === 1 ? 'story' : 'stories'}`; }));
$('#article-search')?.addEventListener('input', e => { const query = e.target.value.trim().toLowerCase(); const cards = $$('[data-article]'); cards.forEach(c => c.hidden = !c.textContent.toLowerCase().includes(query)); const count = cards.filter(c => !c.hidden).length; $('#article-count').textContent = `${count} ${count === 1 ? 'article' : 'articles'}`; });
$('#contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const subject = `AISI enquiry — ${data.get('company')}`;
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company')}\nPhone: ${data.get('phone') || 'Not provided'}\nInterest: ${data.get('interest')}\n\n${data.get('message')}`;
  const url = `mailto:Specialist@aisi-asia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $('#email-fallback').href = url;
  $('#email-fallback').hidden = false;
  $('#contact-status').textContent = 'Your enquiry is prepared. Review and send it in your email app. If it did not open, use the email link below.';
  window.location.href = url;
});
