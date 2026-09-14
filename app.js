const App = {
    currentUser: null, messId: null, messCode: null, messName: null,
    currentPage: 'dashboard', userRole: 'member',

    async init() {
        const splash = document.getElementById('splash-screen');
        if (typeof firebaseConfig === 'undefined' || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY_HERE') {
            this.showScreen('auth-screen');
            document.querySelector('.auth-container').innerHTML = '<div class="auth-header"><div class="auth-logo"><span class="material-icons-round">warning</span></div><h1>Firebase Setup Required</h1><p style="margin-top:12px">Edit <code>firebase-config.js</code></p></div>';
            if (splash) { splash.classList.add('hidden'); setTimeout(() => splash.remove(), 400); }
            return;
        }
        try { await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) { /* ignore */ }
        this.handleRedirectResult();
        this.bindEvents();
        this.bindBackButton();
        auth.onAuthStateChanged(user => {
            if (user) {
                this.currentUser = user;
                this.loadMyMesses();
            } else {
                this.currentUser = null;
                this.messId = null;
                this.showScreen('auth-screen');
                if (splash) { splash.classList.add('hidden'); setTimeout(() => splash.remove(), 400); }
            }
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
        $('modal-close').addEventListener('click', () => this.closeModal());
        $('modal-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) this.closeModal(); });
    },

    showScreen(id) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(id).classList.add('active'); },

    bindBackButton() {
        window.addEventListener('popstate', () => {
            if (!document.getElementById('app-screen')?.classList.contains('active')) return;
            if (this.currentPage && this.currentPage !== 'dashboard') this.navigate('dashboard');
        });
        const hwBack = () => {
            const appActive = document.getElementById('app-screen')?.classList.contains('active');
            if (document.getElementById('bz-overlay')) { this.bzClose(); return; }
            const modal = document.getElementById('modal-overlay');
            if (modal && modal.classList.contains('active')) { this.closeModal(); return; }
            if (appActive && this.currentPage && this.currentPage !== 'dashboard') {
                this.navigate('dashboard');
            } else if (appActive && this.currentPage === 'dashboard') {
                this.signOut();
            }
        };
        document.addEventListener('backbutton', hwBack, false);
        try {
            if (window.Capacitor?.Plugins?.App) {
                window.Capacitor.Plugins.App.addListener('backButton', hwBack);
            }
        } catch (e) { /* not running in Capacitor */ }
    },

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
            if (window.Capacitor?.Plugins?.GoogleAuth) {
                const result = await window.Capacitor.Plugins.GoogleAuth.signIn();
                const credential = firebase.auth.GoogleAuthProvider.credential(result.authentication.idToken);
                const c = await auth.signInWithCredential(credential);
                const s = await db.ref(`users/${c.user.uid}`).once('value');
                if (!s.exists()) await db.ref(`users/${c.user.uid}`).set({ name: c.user.displayName || result.displayName, email: c.user.email || result.email, createdAt: Date.now() });
            } else if (window.Capacitor?.isNativePlatform && window.Capacitor.isNativePlatform()) {
                const p = new firebase.auth.GoogleAuthProvider();
                await auth.signInWithRedirect(p);
            } else {
                const p = new firebase.auth.GoogleAuthProvider();
                const c = await auth.signInWithPopup(p);
                const s = await db.ref(`users/${c.user.uid}`).once('value');
                if (!s.exists()) await db.ref(`users/${c.user.uid}`).set({ name: c.user.displayName, email: c.user.email, createdAt: Date.now() });
            }
        }
        catch (e) { let m = e.message; if (e.code === 'auth/popup-closed-by-user') m = 'Cancelled'; this.toast(m, 'error'); }
        finally { btn.innerHTML = orig; btn.disabled = false; }
    },

    async handleRedirectResult() {
        try {
            const result = await auth.getRedirectResult();
            if (result && result.user) {
                const s = await db.ref(`users/${result.user.uid}`).once('value');
                if (!s.exists()) await db.ref(`users/${result.user.uid}`).set({ name: result.user.displayName, email: result.user.email, createdAt: Date.now() });
            }
        } catch (e) { /* ignore */ }
    },

    async sendResetEmail() {
        const email = document.getElementById('reset-email').value.trim();
        if (!email) { this.toast('Enter email', 'error'); return; }
        try { await auth.sendPasswordResetEmail(email); this.toast('Reset link sent!', 'success'); setTimeout(() => this.showScreen('auth-screen'), 2000); }
        catch (e) { this.toast(e.message, 'error'); }
    },

    async loadMyMesses() {
        if (!this.currentUser) return;
        const splash = document.getElementById('splash-screen');
        try {
            const snap = await db.ref(`users/${this.currentUser.uid}/messes`).once('value');
            const data = snap.val() || {};
            const ids = Object.keys(data);
            if (ids.length === 1) { this.enterMess(ids[0]); return; }
            if (splash) { splash.classList.add('hidden'); setTimeout(() => splash.remove(), 400); }
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
            if (splash) { splash.classList.add('hidden'); setTimeout(() => splash.remove(), 400); }
            this.showScreen('mess-select-screen');
            document.getElementById('my-messes-list').innerHTML = '<div class="card-body"><p class="empty-state">No mess yet. Create or join one below.</p></div>';
        } catch (e) {
            console.error('loadMyMesses error:', e);
            if (splash) { splash.classList.add('hidden'); setTimeout(() => splash.remove(), 400); }
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
        if (!confirm('Are you sure you want to leave this mess?')) return;
        if (!this.messId || !this.currentUser) return;
        try {
            await db.ref(`messes/${this.messId}/members/${this.currentUser.uid}`).remove();
            await db.ref(`users/${this.currentUser.uid}/messes/${this.messId}`).remove();
            this.toast('Left mess', 'success');
            this.messId = null; this.messCode = null; this.messName = null;
            this.loadMyMesses();
        } catch (e) { this.toast('Error leaving mess', 'error'); }
    },

    async createMess() {
        const name = document.getElementById('create-mess-name').value.trim();
        if (!name) { this.toast('Enter mess name', 'error'); return; }
        const btn = document.getElementById('create-mess-btn');
        btn.textContent = 'Creating...'; btn.disabled = true;
        try {
            const code = this.genCode(6);
            const ref = db.ref('messes').push();
            const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('Connection timeout')), 15000));
            const write = ref.set({
                settings: { messName: name, messCode: code, owner: this.currentUser.uid, createdAt: Date.now() },
                members: { [this.currentUser.uid]: { name: this.currentUser.displayName || 'Admin', email: this.currentUser.email, role: 'admin', joinedAt: Date.now() } }
            });
            await Promise.race([write, timeout]);
            await Promise.race([db.ref(`users/${this.currentUser.uid}/messes/${ref.key}`).set({ role: 'admin', joinedAt: Date.now() }), timeout]);
            this.toast('Mess created!', 'success');
            document.getElementById('create-mess-name').value = '';
            this.enterMess(ref.key);
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
        finally { btn.textContent = 'Create Mess'; btn.disabled = false; }
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
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
        finally { btn.textContent = 'Join Mess'; btn.disabled = false; }
    },

    genCode(n) { const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let r = ''; for (let i = 0; i < n; i++) r += c[Math.floor(Math.random() * c.length)]; return r; },

    showApp() {
        this.showScreen('app-screen');
        const splash = document.getElementById('splash-screen');
        if (splash) { splash.classList.add('hidden'); setTimeout(() => splash.remove(), 400); }
        try { history.pushState({ app: true }, ''); } catch (e) { /* ignore */ }
        this.navigate('dashboard');
    },

    navigate(page) {
        this.currentPage = page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const pg = document.getElementById('page-' + page);
        if (pg) pg.classList.add('active');
        document.querySelectorAll('.bottom-nav-item').forEach(n => n.classList.remove('active'));
        const bni = document.querySelector(`.bottom-nav-item[data-page="${page}"]`);
        if (bni) bni.classList.add('active');
        document.getElementById('app-screen').classList.toggle('on-dashboard', page === 'dashboard');
        document.getElementById('app-screen').classList.toggle('on-notices', page === 'notices');
        document.getElementById('app-screen').classList.toggle('on-duty', page === 'duty');
        document.getElementById('app-screen').classList.toggle('on-members', page === 'members');
        const titles = { dashboard: 'Dashboard', members: 'Flat', meals: 'Meal', bazaar: 'Bazar', balance: 'Manager', notices: 'Notice Board', monthly: 'Analysis', profile: 'Profile', duty: 'Bazar Today' };
        document.getElementById('page-title').textContent = titles[page] || page.charAt(0).toUpperCase() + page.slice(1);
        if (page !== 'dashboard') { try { history.replaceState({ page }, ''); } catch (e) { /* ignore */ } }
        document.getElementById('app-screen').classList.toggle('on-bazaar', page === 'bazaar');
        document.getElementById('app-screen').classList.toggle('on-balance', page === 'balance');
        document.getElementById('app-screen').classList.toggle('on-profile', page === 'profile');
        document.getElementById('app-screen').classList.toggle('on-addmeal', page === 'addmeal');
        if (page === 'dashboard') this.loadDashboard();
        if (page === 'notices') this.loadNotices();
        if (page === 'duty') this.loadDuty();
        if (page === 'members') this.loadFlat();
        if (page === 'meals') this.loadMeals();
        if (page === 'addmeal') this.loadAddMeal();
        if (page === 'bazaar') this.loadBazarList();
        if (page === 'balance') this.loadManagerMoney();
        if (page === 'profile') this.loadProfile();
    },

    async loadNotices() {
        if (!this.messId) return;
        const div = document.getElementById('notices-list');
        try {
            const snap = await db.ref(`messes/${this.messId}/notices`).orderByChild('createdAt').limitToLast(50).once('value');
            if (!snap.exists()) {
                div.innerHTML = `<div class="anotice-empty">
                    <span class="material-icons-round">push_pin</span>
                    <h3>The board is empty</h3>
                    <p>Pin a notice and everyone in the house gets a notification.</p>
                </div>`;
                return;
            }
            const arr = [];
            snap.forEach(s => { arr.unshift({ key: s.key, ...s.val() }); });
            div.innerHTML = arr.map(n => {
                const when = n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
                return `<div class="anotice-card">
                    <p>${this.esc(n.body || '')}</p>
                    <div class="anotice-meta">
                        <span>${this.esc(n.author || '')}${when ? ' · ' + when : ''}</span>
                        <button class="anotice-del" onclick="App.deleteNotice('${n.key}')"><span class="material-icons-round">delete</span></button>
                    </div>
                </div>`;
            }).join('');
        } catch (e) { console.error('loadNotices error:', e); }
    },

    showNoticeModal() {
        document.getElementById('modal-title').textContent = 'Pin a notice';
        document.getElementById('modal-body').innerHTML = `
            <div class="form-group"><label style="color:#888">Notice for the whole house</label>
            <textarea id="notice-body" rows="4" placeholder="Write the notice here..."></textarea></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-modal-add" onclick="App.saveNotice()">Pin</button>`;
        this.openModal();
    },

    async saveNotice() {
        const body = document.getElementById('notice-body').value.trim();
        if (!body) { this.toast('Write something first', 'error'); return; }
        try {
            await db.ref(`messes/${this.messId}/notices`).push({
                body,
                author: this.currentUser?.displayName || 'Manager',
                createdAt: Date.now()
            });
            this.closeModal(); this.loadNotices(); this.toast('Notice pinned!', 'success');
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async deleteNotice(key) {
        if (!confirm('Remove this notice?')) return;
        try {
            await db.ref(`messes/${this.messId}/notices/${key}`).remove();
            this.loadNotices(); this.toast('Notice removed', 'success');
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    shortMon(d) { return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]; },

    async loadDuty() {
        if (!this.messId) return;
        try {
            const now = new Date();
            const month = this.mk(now);
            const shortMon = this.shortMon(now);
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
            const members = membersSnap.val() || {};
            const mids = Object.keys(members);
            const dutySnap = await db.ref(`messes/${this.messId}/bazarDuty`).once('value');
            const dutyAll = dutySnap.val() || {};
            const duty = {};
            Object.entries(dutyAll).forEach(([dk, mid]) => { if (dk.startsWith(month)) duty[dk] = mid; });

            const todayKey = this.dk(now);
            const tMid = duty[todayKey];
            const tName = (tMid && members[tMid] && members[tMid].name) || null;
            document.getElementById('duty-banner').innerHTML =
                `<span class="material-icons-round">event</span><p><strong>Bazar today (${now.getDate()} ${shortMon}):</strong> ` +
                (tName ? this.esc(tName) : '<span class="unassigned">Nobody assigned</span>') + `</p>`;

            const assignedDays = new Set(Object.keys(duty).map(dk => parseInt(dk.slice(8, 10), 10)));
            let chips = '';
            for (let d = 1; d <= daysInMonth; d++) {
                if (!assignedDays.has(d)) chips += `<span class="aduty-chip">${d} ${shortMon}</span>`;
            }
            document.getElementById('duty-unassigned').innerHTML = chips || '<p class="aduty-none">All dates assigned</p>';

            const byMid = {};
            Object.entries(duty).forEach(([dk, mid]) => { (byMid[mid] = byMid[mid] || []).push(dk); });
            document.getElementById('duty-members').innerHTML = mids.map(mid => {
                const name = (members[mid] || {}).name || 'Unknown';
                const days = (byMid[mid] || []).sort();
                const body = days.length
                    ? `<div class="aduty-chips">` + days.map(dk => `<span class="aduty-chip mine">${parseInt(dk.slice(8, 10), 10)} ${shortMon}</span>`).join('') + `</div>`
                    : `<p class="aduty-none">No dates yet — tap edit to assign</p>`;
                return `<div class="aduty-member">
                    <div class="aduty-member-top">
                        <span class="material-icons-round person">person</span>
                        <strong>${this.esc(name)}</strong>
                        <span class="aduty-days">${days.length} day${days.length === 1 ? '' : 's'}</span>
                        <button class="icon-btn red" onclick="App.openDutyEditor('${mid}')"><span class="material-icons-round">edit_calendar</span></button>
                        ${days.length ? `<button class="icon-btn dark" onclick="App.clearDuty('${mid}')"><span class="material-icons-round">delete</span></button>` : ''}
                    </div>
                    ${body}
                </div>`;
            }).join('') || '<p class="empty-state">No members</p>';
        } catch (e) { console.error('loadDuty error:', e); }
    },

    async openDutyEditor(mid) {
        if (!this.messId) return;
        const now = new Date();
        const month = this.mk(now);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const mSnap = await db.ref(`messes/${this.messId}/members/${mid}/name`).once('value');
        const dutySnap = await db.ref(`messes/${this.messId}/bazarDuty`).once('value');
        const dutyAll = dutySnap.val() || {};
        const duty = {};
        Object.entries(dutyAll).forEach(([dk, m]) => { if (dk.startsWith(month)) duty[dk] = m; });
        this.dutyEdit = { mid, month, daysInMonth, name: mSnap.val() || 'Member', duty };
        this.renderDutyEditor();
        this.openModal();
    },

    renderDutyEditor() {
        const { mid, month, daysInMonth, name, duty } = this.dutyEdit;
        let chips = '';
        for (let d = 1; d <= daysInMonth; d++) {
            const dk = `${month}-${String(d).padStart(2, '0')}`;
            const assigned = duty[dk];
            const cls = assigned === mid ? 'mine' : (assigned ? 'taken' : '');
            chips += `<button class="aduty-pick ${cls}" onclick="App.toggleDutyDay('${dk}')">${d}</button>`;
        }
        document.getElementById('modal-title').textContent = `Assign dates — ${name}`;
        document.getElementById('modal-body').innerHTML = `
            <div class="aduty-legend"><span><i style="background:#0b3d91"></i>yours</span><span><i style="background:transparent;border:1px dashed #888"></i>taken (tap to take over)</span></div>
            <div class="aduty-pick-grid">${chips}</div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-modal-add" onclick="App.closeModal();App.loadDuty()">Done</button>`;
    },

    async toggleDutyDay(dk) {
        const { mid, duty } = this.dutyEdit;
        try {
            if (duty[dk] === mid) {
                delete duty[dk];
                await db.ref(`messes/${this.messId}/bazarDuty/${dk}`).remove();
            } else {
                duty[dk] = mid;
                await db.ref(`messes/${this.messId}/bazarDuty/${dk}`).set(mid);
            }
            this.renderDutyEditor();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async clearDuty(mid) {
        if (!confirm('Remove all bazar dates for this member?')) return;
        try {
            const now = new Date();
            const month = this.mk(now);
            const snap = await db.ref(`messes/${this.messId}/bazarDuty`).once('value');
            const removals = [];
            snap.forEach(s => { if (s.key.startsWith(month) && s.val() === mid) removals.push(db.ref(`messes/${this.messId}/bazarDuty/${s.key}`).remove()); });
            await Promise.all(removals);
            this.loadDuty(); this.toast('Dates cleared', 'success');
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    // ==================== FLAT PAGE ====================
    switchFlatTab(tab) {
        document.querySelectorAll('.aflat-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        document.getElementById('flat-tab-members').style.display = tab === 'members' ? '' : 'none';
        document.getElementById('flat-tab-peoples').style.display = tab === 'peoples' ? '' : 'none';
        document.getElementById('flat-tab-permissions').style.display = tab === 'permissions' ? '' : 'none';
    },

    async loadFlat() {
        if (!this.messId) return;
        try {
            const sSnap = await db.ref(`messes/${this.messId}/settings`).once('value');
            const s = sSnap.val() || {};
            document.getElementById('flat-mess-name').textContent = s.messName || 'My Mess';
            document.getElementById('flat-mess-code').textContent = s.messCode || '------';

            const mSnap = await db.ref(`messes/${this.messId}/members`).once('value');
            const members = mSnap.val() || {};
            const mids = Object.keys(members);
            let adminName = '-';
            const admin = mids.find(id => members[id] && members[id].role === 'admin');
            if (admin) adminName = members[admin].name || '-';
            document.getElementById('flat-manager-name').textContent = adminName;

            document.getElementById('flat-member-count').textContent = mids.length;
            const list = document.getElementById('flat-member-list');
            if (!mids.length) { list.innerHTML = '<p class="empty-state" style="padding:20px;text-align:center;color:#999">No members yet</p>'; }
            else {
                list.innerHTML = mids.map(id => {
                    const m = members[id] || {};
                    return `<div class="aflat-member-item">
                        <span class="name">${this.esc(m.name || 'Unknown')}</span>
                        <button class="aflat-remove" onclick="App.editFlatMember('${id}','${this.esc(m.name || '')}')"><span class="material-icons-round">edit</span></button>
                        <button class="aflat-remove" onclick="App.removeFlatMember('${id}')"><span class="material-icons-round">close</span></button>
                    </div>`;
                }).join('');
            }

            document.getElementById('flat-add-member-input').value = '';
            document.getElementById('flat-name-count').textContent = '0/20';
            document.getElementById('flat-add-member-input').oninput = function() {
                document.getElementById('flat-name-count').textContent = this.value.length + '/20';
            };

            this.loadFlatPeoples(members);
            this.loadFlatPermissions(members);
        } catch (e) { console.error('loadFlat error:', e); }
    },

    async addFlatMember() {
        const inp = document.getElementById('flat-add-member-input');
        const name = inp.value.trim();
        if (!name) { this.toast('Enter a name', 'error'); return; }
        if (!/^[a-zA-Z0-9 ]+$/.test(name)) { this.toast('Letters, numbers & spaces only', 'error'); return; }
        try {
            const mSnap = await db.ref(`messes/${this.messId}/members`).once('value');
            const members = mSnap.val() || {};
            const exists = Object.values(members).some(m => m && m.name && m.name.toLowerCase() === name.toLowerCase());
            if (exists) { this.toast('Name already exists', 'error'); return; }
            const tempId = 'member_' + Date.now();
            await db.ref(`messes/${this.messId}/members/${tempId}`).set({ name, addedBy: this.currentUser.uid, addedAt: Date.now() });
            this.toast('Member added!', 'success');
            this.loadFlat();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async editFlatMember(id, currentName) {
        const name = prompt('Rename member:', currentName);
        if (!name || !name.trim()) return;
        if (name.trim() === currentName) return;
        try {
            await db.ref(`messes/${this.messId}/members/${id}/name`).set(name.trim());
            this.loadFlat();
            this.toast('Member renamed', 'success');
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async removeFlatMember(id) {
        if (!confirm('Remove this member?')) return;
        try {
            await db.ref(`messes/${this.messId}/members/${id}`).remove();
            this.toast('Member removed', 'success');
            this.loadFlat();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async loadFlatPeoples(members) {
        if (!this.messId) return;
        const div = document.getElementById('flat-peoples-list');
        try {
            const mids = Object.keys(members);
            const appUsers = mids.filter(id => !id.startsWith('member_'));
            appUsers.sort((a, b) => ((members[a] || {}).name || '').localeCompare((members[b] || {}).name || ''));
            document.getElementById('flat-peoples-count').textContent = appUsers.length;
            if (!appUsers.length) { div.innerHTML = '<p class="empty-state" style="padding:20px;text-align:center;color:#999">No peoples have joined yet</p>'; return; }
            const colors = ['#E53935','#1565C0','#2E7D32','#FF9800','#7B1FA2','#00838F'];
            let html = '';
            for (let i = 0; i < appUsers.length; i++) {
                const id = appUsers[i];
                const m = members[id] || {};
                let u = {};
                try { const uSnap = await db.ref(`users/${id}`).once('value'); u = uSnap.val() || {}; } catch (e) { /* user record may not exist */ }
                const initial = ((m.name || u.name || '?')[0] || '?').toUpperCase();
                const isAdmin = m.role === 'admin';
                const color = colors[i % colors.length];
                const email = u.email || m.email || '';
                const isYou = id === this.currentUser.uid;
                html += `<div class="aflat-people-item">
                    <div class="aflat-people-avatar" style="background:${color}">${initial}</div>
                    <div class="aflat-people-info">
                        <h4>${this.esc(m.name || 'Unknown')} ${isAdmin ? '<span class="role-badge">(Manager' + (isYou ? ', You' : '') + ')</span>' : ''}</h4>
                        <div class="email">${this.esc(email)}</div>
                    </div>
                    <span class="material-icons-round chevron">chevron_right</span>
                </div>`;
            }
            div.innerHTML = html;
        } catch (e) { console.error('loadFlatPeoples error:', e); }
    },

    async loadFlatPermissions(members) {
        if (!this.messId) return;
        const div = document.getElementById('flat-permissions-list');
        try {
            const mids = Object.keys(members).filter(id => !id.startsWith('member_'));
            mids.sort((a, b) => ((members[a] || {}).name || '').localeCompare((members[b] || {}).name || ''));
            if (!mids.length) { div.innerHTML = '<p class="empty-state" style="padding:20px;text-align:center;color:#999">No peoples to set permissions for</p>'; return; }
            const pSnap = await db.ref(`messes/${this.messId}/permissions`).once('value');
            const perms = pSnap.val() || {};
            const permKeys = ['manage', 'mealEntry', 'mealEdit', 'bazarEntry', 'specialMeal', 'togglePerms'];
            const permLabels = ['Manage Peoples and Members', 'Meal Entry', 'Meal Edit', 'Bazar Entry', 'Special Meal Management', 'Turn on/off Permissions'];
            const colors = ['#E53935','#1565C0','#2E7D32','#FF9800','#7B1FA2','#00838F'];
            div.innerHTML = mids.map((id, i) => {
                const m = members[id] || {};
                const isAdmin = m.role === 'admin';
                const initial = ((m.name || '?')[0] || '?').toUpperCase();
                const color = colors[i % colors.length];
                const userPerms = perms[id] || {};
                const checks = permKeys.map((k, j) => {
                    const checked = isAdmin || userPerms[k];
                    return `<div class="aflat-perm-row">
                        <div class="aflat-perm-check ${checked ? 'checked' : ''}" onclick="App.togglePerm('${id}','${k}',this)" ${isAdmin ? 'style="pointer-events:none;opacity:.5"' : ''}>
                            <span class="material-icons-round">check</span>
                        </div>
                        <span class="aflat-perm-label">${permLabels[j]}</span>
                    </div>`;
                }).join('');
                return `<div class="aflat-perm-card">
                    <div class="aflat-perm-top">
                        <div class="aflat-perm-avatar" style="background:${color}">${initial}</div>
                        <div class="aflat-perm-name">${this.esc(m.name || 'Unknown')} ${isAdmin ? '<span class="role-badge">(Manager, You)</span>' : ''}</div>
                    </div>
                    <div class="aflat-perm-list">${checks}</div>
                </div>`;
            }).join('');
        } catch (e) { console.error('loadFlatPermissions error:', e); }
    },

    async togglePerm(uid, key, el) {
        if (!this.messId) return;
        try {
            const isChecked = el.classList.toggle('checked');
            await db.ref(`messes/${this.messId}/permissions/${uid}/${key}`).set(isChecked);
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    timeAgo(d) {
        const diff = Math.floor((Date.now() - d.getTime()) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
        if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
        return Math.floor(diff / 86400) + ' days ago';
    },

    async editMessName() {
        const name = prompt('Enter new mess name:', this.messName || '');
        if (!name || !name.trim()) return;
        try {
            await db.ref(`messes/${this.messId}/settings/messName`).set(name.trim());
            this.messName = name.trim();
            document.getElementById('flat-mess-name').textContent = name.trim();
            this.toast('Mess name updated', 'success');
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    dk(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
    mk(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); },
    fmtMonth(d) { return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); },
    fmtNum(n) { const r = Math.round((n || 0) * 10) / 10; return Number.isInteger(r) ? String(r) : r.toFixed(1); },

    async shareMessCode() {
        if (!this.messCode) { this.toast('No mess code', 'error'); return; }
        const text = `Join my mess "${this.messName || ''}" with code: ${this.messCode}`;
        try { await navigator.clipboard.writeText(text); this.toast('Invite copied!', 'success'); }
        catch (e) { prompt('Copy mess code:', this.messCode); }
    },

    async loadDashboard() {
        if (!this.messId) return;
        try {
            const now = new Date();
            const month = this.mk(now);
            const todayKey = this.dk(now);
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const monthEnd = month + '-' + String(daysInMonth).padStart(2, '0');

            const userName = this.currentUser?.displayName || 'User';
            const initial = ((userName.trim()[0] || 'U')).toUpperCase();
            document.getElementById('dash-mini-avatar').textContent = initial;

            document.getElementById('dash-mess-name').textContent = this.messName || 'My Mess';

            const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
            const members = membersSnap.val() || {};
            const mids = Object.keys(members);
            let managerName = '-';
            const adminFound = mids.map(id => [id, members[id]]).find(([id, m]) => m && m.role === 'admin');
            if (adminFound) managerName = adminFound[1].name || '-';
            else if (mids.length) managerName = (members[mids[0]] || {}).name || '-';
            document.getElementById('dash-manager').textContent = managerName;
            document.getElementById('dash-month').textContent = this.fmtMonth(now);
            document.getElementById('dash-online-count').textContent = mids.length;

            const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.getElementById('dash-date').textContent = `Today is ${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()} (${weekdays[now.getDay()]})`;

            const mlSnap = await db.ref(`messes/${this.messId}/meals/${todayKey}`).once('value');
            const todayMeals = mlSnap.val() || {};
            let bf = 0, ln = 0, dn = 0;
            Object.values(todayMeals).forEach(m => { bf += (m.breakfast || 0); ln += (m.lunch || 0); dn += (m.dinner || 0); });
            document.getElementById('dash-breakfast').textContent = bf;
            document.getElementById('dash-lunch').textContent = ln;
            document.getElementById('dash-dinner').textContent = dn;

            let preview = 'Pin a notice for the whole house';
            try {
                const nSnap = await db.ref(`messes/${this.messId}/notices`).orderByChild('createdAt').limitToLast(1).once('value');
                if (nSnap.exists()) { const v = nSnap.val(); const k = Object.keys(v)[0]; preview = v[k].body || v[k].title || preview; }
            } catch (e) { /* notices may not exist */ }
            document.getElementById('dash-notice-preview').textContent = preview;

            let noteTxt = 'Nothing on the list';
            try {
                const noteSnap = await db.ref(`messes/${this.messId}/bazarNote`).once('value');
                if (noteSnap.val()) noteTxt = noteSnap.val();
            } catch (e) { /* ignore */ }
            document.getElementById('dash-live-count').textContent = noteTxt;

            let dutyName = 'Not assigned';
            try {
                const dSnap = await db.ref(`messes/${this.messId}/bazarDuty/${todayKey}`).once('value');
                const dutyMid = dSnap.val();
                if (dutyMid && members[dutyMid] && members[dutyMid].name) dutyName = members[dutyMid].name;
            } catch (e) { /* duty may not exist */ }
            document.getElementById('dash-duty-name').textContent = dutyName;

            const bzSnap = await db.ref(`messes/${this.messId}/bazarItems`).once('value');
            let bazTotal = 0;
            const paidBy = {};
            Object.values(bzSnap.val() || {}).forEach(b => {
                const amt = parseFloat(b.cost) || 0;
                bazTotal += amt;
                const n = (b.memberId || '').trim();
                if (n) paidBy[n] = (paidBy[n] || 0) + amt;
            });

            const mlMSnap = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(monthEnd).once('value');
            const memberMeals = {};
            let totalMeals = 0;
            mlMSnap.forEach(d => {
                Object.entries(d.val() || {}).forEach(([memberName, m]) => {
                    const base = (m.breakfast || 0) + (m.lunch || 0) + (m.dinner || 0);
                    memberMeals[memberName] = (memberMeals[memberName] || 0) + base;
                    totalMeals += base;
                });
            });
            const rate = totalMeals > 0 ? bazTotal / totalMeals : 0;

            const depSnap = await db.ref(`messes/${this.messId}/deposits`).once('value');
            const depAll = depSnap.val() || {};
            const depByName = {}; let totalDep = 0;
            Object.values(depAll).forEach(v => {
                if (!v || typeof v !== 'object') return;
                if (typeof v.amount === 'number' && v.memberId) {
                    depByName[v.memberId] = (depByName[v.memberId] || 0) + v.amount;
                    totalDep += v.amount;
                }
            });

            document.getElementById('dash-deposit').textContent = '৳ ' + this.fmtNum(totalDep);
            const finBal = totalDep - bazTotal;
            const balEl = document.getElementById('dash-balance');
            balEl.textContent = '৳ ' + this.fmtNum(finBal);
            balEl.className = finBal < 0 ? 'neg' : 'pos';
            document.getElementById('dash-rate').textContent = '৳ ' + rate.toFixed(2);

            const rowsEl = document.getElementById('dash-member-rows');
            if (!mids.length) { rowsEl.innerHTML = '<tr><td colspan="5" class="empty-state">No data</td></tr>'; return; }
            let html = '';
            mids.forEach(mid => {
                const m = members[mid] || {};
                const name = m.name || 'Unknown';
                const total = memberMeals[name] || 0;
                const cost = total * rate;
                const dep = depByName[name] || 0;
                const bal = dep - cost;
                html += `<tr>
                    <td class="c-name">${this.esc(name)}</td>
                    <td><strong>${this.fmtNum(total)}</strong></td>
                    <td><strong>৳${this.fmtNum(cost)}</strong></td>
                    <td><strong>৳${this.fmtNum(dep)}</strong></td>
                    <td class="${bal < 0 ? 'neg' : 'pos'}"><strong>৳${this.fmtNum(bal)}</strong></td>
                </tr>`;
            });
            rowsEl.innerHTML = html;
        } catch (e) { console.error('loadDashboard error:', e); }
    },

    mealPickMonth() {
        const input = document.createElement('input');
        input.type = 'month';
        const now = new Date();
        input.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
        input.addEventListener('change', () => {
            const v = input.value;
            if (v) {
                const [y, m] = v.split('-').map(Number);
                this._mealYear = y;
                this._mealMonth = m - 1;
                this.loadMeals();
            }
        });
        input.click();
    },

    async loadMeals() {
        if (!this.messId) return;
        const now = new Date();
        const year = this._mealYear || now.getFullYear();
        const mon = this._mealMonth != null ? this._mealMonth : now.getMonth();
        const month = `${year}-${String(mon + 1).padStart(2, '0')}`;
        const daysInMonth = new Date(year, mon + 1, 0).getDate();
        const monthLabel = `${now.toLocaleString('en-US',{month:'long'})} ${year}`;
        document.getElementById('ameal-month').textContent = monthLabel;
        const loader = document.getElementById('ameal-loader');
        const scroll = document.getElementById('ameal-grid-scroll');
        loader.style.display = 'flex';
        scroll.style.display = 'none';
        try {
            const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
            const members = membersSnap.val() || {};
            const mids = Object.keys(members);
            if (!mids.length) { loader.innerHTML = '<p class="empty-state">No members</p>'; return; }
            const mealsSnap = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-' + String(daysInMonth).padStart(2,'0')).once('value');
            const allMeals = mealsSnap.val() || {};
            const memberData = {};
            mids.forEach(mid => {
                const m = members[mid] || {};
                memberData[mid] = { name: m.name || 'Unknown', breakfast: new Array(daysInMonth).fill(0), lunch: new Array(daysInMonth).fill(0), dinner: new Array(daysInMonth).fill(0), breakfastTotal: 0, lunchTotal: 0, dinnerTotal: 0 };
            });
            Object.entries(allMeals).forEach(([dateKey, dayMeals]) => {
                const day = parseInt(dateKey.slice(8, 10), 10) - 1;
                if (day < 0 || day >= daysInMonth) return;
                Object.entries(dayMeals || {}).forEach(([mid, m]) => {
                    if (!memberData[mid]) return;
                    const breakfast = m.breakfast || 0;
                    const lunch = m.lunch || 0;
                    const dinner = m.dinner || 0;
                    memberData[mid].breakfast[day] += breakfast;
                    memberData[mid].lunch[day] += lunch;
                    memberData[mid].dinner[day] += dinner;
                    memberData[mid].breakfastTotal += breakfast;
                    memberData[mid].lunchTotal += lunch;
                    memberData[mid].dinnerTotal += dinner;
                });
            });
            const today = now.getDate();
            let html = '<thead><tr><th class="am-col-view" colspan="2"><span class="ameal-row-label" style="justify-content:center"><span class="material-icons-round" style="font-size:16px">tune</span> View</span></th>';
                    for (let d = 1; d <= daysInMonth; d++) html += `<th${d===today?' style="background:#c8ddf0"':''}>${d}</th>`;
            html += '</tr></thead><tbody>';
            const colors = ['#0b3d91','#0d4fb5','#1565C0','#08306b','#3b7bdd','#1976D2'];
            mids.forEach((mid, idx) => {
                const md = memberData[mid];
                const bg = colors[idx % colors.length];
                const total = md.breakfastTotal + md.lunchTotal + md.dinnerTotal;
                html += `<tr><td rowspan="3" class="am-col-name" style="background:${bg}"><div class="ameal-mname">${this.esc(md.name)}</div><div class="ameal-mtotal">(${total})</div></td>`;
                html += `<td class="am-col-type" style="background:#eef1f6"><div class="ameal-row-label"><span style="font-size:14px">🌅</span><span class="ameal-row-count${md.breakfastTotal===0?' zero':''}">${md.breakfastTotal}</span><span style="color:#888;font-size:11px">Breakfast</span></div></td>`;
                for (let d = 0; d < daysInMonth; d++) {
                    const v = md.breakfast[d];
                    const cls = d + 1 === today ? ' class="ame-day-today"' : '';
                    html += `<td${cls} style="${v?'color:#333;font-weight:600':''}">${v || ''}</td>`;
                }
                html += '</tr><tr>';
                html += `<td class="am-col-type" style="background:#eef1f6"><div class="ameal-row-label"><span style="font-size:14px">🍜</span><span class="ameal-row-count${md.lunchTotal===0?' zero':''}">${md.lunchTotal}</span><span style="color:#888;font-size:11px">Lunch</span></div></td>`;
                for (let d = 0; d < daysInMonth; d++) {
                    const v = md.lunch[d];
                    const cls = d + 1 === today ? ' class="ame-day-today"' : '';
                    html += `<td${cls} style="${v?'color:#333;font-weight:600':''}">${v || ''}</td>`;
                }
                html += '</tr><tr>';
                html += `<td class="am-col-type" style="background:#eef1f6"><div class="ameal-row-label"><span style="font-size:14px">🍽</span><span class="ameal-row-count dinner${md.dinnerTotal===0?' zero':''}">${md.dinnerTotal}</span><span style="color:#888;font-size:11px">Dinner</span></div></td>`;
                for (let d = 0; d < daysInMonth; d++) {
                    const v = md.dinner[d];
                    const cls = d + 1 === today ? ' class="ame-day-today"' : '';
                    html += `<td${cls} style="${v?'color:#333;font-weight:600':''}">${v || ''}</td>`;
                }
                html += '</tr>';
            });
            html += '</tbody>';
            document.getElementById('ameal-table').innerHTML = html;
            loader.style.display = 'none';
            scroll.style.display = 'block';
        } catch (e) { console.error('loadMeals error:', e); loader.innerHTML = '<p class="empty-state">Error loading</p>'; }
    },

    async showAddMeal() {
        if (!this.messId) return;
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = snap.val() || {};
        const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare(members[b]?.name || ''));
        const now = new Date();
        this._aamDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        const dateStr = `${now.getDate()} ${now.toLocaleDateString('en-US',{month:'long'})}, ${now.getFullYear()}`;
        const colors = ['#0b3d91','#0d4fb5','#1565C0','#08306b','#3b7bdd','#1976D2'];
        this._aamData = {};
        let cardsHtml = '';
        mids.forEach((mid, idx) => {
            const m = members[mid] || {};
            const name = m.name || 'Unknown';
            const bg = colors[idx % colors.length];
            this._aamData[name] = { breakfast: 0, lunch: 0, dinner: 0 };
            cardsHtml += `<div class="aam-card"><div class="aam-card-top"><div class="aam-avatar" style="background:${bg}20"><span style="color:${bg};font-size:20px;font-weight:700">${name.charAt(0).toUpperCase()}</span></div><span class="aam-name">${this.esc(name)}</span><span class="aam-total" id="aam-total-${idx}">Total: 0</span></div><div class="aam-meals-row"><div class="aam-meal-col"><label>Breakfast</label><div class="aam-counter"><button onclick="App.aamAdjust(${idx},'${name}','breakfast',-1)">-</button><span class="aam-val" id="aam-bf-${idx}">0</span><button onclick="App.aamAdjust(${idx},'${name}','breakfast',1)">+</button></div></div><div class="aam-meal-col"><label>Lunch</label><div class="aam-counter"><button onclick="App.aamAdjust(${idx},'${name}','lunch',-1)">-</button><span class="aam-val" id="aam-ln-${idx}">0</span><button onclick="App.aamAdjust(${idx},'${name}','lunch',1)">+</button></div></div><div class="aam-meal-col"><label>Dinner</label><div class="aam-counter"><button onclick="App.aamAdjust(${idx},'${name}','dinner',-1)">-</button><span class="aam-val" id="aam-dn-${idx}">0</span><button onclick="App.aamAdjust(${idx},'${name}','dinner',1)">+</button></div></div></div></div>`;
        });
        document.getElementById('modal-title').textContent = 'Add Meal';
        document.getElementById('modal-body').innerHTML = `<div class="dep-date" style="cursor:pointer" onclick="App.aamPickDate()"><span class="material-icons-round">calendar_month</span> <span id="aam-date-text">${dateStr}</span></div><div id="aam-cards-wrap">${cardsHtml || '<p class="empty-state">No members</p>'}</div>`;
        document.getElementById('modal-footer').innerHTML = `<div class="dep-footer-btns"><button class="btn-modal-add" onclick="App.aamSave()">Add</button></div>`;
        this.openModal();
    },

    aamAdjust(idx, name, field, delta) {
        if (!this._aamData || !this._aamData[name]) return;
        const v = Math.max(0, (this._aamData[name][field] || 0) + delta);
        this._aamData[name][field] = v;
        const map = { breakfast: 'bf', lunch: 'ln', dinner: 'dn' };
        const el = document.getElementById(`aam-${map[field]}-${idx}`);
        if (el) el.textContent = v;
        const total = this._aamData[name].breakfast + this._aamData[name].lunch + this._aamData[name].dinner;
        const tel = document.getElementById(`aam-total-${idx}`);
        if (tel) tel.textContent = `Total: ${total}`;
    },

    aamPickDate() {
        const input = document.createElement('input');
        input.type = 'date';
        input.value = this._aamDate;
        input.addEventListener('change', () => {
            const v = input.value;
            if (v) {
                this._aamDate = v;
                const dd = new Date(v + 'T00:00:00');
                document.getElementById('aam-date-text').textContent = `${dd.getDate()} ${dd.toLocaleDateString('en-US',{month:'short'})} ${dd.getFullYear()}`;
            }
        });
        input.click();
    },

    async aamSave() {
        if (!this.messId || !this._aamData) return;
        const dateKey = this._aamDate;
        let saved = 0;
        for (const [name, m] of Object.entries(this._aamData)) {
            if (m.breakfast || m.lunch || m.dinner) {
                await db.ref(`messes/${this.messId}/meals/${dateKey}/${name}`).set({ lunch: m.lunch, dinner: m.dinner, breakfast: m.breakfast });
                saved++;
            }
        }
        if (saved) { this.toast(`${saved} member meal${saved>1?'s':''} saved!`, 'success'); this.navigate('meals'); }
        else this.toast('Set at least one meal', 'error');
    },

    async loadBazarList() {
        if (!this.messId) return;
        const now = new Date();
        const month = this.mk(now);
        document.getElementById('abazar-month').textContent = month;
        const div = document.getElementById('abazar-list');
        div.innerHTML = '<p class="empty-state">Loading...</p>';
        try {
            const [bazarSnap, membersSnap] = await Promise.all([
                db.ref(`messes/${this.messId}/bazarItems`).orderByChild('date').once('value'),
                db.ref(`messes/${this.messId}/members`).once('value')
            ]);
            const members = membersSnap.val() || {};
            const allItems = bazarSnap.val() || {};
            const filtered = Object.entries(allItems)
                .filter(([, v]) => v.date && v.date.startsWith(month))
                .sort((a, b) => (b[1].date || '').localeCompare(a[1].date || '') || (b[1].createdAt || 0) - (a[1].createdAt || 0));
            if (!filtered.length) { div.innerHTML = '<p class="empty-state">No bazar items this month</p>'; return; }
            const grouped = {};
            filtered.forEach(([k, v]) => {
                const day = v.date.slice(0, 10);
                (grouped[day] = grouped[day] || []).push({ key: k, ...v });
            });
            let html = '';
            Object.entries(grouped).forEach(([day, items]) => {
                const d = new Date(day + 'T00:00:00');
                const dayTotal = items.reduce((s, i) => s + (parseFloat(i.cost) || 0), 0);
                const expanded = day === Object.keys(grouped)[0];
                html += `<div class="abazar-day-card">
                    <div class="abazar-day-head${expanded ? ' expanded' : ''}" onclick="App.toggleDayCard(this)">
                        <div class="abazar-day-info"><h3>${d.getDate()} ${this.shortMon(d)}, ${d.toLocaleDateString('en',{weekday:'long'})}</h3><p>${items.length} item${items.length>1?'s':''}</p></div>
                        <span class="abazar-day-total">৳${this.fmtNum(dayTotal)}</span>
                        <span class="material-icons-round">expand_more</span>
                    </div>
                    <div class="abazar-day-items" style="${expanded?'':'display:none'}">
                        <div class="abazar-day-items-head"><span>ITEM</span><span>MONEY FROM</span><span>COST</span></div>
                        ${items.map(i => `<div class="abazar-item-row">
                            <span class="abazar-item-name">${this.esc(i.name || '-')}</span>
                            <span class="abazar-item-buyer">${this.esc((members[i.memberId]||{}).name || i.memberId || '-')}</span>
                            <span class="abazar-item-cost">৳${this.fmtNum(parseFloat(i.cost)||0)}</span>
                        </div>`).join('')}
                    </div>
                </div>`;
            });
            div.innerHTML = html;
        } catch (e) { console.error('loadBazarList error:', e); div.innerHTML = '<p class="empty-state">Error loading</p>'; }
    },

    async loadManagerMoney() {
        if (!this.messId) return;
        const now = new Date();
        const month = this.mk(now);
        document.getElementById('abalance-month').textContent = month;
        const div = document.getElementById('abalance-list');
        div.innerHTML = '<p class="empty-state">Loading...</p>';
        try {
            const [depSnap, membersSnap] = await Promise.all([
                db.ref(`messes/${this.messId}/deposits`).orderByChild('date').once('value'),
                db.ref(`messes/${this.messId}/members`).once('value')
            ]);
            const members = membersSnap.val() || {};
            const allDeps = depSnap.val() || {};
            const filtered = Object.entries(allDeps)
                .filter(([, v]) => v.date && v.date.startsWith(month))
                .sort((a, b) => (b[1].date || '').localeCompare(a[1].date || '') || (b[1].createdAt || 0) - (a[1].createdAt || 0));
            if (!filtered.length) { div.innerHTML = '<p class="empty-state">No deposits this month</p>'; return; }
            const grouped = {};
            filtered.forEach(([k, v]) => {
                const day = v.date.slice(0, 10);
                (grouped[day] = grouped[day] || []).push({ key: k, ...v });
            });
            let html = '';
            Object.entries(grouped).forEach(([day, deps]) => {
                const d = new Date(day + 'T00:00:00');
                const dayTotal = deps.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
                const expanded = day === Object.keys(grouped)[0];
                html += `<div class="abazar-day-card">
                    <div class="abazar-day-head${expanded ? ' expanded' : ''}" onclick="App.toggleDayCard(this)">
                        <div class="abazar-day-info"><h3>${d.getDate()} ${this.shortMon(d)}, ${d.toLocaleDateString('en',{weekday:'long'})}</h3><p>${deps.length} entr${deps.length>1?'ies':'y'} &middot; Total: ৳${this.fmtNum(dayTotal)}</p></div>
                        <span class="material-icons-round">expand_more</span>
                    </div>
                    <div class="abazar-day-items" style="${expanded?'':'display:none'}">
                        <div class="abazar-day-items-head"><span>MONEY OF</span><span></span><span>AMOUNT</span></div>
                        ${deps.map(i => `<div class="abazar-item-row">
                            <span class="abazar-item-name">${this.esc((members[i.memberId]||{}).name || i.memberId || '-')}</span>
                            <span></span>
                            <span class="abazar-item-cost">৳${this.fmtNum(parseFloat(i.amount)||0)}</span>
                        </div>`).join('')}
                    </div>
                </div>`;
            });
            div.innerHTML = html;
        } catch (e) { console.error('loadManagerMoney error:', e); div.innerHTML = '<p class="empty-state">Error loading</p>'; }
    },

    toggleDayCard(head) {
        head.classList.toggle('expanded');
        const items = head.nextElementSibling;
        if (items) items.style.display = items.style.display === 'none' ? '' : 'none';
    },

    async showAddBazar() {
        if (!this.messId) return;
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = snap.val() || {};
        const mids = Object.keys(members);
        const names = [...new Set(mids.map(id => members[id]?.name || 'Unknown'))].sort((a, b) => a.localeCompare(b));
        const now = new Date();
        const dateStr = `${now.getDate()} ${now.toLocaleDateString('en-US',{month:'long'})}, ${now.getFullYear()}`;

        this._bzMembers = names;
        this._bzDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        this._bzItems = [{ name: '', cost: '' }];
        this._bzMoneyBy = '';
        this._bzDoneBy = '';
        this._bzTab = 'bazar';
        this._bzUtilType = '';
        this._bzUtilAmount = '';
        this._bzUtilSelected = names.slice();

        document.getElementById('modal-title').textContent = 'Add Bazar';
        document.getElementById('modal-body').innerHTML = `
            <div class="bz-tabs" style="padding:0 0 12px">
                <button class="bz-tab active" data-tab="bazar" onclick="App.bzSwitchTab('bazar')"><span class="material-icons-round">shopping_cart</span> Bazar</button>
                <button class="bz-tab" data-tab="utility" onclick="App.bzSwitchTab('utility')"><span class="material-icons-round">lightbulb</span> Utility</button>
            </div>
            <div class="dep-date" style="cursor:pointer" onclick="App.bzPickDate()"><span class="material-icons-round">calendar_month</span> <span id="bz-date-text">${dateStr}</span></div>
            <div id="bz-bazar-section">
                <div class="dep-label">Money from:</div>
                <div class="dep-chips" id="bz-money-chips">
                    <button class="dep-chip" data-name="Manager" onclick="App.bzPickMoney(this)">Manager</button>
                    ${names.map(n => `<button class="dep-chip" data-name="${n}" onclick="App.bzPickMoney(this)">${n}</button>`).join('')}
                </div>
                <div class="dep-label">Done by:</div>
                <div class="dep-chips" id="bz-done-chips">
                    ${names.map(n => `<button class="dep-chip" data-name="${n}" onclick="App.bzPickDone(this)">${n}</button>`).join('')}
                </div>
                <div id="bz-item-rows">
                    <div class="bz-item-row">
                        <div class="bz-input-wrap"><span class="material-icons-round">shopping_bag</span><input class="bz-input" placeholder="Item name" oninput="App.bzUpdateItem(0,'name',this.value)"></div>
                        <div class="bz-input-wrap bz-cost-wrap"><input class="bz-input" type="number" placeholder="Cost" oninput="App.bzUpdateItem(0,'cost',this.value)"></div>
                    </div>
                </div>
                <button class="bz-add-more" onclick="App.bzAddItemRow()"><span class="material-icons-round">add</span> Add another item</button>
                <p class="bz-hint">Add each item on its own line. The Analysis page can then show which items cost you the most.</p>
            </div>
            <div id="bz-utility-section" style="display:none">
                <div class="dep-label">Type:</div>
                <div class="dep-chips" id="bz-type-chips">
                    ${['Rent','Wi-Fi'].map(t => `<button class="dep-chip" data-type="${t}" onclick="App.bzPickType(this)">${t}</button>`).join('')}
                    <button class="dep-chip" onclick="App.bzAddType()"><span class="material-icons-round" style="font-size:16px">add</span> Add suggestion</button>
                </div>
                <div class="dep-input-wrap" style="margin:12px 0"><span style="font-size:20px;font-weight:700">৳</span><input class="bz-input" type="number" placeholder="Total bill amount" oninput="App.bzUtilAmount=this.value;App.bzRenderFooter()"></div>
                <div class="bz-util-members">
                    <div class="bz-util-selectall" onclick="App.bzToggleAll()">
                        <input type="checkbox" checked id="bz-selectall-cb" onchange="App.bzToggleAllCb()">
                        <span>Select all</span>
                        <span class="bz-util-count" id="bz-util-count">${names.length}/${names.length} selected</span>
                    </div>
                    ${names.map(n => `<label class="bz-util-member"><input type="checkbox" checked data-member="${n}" onchange="App.bzUpdateUtilCount()"><span>${n}</span></label>`).join('')}
                </div>
            </div>`;
        document.getElementById('modal-footer').innerHTML = `
            <div class="dep-footer-row">
                <span class="dep-footer-hint" id="bz-footer-left">0 items &nbsp; Pick whose money it is</span>
                <span class="dep-footer-total" id="bz-footer-total">৳ 0</span>
            </div>
            <div class="dep-footer-btns">
                <button class="btn-modal-add" onclick="App.bzSave()">Add</button>
            </div>`;
        this.openModal();
    },

    bzSwitchTab(tab) {
        this._bzTab = tab;
        document.querySelectorAll('.bz-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        document.getElementById('bz-bazar-section').style.display = tab === 'bazar' ? '' : 'none';
        document.getElementById('bz-utility-section').style.display = tab === 'utility' ? '' : 'none';
        this.bzRenderFooter();
    },

    bzPickMoney(el) {
        document.querySelectorAll('#bz-money-chips .bz-chip').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        this._bzMoneyBy = el.dataset.name;
        this.bzRenderFooter();
    },

    bzPickDone(el) {
        document.querySelectorAll('#bz-done-chips .bz-chip').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        this._bzDoneBy = el.dataset.name;
        this.bzRenderFooter();
    },

    bzPickType(el) {
        document.querySelectorAll('#bz-type-chips .bz-chip').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        this._bzUtilType = el.dataset.type;
    },

    bzUpdateItem(idx, field, val) { this._bzItems[idx][field] = val; this.bzRenderFooter(); },

    bzAddItemRow() {
        this._bzItems.push({ name: '', cost: '' });
        const div = document.getElementById('bz-item-rows');
        const idx = this._bzItems.length - 1;
        const row = document.createElement('div');
        row.className = 'bz-item-row';
        row.innerHTML = `<div class="bz-input-wrap"><span class="material-icons-round">shopping_bag</span><input class="bz-input" placeholder="Item name" oninput="App.bzUpdateItem(${idx},'name',this.value)"></div>
            <div class="bz-input-wrap bz-cost-wrap"><input class="bz-input" type="number" placeholder="Cost" oninput="App.bzUpdateItem(${idx},'cost',this.value)"></div>`;
        div.appendChild(row);
    },

    bzToggleAll() {
        const all = document.querySelectorAll('#bz-utility-section .bz-util-member input');
        const allChecked = [...all].every(c => c.checked);
        all.forEach(c => c.checked = !allChecked);
        document.getElementById('bz-selectall-cb').checked = !allChecked;
        this.bzUpdateUtilCount();
    },

    bzToggleAllCb() {
        const checked = document.getElementById('bz-selectall-cb').checked;
        document.querySelectorAll('#bz-utility-section .bz-util-member input').forEach(c => c.checked = checked);
        this.bzUpdateUtilCount();
    },

    bzUpdateUtilCount() {
        const all = document.querySelectorAll('#bz-utility-section .bz-util-member input');
        const checked = [...all].filter(c => c.checked).length;
        document.getElementById('bz-util-count').textContent = `${checked}/${all.length} selected`;
        this._bzUtilSelected = [...all].filter(c => c.checked).map(c => c.dataset.member);
        this.bzRenderFooter();
    },

    bzRenderFooter() {
        const left = document.getElementById('bz-footer-left');
        const total = document.getElementById('bz-footer-total');
        if (!left || !total) return;
        if (this._bzTab === 'bazar') {
            const items = this._bzItems.filter(i => i.name || i.cost);
            const sum = items.reduce((s, i) => s + (parseFloat(i.cost) || 0), 0);
            left.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}  ${this._bzMoneyBy || 'Pick whose money it is'}${this._bzDoneBy ? ' / ' + this._bzDoneBy : ''}`;
            total.textContent = '৳ ' + this.fmtNum(sum);
        } else {
            const amt = parseFloat(this._bzUtilAmount) || 0;
            const count = this._bzUtilSelected?.length || 0;
            left.textContent = `Split among: ${count} Member${count !== 1 ? 's' : ''}`;
            total.textContent = '৳ ' + this.fmtNum(amt);
        }
    },

    async bzSave() {
        const dateKey = this._bzDate;
        if (this._bzTab === 'bazar') {
            const items = this._bzItems.filter(i => i.name && i.cost);
            if (!items.length) { this.toast('Add at least one item', 'error'); return; }
            if (!this._bzMoneyBy) { this.toast('Pick whose money it is', 'error'); return; }
            for (const item of items) {
                await db.ref(`messes/${this.messId}/bazarItems`).push({
                    name: item.name, cost: parseFloat(item.cost) || 0,
                    memberId: this._bzMoneyBy, doneBy: this._bzDoneBy || '', date: dateKey, category: 'bazar', createdAt: Date.now()
                });
            }
        } else {
            const amt = parseFloat(this._bzUtilAmount) || 0;
            if (!amt) { this.toast('Enter bill amount', 'error'); return; }
            if (!this._bzUtilType) { this.toast('Pick a type', 'error'); return; }
            const share = this._bzUtilSelected.length ? amt / this._bzUtilSelected.length : 0;
            for (const name of this._bzUtilSelected) {
                await db.ref(`messes/${this.messId}/bazarItems`).push({
                    name: this._bzUtilType, cost: Math.round(share * 100) / 100,
                    memberId: name, date: dateKey, category: 'utility', createdAt: Date.now()
                });
            }
        }
        this.closeModal();
        this.loadBazarList();
        this.toast('Added!', 'success');
    },

    bzClose() { this.closeModal(); },

    bzPickDate() {
        const input = document.createElement('input');
        input.type = 'date';
        input.value = this._bzDate;
        input.addEventListener('change', () => {
            if (input.value) {
                this._bzDate = input.value;
                const dd = new Date(input.value + 'T00:00:00');
                const el = document.getElementById('bz-date-text');
                if (el) el.textContent = `${dd.getDate()} ${dd.toLocaleDateString('en-US',{month:'long'})}, ${dd.getFullYear()}`;
            }
        });
        input.click();
    },

    async showAddDeposit() {
        if (!this.messId) return;
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = snap.val() || {};
        const mids = Object.keys(members);
        const names = mids.map(id => members[id]?.name || 'Unknown');
        const now = new Date();
        this._depDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        const dateStr = `${now.getDate()} ${now.toLocaleDateString('en-US',{month:'long'})}, ${now.getFullYear()}`;
        document.getElementById('modal-title').textContent = 'Add Deposit';
        document.getElementById('modal-body').innerHTML = `
            <div class="dep-date" style="cursor:pointer" onclick="App.depPickDate()"><span class="material-icons-round">calendar_month</span> <span id="dep-date-text">${dateStr}</span></div>
            <div class="dep-label">Money of:</div>
            <div class="dep-chips" id="dep-chips">
                ${names.map(n => `<button class="dep-chip" data-name="${n}" onclick="App.depPick(this)">${n}</button>`).join('')}
            </div>
            <div class="dep-input-wrap"><span class="dep-taka">৳</span><input class="dep-input" id="dep-amount" type="number" placeholder="Enter Amount" oninput="App.depUpdateFooter()"></div>`;
        document.getElementById('modal-footer').innerHTML = `
            <div class="dep-footer-row">
                <span class="dep-footer-hint">Pick whose money it is</span>
                <span class="dep-footer-total" id="dep-footer-total">৳ 0</span>
            </div>
            <div class="dep-footer-btns">
                <button class="btn-modal-add" onclick="App.saveDeposit()">Add</button>
            </div>`;
        this._depSelected = null;
        this.openModal();
    },

    depPick(el) {
        document.querySelectorAll('.dep-chip').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        this._depSelected = el.dataset.name;
        this.depUpdateFooter();
    },

    depUpdateFooter() {
        const amt = parseFloat(document.getElementById('dep-amount')?.value) || 0;
        const el = document.getElementById('dep-footer-total');
        if (el) el.textContent = '৳ ' + this.fmtNum(amt);
    },

    depPickDate() {
        const input = document.createElement('input');
        input.type = 'date';
        input.value = this._depDate;
        input.addEventListener('change', () => {
            if (input.value) {
                this._depDate = input.value;
                const dd = new Date(input.value + 'T00:00:00');
                const el = document.getElementById('dep-date-text');
                if (el) el.textContent = `${dd.getDate()} ${dd.toLocaleDateString('en-US',{month:'long'})}, ${dd.getFullYear()}`;
            }
        });
        input.click();
    },

    async saveDeposit() {
        const memberName = this._depSelected;
        const amount = parseFloat(document.getElementById('dep-amount')?.value) || 0;
        if (!memberName) { this.toast('Pick whose money it is', 'error'); return; }
        if (!amount) { this.toast('Enter an amount', 'error'); return; }
        await db.ref(`messes/${this.messId}/deposits`).push({ memberId: memberName, amount, date: this._depDate, createdAt: Date.now() });
        this.closeModal(); this.loadManagerMoney(); this.toast('Deposit added!', 'success');
    },

    async loadProfile() {
        if (!this.currentUser) return;
        const u = this.currentUser;
        document.getElementById('prof-avatar').textContent = (u.displayName || 'U').charAt(0).toUpperCase();
        document.getElementById('prof-name').textContent = u.displayName || 'User';
        document.getElementById('prof-email').textContent = u.email || '-';
        document.getElementById('prof-uid-text').textContent = u.uid ? u.uid.slice(0, 12) + '...' : '-';
    },

    copyCode() { if (this.messCode) navigator.clipboard.writeText(this.messCode).then(() => this.toast('Copied!', 'info')); },
    copyUid() { if (this.currentUser) navigator.clipboard.writeText(this.currentUser.uid).then(() => this.toast('UID copied!', 'info')); },
    shareMessCode() { if (this.messCode) navigator.share?.({ title: 'Mess Manager', text: `Join my mess: ${this.messCode}` }).catch(() => {}); },
    sendResetFromProfile() { if (this.currentUser?.email) { auth.sendPasswordResetEmail(this.currentUser.email).then(() => this.toast('Reset email sent!', 'success')).catch(e => this.toast(e.message, 'error')); } },
    signOut() { auth.signOut(); },
    openModal() { document.getElementById('modal-overlay').classList.add('active'); },
    closeModal() { document.getElementById('modal-overlay').classList.remove('active'); },

    esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; },

    toast(msg, type = 'info') {
        const c = document.getElementById('toast-container');
        const t = document.createElement('div');
        t.className = 'toast ' + type;
        t.textContent = msg;
        c.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; setTimeout(() => t.remove(), 300); }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
