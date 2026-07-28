import './bootstrap';
import '../css/app.css';
import ReactGA from 'react-ga4';
import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { FloatingConsult } from './components/FloatingConsult';

// Extend Window interface for Google Analytics
declare global {
    interface Window {
        dataLayer: any[];
    }
}

const appName = import.meta.env.VITE_APP_NAME || 'Kisantra';

// Legacy Google Analytics initialization (G-307NCLEJ06)
const initLegacyGoogleAnalytics = () => {
    // Add gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-307NCLEJ06';
    document.head.appendChild(script);

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
        window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', 'G-307NCLEJ06');
};

// Initialize Legacy GA
initLegacyGoogleAnalytics();

// Initialize ReactGA (G-ZBBHT60QP9)
ReactGA.initialize("G-ZBBHT60QP9");

// Track page views on Inertia navigation
router.on('navigate', (event) => {
    ReactGA.send({ hitType: "pageview", page: event.detail.page.url, title: document.title });
});

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        ReactGA.initialize("G-ZBBHT60QP9");
        // Track the initial page view
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
        root.render(
            <>
                <App {...props} />
                <FloatingConsult />
            </>
        );
    },
    progress: {
        color: '#14b8a6',
        showSpinner: false,
    },
});


