/* =========================================================
   ADMIN PANEL — logic
   All content is stored under the same localStorage key that
   index.html reads (portfolio_data_v1), so every save here is
   reflected on the live site immediately — no HTML editing.
   ========================================================= */

const STORAGE_KEY = 'portfolio_data_v1';
const SESSION_KEY = 'portfolio_admin_session';

function getPersistedData(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved){ try{ return JSON.parse(saved); }catch(e){} }
  return structuredClone(window.DEFAULT_DATA);
}
function persist(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

let adminData = null;      // working copy being edited
let currentTab = 'overview';

/* ---------------------------------------------------------
   LOGIN
   --------------------------------------------------------- */
function initLogin(){
  const form = document.getElementById('login-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('login-user').value.trim();
    const p = document.getElementById('login-pass').value;
    const fresh = getPersistedData();
    if (u === fresh.admin.username && p === fresh.admin.password){
      sessionStorage.setItem(SESSION_KEY, '1');
      enterDashboard();
    } else {
      document.getElementById('login-error').textContent = 'Username atau password salah.';
    }
  });
}

function enterDashboard(){
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  adminData = getPersistedData();
  initTabs();
  renderTab('overview');
}

document.getElementById('logout-btn')?.addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
});

/* ---------------------------------------------------------
   TABS
   --------------------------------------------------------- */
const TAB_TITLES = {
  overview:'Ringkasan', site:'Situs & Tema', hero:'Hero Section', about:'Tentang Saya',
  skills:'Skills', education:'Pendidikan', experience:'Pengalaman & Proyek',
  certificate:'Sertifikat', gallery:'Galeri', contact:'Kontak', footer:'Footer & Statistik', account:'Akun Admin'
};

function initTabs(){
  document.querySelectorAll('.admin-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTab(btn.dataset.tab);
    });
  });
}

function renderTab(tab){
  currentTab = tab;
  document.getElementById('tab-title').textContent = TAB_TITLES[tab];
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
  const panel = document.getElementById('panel-'+tab);
  panel.classList.remove('hidden');
  RENDERERS[tab](panel);
  if (window.lucide) lucide.createIcons();
}

/* ---------------------------------------------------------
   SMALL HELPERS
   --------------------------------------------------------- */
function field(label, value, oninputAttr, type='text'){
  return `<div class="form-field">
    <label>${label}</label>
    <input type="${type}" value="${escapeAttr(value)}" oninput="${oninputAttr}">
  </div>`;
}
function textareaField(label, value, oninputAttr){
  return `<div class="form-field">
    <label>${label}</label>
    <textarea oninput="${oninputAttr}">${escapeHtml(value)}</textarea>
  </div>`;
}
function escapeAttr(str){ return String(str ?? '').replace(/"/g,'&quot;'); }
function escapeHtml(str){ return String(str ?? '').replace(/</g,'&lt;'); }

/* ---------------------------------------------------------
   OVERVIEW
   --------------------------------------------------------- */
function renderOverview(panel){
  const d = adminData;
  panel.innerHTML = `
    <div class="overview-grid">
      <div class="card overview-stat"><div class="num">${d.experience.items.length}</div><div class="label">Proyek</div></div>
      <div class="card overview-stat"><div class="num">${d.skills.categories.length}</div><div class="label">Skill</div></div>
      <div class="card overview-stat"><div class="num">${d.certificate.items.length}</div><div class="label">Sertifikat</div></div>
      <div class="card overview-stat"><div class="num">${d.gallery.items.length}</div><div class="label">Foto Galeri</div></div>
    </div>
    <div class="card overview-tip">
      <h3><i data-lucide="lightbulb"></i> Cara pakai</h3>
      <p>Pilih menu di sisi kiri untuk mengedit bagian website tersebut. Setiap perubahan hanya tersimpan
      setelah menekan tombol <strong>Simpan Perubahan</strong> di kanan atas. Setelah disimpan, buka atau muat ulang
      halaman "Lihat Situs" untuk melihat hasilnya secara langsung — tidak perlu mengedit kode HTML sama sekali.</p>
    </div>`;
}

/* ---------------------------------------------------------
   SITE & THEME
   --------------------------------------------------------- */
function renderSite(panel){
  const d = adminData;
  panel.innerHTML = `
    <div class="card">
      <h3><i data-lucide="globe"></i> Identitas Situs</h3>
      <div class="form-grid">
        ${field('Judul Tab Browser', d.site.title, "adminData.site.title=this.value")}
        ${field('Teks Logo', d.site.logoText, "adminData.site.logoText=this.value")}
        ${field('Path Favicon', d.site.favicon, "adminData.site.favicon=this.value")}
        ${field('Teks Loading Screen', d.site.loaderText, "adminData.site.loaderText=this.value")}
      </div>
    </div>
    <div class="card">
      <h3><i data-lucide="palette"></i> Warna Tema</h3>
      <div class="form-grid">
        ${field('Warna Biru', d.theme.colorBlue, "adminData.theme.colorBlue=this.value", 'color')}
        ${field('Warna Ungu Neon', d.theme.colorPurple, "adminData.theme.colorPurple=this.value", 'color')}
        <div class="form-field">
          <label>Mode Default</label>
          <select onchange="adminData.theme.mode=this.value">
            <option value="dark" ${d.theme.mode==='dark'?'selected':''}>Dark</option>
            <option value="light" ${d.theme.mode==='light'?'selected':''}>Light</option>
          </select>
        </div>
      </div>
    </div>
    <div class="card">
      <h3><i data-lucide="list-ordered"></i> Urutan & Visibilitas Section</h3>
      <div class="order-list" id="order-list"></div>
    </div>`;
  renderOrderList();
}

function renderOrderList(){
  const el = document.getElementById('order-list');
  el.innerHTML = adminData.sectionOrder.map((key,i) => `
    <div class="order-item">
      <i data-lucide="grip-vertical" class="grip"></i>
      <span>${key}</span>
      <label class="switch">
        <input type="checkbox" ${adminData.sectionVisibility[key]!==false?'checked':''} onchange="adminData.sectionVisibility['${key}']=this.checked">
        <span class="track"></span>
      </label>
      <div class="order-btns">
        <button onclick="moveSection(${i},-1)"><i data-lucide="chevron-up"></i></button>
        <button onclick="moveSection(${i},1)"><i data-lucide="chevron-down"></i></button>
      </div>
    </div>`).join('');
  if (window.lucide) lucide.createIcons();
}
function moveSection(i, dir){
  const arr = adminData.sectionOrder;
  const j = i+dir;
  if (j<0 || j>=arr.length) return;
  [arr[i],arr[j]] = [arr[j],arr[i]];
  renderOrderList();
}

/* ---------------------------------------------------------
   HERO
   --------------------------------------------------------- */
function renderHero(panel){
  const h = adminData.hero;
  panel.innerHTML = `
    <div class="card">
      <h3><i data-lucide="user-circle"></i> Konten Hero</h3>
      <div class="form-grid">
        ${field('Sapaan', h.greeting, "adminData.hero.greeting=this.value")}
        ${field('Nama Lengkap', h.name, "adminData.hero.name=this.value")}
        ${field('Path Foto Profil (PNG transparan)', h.photo, "adminData.hero.photo=this.value")}
        ${field('Path File CV', h.cvFile, "adminData.hero.cvFile=this.value")}
      </div>
      <div class="form-grid full" style="margin-top:14px;">
        ${textareaField('Deskripsi Singkat', h.description, "adminData.hero.description=this.value")}
        <div class="form-field">
          <label>Daftar Profesi (satu per baris, untuk efek mengetik)</label>
          <textarea oninput="adminData.hero.roles=this.value.split('\\n').map(s=>s.trim()).filter(Boolean)">${escapeHtml(h.roles.join('\n'))}</textarea>
        </div>
      </div>
    </div>`;
}

/* ---------------------------------------------------------
   ABOUT
   --------------------------------------------------------- */
let bioEntries = [];
function renderAbout(panel){
  const a = adminData.about;
  bioEntries = Object.entries(a.biodata).map(([k,v]) => ({k,v}));
  panel.innerHTML = `
    <div class="card">
      <h3><i data-lucide="id-card"></i> Konten Tentang Saya</h3>
      <div class="form-grid">
        ${field('Judul Section', a.heading, "adminData.about.heading=this.value")}
      </div>
      <div style="margin-top:14px;">${textareaField('Deskripsi', a.description, "adminData.about.description=this.value")}</div>
    </div>
    <div class="card">
      <h3><i data-lucide="table-properties"></i> Biodata</h3>
      <div id="bio-editor"></div>
      <button class="add-item-btn" onclick="addBio()"><i data-lucide="plus"></i> Tambah Data</button>
    </div>`;
  renderBioEditor();
}
function renderBioEditor(){
  const el = document.getElementById('bio-editor');
  el.innerHTML = bioEntries.map((e,i) => `
    <div class="item-editor">
      <div class="item-head"><span>Item ${i+1}</span><button class="remove-item" onclick="removeBio(${i})"><i data-lucide="trash-2"></i></button></div>
      <div class="form-grid">
        <div class="form-field"><label>Label</label><input value="${escapeAttr(e.k)}" oninput="bioEntries[${i}].k=this.value; syncBio();"></div>
        <div class="form-field"><label>Isi</label><input value="${escapeAttr(e.v)}" oninput="bioEntries[${i}].v=this.value; syncBio();"></div>
      </div>
    </div>`).join('');
  if (window.lucide) lucide.createIcons();
}
function syncBio(){ adminData.about.biodata = Object.fromEntries(bioEntries.map(e => [e.k, e.v])); }
function addBio(){ bioEntries.push({k:'Label Baru', v:''}); syncBio(); renderBioEditor(); }
function removeBio(i){ bioEntries.splice(i,1); syncBio(); renderBioEditor(); }

/* ---------------------------------------------------------
   SKILLS
   --------------------------------------------------------- */
function renderSkills(panel){
  panel.innerHTML = `
    <div class="card">
      <h3><i data-lucide="gauge"></i> Judul Section</h3>
      ${field('Judul', adminData.skills.heading, "adminData.skills.heading=this.value")}
    </div>
    <div class="card">
      <h3><i data-lucide="list"></i> Daftar Skill</h3>
      <p class="tags-input-hint">Nama ikon memakai daftar ikon Lucide (contoh: code-2, database, brain-circuit) — lihat lucide.dev/icons.</p>
      <div id="skills-editor" style="margin-top:12px;"></div>
      <button class="add-item-btn" onclick="addSkill()"><i data-lucide="plus"></i> Tambah Skill</button>
    </div>`;
  renderSkillsEditor();
}
function renderSkillsEditor(){
  const el = document.getElementById('skills-editor');
  const arr = adminData.skills.categories;
  el.innerHTML = arr.map((s,i) => `
    <div class="item-editor">
      <div class="item-head"><span>Skill ${i+1}</span><button class="remove-item" onclick="removeSkill(${i})"><i data-lucide="trash-2"></i></button></div>
      <div class="form-grid">
        <div class="form-field"><label>Nama</label><input value="${escapeAttr(s.name)}" oninput="adminData.skills.categories[${i}].name=this.value"></div>
        <div class="form-field"><label>Ikon (lucide)</label><input value="${escapeAttr(s.icon)}" oninput="adminData.skills.categories[${i}].icon=this.value"></div>
        <div class="form-field" style="grid-column:1/-1;">
          <label>Level: <span id="lvl-${i}">${s.level}</span>%</label>
          <input type="range" min="0" max="100" value="${s.level}" oninput="adminData.skills.categories[${i}].level=+this.value; document.getElementById('lvl-${i}').textContent=this.value;">
        </div>
      </div>
    </div>`).join('');
  if (window.lucide) lucide.createIcons();
}
function addSkill(){ adminData.skills.categories.push({name:'Skill Baru', icon:'sparkles', level:50}); renderSkillsEditor(); }
function removeSkill(i){ adminData.skills.categories.splice(i,1); renderSkillsEditor(); }

/* ---------------------------------------------------------
   EDUCATION
   --------------------------------------------------------- */
function renderEducation(panel){
  panel.innerHTML = `
    <div class="card">
      <h3><i data-lucide="graduation-cap"></i> Judul Section</h3>
      ${field('Judul', adminData.education.heading, "adminData.education.heading=this.value")}
    </div>
    <div class="card">
      <h3><i data-lucide="list"></i> Riwayat Pendidikan</h3>
      <div id="edu-editor"></div>
      <button class="add-item-btn" onclick="addEdu()"><i data-lucide="plus"></i> Tambah Riwayat</button>
    </div>`;
  renderEduEditor();
}
function renderEduEditor(){
  const el = document.getElementById('edu-editor');
  const arr = adminData.education.items;
  el.innerHTML = arr.map((e,i) => `
    <div class="item-editor">
      <div class="item-head"><span>Riwayat ${i+1}</span><button class="remove-item" onclick="removeEdu(${i})"><i data-lucide="trash-2"></i></button></div>
      <div class="form-grid">
        <div class="form-field"><label>Periode</label><input value="${escapeAttr(e.period)}" oninput="adminData.education.items[${i}].period=this.value"></div>
        <div class="form-field"><label>Judul</label><input value="${escapeAttr(e.title)}" oninput="adminData.education.items[${i}].title=this.value"></div>
        <div class="form-field"><label>Tempat</label><input value="${escapeAttr(e.place)}" oninput="adminData.education.items[${i}].place=this.value"></div>
      </div>
      <div style="margin-top:10px;"><div class="form-field"><label>Deskripsi</label><textarea oninput="adminData.education.items[${i}].desc=this.value">${escapeHtml(e.desc)}</textarea></div></div>
    </div>`).join('');
  if (window.lucide) lucide.createIcons();
}
function addEdu(){ adminData.education.items.push({period:'2024 — 2025', title:'Judul', place:'Institusi', desc:''}); renderEduEditor(); }
function removeEdu(i){ adminData.education.items.splice(i,1); renderEduEditor(); }

/* ---------------------------------------------------------
   EXPERIENCE / PROJECTS
   --------------------------------------------------------- */
function renderExperience(panel){
  panel.innerHTML = `
    <div class="card">
      <h3><i data-lucide="briefcase"></i> Judul Section</h3>
      ${field('Judul', adminData.experience.heading, "adminData.experience.heading=this.value")}
    </div>
    <div class="card">
      <h3><i data-lucide="list"></i> Daftar Proyek</h3>
      <div id="exp-editor"></div>
      <button class="add-item-btn" onclick="addExp()"><i data-lucide="plus"></i> Tambah Proyek</button>
    </div>`;
  renderExpEditor();
}
function renderExpEditor(){
  const el = document.getElementById('exp-editor');
  const arr = adminData.experience.items;
  el.innerHTML = arr.map((p,i) => `
    <div class="item-editor">
      <div class="item-head"><span>Proyek ${i+1}</span><button class="remove-item" onclick="removeExp(${i})"><i data-lucide="trash-2"></i></button></div>
      <div class="form-grid">
        <div class="form-field"><label>Judul</label><input value="${escapeAttr(p.title)}" oninput="adminData.experience.items[${i}].title=this.value"></div>
        <div class="form-field"><label>Status</label><input value="${escapeAttr(p.status)}" oninput="adminData.experience.items[${i}].status=this.value"></div>
        <div class="form-field"><label>Path Thumbnail</label><input value="${escapeAttr(p.thumbnail)}" oninput="adminData.experience.items[${i}].thumbnail=this.value"></div>
        <div class="form-field"><label>Teknologi (pisahkan koma)</label><input value="${escapeAttr(p.tech.join(', '))}" oninput="adminData.experience.items[${i}].tech=this.value.split(',').map(s=>s.trim()).filter(Boolean)"></div>
        <div class="form-field"><label>Link Demo</label><input value="${escapeAttr(p.demo)}" oninput="adminData.experience.items[${i}].demo=this.value"></div>
        <div class="form-field"><label>Link GitHub</label><input value="${escapeAttr(p.github)}" oninput="adminData.experience.items[${i}].github=this.value"></div>
      </div>
      <div style="margin-top:10px;"><div class="form-field"><label>Deskripsi</label><textarea oninput="adminData.experience.items[${i}].description=this.value">${escapeHtml(p.description)}</textarea></div></div>
    </div>`).join('');
  if (window.lucide) lucide.createIcons();
}
function addExp(){ adminData.experience.items.push({title:'Proyek Baru', thumbnail:'projects/new.jpg', description:'', tech:[], status:'Dalam Pengembangan', demo:'#', github:'#'}); renderExpEditor(); }
function removeExp(i){ adminData.experience.items.splice(i,1); renderExpEditor(); }

/* ---------------------------------------------------------
   CERTIFICATES
   --------------------------------------------------------- */
function renderCertificate(panel){
  panel.innerHTML = `
    <div class="card">
      <h3><i data-lucide="award"></i> Judul Section</h3>
      ${field('Judul', adminData.certificate.heading, "adminData.certificate.heading=this.value")}
    </div>
    <div class="card">
      <h3><i data-lucide="list"></i> Daftar Sertifikat</h3>
      <div id="cert-editor"></div>
      <button class="add-item-btn" onclick="addCert()"><i data-lucide="plus"></i> Tambah Sertifikat</button>
    </div>`;
  renderCertEditor();
}
function renderCertEditor(){
  const el = document.getElementById('cert-editor');
  const arr = adminData.certificate.items;
  el.innerHTML = arr.map((c,i) => `
    <div class="item-editor">
      <div class="item-head"><span>Sertifikat ${i+1}</span><button class="remove-item" onclick="removeCert(${i})"><i data-lucide="trash-2"></i></button></div>
      <div class="form-grid">
        <div class="form-field"><label>Judul</label><input value="${escapeAttr(c.title)}" oninput="adminData.certificate.items[${i}].title=this.value"></div>
        <div class="form-field"><label>Penyelenggara</label><input value="${escapeAttr(c.issuer)}" oninput="adminData.certificate.items[${i}].issuer=this.value"></div>
        <div class="form-field" style="grid-column:1/-1;"><label>Path Gambar</label><input value="${escapeAttr(c.image)}" oninput="adminData.certificate.items[${i}].image=this.value"></div>
      </div>
    </div>`).join('');
  if (window.lucide) lucide.createIcons();
}
function addCert(){ adminData.certificate.items.push({title:'Sertifikat Baru', issuer:'Penyelenggara', image:'certificates/new.jpg'}); renderCertEditor(); }
function removeCert(i){ adminData.certificate.items.splice(i,1); renderCertEditor(); }

/* ---------------------------------------------------------
   GALLERY
   --------------------------------------------------------- */
function renderGallery(panel){
  panel.innerHTML = `
    <div class="card">
      <h3><i data-lucide="images"></i> Judul Section</h3>
      ${field('Judul', adminData.gallery.heading, "adminData.gallery.heading=this.value")}
    </div>
    <div class="card">
      <h3><i data-lucide="list"></i> Daftar Foto</h3>
      <div id="gal-editor"></div>
      <button class="add-item-btn" onclick="addGal()"><i data-lucide="plus"></i> Tambah Foto</button>
    </div>`;
  renderGalEditor();
}
function renderGalEditor(){
  const el = document.getElementById('gal-editor');
  const arr = adminData.gallery.items;
  el.innerHTML = arr.map((g,i) => `
    <div class="item-editor">
      <div class="item-head"><span>Foto ${i+1}</span><button class="remove-item" onclick="removeGal(${i})"><i data-lucide="trash-2"></i></button></div>
      <div class="form-grid">
        <div class="form-field"><label>Path Gambar</label><input value="${escapeAttr(g.image)}" oninput="adminData.gallery.items[${i}].image=this.value"></div>
        <div class="form-field"><label>Keterangan</label><input value="${escapeAttr(g.caption)}" oninput="adminData.gallery.items[${i}].caption=this.value"></div>
      </div>
    </div>`).join('');
  if (window.lucide) lucide.createIcons();
}
function addGal(){ adminData.gallery.items.push({image:'gallery/new.jpg', caption:'Momen Baru'}); renderGalEditor(); }
function removeGal(i){ adminData.gallery.items.splice(i,1); renderGalEditor(); }

/* ---------------------------------------------------------
   CONTACT
   --------------------------------------------------------- */
function renderContact(panel){
  const c = adminData.contact;
  panel.innerHTML = `
    <div class="card">
      <h3><i data-lucide="phone"></i> Konten Kontak</h3>
      <div class="form-grid">
        ${field('Judul Section', c.heading, "adminData.contact.heading=this.value")}
        ${field('Email', c.email, "adminData.contact.email=this.value")}
        ${field('Nomor WhatsApp (format 62xxxx)', c.whatsapp, "adminData.contact.whatsapp=this.value")}
      </div>
      <div style="margin-top:14px;">${textareaField('Deskripsi', c.description, "adminData.contact.description=this.value")}</div>
      <div style="margin-top:14px;">${textareaField('Link Embed Google Maps', c.mapEmbed, "adminData.contact.mapEmbed=this.value")}</div>
    </div>
    <div class="card">
      <h3><i data-lucide="share-2"></i> Media Sosial</h3>
      <div class="form-grid">
        ${field('GitHub', c.social.github, "adminData.contact.social.github=this.value")}
        ${field('LinkedIn', c.social.linkedin, "adminData.contact.social.linkedin=this.value")}
        ${field('Instagram', c.social.instagram, "adminData.contact.social.instagram=this.value")}
      </div>
    </div>`;
}

/* ---------------------------------------------------------
   FOOTER & STATS
   --------------------------------------------------------- */
function renderFooter(panel){
  const f = adminData.footer, s = adminData.stats;
  panel.innerHTML = `
    <div class="card">
      <h3><i data-lucide="align-end-horizontal"></i> Footer</h3>
      ${textareaField('Teks Footer', f.text, "adminData.footer.text=this.value")}
    </div>
    <div class="card">
      <h3><i data-lucide="bar-chart-3"></i> Statistik (dummy)</h3>
      <div class="form-grid">
        ${field('Jumlah Pengunjung', s.visitors, "adminData.stats.visitors=+this.value", 'number')}
        ${field('Jumlah Proyek', s.projects, "adminData.stats.projects=+this.value", 'number')}
        ${field('Tahun Pengalaman', s.experienceYears, "adminData.stats.experienceYears=+this.value", 'number')}
        ${field('Cangkir Kopi', s.cupsOfCoffee, "adminData.stats.cupsOfCoffee=+this.value", 'number')}
      </div>
    </div>`;
}

/* ---------------------------------------------------------
   ACCOUNT
   --------------------------------------------------------- */
function renderAccount(panel){
  const a = adminData.admin;
  panel.innerHTML = `
    <div class="card">
      <h3><i data-lucide="lock"></i> Ubah Kredensial Login</h3>
      <div class="form-grid">
        ${field('Username', a.username, "adminData.admin.username=this.value")}
        ${field('Password', a.password, "adminData.admin.password=this.value", 'text')}
      </div>
      <p class="tags-input-hint" style="margin-top:10px;">Jangan lupa tekan "Simpan Perubahan" agar kredensial baru aktif.</p>
    </div>`;
}

const RENDERERS = {
  overview:renderOverview, site:renderSite, hero:renderHero, about:renderAbout,
  skills:renderSkills, education:renderEducation, experience:renderExperience,
  certificate:renderCertificate, gallery:renderGallery, contact:renderContact,
  footer:renderFooter, account:renderAccount
};

/* ---------------------------------------------------------
   SAVE / RESET / EXPORT / IMPORT
   --------------------------------------------------------- */
document.getElementById('save-btn')?.addEventListener('click', () => {
  persist(adminData);
  const toast = document.getElementById('save-toast');
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 2600);
});

document.getElementById('reset-btn')?.addEventListener('click', () => {
  if (!confirm('Reset seluruh konten ke data default? Perubahan yang belum disimpan akan hilang.')) return;
  adminData = structuredClone(window.DEFAULT_DATA);
  persist(adminData);
  renderTab(currentTab);
});

document.getElementById('export-btn')?.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(adminData, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'data.json'; a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('import-input')?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      adminData = JSON.parse(reader.result);
      persist(adminData);
      renderTab(currentTab);
      alert('Data berhasil diimpor.');
    }catch(err){ alert('File JSON tidak valid.'); }
  };
  reader.readAsText(file);
  e.target.value = '';
});

/* ---------------------------------------------------------
   PARTICLES (shared light background, same as main.js)
   --------------------------------------------------------- */
function initParticles(){
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,particles=[];
  function resize(){ w=canvas.width=innerWidth; h=canvas.height=innerHeight; }
  resize(); addEventListener('resize', resize);
  for (let i=0;i<40;i++){
    particles.push({ x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.4+.4, vx:(Math.random()-.5)*.2, vy:(Math.random()-.5)*.2 });
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x<0) p.x=w; if (p.x>w) p.x=0; if (p.y<0) p.y=h; if (p.y>h) p.y=0;
      ctx.beginPath(); ctx.fillStyle='rgba(79,124,255,.5)'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initParticles();
  if (window.lucide) lucide.createIcons();
  if (sessionStorage.getItem(SESSION_KEY) === '1') enterDashboard();
});
