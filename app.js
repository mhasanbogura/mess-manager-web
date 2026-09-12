const App = {
    currentUser: null,
    currentPage: 'dashboard',
    messId: null,
    selectedDate: new Date(),
    reportDate: new Date(),
    reportMonth: new Date(),
    mealDate: new Date(),
    bazarDate: new Date(),
    expenseMonth: new Date(),

    init() {
        // Check if Firebase config is set
        if (firebaseConfig.apiKey === 'YOUR_API_KEY_HERE') {
            document.getElementById('auth-screen').classList.add('active');
            document.querySelector('.auth-container').innerHTML = `
                <div class="auth-header">
                    <div class="auth-logo"><span class="material-icons-round">warning</span></div>
                    <h1>Firebase Setup Required</h1>
                    <p style="margin-top:12px;line-height:1.6">
                        Open <code>firebase-config.js</code> and replace the placeholder values<br>
                        with your Firebase project config.
                    </p>
                    <div style="background:white;color:#333;border-radius:12px;padding:20px;margin-top:20px;text-align:left;font-size:13px;line-height:1.8">
                        <strong>Steps:</strong><br>
                        1. Go to <a href="https://console.firebase.google.com" target="_blank">Firebase Console</a><br>
                        2. Create or select a project<br>
                        3. Go to Project Settings > General > Your apps<br>
                        4. Add a Web App and copy the config<br>
                        5. Enable Authentication > Email/Password + Google<br>
                        6. Enable Realtime Database (test mode)<br>
                        7. Paste config in <code>firebase-config.js</code>
                    </div>
                </div>`;
            return;
        }

        this.bindEvents();
        auth.onAuthStateChanged(user => {
            if (user) {
                this.currentUser = user;
                this.messId = user.uid;
                this.showApp();
                this.loadDashboard();
            } else {
                this.showAuth();
            }
        });
    },

    bindEvents() {
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab + '-form').classList.add('active');
            });
        });

        document.getElementById('login-form').addEventListener('submit', e => {
            e.preventDefault();
            this.login();
        });

        document.getElementById('register-form').addEventListener('submit', e => {
            e.preventDefault();
            this.register();
        });

        document.getElementById('google-login').addEventListener('click', () => this.googleLogin());
        document.getElementById('forgot-password').addEventListener('click', () => this.forgotPassword());
        document.getElementById('logout-btn').addEventListener('click', e => { e.preventDefault(); this.logout(); });

        document.getElementById('menu-toggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebar-overlay').addEventListener('click', () => this.closeSidebar());

        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                this.navigate(item.dataset.page);
            });
        });

        document.getElementById('user-avatar').addEventListener('click', () => this.navigate('settings'));

        document.getElementById('add-member-btn').addEventListener('click', () => this.showMemberModal());
        document.getElementById('add-meal-btn').addEventListener('click', () => this.showMealModal());
        document.getElementById('add-bazar-btn').addEventListener('click', () => this.showBazarModal());
        document.getElementById('add-expense-btn').addEventListener('click', () => this.showExpenseModal());
        document.getElementById('add-deposit-btn').addEventListener('click', () => this.showDepositModal());
        document.getElementById('add-notice-btn').addEventListener('click', () => this.showNoticeModal());

        document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('modal-overlay').addEventListener('click', e => {
            if (e.target === e.currentTarget) this.closeModal();
        });

        document.getElementById('save-profile-btn').addEventListener('click', () => this.saveProfile());
        document.getElementById('change-pass-btn').addEventListener('click', () => this.changePassword());
        document.getElementById('save-mess-btn').addEventListener('click', () => this.saveMessSettings());
        document.getElementById('export-data-btn').addEventListener('click', () => this.exportData());
        document.getElementById('delete-account-btn').addEventListener('click', () => this.deleteAccount());

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

    showAuth() {
        document.getElementById('auth-screen').classList.add('active');
        document.getElementById('app-screen').classList.remove('active');
    },

    showApp() {
        document.getElementById('auth-screen').classList.remove('active');
        document.getElementById('app-screen').classList.add('active');
        document.getElementById('sidebar-name').textContent = this.currentUser.displayName || 'User';
        document.getElementById('sidebar-email').textContent = this.currentUser.email || '';
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
        document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
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
            reports: () => { this.loadDailyReport(); this.loadMonthlyReport(); },
            settings: () => this.loadSettings()
        };
        if (loaders[page]) loaders[page]();
    },

    // AUTH
    async login() {
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value;
        if (!email || !pass) { this.toast('Please fill in all fields', 'error'); return; }

        const btn = document.querySelector('#login-form .btn-primary');
        const origText = btn.textContent;
        btn.textContent = 'Logging in...';
        btn.disabled = true;

        try {
            await auth.signInWithEmailAndPassword(email, pass);
            this.toast('Login successful!', 'success');
        } catch (e) {
            console.error('Login error:', e);
            let msg = e.message;
            if (e.code === 'auth/user-not-found') msg = 'No account found with this email';
            else if (e.code === 'auth/wrong-password') msg = 'Incorrect password';
            else if (e.code === 'auth/invalid-email') msg = 'Invalid email address';
            else if (e.code === 'auth/too-many-requests') msg = 'Too many attempts. Try again later';
            else if (e.code === 'auth/invalid-credential') msg = 'Invalid email or password';
            this.toast(msg, 'error');
        } finally {
            btn.textContent = origText;
            btn.disabled = false;
        }
    },

    async register() {
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const pass = document.getElementById('reg-password').value;

        if (!name || !email || !phone || !pass) { this.toast('Please fill in all fields', 'error'); return; }
        if (pass.length < 6) { this.toast('Password must be at least 6 characters', 'error'); return; }

        const btn = document.querySelector('#register-form .btn-primary');
        const origText = btn.textContent;
        btn.textContent = 'Creating account...';
        btn.disabled = true;

        try {
            const cred = await auth.createUserWithEmailAndPassword(email, pass);
            await cred.user.updateProfile({ displayName: name });

            // Create user profile in database
            await db.ref(`users/${cred.user.uid}`).set({
                name, email, phone, role: 'admin',
                createdAt: Date.now()
            });

            // Also create initial mess data
            await db.ref(`messes/${cred.user.uid}/settings`).set({
                messName: name + "'s Mess",
                createdAt: Date.now()
            });

            this.toast('Account created successfully!', 'success');
        } catch (e) {
            console.error('Register error:', e);
            let msg = e.message;
            if (e.code === 'auth/email-already-in-use') msg = 'This email is already registered. Try logging in.';
            else if (e.code === 'auth/invalid-email') msg = 'Invalid email address';
            else if (e.code === 'auth/weak-password') msg = 'Password is too weak. Use at least 6 characters.';
            this.toast(msg, 'error');
        } finally {
            btn.textContent = origText;
            btn.disabled = false;
        }
    },

    async googleLogin() {
        const btn = document.getElementById('google-login');
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<span class="material-icons-round" style="animation:spin 1s linear infinite">refresh</span> Connecting...';
        btn.disabled = true;

        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const cred = await auth.signInWithPopup(provider);

            // Save user profile
            const userRef = db.ref(`users/${cred.user.uid}`);
            const snap = await userRef.once('value');
            if (!snap.exists()) {
                await userRef.set({
                    name: cred.user.displayName, email: cred.user.email,
                    role: 'admin', createdAt: Date.now()
                });
                await db.ref(`messes/${cred.user.uid}/settings`).set({
                    messName: (cred.user.displayName || 'My') + "'s Mess",
                    createdAt: Date.now()
                });
            }

            this.toast('Google login successful!', 'success');
        } catch (e) {
            console.error('Google login error:', e);
            let msg = e.message;
            if (e.code === 'auth/popup-closed-by-user') msg = 'Login cancelled. Try again.';
            else if (e.code === 'auth/popup-blocked') msg = 'Popup blocked. Allow popups for this site.';
            else if (e.code === 'auth/network-request-failed') msg = 'Network error. Check your connection.';
            this.toast(msg, 'error');
        } finally {
            btn.innerHTML = origHTML;
            btn.disabled = false;
        }
    },

    async forgotPassword() {
        const email = document.getElementById('login-email').value;
        if (!email) { this.toast('Enter your email first', 'error'); return; }
        try {
            await auth.sendPasswordResetEmail(email);
            this.toast('Password reset email sent', 'success');
        } catch (e) {
            this.toast(e.message, 'error');
        }
    },

    async logout() {
        await auth.signOut();
        this.toast('Logged out', 'info');
    },

    // DASHBOARD
    async loadDashboard() {
        if (!this.currentUser) return;
        const today = this.dateKey(new Date());
        const month = this.monthKey(new Date());

        const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = membersSnap.val() || {};
        document.getElementById('stat-members').textContent = Object.keys(members).length;

        const mealsSnap = await db.ref(`messes/${this.messId}/meals/${today}`).once('value');
        const meals = mealsSnap.val() || {};
        let todayMeals = 0;
        Object.values(meals).forEach(m => { todayMeals += (m.breakfast || 0) + (m.lunch || 0) + (m.dinner || 0); });
        document.getElementById('stat-today-meals').textContent = todayMeals;

        const bazarSnap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let monthBazar = 0;
        bazarSnap.forEach(s => { monthBazar += s.val().amount || 0; });
        document.getElementById('stat-month-bazar').textContent = '৳' + monthBazar;

        const expSnap = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let monthExp = 0;
        expSnap.forEach(s => { monthExp += s.val().amount || 0; });
        document.getElementById('stat-month-expense').textContent = '৳' + monthExp;

        const activitySnap = await db.ref(`messes/${this.messId}/activity`).orderByChild('ts').limitToLast(10).once('value');
        const actDiv = document.getElementById('recent-activity');
        if (activitySnap.exists()) {
            let html = '';
            activitySnap.forEach(s => {
                const a = s.val();
                html += `<div class="item-card"><div class="item-card-header"><h4>${this.escapeHtml(a.text || '')}</h4></div><div class="item-card-details"><span>${this.timeAgo(a.ts)}</span></div></div>`;
            });
            actDiv.innerHTML = html;
        } else {
            actDiv.innerHTML = '<p class="empty-state">No recent activity</p>';
        }
    },

    // MEMBERS
    async loadMembers() {
        const snap = await db.ref(`messes/${this.messId}/members`).once('value');
        const div = document.getElementById('members-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state">No members yet. Add your first member!</p>'; return; }
        let html = '';
        snap.forEach(s => {
            const m = s.val();
            const initials = (m.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            html += `<div class="member-item">
                <div class="member-avatar">${initials}</div>
                <div class="member-info"><h4>${this.escapeHtml(m.name || '')}</h4><p>${this.escapeHtml(m.phone || m.email || '')}</p></div>
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
            <div class="form-group"><label>Name</label><input id="m-name" value="${data?.name || ''}" placeholder="Member name"></div>
            <div class="form-group"><label>Phone</label><input id="m-phone" value="${data?.phone || ''}" placeholder="Phone number"></div>
            <div class="form-group"><label>Email (optional)</label><input id="m-email" value="${data?.email || ''}" placeholder="Email"></div>
            <div class="form-group"><label>Role</label><select id="m-role">
                <option value="member" ${data?.role === 'member' || !data ? 'selected' : ''}>Member</option>
                <option value="admin" ${data?.role === 'admin' ? 'selected' : ''}>Admin</option>
                <option value="cook" ${data?.role === 'cook' ? 'selected' : ''}>Cook</option>
            </select></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveMember('${id || ''}')">${id ? 'Update' : 'Add'}</button>`;
        this.openModal();
    },

    async saveMember(id) {
        const data = {
            name: document.getElementById('m-name').value.trim(),
            phone: document.getElementById('m-phone').value.trim(),
            email: document.getElementById('m-email').value.trim(),
            role: document.getElementById('m-role').value,
            updatedAt: Date.now()
        };
        if (!data.name) { this.toast('Name is required', 'error'); return; }
        try {
            if (id) {
                await db.ref(`messes/${this.messId}/members/${id}`).update(data);
            } else {
                data.createdAt = Date.now();
                await db.ref(`messes/${this.messId}/members`).push(data);
            }
            this.closeModal();
            this.loadMembers();
            this.toast('Member saved', 'success');
            this.logActivity(`Member ${id ? 'updated' : 'added'}: ${data.name}`);
        } catch (e) { this.toast(e.message, 'error'); }
    },

    async editMember(id) {
        const snap = await db.ref(`messes/${this.messId}/members/${id}`).once('value');
        this.showMemberModal(id, snap.val());
    },

    async deleteMember(id) {
        if (!confirm('Delete this member?')) return;
        await db.ref(`messes/${this.messId}/members/${id}`).remove();
        this.loadMembers();
        this.toast('Member deleted', 'success');
    },

    // MEALS
    async loadMeals() {
        const key = this.dateKey(this.mealDate);
        document.getElementById('meal-date-label').textContent = this.formatDate(this.mealDate);

        const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = membersSnap.val() || {};

        const mealsSnap = await db.ref(`messes/${this.messId}/meals/${key}`).once('value');
        const meals = mealsSnap.val() || {};

        const div = document.getElementById('meals-list');
        const memberIds = Object.keys(members);
        if (memberIds.length === 0) { div.innerHTML = '<p class="empty-state">Add members first</p>'; return; }

        let html = '';
        let totalToday = 0;
        memberIds.forEach(mid => {
            const m = members[mid];
            const ml = meals[mid] || {};
            const total = (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0);
            totalToday += total;
            html += `<div class="item-card">
                <div class="item-card-header"><h4>${this.escapeHtml(m.name)}</h4><span class="amount">${total} meals</span></div>
                <div class="item-card-details">
                    <span>B: ${ml.breakfast || 0}</span><span>L: ${ml.lunch || 0}</span><span>D: ${ml.dinner || 0}</span>
                </div>
                <div class="item-card-actions">
                    <button class="icon-btn" onclick="App.editMeal('${mid}','${key}')"><span class="material-icons-round">edit</span></button>
                </div>
            </div>`;
        });
        div.innerHTML = html;
        document.getElementById('meal-total-today').textContent = totalToday;

        const month = this.monthKey(this.mealDate);
        let totalMonth = 0;
        const monthMeals = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-31').once('value');
        monthMeals.forEach(daySnap => {
            Object.values(daySnap.val() || {}).forEach(ml => {
                totalMonth += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0);
            });
        });
        document.getElementById('meal-total-month').textContent = totalMonth;
    },

    showMealModal(memberId = null, dateKey = null, data = null) {
        const title = data ? 'Edit Meal' : 'Add Meal';
        document.getElementById('modal-title').textContent = title;

        db.ref(`messes/${this.messId}/members`).once('value').then(snap => {
            const members = snap.val() || {};
            let options = '<option value="">Select Member</option>';
            Object.entries(members).forEach(([id, m]) => {
                options += `<option value="${id}" ${id === memberId ? 'selected' : ''}>${m.name}</option>`;
            });

            document.getElementById('modal-body').innerHTML = `
                <div class="form-group"><label>Member</label><select id="ml-member">${options}</select></div>
                <div class="form-group"><label>Breakfast</label><input type="number" id="ml-breakfast" min="0" value="${data?.breakfast || 0}"></div>
                <div class="form-group"><label>Lunch</label><input type="number" id="ml-lunch" min="0" value="${data?.lunch || 0}"></div>
                <div class="form-group"><label>Dinner</label><input type="number" id="ml-dinner" min="0" value="${data?.dinner || 0}"></div>`;
            document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveMeal('${dateKey || this.dateKey(this.mealDate)}')">Save</button>`;
            this.openModal();
        });
    },

    async saveMeal(dateKey, existingMemberId = null) {
        const memberId = document.getElementById('ml-member').value;
        if (!memberId) { this.toast('Select a member', 'error'); return; }
        const data = {
            breakfast: parseInt(document.getElementById('ml-breakfast').value) || 0,
            lunch: parseInt(document.getElementById('ml-lunch').value) || 0,
            dinner: parseInt(document.getElementById('ml-dinner').value) || 0,
            updatedAt: Date.now()
        };
        await db.ref(`messes/${this.messId}/meals/${dateKey}/${memberId}`).update(data);
        this.closeModal();
        this.loadMeals();
        this.toast('Meal saved', 'success');
    },

    async editMeal(memberId, dateKey) {
        const snap = await db.ref(`messes/${this.messId}/meals/${dateKey}/${memberId}`).once('value');
        this.showMealModal(memberId, dateKey, snap.val());
    },

    // BAZAAR
    async loadBazaar() {
        const key = this.dateKey(this.bazarDate);
        document.getElementById('bazar-date-label').textContent = this.formatDate(this.bazarDate);

        const snap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').equalTo(key).once('value');
        const div = document.getElementById('bazar-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state">No bazaar items for this day</p>'; document.getElementById('bazar-total-today').textContent = '৳0'; return; }

        let total = 0;
        let html = '';
        snap.forEach(s => {
            const b = s.val();
            total += b.amount || 0;
            html += `<div class="item-card">
                <div class="item-card-header"><h4>${this.escapeHtml(b.item || '')}</h4><span class="amount">৳${b.amount || 0}</span></div>
                <div class="item-card-details"><span>Qty: ${b.quantity || '-'}</span><span>Buyer: ${this.escapeHtml(b.buyer || '')}</span></div>
                <div class="item-card-actions">
                    <button class="icon-btn" onclick="App.editBazar('${s.key}')"><span class="material-icons-round">edit</span></button>
                    <button class="icon-btn" onclick="App.deleteBazar('${s.key}')"><span class="material-icons-round">delete</span></button>
                </div>
            </div>`;
        });
        div.innerHTML = html;
        document.getElementById('bazar-total-today').textContent = '৳' + total;

        const month = this.monthKey(this.bazarDate);
        const monthSnap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let monthTotal = 0;
        monthSnap.forEach(s => { monthTotal += s.val().amount || 0; });
        document.getElementById('bazar-total-month').textContent = '৳' + monthTotal;
    },

    showBazarModal(id = null, data = null) {
        document.getElementById('modal-title').textContent = id ? 'Edit Bazaar' : 'Add Bazaar Item';
        document.getElementById('modal-body').innerHTML = `
            <div class="form-group"><label>Item Name</label><input id="bz-item" value="${data?.item || ''}" placeholder="e.g. Rice, Oil"></div>
            <div class="form-group"><label>Amount (৳)</label><input type="number" id="bz-amount" min="0" value="${data?.amount || ''}" placeholder="0"></div>
            <div class="form-group"><label>Quantity</label><input id="bz-qty" value="${data?.quantity || ''}" placeholder="e.g. 5 kg"></div>
            <div class="form-group"><label>Buyer</label><input id="bz-buyer" value="${data?.buyer || ''}" placeholder="Who bought it"></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveBazar('${id || ''}')">${id ? 'Update' : 'Add'}</button>`;
        this.openModal();
    },

    async saveBazar(id) {
        const data = {
            item: document.getElementById('bz-item').value.trim(),
            amount: parseFloat(document.getElementById('bz-amount').value) || 0,
            quantity: document.getElementById('bz-qty').value.trim(),
            buyer: document.getElementById('bz-buyer').value.trim(),
            dateKey: this.dateKey(this.bazarDate),
            date: this.bazarDate.toISOString(),
            updatedAt: Date.now()
        };
        if (!data.item) { this.toast('Item name required', 'error'); return; }
        if (id) {
            await db.ref(`messes/${this.messId}/bazaar/${id}`).update(data);
        } else {
            data.createdAt = Date.now();
            await db.ref(`messes/${this.messId}/bazaar`).push(data);
        }
        this.closeModal();
        this.loadBazaar();
        this.toast('Bazaar saved', 'success');
        this.logActivity(`Bazaar: ${data.item} - ৳${data.amount}`);
    },

    async editBazar(id) {
        const snap = await db.ref(`messes/${this.messId}/bazaar/${id}`).once('value');
        this.showBazarModal(id, snap.val());
    },

    async deleteBazar(id) {
        if (!confirm('Delete this item?')) return;
        await db.ref(`messes/${this.messId}/bazaar/${id}`).remove();
        this.loadBazaar();
        this.toast('Deleted', 'success');
    },

    // EXPENSES
    async loadExpenses() {
        const month = this.monthKey(this.expenseMonth);
        document.getElementById('expense-month-label').textContent = this.formatMonth(this.expenseMonth);

        const snap = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        const div = document.getElementById('expenses-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state">No expenses this month</p>'; document.getElementById('expense-total-month').textContent = '৳0'; return; }

        let total = 0;
        let html = '';
        snap.forEach(s => {
            const e = s.val();
            total += e.amount || 0;
            html += `<div class="item-card">
                <div class="item-card-header"><h4>${this.escapeHtml(e.category || '')} - ${this.escapeHtml(e.description || '')}</h4><span class="amount">৳${e.amount || 0}</span></div>
                <div class="item-card-details"><span>${this.formatDate(new Date(e.date))}</span><span>By: ${this.escapeHtml(e.paidBy || '')}</span></div>
                <div class="item-card-actions">
                    <button class="icon-btn" onclick="App.editExpense('${s.key}')"><span class="material-icons-round">edit</span></button>
                    <button class="icon-btn" onclick="App.deleteExpense('${s.key}')"><span class="material-icons-round">delete</span></button>
                </div>
            </div>`;
        });
        div.innerHTML = html;
        document.getElementById('expense-total-month').textContent = '৳' + total;
    },

    showExpenseModal(id = null, data = null) {
        document.getElementById('modal-title').textContent = id ? 'Edit Expense' : 'Add Expense';
        document.getElementById('modal-body').innerHTML = `
            <div class="form-group"><label>Category</label><select id="ex-category">
                <option value="Food" ${data?.category === 'Food' ? 'selected' : ''}>Food</option>
                <option value="Utility" ${data?.category === 'Utility' ? 'selected' : ''}>Utility (Gas/Electric)</option>
                <option value="Rent" ${data?.category === 'Rent' ? 'selected' : ''}>Rent</option>
                <option value="Salary" ${data?.category === 'Salary' ? 'selected' : ''}>Salary (Cook/Staff)</option>
                <option value="Maintenance" ${data?.category === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                <option value="Other" ${data?.category === 'Other' ? 'selected' : ''}>Other</option>
            </select></div>
            <div class="form-group"><label>Description</label><input id="ex-desc" value="${data?.description || ''}" placeholder="Expense details"></div>
            <div class="form-group"><label>Amount (৳)</label><input type="number" id="ex-amount" min="0" value="${data?.amount || ''}" placeholder="0"></div>
            <div class="form-group"><label>Paid By</label><input id="ex-paidby" value="${data?.paidBy || ''}" placeholder="Who paid"></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveExpense('${id || ''}')">${id ? 'Update' : 'Add'}</button>`;
        this.openModal();
    },

    async saveExpense(id) {
        const data = {
            category: document.getElementById('ex-category').value,
            description: document.getElementById('ex-desc').value.trim(),
            amount: parseFloat(document.getElementById('ex-amount').value) || 0,
            paidBy: document.getElementById('ex-paidby').value.trim(),
            dateKey: this.dateKey(new Date()),
            date: new Date().toISOString(),
            updatedAt: Date.now()
        };
        if (!data.amount) { this.toast('Amount required', 'error'); return; }
        if (id) {
            await db.ref(`messes/${this.messId}/expenses/${id}`).update(data);
        } else {
            data.createdAt = Date.now();
            await db.ref(`messes/${this.messId}/expenses`).push(data);
        }
        this.closeModal();
        this.loadExpenses();
        this.toast('Expense saved', 'success');
        this.logActivity(`Expense: ${data.category} - ৳${data.amount}`);
    },

    async editExpense(id) {
        const snap = await db.ref(`messes/${this.messId}/expenses/${id}`).once('value');
        this.showExpenseModal(id, snap.val());
    },

    async deleteExpense(id) {
        if (!confirm('Delete this expense?')) return;
        await db.ref(`messes/${this.messId}/expenses/${id}`).remove();
        this.loadExpenses();
        this.toast('Deleted', 'success');
    },

    // BALANCE
    async loadBalance() {
        const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = membersSnap.val() || {};

        const depositsSnap = await db.ref(`messes/${this.messId}/deposits`).once('value');
        const deposits = depositsSnap.val() || {};

        const month = this.monthKey(new Date());
        const expSnap = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let totalExpense = 0;
        expSnap.forEach(s => { totalExpense += s.val().amount || 0; });

        const bazarSnap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        let totalBazar = 0;
        bazarSnap.forEach(s => { totalBazar += s.val().amount || 0; });

        let totalDeposit = 0;
        Object.values(deposits).forEach(d => { totalDeposit += d.amount || 0; });

        const totalCost = totalExpense + totalBazar;
        const remaining = totalDeposit - totalCost;

        document.getElementById('balance-income').textContent = '৳' + totalDeposit;
        document.getElementById('balance-expense').textContent = '৳' + totalCost;
        document.getElementById('balance-remaining').textContent = '৳' + remaining;

        let totalMeals = 0;
        const mealsSnap = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-31').once('value');
        mealsSnap.forEach(daySnap => {
            Object.values(daySnap.val() || {}).forEach(ml => {
                totalMeals += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0);
            });
        });

        const mealRate = totalMeals > 0 ? (totalCost / totalMeals).toFixed(2) : 0;
        document.getElementById('balance-rate').textContent = '৳' + mealRate;

        const div = document.getElementById('member-dues-list');
        const memberIds = Object.keys(members);
        if (memberIds.length === 0) { div.innerHTML = '<p class="empty-state">No members</p>'; return; }

        let html = '';
        memberIds.forEach(mid => {
            const m = members[mid];
            const memberDeposit = deposits[mid]?.amount || 0;
            const memberMeals = this.getMemberMonthMeals(mealsSnap, mid);
            const memberCost = (memberMeals * parseFloat(mealRate)).toFixed(2);
            const due = (memberDeposit - parseFloat(memberCost)).toFixed(2);

            html += `<div class="due-item">
                <div class="due-info"><h4>${this.escapeHtml(m.name)}</h4><p>${memberMeals} meals | Deposit: ৳${memberDeposit}</p></div>
                <div class="due-amount ${parseFloat(due) >= 0 ? 'positive' : 'negative'}">৳${due}</div>
            </div>`;
        });
        div.innerHTML = html;
    },

    getMemberMonthMeals(mealsSnap, memberId) {
        let total = 0;
        mealsSnap.forEach(daySnap => {
            const ml = (daySnap.val() || {})[memberId] || {};
            total += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0);
        });
        return total;
    },

    showDepositModal() {
        document.getElementById('modal-title').textContent = 'Record Deposit';
        db.ref(`messes/${this.messId}/members`).once('value').then(snap => {
            const members = snap.val() || {};
            let options = '<option value="">Select Member</option>';
            Object.entries(members).forEach(([id, m]) => {
                options += `<option value="${id}">${m.name}</option>`;
            });
            document.getElementById('modal-body').innerHTML = `
                <div class="form-group"><label>Member</label><select id="dp-member">${options}</select></div>
                <div class="form-group"><label>Amount (৳)</label><input type="number" id="dp-amount" min="0" placeholder="0"></div>
                <div class="form-group"><label>Note</label><input id="dp-note" placeholder="Optional note"></div>`;
            document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveDeposit()">Save</button>`;
            this.openModal();
        });
    },

    async saveDeposit() {
        const memberId = document.getElementById('dp-member').value;
        const amount = parseFloat(document.getElementById('dp-amount').value) || 0;
        const note = document.getElementById('dp-note').value.trim();
        if (!memberId || !amount) { this.toast('Select member and amount', 'error'); return; }

        const existingSnap = await db.ref(`messes/${this.messId}/deposits/${memberId}`).once('value');
        const existing = existingSnap.val()?.amount || 0;

        await db.ref(`messes/${this.messId}/deposits/${memberId}`).set({
            amount: existing + amount,
            note, updatedAt: Date.now()
        });

        await db.ref(`messes/${this.messId}/deposits/${memberId}/history`).push({
            amount, note, date: Date.now()
        });

        this.closeModal();
        this.loadBalance();
        this.toast('Deposit recorded', 'success');
        this.logActivity(`Deposit: ৳${amount} by member`);
    },

    // NOTICES
    async loadNotices() {
        const snap = await db.ref(`messes/${this.messId}/notices`).orderByChild('createdAt').limitToLast(50).once('value');
        const div = document.getElementById('notices-list');
        if (!snap.exists()) { div.innerHTML = '<p class="empty-state">No notices posted</p>'; return; }

        let html = '';
        const arr = [];
        snap.forEach(s => { arr.unshift({ key: s.key, ...s.val() }); });
        arr.forEach(n => {
            html += `<div class="notice-item">
                <h4>${this.escapeHtml(n.title || '')}</h4>
                <p>${this.escapeHtml(n.body || '')}</p>
                <div class="notice-meta"><span>By: ${this.escapeHtml(n.author || 'Admin')}</span><span>${this.timeAgo(n.createdAt)}</span></div>
                <div class="item-card-actions">
                    <button class="icon-btn" onclick="App.deleteNotice('${n.key}')"><span class="material-icons-round">delete</span></button>
                </div>
            </div>`;
        });
        div.innerHTML = html;
    },

    showNoticeModal() {
        document.getElementById('modal-title').textContent = 'Post Notice';
        document.getElementById('modal-body').innerHTML = `
            <div class="form-group"><label>Title</label><input id="nt-title" placeholder="Notice title"></div>
            <div class="form-group"><label>Message</label><textarea id="nt-body" placeholder="Write your notice..."></textarea></div>`;
        document.getElementById('modal-footer').innerHTML = `<button class="btn-primary" onclick="App.saveNotice()">Post</button>`;
        this.openModal();
    },

    async saveNotice() {
        const title = document.getElementById('nt-title').value.trim();
        const body = document.getElementById('nt-body').value.trim();
        if (!title) { this.toast('Title required', 'error'); return; }
        await db.ref(`messes/${this.messId}/notices`).push({
            title, body, author: this.currentUser.displayName || 'Admin',
            createdAt: Date.now()
        });
        this.closeModal();
        this.loadNotices();
        this.toast('Notice posted', 'success');
        this.logActivity(`Notice posted: ${title}`);
    },

    async deleteNotice(id) {
        if (!confirm('Delete this notice?')) return;
        await db.ref(`messes/${this.messId}/notices/${id}`).remove();
        this.loadNotices();
        this.toast('Deleted', 'success');
    },

    // REPORTS
    async loadDailyReport() {
        const key = this.dateKey(this.reportDate);
        document.getElementById('report-date-label').textContent = this.formatDate(this.reportDate);

        const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = membersSnap.val() || {};
        const mealsSnap = await db.ref(`messes/${this.messId}/meals/${key}`).once('value');
        const meals = mealsSnap.val() || {};
        const bazarSnap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').equalTo(key).once('value');

        let totalMeals = 0, totalBazar = 0;
        let memberRows = '';
        Object.entries(members).forEach(([id, m]) => {
            const ml = meals[id] || {};
            const t = (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0);
            totalMeals += t;
            memberRows += `<div class="report-row"><span>${m.name}</span><span>${t} meals (B:${ml.breakfast || 0} L:${ml.lunch || 0} D:${ml.dinner || 0})</span></div>`;
        });
        bazarSnap.forEach(s => { totalBazar += s.val().amount || 0; });

        document.getElementById('daily-report').innerHTML = `
            <div class="report-section"><h5>Meals</h5>${memberRows || '<p>No meals</p>'}
            <div class="report-row report-total"><span>Total Meals</span><span>${totalMeals}</span></div></div>
            <div class="report-section"><h5>Bazaar</h5><div class="report-row"><span>Total Bazaar</span><span>৳${totalBazar}</span></div></div>
            ${totalMeals > 0 ? `<div class="report-section"><h5>Meal Rate</h5><div class="report-row"><span>Rate per meal</span><span>৳${(totalBazar / totalMeals).toFixed(2)}</span></div></div>` : ''}`;
    },

    async loadMonthlyReport() {
        const month = this.monthKey(this.reportMonth);
        document.getElementById('report-month-label').textContent = this.formatMonth(this.reportMonth);

        const membersSnap = await db.ref(`messes/${this.messId}/members`).once('value');
        const members = membersSnap.val() || {};

        let totalMeals = 0, totalBazar = 0, totalExpense = 0;
        let memberRows = '';
        const memberMeals = {};

        const mealsSnap = await db.ref(`messes/${this.messId}/meals`).orderByKey().startAt(month + '-01').endAt(month + '-31').once('value');
        mealsSnap.forEach(daySnap => {
            Object.entries(daySnap.val() || {}).forEach(([mid, ml]) => {
                if (!memberMeals[mid]) memberMeals[mid] = 0;
                memberMeals[mid] += (ml.breakfast || 0) + (ml.lunch || 0) + (ml.dinner || 0);
            });
        });
        Object.entries(memberMeals).forEach(([mid, t]) => { totalMeals += t; });

        Object.entries(members).forEach(([id, m]) => {
            memberRows += `<div class="report-row"><span>${m.name}</span><span>${memberMeals[id] || 0} meals</span></div>`;
        });

        const bazarSnap = await db.ref(`messes/${this.messId}/bazaar`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        bazarSnap.forEach(s => { totalBazar += s.val().amount || 0; });

        const expSnap = await db.ref(`messes/${this.messId}/expenses`).orderByChild('dateKey').startAt(month + '-01').endAt(month + '-31').once('value');
        expSnap.forEach(s => { totalExpense += s.val().amount || 0; });

        const totalCost = totalBazar + totalExpense;
        const rate = totalMeals > 0 ? (totalCost / totalMeals).toFixed(2) : 0;

        let depositRows = '';
        const depSnap = await db.ref(`messes/${this.messId}/deposits`).once('value');
        let totalDeposit = 0;
        depSnap.forEach(s => {
            const d = s.val();
            totalDeposit += d.amount || 0;
        });

        document.getElementById('monthly-report').innerHTML = `
            <div class="report-section"><h5>Meal Summary</h5>${memberRows || '<p>No data</p>'}
            <div class="report-row report-total"><span>Total Meals</span><span>${totalMeals}</span></div></div>
            <div class="report-section"><h5>Financial Summary</h5>
            <div class="report-row"><span>Total Bazaar</span><span>৳${totalBazar}</span></div>
            <div class="report-row"><span>Total Expense</span><span>৳${totalExpense}</span></div>
            <div class="report-row report-total"><span>Total Cost</span><span>৳${totalCost}</span></div>
            <div class="report-row"><span>Total Deposits</span><span>৳${totalDeposit}</span></div>
            <div class="report-row"><span>Balance</span><span>৳${totalDeposit - totalCost}</span></div></div>
            <div class="report-section"><h5>Meal Rate</h5>
            <div class="report-row report-total"><span>Rate per meal</span><span>৳${rate}</span></div></div>`;
    },

    exportDailyPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Mess Manager - Daily Report', 20, 20);
        doc.setFontSize(10);
        doc.text(`Date: ${this.formatDate(this.reportDate)}`, 20, 30);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 36);

        const content = document.getElementById('daily-report').innerText;
        const lines = doc.splitTextToSize(content, 170);
        doc.text(lines, 20, 48);
        doc.save(`mess-daily-report-${this.dateKey(this.reportDate)}.pdf`);
        this.toast('PDF exported', 'success');
    },

    exportMonthlyPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Mess Manager - Monthly Report', 20, 20);
        doc.setFontSize(10);
        doc.text(`Month: ${this.formatMonth(this.reportMonth)}`, 20, 30);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 36);

        const content = document.getElementById('monthly-report').innerText;
        const lines = doc.splitTextToSize(content, 170);
        doc.text(lines, 20, 48);
        doc.save(`mess-monthly-report-${this.monthKey(this.reportMonth)}.pdf`);
        this.toast('PDF exported', 'success');
    },

    // SETTINGS
    loadSettings() {
        document.getElementById('setting-name').value = this.currentUser.displayName || '';
        db.ref(`messes/${this.messId}/settings`).once('value').then(snap => {
            const s = snap.val() || {};
            document.getElementById('setting-mess-name').value = s.messName || '';
        });
    },

    async saveProfile() {
        const name = document.getElementById('setting-name').value.trim();
        if (!name) { this.toast('Name required', 'error'); return; }
        await this.currentUser.updateProfile({ displayName: name });
        await db.ref(`users/${this.currentUser.uid}/name`).set(name);
        document.getElementById('sidebar-name').textContent = name;
        this.toast('Profile updated', 'success');
    },

    async changePassword() {
        const pass = document.getElementById('setting-new-pass').value;
        if (!pass || pass.length < 6) { this.toast('Password must be at least 6 chars', 'error'); return; }
        await this.currentUser.updatePassword(pass);
        this.toast('Password updated', 'success');
    },

    async saveMessSettings() {
        const messName = document.getElementById('setting-mess-name').value.trim();
        await db.ref(`messes/${this.messId}/settings`).set({ messName, updatedAt: Date.now() });
        this.toast('Mess settings saved', 'success');
    },

    async exportData() {
        const data = {};
        const snap = await db.ref(`messes/${this.messId}`).once('value');
        data.mess = snap.val();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mess-export-${this.dateKey(new Date())}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.toast('Data exported', 'success');
    },

    async deleteAccount() {
        if (!confirm('Are you sure? This will delete ALL your data permanently!')) return;
        if (!confirm('THIS CANNOT BE UNDONE. Type OK to confirm.')) return;
        await db.ref(`messes/${this.messId}`).remove();
        await db.ref(`users/${this.currentUser.uid}`).remove();
        await this.currentUser.delete();
        this.toast('Account deleted', 'success');
    },

    // HELPERS
    dateKey(d) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    monthKey(d) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    },

    formatDate(d) {
        return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    },

    formatMonth(d) {
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    },

    timeAgo(ts) {
        if (!ts) return '';
        const diff = Date.now() - ts;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(ts).toLocaleDateString();
    },

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },

    async logActivity(text) {
        await db.ref(`messes/${this.messId}/activity`).push({
            text, ts: Date.now(), user: this.currentUser.displayName || 'User'
        });
    },

    openModal() { document.getElementById('modal-overlay').classList.add('active'); },
    closeModal() { document.getElementById('modal-overlay').classList.remove('active'); },

    toast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
