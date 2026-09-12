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
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
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
        const monthSelect = document.getElementById('monthly-month-select');
        if (monthSelect) monthSelect.value = String(now.getMonth() + 1).padStart(2, '0');
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
        $('add-member-btn')?.addEventListener('click', () => this.showMemberModal());
        $('add-meal-btn').addEventListener('click', () => this.showMealModal());
        $('bulk-meal-btn')?.addEventListener('click', () => this.showBulkMealModal());
        $('add-bazar-btn')?.addEventListener('click', () => this.showBazarModal());
        $('add-expense-btn')?.addEventListener('click', () => this.showExpenseModal());
        $('add-notice-btn').addEventListener('click', () => this.showNoticeModal());
        $('modal-close').addEventListener('click', () => this.closeModal());
        $('modal-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) this.closeModal(); });
        $('monthly-year-select').addEventListener('change', () => this.loadMonthlyOverview());
        $('monthly-month-select').addEventListener('change', () => this.loadMonthlyOverview());
        $('export-daily-pdf')?.addEventListener('click', () => this.exportPDF('daily'));
        $('export-monthly-pdf')?.addEventListener('click', () => this.exportPDF('monthly'));
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
        try {
            const snap = await db.ref(`users/${this.currentUser.uid}/messes`).once('value');
            const data = snap.val() || {};
            const ids = Object.keys(data);
            if (ids.length === 1) {
                this.enterMess(ids[0]);
                return;
            }
            if (ids.length > 1) {
                this.showScreen('mess-select-screen');
                const div = document.getElementById('my-messes-list');
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
                return;
            }
            this.showScreen('mess-select-screen');
            document.getElementById('my-messes-list').innerHTML = '<div class="card-body"><p class="empty-state">No mess yet. Create or join one below.</p></div>';
        } catch (e) {
            console.error('loadMyMesses error:', e);
            this.showScreen('mess-select-screen');
            document.getElementById('my-messes-list').innerHTML = '<div class="card-body"><p class="empty-state">Error loading mess. Check connection.</p></div>';
        }
    },

    enterMess(mid) {
        this.messId = mid;
        this.messCode = null;
        db.ref(`messes/${mid}/settings`).once('value').then(async s => {
            const v = s.val() || {};
            this.messCode = v.messCode;
            this.messName = v.messName;
            const roleSnap = await db.ref(`messes/${mid}/members/${this.currentUser.uid}/role`).once('value');
            this.userRole = roleSnap.val() || 'member';
            this.showApp();
        }).catch(e => { console.error('enterMess error:', e); this.toast('Error loading mess', 'error'); });
    },

    async leaveMess() {
        if (!confirm('Are you sure you want to leave this mess? You will lose access to all data.')) return;
        if (!this.messId || !this.currentUser) return;
        try {
            await db.ref(`messes/${this.messId}/members/${this.currentUser.uid}`).remove();
            await db.ref(`users/${this.currentUser.uid}/messes/${this.messId}`).remove();
            this.toast('Left mess', 'success');
            this.messId = null;
            this.messCode = null;
            this.messName = null;
            this.loadMyMesses();
        } catch (e) {
            console.error('leaveMess error:', e);
            this.toast('Error leaving mess', 'error');
        }
    },

    async createMess() {
        const name = document.getElementById('create-mess-name').value.trim();
        if (!name) { this.toast('Enter mess name', 'error'); return; }
        const btn = document.getElementById('create-mess-btn');
        btn.textContent = 'Creating...'; btn.disabled = true;
        try {
            const code = this.genCode(6);
            const ref = db.ref('messes').push();
            const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('Connection timeout. Check your internet and Firebase database rules.')), 15000));
            const write = ref.set({
                settings: { messName: name, messCode: code, owner: this.currentUser.uid, createdAt: Date.now() },
                members: { [this.currentUser.uid]: { name: this.currentUser.displayName || 'Admin', email: this.currentUser.email, role: 'admin', joinedAt: Date.now() } }
            });
            await Promise.race([write, timeout]);
            const userWrite = db.ref(`users/${this.currentUser.uid}/messes/${ref.key}`).set({ role: 'admin', joinedAt: Date.now() });
            await Promise.race([userWrite, timeout]);
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
        this.navigate('dashboard');
    },

    navigate(page) {
        this.currentPage = page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-' + page).classList.add('active');
        document.querySelectorAll('.bottom-nav-item').forEach(n => n.classList.remove('active'));
        const bni = document.querySelector(`.bottom-nav-item[data-page="${page}"]`); if (bni) bni.classList.add('active');
        const titles = { dashboard: this.messName || 'My Mess', members: 'Flat', meals: 'Meal Entry', bazaar: 'Shopping', balance: 'Manager Money', notices: 'Notice Board', monthly: 'Analysis', profile: 'Profile' };
        document.getElementById('page-title').textContent = titles[page] || page.charAt(0).toUpperCase() + page.slice(1);
        const loaders = { dashboard: () => this.loadDashboard(), members: () => this.loadMembers(), meals: () => this.loadMeals(), bazaar: () => this.loadBazaar(), balance: () => this.loadBalance(), notices: () => this.loadNotices(), monthly: () => this.loadMonthlyOverview(), profile: () => this.loadProfile() };
        if (loaders[page]) loaders[page]();
    },

    loadProfile() {
        document.getElementById('profile-name').textContent = this.currentUser?.displayName || 'User';
        document.getElementById('profile-email').textContent = this.currentUser?.email || '';
        document.getElementById('profile-mess').textContent = this.messName || '-';
        document.getElementById('profile-code').innerHTML = (this.messCode || '------') + ' <button class="icon-btn-sm" onclick="App.copyCode()" style="padding:2px"><span class="material-icons-round" style="font-size:14px">content_copy</span></button>';
        document.getElementById('profile-role').textContent = this.userRole || 'member';
    },

    copyCode() { if (this.messCode) navigator.clipboard.writeText(this.messCode).then(() => this.toast('Copied!', 'info')); },
    signOut() { auth.signOut(); },

    async loadDashboard() {
        if (!this.messId) return;
        const today = this.dk(new Date()), month = this.mk(new Date());
        const now = new Date();
        const hour = now.getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
        const userName = this.currentUser.displayName || 'User';
        document.getElementById('dash-greeting').textContent = `${greeting}, ${userName}`;
        document.getElementById('dash-mess-name').textContent = this.messName || 'My Mess';
        document.getElementById('dash-manager').textContent = userName;
        document.getElementById('dash-month').textContent = this.fmtMonth(now);
        document.getElementById('dash-date').textContent = 'Today is ' + now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });

        const ms = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = ms.val() || {};
        const memberCount = Object.keys(members).length;
        document.getElementById('dash-online-count').textContent = memberCount;

        const ml = await db.ref(`messes/${this.messId}/meals/${today}`).once('value');
        const todayMeals = ml.val() || {};
        let breakfast = 0, lunch = 0, dinner = 0;
        Object.values(todayMeals).forEach(m => { breakfast += m.breakfast || 0; lunch += m.lunch || 0; dinner += m.dinner || 0; });
        document.getElementById('dash-breakfast').textContent = breakfast;
        document.getElementById('dash-lunch').textContent = lunch;
        document.getElementById('dash-dinner').textContent = dinner;

        const bzSnap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').equalTo(today).once('value');
        const bazarCount = bzSnap.numChildren();
        document.getElementById('dash-live-count').textContent = bazarCount + ' items';

        const noticeSnap = await db.ref(`messes/${this.messId}/notices`).orderByChild('createdAt').limitToLast(1).once('value');
        if (noticeSnap.exists()) { const n = noticeSnap.val(); const k = Object.keys(n)[0]; document.getElementById('dash-notice-preview').textContent = n[k].body || n[k].title || 'Pin a notice for the whole house'; }

        let totalDep = 0;
        const depSnap = await db.ref(`messes/${this.messId}/deposits`).once('value');
        depSnap.forEach(s => { totalDep += (s.val().amount || 0); });

        let totalExp = 0, totalBazar = 0;
        const expSnap = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        expSnap.forEach(s => { totalExp += s.val().amount || 0; });
        const bzMonth = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        bzMonth.forEach(s => { totalBazar += s.val().amount || 0; });
        const totalCost = totalExp + totalBazar;

        let totalMeals = 0;
        const mlS = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-31').once('value');
        const memberMeals = {};
        mlS.forEach(d => { Object.entries(d.val() || {}).forEach(([mid, m]) => { const t = (m.breakfast || 0) + (m.lunch || 0) + (m.dinner || 0); totalMeals += t; if (!memberMeals[mid]) memberMeals[mid] = 0; memberMeals[mid] += t; }); });
        const rate = totalMeals > 0 ? (totalCost / totalMeals) : 0;
        const balance = totalDep - totalCost;

        document.getElementById('dash-deposit').textContent = '\u09F3' + totalDep;
        const balEl = document.getElementById('dash-balance');
        balEl.textContent = '\u09F3' + balance;
        balEl.className = balance >= 0 ? 'balance-green' : 'balance-red';
        document.getElementById('dash-rate').textContent = '\u09F3' + rate.toFixed(2);

        const mids = Object.keys(members);
        let rows = '';
        mids.forEach(mid => {
            const m = members[mid];
            const mm = memberMeals[mid] || 0;
            const cost = (mm * rate).toFixed(0);
            const dep = (depSnap.child(mid).val() || {}).amount || 0;
            const due = (dep - parseFloat(cost)).toFixed(0);
            const dueClass = parseFloat(due) >= 0 ? 'cell-positive' : 'cell-negative';
            rows += `<tr><td>${this.esc(m.name)}</td><td>${mm}</td><td>\u09F3${cost}</td><td>\u09F3${dep}</td><td class="${dueClass}">\u09F3${due}</td></tr>`;
        });
        document.getElementById('dash-member-rows').innerHTML = rows || '<tr><td colspan="5" class="empty-state">No data</td></tr>';
    },

    shareMessCode() {
        if (this.messCode) {
            const text = `Join my mess in Mess Manager!\nCode: ${this.messCode}\nOpen: ${window.location.href}`;
            if (navigator.share) navigator.share({ title: 'Mess Manager', text });
            else navigator.clipboard.writeText(text).then(() => this.toast('Copied!', 'info'));
        }
    },

    async loadMembers() {
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        this.allMembers = snap.val() || {};
        document.getElementById('member-count').textContent = Object.keys(this.allMembers).length;
        document.getElementById('flat-mess-name').textContent = this.messName || 'My Mess';
        document.getElementById('flat-id-code').textContent = this.messCode || '------';
        const adminId = Object.entries(this.allMembers).find(([, m]) => m.role === 'admin')?.[0];
        document.getElementById('flat-manager-name').textContent = adminId ? this.allMembers[adminId].name : '-';
        this.renderMembers(this.allMembers);
        this.loadPeoples();
        this.loadPermissions();
    },

    switchFlatTab(tab) {
        document.querySelectorAll('.flat-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        document.querySelectorAll('.flat-tab-content').forEach(c => c.style.display = 'none');
        document.getElementById('flat-tab-' + tab).style.display = '';
        if (tab === 'members') this.renderMembers(this.allMembers);
        if (tab === 'peoples') this.loadPeoples();
        if (tab === 'permissions') this.loadPermissions();
    },

    async quickAddMember() {
        const name = document.getElementById('flat-add-member-name').value.trim();
        if (!name) { this.toast('Enter a name', 'error'); return; }
        if (Object.keys(this.allMembers).length >= 30) { this.toast('Max 30 members', 'error'); return; }
        const exists = Object.values(this.allMembers).some(m => (m.name || '').toLowerCase() === name.toLowerCase());
        if (exists) { this.toast('Name already exists', 'error'); return; }
        await db.ref(`messes/${this.messId}/members`).push({ name, email: '', role: 'member', createdAt: Date.now() });
        document.getElementById('flat-add-member-name').value = '';
        this.loadMembers();
        this.toast('Member added!', 'success');
    },

    filterMembers() {
        const q = document.getElementById('member-search').value.toLowerCase();
        const filtered = Object.fromEntries(Object.entries(this.allMembers).filter(([, m]) => (m.name || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q)));
        this.renderMembers(filtered);
    },

    renderMembers(members) {
        const div = document.getElementById('members-list');
        const ids = Object.keys(members);
        if (!ids.length) { div.innerHTML = '<p class="empty-state" style="color:#666">No members yet</p>'; return; }
        let html = '';
        ids.forEach(id => {
            const m = members[id];
            const isManager = m.role === 'admin';
            html += `<div class="flat-member-row">
                <div class="flat-member-name">${this.esc(m.name)} ${isManager ? '<span style="color:#FFC107;font-size:11px">(Manager)</span>' : ''}</div>
                <button class="flat-member-remove" onclick="App.deleteMember('${id}')"><span class="material-icons-round">close</span></button>
            </div>`;
        });
        div.innerHTML = html;
    },

    async loadPeoples() {
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = snap.val() || {};
        const mids = Object.keys(members);
        document.getElementById('peoples-count').textContent = mids.length;
        const div = document.getElementById('peoples-list');
        if (!mids.length) { div.innerHTML = '<p class="empty-state" style="color:#666">No peoples yet</p>'; return; }
        const colors = ['#1976d2','#388e3c','#f57c00','#c62828','#7b1fa2','#00838f','#4e342e','#37474f'];
        let html = '';
        mids.forEach((id, i) => {
            const m = members[id];
            const init = (m.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            const bg = colors[i % colors.length];
            const isManager = m.role === 'admin';
            const isYou = id === this.currentUser?.uid;
            html += `<div class="flat-people-card">
                <div class="flat-people-avatar" style="background:${bg}">${init}</div>
                <div class="flat-people-info">
                    <h4>${this.esc(m.name)} ${isManager ? '<span style="color:#FFC107;font-size:11px">(Manager' + (isYou ? ', You' : '') + ')</span>' : isYou ? '<span style="color:#4CAF50;font-size:11px">(You)</span>' : ''}</h4>
                    <p>${this.esc(m.email || '')}</p>
                </div>
                <span class="material-icons-round" style="color:#555">chevron_right</span>
            </div>`;
        });
        div.innerHTML = html;
    },

    async loadPermissions() {
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = snap.val() || {};
        const permSnap = await db.ref(`messes/${this.messId}/permissions`).once('value');
        const allPerms = permSnap.val() || {};
        const div = document.getElementById('permissions-list');
        const mids = Object.keys(members);
        if (!mids.length) { div.innerHTML = '<p class="empty-state" style="color:#666">No peoples</p>'; return; }
        const permKeys = ['manage_members', 'meal_entry', 'meal_edit', 'shopping_entry', 'special_meal', 'manage_permissions'];
        const permLabels = ['Manage Peoples and Members', 'Meal Entry', 'Meal Edit', 'Shopping Entry', 'Special Meal Management', 'Turn on/off Permissions'];
        let html = '';
        mids.forEach(id => {
            const m = members[id];
            const isManager = m.role === 'admin';
            const perms = allPerms[id] || {};
            const isYou = id === this.currentUser?.uid;
            html += `<div class="perm-card"><div class="perm-header"><h4>${this.esc(m.name)} ${isManager ? '<span style="color:#FFC107;font-size:11px">(Manager' + (isYou ? ', You' : '') + ')</span>' : ''}</h4></div><div class="perm-list">`;
            permKeys.forEach((key, i) => {
                const checked = isManager || perms[key] ? 'checked' : '';
                const disabled = isManager ? 'disabled' : '';
                html += `<label class="perm-row"><input type="checkbox" ${checked} ${disabled} onchange="App.togglePermission('${id}','${key}',this.checked)"><span class="perm-check"></span><span>${permLabels[i]}</span></label>`;
            });
            html += '</div></div>';
        });
        div.innerHTML = html;
    },

    async togglePermission(mid, key, val) {
        await db.ref(`messes/${this.messId}/permissions/${mid}/${key}`).set(val);
        this.toast(val ? 'Permission granted' : 'Permission revoked', 'info');
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
    async promoteMember(id) { if (!confirm('Promote to manager?')) return; await db.ref(`messes/${this.messId}/members/${id}/role`).set('admin'); this.loadMembers(); this.toast('Promoted!', 'success'); },
    async demoteMember(id) { if (!confirm('Step down from manager role?')) return; await db.ref(`messes/${this.messId}/members/${id}/role`).set('member'); this.loadMembers(); this.toast('Stepped down', 'success'); },
    async deleteMember(id) { if (!confirm('Remove member?')) return; await db.ref(`messes/${this.messId}/members/${id}`).remove(); this.loadMembers(); },

    async loadMeals() {
        if (!this.messId) return;
        const now = new Date();
        const month = this.mk(now);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        document.getElementById('meal-month-label').textContent = this.fmtMonth(now);

        const mbrs = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = mbrs.val() || {};
        const mids = Object.keys(members);
        if (!mids.length) { document.getElementById('meal-grid-wrap').innerHTML = '<p class="empty-state" style="color:#888">Add members first</p>'; return; }

        const mlSnap = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-' + String(daysInMonth).padStart(2, '0')).once('value');
        const allMeals = {};
        let totalMonth = 0;
        mlSnap.forEach(d => {
            const dayMeals = d.val() || {};
            const dk = d.key;
            Object.entries(dayMeals).forEach(([mid, ml]) => {
                if (!allMeals[mid]) allMeals[mid] = {};
                allMeals[mid][dk] = ml;
                totalMonth += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0);
            });
        });

        const today = this.dk(now);
        let totalToday = 0;
        Object.values(allMeals).forEach(m => { const ml = m[today]; if (ml) totalToday += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); });
        document.getElementById('meal-total-today').textContent = totalToday;
        document.getElementById('meal-total-month').textContent = totalMonth;

        const colors = ['#388e3c','#1976d2','#f57c00','#c62828','#7b1fa2','#00838f','#4e342e','#37474f'];
        const viewDays = Math.min(daysInMonth, 10);
        let html = '<div class="meal-table"><div class="meal-table-inner"><div class="meal-header-row"><div class="meal-name-col">View</div>';
        for (let d = 1; d <= viewDays; d++) html += `<div class="meal-day-col">${d}</div>`;
        if (daysInMonth > viewDays) html += `<div class="meal-day-col">...</div>`;
        html += '</div>';

        mids.forEach((mid, idx) => {
            const m = members[mid];
            const mData = allMeals[mid] || {};
            let mTotal = 0;
            Object.values(mData).forEach(ml => { mTotal += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); });
            const meals = ['breakfast', 'lunch', 'dinner'];
            const labels = ['☕ Morning', '🍛 Noon', '🌙 Night'];
            const bgs = ['#3d2b1a', '#1a2e1a', '#1a1e3a'];

            meals.forEach((meal, mi) => {
                let rowTotal = 0;
                for (let d = 1; d <= daysInMonth; d++) {
                    const dk = `${month}-${String(d).padStart(2, '0')}`;
                    rowTotal += (mData[dk] && mData[dk][meal]) || 0;
                }
                html += `<div class="meal-row ${mi === 0 ? 'meal-row-first' : ''}">`;
                if (mi === 0) html += `<div class="meal-name-col" style="background:${colors[idx % colors.length]}"><strong>${this.esc(m.name)}</strong><small>(${mTotal})</small></div>`;
                else html += `<div class="meal-name-col"></div>`;
                html += `<div class="meal-type-col" style="background:${bgs[mi]}"><small>${labels[mi]}</small><strong>${rowTotal}</strong></div>`;
                for (let d = 1; d <= viewDays; d++) {
                    const dk = `${month}-${String(d).padStart(2, '0')}`;
                    const val = (mData[dk] && mData[dk][meal]) || 0;
                    html += `<div class="meal-cell${val ? ' filled' : ''}">${val || ''}</div>`;
                }
                if (daysInMonth > viewDays) html += '<div class="meal-cell"></div>';
                html += '</div>';
            });
            html += `<div class="meal-member-divider"></div>`;
        });
        html += '</div></div>';
        document.getElementById('meal-grid-wrap').innerHTML = html;
    },

    showMealModal(mid = null, dk = null, data = null) {
        document.getElementById('modal-title').textContent = data ? 'Edit Meal' : 'Add Meal';
        db.ref(`messes/${this.messId}/members`).once('value').then(snap => {
            const m = snap.val() || {}; let opts = '<option value="">Select</option>';
            this.sortedMembers(m).forEach(([id, v]) => { opts += `<option value="${id}" ${id === mid ? 'selected' : ''}>${v.name}</option>`; });
            document.getElementById('modal-body').innerHTML = `<div class="form-group"><label>Member</label><select id="ml-member">${opts}</select></div><div class="form-group"><label>Breakfast</label><input type="number" id="ml-b" min="0" value="${data?.breakfast || 0}"></div><div class="form-group"><label>Lunch</label><input type="number" id="ml-l" min="0" value="${data?.lunch || 0}"></div><div class="form-group"><label>Dinner</label><input type="number" id="ml-d" min="0" value="${data?.dinner || 0}"></div>`;
            document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveMeal('${dk || this.dk(this.mealDate)}')">Save</button>`;
            this.openModal();
        });
    },

    showBulkMealModal() {
        document.getElementById('modal-title').textContent = 'Bulk Meal Entry';
        db.ref(`messes/${this.messId}/members`).once('value').then(snap => {
            const m = snap.val() || {}; const sorted = this.sortedMembers(m);
            if (!sorted.length) { this.toast('No members', 'error'); return; }
            let rows = '';
            sorted.forEach(([id, v]) => { rows += `<div class="bulk-row" data-mid="${id}"><span style="min-width:100px;font-size:13px">${this.esc(v.name)}</span><input type="number" min="0" value="0" class="bulk-b" style="width:50px" placeholder="B"><input type="number" min="0" value="0" class="bulk-l" style="width:50px" placeholder="L"><input type="number" min="0" value="0" class="bulk-d" style="width:50px" placeholder="D"></div>`; });
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
        if (!this.messId) return;
        const now = new Date();
        const month = this.mk(now);
        document.getElementById('bazar-month-label').textContent = this.fmtMonth(now);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        const snap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-' + String(daysInMonth).padStart(2, '0')).once('value');
        const div = document.getElementById('bazar-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state" style="color:#888">No items this month</p>'; document.getElementById('bazar-total-month').textContent = '৳0'; return; }

        const byDate = {};
        let totalMonth = 0;
        snap.forEach(s => {
            const b = s.val();
            const dk = b.dateKey;
            if (!byDate[dk]) byDate[dk] = [];
            byDate[dk].push({ key: s.key, ...b });
            totalMonth += b.amount || 0;
        });
        document.getElementById('bazar-total-month').textContent = '৳' + totalMonth;

        const sortedDates = Object.keys(byDate).sort().reverse();
        let html = '';
        sortedDates.forEach(dk => {
            const items = byDate[dk];
            const dayTotal = items.reduce((s, b) => s + (b.amount || 0), 0);
            const d = new Date(dk + 'T00:00:00');
            const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
            const catShopping = items.filter(b => (b.category || 'Shopping') === 'Shopping').reduce((s, b) => s + (b.amount || 0), 0);
            const catUtility = items.filter(b => b.category === 'Utility').reduce((s, b) => s + (b.amount || 0), 0);

            html += `<div class="collapse-card" id="bazar-${dk}">
                <div class="collapse-header" onclick="App.toggleCollapse('bazar-${dk}')">
                    <div><strong>${dateStr}</strong><p class="collapse-sub">Shopping \u09F3${catShopping} \u00B7 ${items.length} item${items.length > 1 ? 's' : ''}${catUtility > 0 ? ' \u00B7 <span style="color:#FFC107">Utility \u09F3' + catUtility + '</span>' : ''}</p></div>
                    <div class="collapse-right"><span style="color:#F44336;font-weight:700">৳${dayTotal}</span><span class="material-icons-round collapse-arrow">expand_less</span></div>
                </div>
                <div class="collapse-body">
                    <div class="collapse-table-header"><span>ITEM</span><span>MONEY FROM</span><span>COST</span></div>
                    ${items.map(b => `<div class="collapse-row" onclick="App.editBazar('${b.key}')">
                        <span class="collapse-row-name">${this.esc(b.item || '')}</span>
                        <span class="collapse-row-sub">${this.esc(b.buyer || '')}</span>
                        <span class="collapse-row-amt" style="color:#F44336">৳${b.amount || 0}</span>
                        <span class="material-icons-round" style="font-size:16px;color:#555">chevron_right</span>
                    </div>`).join('')}
                </div>
            </div>`;
        });
        div.innerHTML = html;
    },

    showBazarModal(id = null, data = null) {
        document.getElementById('modal-title').innerHTML = (id ? 'Edit Item' : 'Add Shopping') + '<div class="bazar-cat-tabs" id="bazar-cat-tabs"><button class="bazar-tab active" data-cat="Shopping" onclick="App.setBazarCat(\'Shopping\')"><span class="material-icons-round">shopping_cart</span> Shopping</button><button class="bazar-tab" data-cat="Utility" onclick="App.setBazarCat(\'Utility\')"><span class="material-icons-round">lightbulb</span> Utility</button><button class="bazar-tab" data-cat="Special" onclick="App.setBazarCat(\'Special\')"><span class="material-icons-round">star</span> Special</button></div>';
        db.ref(`messes/${this.messId}/members`).once('value').then(snap => {
            const m = snap.val() || {}; let payChips = '', doneChips = '';
            this.sortedMembers(m).forEach(([mid, v]) => {
                payChips += `<button class="member-chip" data-mid="${mid}" onclick="App.selectBazarMember(this)">${this.esc(v.name)}</button>`;
                doneChips += `<button class="member-chip" data-mid="${mid}" onclick="App.selectBazarDoneBy(this)">${this.esc(v.name)}</button>`;
            });
            const today = data?.dateKey || this.dk(new Date());
            document.getElementById('modal-body').innerHTML = `
                <div class="form-group"><label style="color:#888">Date</label><input type="date" id="bazar-date" value="${today}" style="width:100%;padding:10px 14px;border:1px solid #3a3a50;border-radius:var(--radius-sm);font-size:14px;font-family:inherit;outline:none;background:#2a2a3e;color:white;min-height:44px"></div>
                <div class="form-group"><label style="color:#888">Money paid by</label><div class="bazar-member-chips" id="bazar-member-chips">${payChips}</div></div>
                <div class="form-group"><label style="color:#888">Shopping done by</label><div class="bazar-member-chips" id="bazar-doneby-chips">${doneChips}</div></div>
                <div id="bazar-items-list">
                    <div class="bazar-item-row">
                        <div class="form-group" style="flex:2"><label style="color:#888">Item name</label><input class="bazar-item-name" placeholder="e.g. Rice"></div>
                        <div class="form-group" style="flex:1"><label style="color:#888">Cost (\u09F3)</label><input type="number" class="bazar-item-cost" min="0" placeholder="0" oninput="App.updateBazarTotal()"></div>
                    </div>
                </div>
                <button class="btn-add-item" onclick="App.addBazarItemRow()"><span class="material-icons-round">add</span> Add another item</button>
                <p style="font-size:12px;color:#888;margin-top:8px">Add each item on its own line for better analysis.</p>
            `;
            document.getElementById('modal-footer').innerHTML = `<div class="bazar-footer-bar"><div class="bazar-footer-info"><strong id="bazar-item-count">0 items</strong><span style="color:#888">Pick whose money it is</span></div><strong id="bazar-total-input" style="color:#4CAF50;font-size:18px">\u09F30</strong></div><div style="display:flex;gap:10px;margin-top:12px"><button class="btn-modal-cancel" onclick="App.closeModal()">Cancel</button><button class="btn-modal-add" onclick="App.saveBazarMulti('${id || ''}')">${id ? 'Update' : 'Add'}</button></div>`;
            this.bazarCat = 'Shopping';
            this.bazarSelectedMember = null;
            this.bazarDoneBy = null;
            this.openModal();
        });
    },

    bazarCat: 'Shopping',
    bazarSelectedMember: null,
    bazarDoneBy: null,

    setBazarCat(cat) {
        this.bazarCat = cat;
        document.querySelectorAll('.bazar-tab').forEach(t => { t.classList.toggle('active', t.dataset.cat === cat); });
    },

    selectBazarMember(btn) {
        document.querySelectorAll('#bazar-member-chips .member-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        this.bazarSelectedMember = btn.dataset.mid;
    },

    selectBazarDoneBy(btn) {
        document.querySelectorAll('#bazar-doneby-chips .member-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        this.bazarDoneBy = btn.dataset.mid;
    },

    addBazarItemRow() {
        const list = document.getElementById('bazar-items-list');
        const row = document.createElement('div');
        row.className = 'bazar-item-row';
        row.innerHTML = `<div class="form-group" style="flex:2"><input class="bazar-item-name" placeholder="Item name"></div><div class="form-group" style="flex:1"><input type="number" class="bazar-item-cost" min="0" placeholder="0" oninput="App.updateBazarTotal()"></div><button class="btn-remove-row" onclick="this.parentElement.remove();App.updateBazarTotal()"><span class="material-icons-round">close</span></button>`;
        list.appendChild(row);
    },

    updateBazarTotal() {
        let total = 0, count = 0;
        document.querySelectorAll('.bazar-item-cost').forEach(el => { const v = parseFloat(el.value) || 0; if (v > 0) { total += v; count++; } });
        document.getElementById('bazar-item-count').textContent = count + ' item' + (count !== 1 ? 's' : '');
        document.getElementById('bazar-total-input').textContent = '\u09F3' + total;
    },

    async saveBazarMulti(editId) {
        if (!this.bazarSelectedMember) { this.toast('Select who paid', 'error'); return; }
        const names = document.querySelectorAll('.bazar-item-name');
        const costs = document.querySelectorAll('.bazar-item-cost');
        const buyer = (await db.ref(`messes/${this.messId}/members/${this.bazarSelectedMember}/name`).once('value')).val() || '';
        const doneById = this.bazarDoneBy;
        const doneByName = doneById ? (await db.ref(`messes/${this.messId}/members/${doneById}/name`).once('value')).val() || '' : '';
        const dateVal = document.getElementById('bazar-date').value;
        const dk = dateVal || this.dk(new Date());
        let saved = 0;
        for (let i = 0; i < names.length; i++) {
            const item = names[i].value.trim();
            const amount = parseFloat(costs[i].value) || 0;
            if (!item || amount <= 0) continue;
            const data = { item, amount, buyer, doneBy: doneByName, category: this.bazarCat, dateKey: dk, updatedAt: Date.now() };
            if (editId) await db.ref(`messes/${this.messId}/bazaar/${editId}`).update(data);
            else { data.createdAt = Date.now(); await db.ref(`messes/${this.messId}/bazaar`).push(data); }
            saved++;
        }
        if (saved === 0) { this.toast('Add at least one item with cost', 'error'); return; }
        this.closeModal(); this.loadBazaar(); this.toast(saved + ' item(s) saved!', 'success');
    },

    async editBazar(id) { const s = await db.ref(`messes/${this.messId}/bazaar/${id}`).once('value'); this.showBazarModal(id, s.val()); },
    async deleteBazar(id) { if (!confirm('Delete?')) return; await db.ref(`messes/${this.messId}/bazaar/${id}`).remove(); this.loadBazaar(); },

    async loadExpenses() {
        if (!this.messId) return;
        const now = new Date();
        const month = this.mk(now);
        document.getElementById('expense-month-label').textContent = this.fmtMonth(now);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        const snap = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-' + String(daysInMonth).padStart(2, '0')).once('value');
        const div = document.getElementById('expenses-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state" style="color:#888">No expenses this month</p>'; document.getElementById('expense-total-month').textContent = '৳0'; return; }

        const byDate = {};
        let totalMonth = 0;
        snap.forEach(s => {
            const e = s.val();
            const dk = e.dateKey;
            if (!byDate[dk]) byDate[dk] = [];
            byDate[dk].push({ key: s.key, ...e });
            totalMonth += e.amount || 0;
        });
        document.getElementById('expense-total-month').textContent = '৳' + totalMonth;

        const sortedDates = Object.keys(byDate).sort().reverse();
        let html = '';
        sortedDates.forEach(dk => {
            const items = byDate[dk];
            const dayTotal = items.reduce((s, e) => s + (e.amount || 0), 0);
            const d = new Date(dk + 'T00:00:00');
            const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
            const names = [...new Set(items.map(e => e.paidBy || 'Unknown'))];

            html += `<div class="collapse-card" id="exp-${dk}">
                <div class="collapse-header" onclick="App.toggleCollapse('exp-${dk}')">
                    <div><strong>${dateStr}</strong><p class="collapse-sub">${names.join(', ')} · ${items.length} entr${items.length > 1 ? 'ies' : 'y'}</p></div>
                    <div class="collapse-right"><span style="color:#F44336;font-weight:700">৳${dayTotal}</span><span class="material-icons-round collapse-arrow">expand_less</span></div>
                </div>
                <div class="collapse-body">
                    <div class="collapse-table-header"><span>MONEY OF</span><span>AMOUNT</span></div>
                    ${items.map(e => `<div class="collapse-row" onclick="App.editExpense('${e.key}')">
                        <span class="collapse-row-name">${this.esc(e.paidBy || 'Unknown')}</span>
                        <span class="collapse-row-amt" style="color:#F44336">৳${e.amount || 0}</span>
                        <span class="material-icons-round" style="font-size:16px;color:#555">chevron_right</span>
                    </div>`).join('')}
                </div>
            </div>`;
        });
        div.innerHTML = html;
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
            this.sortedMembers(m).forEach(([id, v]) => { opts += `<option value="${id}">${v.name}</option>`; });
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
        if (!snap.exists()) { div.innerHTML = '<div style="text-align:center;padding:60px 20px"><span class="material-icons-round" style="font-size:48px;color:#555">push_pin</span><h3 style="color:#aaa;margin:16px 0 8px">The board is empty</h3><p style="color:#888;font-size:13px">Pin a notice and everyone in the house gets a notification.</p></div>'; return; }
        let html = ''; const arr = []; snap.forEach(s => { arr.unshift({ key: s.key, ...s.val() }); });
        arr.forEach(n => { html += `<div class="notice-item"><p style="font-size:14px;line-height:1.6;margin:0">${this.esc(n.body || '')}</p><div class="notice-meta"><span>${this.esc(n.author || '')}</span><span>${this.timeAgo(n.createdAt)}</span></div><div class="item-card-actions"><button class="icon-btn" onclick="App.deleteNotice('${n.key}')"><span class="material-icons-round">delete</span></button></div></div>`; });
        div.innerHTML = html;
    },

    showNoticeModal() {
        document.getElementById('modal-title').textContent = 'Post Notice';
        document.getElementById('modal-body').innerHTML = `<div class="form-group"><label>Message</label><textarea id="nt-body" rows="4" placeholder="Write your notice..."></textarea></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveNotice()">Post</button>`;
        this.openModal();
    },

    async saveNotice() {
        const body = document.getElementById('nt-body').value.trim();
        if (!body) { this.toast('Enter a message', 'error'); return; }
        await db.ref(`messes/${this.messId}/notices`).push({ body, author: this.currentUser.displayName || 'Admin', createdAt: Date.now() });
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
        document.getElementById('daily-report').innerHTML = `<div class="report-section"><h5>Meals (${totalMeals})</h5>${rows || '<p>No data</p>'}</div><div class="report-section"><h5>Shopping: \u09F3${totalBazar}</h5></div>${totalMeals > 0 ? `<div class="report-section"><h5>Rate: \u09F3${(totalBazar / totalMeals).toFixed(2)}/meal</h5></div>` : ''}`;
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
        document.getElementById('monthly-report').innerHTML = `<div class="report-section"><h5>Meals (${totalMeals})</h5>${rows}</div><div class="report-section"><h5>Finance</h5><div class="report-row"><span>Shopping</span><span>\u09F3${totalBazar}</span></div><div class="report-row"><span>Expenses</span><span>\u09F3${totalExp}</span></div><div class="report-row report-total"><span>Total</span><span>\u09F3${tc}</span></div></div><div class="report-section"><h5>Rate: \u09F3${rate}/meal</h5></div>`;
    },

    async loadMonthlyOverview() {
        if (!this.messId) return;
        const year = +document.getElementById('monthly-year-select').value;
        const mon = document.getElementById('monthly-month-select').value;
        const month = `${year}-${mon}`;
        const daysInMonth = new Date(year, parseInt(mon), 0).getDate();
        const firstDay = `${month}-01`;
        const lastDay = `${month}-${String(daysInMonth).padStart(2, '0')}`;

        const members = (await db.ref(`messes/${this.messId}/members`).once('value')).val() || {};
        const deposits = (await db.ref(`messes/${this.messId}/deposits`).once('value')).val() || {};

        let totalMeals = 0, totalBazar = 0, totalExp = 0, normalMeals = 0, specialMeals = 0;
        const memberMeals = {}, dailyMeals = {}, dailyBazar = {}, itemMap = {};

        const mlS = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(firstDay).endAt(lastDay).once('value');
        mlS.forEach(d => {
            const dayMeals = d.val() || {};
            const dk = d.key;
            if (!dailyMeals[dk]) dailyMeals[dk] = 0;
            Object.entries(dayMeals).forEach(([mid, ml]) => {
                const t = (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0);
                totalMeals += t;
                normalMeals += t;
                dailyMeals[dk] += t;
                if (!memberMeals[mid]) memberMeals[mid] = 0;
                memberMeals[mid] += t;
            });
        });

        const bzS = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(firstDay).endAt(lastDay).once('value');
        bzS.forEach(s => {
            const b = s.val();
            totalBazar += b.amount || 0;
            const dk = b.dateKey;
            if (!dailyBazar[dk]) dailyBazar[dk] = 0;
            dailyBazar[dk] += b.amount || 0;
            const item = (b.item || '').toLowerCase();
            if (!itemMap[item]) itemMap[item] = { name: b.item, amount: 0, count: 0 };
            itemMap[item].amount += b.amount || 0;
            itemMap[item].count++;
        });

        const exS = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(firstDay).endAt(lastDay).once('value');
        const expenseBreakdown = {};
        exS.forEach(s => {
            const e = s.val();
            totalExp += e.amount || 0;
            const cat = e.category || 'Other';
            expenseBreakdown[cat] = (expenseBreakdown[cat] || 0) + (e.amount || 0);
        });

        const tc = totalBazar + totalExp;
        const rate = totalMeals > 0 ? (tc / totalMeals).toFixed(1) : 0;
        let totalDep = 0;
        Object.values(deposits).forEach(d => { totalDep += d.amount || 0; });

        document.getElementById('analysis-summary').innerHTML = `
            <div class="analysis-stat-card"><p>Total meals</p><strong>${totalMeals}</strong><span>Normal ${normalMeals}</span><span>Special ${specialMeals}</span></div>
            <div class="analysis-stat-card"><p>Total shopping</p><strong>\u09F3${totalBazar}</strong><span>Members \u09F3${totalBazar}</span><span>Manager \u09F30</span></div>
            <div class="analysis-stat-card"><p>Cost per meal</p><strong>\u09F3${rate}</strong><span>Shopping \u09F3${totalBazar}</span><span>\u00F7 Meals ${totalMeals}</span></div>`;

        const spendBreakdown = Object.entries(expenseBreakdown).map(([k, v]) => `${k}: \u09F3${v}`).join('  ');
        document.getElementById('analysis-collection').innerHTML = `
            <h4>Manager collection \u2013 Spending = Balance</h4>
            <div class="analysis-equation">
                <div><strong>\u09F3${totalDep}</strong><small>Collection</small></div>
                <span>\u2013</span>
                <div><strong>\u09F3${tc.toFixed(1)}</strong><small>Spending</small></div>
                <span>=</span>
                <div><strong class="${(totalDep - tc) >= 0 ? 'positive' : 'negative'}">\u09F3${(totalDep - tc).toFixed(1)}</strong><small>Balance</small></div>
            </div>
            <p class="analysis-sub" style="margin-top:10px">Spending breakdown</p>
            <p class="analysis-sub">\u09F3${totalBazar} shopping${spendBreakdown ? ' + ' + spendBreakdown : ''}</p>`;

        let paidIn = 0;
        Object.values(deposits).forEach(d => { paidIn += d.amount || 0; });
        document.getElementById('analysis-paidin').innerHTML = `
            <h4>Members paid in \u2013 Charged = Balance</h4>
            <p class="analysis-sub">What the house took in, and what it actually spent</p>
            <div class="analysis-equation">
                <div><strong>\u09F3${paidIn}</strong><small>Paid in</small></div>
                <span>\u2013</span>
                <div><strong>\u09F3${tc.toFixed(1)}</strong><small>Charged</small></div>
                <span>=</span>
                <div><strong class="${(paidIn - tc) >= 0 ? 'positive' : 'negative'}">\u09F3${(paidIn - tc).toFixed(1)}</strong><small>Balance</small></div>
            </div>
            <p class="analysis-sub" style="margin-top:10px">Charged breakdown</p>
            <p class="analysis-sub">Meals: \u09F3${totalBazar}  Utility: \u09F3${totalExp}</p>`;

        this.renderCharts(year, mon, dailyMeals, dailyBazar, rate);
        this.renderTopItems(itemMap);
        this.renderMemberBalances(memberMeals, deposits, rate);
        this.renderMealShare(memberMeals, totalMeals);
    },

    renderCharts(year, mon, dailyMeals, dailyBazar, currentRate) {
        const daysInMonth = new Date(year, parseInt(mon), 0).getDate();
        const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        const mealData = labels.map(d => { const dk = `${year}-${mon}-${String(d).padStart(2, '0')}`; return dailyMeals[dk] || 0; });
        const bazarData = labels.map(d => { const dk = `${year}-${mon}-${String(d).padStart(2, '0')}`; return dailyBazar[dk] || 0; });

        const chartOpts = { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#888', font: { size: 10 } }, grid: { color: '#2a2a40' } }, y: { ticks: { color: '#888', font: { size: 10 } }, grid: { color: '#2a2a40' } } } };

        const trendCtx = document.getElementById('chart-trend');
        if (trendCtx._chart) trendCtx._chart.destroy();
        trendCtx._chart = new Chart(trendCtx, {
            type: 'line', data: { labels, datasets: [{ data: mealData.map((m, i) => { const b = bazarData[i]; return m > 0 ? +(b / m).toFixed(1) : 0; }), borderColor: '#42a5f5', backgroundColor: 'rgba(66,165,245,0.1)', fill: true, tension: 0.3, pointRadius: 3, pointBackgroundColor: '#42a5f5' }] },
            options: { ...chartOpts, scales: { ...chartOpts.scales, y: { ...chartOpts.scales.y, beginAtZero: true } } }
        });

        const bzCtx = document.getElementById('chart-bazar-day');
        if (bzCtx._chart) bzCtx._chart.destroy();
        bzCtx._chart = new Chart(bzCtx, {
            type: 'bar', data: { labels, datasets: [{ data: bazarData, backgroundColor: '#FFC107', borderRadius: 4 }] },
            options: { ...chartOpts, scales: { ...chartOpts.scales, y: { ...chartOpts.scales.y, beginAtZero: true } } }
        });

        const mlCtx = document.getElementById('chart-meals-day');
        if (mlCtx._chart) mlCtx._chart.destroy();
        mlCtx._chart = new Chart(mlCtx, {
            type: 'bar', data: { labels, datasets: [{ data: mealData, backgroundColor: '#4CAF50', borderRadius: 4 }] },
            options: { ...chartOpts, scales: { ...chartOpts.scales, y: { ...chartOpts.scales.y, beginAtZero: true } } }
        });

        document.getElementById('analysis-bazar-day-total').textContent = `\u09F3${bazarData.reduce((a, b) => a + b, 0)} spent across the month`;
        document.getElementById('analysis-meals-day-total').textContent = `${mealData.reduce((a, b) => a + b, 0)} meals across the month`;

        let prevRate = 0;
        document.getElementById('analysis-trend-label').textContent = prevRate > 0 ? `${Math.abs(((currentRate - prevRate) / prevRate) * 100).toFixed(0)}% vs last month` : '';
    },

    renderTopItems(itemMap) {
        const sorted = Object.values(itemMap).sort((a, b) => b.amount - a.amount).slice(0, 10);
        const max = sorted[0]?.amount || 1;
        const colors = ['#42a5f5', '#4CAF50', '#FFC107', '#26a69a', '#ab47bc', '#ef5350', '#ec407a', '#ff7043', '#78909c', '#5c6bc0'];
        let html = `<h4>Top items by cost</h4><p class="analysis-sub">${sorted.length} items</p>`;
        sorted.forEach((item, i) => {
            const pct = (item.amount / max * 100).toFixed(0);
            html += `<div class="analysis-bar-row"><span class="analysis-bar-name">${this.esc(item.name)}${item.count > 1 ? ' \u00D7' + item.count : ''}</span><div class="analysis-bar-track"><div class="analysis-bar-fill" style="width:${pct}%;background:${colors[i % colors.length]}"></div></div><span class="analysis-bar-amount">\u09F3${item.amount}</span></div>`;
        });
        document.getElementById('analysis-top-items').innerHTML = html || '<p class="empty-state">No bazar data</p>';
    },

    renderMemberBalances(memberMeals, deposits, rate) {
        const maxAbs = Math.max(...Object.keys(memberMeals).map(mid => Math.abs((deposits[mid]?.amount || 0) - (memberMeals[mid] || 0) * parseFloat(rate))), 1);
        let html = '<h4>Member balances</h4><p class="analysis-sub">Green = in credit \u00B7 Red = owes (deposit \u2013 meal cost)</p>';
        Object.entries(memberMeals).forEach(([mid, mm]) => {
            const dep = deposits[mid]?.amount || 0;
            const cost = mm * parseFloat(rate);
            const bal = dep - cost;
            const pct = Math.min(Math.abs(bal) / maxAbs * 50, 50);
            const cls = bal >= 0 ? 'positive' : 'negative';
            const color = bal >= 0 ? '#4CAF50' : '#F44336';
            const align = bal >= 0 ? 'right' : 'left';
            html += `<div class="analysis-balance-row"><span class="analysis-balance-name">${this.esc((memberMeals[mid] !== undefined ? '' : ''))}</span>`;
            html += `<div class="analysis-balance-bar-wrap"><div class="analysis-balance-bar" style="width:${pct}%;background:${color};float:${align}"></div></div>`;
            html += `<span class="analysis-balance-amount ${cls}">\u09F3${bal.toFixed(1)}</span></div>`;
        });
        document.getElementById('analysis-member-balances').innerHTML = html || '<p class="empty-state">No data</p>';
    },

    renderMealShare(memberMeals, totalMeals) {
        if (totalMeals === 0) { document.getElementById('analysis-meal-share').innerHTML = '<p class="empty-state">No meal data</p>'; return; }
        const colors = ['#42a5f5', '#4CAF50', '#FFC107', '#ab47bc', '#ef5350', '#26a69a', '#ec407a', '#ff7043'];
        const entries = Object.entries(memberMeals).sort((a, b) => b[1] - a[1]);
        let html = '<h4>Meal share by member</h4><p class="analysis-sub">Who ate how much of the ' + totalMeals + ' meals</p><div class="analysis-donut-wrap">';

        const canvasSize = 140;
        const cx = canvasSize / 2, cy = canvasSize / 2, r = 55, inner = 35;
        let angle = -Math.PI / 2;
        let paths = '';
        entries.forEach(([mid, mm], i) => {
            const pct = mm / totalMeals;
            const sweep = pct * 2 * Math.PI;
            const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
            const x2 = cx + r * Math.cos(angle + sweep), y2 = cy + r * Math.sin(angle + sweep);
            const ix1 = cx + inner * Math.cos(angle), iy1 = cy + inner * Math.sin(angle);
            const ix2 = cx + inner * Math.cos(angle + sweep), iy2 = cy + inner * Math.sin(angle + sweep);
            const large = sweep > Math.PI ? 1 : 0;
            paths += `<path d="M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${ix2},${iy2} A${inner},${inner} 0 ${large} 0 ${ix1},${iy1} Z" fill="${colors[i % colors.length]}"/>`;
            angle += sweep;
        });
        html += `<svg viewBox="0 0 ${canvasSize} ${canvasSize}" width="${canvasSize}" height="${canvasSize}">${paths}<circle cx="${cx}" cy="${cy}" r="${inner}" fill="#1e1e30"/></svg>`;
        html += '<div class="analysis-donut-legend">';
        entries.forEach(([mid, mm], i) => {
            const pct = ((mm / totalMeals) * 100).toFixed(1);
            html += `<div class="analysis-legend-item"><span class="analysis-legend-dot" style="background:${colors[i % colors.length]}"></span><span class="analysis-legend-name">${this.esc(mid)}</span><span class="analysis-legend-val">${mm} (${pct}%)</span></div>`;
        });
        html += '</div></div>';
        document.getElementById('analysis-meal-share').innerHTML = html;
    },

    async exportAnalysisPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const W = 210, H = 297, ML = 15, CW = 180, MR = ML + CW;
        const year = +document.getElementById('monthly-year-select').value;
        const mon = document.getElementById('monthly-month-select').value;
        const monthStr = `${year}-${mon}`;
        const daysInMonth = new Date(year, parseInt(mon), 0).getDate();
        const firstDay = `${monthStr}-01`;
        const lastDay = `${monthStr}-${String(daysInMonth).padStart(2,'0')}`;
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const monthLabel = `${monthNames[parseInt(mon)-1]}, ${year}`;
        const now = new Date();
        const userName = this.currentUser?.displayName || 'User';

        const members = (await db.ref(`messes/${this.messId}/members`).once('value')).val() || {};
        const allMeals = (await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(firstDay).endAt(lastDay).once('value')).val() || {};
        const bzSnap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(firstDay).endAt(lastDay).once('value');
        const bazaarItems = []; bzSnap.forEach(s => bazaarItems.push({ key: s.key, ...s.val() }));
        const exSnap = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(firstDay).endAt(lastDay).once('value');
        let totalExp = 0; const expenseBreakdown = {};
        exSnap.forEach(s => { const e = s.val(); totalExp += e.amount||0; expenseBreakdown[e.category||'Other'] = (expenseBreakdown[e.category||'Other']||0) + (e.amount||0); });
        const deposits = (await db.ref(`messes/${this.messId}/deposits`).once('value')).val() || {};

        let totalMeals = 0, normalMeals = 0, totalBazar = 0;
        const memberMeals = {};
        Object.entries(allMeals).forEach(([dk, dayMeals]) => {
            Object.entries(dayMeals).forEach(([mid, ml]) => {
                const t = (ml.breakfast||0)+(ml.lunch||0)+(ml.dinner||0);
                totalMeals += t; normalMeals += t;
                memberMeals[mid] = (memberMeals[mid]||0) + t;
            });
        });
        bzSnap.forEach(s => { totalBazar += s.val().amount||0; });
        let totalDep = 0; Object.values(deposits).forEach(d => { totalDep += d.amount||0; });

        let y = 20, totalPages = 0;
        const pages = [];

        function newPage() {
            if (pages.length > 0) { addFooter(); doc.addPage(); }
            pages.push(true);
            y = 20;
        }
        function addFooter() {
            doc.setFontSize(7); doc.setTextColor(150); doc.setFont('helvetica', 'normal');
            doc.text(`Page ${pages.length}`, W / 2, H - 8, { align: 'center' });
        }
        function checkPage(need) { if (y + need > H - 15) { addFooter(); doc.addPage(); pages.push(true); y = 20; } }
        function line(color, thickness) {
            doc.setDrawColor(...(color || [200,200,200])); doc.setLineWidth(thickness || 0.2);
            doc.line(ML, y, MR, y); y += 2;
        }
        function thickLine() {
            doc.setDrawColor(255, 193, 7); doc.setLineWidth(0.8);
            doc.line(ML, y, MR, y); y += 3;
        }
        function sectionTitle(t) {
            checkPage(12);
            doc.setFontSize(15); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
            doc.text(t, ML, y); y += 3; thickLine(); y += 3;
        }
        function subSectionTitle(t) {
            checkPage(8);
            doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
            doc.text(t, ML, y); y += 6;
        }
        function row(label, value, valColor) {
            checkPage(6);
            doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(80);
            doc.text(label, ML + 2, y);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...(valColor || [0]));
            doc.text(String(value), MR - 2, y, { align: 'right' });
            y += 5;
        }
        function tableHeader(cols, widths) {
            doc.setFillColor(255, 193, 7);
            doc.rect(ML, y, CW, 7, 'F');
            doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
            let x = ML + 2;
            cols.forEach((c, i) => { doc.text(c, x, y + 5); x += widths[i]; });
            y += 7;
        }
        function tableRow(vals, widths, colors) {
            checkPage(5);
            let x = ML + 2;
            doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
            vals.forEach((v, i) => {
                doc.setTextColor(...(colors?.[i] || [60]));
                doc.text(String(v), x, y + 3.5);
                x += widths[i];
            });
            y += 5;
        }

        try {
        newPage();

        // === PAGE 1: HEADER ===
        doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(50, 50, 50);
        doc.text('Bachelors\' Meal Manager', ML, y); y += 8;
        doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(80);
        doc.text(`House: ${this.messName || 'My Mess'}    Month: ${monthLabel}`, ML, y); y += 5;
        doc.text(`Report generated on ${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, ML, y); y += 5;
        doc.text(`Report generated by ${userName}`, ML, y); y += 5;
        thickLine(); y += 2;

        // === SUMMARY ===
        sectionTitle('Summary');
        const rate = totalMeals > 0 ? (totalBazar / totalMeals).toFixed(1) : 0;
        row('Total meals', totalMeals);
        row(`Cost per meal`, `\u09F3 ${rate}`);
        row('Total shopping (expense)', `\u09F3 ${totalBazar}`);
        row('Total utility (expense)', `\u09F3 ${totalExp}`);
        row('Manager collection', `\u09F3 ${totalDep}`);
        row('Remaining money on manager', `\u09F3 ${(totalDep - totalBazar - totalExp).toFixed(1)}`,
            (totalDep - totalBazar - totalExp) >= 0 ? [76, 175, 80] : [244, 67, 54]);
        y += 5;

        // === ANALYSIS ===
        sectionTitle('Analysis');
        doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
        doc.text(`Cost per meal: \u09F3 ${rate}    (Total shopping \u09F3 ${totalBazar} / ${totalMeals} meals)`, ML, y); y += 8;

        // 6-month trend table
        subSectionTitle('Cost per meal trend \u2014 last 6 months');
        const trendData = [];
        const trendPromises = [];
        for (let i = 5; i >= 0; i--) {
            const td = new Date(year, parseInt(mon) - 1 - i, 1);
            const tm = `${td.getFullYear()}-${String(td.getMonth()+1).padStart(2,'0')}`;
            const tdDays = new Date(td.getFullYear(), td.getMonth()+1, 0).getDate();
            trendPromises.push(
                Promise.all([
                    db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(`${tm}-01`).endAt(`${tm}-${String(tdDays).padStart(2,'0')}`).once('value'),
                    db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(`${tm}-01`).endAt(`${tm}-${String(tdDays).padStart(2,'0')}`).once('value')
                ]).then(([mSnap, bSnap]) => {
                    let tm2 = 0, tb2 = 0;
                    mSnap.forEach(d => { Object.values(d.val()||{}).forEach(ml => { tm2 += (ml.breakfast||0)+(ml.lunch||0)+(ml.dinner||0); }); });
                    bSnap.forEach(s => { tb2 += s.val().amount||0; });
                    trendData.push({ label: `${monthNames[td.getMonth()]}, ${td.getFullYear()}`, meals: tm2, bazar: tb2, rate: tm2 > 0 ? (tb2/tm2).toFixed(1) : '0' });
                })
            );
        }
        await Promise.all(trendPromises);

        const tCols = ['Month', 'Meals', 'Shopping', 'Cost/meal'];
        const tWidths = [55, 30, 50, 45];
        tableHeader(tCols, tWidths);
        trendData.forEach(t => {
            tableRow([t.label, t.meals, `\u09F3 ${t.bazar}`, `\u09F3 ${t.rate}`], tWidths);
        });
        y += 5;

        // Member balances table
        subSectionTitle('Member balances (negative = owes)');
        const mbCols = ['Member', 'Meals', 'Deposited', 'Meal cost', 'Utility', 'Balance'];
        const mbWidths = [35, 18, 32, 32, 28, 35];
        tableHeader(mbCols, mbWidths);
        const memberEntries = Object.entries(memberMeals);
        const utilityPerMember = memberEntries.length > 0 ? (totalExp / memberEntries.length).toFixed(0) : 0;
        memberEntries.forEach(([mid, mm]) => {
            const dep = deposits[mid]?.amount || 0;
            const cost = mm * parseFloat(rate);
            const util = utilityPerMember;
            const bal = dep - cost - util;
            const mname = members[mid]?.name || mid;
            tableRow([mname, String(mm), `\u09F3 ${dep}`, `\u09F3 ${cost.toFixed(1)}`, `\u09F3 ${util}`, `\u09F3 ${bal.toFixed(1)}`],
                mbWidths, [null, null, null, null, null, bal >= 0 ? [76,175,80] : [244,67,54]]);
        });
        y += 5;

        // === MEAL SECTION ===
        newPage();
        sectionTitle('Meal');
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
        doc.text(`Grand total Meals: ${totalMeals}`, ML, y); y += 8;

        const mCols = ['Total', '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
        const typeW = 14, totalW = 10, dayW = (CW - typeW - totalW) / 31;
        const mWidths = [typeW, totalW, ...Array(31).fill(dayW)];

        for (const [mid, mm] of memberEntries) {
            const mname = members[mid]?.name || mid;
            checkPage(22);
            subSectionTitle(`${mname}  (Total meals: ${mm})`);
            tableHeader(mCols, mWidths);
            ['breakfast', 'lunch', 'dinner'].forEach(meal => {
                const label = meal === 'breakfast' ? 'B.Fast' : meal === 'lunch' ? 'Lunch' : 'Dinner';
                let total = 0;
                const cells = [];
                for (let d = 1; d <= 31; d++) {
                    const dk = `${monthStr}-${String(d).padStart(2,'0')}`;
                    const dayMeals = allMeals[dk] || {};
                    const val = (dayMeals[mid] && dayMeals[mid][meal]) || 0;
                    total += val;
                    cells.push(val > 0 ? String(val) : '');
                }
                tableRow([label, String(total), ...cells], mWidths);
            });
            y += 4;
        }

        // === SHOPPING SECTION ===
        newPage();
        sectionTitle('Shopping');
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
        doc.text(`Total Shopping Cost: \u09F3 ${totalBazar}`, ML, y); y += 5;
        const buyerTotals = {};
        bazaarItems.forEach(b => { const n = b.buyer || 'Unknown'; buyerTotals[n] = (buyerTotals[n]||0) + (b.amount||0); });
        Object.entries(buyerTotals).forEach(([name, amt]) => {
            doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(60);
            doc.text(`${name}: \u09F3 ${amt}`, ML + 2, y); y += 5;
        });
        y += 2;

        const bCols = ['Date', 'Money from', 'Added by', 'Item', 'Cost'];
        const bWidths = [38, 35, 40, 42, 25];
        tableHeader(bCols, bWidths);
        bazaarItems.forEach(b => {
            const d = new Date(b.dateKey + 'T00:00:00');
            const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
            checkPage(5);
            tableRow([dateStr, b.buyer || '', b.doneBy || '', b.item || '', `\u09F3 ${b.amount||0}`], bWidths);
        });
        y += 5;

        // === MANAGER MONEY ===
        newPage();
        sectionTitle('Manager money');
        doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
        doc.text(`Total Manager Money: \u09F3 ${totalDep}`, ML, y); y += 5;
        const remaining = totalDep - totalBazar - totalExp;
        doc.setTextColor(remaining >= 0 ? 76 : 244, remaining >= 0 ? 175 : 67, remaining >= 0 ? 80 : 54);
        doc.text(`Remaining Money on Manager: \u09F3 ${remaining.toFixed(1)}`, ML, y); y += 6;
        Object.entries(deposits).forEach(([mid, dep]) => {
            const mname = members[mid]?.name || mid;
            doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(60);
            doc.text(`${mname}: \u09F3 ${dep.amount||0}`, ML + 2, y); y += 5;
        });
        y += 2;

        const dCols = ['Member', 'Amount'];
        const dWidths = [120, 60];
        tableHeader(dCols, dWidths);
        Object.entries(deposits).forEach(([mid, dep]) => {
            const mname = members[mid]?.name || mid;
            tableRow([mname, `\u09F3 ${dep.amount||0}`], dWidths);
        });

        // Page numbers
        totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(7); doc.setTextColor(150); doc.setFont('helvetica', 'normal');
            doc.text(`Page ${i} of ${totalPages}`, W / 2, H - 8, { align: 'center' });
        }

        doc.save(`Mess Manager_${this.messName || 'Mess'}_${monthNames[parseInt(mon)-1]}_${year}.pdf`);
        this.toast('PDF exported!', 'success');
        } catch (e) { console.error('PDF export error:', e); this.toast('PDF export failed: ' + e.message, 'error'); }
    },

    dk(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; },
    mk(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; },
    fmtDate(d) { return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); },
    fmtMonth(d) { return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }); },
    timeAgo(ts) { if (!ts) return ''; const d = Date.now() - ts, m = Math.floor(d / 60000); if (m < 1) return 'now'; if (m < 60) return m + 'm'; const h = Math.floor(m / 60); if (h < 24) return h + 'h'; const dy = Math.floor(h / 24); return dy < 7 ? dy + 'd' : new Date(ts).toLocaleDateString(); },
    esc(s) { return s ? String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : ''; },

    sortedMembers(members) {
        const entries = Object.entries(members);
        entries.sort((a, b) => {
            const aAdmin = a[1].role === 'admin' ? 0 : 1;
            const bAdmin = b[1].role === 'admin' ? 0 : 1;
            if (aAdmin !== bAdmin) return aAdmin - bAdmin;
            return (a[1].name || '').localeCompare(b[1].name || '');
        });
        return entries;
    },
    openModal() { document.getElementById('modal-overlay').classList.add('active'); },
    closeModal() { document.getElementById('modal-overlay').classList.remove('active'); },

    toggleCollapse(id) {
        const card = document.getElementById(id);
        if (!card) return;
        card.classList.toggle('collapsed');
    },

    toast(msg, type = 'info') { const c = document.getElementById('toast-container'); const t = document.createElement('div'); t.className = `toast ${type}`; t.textContent = msg; c.appendChild(t); setTimeout(() => t.remove(), 3500); }
};

document.addEventListener('DOMContentLoaded', () => App.init());
