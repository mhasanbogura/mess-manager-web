const App = {
    currentUser: null, messId: null, messCode: null, messName: null,
    currentPage: 'dashboard', userRole: 'member',
    _skipCache: new Set(),
    _cacheVersion: 0,

    // ── offline cache helpers ──────────────────────────────────
    _cacheSet(key, data) {
        try { localStorage.setItem('mc_' + this.messId + '_' + key, JSON.stringify(data)); } catch (e) {}
    },
    _cacheGet(key) {
        try { const v = localStorage.getItem('mc_' + this.messId + '_' + key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
    },
    _cacheSetGlobal(key, data) {
        try { localStorage.setItem('mcg_' + key, JSON.stringify(data)); } catch (e) {}
    },
    _cacheGetGlobal(key) {
        try { const v = localStorage.getItem('mcg_' + key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
    },
    _cacheClear(...keys) {
        this._cacheVersion++;
        keys.forEach(k => { try { localStorage.removeItem('mc_' + this.messId + '_' + k); } catch (e) {} });
    },
    _cacheClearAll() {
        this._cacheVersion++;
        const prefix = 'mc_' + this.messId + '_';
        try { for (let i = localStorage.length - 1; i >= 0; i--) { const k = localStorage.key(i); if (k && k.startsWith(prefix)) localStorage.removeItem(k); } } catch (e) {}
    },
    async _dbGet(path, cacheKey) {
        const forceFresh = cacheKey && this._skipCache.has(cacheKey);
        if (forceFresh && cacheKey) this._skipCache.delete(cacheKey);
        if (cacheKey && !forceFresh) {
            const cached = this._cacheGet(cacheKey);
            if (cached && Object.keys(cached).length) {
                if (navigator.onLine) this._dbBgRefresh(path, cacheKey);
                return cached;
            }
        }
        if (!navigator.onLine) return {};
        try {
            const snap = await Promise.race([
                db.ref(path).once('value'),
                new Promise((_, rej) => setTimeout(() => rej(new Error('fb-timeout')), 5000))
            ]);
            const data = snap.val() || {};
            if (cacheKey) this._cacheSet(cacheKey, data);
            return data;
        } catch (e) {
            return {};
        }
    },
    _toEnDigits(s) {
        return s.replace(/[\u09E6-\u09EF]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
    },
    async _dbBgRefresh(path, cacheKey) {
        const ver = this._cacheVersion;
        try {
            const snap = await db.ref(path).once('value');
            if (this._cacheVersion !== ver) return;
            this._cacheSet(cacheKey, snap.val() || {});
        } catch (e) {}
    },
    async _dbRef(query) {
        try {
            const snap = await Promise.race([
                query.once('value'),
                new Promise((_, rej) => setTimeout(() => rej(new Error('fb-timeout')), 5000))
            ]);
            return snap;
        } catch (e) { return { val: () => null, exists: () => false }; }
    },

    // ── i18n ───────────────────────────────────────────────────
    _translations: {
        // Nav
        nav_dashboard:'Dashboard',nav_mess:'Mess',nav_expense:'Expense',nav_meal:'Meal',nav_money:'Money',nav_profile:'Profile',
        // Dashboard
        dash_greet_morning:'Good morning',dash_greet_afternoon:'Good afternoon',dash_greet_evening:'Good evening',
        dash_share:'Share Mess ID',dash_manager:'Manager',dash_current_month:'Current month',dash_notice:'Notice Board',
        dash_notice_preview:'Pin a notice for the whole house',dash_today:'Today is',dash_breakfast:'Breakfast',dash_lunch:'Lunch',dash_dinner:'Dinner',
        dash_meal:'Meal',dash_deposit:'Deposit',dash_balance:'Balance',dash_expense_per_meal:'Expense per meal',
        dash_utility:'Utility',dash_expense_per_utility:'Expense per utility',dash_analyse:'Analyse',
        dash_meal_summary:'Meal Summary',dash_util_others:'Utility & Others',
        dash_table_name:'Name',dash_table_total:'Total',dash_table_expense:'Expense(৳)',dash_table_deposit:'Deposit(৳)',dash_table_balance:'Balance(৳)',
        dash_table_rent:'Rent(৳)',dash_table_util_others:'Utility & Others(৳)',
        dash_no_data:'No data',
        // Expense Today
        dt_title:'Expense Today',dt_banner:'Expense today',dt_nobody:'Nobody assigned',
        dt_unassigned:'Unassigned dates',dt_all_assigned:'All dates assigned',dt_day:'day(s)',
        dt_no_dates:'No dates yet — tap edit to assign',dt_no_members:'No members',
        // Mess Management
        mm_title:'Mess Management',mm_leave:'Leave',mm_my_mess:'My Mess',mm_mess_id:'Mess ID',
        mm_tab_members:'Members',mm_tab_peoples:'Peoples',mm_tab_perms:'Permissions',
        mm_members_info:'Members are the names your meals, cost and balances are counted against. Add everyone who eats in this mess — they do not need the app.',
        mm_add_member:'Add Member',mm_add:'ADD',mm_add_hint:'Unique name; letters, numbers & spaces only (e.g. Ziad1, Ziad2)',
        mm_total:'Total Mess Members',mm_no_members:'No members yet',
        mm_peoples_info:'Peoples have the app and have joined this mess. Joining does not put anyone on the meal list — add them under Members for that.',
        mm_no_peoples:'No peoples have joined yet',mm_role_manager:'Manager',mm_role_you:'You',
        mm_perms_info:'What each People is allowed to do — add meals, add cost, manage the lists. Only Peoples appear here: a member who has never opened the app has nothing to grant.',
        mm_perms_manager_note:'The manager always has every permission, whether these are checked or not.',
        mm_perm_add_expense:'Add Expense',mm_perm_add_meal:'Add Meal',mm_perm_edit_meal:'Edit Meal',
        mm_perm_manage_perms:'Manage Permissions',mm_perm_manage_people:'Manage People & Members',
        mm_no_perms:'No peoples to set permissions for',
        // Meal Entry
        me_title:'Meal Entry',me_current_month:'Current Month:',me_view:'View',
        me_breakfast:'Breakfast',me_lunch:'Lunch',me_dinner:'Dinner',me_add:'Add',
        me_no_members:'No members',me_error:'Error loading',
        // Add Meal
        am_title:'Add Meal',am_select_date:'Select meal date',am_set_counts:'Set member meal counts',
        am_add_meal:'Add Meal',am_total:'Total:',am_breakfast:'Breakfast',am_lunch:'Lunch',am_dinner:'Dinner',
        am_no_members:'No members',
        // Meal Records
        mr_title:'Meal Records',mr_current_month:'Current Month:',mr_loading:'Loading...',
        mr_no_edits:'No meal edits this month',mr_removed_by:'Removed by:',mr_added_by:'Added by:',
        mr_meals:'meal(s)',mr_removed:'Removed',mr_added:'Added',mr_error:'Error loading',
        // Expense List
        el_title:'Expense List',el_current_month:'Current Month:',
        el_tab_meal:'Meal',el_tab_utility:'Utility & Others',el_add:'Add',
        el_no_items:'No cost items this month',el_item:'ITEM',el_money_from:'MONEY FROM',el_total:'TOTAL',
        el_divided_to:'MEMBER',el_each:'EACH',el_delete:'Delete',el_edit:'Edit',
        el_each_label:'each',el_members:'member(s)',
        // Money Management
        mm2_title:'Money Management',mm2_current_month:'Current Month:',
        mm2_tab_meal:'Meal',mm2_tab_utility:'Utility & Others',mm2_add:'Add',
        mm2_no_deposits:'No deposits this month',mm2_money_from:'MONEY FROM',mm2_amount:'AMOUNT',
        mm2_delete:'Delete',mm2_edit:'Edit',
        // Add Expense
        ae_title:'Add Expense',ae_tab_meal:'Meal',ae_tab_utility:'Utility & Others',
        ae_money_from:'Money from:',ae_manager:'Manager',ae_done_by:'Done by:',
        ae_item_name:'Item name',ae_expense:'Expense',ae_add_another:'Add another item',
        ae_hint:'Add each item on its own line. The Analysis page can then show which items cost you the most.',
        ae_type:'Type:',ae_rent:'Rent',ae_electricity:'Electricity',ae_wifi:'Wi-Fi',ae_others:'Others',
        ae_total_bill:'Total bill amount',ae_expense_from:'Expense from:',ae_divided_to:'Divided to:',
        ae_select_all:'Select all',ae_selected:'selected',ae_footer_hint:'total',
        // Add Deposit
        ad_title:'Add Deposit',ad_tab_meal:'Meal',ad_tab_utility:'Utility & Others',
        ad_money_from:'Money from:',ad_amount:'Enter Amount',
        // Deleted Expenses
        de_title:'Deleted Expenses',de_current_month:'Current Month:',de_loading:'Loading...',
        de_no_items:'No deleted costs this month',de_deleted_by:'Deleted by:',
        de_utility:'Utility & Others',de_meal:'Meal',
        de_expense:'Expense:',de_orig_added_by:'Originally added by:',de_error:'Error loading',
        // Deleted Transactions
        dt2_title:'Deleted Transactions',dt2_loading:'Loading...',
        dt2_no_items:'No deleted deposits this month',dt2_deleted_by:'Deleted by:',
        // Notice Board
        nb_title:'Notice Board',nb_empty:'The board is empty',nb_empty_desc:'Pin a notice and everyone in the house gets a notification.',
        nb_pin:'Pin a notice',nb_modal_title:'Pin a notice',nb_notice_label:'Notice for the whole house',
        nb_placeholder:'Write the notice here...',nb_pin_btn:'Pin',
        // Bazar Note
        bn_title:'Bazar Note',bn_anyone_can:'Anyone can add to the Bazar note',
        bn_anyone_go:'Anyone can go to the bazar with Bazar Mode — even without Bazar Entry permission',
        bn_draft:'Note down whatever the house needs, ready for the next time somebody goes shopping. It is a DRAFT — add and remove freely, because nothing here is counted or charged to anybody yet.',
        bn_bazar_mode:'When somebody starts Bazar Mode, this list goes with them. They fill in the prices as they buy — that works with no internet — and only at the end does any of it become real, on the Bazar list.',
        bn_placeholder:'What do we need?',bn_go_bazar:'Go to bazar',bn_empty_list:'Nothing on the list. Add whatever the house has run out of — anyone can.',
        // Menu Today
        mt_title:'Menu Today',mt_dinner_now:'Dinner now',mt_after_8pm:'after 8:00pm',mt_nothing_set:'Nothing set for now',
        mt_tab_upcoming:'Upcoming menus',mt_tab_items:'Items',mt_tab_special:'Special days',
        mt_add:'Add',mt_nothing_set_day:'Nothing set',mt_today:'Today',mt_items_shared:'Items shared across all menus',
        mt_no_items:'No items yet',mt_special_days:'Special menus for specific dates',mt_add_special:'Add special day',
        mt_coming_soon:'Menu history coming soon',
        // Analysis
        an_title:'Analysis',an_month:'Month',an_tab_meal:'Meal',an_tab_utility:'Utility',
        an_total_meals:'Total meals',an_meal_bazar:'Meal bazar',an_members:'Members',
        an_expense_per_meal:'Expense per meal',an_bazar:'Bazar',an_meals_label:'Meals',
        an_member_balances:'Member balances',an_credit_hint:'Green = in credit · Red = owes (deposit − meal cost)',
        an_expense_trend:'Expense per meal trend',an_vs_last_month:'vs last month',
        an_costlier:'costlier',an_cheaper:'cheaper',
        an_meal_share:'Meal share by member',an_who_ate:'Who ate how much of the',an_meals_count:'meals',
        an_bazar_by_day:'Bazar by day',an_spent_across:'spent across the month',
        an_meals_by_day:'Meals by day',an_meals_across:'meals across the month',
        an_top10_bazar:'Top 10 bazar items by cost',an_items:'items',
        an_total_utility:'Total utility',an_rent:'Rent',an_other_utility:'Other utility',
        an_util_balance:'Balance',an_collection:'Collection',an_spending:'Spending',
        an_util_credit_hint:'Green = in credit · Red = owes (utility deposit − cost share)',
        an_util_expense_trend:'Expense per utility trend',
        an_util_by_day:'Utility cost by day',an_util_across:'utility cost across the month',
        an_top10_util:'Top 10 utility items by cost',
        // Profile
        prof_title:'Profile & Settings',
        prof_general:'GENERAL SETTINGS',prof_device_theme:'Device Theme',prof_device_theme_desc:'Automatically switch theme based on system',
        prof_oled_theme:'Dark Theme',prof_oled_desc:'Use Dark backdrop for eye comfort',
        prof_language:'Language',prof_lang_desc:'Choose your preferred language',
        prof_account:'ACCOUNT',prof_logout:'Log out',prof_reset_pwd:'Reset password',prof_delete:'Delete account',
        prof_more:'MORE',prof_share:'Share',prof_about:'About App',prof_contact:'Contact Developer',
        prof_version:'Version 1.3.86 (build 280)',
        // Duty editor
        de_assign_dates:'Assign dates',de_yours:'yours',de_taken:'taken (tap to take over)',de_done:'Done',
        // Select Month
        sm_title:'Select Month',sm_ok:'OK',
        // View Settings
        vs_title:'View Settings',vs_select_rows:'Select which meal rows to show in the table:',
        // Edit Expense Modal
        eem_title:'Edit Expense',eem_item_name:'Item name',eem_money_from:'Money from',
        eem_date:'Date',eem_expense:'Expense (৳)',eem_cancel:'Cancel',eem_save:'Save',
        // Edit Deposit Modal
        edm_title:'Edit Deposit',edm_money_from:'Money from',edm_date:'Date',
        edm_amount:'Amount (৳)',edm_category:'Category',edm_meal:'Meal',edm_utility:'Utility',
        edm_cancel:'Cancel',edm_save:'Save',
        // Auth
        auth_title:'Mess Manager',auth_subtitle:'Manage your mess easily',
        auth_email_ph:'Email address',auth_pass_ph:'Password',auth_login:'Login',
        auth_forgot:'Forgot Password?',auth_create:'Create Account',auth_or:'or',
        auth_google:'Continue with Google',
        reg_title:'Create Account',reg_name_ph:'Full name',reg_email_ph:'Email address',
        reg_phone_ph:'Phone number',reg_pass_ph:'Password (min 6 chars)',reg_btn:'Create Account',
        reg_back:'Back to Login',
        fp_title:'Reset Password',fp_desc:'Enter your email to receive a reset link',
        fp_email_ph:'Your email address',fp_send:'Send Reset Link',fp_back:'Back to Login',
        // Mess Selector
        ms_title:'Your Messes',ms_subtitle:'Select a mess or create a new one',ms_no_mess:'No messes yet',
        ms_create_title:'Create New Mess',ms_name_ph:'Mess Name',ms_addr_ph:'Address (optional)',
        ms_create_btn:'Create Mess',ms_join_title:'Join Existing Mess',ms_code_ph:'6-digit Code',
        ms_join_btn:'Join Mess',ms_code_hint:'Ask your mess admin for the code',ms_signout:'Sign Out',ms_delete_account:'Delete Account',
        // Delete Account
        da_title:'Delete Account',da_confirm_text:'This will permanently delete your account and all data. Type DELETE to confirm:',
        da_confirm:'Confirm',da_cancel:'Cancel',
        // Contact Developer
        cd_title:'Contact Developer',cd_role:'Developer of Mess Manager',
        cd_whatsapp:'WhatsApp',cd_email:'Email',cd_github:'GitHub',cd_facebook:'Facebook',
        // Generic
        gen_loading:'Loading...',gen_cancel:'Cancel',gen_save:'Save',gen_delete:'Delete',
    },

    t(key) { return this._translations[key] || key; },

    applyLanguage() {
        const lang = localStorage.getItem('mess_lang') || 'en';
        document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
        document.documentElement.setAttribute('data-lang', lang);
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            const text = this._translations[key];
            if (text) el.textContent = lang === 'bn' ? this._bnText(key) : text;
        });
        document.querySelectorAll('[data-lang-ph]').forEach(el => {
            const key = el.getAttribute('data-lang-ph');
            const text = this._translations[key];
            if (text) el.placeholder = lang === 'bn' ? this._bnText(key) : text;
        });
    },

    _bnText(key) {
        const map = {
            // Nav
            nav_dashboard:'ড্যাশবোর্ড',nav_mess:'মেস',nav_expense:'খরচ',nav_meal:'খাবার',nav_money:'টাকা',nav_profile:'প্রোফাইল',
            // Dashboard
            dash_greet_morning:'সুপ্রভাত',dash_greet_afternoon:'শুভ অপরাহ্ন',dash_greet_evening:'শুভ সন্ধ্যা',
            dash_share:'মেস আইডি শেয়ার',dash_manager:'ম্যানেজার',dash_current_month:'বর্তমান মাস',dash_notice:'নোটিশ বোর্ড',
            dash_notice_preview:'পুরো বাড়ির জন্য একটি নোটিশ দিন',dash_today:'আজ',dash_breakfast:'সকালের নাস্তা',dash_lunch:'দুপুরের খাবার',dash_dinner:'রাতের খাবার',
            dash_meal:'খাবার',dash_deposit:'জমা',dash_balance:'ব্যালেন্স',dash_expense_per_meal:'প্রতি খাবারে খরচ',
            dash_utility:'ইউটিলিটি',dash_expense_per_utility:'প্রতি ইউটিলিটিতে খরচ',dash_analyse:'বিশ্লেষণ',
            dash_meal_summary:'খাবার সারসংক্ষেপ',dash_util_others:'ইউটিলিটি ও অন্যান্য',
            dash_table_name:'নাম',dash_table_total:'মোট',dash_table_expense:'খরচ(৳)',dash_table_deposit:'জমা(৳)',dash_table_balance:'ব্যালেন্স(৳)',
            dash_table_rent:'ভাড়া(৳)',dash_table_util_others:'ইউটিলিটি ও অন্যান্য(৳)',dash_no_data:'কোনো তথ্য নেই',
            // Expense Today
            dt_title:'আজকের খরচ',dt_banner:'আজকের খরচ',dt_nobody:'কেউ নিয়োগ করা হয়নি',
            dt_unassigned:'নিয়োগবিহীন তারিখ',dt_all_assigned:'সব তারিখ নিয়োগ করা হয়েছে',dt_day:'দিন',
            dt_no_dates:'এখনো কোনো তারিখ নেই — সম্পাদনায় ক্লিক করে নিয়োগ করুন',dt_no_members:'কোনো সদস্য নেই',
            // Mess Management
            mm_title:'মেস ব্যবস্থাপনা',mm_leave:'ছাড়ুন',mm_my_mess:'আমার মেস',mm_mess_id:'মেস আইডি',
            mm_tab_members:'সদস্যরা',mm_tab_peoples:'পিপলস',mm_tab_perms:'অনুমতি',
            mm_members_info:'সদস্যরা হলেন যাদের নামে খাবার, খরচ এবং ব্যালেন্স হিসাব হয়। যারা এই মেসে খায় তাদের সবাইকে যোগ করুন — তাদের অ্যাপ লাগবে না।',
            mm_add_member:'সদস্য যোগ করুন',mm_add:'যোগ',mm_add_hint:'অনন্য নাম; শুধু অক্ষর, সংখ্যা ও স্পেস (যেমন Ziad1, Ziad2)',
            mm_total:'মোট মেস সদস্য',mm_no_members:'এখনো কোনো সদস্য নেই',
            mm_peoples_info:'পিপলসরা অ্যাপ ব্যবহার করে এবং এই মেসে যোগ দিয়েছে। যোগ দেওয়া মানে কাউকে খাবার তালিকায় যোগ করা নয় — সেটির জন্য Members এ যোগ করুন।',
            mm_no_peoples:'এখনো কোনো পিপলস যোগ দেয়নি',mm_role_manager:'ম্যানেজার',mm_role_you:'আপনি',
            mm_perms_info:'প্রতিটি পিপলসকে কী করতে দেওয়া হবে — খাবার যোগ, খরচ যোগ, তালিকা পরিচালনা। শুধু পিপলসরা এখানে দেখা যায়।',
            mm_perms_manager_note:'ম্যানেজার সবসময় সব অনুমতি পান।',
            mm_perm_add_expense:'খরচ যোগ',mm_perm_add_meal:'খাবার যোগ',mm_perm_edit_meal:'খাবার সম্পাদনা',
            mm_perm_manage_perms:'অনুমতি পরিচালনা',mm_perm_manage_people:'পিপলস ও সদস্য পরিচালনা',
            mm_no_perms:'অনুমতি দেওয়ার জন্য কোনো পিপলস নেই',
            // Meal Entry
            me_title:'খাবার এন্ট্রি',me_current_month:'বর্তমান মাস:',me_view:'দেখুন',
            me_breakfast:'সকালের নাস্তা',me_lunch:'দুপুরের খাবার',me_dinner:'রাতের খাবার',me_add:'যোগ',
            me_no_members:'কোনো সদস্য নেই',me_error:'লোড হচ্ছে না',
            // Add Meal
            am_title:'খাবার যোগ',am_select_date:'খাবারের তারিখ নির্বাচন করুন',am_set_counts:'সদস্যদের খাবার সংখ্যা নির্ধারণ করুন',
            am_add_meal:'খাবার যোগ',am_total:'মোট:',am_breakfast:'সকালের নাস্তা',am_lunch:'দুপুরের খাবার',am_dinner:'রাতের খাবার',
            am_no_members:'কোনো সদস্য নেই',
            // Meal Records
            mr_title:'খাবার রেকর্ড',mr_current_month:'বর্তমান মাস:',mr_loading:'লোড হচ্ছে...',
            mr_no_edits:'এই মাসে কোনো খাবার সম্পাদনা নেই',mr_removed_by:'সরানো হয়েছে:',mr_added_by:'যোগ করেছে:',
            mr_meals:'খাবার',mr_removed:'সরানো হয়েছে',mr_added:'যোগ হয়েছে',mr_error:'লোড হচ্ছে না',
            // Expense List
            el_title:'খরচ তালিকা',el_current_month:'বর্তমান মাস:',
            el_tab_meal:'খাবার',el_tab_utility:'ইউটিলিটি ও অন্যান্য',el_add:'যোগ',
            el_no_items:'এই মাসে কোনো খরচ নেই',el_item:'আইটেম',el_money_from:'টাকা দিয়েছে',el_total:'মোট',
            el_divided_to:'ভাগ করা হয়েছে',el_each:'প্রতি',el_delete:'মুছুন',el_edit:'সম্পাদনা',
            el_each_label:'প্রতি',el_members:'সদস্য',
            // Money Management
            mm2_title:'টাকা ব্যবস্থাপনা',mm2_current_month:'বর্তমান মাস:',
            mm2_tab_meal:'খাবার',mm2_tab_utility:'ইউটিলিটি ও অন্যান্য',mm2_add:'যোগ',
            mm2_no_deposits:'এই মাসে কোনো জমা নেই',mm2_money_from:'টাকা দিয়েছে',mm2_amount:'পরিমাণ',
            mm2_delete:'মুছুন',mm2_edit:'সম্পাদনা',
            // Add Expense
            ae_title:'খরচ যোগ',ae_tab_meal:'খাবার',ae_tab_utility:'ইউটিলিটি ও অন্যান্য',
            ae_money_from:'টাকা দিয়েছে:',ae_manager:'ম্যানেজার',ae_done_by:'করেছে:',
            ae_item_name:'আইটেমের নাম',ae_expense:'খরচ',ae_add_another:'আরেকটি আইটেম যোগ',
            ae_hint:'প্রতিটি আইটেম আলাদা লাইনে যোগ করুন। বিশ্লেষণ পৃষ্ঠায় দেখা যাবে কোন আইটেম সবচেয়ে বেশি খরচ হয়েছে।',
            ae_type:'ধরন:',ae_rent:'ভাড়া',ae_electricity:'বিদ্যুৎ',ae_wifi:'ওয়াইফাই',ae_others:'অন্যান্য',
            ae_total_bill:'মোট বিল',ae_expense_from:'খরচ থেকে:',ae_divided_to:'ভাগ করা হয়েছে:',
            ae_select_all:'সব নির্বাচন',ae_selected:'নির্বাচিত',ae_footer_hint:'মোট',
            // Add Deposit
            ad_title:'জমা যোগ',ad_tab_meal:'খাবার',ad_tab_utility:'ইউটিলিটি ও অন্যান্য',
            ad_money_from:'টাকা দিয়েছে:',ad_amount:'পরিমাণ লিখুন',
            // Deleted Expenses
            de_title:'মুছে ফেলা খরচ',de_current_month:'বর্তমান মাস:',de_loading:'লোড হচ্ছে...',
            de_no_items:'এই মাসে কোনো মুছে ফেলা খরচ নেই',de_deleted_by:'মুছে ফেলেছে:',
            de_utility:'ইউটিলিটি ও অন্যান্য',de_meal:'খাবার',
            de_expense:'খরচ:',de_orig_added_by:'মূলত যোগ করেছে:',de_error:'লোড হচ্ছে না',
            // Deleted Transactions
            dt2_title:'মুছে ফেলা লেনদেন',dt2_loading:'লোড হচ্ছে...',
            dt2_no_items:'এই মাসে কোনো মুছে ফেলা জমা নেই',dt2_deleted_by:'মুছে ফেলেছে:',
            // Notice Board
            nb_title:'নোটিশ বোর্ড',nb_empty:'বোর্ড খালি',nb_empty_desc:'একটি নোটিশ দিন এবং বাড়ির সবাইকে জানানো হবে।',
            nb_pin:'নোটিশ দিন',nb_modal_title:'নোটিশ দিন',nb_notice_label:'পুরো বাড়ির জন্য নোটিশ',
            nb_placeholder:'এখানে নোটিশ লিখুন...',nb_pin_btn:'দিন',
            // Bazar Note
            bn_title:'বাজার নোট',bn_anyone_can:'যেকোনো বাজার নোটে যোগ করতে পারে',
            bn_anyone_go:'যেকোনো বাজারে যেতে পারে — বাজার এন্ট্রি ছাড়াও',
            bn_draft:'বাড়ির যা প্রয়োজন তা লিখে রাখুন। এটি একটি খসড়া — যোগ ও মুছে ফেলুন।',
            bn_bazar_mode:'বাজার মোডে এই তালিকা যাবে। কেনাকাটার সময় দাম ভরে দিন।',
            bn_placeholder:'আমাদের কী লাগে?',bn_go_bazar:'বাজারে যান',bn_empty_list:'তালিকায় কিছু নেই। যা শেষ হয়ে গেছে তা যোগ করুন।',
            // Menu Today
            mt_title:'আজকের মেনু',mt_dinner_now:'এখন রাতের খাবার',mt_after_8pm:'রাত ৮টার পর',mt_nothing_set:'এখন কিছু নেই',
            mt_tab_upcoming:'আসন্ন মেনু',mt_tab_items:'আইটেম',mt_tab_special:'বিশেষ দিন',
            mt_add:'যোগ',mt_nothing_set_day:'কিছু নেই',mt_today:'আজ',mt_items_shared:'সব মেনুতে ব্যবহৃত আইটেম',
            mt_no_items:'এখনো কোনো আইটেম নেই',mt_special_days:'নির্দিষ্ট তারিখের বিশেষ মেনু',mt_add_special:'বিশেষ দিন যোগ',
            mt_coming_soon:'মেনু ইতিহাস শীঘ্রই আসছে',
            // Analysis
            an_title:'বিশ্লেষণ',an_month:'মাস',an_tab_meal:'খাবার',an_tab_utility:'ইউটিলিটি',
            an_total_meals:'মোট খাবার',an_meal_bazar:'খাবার বাজার',an_members:'সদস্য',
            an_expense_per_meal:'প্রতি খাবারে খরচ',an_bazar:'বাজার',an_meals_label:'খাবার',
            an_member_balances:'সদস্যদের ব্যালেন্স',an_credit_hint:'সবুজ = বাকি আছে · লাল = দেনা (জমা − খরচ)',
            an_expense_trend:'প্রতি খাবারে খরচের প্রবণতা',an_vs_last_month:'গত মাসের তুলনায়',
            an_costlier:'বেশি খরচ',an_cheaper:'কম খরচ',
            an_meal_share:'সদস্য অনুযায়ী খাবার অংশ',an_who_ate:'কারা কত খেয়েছে',an_meals_count:'খাবার',
            an_bazar_by_day:'দিন অনুযায়ী বাজার',an_spent_across:'পুরো মাসে খরচ',
            an_meals_by_day:'দিন অনুযায়ী খাবার',an_meals_across:'পুরো মাসে খাবার',
            an_top10_bazar:'খরচ অনুযায়ী শীর্ষ ১০ বাজার আইটেম',an_items:'আইটেম',
            an_total_utility:'মোট ইউটিলিটি',an_rent:'ভাড়া',an_other_utility:'অন্যান্য ইউটিলিটি',
            an_util_balance:'ব্যালেন্স',an_collection:'সংগ্রহ',an_spending:'খরচ',
            an_util_credit_hint:'সবুজ = বাকি আছে · লাল = দেনা (ইউটিলিটি জমা − খরচ অংশ)',
            an_util_expense_trend:'প্রতি ইউটিলিটিতে খরচের প্রবণতা',
            an_util_by_day:'দিন অনুযায়ী ইউটিলিটি খরচ',an_util_across:'পুরো মাসে ইউটিলিটি খরচ',
            an_top10_util:'খরচ অনুযায়ী শীর্ষ ১০ ইউটিলিটি আইটেম',
            // Profile
            prof_title:'প্রোফাইল ও সেটিংস',
            prof_general:'সাধারণ সেটিংস',prof_device_theme:'ডিভাইস থিম',prof_device_theme_desc:'সিস্টেম অনুযায়ী থিম পরিবর্তন',
            prof_oled_theme:'ডার্ক থিম',prof_oled_desc:'চোখের সুবিধার জন্য ডার্ক ব্যাকড্রপ',
            prof_language:'ভাষা',prof_lang_desc:'আপনার পছন্দের ভাষা নির্বাচন করুন',
            prof_account:'অ্যাকাউন্ট',prof_logout:'লগ আউট',prof_reset_pwd:'পাসওয়ার্ড রিসেট',prof_delete:'অ্যাকাউন্ট মুছুন',
            prof_more:'আরও',prof_share:'শেয়ার',prof_about:'অ্যাপ সম্পর্কে',prof_contact:'ডেভেলপারের সাথে যোগাযোগ',
            prof_version:'ভার্সন ১.৩.৪৭ (বিল্ড ১৬০)',
            // Duty editor
            de_assign_dates:'তারিখ নির্ধারণ',de_yours:'আপনার',de_taken:'নেওয়া হয়েছে (ক্লিক করে নিন)',de_done:'সম্পন্ন',
            // Select Month
            sm_title:'মাস নির্বাচন',sm_ok:'ঠিক আছে',
            // View Settings
            vs_title:'দেখার সেটিংস',vs_select_rows:'টেবিলে কোন খাবার সারি দেখানো হবে তা নির্বাচন করুন:',
            // Edit Expense Modal
            eem_title:'খরচ সম্পাদনা',eem_item_name:'আইটেমের নাম',eem_money_from:'টাকা দিয়েছে',
            eem_date:'তারিখ',eem_expense:'খরচ (৳)',eem_cancel:'বাতিল',eem_save:'সংরক্ষণ',
            // Edit Deposit Modal
            edm_title:'জমা সম্পাদনা',edm_money_from:'টাকা দিয়েছে',edm_date:'তারিখ',
            edm_amount:'পরিমাণ (৳)',edm_category:'ক্যাটাগরি',edm_meal:'খাবার',edm_utility:'ইউটিলিটি',
            edm_cancel:'বাতিল',edm_save:'সংরক্ষণ',
            // Auth
            auth_title:'মেস ম্যানেজার',auth_subtitle:'আপনার মেস সহজে পরিচালনা করুন',
            auth_email_ph:'ইমেইল',auth_pass_ph:'পাসওয়ার্ড',auth_login:'লগইন',
            auth_forgot:'পাসওয়ার্ড ভুলে গেছেন?',auth_create:'অ্যাকাউন্ট তৈরি',auth_or:'অথবা',
            auth_google:'গুগল দিয়ে চালিয়ে যান',
            reg_title:'অ্যাকাউন্ট তৈরি',reg_name_ph:'পুরো নাম',reg_email_ph:'ইমেইল',
            reg_phone_ph:'ফোন নম্বর',reg_pass_ph:'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)',reg_btn:'অ্যাকাউন্ট তৈরি',
            reg_back:'লগইনে ফিরুন',
            fp_title:'পাসওয়ার্ড রিসেট',fp_desc:'রিসেট লিঙ্ক পেতে ইমেইল দিন',
            fp_email_ph:'আপনার ইমেইল',fp_send:'রিসেট লিঙ্ক পাঠান',fp_back:'লগইনে ফিরুন',
            // Mess Selector
            ms_title:'আপনার মেস',ms_subtitle:'একটি মেস নির্বাচন করুন বা নতুন তৈরি করুন',ms_no_mess:'এখনো কোনো মেস নেই',
            ms_create_title:'নতুন মেস তৈরি',ms_name_ph:'মেসের নাম',ms_addr_ph:'ঠিকানা (ঐচ্ছিক)',
            ms_create_btn:'মেস তৈরি',ms_join_title:'বিদ্যমান মেসে যোগ দিন',ms_code_ph:'৬ ডিজিট কোড',
            ms_join_btn:'মেসে যোগ দিন',ms_code_hint:'মেস অ্যাডমিনের কাছ থেকে কোড নিন',ms_signout:'সাইন আউট',ms_delete_account:'অ্যাকাউন্ট মুছুন',
            // Delete Account
            da_title:'অ্যাকাউন্ট মুছুন',da_confirm_text:'এটি আপনার অ্যাকাউন্ট ও সব তথ্য মুছে দেবে। DELETE টাইপ করে নিশ্চিত করুন:',
            da_confirm:'নিশ্চিত',da_cancel:'বাতিল',
            // Contact Developer
            cd_title:'ডেভেলপারের সাথে যোগাযোগ',cd_role:'মেস ম্যানেজারের ডেভেলপার',
            cd_whatsapp:'হোয়াটসঅ্যাপ',cd_email:'ইমেইল',cd_github:'গিটহাব',cd_facebook:'ফেসবুক',
            // Generic
            gen_loading:'লোড হচ্ছে...',gen_cancel:'বাতিল',gen_save:'সংরক্ষণ',gen_delete:'মুছুন',
        };
        return map[key] || this._translations[key] || key;
    },

    async init() {
        const splash = document.getElementById('splash-screen');
        const hideSplash = () => {
            if (splash && !splash.classList.contains('hidden')) { splash.classList.add('hidden'); setTimeout(() => splash.remove(), 400); }
            try { if (window.Capacitor?.Plugins?.SplashScreen) Capacitor.Plugins.SplashScreen.hide(); } catch (e) {}
        };
        hideSplash();
        setTimeout(hideSplash, 2000);
        this.applyTheme();
        this.applyLanguage();
        this._cacheDriveFiles();
        if (typeof firebaseConfig === 'undefined' || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY_HERE') {
            this.showScreen('auth-screen');
            document.querySelector('.auth-container').innerHTML = '<div class="auth-header"><div class="auth-logo"><span class="material-icons-round">warning</span></div><h1>Firebase Setup Required</h1><p style="margin-top:12px">Edit <code>firebase-config.js</code></p></div>';
            hideSplash();
            return;
        }
        try { await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}
        try { await db.enablePersistence({ synchronizeTabs: true }); } catch (e) {}
        try { db.goOnline(); } catch (e) {}
        try {
            const _origOnce = firebase.database.Reference.prototype.once;
            firebase.database.Reference.prototype.once = function(...args) {
                return Promise.race([
                    _origOnce.apply(this, args),
                    new Promise((_, rej) => setTimeout(() => rej(new Error('fb-timeout')), 5000))
                ]);
            };
            const _origSet = firebase.database.Reference.prototype.set;
            const _origPush = firebase.database.Reference.prototype.push;
            const _origRemove = firebase.database.Reference.prototype.remove;
            const _origUpdate = firebase.database.Reference.prototype.update;
            const _writeTimeout = (fn) => function(...args) {
                return Promise.race([
                    fn.apply(this, args),
                    new Promise((_, rej) => setTimeout(() => rej(new Error('fb-timeout')), 10000))
                ]);
            };
            firebase.database.Reference.prototype.set = _writeTimeout(_origSet);
            firebase.database.Reference.prototype.push = _writeTimeout(_origPush);
            firebase.database.Reference.prototype.remove = _writeTimeout(_origRemove);
            firebase.database.Reference.prototype.update = _writeTimeout(_origUpdate);
        } catch (e) {}
        this._setupConnectivity();
        this.bindEvents();
        this.bindBackButton();
        auth.onAuthStateChanged(user => {
            if (user) {
                this.currentUser = user;
                this.loadMyMesses();
                const params = new URLSearchParams(window.location.search);
                const joinCode = params.get('join');
                if (joinCode) {
                    setTimeout(() => {
                        const input = document.getElementById('join-mess-code');
                        if (input) { input.value = joinCode.toUpperCase(); this.joinMess(); }
                    }, 1000);
                }
            } else {
                this.currentUser = null;
                this.messId = null;
                this.showScreen('auth-screen');
                hideSplash();
            }
        });
    },

    bindEvents() {
        const $ = id => document.getElementById(id);
        const bind = (id, evt, fn) => { const el = $(id); if (el) el.addEventListener(evt, fn); };
        bind('login-btn', 'click', () => this.emailLogin());
        bind('show-login-btn', 'click', () => this.showScreen('auth-login-screen'));
        bind('show-register-welcome', 'click', () => this.showScreen('auth-register-screen'));
        bind('forgot-password-link', 'click', () => this.showScreen('forgot-screen'));
        bind('google-login-welcome', 'click', () => this.googleLogin());
        bind('google-login-email', 'click', () => this.googleLogin());
        bind('google-register', 'click', () => this.googleLogin());
        bind('show-register-login', 'click', () => this.showScreen('auth-register-screen'));
        bind('back-to-login-login', 'click', () => this.showScreen('auth-login-screen'));
        bind('register-btn', 'click', () => this.emailRegister());
        bind('send-reset-btn', 'click', () => this.sendResetEmail());
        bind('create-mess-btn', 'click', () => this.createMess());
        bind('join-mess-btn', 'click', () => this.joinMess());
        bind('logout-from-setup', 'click', () => auth.signOut());
        bind('delete-account-from-setup', 'click', () => this.deleteAccount());
        bind('modal-close', 'click', () => this.closeModal());
        const overlay = $('modal-overlay');
        if (overlay) overlay.addEventListener('click', e => { if (e.target === e.currentTarget) this.closeModal(); });
        this._setupSwipe();
        document.addEventListener('input', e => {
            const el = e.target;
            if (el.tagName === 'INPUT' && el.type === 'number' && /[\u09E6-\u09EF]/.test(el.value)) {
                const pos = el.selectionStart;
                el.value = this._toEnDigits(el.value);
                el.setSelectionRange(pos, pos);
            }
        });
    },

    _setupSwipe() {
        const navPages = ['dashboard','members','bazaar','meals','balance','profile'];
        const tabPages = ['members'];
        let startX = 0, startY = 0, swiping = false;
        const appScreen = document.getElementById('app-screen');
        if (!appScreen) return;
        appScreen.addEventListener('touchstart', e => {
            if (e.touches.length !== 1) return;
            const t = e.touches[0];
            const el = e.target;
            if (el.closest('.ameal-grid-scroll') || el.closest('.aflat-tabs') || el.closest('.aflat-tab-content') || el.closest('input') || el.closest('button') || el.closest('.aflat-add-row')) return;
            startX = t.clientX; startY = t.clientY; swiping = true;
        }, { passive: true });
        appScreen.addEventListener('touchend', e => {
            if (!swiping) return;
            swiping = false;
            const t = e.changedTouches[0];
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;
            if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.75) return;
            const idx = navPages.indexOf(this.currentPage);
            if (idx === -1) return;
            if (dx < 0 && idx < navPages.length - 1) this.navigate(navPages[idx + 1]);
            else if (dx > 0 && idx > 0) this.navigate(navPages[idx - 1]);
        }, { passive: true });
    },

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        const nav = document.getElementById('bottom-nav');
        if (nav) nav.classList.toggle('hidden-nav', id !== 'app-screen');
        if (id === 'app-screen') {
            const isOled = this.theme === 'oled';
            this._setSystemBars(isOled ? '#111111' : '#f2f4f8', isOled ? '#ffffff' : '#14181f');
        } else {
            this._setSystemBars('#ffffff', '#14181f');
        }
    },

    bindBackButton() {
        this._pageHistory = [];
        window.addEventListener('popstate', (e) => {
            if (!document.getElementById('app-screen')?.classList.contains('active')) return;
            if (e.state && e.state.page) {
                this._fromPopstate = true;
                this.navigate(e.state.page);
            } else if (this._pageHistory.length) {
                const prev = this._pageHistory.pop();
                this._fromPopstate = true;
                this.navigate(prev);
            } else if (this.currentPage && this.currentPage !== 'dashboard') {
                this.navigate('dashboard');
            }
        });
        const hwBack = () => {
            if (document.getElementById('bz-overlay')) { this.bzClose(); return; }
            const modal = document.getElementById('modal-overlay');
            if (modal && modal.classList.contains('active')) { this.closeModal(); return; }
            const appActive = document.getElementById('app-screen')?.classList.contains('active');
            const authActive = document.getElementById('auth-screen')?.classList.contains('active');
            const messActive = document.getElementById('mess-select-screen')?.classList.contains('active');
            if (appActive) {
                if (this.currentPage && this.currentPage !== 'dashboard') {
                    this._fromPopstate = true;
                    if (this._pageHistory.length) {
                        const prev = this._pageHistory.pop();
                        this.navigate(prev);
                    } else {
                        this.navigate('dashboard');
                    }
                } else if (this.currentPage === 'dashboard') {
                    this.showScreen('mess-select-screen');
                    this.loadMyMesses();
                }
            } else if (authActive) {
                // from welcome screen - do nothing (stay or exit)
            } else if (document.getElementById('auth-login-screen')?.classList.contains('active')) {
                this.showScreen('auth-screen');
            } else if (document.getElementById('auth-register-screen')?.classList.contains('active')) {
                this.showScreen('auth-screen');
            } else if (document.getElementById('forgot-screen')?.classList.contains('active')) {
                this.showScreen('auth-login-screen');
            } else if (messActive) {
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
        catch (e) {
            let m = e.message;
            if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
                try {
                    const methods = await auth.fetchSignInMethodsForEmail(email);
                    if (methods && methods.includes('google.com')) m = 'This account was created with Google. Tap "Continue with Google" to sign in.';
                    else if (methods && methods.length) m = 'Incorrect password. Please try again.';
                    else m = 'No account found with this email. Please sign up first.';
                } catch (e2) { m = 'No account found with this email. Please sign up first.'; }
            }
            this.toast(m, 'error');
        }
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
        const btn = document.querySelector('.screen.active .btn-auth-google, .screen.active .btn-google') || document.getElementById('google-login-welcome');
        const orig = btn ? btn.innerHTML : '';
        btn.innerHTML = '<span class="material-icons-round" style="animation:spin 1s linear infinite">refresh</span> Connecting...'; btn.disabled = true;
        try {
            if (window.Capacitor?.isNativePlatform && window.Capacitor.isNativePlatform()) {
                const { GoogleAuth } = Capacitor.Plugins;
                await GoogleAuth.initialize({ clientId: '714155755588-psvicqsasbnb6j2flmfqg9ttd60h9o3a.apps.googleusercontent.com', scopes: 'profile,email', grantOfflineAccess: true });
                const result = await GoogleAuth.signIn();
                const idToken = result.authentication?.idToken || result.idToken;
                if (!idToken) { this.toast('Google login failed: no ID token received', 'error'); return; }
                const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
                const c = await auth.signInWithCredential(credential);
                const s = await db.ref(`users/${c.user.uid}`).once('value');
                if (!s.exists()) await db.ref(`users/${c.user.uid}`).set({ name: c.user.displayName, email: c.user.email, createdAt: Date.now() });
            } else {
                const p = new firebase.auth.GoogleAuthProvider();
                const c = await auth.signInWithPopup(p);
                const s = await db.ref(`users/${c.user.uid}`).once('value');
                if (!s.exists()) await db.ref(`users/${c.user.uid}`).set({ name: c.user.displayName, email: c.user.email, createdAt: Date.now() });
            }
        }
        catch (e) {
            console.error('Google login error:', JSON.stringify(e));
            const msg = (e.message || '') + ' ' + (e.details || '') + ' ' + (e.code || '');
            let m = e.message || e.details || 'Unknown error';
            if (e.code === 'auth/popup-closed-by-user') m = 'Cancelled';
            else if (e.code === 'auth/invalid-credential') m = 'Invalid credentials - check Firebase config';
            else if (e.code === 'auth/user-disabled') m = 'Account disabled';
            else if (e.code === 'auth/account-exists-with-different-credential') m = 'Account exists with different login method';
            else if (msg.includes('12500')) m = 'Google Sign-In config error (status 12500)';
            else if (msg.includes('12501')) m = 'Google Sign-In cancelled';
            else if (msg.includes('12502')) m = 'Sign-in already in progress';
            else if (msg.includes('10') || msg.includes('DEVELOPER_ERROR')) m = 'Developer error - SHA-1 or client ID mismatch';
            else if (msg.includes('7')) m = 'Network error';
            this.toast(m + ' [' + (e.code || e.details || '') + ']', 'error');
        }
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
        if (splash) { splash.classList.add('hidden'); setTimeout(() => splash.remove(), 400); }
        const cacheKey = `user_messes_${this.currentUser.uid}`;
        let data = {};
        const offline = !navigator.onLine;
        if (offline) {
            try { data = JSON.parse(localStorage.getItem(cacheKey) || '{}'); } catch (e) {}
        } else {
            try {
                const snap = await db.ref(`users/${this.currentUser.uid}/messes`).once('value');
                data = snap.val() || {};
                try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch (e) {}
            } catch (e) {
                try { const c = JSON.parse(localStorage.getItem(cacheKey) || '{}'); if (Object.keys(c).length) data = c; } catch (e2) {}
            }
        }
        const ids = Object.keys(data);
        if (ids.length === 1) { this.enterMess(ids[0]); return; }
        if (ids.length > 1) {
            this.showScreen('mess-select-screen');
            const div = document.getElementById('my-messes-list');
            let html = '<div class="card-body">';
            for (const mid of ids) {
                let s = {};
                try {
                    if (offline) {
                        s = JSON.parse(localStorage.getItem(`mess_settings_${mid}`) || '{}');
                    } else {
                        const ms = await db.ref(`messes/${mid}/settings`).once('value');
                        s = ms.val() || {};
                        try { localStorage.setItem(`mess_settings_${mid}`, JSON.stringify(s)); } catch (e) {}
                    }
                } catch (e) {
                    try { s = JSON.parse(localStorage.getItem(`mess_settings_${mid}`) || '{}'); } catch (e2) {}
                }
                html += `<div class="mess-item" onclick="App.enterMess('${mid}')">
                    <div class="mess-item-icon"><span class="material-icons-round">home</span></div>
                    <div class="mess-item-info"><h4>${this.esc(s.messName || 'Unnamed')}</h4><p>${data[mid].role || 'member'} | ${s.messCode || ''}</p></div>
                    <span class="material-icons-round" style="color:var(--text-secondary)">chevron_right</span>
                </div>`;
            }
            div.innerHTML = html + '</div>';
            this._setupMessSelectPullRefresh();
            return;
        }
        if (splash) { splash.classList.add('hidden'); setTimeout(() => splash.remove(), 400); }
        this.showScreen('mess-select-screen');
        document.getElementById('my-messes-list').innerHTML = '<div class="card-body"><p class="empty-state">No mess yet. Create or join one below.</p></div>';
        this._setupMessSelectPullRefresh();
    },

    _setupMessSelectPullRefresh() {
        const screen = document.getElementById('mess-select-screen');
        if (!screen || screen._pullSetup) return;
        screen._pullSetup = true;
        let startY = 0, pulling = false;
        const indicator = document.createElement('div');
        indicator.style.cssText = 'position:fixed;top:0;left:50%;transform:translateX(-50%) translateY(-50px);background:white;color:#333;padding:8px 20px;border-radius:20px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:transform .2s';
        indicator.textContent = 'Pull to refresh';
        document.body.appendChild(indicator);
        screen.addEventListener('touchstart', e => { if (screen.classList.contains('active')) { startY = e.touches[0].clientY; pulling = true; } }, { passive: true });
        screen.addEventListener('touchmove', e => {
            if (!pulling) return;
            const dy = e.touches[0].clientY - startY;
            if (dy > 10 && screen.scrollTop <= 0) {
                indicator.style.transform = `translateX(-50%) translateY(${Math.min(dy * 0.5 - 20, 30)}px)`;
                indicator.textContent = dy > 80 ? 'Release to refresh' : 'Pull to refresh';
            }
        }, { passive: true });
        screen.addEventListener('touchend', e => {
            if (!pulling) return;
            pulling = false;
            const dy = (e.changedTouches?.[0]?.clientY || 0) - startY;
            indicator.style.transform = 'translateX(-50%) translateY(-50px)';
            if (dy > 80 && screen.scrollTop <= 0) {
                indicator.textContent = 'Refreshing...';
                indicator.style.transform = 'translateX(-50%) translateY(30px)';
                this.loadMyMesses().then(() => {
                    setTimeout(() => { indicator.style.transform = 'translateX(-50%) translateY(-50px)'; }, 1000);
                });
            }
        }, { passive: true });
    },

    async enterMess(mid) {
        this.messId = mid;
        this.messCode = null;
        const settingsCacheKey = `mess_settings_${mid}`;
        const roleCacheKey = `mess_role_${mid}`;
        const offline = !navigator.onLine;
        try {
            if (!offline) {
                const memberSnap = await db.ref(`messes/${mid}/members/${this.currentUser.uid}`).once('value');
                if (!memberSnap.exists()) {
                    try { await db.ref(`users/${this.currentUser.uid}/messes/${mid}`).remove(); } catch (e2) {}
                    this.toast('You are no longer a member of this mess', 'error');
                    this.messId = null;
                    return this.loadMyMesses();
                }
                const s = await db.ref(`messes/${mid}/settings`).once('value');
                const v = s.val() || {};
                this.messCode = v.messCode;
                this.messName = v.messName;
                try { localStorage.setItem(settingsCacheKey, JSON.stringify(v)); } catch (e) {}
                try {
                    const roleSnap = await db.ref(`messes/${mid}/members/${this.currentUser.uid}/role`).once('value');
                    this.userRole = roleSnap.val() || 'member';
                    try { localStorage.setItem(roleCacheKey, this.userRole); } catch (e) {}
                } catch (e) {
                    try { this.userRole = localStorage.getItem(roleCacheKey) || 'member'; } catch (e2) {}
                }
            } else {
                try {
                    const cached = JSON.parse(localStorage.getItem(settingsCacheKey) || '{}');
                    this.messCode = cached.messCode || null;
                    this.messName = cached.messName || 'My Mess';
                    this.userRole = localStorage.getItem(roleCacheKey) || 'member';
                } catch (e2) {}
            }
        } catch (e) {
            try {
                const cached = JSON.parse(localStorage.getItem(settingsCacheKey) || '{}');
                this.messCode = cached.messCode || null;
                this.messName = cached.messName || 'My Mess';
                this.userRole = localStorage.getItem(roleCacheKey) || 'member';
            } catch (e2) {}
        }
        try { this.setupPresence(); } catch (e) {}
        try { await this.loadMyPerms(); } catch (e) {}
        this.showApp();
        if (!offline) this._proactiveCache(mid);
    },

    async _proactiveCache(mid) {
        if (!navigator.onLine) return;
        try {
            const [members, bazarItems, deposits, meals, perms, notices] = await Promise.all([
                db.ref(`messes/${mid}/members`).once('value'),
                db.ref(`messes/${mid}/bazarItems`).once('value'),
                db.ref(`messes/${mid}/deposits`).once('value'),
                db.ref(`messes/${mid}/meals`).once('value'),
                db.ref(`messes/${mid}/permissions`).once('value'),
                db.ref(`messes/${mid}/notices`).once('value')
            ]);
            this._cacheSet('members', members.val() || {});
            this._cacheSet('bazarItems', bazarItems.val() || {});
            this._cacheSet('deposits', deposits.val() || {});
            this._cacheSet('meals_month', meals.val() || {});
            this._cacheSet('permissions', perms.val() || {});
            this._cacheSet('notices', notices.val() || {});
            try {
                const settingsSnap = await db.ref(`messes/${mid}/settings`).once('value');
                this._cacheSet('settings', settingsSnap.val() || {});
                try { localStorage.setItem(`mess_settings_${mid}`, JSON.stringify(settingsSnap.val() || {})); } catch (e) {}
            } catch (e) {}
            try {
                const todayKey = this.dk(new Date());
                const todaySnap = await db.ref(`messes/${mid}/meals/${todayKey}`).once('value');
                this._cacheSet('meals_today_' + todayKey, todaySnap.val() || {});
            } catch (e) {}
            try {
                const picSnap = await db.ref(`users/${this.currentUser.uid}/profilePicture`).once('value');
                const pic = picSnap.val();
                if (pic) this._cacheSetGlobal('profilePic', pic);
            } catch (e) {}
        } catch (e) {}
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
            const uid = this.currentUser.uid;
            const updates = {};
            updates[`messes/${this.messId}/members/${uid}`] = null;
            updates[`messes/${this.messId}/permissions/${uid}`] = null;
            updates[`users/${uid}/messes/${this.messId}`] = null;
            await db.ref().update(updates);
            const mSnap = await db.ref(`messes/${this.messId}/members`).once('value');
            const remaining = Object.keys(mSnap.val() || {}).filter(id => !id.startsWith('member_'));
            if (!remaining.length) {
                await this.deleteMessFully(this.messId);
                this.toast('Last person left — mess deleted', 'success');
            } else {
                this.toast('Left mess', 'success');
            }
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
            const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('Connection timeout')), 15000));
            const ref = db.ref('messes').push({
                settings: { messName: name, messCode: code, owner: this.currentUser.uid, createdAt: Date.now() },
                members: { [this.currentUser.uid]: { name: this.currentUser.displayName || 'Admin', email: this.currentUser.email, role: 'admin', joinedAt: Date.now() } }
            });
            await Promise.race([ref, timeout]);
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
        const savedPage = localStorage.getItem('mess_currentPage');
        const validPages = ['dashboard','members','bazaar','meals','balance','profile'];
        this.navigate(validPages.includes(savedPage) ? savedPage : 'dashboard');
    },

    navigate(page) {
        if (!this._fromPopstate && this.currentPage && this.currentPage !== page) {
            if (!this._pageHistory) this._pageHistory = [];
            if (this._pageHistory.length < 30) this._pageHistory.push(this.currentPage);
        }
        this.currentPage = page;
        try { localStorage.setItem('mess_currentPage', page); } catch (e) {}
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
        const titles = { dashboard: this.t('nav_dashboard'), members: this.t('mm_title'), meals: this.t('me_title'), bazaar: this.t('el_title'), balance: this.t('mm2_title'), notices: this.t('nb_title'), monthly: this.t('an_title'), profile: this.t('prof_title'), duty: this.t('dt_title'), bazarnote: this.t('bn_title'), menu: this.t('mt_title'), mealhistory: this.t('mr_title'), costtrash: this.t('de_title'), deptrash: this.t('dt2_title') };
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
        if (page === 'members') { this.loadFlat(); this._setupFlatTabSwipe(); }
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
        this.applyLanguage();
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
        this._hintOffline();
        const body = document.getElementById('notice-body').value.trim();
        if (!body) { this.toast('Write something first', 'error'); return; }
        try {
            await db.ref(`messes/${this.messId}/notices`).push({
                body,
                author: this.currentUser?.displayName || 'Manager',
                createdAt: Date.now()
            });
            this.closeModal(); this._cacheClearAll(); this.loadNotices(); this.toast('Notice pinned!', 'success');
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async deleteNotice(key) {
        if (!confirm('Remove this notice?')) return;
        try {
            await db.ref(`messes/${this.messId}/notices/${key}`).remove();
            this._cacheClearAll(); this.loadNotices(); this.toast('Notice removed', 'success');
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
                `<span class="material-icons-round">event</span><p><strong>Expense today (${now.getDate()} ${shortMon}):</strong> ` +
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
        if (tab === 'peoples' && this._flatMembers) this.loadFlatPeoples(this._flatMembers);
        if (tab === 'permissions' && this._flatMembers) this.loadFlatPermissions(this._flatMembers);
        this._currentFlatTab = tab;
    },
    _setupFlatTabSwipe() {
        const content = document.getElementById('page-members');
        if (!content || content._flatSwipeSetup) return;
        content._flatSwipeSetup = true;
        const tabOrder = ['members', 'peoples', 'permissions'];
        let startX = 0, startY = 0, swiping = false;
        content.addEventListener('touchstart', e => {
            if (e.touches.length !== 1 || this.currentPage !== 'members') return;
            const t = e.touches[0];
            startX = t.clientX; startY = t.clientY; swiping = true;
        }, { passive: true });
        content.addEventListener('touchend', e => {
            if (!swiping || this.currentPage !== 'members') return;
            swiping = false;
            const t = e.changedTouches[0];
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;
            if (Math.abs(dx) < 80 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
            const cur = this._currentFlatTab || 'members';
            const idx = tabOrder.indexOf(cur);
            if (dx < 0 && idx < tabOrder.length - 1) this.switchFlatTab(tabOrder[idx + 1]);
            else if (dx > 0 && idx > 0) this.switchFlatTab(tabOrder[idx - 1]);
        }, { passive: true });
    },

    async loadFlat() {
        if (!this.messId) return;
        try {
            const s = await this._dbGet(`messes/${this.messId}/settings`, 'settings');
            document.getElementById('flat-mess-name').textContent = s.messName || 'My Mess';
            document.getElementById('flat-mess-code').textContent = s.messCode || '------';

            const members = await this._dbGet(`messes/${this.messId}/members`, 'members');
            this._flatMembers = members;
            const mids = Object.keys(members).filter(id => id.startsWith('member_') || !(members[id] || {}).role).sort((a, b) => (members[a]?.name || '').localeCompare((members[b]?.name || '')));
            let adminName = '-';
            const admin = Object.keys(members).find(id => members[id] && members[id].role === 'admin');
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
        this._hintOffline();
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
            this._cacheClearAll();
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
            this._cacheClearAll();
            this.loadFlat();
            this.toast('Member renamed', 'success');
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async removeFlatMember(id) {
        if (!this.checkPerm('manage')) return;
        const m = (this._flatMembers || {})[id] || {};
        const name = m.name || 'Unknown';
        if (!confirm(`Remove "${name}" from mess?\n\nThis will permanently delete ALL their data:\n• All meals\n• All expenses\n• All deposits\n• Meal history\n\nThis cannot be undone.`)) return;
        try {
            const prefix = `messes/${this.messId}`;
            const snap = await db.ref(prefix).once('value');
            const messData = snap.val() || {};
            const updates = {};
            updates[`${prefix}/members/${id}`] = null;
            Object.entries(messData.meals || {}).forEach(([date, members]) => {
                if (members && members[name]) updates[`${prefix}/meals/${date}/${name}`] = null;
            });
            Object.entries(messData.bazarItems || {}).forEach(([key, item]) => {
                if (!item) return;
                if (item.memberId === name || item.doneBy === name) updates[`${prefix}/bazarItems/${key}`] = null;
                if (Array.isArray(item.splitWith) && item.splitWith.includes(name)) {
                    const nw = item.splitWith.filter(n => n !== name);
                    updates[`${prefix}/bazarItems/${key}/splitWith`] = nw.length ? nw : null;
                }
            });
            Object.entries(messData.deposits || {}).forEach(([key, dep]) => {
                if (dep && dep.memberId === name) updates[`${prefix}/deposits/${key}`] = null;
            });
            Object.entries(messData.mealHistory || {}).forEach(([key, h]) => {
                if (h && h.member === name) updates[`${prefix}/mealHistory/${key}`] = null;
            });
            await db.ref().update(updates);
            this._cacheClearAll();
            this.toast('Member removed with all data', 'success');
            this.loadFlat();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async deleteMessFully(messId) {
        try {
            const mSnap = await db.ref(`messes/${messId}/members`).once('value');
            const members = mSnap.val() || {};
            const updates = {};
            Object.keys(members).forEach(uid => {
                if (!uid.startsWith('member_')) updates[`users/${uid}/messes/${messId}`] = null;
            });
            updates[`messes/${messId}`] = null;
            await db.ref().update(updates);
        } catch (e) { console.error('deleteMessFully error:', e); }
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
                const isYou = id === (this.currentUser ? this.currentUser.uid : '');
                let profilePic = '';
                try { const picSnap = await db.ref(`users/${id}/profilePicture`).once('value'); profilePic = picSnap.val() || ''; } catch (e) {}
                const avatarStyle = profilePic ? `background-image:url(${profilePic});background-size:cover;background-position:center;color:transparent` : `background:${color}`;
                let actionsHtml = '';
                const canManage = this.userRole === 'admin' || this.canDo('manage');
                if (isYou && isAdmin) {
                    actionsHtml = `<div class="fp-actions">
                        <button class="fp-btn fp-btn-red" onclick="event.stopPropagation();App.leaveMess()">Leave</button>
                        <button class="fp-btn fp-btn-green" onclick="event.stopPropagation();App.stepDownManager()">Step down as manager</button>
                    </div>`;
                } else if (isYou && !isAdmin) {
                    actionsHtml = `<div class="fp-actions">
                        <button class="fp-btn fp-btn-red" onclick="event.stopPropagation();App.leaveMess()">Leave</button>
                    </div>`;
                } else if (!isYou && canManage) {
                    actionsHtml = `<div class="fp-actions">
                        <button class="fp-btn fp-btn-red" onclick="event.stopPropagation();App.removePerson('${id}','${this.esc(m.name||'')}')">Remove</button>
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
        if (!confirm(`Remove ${name} from mess?\n\nTheir meal/expense data will remain in the mess.`)) return;
        try {
            const updates = {};
            updates[`messes/${this.messId}/members/${uid}`] = null;
            updates[`messes/${this.messId}/permissions/${uid}`] = null;
            updates[`users/${uid}/messes/${this.messId}`] = null;
            await db.ref().update(updates);
            const mSnap = await db.ref(`messes/${this.messId}/members`).once('value');
            const remaining = Object.keys(mSnap.val() || {}).filter(id => !id.startsWith('member_'));
            if (!remaining.length) {
                await this.deleteMessFully(this.messId);
                this.toast('Last person removed — mess deleted', 'success');
                this.messId = null; this.messCode = null; this.messName = null;
                this.loadMyMesses();
                return;
            }
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
            const permKeys = ['bazarEntry', 'mealEntry', 'mealEdit', 'togglePerms', 'manage'];
            const permLabels = ['Add Expense', 'Add Meal', 'Edit Meal', 'Manage Permissions', 'Manage People & Members'];
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
        const cacheKey = `perms_${this.messId}_${this.currentUser.uid}`;
        const offline = !navigator.onLine;
        try {
            if (!offline) {
                const membersSnap = await db.ref(`messes/${this.messId}/members/${this.currentUser.uid}`).once('value');
                const m = membersSnap.val() || {};
                if (m.role === 'admin') { this._userPerms = null; this._permsLoaded = true; try { localStorage.setItem(cacheKey, JSON.stringify(null)); } catch (e) {} return; }
                const permSnap = await db.ref(`messes/${this.messId}/permissions/${this.currentUser.uid}`).once('value');
                this._userPerms = permSnap.val() || {};
                try { localStorage.setItem(cacheKey, JSON.stringify(this._userPerms)); } catch (e) {}
            } else {
                try { this._userPerms = JSON.parse(localStorage.getItem(cacheKey) || '{}'); } catch (e2) { this._userPerms = {}; }
            }
        } catch (e) {
            try { this._userPerms = JSON.parse(localStorage.getItem(cacheKey) || '{}'); } catch (e2) { this._userPerms = {}; }
        }
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
        this._hintOffline();
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
        const joinUrl = `${window.location.origin}${window.location.pathname}?join=${this.messCode}`;
        const text = `Join my mess "${this.messName || ''}"\n\n${joinUrl}`;
        if (window.Capacitor?.Plugins?.Share) {
            window.Capacitor.Plugins.Share.share({ title: 'Mess Manager', text }).catch(() => {});
        } else if (navigator.share) {
            await navigator.share({ title: 'Mess Manager', text });
        } else {
            navigator.clipboard?.writeText(text).then(() => this.toast('Copied!', 'success'));
        }
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
                    let pic = this._cacheGetGlobal('profilePic');
                    if (!pic && navigator.onLine) {
                        pic = await Promise.race([
                            db.ref(`users/${this.currentUser.uid}/profilePicture`).once('value').then(s => s.val()),
                            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
                        ]);
                        if (pic) this._cacheSetGlobal('profilePic', pic);
                    }
                    if (pic && typeof pic === 'string') {
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

            const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.getElementById('dash-date').textContent = `Today is ${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()} (${weekdays[now.getDay()]})`;

            const [members, todayMeals, noticesData, bzData, mlMData, depAll] = await Promise.all([
                this._dbGet(`messes/${this.messId}/members`, 'members'),
                this._dbGet(`messes/${this.messId}/meals/${todayKey}`, 'meals_today_' + todayKey),
                this._dbGet(`messes/${this.messId}/notices`, 'notices'),
                this._dbGet(`messes/${this.messId}/bazarItems`, 'bazarItems'),
                this._dbGet(`messes/${this.messId}/meals`, 'meals_month'),
                this._dbGet(`messes/${this.messId}/deposits`, 'deposits')
            ]);

            const allMids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare((members[b]?.name || '')));
            const mids = allMids.filter(id => (members[id] || {}).status !== 'pending');
            const uidToName = {};
            allMids.forEach(id => { const n = (members[id] || {}).name; if (n) uidToName[id] = n; });
            const resolveName = (id) => uidToName[id] || id;
            const currentNames = new Set(allMids.map(id => (members[id] || {}).name).filter(Boolean));
            const adminFound = mids.map(id => [id, members[id]]).find(([id, m]) => m && m.role === 'admin');
            let managerName = '-';
            if (adminFound) managerName = adminFound[1].name || '-';
            else if (mids.length) managerName = (members[mids[0]] || {}).name || '-';
            document.getElementById('dash-manager').textContent = managerName;
            document.getElementById('dash-month').textContent = this.fmtMonth(this.getSelMonth().date);

            let bf = 0, ln = 0, dn = 0;
            Object.values(todayMeals).forEach(m => { bf += (m.breakfast || 0); ln += (m.lunch || 0); dn += (m.dinner || 0); });
            document.getElementById('dash-breakfast').textContent = bf;
            document.getElementById('dash-lunch').textContent = ln;
            document.getElementById('dash-dinner').textContent = dn;

            let preview = 'Pin a notice for the whole house';
            if (noticesData && Object.keys(noticesData).length) {
                const entries = Object.entries(noticesData).sort((a, b) => ((a[1]?.createdAt || 0) - (b[1]?.createdAt || 0)));
                if (entries.length) { const v = entries[entries.length - 1][1]; preview = v.body || v.title || preview; }
            }
            document.getElementById('dash-notice-preview').textContent = preview;

            let bazTotal = 0;
            const mealPaidBy = {};
            const utilPaidBy = {};
            Object.values(bzData).forEach(b => {
                if (!b.date || !b.date.startsWith(month)) return;
                const amt = parseFloat(b.cost) || 0;
                const cat = b.category || 'bazar';
                if (cat === 'bazar') {
                    bazTotal += amt;
                    const n = resolveName((b.memberId || '').trim());
                    if (n && n !== 'Manager') mealPaidBy[n] = (mealPaidBy[n] || 0) + amt;
                } else if (cat === 'utility') {
                    const n = resolveName((b.memberId || '').trim());
                    if (n && n !== 'Manager') utilPaidBy[n] = (utilPaidBy[n] || 0) + amt;
                }
            });

            const memberMeals = {};
            let totalMeals = 0;
            Object.entries(mlMData).forEach(([key, d]) => {
                if (key < month + '-01' || key > monthEnd) return;
                Object.entries(d || {}).forEach(([memberName, m]) => {
                    if (!currentNames.has(memberName)) return;
                    const base = (m.breakfast || 0) + (m.lunch || 0) + (m.dinner || 0);
                    memberMeals[memberName] = (memberMeals[memberName] || 0) + base;
                    totalMeals += base;
                });
            });
            const rate = totalMeals > 0 ? bazTotal / totalMeals : 0;
            const mealDepByName = {}; const utilDepByName = {}; let totalDep = 0; let totalMealDep = 0; let totalUtilDep = 0;
            Object.values(depAll).forEach(v => {
                if (!v || typeof v !== 'object') return;
                if (!v.date || !v.date.startsWith(month)) return;
                if (typeof v.amount === 'number' && v.memberId) {
                    totalDep += v.amount;
                    const resolvedId = resolveName(v.memberId);
                    const cat = v.category || 'meal';
                    if (cat === 'utility') {
                        utilDepByName[resolvedId] = (utilDepByName[resolvedId] || 0) + v.amount;
                        totalUtilDep += v.amount;
                    } else {
                        mealDepByName[resolvedId] = (mealDepByName[resolvedId] || 0) + v.amount;
                        totalMealDep += v.amount;
                    }
                }
            });
            Object.entries(mealPaidBy).forEach(([name, amt]) => {
                mealDepByName[name] = (mealDepByName[name] || 0) + amt;
                totalMealDep += amt;
            });
            Object.entries(utilPaidBy).forEach(([name, amt]) => {
                utilDepByName[name] = (utilDepByName[name] || 0) + amt;
                totalUtilDep += amt;
            });

            document.getElementById('dash-deposit').textContent = '৳ ' + this.fmtNum(totalMealDep);
            const finBal = totalMealDep - bazTotal;
            const balEl = document.getElementById('dash-balance');
            balEl.textContent = '৳ ' + this.fmtNum(finBal);
            balEl.className = finBal < 0 ? 'neg' : 'pos';
            document.getElementById('dash-rate').textContent = '৳ ' + rate.toFixed(2);

            let totalRent = 0, totalUtilCost = 0;
            Object.values(bzData).forEach(b => {
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
            Object.values(bzData).forEach(b => {
                const amt = parseFloat(b.cost) || 0;
                if (!amt) return;
                if (!b.date || !b.date.startsWith(month)) return;
                if (b.category === 'utility') {
                    const n = resolveName((b.splitWith || b.memberId || '').trim());
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
                updates[`messes/${this.messId}/permissions/${uid}`] = { bazarEntry: false, mealEntry: false, mealEdit: false, togglePerms: false, manage: false };
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
            const updates = {};
            updates[`messes/${this.messId}/members/${uid}`] = null;
            updates[`users/${uid}/messes/${this.messId}`] = null;
            await db.ref().update(updates);
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
            const members = await this._dbGet(`messes/${this.messId}/members`, 'members');
            const mids = Object.keys(members).sort((a, b) => (members[a]?.name || '').localeCompare((members[b]?.name || '')));
            if (!mids.length) { loader.innerHTML = '<p class="empty-state">No members</p>'; return; }
            const allMeals = await this._dbGet(`messes/${this.messId}/meals`, 'meals_month');
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
        this._hintOffline();
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
        if (saved) { try { this.closeModal(); } catch(e) {} this._skipCache.add('meals_month'); this._cacheClearAll(); this.toast(`${saved} member meal${saved>1?'s':''} saved!`, 'success'); this.navigate('meals'); }
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
            await db.ref(`messes/${this.messId}/meals/${dateKey}/${memberName}/${mealType}`).set(0);
            await db.ref(`messes/${this.messId}/mealHistory`).push({
                member: memberName, date: dateKey, type: typeLabel,
                count: currentVal, action: 'removed', user: userName, createdAt: Date.now()
            });
            this.toast(`${typeLabel} deleted for ${memberName}`, 'success');
            this._skipCache.add('meals_month');
            this._cacheClearAll();
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
                        <div class="amealhist-detail-info">Expense: ৳${Number(v.cost || 0).toLocaleString()} — ${catLabel}</div>
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
        if (!this._bazarFilter) this._bazarFilter = 'bazar';
        const filterBtns = document.querySelectorAll('#abazar-filters .abazar-filter-btn');
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === this._bazarFilter));
        const div = document.getElementById('abazar-list');
        div.innerHTML = '<p class="empty-state">Loading...</p>';
        try {
            const [bazarData, members] = await Promise.all([
                this._dbGet(`messes/${this.messId}/bazarItems`, 'bazarItems'),
                this._dbGet(`messes/${this.messId}/members`, 'members')
            ]);
            this._allBazar = Object.entries(bazarData)
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
            items = items.map(([k, v]) => {
                const count = v.splitWith ? 1 : 0;
                return [k, { ...v, _count: count }];
            });
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
                    <div class="abazar-day-items-head${isUtility ? ' abazar-util-grid' : ''}"><span>ITEM</span>${isUtility ? '<span>MEMBER</span><span>EACH</span>' : '<span>MONEY FROM</span>'}<span>TOTAL</span></div>
                    ${isUtility ? (() => {
                        let html2 = '';
                        const utilItems = dayItems.filter(i => (i.category || 'bazar') === 'utility');
                        const nonUtilItems = dayItems.filter(i => (i.category || 'bazar') !== 'utility');
                        const groups = {};
                        utilItems.forEach(i => {
                            const n = i.name || '-';
                            if (!groups[n]) groups[n] = [];
                            groups[n].push(i);
                        });
                        Object.entries(groups).forEach(([typeName, items]) => {
                            const groupTotal = items.reduce((s, i) => s + (parseFloat(i.cost) || 0), 0);
                            items.forEach(i => {
                                const each = i._count ? Math.round((parseFloat(i.cost) || 0) / i._count * 100) / 100 : parseFloat(i.cost) || 0;
                                html2 += `<div class="abazar-item-row abazar-util-grid" onclick="App.toggleBazarItem(this)">
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
                                <div class="abazar-item-detail-row">${this.esc(i.name || '-')} — ৳${this.fmtNum(parseFloat(i.cost)||0)} (personal, ${this.esc(i.splitWith || 'N/A')})</div>
                                <div class="abazar-item-detail-btns">
                                    <button class="abazar-btn-delete" onclick="event.stopPropagation();App.deleteBazarItem('${i.key}')"><span class="material-icons-round">delete</span> Delete</button>
                                </div>
                            </div>`;
                            });
                            html2 += `<div class="abazar-util-subtotal abazar-util-grid" style="background:var(--bg);font-weight:700;font-size:13px;border-top:2px solid var(--border)">
                                <span>${this.esc(typeName)} (${items.length})</span><span></span><span></span>
                                <span style="color:var(--primary)">৳${this.fmtNum(groupTotal)}</span>
                            </div>`;
                        });
                        nonUtilItems.forEach(i => {
                            const buyerName = (members[i.memberId]||{}).name || i.memberId || '-';
                            html2 += `<div class="abazar-item-row" onclick="App.toggleBazarItem(this)">
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
                        });
                        return html2;
                    })() : dayItems.filter(i => (i.category || 'bazar') !== 'utility').map(i => {
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
        this._cacheClearAll();
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
        const isBazar = category === 'bazar';
        document.getElementById('modal-title').textContent = 'Edit Expense';
        document.getElementById('modal-body').innerHTML = `
            <div class="form-group"><label>Item name</label><input type="text" id="edit-bz-name" value="${this.esc(name)}"></div>
            <div class="form-group"><label>Money from</label><select id="edit-bz-member">${names.map(n => `<option value="${n}" ${n === currentName ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
            <div class="form-group"><label>Date</label><input type="date" id="edit-bz-date" value="${dateVal}"></div>
            <div class="form-group"><label>Expense (৳)</label><input type="number" id="edit-bz-cost" value="${cost}"></div>
            <div class="form-group"><label>Type</label><select id="edit-bz-category"><option value="bazar" ${isBazar?'selected':''}>Meal</option><option value="utility" ${!isBazar?'selected':''}>Utility & Others</option></select></div>`;
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
        const newCategory = document.getElementById('edit-bz-category').value;
        if (!name) { this.toast('Enter name', 'error'); return; }
        if (cost <= 0) { this.toast('Enter cost', 'error'); return; }
        const memberId = memberName;
        const userName = this.currentUser?.displayName || 'Unknown';
        await db.ref(`messes/${this.messId}/bazarItems/${key}`).update({ name, cost, memberId, date, category: newCategory, editedBy: userName, editedAt: Date.now() });
        this.closeModal();
        this._cacheClearAll();
        this.loadBazarList();
        this.toast('Updated!', 'success');
    },

    async loadManagerMoney() {
        if (!this.messId) return;
        const sm = this.getSelMonth();
        const month = sm.key;
        document.getElementById('abalance-month').textContent = this.fmtMonth(sm.date);
        if (!this._depFilter) this._depFilter = 'meal';
        const filterBtns = document.querySelectorAll('#abalance-filters .abazar-filter-btn');
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === this._depFilter));
        const div = document.getElementById('abalance-list');
        div.innerHTML = '<p class="empty-state">Loading...</p>';
        try {
            const [depData, members] = await Promise.all([
                this._dbGet(`messes/${this.messId}/deposits`, 'deposits'),
                this._dbGet(`messes/${this.messId}/members`, 'members')
            ]);
            this._allDeps = Object.entries(depData)
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
        this._cacheClearAll();
        this.loadManagerMoney();
        this.toast('Deleted!', 'success');
    },

    editDeposit(key, memberId, amount, category, date) {
        const members = this._depMembers || {};
        const currentName = memberId || Object.values(members)[0]?.name || '';
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
        const userName = this.currentUser?.displayName || 'Unknown';
        await db.ref(`messes/${this.messId}/deposits/${key}`).update({ memberId: memberName, amount, category, date, editedBy: userName, editedAt: Date.now() });
        this.closeModal();
        this._cacheClearAll();
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
        this._bzUtilMoneyBy = 'Manager';
        this._bzDoneBy = '';
        this._bzTab = 'bazar';
        this._bzUtilType = '';
        this._bzUtilAmount = '';
        this._bzUtilSelected = names.slice();
        document.getElementById('addcost-body').innerHTML = `
            <div class="bz-tabs" style="padding:0 0 8px">
                <button class="bz-tab active" data-tab="bazar" onclick="App.bzSwitchTab('bazar')"><span class="material-icons-round">restaurant</span> Meal</button>
                <button class="bz-tab" data-tab="utility" onclick="App.bzSwitchTab('utility')"><span class="material-icons-round">lightbulb</span> Utility & Others</button>
                <span id="bz-header-total" style="margin-left:auto;font-size:16px;font-weight:700;color:var(--primary)">৳ 0</span>
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
                        <div class="bz-input-wrap bz-cost-wrap"><input class="bz-input" type="number" placeholder="Expense" oninput="App.bzUpdateItem(0,'cost',this.value)"></div>
                    </div>
                </div>
                <button class="bz-add-more" onclick="App.bzAddItemRow()"><span class="material-icons-round">add</span> Add another item</button>
                <p class="bz-hint">Add each item on its own line. The Analysis page can then show which items cost you the most.</p>
            </div>
            <div id="bz-utility-section" style="display:none">
                <div class="dep-label">Type:</div>
                <div class="dep-chips" id="bz-type-chips">
                    ${['Rent','Electricity','Wi-Fi','Cook','Waste Disposal Bill'].map(t => `<button class="dep-chip" data-type="${t}" onclick="App.bzPickType(this)">${t}</button>`).join('')}
                    <button class="dep-chip" onclick="App.bzAddType()"><span class="material-icons-round" style="font-size:16px">add</span> Others</button>
                </div>
                <div class="dep-input-wrap" style="margin:6px 0"><span style="font-size:20px;font-weight:700">৳</span><input class="bz-input" type="number" placeholder="Total bill amount" oninput="App._bzUtilAmount=this.value;App.bzRenderFooter()"></div>
                <div class="dep-label">Expense from:</div>
                <select id="bz-util-money-by" class="bz-util-money-select" onchange="App._bzUtilMoneyBy=this.value">
                    <option value="Manager" selected>Manager</option>
                    ${names.map(n => `<option value="${n}">${n}</option>`).join('')}
                </select>
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
        this._bzUtilMoneyBy = 'Manager';
        this._bzDoneBy = '';
        this._bzTab = 'bazar';
        this._bzUtilType = '';
        this._bzUtilAmount = '';
        this._bzUtilSelected = names.slice();

        document.getElementById('modal-title').textContent = 'Add Expense';
        document.getElementById('modal-body').innerHTML = `
            <div class="bz-tabs" style="padding:0 0 12px">
                <button class="bz-tab active" data-tab="bazar" onclick="App.bzSwitchTab('bazar')"><span class="material-icons-round">restaurant</span> Meal</button>
                <button class="bz-tab" data-tab="utility" onclick="App.bzSwitchTab('utility')"><span class="material-icons-round">lightbulb</span> Utility & Others</button>
                <span id="bz-header-total" style="margin-left:auto;font-size:16px;font-weight:700;color:var(--primary)">৳ 0</span>
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
                        <div class="bz-input-wrap bz-cost-wrap"><input class="bz-input" type="number" placeholder="Expense" oninput="App.bzUpdateItem(0,'cost',this.value)"></div>
                    </div>
                </div>
                <button class="bz-add-more" onclick="App.bzAddItemRow()"><span class="material-icons-round">add</span> Add another item</button>
                <p class="bz-hint">Add each item on its own line. The Analysis page can then show which items cost you the most.</p>
            </div>
            <div id="bz-utility-section" style="display:none">
                <div class="dep-label">Type:</div>
                <div class="dep-chips" id="bz-type-chips">
                    ${['Rent','Electricity','Wi-Fi','Cook','Waste Disposal Bill'].map(t => `<button class="dep-chip" data-type="${t}" onclick="App.bzPickType(this)">${t}</button>`).join('')}
                    <button class="dep-chip" onclick="App.bzAddType()"><span class="material-icons-round" style="font-size:16px">add</span> Others</button>
                </div>
                <div class="dep-input-wrap" style="margin:6px 0"><span style="font-size:20px;font-weight:700">৳</span><input class="bz-input" type="number" placeholder="Total bill amount" oninput="App._bzUtilAmount=this.value;App.bzRenderFooter()"></div>
                <div class="dep-label">Expense from:</div>
                <select id="bz-util-money-by" class="bz-util-money-select" onchange="App._bzUtilMoneyBy=this.value">
                    <option value="Manager" selected>Manager</option>
                    ${names.map(n => `<option value="${n}">${n}</option>`).join('')}
                </select>
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
            <div class="bz-input-wrap bz-cost-wrap"><input class="bz-input" type="number" placeholder="Expense" oninput="App.bzUpdateItem(${idx},'cost',this.value)"></div>`;
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
        const headerTotal = document.getElementById('bz-header-total');
        let sum = 0;
        if (this._bzTab === 'bazar') {
            const items = this._bzItems.filter(i => i.name || i.cost);
            sum = items.reduce((s, i) => s + (parseFloat(i.cost) || 0), 0);
            if (left) { left.textContent = `Money from: ${this._bzMoneyBy || 'none'}  total`; left.style.display = ''; }
            if (total) { total.textContent = '৳ ' + this.fmtNum(sum); total.style.display = ''; }
        } else {
            sum = parseFloat(this._bzUtilAmount) || 0;
            if (left) left.style.display = 'none';
            if (total) total.style.display = 'none';
        }
        if (headerTotal) headerTotal.textContent = '৳ ' + this.fmtNum(sum);
    },

    async bzSave() {
        this._hintOffline();
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
                    memberId: this._bzUtilMoneyBy || 'Manager', splitWith: name, date: dateKey, category: 'utility', addedBy: userName, createdAt: Date.now()
                });
            }
        }
        this.closeModal();
        this._cacheClearAll();
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
        const addedBy = this.currentUser?.displayName || 'Unknown';
        db.ref(`messes/${this.messId}/deposits`).push({ memberId: memberName, amount, date: this._depDate, category, addedBy, createdAt: Date.now() });
        this._cacheClearAll();
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
        this._hintOffline();
        const memberName = this._depSelected;
        const amount = parseFloat(document.getElementById('dep-amount')?.value) || 0;
        if (!memberName) { this.toast('Money from: pick a name', 'error'); return; }
        if (!amount) { this.toast('Enter an amount', 'error'); return; }
        const category = this._depCategory || 'meal';
        const addedBy = this.currentUser?.displayName || 'Unknown';
        await db.ref(`messes/${this.messId}/deposits`).push({ memberId: memberName, amount, date: this._depDate, category, addedBy, createdAt: Date.now() });
        this.closeModal(); this._cacheClearAll(); this.loadManagerMoney(); this.toast('Deposit added!', 'success');
    },

    async loadProfile() {
        if (!this.currentUser) return;
        const u = this.currentUser;
        document.getElementById('prof-name').textContent = u.displayName || 'User';
        document.getElementById('prof-email').textContent = u.email || '-';
        document.getElementById('prof-uid-text').textContent = u.uid ? u.uid.slice(0, 12) + '...' : '-';
        try {
            if (window.Capacitor?.isNativePlatform && window.Capacitor.isNativePlatform()) {
                const info = await Capacitor.Plugins.App.getInfo();
                const vEl = document.querySelector('[data-lang-key="prof_version"]');
                if (vEl) vEl.textContent = `Version ${info.version} (build ${info.build})`;
            }
        } catch (e) {}
        try {
            let photo = this._cacheGetGlobal('profilePic');
            if (!photo) {
                photo = await db.ref(`users/${u.uid}/profilePicture`).once('value').then(s => s.val());
                if (photo) this._cacheSetGlobal('profilePic', photo);
            }
            if (photo && typeof photo === 'string') {
                this.setProfilePic(photo);
            } else {
                const initial = (u.displayName || 'U').charAt(0).toUpperCase();
                const avatar = document.getElementById('prof-avatar');
                if (avatar) avatar.textContent = initial;
            }
        } catch (e) {}
        const saved = localStorage.getItem('mess_theme') || 'light';
        const ot = document.getElementById('prof-oled-theme');
        const toggle = document.getElementById('prof-lang-toggle');
        if (ot) ot.checked = saved === 'oled';
        if (toggle) {
            const lang = localStorage.getItem('mess_lang') || 'en';
            toggle.dataset.lang = lang;
            const labels = toggle.querySelectorAll('.lt-label');
            if (labels[0]) labels[0].classList.toggle('active', lang === 'bn');
            if (labels[1]) labels[1].classList.toggle('active', lang === 'en');
        }
    },

    copyCode() { if (this.messCode) navigator.clipboard.writeText(this.messCode).then(() => this.toast('Copied!', 'info')); },

    toggleOledTheme(checked) {
        if (checked) {
            this.theme = 'oled';
            document.documentElement.setAttribute('data-theme', 'oled');
        } else {
            this.theme = 'light';
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('mess_theme', this.theme);
        this._setSystemBars(this.theme === 'oled' ? '#111111' : '#f2f4f8', this.theme === 'oled' ? '#ffffff' : '#14181f');
    },
    applyTheme() {
        const saved = localStorage.getItem('mess_theme') || 'light';
        this.theme = saved;
        if (saved === 'oled') {
            document.documentElement.setAttribute('data-theme', 'oled');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        const isOled = document.documentElement.getAttribute('data-theme') === 'oled';
        this._setSystemBars(isOled ? '#111111' : '#f2f4f8', isOled ? '#ffffff' : '#14181f');
        const ot = document.getElementById('prof-oled-theme');
        if (ot) ot.checked = saved === 'oled';
    },
    _setSystemBars(bgColor, fgColor) {
        try {
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', bgColor);
            else { const m = document.createElement('meta'); m.name = 'theme-color'; m.content = bgColor; document.head.appendChild(m); }
        } catch (e) {}
        const setBars = (retry) => {
            try {
                if (window.Capacitor?.Plugins?.SystemBars) {
                    window.Capacitor.Plugins.SystemBars.setColors({ color: bgColor });
                    return;
                }
            } catch (e) {}
            try {
                if (window.Capacitor?.Plugins?.StatusBar) {
                    const isDark = bgColor === '#111111';
                    window.Capacitor.Plugins.StatusBar.setStyle({ style: isDark ? 'DARK' : 'LIGHT' });
                    window.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: bgColor });
                }
            } catch (e) {}
            try {
                if (window.Capacitor?.Plugins?.NavigationBar) {
                    window.Capacitor.Plugins.NavigationBar.setNavigationBarColor({ color: bgColor });
                }
            } catch (e) {}
            if (retry > 0) setTimeout(() => setBars(retry - 1), 300);
        };
        setBars(5);
    },
    _setupConnectivity() {
        this._isOnline = navigator.onLine;
        this._showOnlineStatus(this._isOnline);
        window.addEventListener('online', () => {
            this._isOnline = true;
            this._showOnlineStatus(true);
            this._refreshCurrentPage();
        });
        window.addEventListener('offline', () => {
            this._isOnline = false;
            this._showOnlineStatus(false);
        });
        try {
            db.ref('.info/connected').on('value', (snap) => {
                const connected = snap.val();
                if (connected && !this._wasConnected) {
                    this._wasConnected = true;
                    this._flushOfflineQueue();
                    this._refreshCurrentPage();
                } else if (!connected) {
                    this._wasConnected = false;
                }
            });
        } catch (e) {}
    },
    _queueOfflineWrite(path, data, method) {
        try {
            const queue = JSON.parse(localStorage.getItem('mess_offline_queue') || '[]');
            queue.push({ path, data, method: method || 'set', ts: Date.now() });
            localStorage.setItem('mess_offline_queue', JSON.stringify(queue));
        } catch (e) {}
    },
    async _dbWrite(path, data, method) {
        method = method || 'set';
        try {
            if (method === 'set') await db.ref(path).set(data);
            else if (method === 'update') await db.ref(path).update(data);
            else if (method === 'push') await db.ref(path).push(data);
            else if (method === 'remove') await db.ref(path).remove();
        } catch (e) {
            this._queueOfflineWrite(path, data, method);
            if (!navigator.onLine) this.toast('Saved offline — will sync when connected', 'info');
        }
    },
    async _flushOfflineQueue() {
        try {
            const queue = JSON.parse(localStorage.getItem('mess_offline_queue') || '[]');
            if (!queue.length) return;
            const remaining = [];
            for (const item of queue) {
                try {
                    if (item.method === 'set') await db.ref(item.path).set(item.data);
                    else if (item.method === 'push') await db.ref(item.path).push(item.data);
                    else if (item.method === 'update') await db.ref(item.path).update(item.data);
                    else if (item.method === 'remove') await db.ref(item.path).remove();
                } catch (e) { remaining.push(item); }
            }
            localStorage.setItem('mess_offline_queue', JSON.stringify(remaining));
            if (remaining.length < queue.length) this.toast(`Synced ${queue.length - remaining.length} offline change(s)`, 'success');
        } catch (e) {}
    },
    _showOnlineStatus(online) {
        let banner = document.getElementById('connectivity-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'connectivity-banner';
            banner.innerHTML = `<span class="material-icons-round"></span><span class="conn-text"></span>`;
            document.body.appendChild(banner);
        }
        if (online) {
            banner.classList.add('hidden');
            banner.classList.remove('offline');
        } else {
            banner.classList.remove('hidden');
            banner.classList.add('offline');
            banner.querySelector('.material-icons-round').textContent = 'wifi_off';
            banner.querySelector('.conn-text').textContent = 'Offline — changes will sync when connected';
        }
    },
    _refreshCurrentPage() {
        const page = this.currentPage;
        if (!page) return;
        const loaders = {
            dashboard: () => this.loadDashboard(),
            meals: () => this.loadMeals(),
            bazaar: () => this.loadBazarList(),
            balance: () => this.loadManagerMoney(),
            monthly: () => this.loadMonthly(),
            notices: () => this.loadNotices(),
            members: () => this.loadFlat(),
            bazarnote: () => this.loadBazarNote(),
            menu: () => this.loadMenu(),
            mealhistory: () => this.loadMealHistory(),
            profile: () => this.loadProfile(),
            addmeal: () => this.loadAddMeal(),
            addcost: () => this.loadAddCost(),
            adddeposit: () => this.loadAddDeposit(),
        };
        if (loaders[page]) {
            try { loaders[page](); } catch (e) {}
        }
    },
    _hintOffline() {
        if (!navigator.onLine) {
            this.toast('Saved offline — will sync when connected', 'info');
        }
    },
    toggleLanguage() {
        const lang = localStorage.getItem('mess_lang') || 'en';
        const newLang = lang === 'en' ? 'bn' : 'en';
        localStorage.setItem('mess_lang', newLang);
        const toggle = document.getElementById('prof-lang-toggle');
        if (toggle) {
            toggle.dataset.lang = newLang;
            const labels = toggle.querySelectorAll('.lt-label');
            if (labels[0]) labels[0].classList.toggle('active', newLang === 'bn');
            if (labels[1]) labels[1].classList.toggle('active', newLang === 'en');
        }
        this.applyLanguage();
        this.toast(newLang === 'en' ? 'Language: English' : 'Language: বাংলা', 'info');
    },
    shareApp() {
        const text = `Check out Mess Manager — A simple mess management application designed to help users organize shared-mess information, track members, meals, expenses, and monthly calculations in one place.\n\nDownload: https://mahmudulsapp.u.gy/mess-manager`;
        if (window.Capacitor?.Plugins?.Share) {
            window.Capacitor.Plugins.Share.share({ title: 'Mess Manager', text, url: 'https://mahmudulsapp.u.gy/mess-manager' }).catch(() => {});
        } else if (navigator.share) {
            navigator.share({ title: 'Mess Manager', text }).catch(() => {});
        } else {
            navigator.clipboard?.writeText(text).then(() => this.toast('Copied!', 'success'));
        }
    },
    _driveFiles: {
        about: { url: 'about.md', key: 'cache_about_md' },
        contact: { url: 'contact.md', key: 'cache_contact_md' }
    },
    async _cacheDriveFiles() {
        for (const [name, cfg] of Object.entries(this._driveFiles)) {
            try {
                const resp = await fetch(cfg.url);
                const text = await resp.text();
                if (text && text.length > 10 && !text.includes('<!DOCTYPE')) {
                    localStorage.setItem(cfg.key, text);
                } else if (!localStorage.getItem(cfg.key)) {
                    localStorage.setItem(cfg.key, `# ${name === 'about' ? 'About App' : 'Contact Developer'}\n\nContent loading...`);
                }
            } catch (e) {
                if (!localStorage.getItem(cfg.key)) {
                    localStorage.setItem(cfg.key, `# ${name === 'about' ? 'About App' : 'Contact Developer'}\n\nContent loading...`);
                }
            }
        }
    },
    _mdToHtml(md) {
        let html = md
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`(.+?)`/g, '<code>$1</code>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" style="color:var(--primary)">$1</a>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:12px 0">')
            .replace(/\n{2,}/g, '</p><p>')
            .replace(/\n/g, '<br>');
        html = html.replace(/(<li>.*<\/li>)/gs, '<ul style="padding-left:18px;margin:8px 0">$1</ul>');
        return `<div style="font-size:14px;line-height:1.7;color:var(--text)">${html}</div>`;
    },
    aboutApp() {
        const body = document.getElementById('modal-body');
        body.innerHTML = `
            <div style="text-align:center;padding:12px 0 20px">
                <img src="app-icon.png" alt="" style="width:72px;height:72px;border-radius:18px;box-shadow:0 4px 16px rgba(0,0,0,0.15);margin-bottom:12px">
                <h3 style="margin:0;font-size:20px;font-weight:800;color:var(--text)">Mess Manager</h3>
                <p style="margin:4px 0 0;font-size:13px;color:#888">Manage your mess easily</p>
            </div>
            <div style="font-size:14px;color:var(--text);line-height:1.7">
                <h4 style="font-size:15px;margin:16px 0 8px;color:var(--primary)">Overview</h4>
                <p>A simple mess management application designed to help users organize shared-mess information, track members, meals, expenses, and monthly calculations in one place.</p>
                <h4 style="font-size:15px;margin:16px 0 8px;color:var(--primary)">Features</h4>
                <ul style="padding-left:18px;margin:0">
                    <li>Manage mess members</li>
                    <li>Track daily meals</li>
                    <li>Manage meal rates and meal counts</li>
                    <li>Record shared expenses</li>
                    <li>Monthly balance calculations</li>
                    <li>Notice board for announcements</li>
                    <li>Dark theme support</li>
                    <li>Multi-language support (English & Bangla)</li>
                </ul>
                <p style="margin-top:16px;font-size:12px;color:#999;text-align:center">Version ${document.querySelector('[data-lang-key="prof_version"]')?.textContent || '1.3.46'}</p>
            </div>`;
        body.style.maxHeight = '70vh';
        body.style.overflowY = 'auto';
        document.getElementById('modal-title').textContent = 'About App';
        this.openModal();
    },
    contactDeveloper() {
        const body = document.getElementById('modal-body');
        body.innerHTML = `
            <div style="text-align:center;padding:8px 0 20px">
                <div style="width:72px;height:72px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;margin:0 auto 12px;font-family:'Times New Roman',sans-serif">M</div>
                <h3 style="margin:0;font-size:20px;font-weight:800;color:var(--text)">Mahmudul Hasan</h3>
                <p style="margin:6px 0 0;font-size:13px;color:#888;line-height:1.5">I'm an Android developer who enjoys turning ideas into fast, reliable, and user-friendly apps.</p>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;padding:0 4px">
                <a href="https://wa.me/8801712345678" target="_blank" style="display:flex;align-items:center;gap:12px;padding:14px 16px;border:1.5px solid #e0e0e0;border-radius:14px;text-decoration:none;color:var(--text);font-weight:600;font-size:15px;transition:all .2s" onmouseover="this.style.borderColor='#25D366';this.style.background='#f0fff4'" onmouseout="this.style.borderColor='#e0e0e0';this.style.background='transparent'">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                </a>
                <a href="https://m.me/mhasanbogura" target="_blank" style="display:flex;align-items:center;gap:12px;padding:14px 16px;border:1.5px solid #e0e0e0;border-radius:14px;text-decoration:none;color:var(--text);font-weight:600;font-size:15px;transition:all .2s" onmouseover="this.style.borderColor='#0084FF';this.style.background='#f0f7ff'" onmouseout="this.style.borderColor='#e0e0e0';this.style.background='transparent'">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#0084FF"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.2V22l3.04-1.67c.85.24 1.76.37 2.81.37 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1 12.5l-2.5-2.7L5.5 14.5l5.5-5.8 2.5 2.7 4.5-2.7-5.5 5.8z"/></svg>
                    Messenger
                </a>
                <a href="https://instagram.com/mhasanbogura" target="_blank" style="display:flex;align-items:center;gap:12px;padding:14px 16px;border:1.5px solid #e0e0e0;border-radius:14px;text-decoration:none;color:var(--text);font-weight:600;font-size:15px;transition:all .2s" onmouseover="this.style.borderColor='#E4405F';this.style.background='#fff5f7'" onmouseout="this.style.borderColor='#e0e0e0';this.style.background='transparent'">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#E4405F"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    Instagram
                </a>
                <a href="https://github.com/mhasanbogura" target="_blank" style="display:flex;align-items:center;gap:12px;padding:14px 16px;border:1.5px solid #e0e0e0;border-radius:14px;text-decoration:none;color:var(--text);font-weight:600;font-size:15px;transition:all .2s" onmouseover="this.style.borderColor='#333';this.style.background='#f5f5f5'" onmouseout="this.style.borderColor='#e0e0e0';this.style.background='transparent'">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#333"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                </a>
            </div>`;
        body.style.maxHeight = '70vh';
        body.style.overflowY = 'auto';
        document.getElementById('modal-title').textContent = 'Contact Developer';
        this.openModal();
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
        this._hintOffline();
        const inp = document.getElementById('abn-input');
        const name = inp.value.trim();
        if (!name) return;
        try {
            await db.ref(`messes/${this.messId}/bazarNote`).push({ name, addedBy: this.currentUser?.displayName || 'User', createdAt: Date.now() });
            inp.value = '';
            this._cacheClearAll();
            this.loadBazarNote();
        } catch (e) { this.toast('Error: ' + e.message, 'error'); }
    },

    async removeBazarNote(key) {
        try {
            await db.ref(`messes/${this.messId}/bazarNote/${key}`).remove();
            this._cacheClearAll();
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
        this._hintOffline();
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
            this._cacheClearAll();
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
                            <div class="am-stat-card"><small>Expense per meal</small><strong>৳ ${rate.toFixed(2)}</strong><small>Bazar ৳${this.fmtNum(totalMealBazar)}</small><small>÷ Meals ${totalMeals}</small></div>
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
                            <h3>Expense per meal trend</h3>
                            <p class="am-sub">${rateDiff >= 0 ? '▲' : '▼'} ${Math.abs(rateDiff)}% vs last month · ${rateDiff >= 0 ? 'costlier' : 'cheaper'}</p>
                            <div class="am-chart-scroll"><canvas id="am-rate-chart"></canvas></div>
                        </div>
                        ${mealShare.length ? `<div class="am-card">
                            <h3>Meal share by member</h3>
                            <p class="am-sub">Who ate how much of the ${totalMeals} meals</p>
                            <div class="am-donut-wrap">
                                <canvas id="am-donut" width="160" height="160"></canvas>
                                <div class="am-donut-legend">${mealShare.map((m, i) => {
                                const colors = ['#1565C0','#0d4fb5','#FFB300','#2E7D32'];
                                return `<div class="am-donut-item"><span class="am-donut-swatch" style="background:${colors[i % colors.length]}"></span><span class="am-donut-name">${this.esc(m.name)}</span><span class="am-donut-val">${m.meals}</span></div>`;
                            }).join('')}</div>
                            </div>
                        </div>` : ''}
                        <div class="am-card">
                            <h3>Bazar by day</h3>
                            <p class="am-sub">৳ ${this.fmtNum(totalMealBazar)} spent across the month</p>
                            <div class="am-chart-scroll"><canvas id="am-bz-chart"></canvas></div>
                        </div>
                        <div class="am-card">
                            <h3>Meals by day</h3>
                            <p class="am-sub">${totalMeals} meals across the month</p>
                            <div class="am-chart-scroll"><canvas id="am-ml-chart"></canvas></div>
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
                        <div class="am-card">
                            <h3>Balance</h3>
                            <div class="am-calc-row"><span>৳ ${this.fmtNum(totalUtilDep)}</span><span class="am-op">−</span><span>৳ ${this.fmtNum(totalUtility + totalRent)}</span><span class="am-op">=</span><span class="${totalUtilDep - totalUtility - totalRent >= 0 ? 'am-pos' : 'am-neg'}">৳ ${this.fmtNum(totalUtilDep - totalUtility - totalRent)}</span></div>
                            <div class="am-calc-labels"><span>Collection</span><span>Spending</span><span>Balance</span></div>
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
                            <h3>Expense per utility trend</h3>
                            <p class="am-sub">${utilRateDiff >= 0 ? '▲' : '▼'} ${Math.abs(utilRateDiff)}% vs last month · ${utilRateDiff >= 0 ? 'costlier' : 'cheaper'}</p>
                            <div class="am-chart-scroll"><canvas id="am-util-rate-chart"></canvas></div>
                        </div>
                        <div class="am-card">
                            <h3>Utility cost by day</h3>
                            <p class="am-sub">৳ ${this.fmtNum(totalUtilBazar)} utility cost across the month</p>
                            <div class="am-chart-scroll"><canvas id="am-util-bz-chart"></canvas></div>
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
                this.drawBarChart('am-bz-chart', mealBzByDay, daysInMonth, '#FFB300');
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

    _setupHiDPI(canvas, forcedW, forcedH) {
        const dpr = window.devicePixelRatio || 1;
        let displayW = forcedW || 350;
        let displayH = forcedH || 180;
        canvas.style.width = displayW + 'px';
        canvas.style.height = displayH + 'px';
        canvas.width = Math.round(displayW * dpr);
        canvas.height = Math.round(displayH * dpr);
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        return { ctx, w: displayW, h: displayH };
    },

    _drawRoundBar(ctx, x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
    },

    drawRateChart(bzByDay, mealsByDay, days) {
        const c = document.getElementById('am-rate-chart');
        if (!c) return;
        const cw = Math.max(days * 24, 350);
        const { ctx, w, h } = this._setupHiDPI(c, cw, 180);
        const pad = { t: 20, r: 15, b: 30, l: 40 };
        ctx.clearRect(0, 0, w, h);
        const data = [];
        for (let d = 1; d <= days; d++) {
            const bz = bzByDay[d] || 0;
            const ml = mealsByDay[d] || 0;
            data.push(ml > 0 ? bz / ml : 0);
        }
        const maxV = Math.max(...data, 1);
        const xStep = (w - pad.l - pad.r) / (days - 1 || 1);
        const chartH = h - pad.t - pad.b;

        ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        ctx.lineWidth = 1;
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = pad.t + (chartH / gridLines) * i;
            ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        }

        ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
        for (let i = 0; i <= gridLines; i++) {
            const v = maxV - (maxV / gridLines) * i;
            const y = pad.t + (chartH / gridLines) * i;
            ctx.fillText(v % 1 === 0 ? v : v.toFixed(1), pad.l - 6, y + 3);
        }
        ctx.textAlign = 'left';

        const pts = data.map((v, i) => ({
            x: pad.l + i * xStep,
            y: h - pad.b - (v / maxV) * chartH
        }));

        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = '#1565C0';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.lineTo(pts[pts.length - 1].x, h - pad.b);
        ctx.lineTo(pad.l, h - pad.b);
        ctx.closePath();
        ctx.fillStyle = 'rgba(21,101,192,0.08)';
        ctx.fill();

        pts.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#1565C0'; ctx.fill();
            ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#fff'; ctx.fill();
        });

        ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
        for (let d = 1; d <= days; d += Math.ceil(days / 6)) {
            const x = pad.l + (d - 1) * xStep;
            ctx.fillText(d, x, h - 8);
        }
        ctx.textAlign = 'left';
    },

    drawBarChart(canvasId, data, days, color) {
        const c = document.getElementById(canvasId);
        if (!c) return;
        const cw = Math.max(days * 24, 350);
        const { ctx, w, h } = this._setupHiDPI(c, cw, 180);
        const pad = { t: 25, r: 15, b: 30, l: 40 };
        ctx.clearRect(0, 0, w, h);
        const vals = [];
        for (let d = 1; d <= days; d++) vals.push(data[d] || 0);
        const maxV = Math.max(...vals, 1);
        const chartH = h - pad.t - pad.b;
        const chartW = w - pad.l - pad.r;
        const gap = chartW / days;
        const barW = gap * 0.65;

        ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = pad.t + (chartH / 4) * i;
            ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        }

        vals.forEach((v, i) => {
            const x = pad.l + i * gap + (gap - barW) / 2;
            const bh = (v / maxV) * chartH;
            if (bh > 0) {
                ctx.fillStyle = color;
                this._drawRoundBar(ctx, x, h - pad.b - bh, barW, bh, 4);
            }
            if (v > 0) {
                ctx.fillStyle = '#555'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
                ctx.fillText(this.fmtNum(v), x + barW / 2, h - pad.b - bh - 5);
                ctx.textAlign = 'left';
            }
        });

        ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
        const step = days <= 15 ? 1 : days <= 20 ? 2 : Math.ceil(days / 10);
        for (let d = 1; d <= days; d += step) {
            ctx.fillText(d, pad.l + (d - 1) * gap + gap / 2, h - 8);
        }
        ctx.textAlign = 'left';
    },

    drawUtilBzChart(data, days) {
        this.drawBarChart('am-util-bz-chart', data, days, '#F57C00');
    },

    drawMlChart(mealsByDay, days) {
        this.drawBarChart('am-ml-chart', mealsByDay, days, '#26A69A');
    },

    drawUtilRateChart(utilBzByDay, days, memberCount) {
        const c = document.getElementById('am-util-rate-chart');
        if (!c) return;
        const cw = Math.max(days * 24, 350);
        const { ctx, w, h } = this._setupHiDPI(c, cw, 180);
        const pad = { t: 20, r: 15, b: 30, l: 40 };
        ctx.clearRect(0, 0, w, h);
        const data = [];
        for (let d = 1; d <= days; d++) {
            const bz = utilBzByDay[d] || 0;
            data.push(memberCount > 0 ? bz / memberCount : 0);
        }
        const maxV = Math.max(...data, 1);
        const xStep = (w - pad.l - pad.r) / (days - 1 || 1);
        const chartH = h - pad.t - pad.b;

        ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = pad.t + (chartH / 4) * i;
            ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        }

        const pts = data.map((v, i) => ({
            x: pad.l + i * xStep,
            y: h - pad.b - (v / maxV) * chartH
        }));

        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = '#F57C00';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.lineTo(pts[pts.length - 1].x, h - pad.b);
        ctx.lineTo(pad.l, h - pad.b);
        ctx.closePath();
        ctx.fillStyle = 'rgba(245,124,0,0.08)';
        ctx.fill();

        pts.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#F57C00'; ctx.fill();
            ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#fff'; ctx.fill();
        });

        ctx.fillStyle = '#aaa'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
        for (let d = 1; d <= days; d += Math.ceil(days / 6)) {
            const x = pad.l + (d - 1) * xStep;
            ctx.fillText(d, x, h - 8);
        }
        ctx.textAlign = 'left';
    },

    drawDonut(share) {
        const c = document.getElementById('am-donut');
        if (!c) return;
        const { ctx, w, h } = this._setupHiDPI(c, 160, 160);
        const cx = w / 2, cy = h / 2, r = 58, inner = 34;
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
    shareMessCode() {
        if (!this.messCode) return;
        const joinUrl = `${window.location.origin}${window.location.pathname}?join=${this.messCode}`;
        const text = `Join my mess "${this.messName || ''}"\n\n${joinUrl}`;
        if (window.Capacitor?.Plugins?.Share) {
            window.Capacitor.Plugins.Share.share({ title: 'Mess Manager', text }).catch(() => {});
        } else if (navigator.share) {
            navigator.share({ title: 'Mess Manager', text }).catch(() => {});
        } else {
            navigator.clipboard?.writeText(text).then(() => this.toast('Copied!', 'success'));
        }
    },
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
        this._hintOffline();
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
                const messSnap = await db.ref(`users/${uid}/messes`).once('value');
                const messes = messSnap.val() || {};
                const updates = {};
                Object.keys(messes).forEach(mid => {
                    updates[`messes/${mid}/members/${uid}`] = null;
                    updates[`messes/${mid}/permissions/${uid}`] = null;
                });
                updates[`users/${uid}`] = null;
                await db.ref().update(updates);
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
