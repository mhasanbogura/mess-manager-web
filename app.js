const App = {
    currentUser: null, messId: null, messCode: null, messName: null,
    currentPage: 'dashboard', userRole: 'member',

    init() {
        if (typeof firebaseConfig === 'undefined' || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY_HERE') {
            this.showScreen('auth-screen');
            document.querySelector('.auth-container').innerHTML = '<div class="auth-header"><div class="auth-logo"><span class="material-icons-round">warning</span></div><h1>Firebase Setup Required</h1><p style="margin-top:12px">Edit <code>firebase-config.js</code></p></div>';
            return;
        }
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        this.bindEvents();
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
            if (ids.length === 1) { this.enterMess(ids[0]); return; }
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
        const titles = { dashboard: 'Dashboard', members: 'Flat', meals: 'Meal', bazaar: 'Bazar', balance: 'Manager', notices: 'Notice Board', monthly: 'Analysis', profile: 'Profile' };
        document.getElementById('page-title').textContent = titles[page] || page.charAt(0).toUpperCase() + page.slice(1);
        if (page === 'dashboard') this.loadDashboard();
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

            const hour = now.getHours();
            const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
            const userName = this.currentUser?.displayName || 'User';
            document.getElementById('dash-greeting').textContent = greet;
            document.getElementById('dash-user-name').textContent = userName;
            const initial = ((userName.trim()[0] || 'U')).toUpperCase();
            document.getElementById('dash-avatar').textContent = initial;
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

            const bzSnap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(monthEnd).once('value');
            let bazTotal = 0, utilTotal = 0;
            const paidBy = {};
            bzSnap.forEach(s => {
                const b = s.val() || {}; const amt = b.amount || 0;
                if ((b.category || 'Shopping') === 'Utility') utilTotal += amt;
                else { bazTotal += amt; const n = (b.buyer || '').trim(); if (n) paidBy[n] = (paidBy[n] || 0) + amt; }
            });

            const mlMSnap = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(monthEnd).once('value');
            const memberMeals = {}, memberSpecial = {};
            let totalMeals = 0;
            mlMSnap.forEach(d => {
                Object.entries(d.val() || {}).forEach(([mid, m]) => {
                    const base = (m.breakfast || 0) + (m.lunch || 0) + (m.dinner || 0);
                    const sp = (m.special || 0);
                    memberMeals[mid] = (memberMeals[mid] || 0) + base;
                    memberSpecial[mid] = (memberSpecial[mid] || 0) + sp;
                    totalMeals += base + sp;
                });
            });
            const rate = totalMeals > 0 ? bazTotal / totalMeals : 0;
            const utilShare = mids.length ? utilTotal / mids.length : 0;

            const depSnap = await db.ref(`messes/${this.messId}/deposits`).once('value');
            const depAll = depSnap.val() || {};
            const depByMid = {}; let totalDep = 0;
            Object.entries(depAll).forEach(([mid, v]) => {
                if (!v || typeof v !== 'object') return;
                if (typeof v.amount === 'number') { depByMid[mid] = (depByMid[mid] || 0) + v.amount; totalDep += v.amount; return; }
                Object.values(v).forEach(e => {
                    if (e && typeof e.amount === 'number' && (!e.dateKey || String(e.dateKey).startsWith(month))) {
                        depByMid[mid] = (depByMid[mid] || 0) + e.amount; totalDep += e.amount;
                    }
                });
            });

            document.getElementById('dash-deposit').textContent = '৳ ' + this.fmtNum(totalDep);
            const finBal = totalDep - utilTotal;
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
                const base = memberMeals[mid] || 0;
                const sp = memberSpecial[mid] || 0;
                const mealCost = base * rate, spCost = sp * rate;
                const cost = mealCost + spCost + utilShare;
                const paid = paidBy[name] || 0;
                const dep = depByMid[mid] || 0;
                const depTot = paid + dep;
                const bal = depTot - cost;
                html += `<tr>
                    <td class="c-name">${this.esc(name)}</td>
                    <td><small>${this.fmtNum(base)}+${this.fmtNum(sp)}</small><strong>${this.fmtNum(base + sp)}</strong></td>
                    <td><small>${this.fmtNum(mealCost)}+${this.fmtNum(spCost)}+${this.fmtNum(utilShare)}</small><strong>${this.fmtNum(cost)}</strong></td>
                    <td><small>${this.fmtNum(paid)}+${this.fmtNum(dep)}</small><strong>${this.fmtNum(depTot)}</strong></td>
                    <td class="${bal < 0 ? 'neg' : 'pos'}"><strong>${this.fmtNum(bal)}</strong></td>
                </tr>`;
            });
            rowsEl.innerHTML = html;
        } catch (e) { console.error('loadDashboard error:', e); }
    },

    copyCode() { if (this.messCode) navigator.clipboard.writeText(this.messCode).then(() => this.toast('Copied!', 'info')); },
    signOut() { auth.signOut(); },
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
