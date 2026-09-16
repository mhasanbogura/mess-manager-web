const App = {
    currentUser: null, messId: null, messCode: null, messName: null,
    currentPage: 'dashboard', userRole: 'member',

    async init() {
        const splash = document.getElementById('splash-screen');
        this.applyTheme();
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
        window.addEventListener('popstate', (e) => {
            if (!document.getElementById('app-screen')?.classList.contains('active')) return;
            if (e.state && e.state.page) {
                this._fromPopstate = true;
                this.navigate(e.state.page);
            } else if (this.currentPage && this.currentPage !== 'dashboard') {
                this.navigate('dashboard');
            }
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
            this.setupPresence();
            await this.loadMyPerms();
            this.showApp();
        }).catch(e => { console.error('enterMess error:', e); this.toast('Error loading mess', 'error'); });
    },

    setupPresence() {
        if (!this.messId || !this.currentUser) return;
        const uid = this.currentUser.uid;
        const presRef = db.ref(`messes/${this.messId}/online/${uid}`);
        presRef.set(true);
        presRef.onDisconnect().remove();
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
            const existingSnap = await db.ref(`messes/${mid}/members/${this.currentUser.uid}`).once('value');
            if (existingSnap.exists()) {
                const ed = existingSnap.val() || {};
                if (ed.status === 'pending') { this.toast('Join request already pending', 'info'); btn.textContent = 'Join Mess'; btn.disabled = false; return; }
                await db.ref(`users/${this.currentUser.uid}/messes/${mid}`).set({ role: 'member', joinedAt: ed.joinedAt || Date.now() });
                this.toast('Joined!', 'success');
                document.getElementById('join-mess-code').value = '';
                this.enterMess(mid);
                btn.textContent = 'Join Mess'; btn.disabled = false;
                return;
            }
            await db.ref(`messes/${mid}/members/${this.currentUser.uid}`).set({ name: this.currentUser.displayName || 'Member', email: this.currentUser.email, role: 'member', status: 'pending', joinedAt: Date.now() });
            this.toast('Request sent! Waiting for approval.', 'success');
            document.getElementById('join-mess-code').value = '';
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
        finally { btn.textContent = 'Join Mess'; btn.disabled = false; }
    },

    genCode(n) { const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let r = ''; for (let i = 0; i < n; i++) r += c[Math.floor(Math.random() * c.length)]; return r; },

    showApp() {
        this.showScreen('app-screen');
        const splash = document.getElementById('splash-screen');
        if (splash) { splash.classList.add('hidden'); setTimeout(() => splash.remove(), 400); }
        try { history.pushState({ page: 'dashboard' }, ''); } catch (e) { /* ignore */ }
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
        document.getElementById('app-screen').classList.toggle('on-bazarnote', page === 'bazarnote');
        document.getElementById('app-screen').classList.toggle('on-menu', page === 'menu');
        document.getElementById('app-screen').classList.toggle('on-monthly', page === 'monthly');
        const titles = { dashboard: 'Dashboard', members: 'Mess', meals: 'Meal Entry', bazaar: 'Cost List', balance: 'Manager Money', notices: 'Notice Board', monthly: 'Analysis', profile: 'Profile & Settings', duty: 'Cost Today', bazarnote: 'Bazar Note', menu: 'Menu Today', mealhistory: 'Meal Edits', costtrash: 'Cost Trash', deptrash: 'Manager Trash' };
        const hideTopbar = [];
        document.getElementById('page-title').textContent = titles[page] || page.charAt(0).toUpperCase() + page.slice(1);
        document.querySelector('.topbar').style.display = '';
        const topbarActions = document.getElementById('topbar-actions');
        topbarActions.innerHTML = '';
        if (page === 'bazaar') topbarActions.innerHTML = '<button class="topbar-btn" onclick="App.navigate(\'costtrash\')"><span class="material-icons-round">delete</span></button>';
        if (page === 'balance') topbarActions.innerHTML = '<button class="topbar-btn" onclick="App.navigate(\'deptrash\')"><span class="material-icons-round">delete</span></button>';
        if (page === 'costtrash') topbarActions.innerHTML = '<button class="topbar-btn" onclick="App.navigate(\'bazaar\')"><span class="material-icons-round">arrow_back</span></button>';
        if (page === 'deptrash') topbarActions.innerHTML = '<button class="topbar-btn" onclick="App.navigate(\'balance\')"><span class="material-icons-round">arrow_back</span></button>';
        if (page !== 'dashboard' && !this._fromPopstate) { try { history.pushState({ page }, ''); } catch (e) { /* ignore */ } }
        this._fromPopstate = false;
        document.getElementById('app-screen').classList.toggle('on-bazaar', page === 'bazaar');
        document.getElementById('app-screen').classList.toggle('on-balance', page === 'balance');
        document.getElementById('app-screen').classList.toggle('on-profile', page === 'profile');
        document.getElementById('app-screen').classList.toggle('on-addmeal', page === 'addmeal');
        document.getElementById('app-screen').classList.toggle('on-addcost', page === 'addcost');
        document.getElementById('app-screen').classList.toggle('on-adddeposit', page === 'adddeposit');
        document.getElementById('app-screen').classList.toggle('on-mealhistory', page === 'mealhistory');
        document.getElementById('app-screen').classList.toggle('on-costtrash', page === 'costtrash');
        document.getElementById('app-screen').classList.toggle('on-deptrash', page === 'deptrash');
        document.getElementById('app-screen').classList.toggle('on-meals', page === 'meals');
        if (page === 'dashboard') this.loadDashboard();
        if (page === 'notices') this.loadNotices();
        if (page === 'duty') this.loadDuty();
        if (page === 'members') this.loadFlat();
        if (page === 'meals') this.loadMeals();
        if (page === 'addmeal') this.loadAddMeal();
        if (page === 'addcost') this.loadAddCost();
        if (page === 'adddeposit') this.loadAddDeposit();
        if (page === 'bazaar') this.loadBazarList();
        if (page === 'balance') this.loadManagerMoney();
        if (page === 'profile') this.loadProfile();
        if (page === 'bazarnote') this.loadBazarNote();
        if (page === 'menu') this.loadMenu();
        if (page === 'monthly') this.loadMonthly();
        if (page === 'mealhistory') this.loadMealHistory();
        if (page === 'costtrash') this.loadCostTrash();
        if (page === 'deptrash') this.loadDepTrash();
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
            const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare(members[b]?.name || ''));
            const dutySnap = await db.ref(`messes/${this.messId}/bazarDuty`).once('value');
            const dutyAll = dutySnap.val() || {};
            const duty = {};
            Object.entries(dutyAll).forEach(([dk, mid]) => { if (dk.startsWith(month)) duty[dk] = mid; });

            const todayKey = this.dk(now);
            const tMid = duty[todayKey];
            const tName = (tMid && members[tMid] && members[tMid].name) || null;
            document.getElementById('duty-banner').innerHTML =
                `<span class="material-icons-round">event</span><p><strong>Cost today (${now.getDate()} ${shortMon}):</strong> ` +
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
            chips += assigned && assigned !== mid
                ? `<span class="aduty-pick ${cls}">${d}</span>`
                : `<button class="aduty-pick ${cls}" onclick="App.toggleDutyDay('${dk}')">${d}</button>`;
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
        if (!confirm('Remove all cost dates for this member?')) return;
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
        if (tab === 'permissions' && this._flatMembers) this.loadFlatPermissions(this._flatMembers);
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
            this._flatMembers = members;
            const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare((members[b]?.name || '')));
            let adminName = '-';
            const admin = mids.find(id => members[id] && members[id].role === 'admin');
            if (admin) adminName = members[admin].name || '-';
            document.getElementById('flat-manager-name').textContent = adminName;

            document.getElementById('flat-member-count').textContent = mids.length;
            const canManage = this.userRole === 'admin' || this.canDo('manage');
            const addRow = document.getElementById('flat-add-row');
            const addHint = document.getElementById('flat-add-hint');
            if (addRow) addRow.style.display = canManage ? '' : 'none';
            if (addHint) addHint.style.display = canManage ? '' : 'none';
            const list = document.getElementById('flat-member-list');
            if (!mids.length) { list.innerHTML = '<p class="empty-state" style="padding:20px;text-align:center;color:#999">No members yet</p>'; }
            else {
                list.innerHTML = mids.map(id => {
                    const m = members[id] || {};
                    return `<div class="aflat-member-item">
                        <span class="name">${this.esc(m.name || 'Unknown')}</span>
                        ${canManage ? `<button class="aflat-remove" onclick="App.removeFlatMember('${id}')"><span class="material-icons-round">close</span></button>
                        <button class="aflat-remove" onclick="App.editFlatMember('${id}','${this.esc(m.name || '')}')"><span class="material-icons-round">edit</span></button>` : ''}
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
        if (!this.checkPerm('manage')) return;
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
        if (!this.checkPerm('manage')) return;
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
        if (!this.checkPerm('manage')) return;
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
            const appUsers = mids.filter(id => !id.startsWith('member_') && (members[id] || {}).status !== 'pending');
            appUsers.sort((a, b) => ((members[a] || {}).name || '').localeCompare((members[b] || {}).name || ''));
            document.getElementById('flat-peoples-count').textContent = appUsers.length;
            if (!appUsers.length) { div.innerHTML = '<p class="empty-state" style="padding:20px;text-align:center;color:#999">No peoples have joined yet</p>'; return; }
            const colors = ['#E53935','#1565C0','#2E7D32','#FF9800','#7B1FA2','#00838F'];
            let html = '';
            for (let i = 0; i < appUsers.length; i++) {
                const id = appUsers[i];
                const m = members[id] || {};
                let u = {};
                try { const uSnap = await db.ref(`users/${id}`).once('value'); u = uSnap.val() || {}; } catch (e) {}
                const initial = ((m.name || u.name || '?')[0] || '?').toUpperCase();
                const isAdmin = m.role === 'admin';
                const color = colors[i % colors.length];
                const email = u.email || m.email || '';
                const isYou = id === this.currentUser.uid;
                let profilePic = '';
                try { const picSnap = await db.ref(`users/${id}/profilePicture`).once('value'); profilePic = picSnap.val() || ''; } catch (e) {}
                const avatarStyle = profilePic ? `background-image:url(${profilePic});background-size:cover;background-position:center;color:transparent` : `background:${color}`;
                let actionsHtml = '';
                const canManage = this.userRole === 'admin' || this.canDo('manage');
                if (isYou && isAdmin) {
                    actionsHtml = `<div class="fp-actions">
                        <button class="fp-btn fp-btn-red" onclick="event.stopPropagation();App.leaveMess()">Leave</button>
                        <button class="fp-btn fp-btn-red" onclick="event.stopPropagation();App.stepDownManager()">Step down as manager</button>
                    </div>`;
                } else if (isYou && !isAdmin) {
                    actionsHtml = `<div class="fp-actions">
                        <button class="fp-btn fp-btn-red" onclick="event.stopPropagation();App.leaveMess()">Leave</button>
                    </div>`;
                } else if (!isYou && canManage) {
                    actionsHtml = `<div class="fp-actions">
                        <button class="fp-btn fp-btn-gray" onclick="event.stopPropagation();App.removePerson('${id}','${this.esc(m.name||'')}')">Remove</button>
                        ${!isAdmin ? `<button class="fp-btn fp-btn-yellow" onclick="event.stopPropagation();App.promoteToManager('${id}','${this.esc(m.name||'')}')">Promote as manager</button>` : ''}
                    </div>`;
                }
                html += `<div class="aflat-people-item" onclick="this.classList.toggle('expanded')">
                    <div class="aflat-people-avatar" style="${avatarStyle}">${profilePic ? '' : initial}</div>
                    <div class="aflat-people-info">
                        <h4>${this.esc(m.name || 'Unknown')} ${isAdmin ? '<span class="role-badge">(Manager' + (isYou ? ', You' : '') + ')</span>' : ''}</h4>
                        <div class="email">${this.esc(email)}</div>
                        ${actionsHtml}
                    </div>
                    <span class="material-icons-round chevron">expand_more</span>
                </div>`;
            }
            div.innerHTML = html;
        } catch (e) { console.error('loadFlatPeoples error:', e); }
    },

    stepDownManager() {
        if (!confirm('Step down as manager?')) return;
        this.promoteToManager(this.currentUser.uid, this.currentUser.displayName);
    },

    async promoteToManager(uid, name) {
        if (!this.checkPerm('manage')) return;
        if (!confirm(`Promote ${name} as manager?`)) return;
        try {
            const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
            const members = membersSnap.val() || {};
            const permSnap = await db.ref(`messes/${this.messId}/permissions`).once('value');
            const perms = permSnap.val() || {};
            const oldAdminId = Object.entries(members).find(([, m]) => m && m.role === 'admin')?.[0];
            const newAdminPerms = perms[uid] || {};
            const updates = {};
            if (oldAdminId) {
                updates[`messes/${this.messId}/members/${oldAdminId}/role`] = 'member';
                updates[`messes/${this.messId}/permissions/${oldAdminId}`] = newAdminPerms;
            }
            updates[`messes/${this.messId}/members/${uid}/role`] = 'admin';
            updates[`messes/${this.messId}/permissions/${uid}`] = null;
            await db.ref().update(updates);
            this.toast('Manager changed!', 'success');
            this.loadFlat();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async removePerson(uid, name) {
        if (!this.checkPerm('manage')) return;
        if (!confirm(`Remove ${name} from mess?`)) return;
        try {
            await db.ref(`messes/${this.messId}/members/${uid}`).remove();
            this.toast('Removed!', 'success');
            this.loadFlat();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async loadFlatPermissions(members) {
        if (!this.messId) return;
        const div = document.getElementById('flat-permissions-list');
        if (!div) return;
        try {
            const allKeys = Object.keys(members);
            const mids = allKeys.filter(id => !id.startsWith('member_') && (members[id] || {}).status !== 'pending');
            mids.sort((a, b) => ((members[a] || {}).name || '').localeCompare((members[b] || {}).name || ''));
            if (!mids.length) { div.innerHTML = '<p class="empty-state" style="padding:20px;text-align:center;color:#999">No peoples to set permissions for</p>'; return; }
            const pSnap = await db.ref(`messes/${this.messId}/permissions`).once('value');
            const perms = pSnap.val() || {};
            const permKeys = ['manage', 'mealEntry', 'mealEdit', 'bazarEntry', 'togglePerms'];
            const permLabels = ['Manage Peoples and Members', 'Meal Entry', 'Meal Edit', 'Cost Entry', 'Turn on/off Permissions'];
            const colors = ['#E53935','#1565C0','#2E7D32','#FF9800','#7B1FA2','#00838F'];
            const iAmAdmin = this.userRole === 'admin';
            const iCanToggle = iAmAdmin || this.canDo('togglePerms');
            const uid = this.currentUser ? this.currentUser.uid : '';
            let html = '';
            for (let i = 0; i < mids.length; i++) {
                const id = mids[i];
                const m = members[id] || {};
                const isAdmin = m.role === 'admin';
                const initial = ((m.name || '?')[0] || '?').toUpperCase();
                const color = colors[i % colors.length];
                const userPerms = perms[id] || {};
                const isMe = id === uid;
                let checks = '';
                for (let j = 0; j < permKeys.length; j++) {
                    const k = permKeys[j];
                    const checked = !!userPerms[k];
                    const canClick = iCanToggle && !isAdmin && !isMe;
                    checks += `<div class="aflat-perm-row">
                        <div class="aflat-perm-check ${checked ? 'checked' : ''}" onclick="App.togglePerm('${id}','${k}',this)" ${!canClick ? 'style="pointer-events:none;opacity:.5"' : ''}>
                            <span class="material-icons-round">check</span>
                        </div>
                        <span class="aflat-perm-label">${permLabels[j]}</span>
                    </div>`;
                }
                html += `<div class="aflat-perm-card">
                    <div class="aflat-perm-top">
                        <div class="aflat-perm-avatar" style="background:${color}">${initial}</div>
                        <div class="aflat-perm-name">${this.esc(m.name || 'Unknown')} ${isAdmin ? '<span class="role-badge">(Manager' + (isMe ? ', You' : '') + ')</span>' : ''}</div>
                    </div>
                    <div class="aflat-perm-list">${checks}</div>
                </div>`;
            }
            div.innerHTML = html;
        } catch (e) { console.error('loadFlatPermissions error:', e); div.innerHTML = '<p class="empty-state" style="padding:20px;text-align:center;color:red">Error: ' + e.message + '</p>'; }
    },

    async togglePerm(uid, key, el) {
        if (!this.messId) return;
        if (!this.checkPerm('togglePerms')) return;
        if (uid === this.currentUser.uid) { this.toast("Can't change own permissions", 'error'); return; }
        try {
            const isChecked = el.classList.toggle('checked');
            await db.ref(`messes/${this.messId}/permissions/${uid}/${key}`).set(isChecked);
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    _userPerms: {},
    _permsLoaded: false,
    async loadMyPerms() {
        if (!this.messId || !this.currentUser) return;
        try {
            const membersSnap = await db.ref(`messes/${this.messId}/members/${this.currentUser.uid}`).once('value');
            const m = membersSnap.val() || {};
            if (m.role === 'admin') { this._userPerms = null; this._permsLoaded = true; return; }
            const permSnap = await db.ref(`messes/${this.messId}/permissions/${this.currentUser.uid}`).once('value');
            this._userPerms = permSnap.val() || {};
        } catch (e) { this._userPerms = {}; }
        this._permsLoaded = true;
    },
    canDo(key) {
        if (!this._permsLoaded) return false;
        if (this._userPerms === null) return true;
        return !!this._userPerms[key];
    },
    checkPerm(key) {
        if (!this.canDo(key)) { this.toast('No permission for this action', 'error'); return false; }
        return true;
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

    _selYear: null,
    _selMonth: null,
    getSelMonth() {
        const now = new Date();
        const y = this._selYear || now.getFullYear();
        const m = this._selMonth != null ? this._selMonth : now.getMonth();
        return { year: y, month: m, key: `${y}-${String(m + 1).padStart(2, '0')}`, date: new Date(y, m, 1) };
    },

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
            const sm = this.getSelMonth();
            const month = sm.key;
            const todayKey = this.dk(now);
            const daysInMonth = new Date(sm.year, sm.month + 1, 0).getDate();
            const monthEnd = month + '-' + String(daysInMonth).padStart(2, '0');

            const userName = this.currentUser?.displayName || 'User';
            const initial = (userName.trim()[0] || 'U').toUpperCase();

            const avatarEl = document.getElementById('dash-avatar');
            if (avatarEl) {
                avatarEl.textContent = initial;
                try {
                    const picSnap = await db.ref(`users/${this.currentUser.uid}/profilePicture`).once('value');
                    const pic = picSnap.val();
                    if (pic) {
                        avatarEl.style.backgroundImage = `url(${pic})`;
                        avatarEl.style.backgroundSize = 'cover';
                        avatarEl.style.backgroundPosition = 'center';
                        avatarEl.textContent = '';
                    }
                } catch (e) {}
            }
            const usernameEl = document.getElementById('dash-username');
            if (usernameEl) usernameEl.textContent = userName;

            const hour = now.getHours();
            const greetEl = document.getElementById('dash-greeting');
            if (greetEl) {
                if (hour < 12) greetEl.textContent = 'Good morning';
                else if (hour < 17) greetEl.textContent = 'Good afternoon';
                else greetEl.textContent = 'Good evening';
            }

            if (this._bannerInterval) clearInterval(this._bannerInterval);
            this._bannerInterval = setInterval(() => {
                const b1 = document.getElementById('banner-brand');
                const b2 = document.getElementById('banner-greeting');
                if (b1 && b2) {
                    b1.classList.toggle('active');
                    b2.classList.toggle('active');
                }
            }, 5000);

            document.getElementById('dash-mess-name').textContent = this.messName || 'My Mess';

            const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
            const members = membersSnap.val() || {};
            const allMids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare((members[b]?.name || '')));
            const mids = allMids.filter(id => (members[id] || {}).status !== 'pending');
            const adminFound = mids.map(id => [id, members[id]]).find(([id, m]) => m && m.role === 'admin');
            if (adminFound) managerName = adminFound[1].name || '-';
            else if (mids.length) managerName = (members[mids[0]] || {}).name || '-';
            document.getElementById('dash-manager').textContent = managerName;
            document.getElementById('dash-month').textContent = this.fmtMonth(this.getSelMonth().date);

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

            const bzSnap = await db.ref(`messes/${this.messId}/bazarItems`).once('value');
            let bazTotal = 0;
            const paidBy = {};
            Object.values(bzSnap.val() || {}).forEach(b => {
                if ((b.category || 'bazar') === 'utility') return;
                if (!b.date || !b.date.startsWith(month)) return;
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
            const mealDepByName = {}; const utilDepByName = {}; let totalDep = 0; let totalMealDep = 0; let totalUtilDep = 0;
            Object.values(depAll).forEach(v => {
                if (!v || typeof v !== 'object') return;
                if (!v.date || !v.date.startsWith(month)) return;
                if (typeof v.amount === 'number' && v.memberId) {
                    totalDep += v.amount;
                    const cat = v.category || 'meal';
                    if (cat === 'utility') {
                        utilDepByName[v.memberId] = (utilDepByName[v.memberId] || 0) + v.amount;
                        totalUtilDep += v.amount;
                    } else {
                        mealDepByName[v.memberId] = (mealDepByName[v.memberId] || 0) + v.amount;
                        totalMealDep += v.amount;
                    }
                }
            });

            document.getElementById('dash-deposit').textContent = '৳ ' + this.fmtNum(totalMealDep);
            const finBal = totalMealDep - bazTotal;
            const balEl = document.getElementById('dash-balance');
            balEl.textContent = '৳ ' + this.fmtNum(finBal);
            balEl.className = finBal < 0 ? 'neg' : 'pos';
            document.getElementById('dash-rate').textContent = '৳ ' + rate.toFixed(2);

            let totalRent = 0, totalUtilCost = 0;
            Object.values(bzSnap.val() || {}).forEach(b => {
                if ((b.category || 'bazar') !== 'utility') return;
                if (!b.date || !b.date.startsWith(month)) return;
                const amt = parseFloat(b.cost) || 0;
                if ((b.name || '').toLowerCase() === 'rent') totalRent += amt;
                else totalUtilCost += amt;
            });
            document.getElementById('dash-util-deposit').textContent = '৳ ' + this.fmtNum(totalUtilDep);
            const utilBal = totalUtilDep - totalRent - totalUtilCost;
            const utilBalEl = document.getElementById('dash-util-balance');
            utilBalEl.textContent = '৳ ' + this.fmtNum(utilBal);
            utilBalEl.className = utilBal < 0 ? 'neg' : 'pos';

            const rowsEl = document.getElementById('dash-member-rows');
            if (!mids.length) { rowsEl.innerHTML = '<tr><td colspan="5" class="empty-state">No data</td></tr>'; return; }
            let html = '';
            mids.forEach(mid => {
                const m = members[mid] || {};
                const name = m.name || 'Unknown';
                const total = memberMeals[name] || 0;
                const cost = total * rate;
                const dep = mealDepByName[name] || 0;
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

            const utilRows = document.getElementById('dash-utility-rows');
            const utilByName = {};
            const rentByName = {};
            Object.values(bzSnap.val() || {}).forEach(b => {
                const amt = parseFloat(b.cost) || 0;
                if (!amt) return;
                if (!b.date || !b.date.startsWith(month)) return;
                if (b.category === 'utility') {
                    const n = (b.splitWith || b.memberId || '').trim();
                    if (!n) return;
                    if ((b.name || '').toLowerCase() === 'rent') {
                        rentByName[n] = (rentByName[n] || 0) + amt;
                    } else {
                        utilByName[n] = (utilByName[n] || 0) + amt;
                    }
                }
            });
            let utilHtml = '';
            mids.forEach(mid => {
                const m = members[mid] || {};
                const name = m.name || 'Unknown';
                const rent = rentByName[name] || 0;
                const util = utilByName[name] || 0;
                const dep = utilDepByName[name] || 0;
                const bal = dep - rent - util;
                utilHtml += `<tr>
                    <td class="c-name">${this.esc(name)}</td>
                    <td><strong>৳${this.fmtNum(rent)}</strong></td>
                    <td><strong>৳${this.fmtNum(util)}</strong></td>
                    <td><strong>৳${this.fmtNum(dep)}</strong></td>
                    <td class="${bal < 0 ? 'neg' : 'pos'}"><strong>৳${this.fmtNum(bal)}</strong></td>
                </tr>`;
            });
            utilRows.innerHTML = utilHtml || '<tr><td colspan="5" class="empty-state">No data</td></tr>';
            this.loadJoinRequests(members);
        } catch (e) { console.error('loadDashboard error:', e); }
    },

    async loadJoinRequests(members) {
        const div = document.getElementById('dash-join-requests');
        if (!div) return;
        const canManage = this.userRole === 'admin' || this.canDo('manage');
        const pending = Object.entries(members).filter(([, m]) => m && m.status === 'pending');
        if (!pending.length) { div.innerHTML = ''; return; }
        if (!canManage) {
            div.innerHTML = '';
            return;
        }
        const colors = ['#E53935','#1565C0','#2E7D32','#FF9800','#7B1FA2','#00838F'];
        let html = '';
        pending.forEach(([id, m], i) => {
            const initial = ((m.name || '?')[0] || '?').toUpperCase();
            const color = colors[i % colors.length];
            const email = m.email || '';
            html += `<div class="adash-join-card">
                <div class="adash-join-left">
                    <div class="adash-join-avatar" style="background:${color}">${initial}</div>
                    <div class="adash-join-info">
                        <strong>${this.esc(m.name || 'Unknown')}</strong>
                        <small>${this.esc(email)}</small>
                    </div>
                </div>
                <div class="adash-join-actions">
                    <button class="adash-join-btn adash-join-delete" onclick="App.rejectJoin('${id}')"><span class="material-icons-round">close</span></button>
                    <button class="adash-join-btn adash-join-confirm" onclick="App.confirmJoin('${id}')"><span class="material-icons-round">check</span></button>
                </div>
            </div>`;
        });
        div.innerHTML = html;
    },

    async confirmJoin(uid) {
        if (!this.messId) return;
        if (!this.checkPerm('manage')) return;
        try {
            const mSnap = await db.ref(`messes/${this.messId}/members/${uid}`).once('value');
            const m = mSnap.val() || {};
            const updates = {};
            updates[`messes/${this.messId}/members/${uid}/status`] = 'active';
            updates[`users/${uid}/messes/${this.messId}`] = { role: 'member', joinedAt: m.joinedAt || Date.now() };
            updates[`messes/${this.messId}/permissions/${uid}`] = { manage: false, mealEntry: false, mealEdit: false, bazarEntry: false, togglePerms: false };
            await db.ref().update(updates);
            this.toast(`${m.name || 'Member'} approved!`, 'success');
            this.loadDashboard();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async rejectJoin(uid) {
        if (!this.messId) return;
        if (!this.checkPerm('manage')) return;
        try {
            const mSnap = await db.ref(`messes/${this.messId}/members/${uid}`).once('value');
            const m = mSnap.val() || {};
            if (!confirm(`Reject ${m.name || 'this member'}?`)) return;
            await db.ref(`messes/${this.messId}/members/${uid}`).remove();
            this.toast('Request rejected', 'success');
            this.loadDashboard();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    goToPeopleTab() {
        this.navigate('members');
        setTimeout(() => this.switchFlatTab('peoples'), 100);
    },

    changeMonth() {
        const sm = this.getSelMonth();
        let options = '';
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const y = d.getFullYear();
            const m = d.getMonth();
            const val = `${y}-${String(m + 1).padStart(2, '0')}`;
            const label = `${d.toLocaleString('en-US', { month: 'long' })} ${y}`;
            const sel = y === sm.year && m === sm.month ? ' selected' : '';
            options += `<option value="${val}"${sel}>${label}</option>`;
        }
        document.getElementById('modal-title').textContent = 'Select Month';
        document.getElementById('modal-body').innerHTML = `<select id="month-picker-select" style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:10px;font-size:15px;background:var(--card);color:var(--text);outline:none">${options}</select>`;
        document.getElementById('modal-footer').innerHTML = `<div class="dep-footer-btns"><button class="btn-modal-add" onclick="App.confirmChangeMonth()" style="width:100%;padding:12px;border-radius:10px">OK</button></div>`;
        this.openModal();
    },

    confirmChangeMonth() {
        const sel = document.getElementById('month-picker-select');
        if (sel && sel.value) {
            const [y, m] = sel.value.split('-').map(Number);
            this._selYear = y;
            this._selMonth = m - 1;
        }
        this.closeModal();
        const page = this.currentPage;
        if (page === 'dashboard') this.loadDashboard();
        else this.navigate(page);
    },

    goToAddMeal(type) {
        const now = new Date();
        this._aamDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        this._aamEditName = null;
        this._aamEditType = null;
        this.navigate('addmeal');
    },

    mealPickMonth() {
        this.changeMonth();
    },

    async loadMeals() {
        if (!this.messId) return;
        const sm = this.getSelMonth();
        const month = sm.key;
        const daysInMonth = new Date(sm.year, sm.month + 1, 0).getDate();
        const monthLabel = `${sm.date.toLocaleString('en-US',{month:'long'})} ${sm.year}`;
        document.getElementById('ameal-month').textContent = monthLabel;
        const loader = document.getElementById('ameal-loader');
        const scroll = document.getElementById('ameal-grid-scroll');
        loader.style.display = 'flex';
        scroll.style.display = 'none';
        try {
            const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
            const members = membersSnap.val() || {};
            const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare(members[b]?.name || ''));
            if (!mids.length) { loader.innerHTML = '<p class="empty-state">No members</p>'; return; }
            const mealsSnap = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-' + String(daysInMonth).padStart(2,'0')).once('value');
            const allMeals = mealsSnap.val() || {};
            const memberData = {};
            const nameToMid = {};
            mids.forEach(mid => {
                const m = members[mid] || {};
                const name = m.name || 'Unknown';
                memberData[mid] = { name, breakfast: new Array(daysInMonth).fill(0), lunch: new Array(daysInMonth).fill(0), dinner: new Array(daysInMonth).fill(0), breakfastTotal: 0, lunchTotal: 0, dinnerTotal: 0 };
                nameToMid[name] = mid;
            });
            Object.entries(allMeals).forEach(([dateKey, dayMeals]) => {
                const day = parseInt(dateKey.slice(8, 10), 10) - 1;
                if (day < 0 || day >= daysInMonth) return;
                Object.entries(dayMeals || {}).forEach(([memberName, m]) => {
                    const mid = nameToMid[memberName];
                    if (!mid || !memberData[mid]) return;
                    const bf = m.breakfast || 0;
                    const lunch = m.lunch || 0;
                    const dinner = m.dinner || 0;
                    memberData[mid].breakfast[day] += bf;
                    memberData[mid].lunch[day] += lunch;
                    memberData[mid].dinner[day] += dinner;
                    memberData[mid].breakfastTotal += bf;
                    memberData[mid].lunchTotal += lunch;
                    memberData[mid].dinnerTotal += dinner;
                });
            });
            const today = new Date().getDate();
            const viewHide = JSON.parse(localStorage.getItem('meal_view_hide') || '{}');
            const showBf = !viewHide.breakfast;
            const showLc = !viewHide.lunch;
            const showDn = !viewHide.dinner;
            const visibleRows = [showBf, showLc, showDn].filter(Boolean).length;
            let html = '<thead><tr><th class="am-col-view" colspan="2"><span class="ameal-row-label" style="justify-content:center;cursor:pointer;color:#fff" onclick="App.showMealViewPopup()"><span class="material-icons-round" style="font-size:14px">tune</span> View</span></th>';
                    for (let d = 1; d <= daysInMonth; d++) html += `<th${d===today?' data-today="1" style="background:#c8ddf0;color:#000"':''}>${d}</th>`;
            html += '</tr></thead><tbody>';
            const colors = ['#0b3d91','#0d4fb5','#1565C0','#08306b','#3b7bdd','#1976D2'];
            const mealTypes = [];
            if (showBf) mealTypes.push('breakfast');
            if (showLc) mealTypes.push('lunch');
            if (showDn) mealTypes.push('dinner');
            mids.forEach((mid, idx) => {
                const md = memberData[mid];
                const bg = colors[idx % colors.length];
                const total = md.breakfastTotal + md.lunchTotal + md.dinnerTotal;
                const mealColors = { breakfast: { bg: '#fff8e1', color: '#e65100', icon: '☕', label: 'Breakfast' }, lunch: { bg: '#e8f5e9', color: '#2E7D32', icon: '🍔', label: 'Lunch' }, dinner: { bg: '#e3f2fd', color: '#1565C0', icon: '🍽', label: 'Dinner' } };
                const classes = { breakfast: 'ameal-row-bf', lunch: 'ameal-row-lc', dinner: 'ameal-row-dn' };
                mealTypes.forEach((type, ri) => {
                    const mc = mealColors[type];
                    const isFirst = ri === 0;
                    html += `<tr class="${classes[type]}">`;
                    if (isFirst) html += `<td rowspan="${visibleRows}" class="am-col-name" style="background:${bg}"><div class="ameal-mname">${this.esc(md.name)}</div><div class="ameal-mtotal">(${total})</div></td>`;
                    html += `<td class="am-col-type" style="background:${mc.bg}"><div class="ameal-row-label"><span style="font-size:12px">${mc.icon}</span><span class="ameal-row-count" style="color:${mc.color}${md[type+'Total']===0?';color:#ccc':''}">${md[type+'Total']}</span><span style="color:${mc.color};font-size:10px">${mc.label}</span></div></td>`;
                    for (let d = 0; d < daysInMonth; d++) {
                        const v = md[type][d];
                        const cls = d + 1 === today ? ' class="ame-day-today"' : '';
                        const dateKey = `${month}-${String(d + 1).padStart(2, '0')}`;
                        const click = v ? ` onclick="App.mealCellClick(event,'${md.name.replace(/'/g,"\\'")}','${dateKey}','${type}',${v})"` : '';
                        html += `<td${cls}${click} style="${v?'font-weight:600;cursor:pointer':''}">${v || ''}</td>`;
                    }
                    html += '</tr>';
                });
            });
            html += '</tbody>';
            document.getElementById('ameal-table').innerHTML = html;
            loader.style.display = 'none';
            scroll.style.display = 'block';
            const todayTh = scroll.querySelector('th[data-today]');
            if (todayTh) { requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const headerW = scroll.querySelector('th.am-col-view')?.offsetWidth || 160;
                    const typeW = 90;
                    const stickyTotal = headerW + typeW;
                    const viewWidth = scroll.clientWidth - stickyTotal;
                    const cellCenter = todayTh.offsetLeft + todayTh.offsetWidth / 2 - stickyTotal;
                    scroll.scrollLeft = Math.max(0, cellCenter - viewWidth / 2);
                });
            }); }
        } catch (e) { console.error('loadMeals error:', e); loader.innerHTML = '<p class="empty-state">Error loading</p>'; }
    },

    openAddMealToday() {
        this._aamDate = null;
        this._aamEditName = null;
        this._aamEditType = null;
        this.navigate('addmeal');
    },

    openAddCostToday() {
        this.navigate('addcost');
    },

    openAddDepositToday() {
        this.navigate('adddeposit');
    },

    async loadAddMeal() {
        if (!this.messId) return;
        if (!this.checkPerm('mealEntry')) { this.navigate('meals'); return; }
        const now = new Date();
        const dateKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        if (!this._aamDate) this._aamDate = dateKey;
        const dd = new Date(this._aamDate + 'T00:00:00');
        const dateStr = `${dd.getDate()} ${dd.toLocaleDateString('en-US',{month:'long'})} ${dd.getFullYear()}`;
        const dateEl = document.getElementById('aam-date-text');
        if (dateEl) dateEl.textContent = dateStr;
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = snap.val() || {};
        const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare(members[b]?.name || ''));
        const colors = ['#0b3d91','#0d4fb5','#1565C0','#08306b','#3b7bdd','#1976D2'];
        this._aamData = {};
        let cardsHtml = '';
        mids.forEach((mid, idx) => {
            const m = members[mid] || {};
            const name = m.name || 'Unknown';
            const bg = colors[idx % colors.length];
            this._aamData[name] = { breakfast: 0, lunch: 0, dinner: 0 };
            cardsHtml += `<div class="aam-card"><div class="aam-card-top"><div class="aam-avatar" style="background:${bg}20"><span style="color:${bg};font-size:18px;font-weight:700">${name.charAt(0).toUpperCase()}</span></div><span class="aam-name">${this.esc(name)}</span><span class="aam-total" id="aam-total-${idx}">Total: 0</span></div><div class="aam-meals-row"><div class="aam-meal-col"><label>Breakfast</label><div class="aam-counter"><button onclick="App.aamAdjust(${idx},'${name}','breakfast',-1)">-</button><span class="aam-val" id="aam-bf-${idx}">0</span><button onclick="App.aamAdjust(${idx},'${name}','breakfast',1)">+</button></div></div><div class="aam-meal-col"><label>Lunch</label><div class="aam-counter"><button onclick="App.aamAdjust(${idx},'${name}','lunch',-1)">-</button><span class="aam-val" id="aam-ln-${idx}">0</span><button onclick="App.aamAdjust(${idx},'${name}','lunch',1)">+</button></div></div><div class="aam-meal-col"><label>Dinner</label><div class="aam-counter"><button onclick="App.aamAdjust(${idx},'${name}','dinner',-1)">-</button><span class="aam-val" id="aam-dn-${idx}">0</span><button onclick="App.aamAdjust(${idx},'${name}','dinner',1)">+</button></div></div></div></div>`;
        });
        document.getElementById('aam-member-cards').innerHTML = cardsHtml || '<p class="empty-state" style="padding:20px;text-align:center;color:#999">No members</p>';
        try {
            const mealSnap = await db.ref(`messes/${this.messId}/meals/${this._aamDate}`).once('value');
            const existing = mealSnap.val() || {};
            mids.forEach((mid, idx) => {
                const name = members[mid]?.name || 'Unknown';
                const em = existing[name] || {};
                if (em.breakfast || em.lunch || em.dinner) {
                    if (this._aamData[name]) {
                        this._aamData[name].breakfast = em.breakfast || 0;
                        this._aamData[name].lunch = em.lunch || 0;
                        this._aamData[name].dinner = em.dinner || 0;
                    }
                    const bfEl = document.getElementById(`aam-bf-${idx}`);
                    const lnEl = document.getElementById(`aam-ln-${idx}`);
                    const dnEl = document.getElementById(`aam-dn-${idx}`);
                    const totEl = document.getElementById(`aam-total-${idx}`);
                    if (bfEl) bfEl.textContent = em.breakfast || 0;
                    if (lnEl) lnEl.textContent = em.lunch || 0;
                    if (dnEl) dnEl.textContent = em.dinner || 0;
                    if (totEl) totEl.textContent = `Total: ${(em.breakfast||0)+(em.lunch||0)+(em.dinner||0)}`;
                }
            });
            if (this._aamEditName) {
                this._aamEditName = null;
                this._aamEditType = null;
            }
        } catch (e) { console.error('loadAddMeal load existing:', e); }
    },

    async showAddMeal(preType) {
        if (!this.messId) return;
        if (!this.checkPerm('mealEntry')) return;
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = snap.val() || {};
        const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare(members[b]?.name || ''));
        const viewHide = JSON.parse(localStorage.getItem('meal_view_hide') || '{}');
        const showBf = !viewHide.breakfast;
        const showLc = !viewHide.lunch;
        const showDn = !viewHide.dinner;
        const dateKey = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')}`;
        this._aamDate = dateKey;
        const dd = new Date(dateKey + 'T00:00:00');
        const dateStr = `${dd.getDate()} ${dd.toLocaleDateString('en-US',{month:'long'})}, ${dd.getFullYear()}`;
        const colors = ['#0b3d91','#0d4fb5','#1565C0','#08306b','#3b7bdd','#1976D2'];
        this._aamData = {};
        let cardsHtml = '';
        mids.forEach((mid, idx) => {
            const m = members[mid] || {};
            const name = m.name || 'Unknown';
            const bg = colors[idx % colors.length];
            this._aamData[name] = { breakfast: preType === 'breakfast' ? 1 : 0, lunch: preType === 'lunch' ? 1 : 0, dinner: preType === 'dinner' ? 1 : 0 };
            let mealsHtml = '';
            if (showBf) mealsHtml += `<div class="aam-meal-col"><label>Breakfast</label><div class="aam-counter"><button onclick="App.aamAdjust(${idx},'${name}','breakfast',-1)">-</button><span class="aam-val" id="aam-bf-${idx}">${preType === 'breakfast' ? 1 : 0}</span><button onclick="App.aamAdjust(${idx},'${name}','breakfast',1)">+</button></div></div>`;
            if (showLc) mealsHtml += `<div class="aam-meal-col"><label>Lunch</label><div class="aam-counter"><button onclick="App.aamAdjust(${idx},'${name}','lunch',-1)">-</button><span class="aam-val" id="aam-ln-${idx}">${preType === 'lunch' ? 1 : 0}</span><button onclick="App.aamAdjust(${idx},'${name}','lunch',1)">+</button></div></div>`;
            if (showDn) mealsHtml += `<div class="aam-meal-col"><label>Dinner</label><div class="aam-counter"><button onclick="App.aamAdjust(${idx},'${name}','dinner',-1)">-</button><span class="aam-val" id="aam-dn-${idx}">${preType === 'dinner' ? 1 : 0}</span><button onclick="App.aamAdjust(${idx},'${name}','dinner',1)">+</button></div></div>`;
            cardsHtml += `<div class="aam-card"><div class="aam-card-top"><div class="aam-avatar" style="background:${bg}20"><span style="color:${bg};font-size:18px;font-weight:700">${name.charAt(0).toUpperCase()}</span></div><span class="aam-name">${this.esc(name)}</span><span class="aam-total" id="aam-total-${idx}">Total: ${preType ? 1 : 0}</span></div><div class="aam-meals-row">${mealsHtml}</div></div>`;
        });
        document.getElementById('modal-title').textContent = 'Add Meal';
        document.getElementById('modal-body').innerHTML = `<div class="dep-date" style="position:relative;cursor:pointer" onclick="App.aamPickDate()"><span class="material-icons-round">calendar_month</span> <span id="aam-date-text">${dateStr}</span><span class="material-icons-round" style="margin-left:auto;font-size:18px;color:#999">expand_more</span></div><div id="aam-cards-wrap">${cardsHtml || '<p class="empty-state">No members</p>'}</div>`;
        document.getElementById('modal-footer').innerHTML = `<div class="dep-footer-btns"><button class="btn-modal-add" onclick="App.aamSave()" style="width:100%;padding:12px;border-radius:10px">Add</button></div>`;
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

    aamOnDateChange(val) {
        if (!val) return;
        this._aamDate = val;
        const dd = new Date(val + 'T00:00:00');
        const txt = document.getElementById('aam-date-text');
        if (txt) txt.textContent = `${dd.getDate()} ${dd.toLocaleDateString('en-US',{month:'long'})} ${dd.getFullYear()}`;
        if (this.currentPage === 'addmeal') this.loadAddMeal();
    },

    aamPickDate() {
        const old = document.getElementById('aam-date-hid');
        if (old) old.remove();
        const input = document.createElement('input');
        input.type = 'date';
        input.id = 'aam-date-hid';
        input.value = this._aamDate;
        input.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0';
        input.oninput = () => this.aamOnDateChange(input.value);
        document.body.appendChild(input);
        input.click();
        setTimeout(() => { try { input.showPicker(); } catch(e) {} }, 100);
    },

    async aamSave() {
        if (!this.messId || !this._aamData) return;
        const dateKey = this._aamDate;
        let saved = 0;
        const userName = this.currentUser?.displayName || 'Unknown';
        for (const [name, m] of Object.entries(this._aamData)) {
            if (m.breakfast || m.lunch || m.dinner) {
                await db.ref(`messes/${this.messId}/meals/${dateKey}/${name}`).set({ lunch: m.lunch, dinner: m.dinner, breakfast: m.breakfast });
                const meals = [];
                if (m.breakfast) meals.push('Breakfast');
                if (m.lunch) meals.push('Lunch');
                if (m.dinner) meals.push('Dinner');
                await db.ref(`messes/${this.messId}/mealHistory`).push({
                    member: name, date: dateKey, type: meals.join(', '),
                    count: (m.breakfast || 0) + (m.lunch || 0) + (m.dinner || 0),
                    action: 'added', user: userName, createdAt: Date.now()
                });
                saved++;
            }
        }
        if (saved) { try { this.closeModal(); } catch(e) {} this.toast(`${saved} member meal${saved>1?'s':''} saved!`, 'success'); this.navigate('meals'); }
        else this.toast('Set at least one meal', 'error');
    },

    mealCellClick(e, memberName, dateKey, mealType, currentVal) {
        e.stopPropagation();
        const existing = document.querySelector('.meal-cell-popup');
        if (existing) existing.remove();
        const popup = document.createElement('div');
        popup.className = 'meal-cell-popup';
        popup.innerHTML = `
            <button onclick="App.mealDeleteCell('${memberName.replace(/'/g,"\\'")}','${dateKey}','${mealType}',${currentVal})"><span class="material-icons-round">delete</span> Delete</button>
            <button onclick="App.mealEditCell('${memberName.replace(/'/g,"\\'")}','${dateKey}','${mealType}')"><span class="material-icons-round">edit</span> Edit</button>
        `;
        document.body.appendChild(popup);
        const rect = e.target.getBoundingClientRect();
        popup.style.top = (rect.bottom + 4) + 'px';
        popup.style.left = Math.min(rect.left, window.innerWidth - 160) + 'px';
        setTimeout(() => { document.addEventListener('click', function handler() { popup.remove(); document.removeEventListener('click', handler); }); }, 0);
    },

    async mealDeleteCell(memberName, dateKey, mealType, currentVal) {
        const popup = document.querySelector('.meal-cell-popup');
        if (popup) popup.remove();
        if (!this.messId) return;
        const userName = this.currentUser?.displayName || 'Unknown';
        const typeLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);
        try {
            const snap = await db.ref(`messes/${this.messId}/meals/${dateKey}/${memberName}`).once('value');
            const data = snap.val() || {};
            const newVal = { breakfast: data.breakfast || 0, lunch: data.lunch || 0, dinner: data.dinner || 0 };
            newVal[mealType] = 0;
            await db.ref(`messes/${this.messId}/meals/${dateKey}/${memberName}`).set(newVal);
            await db.ref(`messes/${this.messId}/mealHistory`).push({
                member: memberName, date: dateKey, type: typeLabel,
                count: currentVal, action: 'removed', user: userName, createdAt: Date.now()
            });
            this.toast(`${typeLabel} deleted for ${memberName}`, 'success');
            this.loadMeals();
        } catch (err) { console.error(err); this.toast('Delete failed', 'error'); }
    },

    mealEditCell(memberName, dateKey, mealType) {
        const popup = document.querySelector('.meal-cell-popup');
        if (popup) popup.remove();
        this._aamDate = dateKey;
        this._aamEditName = memberName;
        this._aamEditType = mealType;
        this.navigate('addmeal');
    },

    showMealViewPopup() {
        const saved = JSON.parse(localStorage.getItem('meal_view_hide') || '{}');
        const bf = !saved.breakfast;
        const lc = !saved.lunch;
        const dn = !saved.dinner;
        const body = document.getElementById('modal-body');
        body.innerHTML = `
            <p style="margin:0 0 16px;font-size:14px;color:#777">Select which meal rows to show in the table:</p>
            <div style="display:flex;flex-direction:column;gap:12px">
                <label style="display:flex;align-items:center;gap:12px;cursor:pointer;padding:12px;border-radius:10px;background:var(--card);border:1px solid var(--border)">
                    <input type="checkbox" id="view-bf" ${bf?'checked':''} style="width:18px;height:18px;accent-color:#e65100">
                    <span style="font-size:20px">☕</span>
                    <span style="flex:1;font-size:15px;font-weight:600">Breakfast</span>
                    <span style="font-size:13px;color:#e65100">Orange</span>
                </label>
                <label style="display:flex;align-items:center;gap:12px;cursor:pointer;padding:12px;border-radius:10px;background:var(--card);border:1px solid var(--border)">
                    <input type="checkbox" id="view-lc" ${lc?'checked':''} style="width:18px;height:18px;accent-color:#2E7D32">
                    <span style="font-size:20px">🍔</span>
                    <span style="flex:1;font-size:15px;font-weight:600">Lunch</span>
                    <span style="font-size:13px;color:#2E7D32">Green</span>
                </label>
                <label style="display:flex;align-items:center;gap:12px;cursor:pointer;padding:12px;border-radius:10px;background:var(--card);border:1px solid var(--border)">
                    <input type="checkbox" id="view-dn" ${dn?'checked':''} style="width:18px;height:18px;accent-color:#1565C0">
                    <span style="font-size:20px">🍽</span>
                    <span style="flex:1;font-size:15px;font-weight:600">Dinner</span>
                    <span style="font-size:13px;color:#1565C0">Blue</span>
                </label>
            </div>`;
        document.getElementById('modal-title').textContent = 'View Settings';
        document.getElementById('modal-footer').innerHTML = '';
        document.getElementById('modal-overlay').classList.add('active');
        const apply = () => {
            const hide = {};
            if (!document.getElementById('view-bf').checked) hide.breakfast = true;
            if (!document.getElementById('view-lc').checked) hide.lunch = true;
            if (!document.getElementById('view-dn').checked) hide.dinner = true;
            localStorage.setItem('meal_view_hide', JSON.stringify(hide));
            this.loadMeals();
        };
        document.getElementById('view-bf').onchange = apply;
        document.getElementById('view-lc').onchange = apply;
        document.getElementById('view-dn').onchange = apply;
    },

    async loadMealHistory() {
        if (!this.messId) return;
        const sm = this.getSelMonth();
        const month = sm.key;
        document.getElementById('mealhist-month').textContent = this.fmtMonth(sm.date);
        const div = document.getElementById('mealhist-list');
        div.innerHTML = '<p class="empty-state">Loading...</p>';
        try {
            const snap = await db.ref(`messes/${this.messId}/mealHistory`).orderByChild('createdAt').once('value');
            const entries = Object.entries(snap.val() || {})
                .filter(([, v]) => v.date && v.date.startsWith(month))
                .sort((a, b) => (b[1].createdAt || 0) - (a[1].createdAt || 0));
            if (!entries.length) { div.innerHTML = '<p class="empty-state">No meal edits this month</p>'; return; }
            let html = '';
            entries.forEach(([k, v]) => {
                const d = new Date(v.createdAt || 0);
                const dateStr = d.toLocaleString('en', { day: 'numeric', month: 'short', year: 'numeric' });
                const timeStr = d.toLocaleString('en', { hour: 'numeric', minute: '2-digit', hour12: true });
                const typeColor = (v.type || '').includes('Lunch') ? '#2E7D32' : (v.type || '').includes('Dinner') ? '#1565C0' : '#E65100';
                const actionIcon = v.action === 'removed' ? 'remove_circle' : 'check_circle';
                const actionColor = v.action === 'removed' ? '#D32F2F' : typeColor;
                html += `<div class="amealhist-card" onclick="this.classList.toggle('expanded')">
                    <div class="amealhist-row">
                        <div class="amealhist-left">
                            <span class="amealhist-name">${this.esc(v.member || '?')}</span>
                            <span class="amealhist-dot" style="background:${actionColor}"></span>
                            <span class="amealhist-type" style="color:${typeColor}">${this.esc(v.type || '?')}</span>
                            <span class="amealhist-count">${v.count || 0} meal${v.count !== 1 ? 's' : ''}</span>
                        </div>
                        <div class="amealhist-right">
                            <span class="amealhist-user">${v.action === 'removed' ? 'Removed by:' : 'Added by:'} ${this.esc(v.user || '?')}</span>
                            <span class="amealhist-date">${dateStr} ${timeStr}</span>
                        </div>
                        <span class="material-icons-round ameatlhist-chevron">expand_more</span>
                    </div>
                    <div class="amealhist-detail">
                        <div class="amealhist-detail-row">
                            <span class="amealhist-dot ${v.action === 'removed' ? 'red' : 'green'}"></span>
                            <span>${v.action === 'removed' ? 'Removed' : 'Added'} by: <strong>${this.esc(v.user || '?')}</strong></span>
                            <span> · ${dateStr} ${timeStr}</span>
                        </div>
                        <div class="amealhist-detail-info">${this.esc(v.type || '?')} — ${v.count || 0} meal(s)</div>
                    </div>
                </div>`;
            });
            div.innerHTML = html;
        } catch (e) { console.error('loadMealHistory error:', e); div.innerHTML = '<p class="empty-state">Error loading</p>'; }
    },

    async loadCostTrash() {
        if (!this.messId) return;
        const sm = this.getSelMonth();
        const month = sm.key;
        const el = document.getElementById('costtrash-month');
        if (el) el.textContent = this.fmtMonth(sm.date);
        const div = document.getElementById('costtrash-list');
        div.innerHTML = '<p class="empty-state">Loading...</p>';
        try {
            const snap = await db.ref(`messes/${this.messId}/costTrash`).orderByChild('deletedAt').once('value');
            const entries = Object.entries(snap.val() || {})
                .filter(([, v]) => v.deletedAt && new Date(v.deletedAt).toISOString().startsWith(month))
                .sort((a, b) => (b[1].deletedAt || 0) - (a[1].deletedAt || 0));
            if (!entries.length) { div.innerHTML = '<p class="empty-state">No deleted costs this month</p>'; return; }
            let html = '';
            entries.forEach(([k, v]) => {
                const d = new Date(v.deletedAt || 0);
                const dateStr = d.toLocaleString('en', { day: 'numeric', month: 'short', year: 'numeric' });
                const timeStr = d.toLocaleString('en', { hour: 'numeric', minute: '2-digit', hour12: true });
                const catLabel = v.category === 'utility' ? 'Utility & Others' : 'Meal';
                const catColor = v.category === 'utility' ? '#7B1FA2' : '#0b3d91';
                html += `<div class="amealhist-card" onclick="this.classList.toggle('expanded')">
                    <div class="amealhist-row">
                        <div class="amealhist-left">
                            <span class="amealhist-name">${this.esc(v.name || '?')}</span>
                            <span class="amealhist-dot" style="background:#D32F2F"></span>
                            <span class="amealhist-type" style="color:#D32F2F">৳${Number(v.cost || 0).toLocaleString()}</span>
                            <span class="amealhist-count">${catLabel}</span>
                        </div>
                        <div class="amealhist-right">
                            <span class="amealhist-user">Deleted by: ${this.esc(v.deletedBy || '?')}</span>
                            <span class="amealhist-date">${dateStr} ${timeStr}</span>
                        </div>
                        <span class="material-icons-round ameatlhist-chevron">expand_more</span>
                    </div>
                    <div class="amealhist-detail">
                        <div class="amealhist-detail-row">
                            <span class="amealhist-dot red"></span>
                            <span>Deleted by: <strong>${this.esc(v.deletedBy || '?')}</strong></span>
                            <span> · ${dateStr} ${timeStr}</span>
                        </div>
                        <div class="amealhist-detail-info">Cost: ৳${Number(v.cost || 0).toLocaleString()} — ${catLabel}</div>
                        ${v.addedBy ? `<div class="amealhist-detail-info">Originally added by: ${this.esc(v.addedBy)}</div>` : ''}
                    </div>
                </div>`;
            });
            div.innerHTML = html;
        } catch (e) { console.error('loadCostTrash error:', e); div.innerHTML = '<p class="empty-state">Error loading</p>'; }
    },

    async loadDepTrash() {
        if (!this.messId) return;
        const sm = this.getSelMonth();
        const month = sm.key;
        const el = document.getElementById('deptrash-month');
        if (el) el.textContent = this.fmtMonth(sm.date);
        const div = document.getElementById('deptrash-list');
        div.innerHTML = '<p class="empty-state">Loading...</p>';
        try {
            const snap = await db.ref(`messes/${this.messId}/depTrash`).orderByChild('deletedAt').once('value');
            const entries = Object.entries(snap.val() || {})
                .filter(([, v]) => v.deletedAt && new Date(v.deletedAt).toISOString().startsWith(month))
                .sort((a, b) => (b[1].deletedAt || 0) - (a[1].deletedAt || 0));
            if (!entries.length) { div.innerHTML = '<p class="empty-state">No deleted deposits this month</p>'; return; }
            let html = '';
            entries.forEach(([k, v]) => {
                const d = new Date(v.deletedAt || 0);
                const dateStr = d.toLocaleString('en', { day: 'numeric', month: 'short', year: 'numeric' });
                const timeStr = d.toLocaleString('en', { hour: 'numeric', minute: '2-digit', hour12: true });
                const members = this._depMembers || {};
                const memberName = (members[v.memberId] || {}).name || v.memberId || '?';
                const catLabel = v.category === 'utility' ? 'Utility & Others' : 'Meal';
                const catColor = v.category === 'utility' ? '#7B1FA2' : '#0b3d91';
                html += `<div class="amealhist-card" onclick="this.classList.toggle('expanded')">
                    <div class="amealhist-row">
                        <div class="amealhist-left">
                            <span class="amealhist-name">${this.esc(memberName)}</span>
                            <span class="amealhist-dot" style="background:#D32F2F"></span>
                            <span class="amealhist-type" style="color:#D32F2F">৳${Number(v.amount || 0).toLocaleString()}</span>
                            <span class="amealhist-count">${catLabel}</span>
                        </div>
                        <div class="amealhist-right">
                            <span class="amealhist-user">Deleted by: ${this.esc(v.deletedBy || '?')}</span>
                            <span class="amealhist-date">${dateStr} ${timeStr}</span>
                        </div>
                        <span class="material-icons-round ameatlhist-chevron">expand_more</span>
                    </div>
                    <div class="amealhist-detail">
                        <div class="amealhist-detail-row">
                            <span class="amealhist-dot red"></span>
                            <span>Deleted by: <strong>${this.esc(v.deletedBy || '?')}</strong></span>
                            <span> · ${dateStr} ${timeStr}</span>
                        </div>
                        <div class="amealhist-detail-info">Deposit: ৳${Number(v.amount || 0).toLocaleString()} — ${catLabel}</div>
                        ${v.addedBy ? `<div class="amealhist-detail-info">Originally added by: ${this.esc(v.addedBy)}</div>` : ''}
                    </div>
                </div>`;
            });
            div.innerHTML = html;
        } catch (e) { console.error('loadDepTrash error:', e); div.innerHTML = '<p class="empty-state">Error loading</p>'; }
    },

    async loadBazarList() {
        if (!this.messId) return;
        const sm = this.getSelMonth();
        const month = sm.key;
        document.getElementById('abazar-month').textContent = this.fmtMonth(sm.date);
        this._bazarFilter = 'bazar';
        const filterBtns = document.querySelectorAll('#abazar-filters .abazar-filter-btn');
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'bazar'));
        const div = document.getElementById('abazar-list');
        div.innerHTML = '<p class="empty-state">Loading...</p>';
        try {
            const [bazarSnap, membersSnap] = await Promise.all([
                db.ref(`messes/${this.messId}/bazarItems`).orderByChild('date').once('value'),
                db.ref(`messes/${this.messId}/members`).once('value')
            ]);
            const members = membersSnap.val() || {};
            this._allBazar = Object.entries(bazarSnap.val() || {})
                .filter(([, v]) => v.date && v.date.startsWith(month))
                .sort((a, b) => (b[1].date || '').localeCompare(a[1].date || '') || (b[1].createdAt || 0) - (a[1].createdAt || 0));
            this._bazarMembers = members;
            this.renderBazarList();
        } catch (e) { console.error('loadBazarList error:', e); div.innerHTML = '<p class="empty-state">Error loading</p>'; }
    },

    filterBazar(filter) {
        this._bazarFilter = filter;
        document.querySelectorAll('#abazar-filters .abazar-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
        this.renderBazarList();
    },

    renderBazarList() {
        const filter = this._bazarFilter || 'bazar';
        let items = filter === 'all' ? (this._allBazar || []) : (this._allBazar || []).filter(([, v]) => (v.category || 'bazar') === filter);
        const members = this._bazarMembers || {};
        const isUtility = filter === 'utility';

        if (isUtility) {
            const grouped = {};
            items.forEach(([k, v]) => {
                const gKey = `${v.date}_${v.name}`;
                if (!grouped[gKey]) grouped[gKey] = { name: v.name, date: v.date, total: 0, members: [], key: k, category: v.category, addedBy: v.addedBy, createdAt: v.createdAt };
                grouped[gKey].total += parseFloat(v.cost) || 0;
                if (v.splitWith && !grouped[gKey].members.includes(v.splitWith)) grouped[gKey].members.push(v.splitWith);
            });
            items = Object.values(grouped).map(g => [g.key, { name: g.name, cost: g.total, splitWith: g.members.join(', '), date: g.date, category: g.category, addedBy: g.addedBy, createdAt: g.createdAt, _count: g.members.length }]);
        }

        const total = items.reduce((s, [, v]) => s + (parseFloat(v.cost) || 0), 0);
        const totalEl = document.getElementById('abazar-filter-total');
        if (totalEl) totalEl.textContent = items.length ? '৳ ' + this.fmtNum(total) : '';
        const div = document.getElementById('abazar-list');
        if (!items.length) { div.innerHTML = '<p class="empty-state">No cost items this month</p>'; return; }
        const grouped2 = {};
        items.forEach(([k, v]) => {
            const day = v.date.slice(0, 10);
            (grouped2[day] = grouped2[day] || []).push({ key: k, ...v });
        });
        let html = '';
        Object.entries(grouped2).forEach(([day, dayItems]) => {
            const d = new Date(day + 'T00:00:00');
            const dayTotal = dayItems.reduce((s, i) => s + (parseFloat(i.cost) || 0), 0);
            const expanded = day === Object.keys(grouped2)[0];
            html += `<div class="abazar-day-card">
                <div class="abazar-day-head${expanded ? ' expanded' : ''}" onclick="App.toggleDayCard(this)">
                    <div class="abazar-day-info"><h3>${d.getDate()} ${this.shortMon(d)}, ${d.toLocaleDateString('en',{weekday:'long'})}</h3><p>${dayItems.length} item${dayItems.length>1?'s':''}</p></div>
                    <span class="abazar-day-total">৳${this.fmtNum(dayTotal)}</span>
                    <span class="material-icons-round">expand_more</span>
                </div>
                <div class="abazar-day-items${isUtility ? ' abazar-util-grid' : ''}" style="${expanded?'':'display:none'}">
                    <div class="abazar-day-items-head${isUtility ? ' abazar-util-grid' : ''}"><span>ITEM</span>${isUtility ? '<span>DIVIDED TO</span><span>EACH</span>' : '<span>MONEY FROM</span>'}<span>TOTAL</span></div>
                    ${dayItems.map(i => {
                        const isUtil = (i.category || 'bazar') === 'utility';
                        if (isUtil) {
                            const each = i._count ? Math.round((parseFloat(i.cost) || 0) / i._count * 100) / 100 : parseFloat(i.cost) || 0;
                            return `<div class="abazar-item-row abazar-util-grid" onclick="App.toggleBazarItem(this)">
                            <span class="abazar-item-name">${this.esc(i.name || '-')}</span>
                            <span class="abazar-item-buyer">${this.esc(i.splitWith || '-')}</span>
                            <span class="abazar-item-each">৳${this.fmtNum(each)}</span>
                            <span class="abazar-item-cost">৳${this.fmtNum(parseFloat(i.cost)||0)} <span class="material-icons-round">expand_more</span></span>
                        </div>
                        <div class="abazar-item-detail" style="display:none">
                            <div class="abazar-item-detail-info">
                                <span class="abazar-detail-dot green"></span>
                                <span>Added by: <strong>${this.esc(i.addedBy || 'Unknown')}</strong></span>
                                ${i.createdAt ? `<span> · ${new Date(i.createdAt).toLocaleString('en',{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit',hour12:true})}</span>` : ''}
                            </div>
                            <div class="abazar-item-detail-row">${this.esc(i.name || '-')} — ৳${this.fmtNum(parseFloat(i.cost)||0)} (${i._count || 0} members)</div>
                            <div class="abazar-item-detail-btns">
                                <button class="abazar-btn-delete" onclick="event.stopPropagation();App.deleteBazarItem('${i.key}')"><span class="material-icons-round">delete</span> Delete</button>
                            </div>
                        </div>`;
                        }
                        const buyerName = (members[i.memberId]||{}).name || i.memberId || '-';
                        return `<div class="abazar-item-row" onclick="App.toggleBazarItem(this)">
                        <span class="abazar-item-name">${this.esc(i.name || '-')}</span>
                        <span class="abazar-item-buyer">${this.esc(buyerName)}</span>
                        <span class="abazar-item-cost">৳${this.fmtNum(parseFloat(i.cost)||0)} <span class="material-icons-round">expand_more</span></span>
                    </div>
                    <div class="abazar-item-detail" style="display:none">
                        ${i.splitWith ? `<div class="abazar-detail-price">৳${this.fmtNum(parseFloat(i.cost)||0)} each</div>
                        <div class="abazar-detail-split">${this.esc(i.splitWith)}</div>` : ''}
                        <div class="abazar-item-detail-info">
                            <span class="abazar-detail-dot green"></span>
                            <span>Added by: <strong>${this.esc(i.addedBy || 'Unknown')}</strong></span>
                            ${i.createdAt ? `<span> · ${new Date(i.createdAt).toLocaleString('en',{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit',hour12:true})}</span>` : ''}
                        </div>
                        <div class="abazar-item-detail-row">${this.esc(i.name || '-')} — ৳${this.fmtNum(parseFloat(i.cost)||0)}</div>
                        ${i.editedBy ? `<div class="abazar-item-detail-info">
                            <span class="abazar-detail-dot orange"></span>
                            <span>Edited by: <strong>${this.esc(i.editedBy)}</strong></span>
                            ${i.editedAt ? `<span> · ${new Date(i.editedAt).toLocaleString('en',{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit',hour12:true})}</span>` : ''}
                        </div>
                        <div class="abazar-item-detail-row">${this.esc(i.name || '-')} — ৳${this.fmtNum(parseFloat(i.cost)||0)}</div>` : ''}
                        <div class="abazar-item-detail-btns">
                            <button class="abazar-btn-delete" onclick="event.stopPropagation();App.deleteBazarItem('${i.key}')"><span class="material-icons-round">delete</span> Delete</button>
                            <button class="abazar-btn-edit" onclick="event.stopPropagation();App.editBazarItem('${i.key}','${this.esc(i.name||'')}',${parseFloat(i.cost)||0},'${i.memberId||''}','${i.date||''}','${i.category||'bazar'}')"><span class="material-icons-round">edit</span> Edit</button>
                        </div>
                    </div>`;
                    }).join('')}
                </div>
            </div>`;
        });
        div.innerHTML = html;
    },

    toggleBazarItem(el) {
        const detail = el.nextElementSibling;
        if (detail && detail.classList.contains('abazar-item-detail')) {
            const isOpen = detail.style.display !== 'none';
            detail.style.display = isOpen ? 'none' : 'block';
            el.classList.toggle('expanded', !isOpen);
        }
    },

    async deleteBazarItem(key) {
        if (!this.messId) return;
        if (!confirm('Delete this cost item?')) return;
        const snap = await db.ref(`messes/${this.messId}/bazarItems/${key}`).once('value');
        const item = snap.val();
        if (item) {
            const userName = this.currentUser?.displayName || 'Unknown';
            await db.ref(`messes/${this.messId}/costTrash`).push({ ...item, deletedBy: userName, deletedAt: Date.now() });
        }
        await db.ref(`messes/${this.messId}/bazarItems/${key}`).remove();
        this.loadBazarList();
        this.toast('Deleted!', 'success');
    },

    editBazarItem(key, name, cost, memberId, date, category) {
        this._editBzKey = key;
        this._editBzCategory = category;
        const members = this._bazarMembers || {};
        const currentName = (members[memberId] || {}).name || memberId || 'Manager';
        const names = ['Manager', ...Object.values(members).map(m => m.name || 'Unknown').filter(n => n !== 'Manager')];
        const dateVal = date || new Date().toISOString().slice(0,10);
        document.getElementById('modal-title').textContent = 'Edit Cost';
        document.getElementById('modal-body').innerHTML = `
            <div class="form-group"><label>Item name</label><input type="text" id="edit-bz-name" value="${this.esc(name)}"></div>
            <div class="form-group"><label>Money from</label><select id="edit-bz-member">${names.map(n => `<option value="${n}" ${n === currentName ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
            <div class="form-group"><label>Date</label><input type="date" id="edit-bz-date" value="${dateVal}"></div>
            <div class="form-group"><label>Cost (৳)</label><input type="number" id="edit-bz-cost" value="${cost}"></div>`;
        document.getElementById('modal-footer').innerHTML = `
            <div class="dep-footer-btns">
                <button class="btn-modal-cancel" onclick="App.closeModal()">Cancel</button>
                <button class="btn-modal-add" onclick="App.saveBazarEdit('${key}','${category}')">Save</button>
            </div>`;
        this.openModal();
    },

    async saveBazarEdit(key, category) {
        const name = document.getElementById('edit-bz-name').value.trim();
        const cost = parseFloat(document.getElementById('edit-bz-cost').value) || 0;
        const memberName = document.getElementById('edit-bz-member').value;
        const date = document.getElementById('edit-bz-date').value;
        if (!name) { this.toast('Enter name', 'error'); return; }
        if (cost <= 0) { this.toast('Enter cost', 'error'); return; }
        const members = this._bazarMembers || {};
        const memberId = memberName === 'Manager' ? 'Manager' : Object.entries(members).find(([, m]) => m.name === memberName)?.[0] || memberName;
        const userName = this.currentUser?.displayName || 'Unknown';
        await db.ref(`messes/${this.messId}/bazarItems/${key}`).update({ name, cost, memberId, date, editedBy: userName, editedAt: Date.now() });
        this.closeModal();
        this.loadBazarList();
        this.toast('Updated!', 'success');
    },

    async loadManagerMoney() {
        if (!this.messId) return;
        const sm = this.getSelMonth();
        const month = sm.key;
        document.getElementById('abalance-month').textContent = this.fmtMonth(sm.date);
        this._depFilter = 'meal';
        const filterBtns = document.querySelectorAll('#abalance-filters .abazar-filter-btn');
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'meal'));
        const div = document.getElementById('abalance-list');
        div.innerHTML = '<p class="empty-state">Loading...</p>';
        try {
            const [depSnap, membersSnap] = await Promise.all([
                db.ref(`messes/${this.messId}/deposits`).orderByChild('date').once('value'),
                db.ref(`messes/${this.messId}/members`).once('value')
            ]);
            const members = membersSnap.val() || {};
            this._allDeps = Object.entries(depSnap.val() || {})
                .filter(([, v]) => v.date && v.date.startsWith(month))
                .sort((a, b) => (b[1].date || '').localeCompare(a[1].date || '') || (b[1].createdAt || 0) - (a[1].createdAt || 0));
            this._depMembers = members;
            this.renderDeposits();
        } catch (e) { console.error('loadManagerMoney error:', e); div.innerHTML = '<p class="empty-state">Error loading</p>'; }
    },

    filterDeposits(filter) {
        this._depFilter = filter;
        document.querySelectorAll('#abalance-filters .abazar-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
        this.renderDeposits();
    },

    renderDeposits() {
        const filter = this._depFilter || 'meal';
        const deps = filter === 'all' ? (this._allDeps || []) : (this._allDeps || []).filter(([, v]) => (v.category || 'meal') === filter);
        const members = this._depMembers || {};
        const total = deps.reduce((s, [, v]) => s + (parseFloat(v.amount) || 0), 0);
        const totalEl = document.getElementById('abalance-filter-total');
        if (totalEl) totalEl.textContent = deps.length ? '৳ ' + this.fmtNum(total) : '';
        const div = document.getElementById('abalance-list');
        if (!deps.length) { div.innerHTML = '<p class="empty-state">No deposits this month</p>'; return; }
        const grouped = {};
        deps.forEach(([k, v]) => {
            const day = v.date.slice(0, 10);
            (grouped[day] = grouped[day] || []).push({ key: k, ...v });
        });
        let html = '';
        Object.entries(grouped).forEach(([day, dayDeps]) => {
            const d = new Date(day + 'T00:00:00');
            const dayTotal = dayDeps.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
            const expanded = day === Object.keys(grouped)[0];
            html += `<div class="abazar-day-card">
                <div class="abazar-day-head${expanded ? ' expanded' : ''}" onclick="App.toggleDayCard(this)">
                    <div class="abazar-day-info"><h3>${d.getDate()} ${this.shortMon(d)}, ${d.toLocaleDateString('en',{weekday:'long'})}</h3><p>${dayDeps.length} entr${dayDeps.length>1?'ies':'y'} &middot; Total: ৳${this.fmtNum(dayTotal)}</p></div>
                    <span class="material-icons-round">expand_more</span>
                </div>
                <div class="abazar-day-items abazar-dep-grid" style="${expanded?'':'display:none'}">
                    <div class="abazar-day-items-head abazar-dep-grid"><span>MONEY FROM</span><span>AMOUNT</span></div>
                    ${dayDeps.map(i => `<div class="abazar-item-row abazar-dep-grid" onclick="App.toggleBazarItem(this)">
                        <span class="abazar-item-name">${this.esc((members[i.memberId]||{}).name || i.memberId || '-')}</span>
                        <span class="abazar-item-cost">৳${this.fmtNum(parseFloat(i.amount)||0)} <span class="material-icons-round">expand_more</span></span>
                    </div>
                    <div class="abazar-item-detail" style="display:none">
                        <div class="abazar-item-detail-info">
                            <span class="abazar-detail-dot green"></span>
                            <span>Added by: <strong>${this.esc(i.addedBy || 'Unknown')}</strong></span>
                            ${i.createdAt ? `<span> · ${new Date(i.createdAt).toLocaleString('en',{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit',hour12:true})}</span>` : ''}
                        </div>
                        <div class="abazar-item-detail-row">${this.esc((members[i.memberId]||{}).name || i.memberId || '-')} — ৳${this.fmtNum(parseFloat(i.amount)||0)}</div>
                        ${i.editedBy ? `<div class="abazar-item-detail-info">
                            <span class="abazar-detail-dot orange"></span>
                            <span>Edited by: <strong>${this.esc(i.editedBy)}</strong></span>
                            ${i.editedAt ? `<span> · ${new Date(i.editedAt).toLocaleString('en',{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit',hour12:true})}</span>` : ''}
                        </div>` : ''}
                        <div class="abazar-item-detail-btns">
                            <button class="abazar-btn-delete" onclick="event.stopPropagation();App.deleteDeposit('${i.key}')"><span class="material-icons-round">delete</span> Delete</button>
                            <button class="abazar-btn-edit" onclick="event.stopPropagation();App.editDeposit('${i.key}','${i.memberId||''}',${parseFloat(i.amount)||0},'${i.category||'meal'}','${i.date||''}')"><span class="material-icons-round">edit</span> Edit</button>
                        </div>
                    </div>`).join('')}
                </div>
            </div>`;
        });
        div.innerHTML = html;
    },

    toggleDayCard(head) {
        head.classList.toggle('expanded');
        const items = head.nextElementSibling;
        if (items) items.style.display = items.style.display === 'none' ? '' : 'none';
    },

    async deleteDeposit(key) {
        if (!this.messId) return;
        if (!confirm('Delete this deposit?')) return;
        const snap = await db.ref(`messes/${this.messId}/deposits/${key}`).once('value');
        const item = snap.val();
        if (item) {
            const userName = this.currentUser?.displayName || 'Unknown';
            await db.ref(`messes/${this.messId}/depTrash`).push({ ...item, deletedBy: userName, deletedAt: Date.now() });
        }
        await db.ref(`messes/${this.messId}/deposits/${key}`).remove();
        this.loadManagerMoney();
        this.toast('Deleted!', 'success');
    },

    editDeposit(key, memberId, amount, category, date) {
        const members = this._depMembers || {};
        const currentName = (members[memberId] || {}).name || '';
        const names = Object.values(members).map(m => m.name || 'Unknown');
        const dateVal = date || new Date().toISOString().slice(0,10);
        document.getElementById('modal-title').textContent = 'Edit Deposit';
        document.getElementById('modal-body').innerHTML = `
            <div class="form-group"><label>Money from</label><select id="edit-dep-member">${names.map(n => `<option value="${n}" ${n === currentName ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
            <div class="form-group"><label>Date</label><input type="date" id="edit-dep-date" value="${dateVal}"></div>
            <div class="form-group"><label>Amount (৳)</label><input type="number" id="edit-dep-amount" value="${amount}"></div>
            <div class="form-group"><label>Category</label><select id="edit-dep-cat"><option value="meal" ${category==='meal'?'selected':''}>Meal</option><option value="utility" ${category==='utility'?'selected':''}>Utility</option></select></div>`;
        document.getElementById('modal-footer').innerHTML = `
            <div class="dep-footer-btns">
                <button class="btn-modal-cancel" onclick="App.closeModal()">Cancel</button>
                <button class="btn-modal-add" onclick="App.saveDepositEdit('${key}')">Save</button>
            </div>`;
        this.openModal();
    },

    async saveDepositEdit(key) {
        const memberName = document.getElementById('edit-dep-member').value;
        const amount = parseFloat(document.getElementById('edit-dep-amount').value) || 0;
        const category = document.getElementById('edit-dep-cat').value;
        const date = document.getElementById('edit-dep-date').value;
        if (amount <= 0) { this.toast('Enter amount', 'error'); return; }
        const members = this._depMembers || {};
        const memberId = Object.entries(members).find(([, m]) => m.name === memberName)?.[0] || '';
        const userName = this.currentUser?.displayName || 'Unknown';
        await db.ref(`messes/${this.messId}/deposits/${key}`).update({ memberId, amount, category, date, editedBy: userName, editedAt: Date.now() });
        this.closeModal();
        this.loadManagerMoney();
        this.toast('Updated!', 'success');
    },

    async loadAddCost() {
        if (!this.messId) return;
        if (!this.checkPerm('bazarEntry')) { this.navigate('bazaar'); return; }
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = snap.val() || {};
        const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare((members[b]?.name || '')));
        const names = [...new Set(mids.map(id => members[id]?.name || 'Unknown'))].sort((a, b) => a.localeCompare(b));
        const now = new Date();
        const dateStr = `${now.getDate()} ${now.toLocaleDateString('en-US',{month:'long'})}, ${now.getFullYear()}`;
        this._bzMembers = names;
        this._bzDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        this._bzItems = [{ name: '', cost: '' }];
        this._bzMoneyBy = 'Manager';
        this._bzDoneBy = '';
        this._bzTab = 'bazar';
        this._bzUtilType = '';
        this._bzUtilAmount = '';
        this._bzUtilSelected = names.slice();
        document.getElementById('addcost-body').innerHTML = `
            <div class="bz-tabs" style="padding:0 0 8px">
                <button class="bz-tab active" data-tab="bazar" onclick="App.bzSwitchTab('bazar')"><span class="material-icons-round">shopping_cart</span> Cost</button>
                <button class="bz-tab" data-tab="utility" onclick="App.bzSwitchTab('utility')"><span class="material-icons-round">lightbulb</span> Utility & Others</button>
            </div>
            <div class="dep-date" style="cursor:pointer" onclick="App.bzPickDate()"><span class="material-icons-round">calendar_month</span> <span id="bz-date-text">${dateStr}</span><span class="material-icons-round" style="margin-left:auto;font-size:18px;color:#999">expand_more</span></div>
            <div id="bz-bazar-section">
                <div class="dep-label">Money from:</div>
                <div class="dep-chips" id="bz-money-chips">
                    <button class="dep-chip active" data-name="Manager" onclick="App.bzPickMoney(this)">Manager</button>
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
                    ${['Rent','Electricity','Wi-Fi'].map(t => `<button class="dep-chip" data-type="${t}" onclick="App.bzPickType(this)">${t}</button>`).join('')}
                    <button class="dep-chip" onclick="App.bzAddType()"><span class="material-icons-round" style="font-size:16px">add</span> Others</button>
                </div>
                <div class="dep-input-wrap" style="margin:6px 0"><span style="font-size:20px;font-weight:700">৳</span><input class="bz-input" type="number" placeholder="Total bill amount" oninput="App._bzUtilAmount=this.value;App.bzRenderFooter()"></div>
                <div style="display:flex;align-items:center;gap:6px;margin:4px 0 2px;padding:5px 10px;background:#f0f7ff;border-radius:10px;border:1px solid #d6e4f5" class="bz-util-info-box"><span class="material-icons-round" style="font-size:18px;color:var(--primary)">account_balance_wallet</span><span style="font-weight:600;color:var(--primary);font-size:13px">Cost from: Manager</span></div>
                <div class="dep-label" style="margin-top:6px">Divided to:</div>
                <div class="bz-util-members">
                    <div class="bz-util-selectall" onclick="App.bzToggleAll()">
                        <input type="checkbox" checked id="bz-selectall-cb" onchange="App.bzToggleAllCb()">
                        <span>Select all</span>
                        <span class="bz-util-count" id="bz-util-count">${names.length}/${names.length} selected</span>
                    </div>
                    ${names.map(n => `<label class="bz-util-member"><input type="checkbox" checked data-member="${n}" onchange="App.bzUpdateUtilCount()"><span>${n}</span></label>`).join('')}
                </div>
            </div>`;
    },

    async bzSavePage() {
        const result = await this.bzSave();
        if (result === false) return;
        this.loadBazarList();
        this.navigate('bazaar');
    },

    async loadAddDeposit() {
        if (!this.messId) return;
        if (!this.checkPerm('bazarEntry')) { this.navigate('balance'); return; }
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = snap.val() || {};
        const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare((members[b]?.name || '')));
        const names = [...new Set(mids.map(id => members[id]?.name || 'Unknown'))].sort((a, b) => a.localeCompare(b));
        const now = new Date();
        const dateStr = `${now.getDate()} ${now.toLocaleDateString('en-US',{month:'long'})}, ${now.getFullYear()}`;

        this._bzMembers = names;
        this._bzDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        this._bzItems = [{ name: '', cost: '' }];
        this._bzMoneyBy = 'Manager';
        this._bzDoneBy = '';
        this._bzTab = 'bazar';
        this._bzUtilType = '';
        this._bzUtilAmount = '';
        this._bzUtilSelected = names.slice();

        document.getElementById('modal-title').textContent = 'Add Cost';
        document.getElementById('modal-body').innerHTML = `
            <div class="bz-tabs" style="padding:0 0 12px">
                <button class="bz-tab active" data-tab="bazar" onclick="App.bzSwitchTab('bazar')"><span class="material-icons-round">shopping_cart</span> Cost</button>
                <button class="bz-tab" data-tab="utility" onclick="App.bzSwitchTab('utility')"><span class="material-icons-round">lightbulb</span> Utility & Others</button>
            </div>
            <div class="dep-date" style="cursor:pointer" onclick="App.bzPickDate()"><span class="material-icons-round">calendar_month</span> <span id="bz-date-text">${dateStr}</span><span class="material-icons-round" style="margin-left:auto;font-size:18px;color:#999">expand_more</span></div>
            <div id="bz-bazar-section">
                <div class="dep-label">Money from:</div>
                <div class="dep-chips" id="bz-money-chips">
                    <button class="dep-chip active" data-name="Manager" onclick="App.bzPickMoney(this)">Manager</button>
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
                    ${['Rent','Electricity','Wi-Fi'].map(t => `<button class="dep-chip" data-type="${t}" onclick="App.bzPickType(this)">${t}</button>`).join('')}
                    <button class="dep-chip" onclick="App.bzAddType()"><span class="material-icons-round" style="font-size:16px">add</span> Others</button>
                </div>
                <div class="dep-input-wrap" style="margin:6px 0"><span style="font-size:20px;font-weight:700">৳</span><input class="bz-input" type="number" placeholder="Total bill amount" oninput="App._bzUtilAmount=this.value;App.bzRenderFooter()"></div>
                <div style="display:flex;align-items:center;gap:6px;margin:4px 0 2px;padding:5px 10px;background:#f0f7ff;border-radius:10px;border:1px solid #d6e4f5" class="bz-util-info-box"><span class="material-icons-round" style="font-size:18px;color:var(--primary)">account_balance_wallet</span><span style="font-weight:600;color:var(--primary);font-size:13px">Cost from: Manager</span></div>
                <div class="dep-label" style="margin-top:6px">Divided to:</div>
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
                <span class="dep-footer-hint" id="bz-footer-left">Money from: Manager  total</span>
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
        document.querySelectorAll('#bz-money-chips .dep-chip').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        this._bzMoneyBy = el.dataset.name;
        this.bzRenderFooter();
    },

    bzPickDone(el) {
        document.querySelectorAll('#bz-done-chips .dep-chip').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        this._bzDoneBy = el.dataset.name;
        this.bzRenderFooter();
    },

    bzAddType() {
        const name = prompt('Enter new utility type:');
        if (!name || !name.trim()) return;
        const chips = document.getElementById('bz-type-chips');
        const btn = document.createElement('button');
        btn.className = 'dep-chip';
        btn.dataset.type = name.trim();
        btn.onclick = () => this.bzPickType(btn);
        btn.textContent = name.trim();
        chips.insertBefore(btn, chips.lastElementChild);
        this.bzPickType(btn);
    },

    bzPickType(el) {
        document.querySelectorAll('#bz-type-chips .dep-chip').forEach(c => c.classList.remove('active'));
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
        document.getElementById('bz-selectall-cb').checked = checked === all.length;
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
            left.textContent = `Money from: ${this._bzMoneyBy || 'none'}  total`;
            total.textContent = '৳ ' + this.fmtNum(sum);
        } else {
            const amt = parseFloat(this._bzUtilAmount) || 0;
            const count = this._bzUtilSelected?.length || 0;
            left.textContent = `Money from: Manager  total`;
            total.textContent = '৳ ' + this.fmtNum(amt);
        }
    },

    async bzSave() {
        const dateKey = this._bzDate;
        const userName = this.currentUser?.displayName || 'Unknown';
        if (this._bzTab === 'bazar') {
            const items = this._bzItems.filter(i => i.name && i.cost);
            if (!items.length) { this.toast('Add at least one item', 'error'); return false; }
            if (!this._bzMoneyBy) { this.toast('Money from: pick a name', 'error'); return false; }
            if (!this._bzDoneBy) { this.toast('Pick who did the shopping', 'error'); return false; }
            for (const item of items) {
                await db.ref(`messes/${this.messId}/bazarItems`).push({
                    name: item.name, cost: parseFloat(item.cost) || 0,
                    memberId: this._bzMoneyBy, doneBy: this._bzDoneBy || '', date: dateKey, category: 'bazar', addedBy: userName, createdAt: Date.now()
                });
            }
        } else {
            const amt = parseFloat(this._bzUtilAmount) || 0;
            if (!amt) { this.toast('Enter bill amount', 'error'); return false; }
            if (!this._bzUtilType) { this.toast('Pick a type', 'error'); return false; }
            const share = this._bzUtilSelected.length ? amt / this._bzUtilSelected.length : 0;
            for (const name of this._bzUtilSelected) {
                await db.ref(`messes/${this.messId}/bazarItems`).push({
                    name: this._bzUtilType, cost: Math.round(share * 100) / 100,
                    memberId: 'Manager', splitWith: name, date: dateKey, category: 'utility', addedBy: userName, createdAt: Date.now()
                });
            }
        }
        this.closeModal();
        this.loadBazarList();
        this.toast('Added!', 'success');
    },

    bzClose() { this.closeModal(); },

    bzOnDateChange(val) {
        if (!val) return;
        this._bzDate = val;
        const dd = new Date(val + 'T00:00:00');
        const el = document.getElementById('bz-date-text');
        if (el) el.textContent = `${dd.getDate()} ${dd.toLocaleDateString('en-US',{month:'long'})}, ${dd.getFullYear()}`;
    },

    bzPickDate() {
        const old = document.getElementById('bz-date-hid');
        if (old) old.remove();
        const input = document.createElement('input');
        input.type = 'date';
        input.id = 'bz-date-hid';
        input.value = this._bzDate;
        input.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0';
        input.oninput = () => this.bzOnDateChange(input.value);
        document.body.appendChild(input);
        input.click();
        setTimeout(() => { try { input.showPicker(); } catch(e) {} }, 100);
    },

    async loadAddDeposit() {
        if (!this.messId) return;
        if (!this.checkPerm('bazarEntry')) { this.navigate('balance'); return; }
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = snap.val() || {};
        const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare((members[b]?.name || '')));
        const names = mids.map(id => members[id]?.name || 'Unknown');
        const now = new Date();
        this._depDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        const dd = new Date(this._depDate + 'T00:00:00');
        const dateStr = `${dd.getDate()} ${dd.toLocaleDateString('en-US',{month:'long'})}, ${dd.getFullYear()}`;
        this._depCategory = 'meal';
        this._depSelected = null;
        document.getElementById('adddeposit-body').innerHTML = `
            <div class="bz-tabs" style="padding:0 0 8px">
                <button class="bz-tab active" data-tab="meal" onclick="App.depSwitchTab('meal')"><span class="material-icons-round">restaurant</span> Meal</button>
                <button class="bz-tab" data-tab="utility" onclick="App.depSwitchTab('utility')"><span class="material-icons-round">lightbulb</span> Utility & Others</button>
            </div>
            <div class="dep-date" style="position:relative;cursor:pointer" onclick="App.depPickDate()"><span class="material-icons-round">calendar_month</span> <span id="dep-date-text">${dateStr}</span><span class="material-icons-round" style="margin-left:auto;font-size:18px;color:#999">expand_more</span></div>
            <div class="dep-label">Money from:</div>
            <div class="dep-chips" id="dep-chips">
                ${names.map(n => `<button class="dep-chip" data-name="${n}" onclick="App.depPick(this)">${n}</button>`).join('')}
            </div>
            <div class="dep-input-wrap"><span class="dep-taka">৳</span><input class="dep-input" id="dep-amount" type="number" placeholder="Enter Amount" oninput="App.depUpdateFooter()"></div>`;
    },

    saveDepositPage() {
        const memberName = this._depSelected;
        const amount = parseFloat(document.getElementById('dep-amount')?.value) || 0;
        if (!memberName) { this.toast('Money from: pick a name', 'error'); return; }
        if (!amount) { this.toast('Enter an amount', 'error'); return; }
        const category = this._depCategory || 'meal';
        db.ref(`messes/${this.messId}/deposits`).push({ memberId: memberName, amount, date: this._depDate, category, createdAt: Date.now() });
        this.loadManagerMoney();
        this.toast('Deposit added!', 'success');
        this.navigate('balance');
    },

    async showAddDeposit() {
        if (!this.messId) return;
        if (!this.checkPerm('bazarEntry')) return;
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = snap.val() || {};
        const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare(members[b]?.name || ''));
        const names = mids.map(id => members[id]?.name || 'Unknown');
        const now = new Date();
        this._depDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        const dateStr = `${now.getDate()} ${now.toLocaleDateString('en-US',{month:'long'})}, ${now.getFullYear()}`;
        this._depCategory = 'meal';
        document.getElementById('modal-title').textContent = 'Add Deposit';
        document.getElementById('modal-body').innerHTML = `
            <div class="bz-tabs" style="padding:0 0 12px">
                <button class="bz-tab active" data-tab="meal" onclick="App.depSwitchTab('meal')"><span class="material-icons-round">restaurant</span> Meal</button>
                <button class="bz-tab" data-tab="utility" onclick="App.depSwitchTab('utility')"><span class="material-icons-round">lightbulb</span> Utility & Others</button>
            </div>
            <div class="dep-date" style="position:relative;cursor:pointer" onclick="App.depPickDate()"><span class="material-icons-round">calendar_month</span> <span id="dep-date-text">${dateStr}</span><span class="material-icons-round" style="margin-left:auto;font-size:18px;color:#999">expand_more</span></div>
            <div class="dep-label">Money from:</div>
            <div class="dep-chips" id="dep-chips">
                ${names.map(n => `<button class="dep-chip" data-name="${n}" onclick="App.depPick(this)">${n}</button>`).join('')}
            </div>
            <div class="dep-input-wrap"><span class="dep-taka">৳</span><input class="dep-input" id="dep-amount" type="number" placeholder="Enter Amount" oninput="App.depUpdateFooter()"></div>`;
        document.getElementById('modal-footer').innerHTML = `
            <div class="dep-footer-row">
                <span class="dep-footer-hint" id="dep-footer-left">Money from: none</span>
                <span class="dep-footer-total" id="dep-footer-total">৳ 0</span>
            </div>
            <div class="dep-footer-btns">
                <button class="btn-modal-add" onclick="App.saveDeposit()">Add</button>
            </div>`;
        this._depSelected = null;
        this.openModal();
    },

    depSwitchTab(tab) {
        this._depCategory = tab;
        document.querySelectorAll('.bz-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    },

    depPick(el) {
        document.querySelectorAll('.dep-chip').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        this._depSelected = el.dataset.name;
        this.depUpdateFooter();
    },

    depUpdateFooter() {
        const amt = parseFloat(document.getElementById('dep-amount')?.value) || 0;
        const total = document.getElementById('dep-footer-total');
        const left = document.getElementById('dep-footer-left');
        if (total) total.textContent = '৳ ' + this.fmtNum(amt);
        if (left) left.textContent = `Money from: ${this._depSelected || 'none'}  total`;
    },

    depOnDateChange(val) {
        if (!val) return;
        this._depDate = val;
        const dd = new Date(val + 'T00:00:00');
        const el = document.getElementById('dep-date-text');
        if (el) el.textContent = `${dd.getDate()} ${dd.toLocaleDateString('en-US',{month:'long'})}, ${dd.getFullYear()}`;
    },

    depPickDate() {
        const old = document.getElementById('dep-date-hid');
        if (old) old.remove();
        const input = document.createElement('input');
        input.type = 'date';
        input.id = 'dep-date-hid';
        input.value = this._depDate;
        input.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0';
        input.oninput = () => this.depOnDateChange(input.value);
        document.body.appendChild(input);
        input.click();
        setTimeout(() => { try { input.showPicker(); } catch(e) {} }, 100);
    },

    async saveDeposit() {
        const memberName = this._depSelected;
        const amount = parseFloat(document.getElementById('dep-amount')?.value) || 0;
        if (!memberName) { this.toast('Money from: pick a name', 'error'); return; }
        if (!amount) { this.toast('Enter an amount', 'error'); return; }
        const category = this._depCategory || 'meal';
        await db.ref(`messes/${this.messId}/deposits`).push({ memberId: memberName, amount, date: this._depDate, category, createdAt: Date.now() });
        this.closeModal(); this.loadManagerMoney(); this.toast('Deposit added!', 'success');
    },

    async loadProfile() {
        if (!this.currentUser) return;
        const u = this.currentUser;
        document.getElementById('prof-name').textContent = u.displayName || 'User';
        document.getElementById('prof-email').textContent = u.email || '-';
        document.getElementById('prof-uid-text').textContent = u.uid ? u.uid.slice(0, 12) + '...' : '-';
        try {
            const snap = await db.ref(`users/${u.uid}/profilePicture`).once('value');
            const photo = snap.val();
            if (photo) {
                this.setProfilePic(photo);
            } else {
                const initial = (u.displayName || 'U').charAt(0).toUpperCase();
                const avatar = document.getElementById('prof-avatar');
                if (avatar) avatar.textContent = initial;
            }
        } catch (e) {}
        const saved = localStorage.getItem('mess_theme') || 'light';
        const dt = document.getElementById('prof-device-theme');
        const ot = document.getElementById('prof-oled-theme');
        const lang = document.getElementById('prof-lang');
        if (dt) dt.checked = saved === 'system';
        if (ot) ot.checked = saved === 'oled';
        if (lang) lang.textContent = (localStorage.getItem('mess_lang') || 'en') === 'en' ? 'EN' : 'BD';
    },

    copyCode() { if (this.messCode) navigator.clipboard.writeText(this.messCode).then(() => this.toast('Copied!', 'info')); },

    toggleDeviceTheme(checked) {
        if (checked) {
            this.theme = 'system';
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'oled');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        } else {
            this.theme = 'light';
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('mess_theme', this.theme);
    },
    toggleOledTheme(checked) {
        if (checked) {
            this.theme = 'oled';
            document.documentElement.setAttribute('data-theme', 'oled');
        } else {
            this.theme = 'light';
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('mess_theme', this.theme);
    },
    applyTheme() {
        const saved = localStorage.getItem('mess_theme') || 'light';
        this.theme = saved;
        if (saved === 'system') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'oled');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        } else if (saved === 'oled') {
            document.documentElement.setAttribute('data-theme', 'oled');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        const dt = document.getElementById('prof-device-theme');
        const ot = document.getElementById('prof-oled-theme');
        if (dt) dt.checked = saved === 'system';
        if (ot) ot.checked = saved === 'oled';
    },
    toggleLanguage() {
        const lang = localStorage.getItem('mess_lang') || 'en';
        const newLang = lang === 'en' ? 'bn' : 'en';
        localStorage.setItem('mess_lang', newLang);
        document.getElementById('prof-lang').textContent = newLang === 'en' ? 'EN' : 'BD';
        this.toast(newLang === 'en' ? 'Language: English' : 'Language: বাংলা', 'info');
    },
    contactDeveloper() {
        const body = document.getElementById('modal-body');
        body.innerHTML = `
            <div style="text-align:center;margin-bottom:16px">
                <div style="font-weight:700;font-size:22px;margin-bottom:8px">Mahmudul Hasan</div>
                <div style="font-size:14px;color:#777;margin-bottom:16px">Developer of Mess Manager</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px">
                <a href="https://wa.me/8801710632114" target="_blank" class="aprof-row" style="text-decoration:none;color:inherit;border-top:1px solid #eef1f6;border-radius:0">
                    <span class="material-icons-round" style="color:#25D366">chat</span>
                    <span class="aprof-label">WhatsApp</span>
                    <span class="material-icons-round">chevron_right</span>
                </a>
                <a href="mailto:mahmudulhasandhk70@gmail.com" class="aprof-row" style="text-decoration:none;color:inherit;border-top:1px solid #eef1f6;border-radius:0">
                    <span class="material-icons-round" style="color:#d32f2f">mail</span>
                    <span class="aprof-label">Email</span>
                    <span class="material-icons-round">chevron_right</span>
                </a>
                <a href="https://github.com/mhasanbogura" target="_blank" class="aprof-row" style="text-decoration:none;color:inherit;border-top:1px solid #eef1f6;border-radius:0">
                    <span class="material-icons-round">code</span>
                    <span class="aprof-label">GitHub</span>
                    <span class="material-icons-round">chevron_right</span>
                </a>
                <a href="https://facebook.com/mahmudulhasandhk70" target="_blank" class="aprof-row" style="text-decoration:none;color:inherit;border-top:1px solid #eef1f6;border-radius:0">
                    <span class="material-icons-round" style="color:#1877F2">facebook</span>
                    <span class="aprof-label">Facebook</span>
                    <span class="material-icons-round">chevron_right</span>
                </a>
            </div>`;
        document.getElementById('modal-title').textContent = 'Contact Developer';
        document.getElementById('modal-overlay').classList.add('active');
    },

    // ==================== BAZAR NOTE PAGE ====================
    async loadBazarNote() {
        if (!this.messId) return;
        try {
            const snap = await db.ref(`messes/${this.messId}/bazarNote`).once('value');
            const items = snap.val() || {};
            const keys = Object.keys(items);
            document.getElementById('abn-count').textContent = keys.length;
            const div = document.getElementById('abn-items');
            if (!keys.length) { div.innerHTML = '<p class="abn-empty">Nothing on the list. Add whatever the house has run out of — anyone can.</p>'; return; }
            div.innerHTML = keys.map(k => {
                const item = items[k];
                return `<div class="abn-item"><span class="abn-item-text">${this.esc(item.name || item)}</span><button class="abn-item-del" onclick="App.removeBazarNote('${k}')"><span class="material-icons-round">close</span></button></div>`;
            }).join('');
        } catch (e) { console.error('loadBazarNote error:', e); }
    },

    async addBazarNote() {
        const inp = document.getElementById('abn-input');
        const name = inp.value.trim();
        if (!name) return;
        try {
            await db.ref(`messes/${this.messId}/bazarNote`).push({ name, addedBy: this.currentUser?.displayName || 'User', createdAt: Date.now() });
            inp.value = '';
            this.loadBazarNote();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async removeBazarNote(key) {
        try {
            await db.ref(`messes/${this.messId}/bazarNote/${key}`).remove();
            this.loadBazarNote();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    // ==================== MENU TODAY PAGE ====================
    async loadMenu() {
        if (!this.messId) return;
        const now = new Date();
        const todayKey = this.dk(now);
        const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        try {
            const menuSnap = await db.ref(`messes/${this.messId}/menus/${todayKey}`).once('value');
            const todayMenu = menuSnap.val();
            const dinnerEl = document.getElementById('amenu-dinner-status');
            if (todayMenu && todayMenu.dinner) {
                dinnerEl.textContent = todayMenu.dinner;
                dinnerEl.style.color = '#1a1a1a';
            } else {
                dinnerEl.textContent = 'Nothing set for now';
                dinnerEl.style.color = '#999';
            }
            const div = document.getElementById('amenu-tab-content');
            this._menuTab = 'upcoming';
            this.renderMenuUpcoming(div, now, weekdays, months);
        } catch (e) { console.error('loadMenu error:', e); }
    },

    renderMenuUpcoming(div, now, weekdays, months) {
        let html = '';
        for (let i = 0; i < 7; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() + i);
            const dk = this.dk(d);
            const isToday = i === 0;
            html += `<div class="amenu-day-card${isToday ? ' today' : ''}">
                <div class="amenu-day-top"><strong>${weekdays[d.getDay()]}</strong><span>${d.getDate()} ${months[d.getMonth()]}</span>${isToday ? '<span class="amenu-badge">Today</span>' : ''}</div>
                <p class="amenu-day-menu" id="amenu-day-${dk}">Nothing set</p>
            </div>`;
        }
        div.innerHTML = html;
        this.loadMenuDays(now, 7);
    },

    async loadMenuDays(now, count) {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        try {
            const menusSnap = await db.ref(`messes/${this.messId}/menus`).once('value');
            const allMenus = menusSnap.val() || {};
            for (let i = 0; i < count; i++) {
                const d = new Date(now);
                d.setDate(now.getDate() + i);
                const dk = this.dk(d);
                const menu = allMenus[dk];
                if (menu) {
                    const el = document.getElementById(`amenu-day-${dk}`);
                    if (el) {
                        const parts = [];
                        if (menu.breakfast) parts.push('🌅 ' + menu.breakfast);
                        if (menu.lunch) parts.push('🍜 ' + menu.lunch);
                        if (menu.dinner) parts.push('🍽 ' + menu.dinner);
                        el.textContent = parts.join(' · ') || 'Nothing set';
                        el.style.color = parts.length ? '#333' : '#999';
                    }
                }
            }
        } catch (e) { /* ignore */ }
    },

    switchMenuTab(tab) {
        this._menuTab = tab;
        document.querySelectorAll('.amenu-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        const div = document.getElementById('amenu-tab-content');
        const now = new Date();
        const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        if (tab === 'upcoming') {
            this.renderMenuUpcoming(div, now, weekdays, months);
        } else if (tab === 'items') {
            div.innerHTML = '<div class="amenu-section"><p class="amenu-hint">Items shared across all menus</p><div id="amenu-items-list"></div></div>';
            this.loadMenuItems();
        } else if (tab === 'special') {
            div.innerHTML = '<div class="amenu-section"><p class="amenu-hint">Special menus for specific dates</p><div id="amenu-special-list"></div><button class="amenu-add-special" onclick="App.toast(\'Add special day coming soon\',\'info\')"><span class="material-icons-round">add</span> Add special day</button></div>';
        }
    },

    async loadMenuItems() {
        try {
            const snap = await db.ref(`messes/${this.messId}/menuItems`).once('value');
            const items = snap.val() || {};
            const keys = Object.keys(items);
            const div = document.getElementById('amenu-items-list');
            if (!div) return;
            if (!keys.length) { div.innerHTML = '<p class="amenu-empty">No items yet</p>'; return; }
            div.innerHTML = keys.map(k => `<div class="amenu-item-row"><span>${this.esc(items[k].name || items[k])}</span></div>`).join('');
        } catch (e) { /* ignore */ }
    },

    async showAddMenu() {
        const now = new Date();
        const input = document.createElement('input');
        input.type = 'date';
        input.value = this.dk(now);
        input.addEventListener('change', () => {
            if (input.value) this.openMenuEditor(input.value);
        });
        input.click();
    },

    async openMenuEditor(dateKey) {
        if (!this.messId) return;
        const dd = new Date(dateKey + 'T00:00:00');
        const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const label = `${weekdays[dd.getDay()]}, ${dd.getDate()} ${months[dd.getMonth()]}`;
        let existing = {};
        try {
            const snap = await db.ref(`messes/${this.messId}/menus/${dateKey}`).once('value');
            existing = snap.val() || {};
        } catch (e) { /* ignore */ }
        document.getElementById('modal-title').textContent = `Menu — ${label}`;
        document.getElementById('modal-body').innerHTML = `
            <div class="amenu-form-row"><label>🌅 Breakfast</label><input type="text" id="menu-bf" placeholder="What's for breakfast?" value="${this.esc(existing.breakfast || '')}"></div>
            <div class="amenu-form-row"><label>🍜 Lunch</label><input type="text" id="menu-ln" placeholder="What's for lunch?" value="${this.esc(existing.lunch || '')}"></div>
            <div class="amenu-form-row"><label>🍽 Dinner</label><input type="text" id="menu-dn" placeholder="What's for dinner?" value="${this.esc(existing.dinner || '')}"></div>`;
        document.getElementById('modal-footer').innerHTML = `<div class="dep-footer-btns"><button class="btn-modal-add" onclick="App.saveMenu('${dateKey}')">Save</button></div>`;
        this.openModal();
    },

    async saveMenu(dateKey) {
        const bf = document.getElementById('menu-bf')?.value.trim() || '';
        const ln = document.getElementById('menu-ln')?.value.trim() || '';
        const dn = document.getElementById('menu-dn')?.value.trim() || '';
        const data = {};
        if (bf) data.breakfast = bf;
        if (ln) data.lunch = ln;
        if (dn) data.dinner = dn;
        try {
            if (Object.keys(data).length) {
                await db.ref(`messes/${this.messId}/menus/${dateKey}`).set(data);
            } else {
                await db.ref(`messes/${this.messId}/menus/${dateKey}`).remove();
            }
            this.closeModal();
            this.loadMenu();
            this.toast('Menu saved!', 'success');
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    // ==================== ANALYSIS PAGE ====================
    async loadMonthly() {
        if (!this.messId) return;
        const sm = this.getSelMonth();
        const year = sm.year;
        const mon = sm.month;
        const month = sm.key;
        const daysInMonth = new Date(year, mon + 1, 0).getDate();
        const monthEnd = month + '-' + String(daysInMonth).padStart(2, '0');
        const monthLabel = `${new Date(year, mon).toLocaleString('en-US', { month: 'long' })} ${year}`;
        try {
            const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
            const members = membersSnap.val() || {};
            const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare(members[b]?.name || ''));

            const bzSnap = await db.ref(`messes/${this.messId}/bazarItems`).once('value');
            const allBz = bzSnap.val() || {};
            let totalBazar = 0, totalMealBazar = 0, totalUtilBazar = 0;
            const bzByName = {};
            const bzByDay = {};
            const mealBzByDay = {};
            const utilBzByDay = {};
            const itemFreq = {};
            const mealItemFreq = {};
            const utilItemFreq = {};
            Object.values(allBz).forEach(b => {
                const amt = parseFloat(b.cost) || 0;
                if (b.date && b.date.startsWith(month)) {
                    totalBazar += amt;
                    const isUtil = (b.category || 'bazar') === 'utility';
                    if (isUtil) totalUtilBazar += amt;
                    else totalMealBazar += amt;
                    const n = (b.memberId || '').trim();
                    if (n) bzByName[n] = (bzByName[n] || 0) + amt;
                    const day = parseInt(b.date.slice(8, 10), 10);
                    if (day) {
                        bzByDay[day] = (bzByDay[day] || 0) + amt;
                        if (isUtil) utilBzByDay[day] = (utilBzByDay[day] || 0) + amt;
                        else mealBzByDay[day] = (mealBzByDay[day] || 0) + amt;
                    }
                    if (b.name) {
                        const iname = b.name.trim().toLowerCase();
                        const targetFreq = isUtil ? utilItemFreq : mealItemFreq;
                        if (!itemFreq[iname]) itemFreq[iname] = { name: b.name.trim(), count: 0, total: 0 };
                        itemFreq[iname].count++;
                        itemFreq[iname].total += amt;
                        if (!targetFreq[iname]) targetFreq[iname] = { name: b.name.trim(), count: 0, total: 0 };
                        targetFreq[iname].count++;
                        targetFreq[iname].total += amt;
                    }
                }
            });

            const mlSnap = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(monthEnd).once('value');
            const memberMeals = {};
            let totalMeals = 0;
            const mealsByDay = {};
            mlSnap.forEach(d => {
                const day = parseInt(d.key.slice(8, 10), 10);
                Object.entries(d.val() || {}).forEach(([name, m]) => {
                    const base = (m.breakfast || 0) + (m.lunch || 0) + (m.dinner || 0);
                    memberMeals[name] = (memberMeals[name] || 0) + base;
                    totalMeals += base;
                    if (day) mealsByDay[day] = (mealsByDay[day] || 0) + base;
                });
            });

            const rate = totalMeals > 0 ? totalMealBazar / totalMeals : 0;

            const depSnap = await db.ref(`messes/${this.messId}/deposits`).once('value');
            const depAll = depSnap.val() || {};
            const depByName = {};
            let totalDep = 0, totalMealDep = 0, totalUtilDep = 0;
            Object.values(depAll).forEach(v => {
                if (v && typeof v.amount === 'number' && v.memberId && v.date && v.date.startsWith(month)) {
                    totalDep += v.amount;
                    const cat = v.category || 'meal';
                    if (cat === 'utility') {
                        totalUtilDep += v.amount;
                    } else {
                        depByName[v.memberId] = (depByName[v.memberId] || 0) + v.amount;
                        totalMealDep += v.amount;
                    }
                }
            });

            let totalUtility = 0, totalRent = 0;
            Object.values(allBz).forEach(b => {
                if (b.date && b.date.startsWith(month) && (b.category || 'bazar') === 'utility') {
                    const amt = parseFloat(b.cost) || 0;
                    if ((b.name || '').toLowerCase() === 'rent') totalRent += amt;
                    else totalUtility += amt;
                }
            });

            const utilRate = mids.length > 0 ? (totalUtility + totalRent) / mids.length : 0;

            const mealPaidIn = totalMealDep + totalMealBazar;
            const mealCharged = totalMeals * rate;
            const utilPaidIn = totalUtilDep;
            const utilCharged = totalUtility + totalRent;

            const topMealItems = Object.values(mealItemFreq).sort((a, b) => b.total - a.total).slice(0, 10);
            const topUtilItems = Object.values(utilItemFreq).sort((a, b) => b.total - a.total).slice(0, 10);

            const memberBalances = mids.map(mid => {
                const name = members[mid]?.name || 'Unknown';
                const dep = depByName[name] || 0;
                const mealCost = (memberMeals[name] || 0) * rate;
                return { name, balance: dep - mealCost };
            }).sort((a, b) => b.balance - a.balance);

            let monthPrev = new Date(year, mon - 1, 1);
            const prevMonth = `${monthPrev.getFullYear()}-${String(monthPrev.getMonth() + 1).padStart(2, '0')}`;
            const prevDays = new Date(year, mon, 0).getDate();
            const prevEnd = prevMonth + '-' + String(prevDays).padStart(2, '0');
            const prevBzSnap = await db.ref(`messes/${this.messId}/bazarItems`).once('value');
            let prevBzTotal = 0;
            Object.values(prevBzSnap.val() || {}).forEach(b => {
                if (b.date && b.date >= prevMonth + '-01' && b.date <= prevEnd) prevBzTotal += parseFloat(b.cost) || 0;
            });
            const prevMlSnap = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(prevMonth + '-01').endAt(prevEnd).once('value');
            let prevMeals = 0;
            prevMlSnap.forEach(d => { Object.values(d.val() || {}).forEach(m => { prevMeals += (m.breakfast || 0) + (m.lunch || 0) + (m.dinner || 0); }); });
            const prevRate = prevMeals > 0 ? prevBzTotal / prevMeals : 0;
            const rateDiff = prevRate > 0 ? ((rate - prevRate) / prevRate * 100).toFixed(0) : 0;

            let prevUtilBz = 0;
            Object.values(prevBzSnap.val() || {}).forEach(b => {
                if (b.date && b.date >= prevMonth + '-01' && b.date <= prevEnd && (b.category || 'bazar') === 'utility') prevUtilBz += parseFloat(b.cost) || 0;
            });
            const prevUtilRate = mids.length > 0 ? prevUtilBz / mids.length : 0;
            const utilRateDiff = prevUtilRate > 0 ? ((utilRate - prevUtilRate) / prevUtilRate * 100).toFixed(0) : 0;

            const mealShare = mids.map(mid => {
                const name = members[mid]?.name || 'Unknown';
                return { name, meals: memberMeals[name] || 0 };
            }).filter(m => m.meals > 0).sort((a, b) => b.meals - a.meals);

            const page = document.getElementById('page-monthly');
            page.innerHTML = `
                <div class="am-head">
                    <button class="icon-btn" onclick="App.navigate('dashboard')"><span class="material-icons-round">arrow_back</span></button>
                    <h2>Analysis</h2>
                </div>
                <div class="am-body">
                    <div class="am-month-row"><label>Month</label><select id="am-month-select" onchange="App.changeAnalysisMonth(this.value)">
                        ${this.buildMonthOptions(year, mon)}
                    </select></div>
                    <div class="am-tabs">
                        <button class="am-tab active" onclick="App.switchAnalysisTab('meal')"><span class="material-icons-round" style="font-size:16px;vertical-align:middle">restaurant</span> Meal</button>
                        <button class="am-tab" onclick="App.switchAnalysisTab('utility')"><span class="material-icons-round" style="font-size:16px;vertical-align:middle">lightbulb</span> Utility</button>
                    </div>
                    <div class="am-tab-content active" id="am-tab-meal">
                        <div class="am-stats-row">
                            <div class="am-stat-card"><small>Total meals</small><strong>${totalMeals}</strong></div>
                            <div class="am-stat-card"><small>Meal bazar</small><strong>৳ ${this.fmtNum(totalMealBazar)}</strong><small>${mids.length} Members</small></div>
                            <div class="am-stat-card"><small>Cost per meal</small><strong>৳ ${rate.toFixed(2)}</strong><small>Bazar ৳${this.fmtNum(totalMealBazar)}</small><small>÷ Meals ${totalMeals}</small></div>
                        </div>
                        ${memberBalances.length ? `<div class="am-card">
                            <h3>Member balances</h3>
                            <p class="am-sub">Green = in credit · Red = owes (deposit – meal cost)</p>
                            <div class="am-bal-list">${memberBalances.map(m => {
                                const maxAbs = Math.max(...memberBalances.map(x => Math.abs(x.balance)), 1);
                                const pct = Math.abs(m.balance) / maxAbs * 50;
                                const cls = m.balance >= 0 ? 'am-bal-pos' : 'am-bal-neg';
                                return `<div class="am-bal-row"><span class="am-bal-name">${this.esc(m.name)}</span><div class="am-bal-bar"><div class="am-bal-fill ${cls}" style="width:${pct}%"></div></div><span class="am-bal-val ${cls}">৳${this.fmtNum(m.balance)}</span></div>`;
                            }).join('')}</div>
                        </div>` : ''}
                        <div class="am-card">
                            <h3>Cost per meal trend</h3>
                            <p class="am-sub">${rateDiff >= 0 ? '▲' : '▼'} ${Math.abs(rateDiff)}% vs last month · ${rateDiff >= 0 ? 'costlier' : 'cheaper'}</p>
                            <div class="am-chart-scroll"><canvas id="am-rate-chart" width="600" height="200"></canvas></div>
                        </div>
                        ${mealShare.length ? `<div class="am-card">
                            <h3>Meal share by member</h3>
                            <p class="am-sub">Who ate how much of the ${totalMeals} meals</p>
                            <div class="am-donut-wrap">
                                <canvas id="am-donut" width="200" height="200"></canvas>
                                <div class="am-donut-legend">${mealShare.map((m, i) => {
                                const colors = ['#1565C0','#0d4fb5','#FFB300','#2E7D32'];
                                return `<div class="am-donut-item"><span class="am-donut-swatch" style="background:${colors[i % colors.length]}"></span><span class="am-donut-name">${this.esc(m.name)}</span><span class="am-donut-val">${m.meals}</span></div>`;
                            }).join('')}</div>
                            </div>
                        </div>` : ''}
                        <div class="am-card">
                            <h3>Bazar by day</h3>
                            <p class="am-sub">৳ ${this.fmtNum(totalMealBazar)} spent across the month</p>
                            <div class="am-chart-scroll"><canvas id="am-bz-chart" width="600" height="200"></canvas></div>
                        </div>
                        <div class="am-card">
                            <h3>Meals by day</h3>
                            <p class="am-sub">${totalMeals} meals across the month</p>
                            <div class="am-chart-scroll"><canvas id="am-ml-chart" width="600" height="200"></canvas></div>
                        </div>
                        ${topMealItems.length ? `<div class="am-card">
                            <h3>Top 10 bazar items by cost</h3>
                            <p class="am-sub">${topMealItems.length} items</p>
                            <div class="am-top-items">${topMealItems.map((it, i) => {
                                const pct = it.total / topMealItems[0].total * 100;
                                const barColors = ['#1565C0','#0d4fb5','#FFB300','#2E7D32','#F57C00','#E65100','#C62828','#AD1457','#6A1B9A','#00838F'];
                                return `<div class="am-item-row"><span class="am-item-name">${this.esc(it.name)} ${it.count > 1 ? '×' + it.count : ''}</span><div class="am-item-bar"><div class="am-item-fill" style="width:${pct}%;background:${barColors[i % barColors.length]}"></div></div><span class="am-item-cost">৳${this.fmtNum(it.total)}</span></div>`;
                            }).join('')}</div>
                        </div>` : ''}
                    </div>
                    <div class="am-tab-content" id="am-tab-utility">
                        <div class="am-stats-row">
                            <div class="am-stat-card"><small>Total utility</small><strong>৳ ${this.fmtNum(totalUtility + totalRent)}</strong></div>
                            <div class="am-stat-card"><small>Rent</small><strong>৳ ${this.fmtNum(totalRent)}</strong></div>
                            <div class="am-stat-card"><small>Other utility</small><strong>৳ ${this.fmtNum(totalUtility)}</strong></div>
                        </div>
                        ${(() => {
                            const utilCostPerMember = mids.length > 0 ? (totalUtility + totalRent) / mids.length : 0;
                            const utilMemberBalances = mids.map(mid => {
                                const name = members[mid]?.name || 'Unknown';
                                const utilDep = Object.values(depAll).filter(v => v && v.memberId === mid && v.category === 'utility' && v.date && v.date.startsWith(month)).reduce((s, v) => s + (v.amount || 0), 0);
                                return { name, balance: utilDep - utilCostPerMember };
                            }).sort((a, b) => b.balance - a.balance);
                            return utilMemberBalances.length ? `<div class="am-card">
                                <h3>Member balances</h3>
                                <p class="am-sub">Green = in credit · Red = owes (utility deposit – cost share)</p>
                                <div class="am-bal-list">${utilMemberBalances.map(m => {
                                    const maxAbs = Math.max(...utilMemberBalances.map(x => Math.abs(x.balance)), 1);
                                    const pct = Math.abs(m.balance) / maxAbs * 50;
                                    const cls = m.balance >= 0 ? 'am-bal-pos' : 'am-bal-neg';
                                    return `<div class="am-bal-row"><span class="am-bal-name">${this.esc(m.name)}</span><div class="am-bal-bar"><div class="am-bal-fill ${cls}" style="width:${pct}%"></div></div><span class="am-bal-val ${cls}">৳${this.fmtNum(m.balance)}</span></div>`;
                                }).join('')}</div>
                            </div>` : '';
                        })()}
                        <div class="am-card">
                            <h3>Cost per utility trend</h3>
                            <p class="am-sub">${utilRateDiff >= 0 ? '▲' : '▼'} ${Math.abs(utilRateDiff)}% vs last month · ${utilRateDiff >= 0 ? 'costlier' : 'cheaper'}</p>
                            <div class="am-chart-scroll"><canvas id="am-util-rate-chart" width="600" height="200"></canvas></div>
                        </div>
                        <div class="am-card">
                            <h3>Balance</h3>
                            <div class="am-calc-row"><span>৳ ${this.fmtNum(totalUtilDep)}</span><span class="am-op">−</span><span>৳ ${this.fmtNum(totalUtility + totalRent)}</span><span class="am-op">=</span><span class="${totalUtilDep - totalUtility - totalRent >= 0 ? 'am-pos' : 'am-neg'}">৳ ${this.fmtNum(totalUtilDep - totalUtility - totalRent)}</span></div>
                            <div class="am-calc-labels"><span>Collection</span><span>Spending</span><span>Balance</span></div>
                        </div>
                        <div class="am-card">
                            <h3>Utility cost by day</h3>
                            <p class="am-sub">৳ ${this.fmtNum(totalUtilBazar)} utility cost across the month</p>
                            <div class="am-chart-scroll"><canvas id="am-util-bz-chart" width="600" height="200"></canvas></div>
                        </div>
                        ${topUtilItems.length ? `<div class="am-card">
                            <h3>Top 10 utility items by cost</h3>
                            <p class="am-sub">${topUtilItems.length} items</p>
                            <div class="am-top-items">${topUtilItems.map((it, i) => {
                                const pct = it.total / topUtilItems[0].total * 100;
                                const barColors = ['#FFB300','#FF8F00','#F57C00','#E65100','#D84315','#C62828','#AD1457','#6A1B9A'];
                                return `<div class="am-item-row"><span class="am-item-name">${this.esc(it.name)} ${it.count > 1 ? '×' + it.count : ''}</span><div class="am-item-bar"><div class="am-item-fill" style="width:${pct}%;background:${barColors[i % barColors.length]}"></div></div><span class="am-item-cost">৳${this.fmtNum(it.total)}</span></div>`;
                            }).join('')}</div>
                        </div>` : ''}
                    </div>

                </div>`;

            setTimeout(() => {
                this.drawRateChart(mealBzByDay, mealsByDay, daysInMonth);
                this.drawBzChart(mealBzByDay, daysInMonth);
                this.drawMlChart(mealsByDay, daysInMonth);
                if (mealShare.length) this.drawDonut(mealShare);
                if (Object.keys(utilBzByDay).length) this.drawUtilBzChart(utilBzByDay, daysInMonth);
                this.drawUtilRateChart(utilBzByDay, daysInMonth, mids.length);
            }, 100);
        } catch (e) { console.error('loadMonthly error:', e); }
    },

    buildMonthOptions(currentYear, currentMon) {
        let html = '';
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const y = d.getFullYear();
            const m = d.getMonth();
            const val = `${y}-${String(m + 1).padStart(2, '0')}`;
            const label = `${d.toLocaleString('en-US', { month: 'long' })} ${y}`;
            const sel = y === currentYear && m === currentMon ? ' selected' : '';
            html += `<option value="${val}"${sel}>${label}</option>`;
        }
        return html;
    },

    changeAnalysisMonth(val) {
        const [y, m] = val.split('-').map(Number);
        this._selYear = y;
        this._selMonth = m - 1;
        this.loadMonthly();
    },

    switchAnalysisTab(tab) {
        document.querySelectorAll('.am-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.am-tab-content').forEach(c => c.classList.remove('active'));
        const idx = tab === 'meal' ? 0 : 1;
        document.querySelectorAll('.am-tab')[idx]?.classList.add('active');
        document.getElementById(`am-tab-${tab}`)?.classList.add('active');
    },

    drawRateChart(bzByDay, mealsByDay, days) {
        const c = document.getElementById('am-rate-chart');
        if (!c) return;
        const ctx = c.getContext('2d');
        const w = c.width, h = c.height;
        const pad = { t: 20, r: 10, b: 30, l: 40 };
        ctx.clearRect(0, 0, w, h);
        const data = [];
        for (let d = 1; d <= days; d++) {
            const bz = bzByDay[d] || 0;
            const ml = mealsByDay[d] || 0;
            data.push(ml > 0 ? bz / ml : 0);
        }
        const maxV = Math.max(...data, 1);
        const xStep = (w - pad.l - pad.r) / (days - 1 || 1);

        ctx.beginPath();
        data.forEach((v, i) => {
            const x = pad.l + i * xStep;
            const y = h - pad.b - (v / maxV) * (h - pad.t - pad.b);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#0b3d91';
        ctx.lineWidth = 2;
        ctx.stroke();

        const baseY = h - pad.b;
        ctx.lineTo(pad.l + (data.length - 1) * xStep, baseY);
        ctx.lineTo(pad.l, baseY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(11,61,145,0.1)';
        ctx.fill();

        data.forEach((v, i) => {
            const x = pad.l + i * xStep;
            const y = h - pad.b - (v / maxV) * (h - pad.t - pad.b);
            ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#0b3d91'; ctx.fill();
        });
        ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
        for (let d = 1; d <= days; d += Math.ceil(days / 6)) {
            ctx.fillText(d, pad.l + (d - 1) * xStep - 5, h - 5);
        }
    },

    drawBzChart(bzByDay, days) {
        const c = document.getElementById('am-bz-chart');
        if (!c) return;
        const ctx = c.getContext('2d');
        const w = c.width, h = c.height;
        const pad = { t: 20, r: 10, b: 30, l: 40 };
        ctx.clearRect(0, 0, w, h);
        const data = [];
        for (let d = 1; d <= days; d++) data.push(bzByDay[d] || 0);
        const maxV = Math.max(...data, 1);
        const barW = (w - pad.l - pad.r) / days * 0.7;
        const gap = (w - pad.l - pad.r) / days;
        data.forEach((v, i) => {
            const x = pad.l + i * gap + (gap - barW) / 2;
            const bh = (v / maxV) * (h - pad.t - pad.b);
            ctx.fillStyle = '#FFB300';
            ctx.fillRect(x, h - pad.b - bh, barW, bh);
            if (v > 0) {
                ctx.fillStyle = '#333'; ctx.font = '9px sans-serif';
                ctx.fillText('৳' + this.fmtNum(v), x, h - pad.b - bh - 4);
            }
        });
        ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
        for (let d = 1; d <= days; d += Math.ceil(days / 10)) {
            ctx.fillText(d, pad.l + (d - 1) * gap + gap / 2 - 5, h - 5);
        }
    },

    drawUtilBzChart(data, days) {
        const c = document.getElementById('am-util-bz-chart');
        if (!c) return;
        const ctx = c.getContext('2d');
        const w = c.width, h = c.height;
        const pad = { t: 20, r: 10, b: 30, l: 40 };
        ctx.clearRect(0, 0, w, h);
        const vals = [];
        for (let d = 1; d <= days; d++) vals.push(data[d] || 0);
        const maxV = Math.max(...vals, 1);
        const barW = (w - pad.l - pad.r) / days * 0.7;
        const gap = (w - pad.l - pad.r) / days;
        vals.forEach((v, i) => {
            const x = pad.l + i * gap + (gap - barW) / 2;
            const bh = (v / maxV) * (h - pad.t - pad.b);
            ctx.fillStyle = '#F57C00';
            ctx.fillRect(x, h - pad.b - bh, barW, bh);
            if (v > 0) {
                ctx.fillStyle = '#333'; ctx.font = '9px sans-serif';
                ctx.fillText('৳' + this.fmtNum(v), x, h - pad.b - bh - 4);
            }
        });
        ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
        for (let d = 1; d <= days; d += Math.ceil(days / 10)) {
            ctx.fillText(d, pad.l + (d - 1) * gap + gap / 2 - 5, h - 5);
        }
    },

    drawMlChart(mealsByDay, days) {
        const c = document.getElementById('am-ml-chart');
        if (!c) return;
        const ctx = c.getContext('2d');
        const w = c.width, h = c.height;
        const pad = { t: 20, r: 10, b: 30, l: 40 };
        ctx.clearRect(0, 0, w, h);
        const data = [];
        for (let d = 1; d <= days; d++) data.push(mealsByDay[d] || 0);
        const maxV = Math.max(...data, 1);
        const barW = (w - pad.l - pad.r) / days * 0.7;
        const gap = (w - pad.l - pad.r) / days;
        data.forEach((v, i) => {
            const x = pad.l + i * gap + (gap - barW) / 2;
            const bh = (v / maxV) * (h - pad.t - pad.b);
            ctx.fillStyle = '#26A69A';
            ctx.fillRect(x, h - pad.b - bh, barW, bh);
            if (v > 0) {
                ctx.fillStyle = '#333'; ctx.font = '9px sans-serif';
                ctx.fillText(v, x + barW / 2 - 5, h - pad.b - bh - 4);
            }
        });
        ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
        for (let d = 1; d <= days; d += Math.ceil(days / 10)) {
            ctx.fillText(d, pad.l + (d - 1) * gap + gap / 2 - 5, h - 5);
        }
    },

    drawUtilRateChart(utilBzByDay, days, memberCount) {
        const c = document.getElementById('am-util-rate-chart');
        if (!c) return;
        const ctx = c.getContext('2d');
        const w = c.width, h = c.height;
        const pad = { t: 20, r: 10, b: 30, l: 40 };
        ctx.clearRect(0, 0, w, h);
        const data = [];
        for (let d = 1; d <= days; d++) {
            const bz = utilBzByDay[d] || 0;
            data.push(memberCount > 0 ? bz / memberCount : 0);
        }
        const maxV = Math.max(...data, 1);
        const xStep = (w - pad.l - pad.r) / (days - 1 || 1);

        ctx.beginPath();
        data.forEach((v, i) => {
            const x = pad.l + i * xStep;
            const y = h - pad.b - (v / maxV) * (h - pad.t - pad.b);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#F57C00';
        ctx.lineWidth = 2;
        ctx.stroke();

        const baseY = h - pad.b;
        ctx.lineTo(pad.l + (data.length - 1) * xStep, baseY);
        ctx.lineTo(pad.l, baseY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(245,124,0,0.1)';
        ctx.fill();

        data.forEach((v, i) => {
            const x = pad.l + i * xStep;
            const y = h - pad.b - (v / maxV) * (h - pad.t - pad.b);
            ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#F57C00'; ctx.fill();
        });
        ctx.fillStyle = '#888'; ctx.font = '10px sans-serif';
        for (let d = 1; d <= days; d += Math.ceil(days / 6)) {
            ctx.fillText(d, pad.l + (d - 1) * xStep - 5, h - 5);
        }
    },

    drawDonut(share) {
        const c = document.getElementById('am-donut');
        if (!c) return;
        const ctx = c.getContext('2d');
        const w = c.width, h = c.height;
        const cx = w / 2, cy = h / 2, r = 70, inner = 40;
        const total = share.reduce((s, m) => s + m.meals, 0);
        const colors = ['#1565C0', '#0d4fb5', '#FFB300', '#2E7D32'];
        let angle = -Math.PI / 2;
        share.forEach((m, i) => {
            const slice = (m.meals / total) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(cx, cy, r, angle, angle + slice);
            ctx.arc(cx, cy, inner, angle + slice, angle, true);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            if (slice > 0.3) {
                const mid = angle + slice / 2;
                const pct = Math.round(m.meals / total * 100);
                ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
                ctx.fillText(pct + '%', cx + Math.cos(mid) * (r + inner) / 2, cy + Math.sin(mid) * (r + inner) / 2 + 4);
            }
            angle += slice;
        });
    },
    copyUid() { if (this.currentUser) navigator.clipboard.writeText(this.currentUser.uid).then(() => this.toast('UID copied!', 'info')); },
    shareMessCode() { if (this.messCode) navigator.share?.({ title: 'Mess Manager', text: `Join my mess: ${this.messCode}` }).catch(() => {}); },
    sendResetFromProfile() { if (this.currentUser?.email) { auth.sendPasswordResetEmail(this.currentUser.email).then(() => this.toast('Reset email sent!', 'success')).catch(e => this.toast(e.message, 'error')); } },
    signOut() { auth.signOut(); },
    setProfilePic(dataUrl) {
        const ids = ['prof-avatar', 'dash-avatar'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.backgroundImage = `url(${dataUrl})`;
                el.style.backgroundSize = 'cover';
                el.style.backgroundPosition = 'center';
                el.textContent = '';
                el.style.color = 'transparent';
            }
        });
    },

    changeProfilePicture() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.position = 'fixed';
        input.style.left = '-9999px';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) { this.toast('Image must be under 2MB', 'error'); return; }
            try {
                const reader = new FileReader();
                reader.onload = async (ev) => {
                    const dataUrl = ev.target.result;
                    const uid = this.currentUser.uid;
                    const messId = this.messId || 'default';
                    await db.ref(`users/${uid}/profilePicture`).set(dataUrl);
                    await db.ref(`messes/${messId}/members/${this.currentUser.displayName}/photo`).set(dataUrl);
                    this.setProfilePic(dataUrl);
                    this.toast('Profile picture updated!', 'success');
                };
                reader.readAsDataURL(file);
            } catch (e) { this.toast('Failed to upload: ' + e.message, 'error'); }
            document.body.removeChild(input);
        };
        document.body.appendChild(input);
        input.click();
    },
    deleteAccount() {
        if (!this.currentUser) return;
        this.showConfirm('Delete Account', 'This will permanently delete your account and all data. Type DELETE to confirm:', async (confirmed) => {
            if (!confirmed) return;
            try {
                const uid = this.currentUser.uid;
                const messId = this.messId || 'default';
                await db.ref(`users/${uid}`).remove();
                await db.ref(`messes/${messId}/members/${this.currentUser.displayName}`).remove();
                await this.currentUser.delete();
                this.toast('Account deleted', 'success');
            } catch (e) { this.toast(e.message, 'error'); }
        });
    },
    showConfirm(title, msg, cb) {
        const body = document.getElementById('modal-body');
        body.innerHTML = `<p style="margin:0 0 16px;font-size:15px">${msg}</p>
            <div style="display:flex;gap:10px;justify-content:flex-end">
                <button id="confirm-yes" style="padding:10px 24px;border:none;border-radius:8px;background:#d32f2f;color:#fff;font-size:14px;font-weight:600;cursor:pointer">Confirm</button>
                <button id="confirm-no" style="padding:10px 24px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);font-size:14px;cursor:pointer">Cancel</button>
            </div>`;
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-overlay').classList.add('active');
        document.getElementById('confirm-yes').onclick = () => { document.getElementById('modal-overlay').classList.remove('active'); cb(true); };
        document.getElementById('confirm-no').onclick = () => { document.getElementById('modal-overlay').classList.remove('active'); cb(false); };
    },
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
