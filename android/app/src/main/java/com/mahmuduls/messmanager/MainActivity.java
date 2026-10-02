package com.mahmuduls.messmanager;

import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.Window;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.content.SharedPreferences;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleEventObserver;
import androidx.lifecycle.LifecycleOwner;

import com.getcapacitor.BridgeActivity;
import com.capacitorjs.plugins.statusbar.StatusBarPlugin;
import ee.forgr.capacitor_navigation_bar.CapgoNavigationBarPlugin;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity implements LifecycleEventObserver {
    private Handler mainHandler;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        mainHandler = new Handler(Looper.getMainLooper());
        registerPlugin(StatusBarPlugin.class);
        registerPlugin(CapgoNavigationBarPlugin.class);
        registerPlugin(SystemBarsPlugin.class);
        registerPlugin(GoogleAuth.class);

        // Transparent system bars: the page draws behind them and shows through,
        // so the bars always match the current app background (App Store style).
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        applySavedBarAppearance();

        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();
        webView.addJavascriptInterface(new WebAppInterface(), "AndroidBridge");

        getLifecycle().addObserver(this);

        applySavedBarAppearance();
    }

    @Override
    public void onStateChanged(LifecycleOwner source, Lifecycle.Event event) {
        if (event == Lifecycle.Event.ON_RESUME) {
            applySavedBarAppearance();
            pushDarkModeToWebView();
        }
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        pushDarkModeToWebView();
    }

    private void pushDarkModeToWebView() {
        if (mainHandler == null) return;
        mainHandler.postDelayed(() -> {
            try {
                WebView webView = getBridge().getWebView();
                boolean isDark = isSystemDarkMode();
                webView.evaluateJavascript(
                    "window._androidDarkMode=" + isDark + ";if(typeof App!=='undefined'&&typeof App.applyTheme==='function')App.applyTheme()",
                    null);
            } catch (Exception e) {}
        }, 150);
    }

    private boolean isSystemDarkMode() {
        int nightMask = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        return nightMask == Configuration.UI_MODE_NIGHT_YES;
    }

    private void applySavedBarAppearance() {
        SharedPreferences prefs = getSharedPreferences("MessManager", MODE_PRIVATE);
        String savedTheme = prefs.getString("theme", "system");
        boolean isDark = "system".equals(savedTheme) ? isSystemDarkMode() : "oled".equals(savedTheme);
        applyBarAppearance(isDark ? "#0a0a0a" : "#f2f4f8");
    }

    private void applyBarAppearance(String colorHex) {
        try {
            Window window = getWindow();
            boolean light = Color.luminance(Color.parseColor(colorHex)) > 0.5;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                WindowInsetsController controller = window.getInsetsController();
                if (controller != null) {
                    int mask = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                            | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
                    controller.setSystemBarsAppearance(light ? mask : 0, mask);
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                int flags = window.getDecorView().getSystemUiVisibility();
                if (light) {
                    flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                } else {
                    flags &= ~(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
                }
                window.getDecorView().setSystemUiVisibility(flags);
            }
        } catch (Exception e) {}
    }

    public class WebAppInterface {
        @JavascriptInterface
        public boolean isSystemDarkMode() {
            return MainActivity.this.isSystemDarkMode();
        }

        @JavascriptInterface
        public void setStatusBarColor(String colorHex) {
            mainHandler.post(() -> applyBarAppearance(colorHex));
        }

        @JavascriptInterface
        public String getSystemBarInsets() {
            try {
                View decor = getWindow().getDecorView();
                WindowInsetsCompat insets = ViewCompat.getRootWindowInsets(decor);
                if (insets != null) {
                    Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars()
                            | WindowInsetsCompat.Type.displayCutout());
                    return bars.top + "," + bars.bottom;
                }
            } catch (Exception e) {}
            return "0,0";
        }

        @JavascriptInterface
        public void saveTheme(String theme) {
            getSharedPreferences("MessManager", MODE_PRIVATE).edit().putString("theme", theme).apply();
        }
    }
}
