const App = {
    currentUser: null, messId: null, messCode: null, messName: null,
    currentPage: 'dashboard', allMembers: {},
    mealDate: new Date(), bazarDate: new Date(), expenseMonth: new Date(),
    reportDate: new Date(), reportMonth: new Date(), monthlyDate: new Date(),

    init() {
        if (typeof firebaseConfig === 'undefined' || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY_HERE') {
            this.showScreen('auth-screen');
            document.querySelector('.auth-container').innerHTML = '<div class="auth-header"><div class="auth-logo"><span class="material-icons-round">warning</span></div><h1>Firebase Setup Required</h1><p style="margin-top:12px">Edit <code>firebase-config.js</code></p></div>';
            return;
        }
        this.bindEvents();
        this.populateYearSelects();
        auth.onAuthStateChanged(user => {
            if (user) {
                this.currentUser = user;
                this.loadMyMesses();
            } else {
                this.currentUser = null;
                this.messId = null;
                this.showScreen('auth-screen');
            }
        });
    },

    populateYearSelects() {
        const now = new Date();
        let opts = '';
        for (let y = now.getFullYear(); y >= now.getFullYear() - 5; y--) opts += `<option value="${y}">${y}</option>`;
        ['report-year-select', 'monthly-year-select'].forEach(id => {
            const el = document.getElementById(id); if (el) el.innerHTML = opts;
        });
    },

    bindEvents() {
        const $ = id => document.getElementById(id);
        $('login-btn').addEventListener('click', () => this.emailLogin());
        $('google-login').addEventListener('click', () => this.googleLogin());
        $('show-register').addEventListener('click', () => { document.querySelector('#auth-screen .auth-card').style.display = 'none'; $('register-card').style.display = 'block'; });
        $('back-to-login').addEventListener('click', () => { $('register-card').style.display = 'none'; document.querySelector('#auth-screen .auth-card').style.display = 'block'; });
        $('register-btn').addEventListener('click', () => this.emailRegister());
        $('forgot-password-link').addEventListener('click', () => this.showScreen('forgot-screen'));
        $('forgot-back-login').addEventListener('click', () => this.showScreen('auth-screen'));
        $('send-reset-btn').addEventListener('click', () => this.sendResetEmail());
        $('create-mess-btn').addEventListener('click', () => this.createMess());
        $('join-mess-btn').addEventListener('click', () => this.joinMess());
        $('logout-from-setup').addEventListener('click', () => auth.signOut());
        $('menu-toggle').addEventListener('click', () => this.toggleSidebar());
        $('sidebar-overlay').addEventListener('click', () => this.closeSidebar());
        document.querySelectorAll('.nav-item[data-page]').forEach(i => i.addEventListener('click', e => { e.preventDefault(); this.navigate(i.dataset.page); }));
        $('switch-mess-btn').addEventListener('click', e => { e.preventDefault(); this.showScreen('mess-select-screen'); this.loadMyMesses(); this.closeSidebar(); });
        $('logout-btn').addEventListener('click', e => { e.preventDefault(); auth.signOut(); });
        $('user-avatar').addEventListener('click', () => this.navigate('dashboard'));
        $('copy-mess-code').addEventListener('click', () => { if (this.messCode) navigator.clipboard.writeText(this.messCode).then(() => this.toast('Copied!', 'info')); });
        $('add-member-btn').addEventListener('click', () => this.showMemberModal());
        $('add-meal-btn').addEventListener('click', () => this.showMealModal());
        $('bulk-meal-btn').addEventListener('click', () => this.showBulkMealModal());
        $('add-bazar-btn').addEventListener('click', () => this.showBazarModal());
        $('add-expense-btn').addEventListener('click', () => this.showExpenseModal());
        $('add-deposit-btn').addEventListener('click', () => this.showDepositModal());
        $('add-notice-btn').addEventListener('click', () => this.showNoticeModal());
        $('modal-close').addEventListener('click', () => this.closeModal());
        $('modal-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) this.closeModal(); });
        $('meal-prev-day').addEventListener('click', () => { this.mealDate.setDate(this.mealDate.getDate() - 1); this.loadMeals(); });
        $('meal-next-day').addEventListener('click', () => { this.mealDate.setDate(this.mealDate.getDate() + 1); this.loadMeals(); });
        $('bazar-prev-day').addEventListener('click', () => { this.bazarDate.setDate(this.bazarDate.getDate() - 1); this.loadBazaar(); });
        $('bazar-next-day').addEventListener('click', () => { this.bazarDate.setDate(this.bazarDate.getDate() + 1); this.loadBazaar(); });
        $('expense-prev-month').addEventListener('click', () => { this.expenseMonth.setMonth(this.expenseMonth.getMonth() - 1); this.loadExpenses(); });
        $('expense-next-month').addEventListener('click', () => { this.expenseMonth.setMonth(this.expenseMonth.getMonth() + 1); this.loadExpenses(); });
        $('report-prev-day').addEventListener('click', () => { this.reportDate.setDate(this.reportDate.getDate() - 1); this.loadDailyReport(); });
        $('report-next-day').addEventListener('click', () => { this.reportDate.setDate(this.reportDate.getDate() + 1); this.loadDailyReport(); });
        $('report-prev-month').addEventListener('click', () => { this.reportMonth.setMonth(this.reportMonth.getMonth() - 1); $('report-year-select').value = this.reportMonth.getFullYear(); this.loadMonthlyReport(); });
        $('report-next-month').addEventListener('click', () => { this.reportMonth.setMonth(this.reportMonth.getMonth() + 1); $('report-year-select').value = this.reportMonth.getFullYear(); this.loadMonthlyReport(); });
        $('report-year-select').addEventListener('change', e => { this.reportMonth.setFullYear(+e.target.value); this.loadMonthlyReport(); });
        $('monthly-prev').addEventListener('click', () => { this.monthlyDate.setMonth(this.monthlyDate.getMonth() - 1); $('monthly-year-select').value = this.monthlyDate.getFullYear(); this.loadMonthlyOverview(); });
        $('monthly-next').addEventListener('click', () => { this.monthlyDate.setMonth(this.monthlyDate.getMonth() + 1); $('monthly-year-select').value = this.monthlyDate.getFullYear(); this.loadMonthlyOverview(); });
        $('monthly-year-select').addEventListener('change', e => { this.monthlyDate.setFullYear(+e.target.value); this.loadMonthlyOverview(); });
        $('export-daily-pdf').addEventListener('click', () => this.exportPDF('daily'));
        $('export-monthly-pdf').addEventListener('click', () => this.exportPDF('monthly'));
    },

    showScreen(id) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id).classList.add('active'); },

    async emailLogin() {
        const email = document.getElementById('login-email').value.trim(), pass = document.getElementById('login-password').value;
        if (!email || !pass) { this.toast('Fill all fields', 'error'); return; }
        const btn = document.getElementById('login-btn'); btn.textContent = 'Logging in...'; btn.disabled = true;
        try { await auth.signInWithEmailAndPassword(email, pass); }
        catch (e) { let m = e.message; if (e.code === 'auth/invalid-credential') m = 'Invalid email or password'; this.toast(m, 'error'); }
        finally { btn.textContent = 'Login'; btn.disabled = false; }
    },

    async emailRegister() {
        const name = document.getElementById('reg-name').value.trim(), email = document.getElementById('reg-email').value.trim(), phone = document.getElementById('reg-phone').value.trim(), pass = document.getElementById('reg-password').value;
        if (!name || !email || !pass) { this.toast('Fill name, email, password', 'error'); return; }
        if (pass.length < 6) { this.toast('Password min 6 chars', 'error'); return; }
        const btn = document.getElementById('register-btn'); btn.textContent = 'Creating...'; btn.disabled = true;
        try {
            const c = await auth.createUserWithEmailAndPassword(email, pass);
            await c.user.updateProfile({ displayName: name });
            await db.ref(`users/${c.user.uid}`).set({ name, email, phone, createdAt: Date.now() });
        }
        catch (e) { let m = e.message; if (e.code === 'auth/email-already-in-use') m = 'Already registered'; this.toast(m, 'error'); }
        finally { btn.textContent = 'Create Account'; btn.disabled = false; }
    },

    async googleLogin() {
        const btn = document.getElementById('google-login'); const orig = btn.innerHTML;
        btn.innerHTML = '<span class="material-icons-round" style="animation:spin 1s linear infinite">refresh</span> Connecting...'; btn.disabled = true;
        try {
            const p = new firebase.auth.GoogleAuthProvider();
            const c = await auth.signInWithPopup(p);
            const s = await db.ref(`users/${c.user.uid}`).once('value');
            if (!s.exists()) await db.ref(`users/${c.user.uid}`).set({ name: c.user.displayName, email: c.user.email, createdAt: Date.now() });
        }
        catch (e) { let m = e.message; if (e.code === 'auth/popup-closed-by-user') m = 'Cancelled'; this.toast(m, 'error'); }
        finally { btn.innerHTML = orig; btn.disabled = false; }
    },

    async sendResetEmail() {
        const email = document.getElementById('reset-email').value.trim();
        if (!email) { this.toast('Enter email', 'error'); return; }
        try { await auth.sendPasswordResetEmail(email); this.toast('Reset link sent!', 'success'); setTimeout(() => this.showScreen('auth-screen'), 2000); }
        catch (e) { this.toast(e.message, 'error'); }
    },

    async loadMyMesses() {
        if (!this.currentUser) return;
        this.showScreen('mess-select-screen');
        try {
            const snap = await db.ref(`users/${this.currentUser.uid}/messes`).once('value');
            const data = snap.val() || {};
            const ids = Object.keys(data);
            const div = document.getElementById('my-messes-list');
            if (!ids.length) { div.innerHTML = '<div class="card-body"><p class="empty-state">No messes yet. Create or join one below.</p></div>'; return; }
            let html = '<div class="card-body">';
            for (const mid of ids) {
                const ms = await db.ref(`messes/${mid}/settings`).once('value');
                const s = ms.val() || {};
                html += `<div class="mess-item" onclick="App.enterMess('${mid}')">
                    <div class="mess-item-icon"><span class="material-icons-round">home</span></div>
                    <div class="mess-item-info"><h4>${this.esc(s.messName || 'Unnamed')}</h4><p>${data[mid].role || 'member'} | ${s.messCode || ''}</p></div>
                    <span class="material-icons-round" style="color:var(--text-secondary)">chevron_right</span>
                </div>`;
            }
            div.innerHTML = html + '</div>';
        } catch (e) {
            console.error('loadMyMesses error:', e);
            document.getElementById('my-messes-list').innerHTML = '<div class="card-body"><p class="empty-state">Error loading messes. Check connection.</p></div>';
        }
    },

    enterMess(mid) {
        this.messId = mid;
        this.messCode = null;
        db.ref(`messes/${mid}/settings`).once('value').then(s => {
            const v = s.val() || {};
            this.messCode = v.messCode;
            this.messName = v.messName;
            this.showApp();
        }).catch(e => { console.error('enterMess error:', e); this.toast('Error loading mess', 'error'); });
    },

    async createMess() {
        const name = document.getElementById('create-mess-name').value.trim();
        if (!name) { this.toast('Enter mess name', 'error'); return; }
        const btn = document.getElementById('create-mess-btn');
        btn.textContent = 'Creating...'; btn.disabled = true;
        try {
            const code = this.genCode(6);
            const ref = db.ref('messes').push();
            await ref.set({
                settings: { messName: name, messCode: code, owner: this.currentUser.uid, createdAt: Date.now() },
                members: { [this.currentUser.uid]: { name: this.currentUser.displayName || 'Admin', email: this.currentUser.email, role: 'admin', joinedAt: Date.now() } }
            });
            await db.ref(`users/${this.currentUser.uid}/messes/${ref.key}`).set({ role: 'admin', joinedAt: Date.now() });
            this.toast('Mess created!', 'success');
            document.getElementById('create-mess-name').value = '';
            this.enterMess(ref.key);
        } catch (e) {
            console.error('createMess error:', e);
            this.toast('Error: ' + e.message, 'error');
        } finally { btn.textContent = 'Create Mess'; btn.disabled = false; }
    },

    async joinMess() {
        const code = document.getElementById('join-mess-code').value.trim().toUpperCase();
        if (!code || code.length !== 6) { this.toast('Enter 6-digit code', 'error'); return; }
        const btn = document.getElementById('join-mess-btn');
        btn.textContent = 'Joining...'; btn.disabled = true;
        try {
            const snap = await db.ref('messes').orderByChild('settings/messCode').equalTo(code).once('value');
            if (!snap.exists()) { this.toast('Mess not found', 'error'); btn.textContent = 'Join Mess'; btn.disabled = false; return; }
            let mid = null; snap.forEach(s => { mid = s.key; });
            await db.ref(`messes/${mid}/members/${this.currentUser.uid}`).set({ name: this.currentUser.displayName || 'Member', email: this.currentUser.email, role: 'member', joinedAt: Date.now() });
            await db.ref(`users/${this.currentUser.uid}/messes/${mid}`).set({ role: 'member', joinedAt: Date.now() });
            this.toast('Joined!', 'success');
            document.getElementById('join-mess-code').value = '';
            this.enterMess(mid);
        } catch (e) {
            console.error('joinMess error:', e);
            this.toast('Error: ' + e.message, 'error');
        } finally { btn.textContent = 'Join Mess'; btn.disabled = false; }
    },

    genCode(n) { const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let r = ''; for (let i = 0; i < n; i++) r += c[Math.floor(Math.random() * c.length)]; return r; },

    showApp() {
        this.showScreen('app-screen');
        document.getElementById('sidebar-name').textContent = this.currentUser.displayName || 'User';
        document.getElementById('sidebar-email').textContent = this.currentUser.email || '';
        document.getElementById('sidebar-mess-code').textContent = this.messCode || '------';
        document.getElementById('topbar-mess-label').textContent = this.messName || 'Switch mess';
        this.loadDashboard();
    },

    toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); document.getElementById('sidebar-overlay').classList.toggle('active'); },
    closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').classList.remove('active'); },

    navigate(page) {
        this.currentPage = page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-' + page).classList.add('active');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const ni = document.querySelector(`.nav-item[data-page="${page}"]`); if (ni) ni.classList.add('active');
        document.getElementById('page-title').textContent = page.charAt(0).toUpperCase() + page.slice(1);
        this.closeSidebar();
        const loaders = { dashboard: () => this.loadDashboard(), members: () => this.loadMembers(), meals: () => this.loadMeals(), bazaar: () => this.loadBazaar(), expenses: () => this.loadExpenses(), balance: () => this.loadBalance(), notices: () => this.loadNotices(), reports: () => { this.loadDailyReport(); this.loadMonthlyReport(); }, monthly: () => this.loadMonthlyOverview() };
        if (loaders[page]) loaders[page]();
    },

    async loadDashboard() {
        if (!this.messId) return;
        const today = this.dk(new Date()), month = this.mk(new Date());
        const ms = await db.ref(`messes/${this.messId}/members`).once('value');
        document.getElementById('stat-members').textContent = ms.numChildren();
        const ml = await db.ref(`messes/${this.messId}/meals/${today}`).once('value');
        let tm = 0; ml.forEach(s => { const v = s.val(); tm += (v.breakfast || 0) + (v.lunch || 0) + (v.dinner || 0); });
        document.getElementById('stat-today-meals').textContent = tm;
        const bz = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let mb = 0; bz.forEach(s => { mb += s.val().amount || 0; }); document.getElementById('stat-month-bazar').textContent = '\u09F3' + mb;
        const ex = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let me = 0; ex.forEach(s => { me += s.val().amount || 0; }); document.getElementById('stat-month-expense').textContent = '\u09F3' + me;
        const ac = await db.ref(`messes/${this.messId}/activity`).orderByChild('ts').limitToLast(10).once('value');
        const ad = document.getElementById('recent-activity');
        if (ac.exists()) { let h = ''; ac.forEach(s => { const a = s.val(); h += `<div class="item-card"><div class="item-card-header"><h4>${this.esc(a.text || '')}</h4></div><div class="item-card-details"><span>${this.timeAgo(a.ts)}</span></div></div>`; }); ad.innerHTML = h; } else ad.innerHTML = '<p class="empty-state">No recent activity</p>';
    },

    async loadMembers() {
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        this.allMembers = snap.val() || {};
        document.getElementById('member-count').textContent = `(${Object.keys(this.allMembers).length}/30)`;
        this.renderMembers(this.allMembers);
    },

    filterMembers() {
        const q = document.getElementById('member-search').value.toLowerCase();
        const filtered = Object.fromEntries(Object.entries(this.allMembers).filter(([, m]) => (m.name || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q)));
        this.renderMembers(filtered);
    },

    renderMembers(members) {
        const div = document.getElementById('members-list');
        const ids = Object.keys(members);
        if (!ids.length) { div.innerHTML = '<p class="empty-state">No members</p>'; return; }
        let html = '';
        ids.forEach(id => { const m = members[id]; const init = (m.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            html += `<div class="member-item"><div class="member-avatar">${init}</div><div class="member-info"><h4>${this.esc(m.name)}</h4><p>${this.esc(m.email || '')} | ${m.role || 'member'}</p></div><div class="member-actions"><button class="icon-btn" onclick="App.editMember('${id}')"><span class="material-icons-round">edit</span></button><button class="icon-btn" onclick="App.deleteMember('${id}')"><span class="material-icons-round">delete</span></button></div></div>`;
        });
        div.innerHTML = html;
    },

    showMemberModal(id = null, data = null) {
        if (!id && Object.keys(this.allMembers).length >= 30) { this.toast('Max 30 members per mess', 'error'); return; }
        document.getElementById('modal-title').textContent = id ? 'Edit Member' : 'Add Member';
        document.getElementById('modal-body').innerHTML = `<div class="form-group"><label>Name</label><input id="m-name" value="${data?.name || ''}"></div><div class="form-group"><label>Email</label><input id="m-email" value="${data?.email || ''}"></div><div class="form-group"><label>Phone</label><input id="m-phone" value="${data?.phone || ''}"></div><div class="form-group"><label>Role</label><select id="m-role"><option value="member" ${data?.role !== 'admin' ? 'selected' : ''}>Member</option><option value="admin" ${data?.role === 'admin' ? 'selected' : ''}>Admin</option><option value="cook" ${data?.role === 'cook' ? 'selected' : ''}>Cook</option></select></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveMember('${id || ''}')">${id ? 'Update' : 'Add'}</button>`;
        this.openModal();
    },

    async saveMember(id) {
        const data = { name: document.getElementById('m-name').value.trim(), email: document.getElementById('m-email').value.trim(), phone: document.getElementById('m-phone').value.trim(), role: document.getElementById('m-role').value, updatedAt: Date.now() };
        if (!data.name) { this.toast('Name required', 'error'); return; }
        if (id) await db.ref(`messes/${this.messId}/members/${id}`).update(data);
        else { data.createdAt = Date.now(); await db.ref(`messes/${this.messId}/members`).push(data); }
        this.closeModal(); this.loadMembers(); this.toast('Saved', 'success');
    },

    async editMember(id) { this.showMemberModal(id, this.allMembers[id]); },
    async deleteMember(id) { if (!confirm('Delete?')) return; await db.ref(`messes/${this.messId}/members/${id}`).remove(); this.loadMembers(); },

    async loadMeals() {
        const key = this.dk(this.mealDate); document.getElementById('meal-date-label').textContent = this.fmtDate(this.mealDate);
        const mbrs = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = mbrs.val() || {};
        const mlSnap = await db.ref(`messes/${this.messId}/meals/${key}`).once('value');
        const meals = mlSnap.val() || {};
        const div = document.getElementById('meals-list'); const mids = Object.keys(members);
        if (!mids.length) { div.innerHTML = '<p class="empty-state">Add members first</p>'; return; }
        let html = '', totalToday = 0;
        mids.forEach(mid => { const m = members[mid], ml = meals[mid] || {}; const t = (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); totalToday += t;
            html += `<div class="item-card"><div class="item-card-header"><h4>${this.esc(m.name)}</h4><span class="amount">${t}</span></div><div class="item-card-details"><span>B:${ml.breakfast || 0} L:${ml.lunch || 0} D:${ml.dinner || 0}</span></div><div class="item-card-actions"><button class="icon-btn" onclick="App.editMeal('${mid}','${key}')"><span class="material-icons-round">edit</span></button></div></div>`;
        });
        div.innerHTML = html; document.getElementById('meal-total-today').textContent = totalToday;
        const month = this.mk(this.mealDate); let totalMonth = 0;
        const ms = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-31').once('value');
        ms.forEach(d => { Object.values(d.val() || {}).forEach(ml => { totalMonth += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); }); });
        document.getElementById('meal-total-month').textContent = totalMonth;
    },

    showMealModal(mid = null, dk = null, data = null) {
        document.getElementById('modal-title').textContent = data ? 'Edit Meal' : 'Add Meal';
        db.ref(`messes/${this.messId}/members`).once('value').then(snap => {
            const m = snap.val() || {}; let opts = '<option value="">Select</option>';
            Object.entries(m).forEach(([id, v]) => { opts += `<option value="${id}" ${id === mid ? 'selected' : ''}>${v.name}</option>`; });
            document.getElementById('modal-body').innerHTML = `<div class="form-group"><label>Member</label><select id="ml-member">${opts}</select></div><div class="form-group"><label>Breakfast</label><input type="number" id="ml-b" min="0" value="${data?.breakfast || 0}"></div><div class="form-group"><label>Lunch</label><input type="number" id="ml-l" min="0" value="${data?.lunch || 0}"></div><div class="form-group"><label>Dinner</label><input type="number" id="ml-d" min="0" value="${data?.dinner || 0}"></div>`;
            document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveMeal('${dk || this.dk(this.mealDate)}')">Save</button>`;
            this.openModal();
        });
    },

    showBulkMealModal() {
        document.getElementById('modal-title').textContent = 'Bulk Meal Entry';
        db.ref(`messes/${this.messId}/members`).once('value').then(snap => {
            const m = snap.val() || {}; const mids = Object.keys(m);
            if (!mids.length) { this.toast('No members', 'error'); return; }
            let rows = '';
            mids.forEach(id => { const v = m[id]; rows += `<div class="bulk-row" data-mid="${id}"><span style="min-width:100px;font-size:13px">${this.esc(v.name)}</span><input type="number" min="0" value="0" class="bulk-b" style="width:50px" placeholder="B"><input type="number" min="0" value="0" class="bulk-l" style="width:50px" placeholder="L"><input type="number" min="0" value="0" class="bulk-d" style="width:50px" placeholder="D"></div>`; });
            document.getElementById('modal-body').innerHTML = `<p style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">B=Breakfast, L=Lunch, D=Dinner</p><div style="max-height:400px;overflow-y:auto">${rows}</div>`;
            document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveBulkMeals()">Save All</button>`;
            this.openModal();
        });
    },

    async saveBulkMeals() {
        const dk = this.dk(this.mealDate);
        const rows = document.querySelectorAll('.bulk-row');
        const updates = {};
        rows.forEach(row => {
            const mid = row.dataset.mid;
            updates[`messes/${this.messId}/meals/${dk}/${mid}`] = {
                breakfast: +row.querySelector('.bulk-b').value || 0,
                lunch: +row.querySelector('.bulk-l').value || 0,
                dinner: +row.querySelector('.bulk-d').value || 0,
                updatedAt: Date.now()
            };
        });
        await db.ref().update(updates);
        this.closeModal(); this.loadMeals(); this.toast('Bulk meals saved!', 'success');
    },

    async editMeal(mid, dk) { const s = await db.ref(`messes/${this.messId}/meals/${dk}/${mid}`).once('value'); this.showMealModal(mid, dk, s.val()); },

    async saveMeal(dk) {
        const mid = document.getElementById('ml-member').value;
        if (!mid) { this.toast('Select member', 'error'); return; }
        await db.ref(`messes/${this.messId}/meals/${dk}/${mid}`).update({ breakfast: +document.getElementById('ml-b').value || 0, lunch: +document.getElementById('ml-l').value || 0, dinner: +document.getElementById('ml-d').value || 0, updatedAt: Date.now() });
        this.closeModal(); this.loadMeals(); this.toast('Saved', 'success');
    },

    async loadBazaar() {
        const key = this.dk(this.bazarDate); document.getElementById('bazar-date-label').textContent = this.fmtDate(this.bazarDate);
        const snap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').equalTo(key).once('value');
        const div = document.getElementById('bazar-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state">No items</p>'; document.getElementById('bazar-total-today').textContent = '\u09F30'; return; }
        let total = 0, html = '';
        snap.forEach(s => { const b = s.val(); total += b.amount || 0;
            html += `<div class="item-card"><div class="item-card-header"><h4>${this.esc(b.item || '')}</h4><span class="amount">\u09F3${b.amount || 0}</span></div><div class="item-card-details"><span>Qty: ${b.quantity || '-'}</span><span>Buyer: ${this.esc(b.buyer || '')}</span></div><div class="item-card-actions"><button class="icon-btn" onclick="App.editBazar('${s.key}')"><span class="material-icons-round">edit</span></button><button class="icon-btn" onclick="App.deleteBazar('${s.key}')"><span class="material-icons-round">delete</span></button></div></div>`;
        });
        div.innerHTML = html; document.getElementById('bazar-total-today').textContent = '\u09F3' + total;
        const month = this.mk(this.bazarDate); let mt = 0;
        const ms = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        ms.forEach(s => { mt += s.val().amount || 0; }); document.getElementById('bazar-total-month').textContent = '\u09F3' + mt;
    },

    showBazarModal(id = null, data = null) {
        document.getElementById('modal-title').textContent = id ? 'Edit Bazaar' : 'Add Bazaar';
        document.getElementById('modal-body').innerHTML = `<div class="form-group"><label>Item</label><input id="bz-item" value="${data?.item || ''}"></div><div class="form-group"><label>Amount (\u09F3)</label><input type="number" id="bz-amount" min="0" value="${data?.amount || ''}"></div><div class="form-group"><label>Quantity</label><input id="bz-qty" value="${data?.quantity || ''}"></div><div class="form-group"><label>Buyer</label><input id="bz-buyer" value="${data?.buyer || ''}"></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveBazar('${id || ''}')">${id ? 'Update' : 'Add'}</button>`;
        this.openModal();
    },

    async saveBazar(id) {
        const data = { item: document.getElementById('bz-item').value.trim(), amount: parseFloat(document.getElementById('bz-amount').value) || 0, quantity: document.getElementById('bz-qty').value.trim(), buyer: document.getElementById('bz-buyer').value.trim(), dateKey: this.dk(this.bazarDate), updatedAt: Date.now() };
        if (!data.item) { this.toast('Item required', 'error'); return; }
        if (id) await db.ref(`messes/${this.messId}/bazaar/${id}`).update(data);
        else { data.createdAt = Date.now(); await db.ref(`messes/${this.messId}/bazaar`).push(data); }
        this.closeModal(); this.loadBazaar(); this.toast('Saved', 'success');
    },

    async editBazar(id) { const s = await db.ref(`messes/${this.messId}/bazaar/${id}`).once('value'); this.showBazarModal(id, s.val()); },
    async deleteBazar(id) { if (!confirm('Delete?')) return; await db.ref(`messes/${this.messId}/bazaar/${id}`).remove(); this.loadBazaar(); },

    async loadExpenses() {
        const month = this.mk(this.expenseMonth); document.getElementById('expense-month-label').textContent = this.fmtMonth(this.expenseMonth);
        const snap = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        const div = document.getElementById('expenses-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state">No expenses</p>'; document.getElementById('expense-total-month').textContent = '\u09F30'; return; }
        let total = 0, html = '';
        snap.forEach(s => { const e = s.val(); total += e.amount || 0;
            html += `<div class="item-card"><div class="item-card-header"><h4>${this.esc(e.category || '')} - ${this.esc(e.description || '')}</h4><span class="amount">\u09F3${e.amount || 0}</span></div><div class="item-card-details"><span>${e.paidBy || ''}</span></div><div class="item-card-actions"><button class="icon-btn" onclick="App.editExpense('${s.key}')"><span class="material-icons-round">edit</span></button><button class="icon-btn" onclick="App.deleteExpense('${s.key}')"><span class="material-icons-round">delete</span></button></div></div>`;
        });
        div.innerHTML = html; document.getElementById('expense-total-month').textContent = '\u09F3' + total;
    },

    showExpenseModal(id = null, data = null) {
        document.getElementById('modal-title').textContent = id ? 'Edit Expense' : 'Add Expense';
        document.getElementById('modal-body').innerHTML = `<div class="form-group"><label>Category</label><select id="ex-cat"><option ${data?.category === 'Food' ? 'selected' : ''}>Food</option><option ${data?.category === 'Utility' ? 'selected' : ''}>Utility</option><option ${data?.category === 'Rent' ? 'selected' : ''}>Rent</option><option ${data?.category === 'Salary' ? 'selected' : ''}>Salary</option><option ${data?.category === 'Maintenance' ? 'selected' : ''}>Maintenance</option><option ${data?.category === 'Other' ? 'selected' : ''}>Other</option></select></div><div class="form-group"><label>Description</label><input id="ex-desc" value="${data?.description || ''}"></div><div class="form-group"><label>Amount (\u09F3)</label><input type="number" id="ex-amount" min="0" value="${data?.amount || ''}"></div><div class="form-group"><label>Paid By</label><input id="ex-paidby" value="${data?.paidBy || ''}"></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveExpense('${id || ''}')">${id ? 'Update' : 'Add'}</button>`;
        this.openModal();
    },

    async saveExpense(id) {
        const data = { category: document.getElementById('ex-cat').value, description: document.getElementById('ex-desc').value.trim(), amount: parseFloat(document.getElementById('ex-amount').value) || 0, paidBy: document.getElementById('ex-paidby').value.trim(), dateKey: this.dk(new Date()), date: new Date().toISOString(), updatedAt: Date.now() };
        if (!data.amount) { this.toast('Amount required', 'error'); return; }
        if (id) await db.ref(`messes/${this.messId}/expenses/${id}`).update(data);
        else { data.createdAt = Date.now(); await db.ref(`messes/${this.messId}/expenses`).push(data); }
        this.closeModal(); this.loadExpenses(); this.toast('Saved', 'success');
    },

    async editExpense(id) { const s = await db.ref(`messes/${this.messId}/expenses/${id}`).once('value'); this.showExpenseModal(id, s.val()); },
    async deleteExpense(id) { if (!confirm('Delete?')) return; await db.ref(`messes/${this.messId}/expenses/${id}`).remove(); this.loadExpenses(); },

    async loadBalance() {
        const members = (await db.ref(`messes/${this.messId}/members`).once('value')).val() || {};
        const deposits = (await db.ref(`messes/${this.messId}/deposits`).once('value')).val() || {};
        const month = this.mk(new Date());
        let totalExp = 0, totalBazar = 0, totalDep = 0;
        const expS = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        expS.forEach(s => { totalExp += s.val().amount || 0; });
        const bzS = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        bzS.forEach(s => { totalBazar += s.val().amount || 0; });
        Object.values(deposits).forEach(d => { totalDep += d.amount || 0; });
        const tc = totalExp + totalBazar;
        document.getElementById('balance-income').textContent = '\u09F3' + totalDep;
        document.getElementById('balance-expense').textContent = '\u09F3' + tc;
        document.getElementById('balance-remaining').textContent = '\u09F3' + (totalDep - tc);
        let totalMeals = 0;
        const mlS = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-31').once('value');
        mlS.forEach(d => { Object.values(d.val() || {}).forEach(ml => { totalMeals += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); }); });
        const rate = totalMeals > 0 ? (tc / totalMeals).toFixed(2) : 0;
        document.getElementById('balance-rate').textContent = '\u09F3' + rate;
        const div = document.getElementById('member-dues-list'); const mids = Object.keys(members);
        if (!mids.length) { div.innerHTML = '<p class="empty-state">No members</p>'; return; }
        let html = '';
        mids.forEach(mid => { const m = members[mid], dep = deposits[mid]?.amount || 0;
            let mm = 0; mlS.forEach(d => { const ml = (d.val() || {})[mid] || {}; mm += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); });
            const cost = (mm * parseFloat(rate)).toFixed(2); const due = (dep - parseFloat(cost)).toFixed(2);
            html += `<div class="due-item"><div class="due-info"><h4>${this.esc(m.name)}</h4><p>${mm} meals | Dep: \u09F3${dep}</p></div><div class="due-amount ${parseFloat(due) >= 0 ? 'positive' : 'negative'}">\u09F3${due}</div></div>`;
        });
        div.innerHTML = html;
    },

    showDepositModal() {
        document.getElementById('modal-title').textContent = 'Record Deposit';
        db.ref(`messes/${this.messId}/members`).once('value').then(snap => {
            const m = snap.val() || {}; let opts = '<option value="">Select</option>';
            Object.entries(m).forEach(([id, v]) => { opts += `<option value="${id}">${v.name}</option>`; });
            document.getElementById('modal-body').innerHTML = `<div class="form-group"><label>Member</label><select id="dp-member">${opts}</select></div><div class="form-group"><label>Amount (\u09F3)</label><input type="number" id="dp-amount" min="0"></div><div class="form-group"><label>Note</label><input id="dp-note" placeholder="Optional"></div>`;
            document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveDeposit()">Save</button>`;
            this.openModal();
        });
    },

    async saveDeposit() {
        const mid = document.getElementById('dp-member').value, amount = parseFloat(document.getElementById('dp-amount').value) || 0, note = document.getElementById('dp-note').value.trim();
        if (!mid || !amount) { this.toast('Select member and amount', 'error'); return; }
        const existing = (await db.ref(`messes/${this.messId}/deposits/${mid}/amount`).once('value')).val() || 0;
        await db.ref(`messes/${this.messId}/deposits/${mid}`).set({ amount: existing + amount, note, updatedAt: Date.now() });
        this.closeModal(); this.loadBalance(); this.toast('Recorded', 'success');
    },

    async loadNotices() {
        const snap = await db.ref(`messes/${this.messId}/notices`).orderByChild('createdAt').limitToLast(50).once('value');
        const div = document.getElementById('notices-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state">No notices</p>'; return; }
        let html = ''; const arr = []; snap.forEach(s => { arr.unshift({ key: s.key, ...s.val() }); });
        arr.forEach(n => { html += `<div class="notice-item"><h4>${this.esc(n.title || '')}</h4><p>${this.esc(n.body || '')}</p><div class="notice-meta"><span>${this.esc(n.author || '')}</span><span>${this.timeAgo(n.createdAt)}</span></div><div class="item-card-actions"><button class="icon-btn" onclick="App.deleteNotice('${n.key}')"><span class="material-icons-round">delete</span></button></div></div>`; });
        div.innerHTML = html;
    },

    showNoticeModal() {
        document.getElementById('modal-title').textContent = 'Post Notice';
        document.getElementById('modal-body').innerHTML = `<div class="form-group"><label>Title</label><input id="nt-title"></div><div class="form-group"><label>Message</label><textarea id="nt-body"></textarea></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveNotice()">Post</button>`;
        this.openModal();
    },

    async saveNotice() {
        const title = document.getElementById('nt-title').value.trim(), body = document.getElementById('nt-body').value.trim();
        if (!title) { this.toast('Title required', 'error'); return; }
        await db.ref(`messes/${this.messId}/notices`).push({ title, body, author: this.currentUser.displayName || 'Admin', createdAt: Date.now() });
        this.closeModal(); this.loadNotices();
    },

    async deleteNotice(id) { if (!confirm('Delete?')) return; await db.ref(`messes/${this.messId}/notices/${id}`).remove(); this.loadNotices(); },

    async loadDailyReport() {
        const key = this.dk(this.reportDate); document.getElementById('report-date-label').textContent = this.fmtDate(this.reportDate);
        const members = (await db.ref(`messes/${this.messId}/members`).once('value')).val() || {};
        const meals = (await db.ref(`messes/${this.messId}/meals/${key}`).once('value')).val() || {};
        let totalMeals = 0, rows = '';
        Object.entries(members).forEach(([id, m]) => { const ml = meals[id] || {}; const t = (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); totalMeals += t; rows += `<div class="report-row"><span>${m.name}</span><span>${t} (B:${ml.breakfast || 0} L:${ml.lunch || 0} D:${ml.dinner || 0})</span></div>`; });
        let totalBazar = 0; const bs = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').equalTo(key).once('value');
        bs.forEach(s => { totalBazar += s.val().amount || 0; });
        document.getElementById('daily-report').innerHTML = `<div class="report-section"><h5>Meals (${totalMeals})</h5>${rows || '<p>No data</p>'}</div><div class="report-section"><h5>Bazaar: \u09F3${totalBazar}</h5></div>${totalMeals > 0 ? `<div class="report-section"><h5>Rate: \u09F3${(totalBazar / totalMeals).toFixed(2)}/meal</h5></div>` : ''}`;
    },

    async loadMonthlyReport() {
        const month = this.mk(this.reportMonth); document.getElementById('report-month-label').textContent = this.fmtMonth(this.reportMonth);
        const members = (await db.ref(`messes/${this.messId}/members`).once('value')).val() || {};
        const mm = {}; let totalBazar = 0, totalExp = 0;
        const mlS = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-31').once('value');
        mlS.forEach(d => { Object.entries(d.val() || {}).forEach(([mid, ml]) => { if (!mm[mid]) mm[mid] = 0; mm[mid] += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); }); });
        let totalMeals = 0; Object.values(mm).forEach(t => { totalMeals += t; });
        let rows = ''; Object.entries(members).forEach(([id, m]) => { rows += `<div class="report-row"><span>${m.name}</span><span>${mm[id] || 0}</span></div>`; });
        const bs = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value'); bs.forEach(s => { totalBazar += s.val().amount || 0; });
        const es = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value'); es.forEach(s => { totalExp += s.val().amount || 0; });
        const tc = totalBazar + totalExp, rate = totalMeals > 0 ? (tc / totalMeals).toFixed(2) : 0;
        document.getElementById('monthly-report').innerHTML = `<div class="report-section"><h5>Meals (${totalMeals})</h5>${rows}</div><div class="report-section"><h5>Finance</h5><div class="report-row"><span>Bazaar</span><span>\u09F3${totalBazar}</span></div><div class="report-row"><span>Expenses</span><span>\u09F3${totalExp}</span></div><div class="report-row report-total"><span>Total</span><span>\u09F3${tc}</span></div></div><div class="report-section"><h5>Rate: \u09F3${rate}/meal</h5></div>`;
    },

    async loadMonthlyOverview() {
        const month = this.mk(this.monthlyDate); document.getElementById('monthly-label').textContent = this.fmtMonth(this.monthlyDate);
        const year = this.monthlyDate.getFullYear();
        document.getElementById('monthly-year-select').value = year;
        const members = (await db.ref(`messes/${this.messId}/members`).once('value')).val() || {};
        let totalMeals = 0, totalBazar = 0, totalExp = 0;
        const memberMeals = {};
        const daysInMonth = new Date(year, this.monthlyDate.getMonth() + 1, 0).getDate();
        const firstDay = `${month}-01`;
        const lastDay = `${month}-${String(daysInMonth).padStart(2, '0')}`;
        const mlS = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(firstDay).endAt(lastDay).once('value');
        const dailyMeals = {};
        mlS.forEach(d => {
            const dayMeals = d.val() || {};
            Object.entries(dayMeals).forEach(([mid, ml]) => {
                const t = (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0);
                totalMeals += t;
                if (!memberMeals[mid]) memberMeals[mid] = 0;
                memberMeals[mid] += t;
                const dk = d.key;
                if (!dailyMeals[dk]) dailyMeals[dk] = 0;
                dailyMeals[dk] += t;
            });
        });
        const bzS = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(firstDay).endAt(lastDay).once('value');
        bzS.forEach(s => { totalBazar += s.val().amount || 0; });
        const exS = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(firstDay).endAt(lastDay).once('value');
        exS.forEach(s => { totalExp += s.val().amount || 0; });
        const tc = totalBazar + totalExp;
        const rate = totalMeals > 0 ? (tc / totalMeals).toFixed(2) : 0;
        const avgDailyMeals = daysInMonth > 0 ? (totalMeals / daysInMonth).toFixed(1) : 0;
        document.getElementById('monthly-overview').innerHTML = `
            <div class="summary-row"><span>Total Days Active</span><strong>${Object.keys(dailyMeals).length}</strong></div>
            <div class="summary-row"><span>Total Meals</span><strong>${totalMeals}</strong></div>
            <div class="summary-row"><span>Avg Daily Meals</span><strong>${avgDailyMeals}</strong></div>
            <div class="summary-row"><span>Total Bazaar</span><strong>\u09F3${totalBazar}</strong></div>
            <div class="summary-row"><span>Total Expenses</span><strong>\u09F3${totalExp}</strong></div>
            <div class="summary-row"><span>Total Cost</span><strong>\u09F3${tc}</strong></div>
            <div class="summary-row"><span>Meal Rate</span><strong>\u09F3${rate}/meal</strong></div>`;
        const mids = Object.keys(members);
        let mhtml = '';
        mids.forEach(mid => { const m = members[mid]; const mm = memberMeals[mid] || 0;
            mhtml += `<div class="due-item"><div class="due-info"><h4>${this.esc(m.name)}</h4><p>${mm} meals (${totalMeals > 0 ? ((mm / totalMeals) * 100).toFixed(1) : 0}%)</p></div><div class="due-amount">\u09F3${(mm * parseFloat(rate)).toFixed(0)}</div></div>`;
        });
        document.getElementById('monthly-members').innerHTML = mhtml || '<p class="empty-state">No data</p>';
    },

    exportPDF(type) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text(`Mess Manager - ${type === 'daily' ? 'Daily' : 'Monthly'} Report`, 20, 20);
        doc.setFontSize(10);
        const content = type === 'daily' ? document.getElementById('daily-report').innerText : document.getElementById('monthly-report').innerText;
        doc.text(content, 20, 35);
        doc.save(`mess-${type}-${type === 'daily' ? this.dk(this.reportDate) : this.mk(this.reportMonth)}.pdf`);
        this.toast('PDF exported', 'success');
    },

    dk(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; },
    mk(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; },
    fmtDate(d) { return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); },
    fmtMonth(d) { return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }); },
    timeAgo(ts) { if (!ts) return ''; const d = Date.now() - ts, m = Math.floor(d / 60000); if (m < 1) return 'now'; if (m < 60) return m + 'm'; const h = Math.floor(m / 60); if (h < 24) return h + 'h'; const dy = Math.floor(h / 24); return dy < 7 ? dy + 'd' : new Date(ts).toLocaleDateString(); },
    esc(s) { return s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : ''; },
    openModal() { document.getElementById('modal-overlay').classList.add('active'); },
    closeModal() { document.getElementById('modal-overlay').classList.remove('active'); },
    toast(msg, type = 'info') { const c = document.getElementById('toast-container'); const t = document.createElement('div'); t.className = `toast ${type}`; t.textContent = msg; c.appendChild(t); setTimeout(() => t.remove(), 3500); }
};

document.addEventListener('DOMContentLoaded', () => App.init());
