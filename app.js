const App = {
    currentUser: null,
    currentPage: 'dashboard',
    messId: null,
    messCode: null,
    userRole: null,
    mealDate: new Date(),
    bazarDate: new Date(),
    expenseMonth: new Date(),
    reportDate: new Date(),
    reportMonth: new Date(),

    init() {
        if (firebaseConfig.apiKey === 'YOUR_API_KEY_HERE') {
            document.getElementById('auth-screen').classList.add('active');
            document.querySelector('.auth-container').innerHTML = `
                <div class="auth-header">
                    <div class="auth-logo"><span class="material-icons-round">warning</span></div>
                    <h1>Firebase Setup Required</h1>
                    <p style="margin-top:12px;line-height:1.6">Open <code>firebase-config.js</code> and add your Firebase config.</p>
                </div>`;
            return;
        }

        this.bindEvents();
        auth.onAuthStateChanged(user => {
            if (user) {
                this.currentUser = user;
                this.checkMessMembership();
            } else {
                this.showScreen('auth-screen');
            }
        });
    },

    bindEvents() {
        // Auth
        document.getElementById('google-login').addEventListener('click', () => this.googleLogin());
        document.getElementById('forgot-password-link').addEventListener('click', () => this.showScreen('forgot-screen'));
        document.getElementById('back-to-login').addEventListener('click', () => this.showScreen('auth-screen'));
        document.getElementById('send-reset-btn').addEventListener('click', () => this.sendResetEmail());
        document.getElementById('logout-from-setup').addEventListener('click', () => auth.signOut());

        // Setup tabs
        document.querySelectorAll('.setup-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.setup-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('create-mess-card').style.display = tab.dataset.tab === 'create' ? 'block' : 'none';
                document.getElementById('join-mess-card').style.display = tab.dataset.tab === 'join' ? 'block' : 'none';
            });
        });
        document.getElementById('create-mess-btn').addEventListener('click', () => this.createMess());
        document.getElementById('join-mess-btn').addEventListener('click', () => this.joinMess());

        // Sidebar
        document.getElementById('menu-toggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebar-overlay').addEventListener('click', () => this.closeSidebar());
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', e => { e.preventDefault(); this.navigate(item.dataset.page); });
        });
        document.getElementById('user-avatar').addEventListener('click', () => this.navigate('dashboard'));
        document.getElementById('copy-mess-code').addEventListener('click', () => this.copyMessCode());
        document.getElementById('leave-mess-btn').addEventListener('click', e => { e.preventDefault(); this.leaveMess(); });
        document.getElementById('logout-btn').addEventListener('click', e => { e.preventDefault(); auth.signOut(); });

        // Page buttons
        document.getElementById('add-member-btn').addEventListener('click', () => this.showMemberModal());
        document.getElementById('add-meal-btn').addEventListener('click', () => this.showMealModal());
        document.getElementById('add-bazar-btn').addEventListener('click', () => this.showBazarModal());
        document.getElementById('add-expense-btn').addEventListener('click', () => this.showExpenseModal());
        document.getElementById('add-deposit-btn').addEventListener('click', () => this.showDepositModal());
        document.getElementById('add-notice-btn').addEventListener('click', () => this.showNoticeModal());

        // Modal
        document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('modal-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) this.closeModal(); });

        // Date navs
        document.getElementById('meal-prev-day').addEventListener('click', () => { this.mealDate.setDate(this.mealDate.getDate() - 1); this.loadMeals(); });
        document.getElementById('meal-next-day').addEventListener('click', () => { this.mealDate.setDate(this.mealDate.getDate() + 1); this.loadMeals(); });
        document.getElementById('bazar-prev-day').addEventListener('click', () => { this.bazarDate.setDate(this.bazarDate.getDate() - 1); this.loadBazaar(); });
        document.getElementById('bazar-next-day').addEventListener('click', () => { this.bazarDate.setDate(this.bazarDate.getDate() + 1); this.loadBazaar(); });
        document.getElementById('expense-prev-month').addEventListener('click', () => { this.expenseMonth.setMonth(this.expenseMonth.getMonth() - 1); this.loadExpenses(); });
        document.getElementById('expense-next-month').addEventListener('click', () => { this.expenseMonth.setMonth(this.expenseMonth.getMonth() + 1); this.loadExpenses(); });
        document.getElementById('report-prev-day').addEventListener('click', () => { this.reportDate.setDate(this.reportDate.getDate() - 1); this.loadDailyReport(); });
        document.getElementById('report-next-day').addEventListener('click', () => { this.reportDate.setDate(this.reportDate.getDate() + 1); this.loadDailyReport(); });
        document.getElementById('report-prev-month').addEventListener('click', () => { this.reportMonth.setMonth(this.reportMonth.getMonth() - 1); this.loadMonthlyReport(); });
        document.getElementById('report-next-month').addEventListener('click', () => { this.reportMonth.setMonth(this.reportMonth.getMonth() + 1); this.loadMonthlyReport(); });
        document.getElementById('export-daily-pdf').addEventListener('click', () => this.exportDailyPDF());
        document.getElementById('export-monthly-pdf').addEventListener('click', () => this.exportMonthlyPDF());
    },

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    // AUTH
    async googleLogin() {
        const btn = document.getElementById('google-login');
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<span class="material-icons-round" style="animation:spin 1s linear infinite">refresh</span> Connecting...';
        btn.disabled = true;
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await auth.signInWithPopup(provider);
        } catch (e) {
            let msg = e.message;
            if (e.code === 'auth/popup-closed-by-user') msg = 'Login cancelled';
            else if (e.code === 'auth/popup-blocked') msg = 'Popup blocked. Allow popups for this site.';
            this.toast(msg, 'error');
        } finally {
            btn.innerHTML = origHTML;
            btn.disabled = false;
        }
    },

    async sendResetEmail() {
        const email = document.getElementById('reset-email').value.trim();
        if (!email) { this.toast('Enter your email', 'error'); return; }
        try {
            await auth.sendPasswordResetEmail(email);
            this.toast('Reset link sent! Check your email.', 'success');
            setTimeout(() => this.showScreen('auth-screen'), 2000);
        } catch (e) {
            this.toast(e.message, 'error');
        }
    },

    // MESS MEMBERSHIP CHECK
    async checkMessMembership() {
        const snap = await db.ref(`users/${this.currentUser.uid}/messId`).once('value');
        if (snap.exists()) {
            this.messId = snap.val();
            // Get mess code
            const messSnap = await db.ref(`messes/${this.messId}/settings`).once('value');
            const settings = messSnap.val() || {};
            this.messCode = settings.messCode || null;
            this.userRole = settings.owner === this.currentUser.uid ? 'admin' : 'member';
            this.showApp();
        } else {
            this.showScreen('mess-setup-screen');
        }
    },

    async createMess() {
        const name = document.getElementById('create-mess-name').value.trim();
        const address = document.getElementById('create-mess-address').value.trim();
        if (!name) { this.toast('Enter a mess name', 'error'); return; }

        const btn = document.getElementById('create-mess-btn');
        btn.textContent = 'Creating...';
        btn.disabled = true;

        try {
            const code = this.generateCode(6);
            const messRef = db.ref('messes').push();
            this.messId = messRef.key;
            this.messCode = code;

            await messRef.set({
                settings: {
                    messName: name,
                    address: address,
                    messCode: code,
                    owner: this.currentUser.uid,
                    createdAt: Date.now()
                },
                members: {
                    [this.currentUser.uid]: {
                        name: this.currentUser.displayName || 'Admin',
                        email: this.currentUser.email,
                        role: 'admin',
                        joinedAt: Date.now()
                    }
                }
            });

            await db.ref(`users/${this.currentUser.uid}/messId`).set(this.messId);
            this.toast('Mess created!', 'success');
            this.showApp();
        } catch (e) {
            this.toast(e.message, 'error');
        } finally {
            btn.textContent = 'Create Mess';
            btn.disabled = false;
        }
    },

    async joinMess() {
        const code = document.getElementById('join-mess-code').value.trim().toUpperCase();
        if (!code || code.length !== 6) { this.toast('Enter a valid 6-digit code', 'error'); return; }

        const btn = document.getElementById('join-mess-btn');
        btn.textContent = 'Joining...';
        btn.disabled = true;

        try {
            // Find mess by code
            const snap = await db.ref('messes').orderByChild('settings/messCode').equalTo(code).once('value');
            if (!snap.exists()) { this.toast('Mess not found. Check the code.', 'error'); return; }

            let foundMessId = null;
            snap.forEach(s => { foundMessId = s.key; });
            this.messId = foundMessId;
            this.messCode = code;

            // Add user to mess members
            await db.ref(`messes/${this.messId}/members/${this.currentUser.uid}`).set({
                name: this.currentUser.displayName || 'Member',
                email: this.currentUser.email,
                role: 'member',
                joinedAt: Date.now()
            });

            await db.ref(`users/${this.currentUser.uid}/messId`).set(this.messId);
            this.toast('Joined mess successfully!', 'success');
            this.showApp();
        } catch (e) {
            this.toast(e.message, 'error');
        } finally {
            btn.textContent = 'Join Mess';
            btn.disabled = false;
        }
    },

    generateCode(len) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < len; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        return code;
    },

    copyMessCode() {
        if (!this.messCode) return;
        navigator.clipboard.writeText(this.messCode).then(() => this.toast('Code copied!', 'info'));
    },

    async leaveMess() {
        if (!confirm('Leave this mess? You will need a code to rejoin.')) return;
        await db.ref(`messes/${this.messId}/members/${this.currentUser.uid}`).remove();
        await db.ref(`users/${this.currentUser.uid}/messId`).remove();
        this.messId = null;
        this.messCode = null;
        this.showScreen('mess-setup-screen');
    },

    // APP
    showApp() {
        this.showScreen('app-screen');
        document.getElementById('sidebar-name').textContent = this.currentUser.displayName || 'User';
        document.getElementById('sidebar-email').textContent = this.currentUser.email || '';
        document.getElementById('sidebar-mess-code').textContent = this.messCode || '------';
        this.loadDashboard();
    },

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('sidebar-overlay').classList.toggle('active');
    },

    closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('active');
    },

    navigate(page) {
        this.currentPage = page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-' + page).classList.add('active');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
        if (navItem) navItem.classList.add('active');
        document.getElementById('page-title').textContent = page.charAt(0).toUpperCase() + page.slice(1);
        this.closeSidebar();
        this.loadPageData(page);
    },

    loadPageData(page) {
        const loaders = {
            dashboard: () => this.loadDashboard(),
            members: () => this.loadMembers(),
            meals: () => this.loadMeals(),
            bazaar: () => this.loadBazaar(),
            expenses: () => this.loadExpenses(),
            balance: () => this.loadBalance(),
            notices: () => this.loadNotices(),
            reports: () => { this.loadDailyReport(); this.loadMonthlyReport(); }
        };
        if (loaders[page]) loaders[page]();
    },

    // DASHBOARD
    async loadDashboard() {
        if (!this.currentUser || !this.messId) return;
        const today = this.dateKey(new Date());
        const month = this.monthKey(new Date());

        const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
        document.getElementById('stat-members').textContent = membersSnap.numChildren();

        const mealsSnap = await db.ref(`messes/${this.messId}/meals/${today}`).once('value');
        let todayMeals = 0;
        mealsSnap.forEach(s => { const m = s.val(); todayMeals += (m.breakfast || 0) + (m.lunch || 0) + (m.dinner || 0); });
        document.getElementById('stat-today-meals').textContent = todayMeals;

        const bazarSnap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let monthBazar = 0; bazarSnap.forEach(s => { monthBazar += s.val().amount || 0; });
        document.getElementById('stat-month-bazar').textContent = '৳' + monthBazar;

        const expSnap = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let monthExp = 0; expSnap.forEach(s => { monthExp += s.val().amount || 0; });
        document.getElementById('stat-month-expense').textContent = '৳' + monthExp;

        const actSnap = await db.ref(`messes/${this.messId}/activity`).orderByChild('ts').limitToLast(10).once('value');
        const actDiv = document.getElementById('recent-activity');
        if (actSnap.exists()) {
            let html = '';
            actSnap.forEach(s => { const a = s.val(); html += `<div class="item-card"><div class="item-card-header"><h4>${this.esc(a.text || '')}</h4></div><div class="item-card-details"><span>${this.timeAgo(a.ts)}</span></div></div>`; });
            actDiv.innerHTML = html;
        } else {
            actDiv.innerHTML = '<p class="empty-state">No recent activity</p>';
        }
    },

    // MEMBERS
    async loadMembers() {
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const div = document.getElementById('members-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state">No members yet</p>'; return; }
        let html = '';
        snap.forEach(s => {
            const m = s.val();
            const init = (m.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            html += `<div class="member-item">
                <div class="member-avatar">${init}</div>
                <div class="member-info"><h4>${this.esc(m.name || '')}</h4><p>${this.esc(m.email || '')}</p></div>
                <div class="member-actions">
                    <button class="icon-btn" onclick="App.editMember('${s.key}')"><span class="material-icons-round">edit</span></button>
                    <button class="icon-btn" onclick="App.deleteMember('${s.key}')"><span class="material-icons-round">delete</span></button>
                </div>
            </div>`;
        });
        div.innerHTML = html;
    },

    showMemberModal(id = null, data = null) {
        document.getElementById('modal-title').textContent = id ? 'Edit Member' : 'Add Member';
        document.getElementById('modal-body').innerHTML = `
            <div class="form-group"><label>Name</label><input id="m-name" value="${data?.name || ''}"></div>
            <div class="form-group"><label>Email</label><input id="m-email" value="${data?.email || ''}"></div>
            <div class="form-group"><label>Role</label><select id="m-role">
                <option value="member" ${data?.role !== 'admin' ? 'selected' : ''}>Member</option>
                <option value="admin" ${data?.role === 'admin' ? 'selected' : ''}>Admin</option>
            </select></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveMember('${id || ''}')">${id ? 'Update' : 'Add'}</button>`;
        this.openModal();
    },

    async saveMember(id) {
        const data = { name: document.getElementById('m-name').value.trim(), email: document.getElementById('m-email').value.trim(), role: document.getElementById('m-role').value, updatedAt: Date.now() };
        if (!data.name) { this.toast('Name required', 'error'); return; }
        if (id) await db.ref(`messes/${this.messId}/members/${id}`).update(data);
        else { data.createdAt = Date.now(); await db.ref(`messes/${this.messId}/members`).push(data); }
        this.closeModal(); this.loadMembers(); this.toast('Saved', 'success');
    },

    async editMember(id) { const s = await db.ref(`messes/${this.messId}/members/${id}`).once('value'); this.showMemberModal(id, s.val()); },
    async deleteMember(id) { if (!confirm('Delete?')) return; await db.ref(`messes/${this.messId}/members/${id}`).remove(); this.loadMembers(); this.toast('Deleted', 'success'); },

    // MEALS
    async loadMeals() {
        const key = this.dateKey(this.mealDate);
        document.getElementById('meal-date-label').textContent = this.formatDate(this.mealDate);
        const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = membersSnap.val() || {};
        const mealsSnap = await db.ref(`messes/${this.messId}/meals/${key}`).once('value');
        const meals = mealsSnap.val() || {};
        const div = document.getElementById('meals-list');
        const mids = Object.keys(members);
        if (!mids.length) { div.innerHTML = '<p class="empty-state">Add members first</p>'; return; }
        let html = '', totalToday = 0;
        mids.forEach(mid => {
            const m = members[mid], ml = meals[mid] || {};
            const t = (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0);
            totalToday += t;
            html += `<div class="item-card"><div class="item-card-header"><h4>${this.esc(m.name)}</h4><span class="amount">${t} meals</span></div>
                <div class="item-card-details"><span>B: ${ml.breakfast || 0}</span><span>L: ${ml.lunch || 0}</span><span>D: ${ml.dinner || 0}</span></div>
                <div class="item-card-actions"><button class="icon-btn" onclick="App.editMeal('${mid}','${key}')"><span class="material-icons-round">edit</span></button></div></div>`;
        });
        div.innerHTML = html;
        document.getElementById('meal-total-today').textContent = totalToday;
        const month = this.monthKey(this.mealDate);
        let totalMonth = 0;
        const ms = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-31').once('value');
        ms.forEach(d => { Object.values(d.val() || {}).forEach(ml => { totalMonth += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); }); });
        document.getElementById('meal-total-month').textContent = totalMonth;
    },

    showMealModal(memberId = null, dateKey = null, data = null) {
        document.getElementById('modal-title').textContent = data ? 'Edit Meal' : 'Add Meal';
        db.ref(`messes/${this.messId}/members`).once('value').then(snap => {
            const members = snap.val() || {};
            let opts = '<option value="">Select Member</option>';
            Object.entries(members).forEach(([id, m]) => { opts += `<option value="${id}" ${id === memberId ? 'selected' : ''}>${m.name}</option>`; });
            document.getElementById('modal-body').innerHTML = `
                <div class="form-group"><label>Member</label><select id="ml-member">${opts}</select></div>
                <div class="form-group"><label>Breakfast</label><input type="number" id="ml-b" min="0" value="${data?.breakfast || 0}"></div>
                <div class="form-group"><label>Lunch</label><input type="number" id="ml-l" min="0" value="${data?.lunch || 0}"></div>
                <div class="form-group"><label>Dinner</label><input type="number" id="ml-d" min="0" value="${data?.dinner || 0}"></div>`;
            document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveMeal('${dateKey || this.dateKey(this.mealDate)}')">Save</button>`;
            this.openModal();
        });
    },

    async saveMeal(dateKey) {
        const mid = document.getElementById('ml-member').value;
        if (!mid) { this.toast('Select member', 'error'); return; }
        const data = { breakfast: +document.getElementById('ml-b').value || 0, lunch: +document.getElementById('ml-l').value || 0, dinner: +document.getElementById('ml-d').value || 0, updatedAt: Date.now() };
        await db.ref(`messes/${this.messId}/meals/${dateKey}/${mid}`).update(data);
        this.closeModal(); this.loadMeals(); this.toast('Saved', 'success');
    },

    async editMeal(mid, dk) { const s = await db.ref(`messes/${this.messId}/meals/${dk}/${mid}`).once('value'); this.showMealModal(mid, dk, s.val()); },

    // BAZAAR
    async loadBazaar() {
        const key = this.dateKey(this.bazarDate);
        document.getElementById('bazar-date-label').textContent = this.formatDate(this.bazarDate);
        const snap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').equalTo(key).once('value');
        const div = document.getElementById('bazar-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state">No bazaar items</p>'; document.getElementById('bazar-total-today').textContent = '৳0'; return; }
        let total = 0, html = '';
        snap.forEach(s => { const b = s.val(); total += b.amount || 0;
            html += `<div class="item-card"><div class="item-card-header"><h4>${this.esc(b.item || '')}</h4><span class="amount">৳${b.amount || 0}</span></div>
                <div class="item-card-details"><span>Qty: ${b.quantity || '-'}</span><span>Buyer: ${this.esc(b.buyer || '')}</span></div>
                <div class="item-card-actions"><button class="icon-btn" onclick="App.editBazar('${s.key}')"><span class="material-icons-round">edit</span></button>
                <button class="icon-btn" onclick="App.deleteBazar('${s.key}')"><span class="material-icons-round">delete</span></button></div></div>`;
        });
        div.innerHTML = html;
        document.getElementById('bazar-total-today').textContent = '৳' + total;
        const month = this.monthKey(this.bazarDate);
        const ms = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let mt = 0; ms.forEach(s => { mt += s.val().amount || 0; });
        document.getElementById('bazar-total-month').textContent = '৳' + mt;
    },

    showBazarModal(id = null, data = null) {
        document.getElementById('modal-title').textContent = id ? 'Edit Bazaar' : 'Add Bazaar';
        document.getElementById('modal-body').innerHTML = `
            <div class="form-group"><label>Item</label><input id="bz-item" value="${data?.item || ''}" placeholder="e.g. Rice, Oil"></div>
            <div class="form-group"><label>Amount (৳)</label><input type="number" id="bz-amount" min="0" value="${data?.amount || ''}"></div>
            <div class="form-group"><label>Quantity</label><input id="bz-qty" value="${data?.quantity || ''}" placeholder="e.g. 5 kg"></div>
            <div class="form-group"><label>Buyer</label><input id="bz-buyer" value="${data?.buyer || ''}"></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveBazar('${id || ''}')">${id ? 'Update' : 'Add'}</button>`;
        this.openModal();
    },

    async saveBazar(id) {
        const data = { item: document.getElementById('bz-item').value.trim(), amount: parseFloat(document.getElementById('bz-amount').value) || 0, quantity: document.getElementById('bz-qty').value.trim(), buyer: document.getElementById('bz-buyer').value.trim(), dateKey: this.dateKey(this.bazarDate), updatedAt: Date.now() };
        if (!data.item) { this.toast('Item name required', 'error'); return; }
        if (id) await db.ref(`messes/${this.messId}/bazaar/${id}`).update(data);
        else { data.createdAt = Date.now(); await db.ref(`messes/${this.messId}/bazaar`).push(data); }
        this.closeModal(); this.loadBazaar(); this.toast('Saved', 'success');
    },

    async editBazar(id) { const s = await db.ref(`messes/${this.messId}/bazaar/${id}`).once('value'); this.showBazarModal(id, s.val()); },
    async deleteBazar(id) { if (!confirm('Delete?')) return; await db.ref(`messes/${this.messId}/bazaar/${id}`).remove(); this.loadBazaar(); this.toast('Deleted', 'success'); },

    // EXPENSES
    async loadExpenses() {
        const month = this.monthKey(this.expenseMonth);
        document.getElementById('expense-month-label').textContent = this.formatMonth(this.expenseMonth);
        const snap = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        const div = document.getElementById('expenses-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state">No expenses</p>'; document.getElementById('expense-total-month').textContent = '৳0'; return; }
        let total = 0, html = '';
        snap.forEach(s => { const e = s.val(); total += e.amount || 0;
            html += `<div class="item-card"><div class="item-card-header"><h4>${this.esc(e.category || '')} - ${this.esc(e.description || '')}</h4><span class="amount">৳${e.amount || 0}</span></div>
                <div class="item-card-details"><span>${this.formatDate(new Date(e.date))}</span><span>By: ${this.esc(e.paidBy || '')}</span></div>
                <div class="item-card-actions"><button class="icon-btn" onclick="App.editExpense('${s.key}')"><span class="material-icons-round">edit</span></button>
                <button class="icon-btn" onclick="App.deleteExpense('${s.key}')"><span class="material-icons-round">delete</span></button></div></div>`;
        });
        div.innerHTML = html;
        document.getElementById('expense-total-month').textContent = '৳' + total;
    },

    showExpenseModal(id = null, data = null) {
        document.getElementById('modal-title').textContent = id ? 'Edit Expense' : 'Add Expense';
        document.getElementById('modal-body').innerHTML = `
            <div class="form-group"><label>Category</label><select id="ex-cat">
                <option ${data?.category === 'Food' ? 'selected' : ''}>Food</option>
                <option ${data?.category === 'Utility' ? 'selected' : ''}>Utility</option>
                <option ${data?.category === 'Rent' ? 'selected' : ''}>Rent</option>
                <option ${data?.category === 'Salary' ? 'selected' : ''}>Salary</option>
                <option ${data?.category === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                <option ${data?.category === 'Other' ? 'selected' : ''}>Other</option>
            </select></div>
            <div class="form-group"><label>Description</label><input id="ex-desc" value="${data?.description || ''}"></div>
            <div class="form-group"><label>Amount (৳)</label><input type="number" id="ex-amount" min="0" value="${data?.amount || ''}"></div>
            <div class="form-group"><label>Paid By</label><input id="ex-paidby" value="${data?.paidBy || ''}"></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveExpense('${id || ''}')">${id ? 'Update' : 'Add'}</button>`;
        this.openModal();
    },

    async saveExpense(id) {
        const data = { category: document.getElementById('ex-cat').value, description: document.getElementById('ex-desc').value.trim(), amount: parseFloat(document.getElementById('ex-amount').value) || 0, paidBy: document.getElementById('ex-paidby').value.trim(), dateKey: this.dateKey(new Date()), date: new Date().toISOString(), updatedAt: Date.now() };
        if (!data.amount) { this.toast('Amount required', 'error'); return; }
        if (id) await db.ref(`messes/${this.messId}/expenses/${id}`).update(data);
        else { data.createdAt = Date.now(); await db.ref(`messes/${this.messId}/expenses`).push(data); }
        this.closeModal(); this.loadExpenses(); this.toast('Saved', 'success');
    },

    async editExpense(id) { const s = await db.ref(`messes/${this.messId}/expenses/${id}`).once('value'); this.showExpenseModal(id, s.val()); },
    async deleteExpense(id) { if (!confirm('Delete?')) return; await db.ref(`messes/${this.messId}/expenses/${id}`).remove(); this.loadExpenses(); this.toast('Deleted', 'success'); },

    // BALANCE
    async loadBalance() {
        const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = membersSnap.val() || {};
        const depositsSnap = await db.ref(`messes/${this.messId}/deposits`).once('value');
        const deposits = depositsSnap.val() || {};
        const month = this.monthKey(new Date());

        const expSnap = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let totalExp = 0; expSnap.forEach(s => { totalExp += s.val().amount || 0; });
        const bazarSnap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let totalBazar = 0; bazarSnap.forEach(s => { totalBazar += s.val().amount || 0; });
        let totalDep = 0; Object.values(deposits).forEach(d => { totalDep += d.amount || 0; });
        const totalCost = totalExp + totalBazar;
        const remaining = totalDep - totalCost;

        document.getElementById('balance-income').textContent = '৳' + totalDep;
        document.getElementById('balance-expense').textContent = '৳' + totalCost;
        document.getElementById('balance-remaining').textContent = '৳' + remaining;

        let totalMeals = 0;
        const mealsSnap = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-31').once('value');
        mealsSnap.forEach(d => { Object.values(d.val() || {}).forEach(ml => { totalMeals += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); }); });
        const rate = totalMeals > 0 ? (totalCost / totalMeals).toFixed(2) : 0;
        document.getElementById('balance-rate').textContent = '৳' + rate;

        const div = document.getElementById('member-dues-list');
        const mids = Object.keys(members);
        if (!mids.length) { div.innerHTML = '<p class="empty-state">No members</p>'; return; }
        let html = '';
        mids.forEach(mid => {
            const m = members[mid], dep = deposits[mid]?.amount || 0;
            let mm = 0;
            mealsSnap.forEach(d => { const ml = (d.val() || {})[mid] || {}; mm += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); });
            const cost = (mm * parseFloat(rate)).toFixed(2);
            const due = (dep - parseFloat(cost)).toFixed(2);
            html += `<div class="due-item"><div class="due-info"><h4>${this.esc(m.name)}</h4><p>${mm} meals | Deposit: ৳${dep}</p></div><div class="due-amount ${parseFloat(due) >= 0 ? 'positive' : 'negative'}">৳${due}</div></div>`;
        });
        div.innerHTML = html;
    },

    showDepositModal() {
        document.getElementById('modal-title').textContent = 'Record Deposit';
        db.ref(`messes/${this.messId}/members`).once('value').then(snap => {
            const members = snap.val() || {};
            let opts = '<option value="">Select Member</option>';
            Object.entries(members).forEach(([id, m]) => { opts += `<option value="${id}">${m.name}</option>`; });
            document.getElementById('modal-body').innerHTML = `
                <div class="form-group"><label>Member</label><select id="dp-member">${opts}</select></div>
                <div class="form-group"><label>Amount (৳)</label><input type="number" id="dp-amount" min="0"></div>
                <div class="form-group"><label>Note</label><input id="dp-note" placeholder="Optional"></div>`;
            document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveDeposit()">Save</button>`;
            this.openModal();
        });
    },

    async saveDeposit() {
        const mid = document.getElementById('dp-member').value;
        const amount = parseFloat(document.getElementById('dp-amount').value) || 0;
        const note = document.getElementById('dp-note').value.trim();
        if (!mid || !amount) { this.toast('Select member and amount', 'error'); return; }
        const existing = (await db.ref(`messes/${this.messId}/deposits/${mid}/amount`).once('value')).val() || 0;
        await db.ref(`messes/${this.messId}/deposits/${mid}`).set({ amount: existing + amount, note, updatedAt: Date.now() });
        this.closeModal(); this.loadBalance(); this.toast('Deposit recorded', 'success');
    },

    // NOTICES
    async loadNotices() {
        const snap = await db.ref(`messes/${this.messId}/notices`).orderByChild('createdAt').limitToLast(50).once('value');
        const div = document.getElementById('notices-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state">No notices</p>'; return; }
        let html = ''; const arr = [];
        snap.forEach(s => { arr.unshift({ key: s.key, ...s.val() }); });
        arr.forEach(n => {
            html += `<div class="notice-item"><h4>${this.esc(n.title || '')}</h4><p>${this.esc(n.body || '')}</p>
                <div class="notice-meta"><span>By: ${this.esc(n.author || '')}</span><span>${this.timeAgo(n.createdAt)}</span></div>
                <div class="item-card-actions"><button class="icon-btn" onclick="App.deleteNotice('${n.key}')"><span class="material-icons-round">delete</span></button></div></div>`;
        });
        div.innerHTML = html;
    },

    showNoticeModal() {
        document.getElementById('modal-title').textContent = 'Post Notice';
        document.getElementById('modal-body').innerHTML = `
            <div class="form-group"><label>Title</label><input id="nt-title"></div>
            <div class="form-group"><label>Message</label><textarea id="nt-body"></textarea></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveNotice()">Post</button>`;
        this.openModal();
    },

    async saveNotice() {
        const title = document.getElementById('nt-title').value.trim();
        const body = document.getElementById('nt-body').value.trim();
        if (!title) { this.toast('Title required', 'error'); return; }
        await db.ref(`messes/${this.messId}/notices`).push({ title, body, author: this.currentUser.displayName || 'Admin', createdAt: Date.now() });
        this.closeModal(); this.loadNotices(); this.toast('Posted', 'success');
    },

    async deleteNotice(id) { if (!confirm('Delete?')) return; await db.ref(`messes/${this.messId}/notices/${id}`).remove(); this.loadNotices(); },

    // REPORTS
    async loadDailyReport() {
        const key = this.dateKey(this.reportDate);
        document.getElementById('report-date-label').textContent = this.formatDate(this.reportDate);
        const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = membersSnap.val() || {};
        const mealsSnap = await db.ref(`messes/${this.messId}/meals/${key}`).once('value');
        const meals = mealsSnap.val() || {};
        const bazarSnap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').equalTo(key).once('value');
        let totalMeals = 0, totalBazar = 0, rows = '';
        Object.entries(members).forEach(([id, m]) => {
            const ml = meals[id] || {}, t = (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0);
            totalMeals += t;
            rows += `<div class="report-row"><span>${m.name}</span><span>${t} meals (B:${ml.breakfast || 0} L:${ml.lunch || 0} D:${ml.dinner || 0})</span></div>`;
        });
        bazarSnap.forEach(s => { totalBazar += s.val().amount || 0; });
        document.getElementById('daily-report').innerHTML = `
            <div class="report-section"><h5>Meals</h5>${rows || '<p>No meals</p>'}<div class="report-row report-total"><span>Total</span><span>${totalMeals}</span></div></div>
            <div class="report-section"><h5>Bazaar</h5><div class="report-row"><span>Total</span><span>৳${totalBazar}</span></div></div>
            ${totalMeals > 0 ? `<div class="report-section"><h5>Rate</h5><div class="report-row"><span>Per meal</span><span>৳${(totalBazar / totalMeals).toFixed(2)}</span></div></div>` : ''}`;
    },

    async loadMonthlyReport() {
        const month = this.monthKey(this.reportMonth);
        document.getElementById('report-month-label').textContent = this.formatMonth(this.reportMonth);
        const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = membersSnap.val() || {};
        let totalMeals = 0, totalBazar = 0, totalExp = 0, rows = '';
        const mm = {};
        const mealsSnap = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-31').once('value');
        mealsSnap.forEach(d => { Object.entries(d.val() || {}).forEach(([mid, ml]) => { if (!mm[mid]) mm[mid] = 0; mm[mid] += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0); }); });
        Object.entries(mm).forEach(([mid, t]) => { totalMeals += t; });
        Object.entries(members).forEach(([id, m]) => { rows += `<div class="report-row"><span>${m.name}</span><span>${mm[id] || 0} meals</span></div>`; });
        const bs = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        bs.forEach(s => { totalBazar += s.val().amount || 0; });
        const es = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        es.forEach(s => { totalExp += s.val().amount || 0; });
        const tc = totalBazar + totalExp, rate = totalMeals > 0 ? (tc / totalMeals).toFixed(2) : 0;
        let totalDep = 0;
        const ds = await db.ref(`messes/${this.messId}/deposits`).once('value');
        ds.forEach(s => { totalDep += s.val().amount || 0; });
        document.getElementById('monthly-report').innerHTML = `
            <div class="report-section"><h5>Meals</h5>${rows || '<p>No data</p>'}<div class="report-row report-total"><span>Total</span><span>${totalMeals}</span></div></div>
            <div class="report-section"><h5>Finance</h5>
            <div class="report-row"><span>Bazaar</span><span>৳${totalBazar}</span></div><div class="report-row"><span>Expenses</span><span>৳${totalExp}</span></div>
            <div class="report-row report-total"><span>Total Cost</span><span>৳${tc}</span></div><div class="report-row"><span>Deposits</span><span>৳${totalDep}</span></div>
            <div class="report-row"><span>Balance</span><span>৳${totalDep - tc}</span></div></div>
            <div class="report-section"><h5>Rate</h5><div class="report-row report-total"><span>Per meal</span><span>৳${rate}</span></div></div>`;
    },

    exportDailyPDF() {
        const { jsPDF } = window.jspdf; const doc = new jsPDF();
        doc.setFontSize(16); doc.text('Mess Manager - Daily Report', 20, 20);
        doc.setFontSize(10); doc.text(`Date: ${this.formatDate(this.reportDate)}`, 20, 30);
        doc.text(document.getElementById('daily-report').innerText, 20, 42);
        doc.save(`mess-daily-${this.dateKey(this.reportDate)}.pdf`); this.toast('PDF exported', 'success');
    },

    exportMonthlyPDF() {
        const { jsPDF } = window.jspdf; const doc = new jsPDF();
        doc.setFontSize(16); doc.text('Mess Manager - Monthly Report', 20, 20);
        doc.setFontSize(10); doc.text(`Month: ${this.formatMonth(this.reportMonth)}`, 20, 30);
        doc.text(document.getElementById('monthly-report').innerText, 20, 42);
        doc.save(`mess-monthly-${this.monthKey(this.reportMonth)}.pdf`); this.toast('PDF exported', 'success');
    },

    // HELPERS
    dateKey(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; },
    monthKey(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; },
    formatDate(d) { return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }); },
    formatMonth(d) { return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }); },
    timeAgo(ts) { if (!ts) return ''; const d = Date.now() - ts, m = Math.floor(d / 60000); if (m < 1) return 'now'; if (m < 60) return m + 'm'; const h = Math.floor(m / 60); if (h < 24) return h + 'h'; const dy = Math.floor(h / 24); return dy < 7 ? dy + 'd' : new Date(ts).toLocaleDateString(); },
    esc(s) { return s ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : ''; },
    openModal() { document.getElementById('modal-overlay').classList.add('active'); },
    closeModal() { document.getElementById('modal-overlay').classList.remove('active'); },
    toast(msg, type = 'info') { const c = document.getElementById('toast-container'); const t = document.createElement('div'); t.className = `toast ${type}`; t.textContent = msg; c.appendChild(t); setTimeout(() => t.remove(), 3500); }
};

document.addEventListener('DOMContentLoaded', () => App.init());
