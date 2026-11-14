'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowPathIcon,
    ArrowRightOnRectangleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    FolderPlusIcon,
    GlobeAltIcon,
    HomeIcon,
    InformationCircleIcon,
    KeyIcon,
    PhoneIcon,
    PlusIcon,
    ServerStackIcon,
    ShieldCheckIcon,
    TrashIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { availableIconNames } from '@/lib/icons';

type Tab =
    | 'db'
    | 'general'
    | 'home'
    | 'onas'
    | 'upadlosc'
    | 'restrukturyzacja'
    | 'kontakt'
    | 'polityka'
    | 'media';

export default function AdminPage() {
    // Auth state
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);

    // Active tab
    const [activeTab, setActiveTab] = useState<Tab>('db');

    // DB Status state
    const [dbStatus, setDbStatus] = useState<any>(null);
    const [testingDb, setTestingDb] = useState(false);
    const [initializingDb, setInitializingDb] = useState(false);

    // Global settings state
    const [settings, setSettings] = useState<any>(null);

    // Page sections state
    const [pageSections, setPageSections] = useState<Record<string, Record<string, any>>>({});
    const [loadingPage, setLoadingPage] = useState<string | null>(null);

    // Notification toast
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Upload state
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    // Check auth on load
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/admin/check-auth');
            const data = await res.json();
            setIsAuthenticated(data.authenticated);
            if (data.authenticated) {
                loadDbStatus();
                loadSettings();
            }
        } catch {
            setIsAuthenticated(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoggingIn(true);
        setLoginError('');
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginUser, password: loginPass }),
            });
            const data = await res.json();
            if (data.success) {
                setIsAuthenticated(true);
                loadDbStatus();
                loadSettings();
                showToast('success', 'Zalogowano pomyślnie!');
            } else {
                setLoginError(data.error || 'Błąd logowania');
            }
        } catch {
            setLoginError('Błąd połączenia z serwerem');
        } finally {
            setLoggingIn(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        setIsAuthenticated(false);
        showToast('success', 'Wylogowano');
    };

    // DB calls
    const loadDbStatus = async () => {
        setTestingDb(true);
        try {
            const res = await fetch('/api/admin/db-status');
            const data = await res.json();
            setDbStatus(data);
        } catch {
            showToast('error', 'Nie udało się pobrać statusu bazy');
        } finally {
            setTestingDb(false);
        }
    };

    const handleInitDb = async (force = false) => {
        if (force && !confirm('Czy na pewno chcesz przywrócić domyślną treść? Nadpisze to obecne rekordy w bazie.')) {
            return;
        }
        setInitializingDb(true);
        try {
            const res = await fetch('/api/admin/db-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ force }),
            });
            const data = await res.json();
            if (data.success) {
                showToast('success', data.message || 'Baza została zainicjalizowana!');
                loadDbStatus();
            } else {
                showToast('error', data.message || 'Błąd inicjalizacji bazy');
            }
        } catch {
            showToast('error', 'Błąd podczas łączenia z API inicjalizacji');
        } finally {
            setInitializingDb(false);
        }
    };

    // Settings
    const loadSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.settings) setSettings(data.settings);
        } catch {
            showToast('error', 'Błąd ładowania ustawień');
        }
    };

    const saveSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings }),
            });
            const data = await res.json();
            if (data.success) {
                showToast('success', 'Ustawienia ogólne zapisane!');
            } else {
                showToast('error', data.error || 'Błąd zapisu ustawień');
            }
        } catch {
            showToast('error', 'Błąd połączenia');
        }
    };

    // Page sections
    const loadPage = async (pageSlug: string) => {
        if (pageSections[pageSlug]) return;
        setLoadingPage(pageSlug);
        try {
            const res = await fetch(`/api/admin/content?page=${pageSlug}`);
            const data = await res.json();
            if (data.sections) {
                setPageSections((prev) => ({ ...prev, [pageSlug]: data.sections }));
            }
        } catch {
            showToast('error', `Błąd ładowania danych strony ${pageSlug}`);
        } finally {
            setLoadingPage(null);
        }
    };

    const saveSection = async (pageSlug: string, sectionKey: string) => {
        const content = pageSections[pageSlug]?.[sectionKey];
        if (content === undefined) return;
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page: pageSlug, section: sectionKey, content }),
            });
            const data = await res.json();
            if (data.success) {
                showToast('success', `Zapisano sekcję: ${sectionKey}`);
            } else {
                showToast('error', data.error || 'Błąd zapisu');
            }
        } catch {
            showToast('error', 'Błąd połączenia podczas zapisu');
        }
    };

    const updateSectionState = (pageSlug: string, sectionKey: string, field: string, val: any) => {
        setPageSections((prev) => {
            const pageData = prev[pageSlug] || {};
            const sectionData = pageData[sectionKey] || {};
            return {
                ...prev,
                [pageSlug]: {
                    ...pageData,
                    [sectionKey]: {
                        ...sectionData,
                        [field]: val,
                    },
                },
            };
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success && data.url) {
                setUploadedFiles((prev) => [data.url, ...prev]);
                showToast('success', `Wgrano plik: ${data.url}`);
            } else {
                showToast('error', data.error || 'Błąd wgrywania pliku');
            }
        } catch {
            showToast('error', 'Błąd serwera podczas wysyłania pliku');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    // Load page sections when tab changes
    useEffect(() => {
        if (!isAuthenticated) return;
        if (activeTab === 'home') loadPage('home');
        if (activeTab === 'onas') loadPage('onas');
        if (activeTab === 'upadlosc') loadPage('postepowanie-upadlosciowe');
        if (activeTab === 'restrukturyzacja') loadPage('postepowanie-restrukturyzacyjne');
        if (activeTab === 'kontakt') loadPage('kontakt');
        if (activeTab === 'polityka') loadPage('polityka-prywatnosci');
    }, [activeTab, isAuthenticated]);

    // Render loading or login
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100">
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-600/20 text-green-400 mb-4 border border-green-500/30">
                            <KeyIcon className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Panel Administracyjny CMS</h1>
                        <p className="text-sm text-slate-400 mt-1">Zaloguj się, aby zarządzać zawartością serwisu</p>
                    </div>

                    {loginError && (
                        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm flex items-start gap-3">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <span>{loginError}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Login użytkownika
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={loginUser}
                                    onChange={(e) => setLoginUser(e.target.value)}
                                    placeholder="np. admin"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Hasło
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <KeyIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={loginPass}
                                    onChange={(e) => setLoginPass(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loggingIn}
                            className="w-full py-3.5 px-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl shadow-lg shadow-green-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loggingIn ? (
                                <>
                                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                    <span>Logowanie...</span>
                                </>
                            ) : (
                                <span>Zaloguj do CMS</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-1">
                        <p>Domyślne logowanie: <strong className="text-slate-300">admin</strong> / <strong className="text-slate-300">admin123</strong></p>
                        <p className="text-[11px] text-slate-600">Możesz zmienić je w pliku .env (ADMIN_USER, ADMIN_PASSWORD)</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            {/* TOAST ALERT */}
            {toast && (
                <div
                    className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md transition-all duration-300 ${
                        toast.type === 'success'
                            ? 'bg-green-950/90 text-green-200 border-green-700'
                            : 'bg-red-950/90 text-red-200 border-red-700'
                    }`}
                >
                    {toast.type === 'success' ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}

            {/* TOP BAR */}
            <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center font-bold text-white shadow-md shadow-green-900/30">
                        CMS
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white tracking-tight">Panel Administracyjny</h1>
                        <p className="text-xs text-slate-400">Twoje Oddłużanie &middot; Zarządzanie treścią strony</p>
                    </div>
                </div>

                {/* DB status pill */}
                <div className="flex items-center gap-3">
                    <div
                        onClick={() => setActiveTab('db')}
                        className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border transition ${
                            dbStatus?.connection?.success
                                ? 'bg-green-950/60 text-green-300 border-green-800 hover:bg-green-900/60'
                                : 'bg-amber-950/60 text-amber-300 border-amber-800 hover:bg-amber-900/60'
                        }`}
                        title="Kliknij, aby przejść do ustawień bazy danych SEOHOST"
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${
                                dbStatus?.connection?.success ? 'bg-green-400 animate-pulse' : 'bg-amber-400'
                            }`}
                        />
                        <span>
                            {dbStatus?.connection?.success
                                ? `MySQL SEOHOST: ${dbStatus.env?.host || 'Połączono'}`
                                : 'Baza MySQL: Tryb domyślny (kliknij)'}
                        </span>
                    </div>

                    <Link
                        href="/"
                        target="_blank"
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
                    >
                        <EyeIcon className="w-4 h-4" />
                        <span>Podgląd strony ↗</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900/70 text-red-300 text-xs font-semibold rounded-lg border border-red-800/60 flex items-center gap-1.5 transition"
                    >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span>Wyloguj</span>
                    </button>
                </div>
            </header>

            {/* MAIN LAYOUT */}
            <div className="flex-1 flex flex-col md:flex-row">
                {/* SIDEBAR TABS */}
                <aside className="w-full md:w-64 bg-slate-900/50 border-r border-slate-800/80 p-4 shrink-0 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
                        Serwer i Baza
                    </div>
                    <button
                        onClick={() => setActiveTab('db')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'db'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <ServerStackIcon className="w-4 h-4" />
                        <span>Baza MySQL (SEOHOST)</span>
                    </button>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2 pt-4">
                        Konfiguracja ogólna
                    </div>
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'general'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <GlobeAltIcon className="w-4 h-4" />
                        <span>Nawigacja, Stopka, Kontakt</span>
                    </button>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2 pt-4">
                        Strony serwisu
                    </div>
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'home'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <HomeIcon className="w-4 h-4" />
                        <span>Strona główna (Home)</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('onas')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'onas'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <InformationCircleIcon className="w-4 h-4" />
                        <span>O nas</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('upadlosc')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'upadlosc'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <ShieldCheckIcon className="w-4 h-4" />
                        <span>Upadłość Konsumencka</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('restrukturyzacja')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'restrukturyzacja'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                        <span>Restrukturyzacja</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('kontakt')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'kontakt'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <PhoneIcon className="w-4 h-4" />
                        <span>Kontakt</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('polityka')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'polityka'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <InformationCircleIcon className="w-4 h-4" />
                        <span>Polityka prywatności</span>
                    </button>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2 pt-4">
                        Narzędzia
                    </div>
                    <button
                        onClick={() => setActiveTab('media')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            activeTab === 'media'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <FolderPlusIcon className="w-4 h-4" />
                        <span>Media & Zdjęcia</span>
                    </button>
                </aside>

                {/* CONTENT AREA */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl">
                    {/* TAB: BAZA MYSQL SEOHOST */}
                    {activeTab === 'db' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <ServerStackIcon className="w-7 h-7 text-green-400" />
                                    <span>Połączenie z bazą MySQL (SEOHOST)</span>
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Konfiguracja oraz status połączenia z zewnętrznym serwerem bazy danych MySQL na hostingu SEOHOST.
                                </p>
                            </div>

                            {/* Status Card */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                                    <div>
                                        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                            Aktualny stan połączenia
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className={`w-3 h-3 rounded-full ${
                                                    dbStatus?.connection?.success ? 'bg-green-500' : 'bg-amber-500'
                                                }`}
                                            />
                                            <span className="text-base font-bold text-white">
                                                {dbStatus?.connection?.success
                                                    ? 'Połączono z serwerem MySQL SEOHOST'
                                                    : 'Brak aktywnego połączenia z MySQL'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={loadDbStatus}
                                            disabled={testingDb}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition disabled:opacity-50"
                                        >
                                            <ArrowPathIcon className={`w-4 h-4 ${testingDb ? 'animate-spin' : ''}`} />
                                            <span>Testuj połączenie</span>
                                        </button>

                                        <button
                                            onClick={() => handleInitDb(false)}
                                            disabled={initializingDb || !dbStatus?.connection?.success}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl shadow transition disabled:opacity-40"
                                        >
                                            {initializingDb ? 'Inicjalizacja...' : 'Zainicjalizuj tabele i dane'}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-5 text-sm">
                                    <div
                                        className={`p-4 rounded-xl border ${
                                            dbStatus?.connection?.success
                                                ? 'bg-green-950/40 border-green-800 text-green-300'
                                                : 'bg-amber-950/40 border-amber-800 text-amber-200'
                                        }`}
                                    >
                                        <p className="font-semibold">{dbStatus?.connection?.message || 'Brak danych'}</p>
                                    </div>
                                </div>

                                {/* Parametry env */}
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
                                        <div className="text-[11px] text-slate-400 font-medium">DB_HOST</div>
                                        <div className="text-sm font-mono text-white mt-1 break-all">
                                            {dbStatus?.env?.host || 'localhost'}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
                                        <div className="text-[11px] text-slate-400 font-medium">DB_PORT</div>
                                        <div className="text-sm font-mono text-white mt-1">
                                            {dbStatus?.env?.port || '3306'}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
                                        <div className="text-[11px] text-slate-400 font-medium">DB_USER</div>
                                        <div className="text-sm font-mono text-white mt-1 break-all">
                                            {dbStatus?.env?.user || '(brak)'}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
                                        <div className="text-[11px] text-slate-400 font-medium">DB_NAME</div>
                                        <div className="text-sm font-mono text-white mt-1 break-all">
                                            {dbStatus?.env?.database || '(brak)'}
                                        </div>
                                    </div>
                                </div>

                                {dbStatus?.connection?.tables && (
                                    <div className="mt-6 pt-5 border-t border-slate-800">
                                        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                                            Tabele w bazie:
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {dbStatus.connection.tables.map((t: string) => (
                                                <span
                                                    key={t}
                                                    className="px-3 py-1 bg-slate-800 text-green-300 font-mono text-xs rounded-lg border border-slate-700"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-3 text-xs text-slate-400">
                                            Liczba rekordów w sekcjach: <strong className="text-white">{dbStatus.stats?.sectionsCount || 0}</strong>,
                                            ustawienia: <strong className="text-white">{dbStatus.stats?.settingsCount || 0}</strong>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Instrukcja krok po kroku dla SEOHOST */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-3">
                                    Jak skonfigurować bazę danych na SEOHOST?
                                </h3>
                                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-900/60 text-green-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-green-700">
                                            1
                                        </div>
                                        <div>
                                            <strong className="text-white">Utwórz bazę danych i użytkownika na SEOHOST:</strong>
                                            <p className="text-slate-400 text-xs mt-0.5">
                                                Zaloguj się do cPanel / DirectAdmin na SEOHOST &rarr; przejdź do <strong className="text-slate-200">Bazy danych MySQL</strong> &rarr; Utwórz nową bazę oraz użytkownika z hasłem, a następnie przypisz użytkownika do bazy z pełnymi uprawnieniami (ALL PRIVILEGES).
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-900/60 text-green-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-green-700">
                                            2
                                        </div>
                                        <div>
                                            <strong className="text-white">Odblokuj dostęp zdalny (Zdalny MySQL):</strong>
                                            <p className="text-slate-400 text-xs mt-0.5">
                                                W cPanel SEOHOST wejdź w zakładkę <strong className="text-slate-200">&bdquo;Zdalny MySQL&rdquo; (Remote MySQL)</strong> i dodaj znak <code className="bg-slate-800 text-green-400 px-1 py-0.5 rounded font-mono">%</code> (zezwolenie dla każdego hosta) lub konkretny adres IP serwera, na którym uruchomiona jest strona.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-900/60 text-green-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-green-700">
                                            3
                                        </div>
                                        <div>
                                            <strong className="text-white">Wpisz dane do pliku .env w projekcie:</strong>
                                            <pre className="mt-2 p-3 bg-slate-950 rounded-xl text-green-400 font-mono text-xs overflow-x-auto border border-slate-800">
DB_HOST=s12.seohost.pl    # lub adres IP serwera z maila powitalnego SEOHOST
DB_PORT=3306
DB_USER=twojlogin_user
DB_PASSWORD=twoje_tajne_haslo
DB_NAME=twojlogin_dbname
                                            </pre>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-900/60 text-green-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-green-700">
                                            4
                                        </div>
                                        <div>
                                            <strong className="text-white">Kliknij &bdquo;Zainicjalizuj tabele i dane&rdquo;:</strong>
                                            <p className="text-slate-400 text-xs mt-0.5">
                                                System automatycznie utworzy tabele i załaduje kompletną treść ze strony. Nie musisz niczego importować ręcznie!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: USTAWIENIA OGÓLNE (NAWIGACJA, STOPKA, DANE) */}
                    {activeTab === 'general' && settings && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                        <GlobeAltIcon className="w-7 h-7 text-green-400" />
                                        <span>Nawigacja, Stopka i Dane Kontaktowe</span>
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Podstawowe informacje o firmie, telefon, email, menu oraz treść stopki.
                                    </p>
                                </div>
                                <button
                                    onClick={saveSettings}
                                    className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-green-900/20 transition flex items-center gap-2"
                                >
                                    <CheckCircleIcon className="w-4 h-4" />
                                    <span>Zapisz ustawienia</span>
                                </button>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-green-400">
                                    Podstawowe dane strony
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                                            Nazwa serwisu / Logo
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.siteName || ''}
                                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                                            Slogan / Podtytuł (w stopce)
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.siteSlogan || ''}
                                            onChange={(e) => setSettings({ ...settings, siteSlogan: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                                            Główny numer telefonu
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.phone || ''}
                                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                                            Główny adres e-mail
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.email || ''}
                                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                                            Napis na przycisku CTA w menu
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.headerCtaText || ''}
                                            onChange={(e) => setSettings({ ...settings, headerCtaText: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">
                                            Link przycisku CTA w menu
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.headerCtaLink || ''}
                                            onChange={(e) => setSettings({ ...settings, headerCtaLink: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Linki nawigacji (menu) */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-green-400">
                                        Linki w menu nawigacyjnym (górna belka)
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const links = settings.navLinks || [];
                                            setSettings({
                                                ...settings,
                                                navLinks: [
                                                    ...links,
                                                    { id: String(Date.now()), label: 'Nowy link', href: '/' },
                                                ],
                                            });
                                        }}
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-green-400 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5"
                                    >
                                        <PlusIcon className="w-3.5 h-3.5" />
                                        <span>Dodaj link</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {(settings.navLinks || []).map((link: any, idx: number) => (
                                        <div
                                            key={link.id || idx}
                                            className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60"
                                        >
                                            <input
                                                type="text"
                                                value={link.label}
                                                onChange={(e) => {
                                                    const updated = [...settings.navLinks];
                                                    updated[idx].label = e.target.value;
                                                    setSettings({ ...settings, navLinks: updated });
                                                }}
                                                placeholder="Etykieta (np. O nas)"
                                                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                            />
                                            <input
                                                type="text"
                                                value={link.href}
                                                onChange={(e) => {
                                                    const updated = [...settings.navLinks];
                                                    updated[idx].href = e.target.value;
                                                    setSettings({ ...settings, navLinks: updated });
                                                }}
                                                placeholder="Adres URL (np. /onas)"
                                                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = settings.navLinks.filter((_: any, i: number) => i !== idx);
                                                    setSettings({ ...settings, navLinks: updated });
                                                }}
                                                className="p-2 text-red-400 hover:bg-red-950/60 rounded-lg border border-red-900/60 transition"
                                                title="Usuń link"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Baner cookies */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-green-400">
                                    Komunikat o ciasteczkach (Cookie Banner)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">Tytuł banera</label>
                                        <input
                                            type="text"
                                            value={settings.cookieBanner?.title || ''}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    cookieBanner: { ...settings.cookieBanner, title: e.target.value },
                                                })
                                            }
                                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">Napis na przycisku zgody</label>
                                        <input
                                            type="text"
                                            value={settings.cookieBanner?.acceptButtonText || ''}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    cookieBanner: { ...settings.cookieBanner, acceptButtonText: e.target.value },
                                                })
                                            }
                                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">Treść komunikatu</label>
                                        <textarea
                                            rows={2}
                                            value={settings.cookieBanner?.description || ''}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    cookieBanner: { ...settings.cookieBanner, description: e.target.value },
                                                })
                                            }
                                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: STRONA GŁÓWNA */}
                    {activeTab === 'home' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <HomeIcon className="w-7 h-7 text-green-400" />
                                    <span>Zarządzanie Stroną Główną</span>
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Możesz edytować każdą sekcję, dodawać nowe opinie, historie spraw, cechy i korzyści.
                                </p>
                            </div>

                            {loadingPage === 'home' ? (
                                <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-3">
                                    <ArrowPathIcon className="w-6 h-6 animate-spin text-green-500" />
                                    <span>Ładowanie sekcji strony głównej...</span>
                                </div>
                            ) : (
                                <>
                                    {/* 1. HERO */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Sekcja Hero (Powitanie)</h3>
                                            <button
                                                onClick={() => saveSection('home', 'hero')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz Hero
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">
                                                    Główny nagłówek (H1)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={pageSections.home?.hero?.title || ''}
                                                    onChange={(e) => updateSectionState('home', 'hero', 'title', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">
                                                    Podtytuł
                                                </label>
                                                <input
                                                    type="text"
                                                    value={pageSections.home?.hero?.subtitle || ''}
                                                    onChange={(e) => updateSectionState('home', 'hero', 'subtitle', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">
                                                    Opis (akapit)
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={pageSections.home?.hero?.description || ''}
                                                    onChange={(e) => updateSectionState('home', 'hero', 'description', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">
                                                    Napis na przycisku
                                                </label>
                                                <input
                                                    type="text"
                                                    value={pageSections.home?.hero?.buttonText || ''}
                                                    onChange={(e) => updateSectionState('home', 'hero', 'buttonText', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">
                                                    Link przycisku
                                                </label>
                                                <input
                                                    type="text"
                                                    value={pageSections.home?.hero?.buttonLink || ''}
                                                    onChange={(e) => updateSectionState('home', 'hero', 'buttonLink', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">
                                                    Ścieżka do zdjęcia w tle (np. /img/tlo.jpg lub URL z biblioteki mediów)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={pageSections.home?.hero?.backgroundImage || ''}
                                                    onChange={(e) => updateSectionState('home', 'hero', 'backgroundImage', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. JAK POMAGAMY */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Sekcja &bdquo;Jak Pomagamy?&rdquo;</h3>
                                            <button
                                                onClick={() => saveSection('home', 'howwehelp')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz sekcję
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Tytuł</label>
                                            <input
                                                type="text"
                                                value={pageSections.home?.howwehelp?.title || ''}
                                                onChange={(e) => updateSectionState('home', 'howwehelp', 'title', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Treść opisu</label>
                                            <textarea
                                                rows={4}
                                                value={pageSections.home?.howwehelp?.description || ''}
                                                onChange={(e) => updateSectionState('home', 'howwehelp', 'description', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* 3. DYSKRECJA */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Sekcja &bdquo;Dyskrecja i zaufanie&rdquo;</h3>
                                            <button
                                                onClick={() => saveSection('home', 'discretion')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz sekcję
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">Tytuł</label>
                                                <input
                                                    type="text"
                                                    value={pageSections.home?.discretion?.title || ''}
                                                    onChange={(e) => updateSectionState('home', 'discretion', 'title', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">Opis</label>
                                                <textarea
                                                    rows={3}
                                                    value={pageSections.home?.discretion?.description || ''}
                                                    onChange={(e) => updateSectionState('home', 'discretion', 'description', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">Zdjęcie (ścieżka)</label>
                                                <input
                                                    type="text"
                                                    value={pageSections.home?.discretion?.image || ''}
                                                    onChange={(e) => updateSectionState('home', 'discretion', 'image', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">Napis na przycisku</label>
                                                <input
                                                    type="text"
                                                    value={pageSections.home?.discretion?.buttonText || ''}
                                                    onChange={(e) => updateSectionState('home', 'discretion', 'buttonText', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. DLACZEGO MY (WHY US) - DYNAMICZNE KAFELKI */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <div>
                                                <h3 className="text-base font-bold text-white">Dlaczego Warto Nam Zaufać (Kafelki)</h3>
                                                <p className="text-xs text-slate-400">Możesz dodawać nowe cechy, edytować ich opisy oraz ikony.</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const current = pageSections.home?.whyus?.items || [];
                                                        const updated = [
                                                            ...current,
                                                            {
                                                                id: String(Date.now()),
                                                                name: 'Nowa cecha',
                                                                description: 'Opis nowej cechy',
                                                                icon: 'ShieldCheckIcon',
                                                            },
                                                        ];
                                                        updateSectionState('home', 'whyus', 'items', updated);
                                                    }}
                                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-green-400 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5"
                                                >
                                                    <PlusIcon className="w-3.5 h-3.5" />
                                                    <span>Dodaj cechę</span>
                                                </button>
                                                <button
                                                    onClick={() => saveSection('home', 'whyus')}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                                >
                                                    Zapisz
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(pageSections.home?.whyus?.items || []).map((item: any, idx: number) => (
                                                <div
                                                    key={item.id || idx}
                                                    className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-green-400">Kafelek #{idx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = pageSections.home.whyus.items.filter((_: any, i: number) => i !== idx);
                                                                updateSectionState('home', 'whyus', 'items', updated);
                                                            }}
                                                            className="text-red-400 hover:text-red-300 p-1"
                                                            title="Usuń ten kafelek"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] text-slate-400 mb-0.5">Tytuł cechy</label>
                                                        <input
                                                            type="text"
                                                            value={item.name}
                                                            onChange={(e) => {
                                                                const updated = [...pageSections.home.whyus.items];
                                                                updated[idx].name = e.target.value;
                                                                updateSectionState('home', 'whyus', 'items', updated);
                                                            }}
                                                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] text-slate-400 mb-0.5">Opis</label>
                                                        <textarea
                                                            rows={2}
                                                            value={item.description}
                                                            onChange={(e) => {
                                                                const updated = [...pageSections.home.whyus.items];
                                                                updated[idx].description = e.target.value;
                                                                updateSectionState('home', 'whyus', 'items', updated);
                                                            }}
                                                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] text-slate-400 mb-0.5">Nazwa ikony</label>
                                                        <select
                                                            value={item.icon || 'ShieldCheckIcon'}
                                                            onChange={(e) => {
                                                                const updated = [...pageSections.home.whyus.items];
                                                                updated[idx].icon = e.target.value;
                                                                updateSectionState('home', 'whyus', 'items', updated);
                                                            }}
                                                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                                        >
                                                            {availableIconNames.map((ic) => (
                                                                <option key={ic} value={ic}>{ic}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 5. HISTORIE KLIENTÓW (CASE STUDIES) */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <div>
                                                <h3 className="text-base font-bold text-white">Historie Sukcesu Klientów (Case Studies)</h3>
                                                <p className="text-xs text-slate-400">Prawdziwe historie, kwoty długów, stopień umorzenia i opisy spraw.</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const current = pageSections.home?.casestudies?.items || [];
                                                        const updated = [
                                                            ...current,
                                                            {
                                                                id: String(Date.now()),
                                                                client: 'Nowy Klient, miasto',
                                                                debtAmount: '100 tys.',
                                                                remissionPercentage: 100,
                                                                remissionAmount: '100 000 zł',
                                                                repaymentPlan: 'brak planu spłaty',
                                                                description: 'Opis sprawy klienta i osiągniętego rezultatu.',
                                                            },
                                                        ];
                                                        updateSectionState('home', 'casestudies', 'items', updated);
                                                    }}
                                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-green-400 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5"
                                                >
                                                    <PlusIcon className="w-3.5 h-3.5" />
                                                    <span>Dodaj historię</span>
                                                </button>
                                                <button
                                                    onClick={() => saveSection('home', 'casestudies')}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                                >
                                                    Zapisz
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {(pageSections.home?.casestudies?.items || []).map((cs: any, idx: number) => (
                                                <div
                                                    key={cs.id || idx}
                                                    className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-green-400">Sprawa #{idx + 1}: {cs.client}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = pageSections.home.casestudies.items.filter((_: any, i: number) => i !== idx);
                                                                updateSectionState('home', 'casestudies', 'items', updated);
                                                            }}
                                                            className="text-red-400 hover:text-red-300 p-1"
                                                            title="Usuń tę sprawę"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                        <div>
                                                            <label className="block text-[11px] text-slate-400 mb-0.5">Klient (np. Pan Jan, 45 lat)</label>
                                                            <input
                                                                type="text"
                                                                value={cs.client}
                                                                onChange={(e) => {
                                                                    const updated = [...pageSections.home.casestudies.items];
                                                                    updated[idx].client = e.target.value;
                                                                    updateSectionState('home', 'casestudies', 'items', updated);
                                                                }}
                                                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[11px] text-slate-400 mb-0.5">Kwota długu (np. 140 tys.)</label>
                                                            <input
                                                                type="text"
                                                                value={cs.debtAmount}
                                                                onChange={(e) => {
                                                                    const updated = [...pageSections.home.casestudies.items];
                                                                    updated[idx].debtAmount = e.target.value;
                                                                    updateSectionState('home', 'casestudies', 'items', updated);
                                                                }}
                                                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[11px] text-slate-400 mb-0.5">% Umorzenia (liczba, np. 95)</label>
                                                            <input
                                                                type="number"
                                                                value={cs.remissionPercentage}
                                                                onChange={(e) => {
                                                                    const updated = [...pageSections.home.casestudies.items];
                                                                    updated[idx].remissionPercentage = Number(e.target.value);
                                                                    updateSectionState('home', 'casestudies', 'items', updated);
                                                                }}
                                                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[11px] text-slate-400 mb-0.5">Umorzono kwotę (np. 129 000 zł)</label>
                                                            <input
                                                                type="text"
                                                                value={cs.remissionAmount}
                                                                onChange={(e) => {
                                                                    const updated = [...pageSections.home.casestudies.items];
                                                                    updated[idx].remissionAmount = e.target.value;
                                                                    updateSectionState('home', 'casestudies', 'items', updated);
                                                                }}
                                                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] text-slate-400 mb-0.5">Opis przebiegu sprawy</label>
                                                        <textarea
                                                            rows={2}
                                                            value={cs.description}
                                                            onChange={(e) => {
                                                                const updated = [...pageSections.home.casestudies.items];
                                                                updated[idx].description = e.target.value;
                                                                updateSectionState('home', 'casestudies', 'items', updated);
                                                            }}
                                                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 6. OPINIE KLIENTÓW (TESTIMONIALS) */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <div>
                                                <h3 className="text-base font-bold text-white">Opinie Klientów (Testimonials)</h3>
                                                <p className="text-xs text-slate-400">Dodawaj nowe opinie, które wyświetlają się w karuzeli.</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const current = pageSections.home?.testimonials?.items || [];
                                                        const updated = [
                                                            ...current,
                                                            {
                                                                id: String(Date.now()),
                                                                author: 'Imię klienta',
                                                                quote: 'Treść opinii klienta...',
                                                            },
                                                        ];
                                                        updateSectionState('home', 'testimonials', 'items', updated);
                                                    }}
                                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-green-400 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5"
                                                >
                                                    <PlusIcon className="w-3.5 h-3.5" />
                                                    <span>Dodaj opinię</span>
                                                </button>
                                                <button
                                                    onClick={() => saveSection('home', 'testimonials')}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                                >
                                                    Zapisz
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(pageSections.home?.testimonials?.items || []).map((t: any, idx: number) => (
                                                <div
                                                    key={t.id || idx}
                                                    className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-green-400">Opinia #{idx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = pageSections.home.testimonials.items.filter((_: any, i: number) => i !== idx);
                                                                updateSectionState('home', 'testimonials', 'items', updated);
                                                            }}
                                                            className="text-red-400 hover:text-red-300 p-1"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] text-slate-400 mb-0.5">Autor</label>
                                                        <input
                                                            type="text"
                                                            value={t.author}
                                                            onChange={(e) => {
                                                                const updated = [...pageSections.home.testimonials.items];
                                                                updated[idx].author = e.target.value;
                                                                updateSectionState('home', 'testimonials', 'items', updated);
                                                            }}
                                                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] text-slate-400 mb-0.5">Cytat / Treść opinii</label>
                                                        <textarea
                                                            rows={3}
                                                            value={t.quote}
                                                            onChange={(e) => {
                                                                const updated = [...pageSections.home.testimonials.items];
                                                                updated[idx].quote = e.target.value;
                                                                updateSectionState('home', 'testimonials', 'items', updated);
                                                            }}
                                                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* TAB: O NAS */}
                    {activeTab === 'onas' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <InformationCircleIcon className="w-7 h-7 text-green-400" />
                                    <span>Zarządzanie Podstroną &bdquo;O nas&rdquo;</span>
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Edycja nagłówka, wartości kancelarii, historii powstania oraz sekcji końcowej.
                                </p>
                            </div>

                            {loadingPage === 'onas' ? (
                                <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-3">
                                    <ArrowPathIcon className="w-6 h-6 animate-spin text-green-500" />
                                    <span>Ładowanie danych...</span>
                                </div>
                            ) : (
                                <>
                                    {/* O NAS HERO */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Nagłówek O nas (Hero)</h3>
                                            <button
                                                onClick={() => saveSection('onas', 'hero')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Tytuł</label>
                                            <input
                                                type="text"
                                                value={pageSections.onas?.hero?.title || ''}
                                                onChange={(e) => updateSectionState('onas', 'hero', 'title', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Opis</label>
                                            <textarea
                                                rows={4}
                                                value={pageSections.onas?.hero?.description || ''}
                                                onChange={(e) => updateSectionState('onas', 'hero', 'description', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* WARTOŚCI */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Nasze Wartości</h3>
                                            <button
                                                onClick={() => saveSection('onas', 'values')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz wartości
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {(pageSections.onas?.values?.items || []).map((val: any, idx: number) => (
                                                <div key={idx} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
                                                    <label className="block text-[11px] text-slate-400">Nazwa wartości</label>
                                                    <input
                                                        type="text"
                                                        value={val.name}
                                                        onChange={(e) => {
                                                            const updated = [...pageSections.onas.values.items];
                                                            updated[idx].name = e.target.value;
                                                            updateSectionState('onas', 'values', 'items', updated);
                                                        }}
                                                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold"
                                                    />
                                                    <label className="block text-[11px] text-slate-400">Opis</label>
                                                    <textarea
                                                        rows={3}
                                                        value={val.description}
                                                        onChange={(e) => {
                                                            const updated = [...pageSections.onas.values.items];
                                                            updated[idx].description = e.target.value;
                                                            updateSectionState('onas', 'values', 'items', updated);
                                                        }}
                                                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* HISTORIA FIRMY */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Nasza Historia</h3>
                                            <button
                                                onClick={() => saveSection('onas', 'history')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz historię
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Tytuł</label>
                                            <input
                                                type="text"
                                                value={pageSections.onas?.history?.title || ''}
                                                onChange={(e) => updateSectionState('onas', 'history', 'title', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Akapit 1</label>
                                            <textarea
                                                rows={4}
                                                value={pageSections.onas?.history?.description1 || ''}
                                                onChange={(e) => updateSectionState('onas', 'history', 'description1', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Akapit 2</label>
                                            <textarea
                                                rows={4}
                                                value={pageSections.onas?.history?.description2 || ''}
                                                onChange={(e) => updateSectionState('onas', 'history', 'description2', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* TAB: UPADŁOŚĆ KONSUMENCKA */}
                    {activeTab === 'upadlosc' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <ShieldCheckIcon className="w-7 h-7 text-green-400" />
                                    <span>Zarządzanie: Postępowanie Upadłościowe</span>
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Edycja sekcji &bdquo;Dla kogo&rdquo;, etapów procedury, korzyści oraz pytań FAQ.
                                </p>
                            </div>

                            {loadingPage === 'postepowanie-upadlosciowe' ? (
                                <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-3">
                                    <ArrowPathIcon className="w-6 h-6 animate-spin text-green-500" />
                                    <span>Ładowanie...</span>
                                </div>
                            ) : (
                                <>
                                    {/* HERO */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Nagłówek Upadłości</h3>
                                            <button
                                                onClick={() => saveSection('postepowanie-upadlosciowe', 'hero')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Tytuł</label>
                                            <input
                                                type="text"
                                                value={pageSections['postepowanie-upadlosciowe']?.hero?.title || ''}
                                                onChange={(e) => updateSectionState('postepowanie-upadlosciowe', 'hero', 'title', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Opis</label>
                                            <textarea
                                                rows={4}
                                                value={pageSections['postepowanie-upadlosciowe']?.hero?.description || ''}
                                                onChange={(e) => updateSectionState('postepowanie-upadlosciowe', 'hero', 'description', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* DLA KOGO */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Dla kogo jest upadłość?</h3>
                                            <button
                                                onClick={() => saveSection('postepowanie-upadlosciowe', 'whoIsItFor')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Tytuł</label>
                                            <input
                                                type="text"
                                                value={pageSections['postepowanie-upadlosciowe']?.whoIsItFor?.title || ''}
                                                onChange={(e) => updateSectionState('postepowanie-upadlosciowe', 'whoIsItFor', 'title', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Punkty listy (każdy punkt w nowej linii)</label>
                                            <textarea
                                                rows={4}
                                                value={(pageSections['postepowanie-upadlosciowe']?.whoIsItFor?.points || []).join('\n')}
                                                onChange={(e) => {
                                                    const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                                                    updateSectionState('postepowanie-upadlosciowe', 'whoIsItFor', 'points', lines);
                                                }}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono text-xs"
                                            />
                                        </div>
                                    </div>

                                    {/* FAQ UPADŁOŚĆ - DODAWANIE / USUWANIE */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <div>
                                                <h3 className="text-base font-bold text-white">Pytania i Odpowiedzi (FAQ)</h3>
                                                <p className="text-xs text-slate-400">Dodawaj nowe pytania i odpowiedzi do rozwijanej listy FAQ.</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const current = pageSections['postepowanie-upadlosciowe']?.faq?.items || [];
                                                        const updated = [
                                                            ...current,
                                                            {
                                                                id: String(Date.now()),
                                                                q: 'Nowe pytanie do FAQ?',
                                                                a: 'Szczegółowa odpowiedź prawna...',
                                                            },
                                                        ];
                                                        updateSectionState('postepowanie-upadlosciowe', 'faq', 'items', updated);
                                                    }}
                                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-green-400 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5"
                                                >
                                                    <PlusIcon className="w-3.5 h-3.5" />
                                                    <span>Dodaj pytanie</span>
                                                </button>
                                                <button
                                                    onClick={() => saveSection('postepowanie-upadlosciowe', 'faq')}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                                >
                                                    Zapisz FAQ
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {(pageSections['postepowanie-upadlosciowe']?.faq?.items || []).map((faq: any, idx: number) => (
                                                <div
                                                    key={faq.id || idx}
                                                    className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-3"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-green-400">Pytanie #{idx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = pageSections['postepowanie-upadlosciowe'].faq.items.filter((_: any, i: number) => i !== idx);
                                                                updateSectionState('postepowanie-upadlosciowe', 'faq', 'items', updated);
                                                            }}
                                                            className="text-red-400 hover:text-red-300 p-1"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] text-slate-400 mb-0.5">Pytanie</label>
                                                        <input
                                                            type="text"
                                                            value={faq.q}
                                                            onChange={(e) => {
                                                                const updated = [...pageSections['postepowanie-upadlosciowe'].faq.items];
                                                                updated[idx].q = e.target.value;
                                                                updateSectionState('postepowanie-upadlosciowe', 'faq', 'items', updated);
                                                            }}
                                                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] text-slate-400 mb-0.5">Odpowiedź</label>
                                                        <textarea
                                                            rows={3}
                                                            value={faq.a}
                                                            onChange={(e) => {
                                                                const updated = [...pageSections['postepowanie-upadlosciowe'].faq.items];
                                                                updated[idx].a = e.target.value;
                                                                updateSectionState('postepowanie-upadlosciowe', 'faq', 'items', updated);
                                                            }}
                                                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* TAB: RESTRUKTURYZACJA */}
                    {activeTab === 'restrukturyzacja' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <ArrowPathIcon className="w-7 h-7 text-green-400" />
                                    <span>Zarządzanie: Restrukturyzacja Firm</span>
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Edycja treści oferty restrukturyzacyjnej dla przedsiębiorców.
                                </p>
                            </div>

                            {loadingPage === 'postepowanie-restrukturyzacyjne' ? (
                                <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-3">
                                    <ArrowPathIcon className="w-6 h-6 animate-spin text-green-500" />
                                    <span>Ładowanie...</span>
                                </div>
                            ) : (
                                <>
                                    {/* HERO */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Nagłówek Restrukturyzacji</h3>
                                            <button
                                                onClick={() => saveSection('postepowanie-restrukturyzacyjne', 'hero')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Tytuł</label>
                                            <input
                                                type="text"
                                                value={pageSections['postepowanie-restrukturyzacyjne']?.hero?.title || ''}
                                                onChange={(e) => updateSectionState('postepowanie-restrukturyzacyjne', 'hero', 'title', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Opis</label>
                                            <textarea
                                                rows={4}
                                                value={pageSections['postepowanie-restrukturyzacyjne']?.hero?.description || ''}
                                                onChange={(e) => updateSectionState('postepowanie-restrukturyzacyjne', 'hero', 'description', e.target.value)}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* DLA KOGO */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Dla kogo jest restrukturyzacja?</h3>
                                            <button
                                                onClick={() => saveSection('postepowanie-restrukturyzacyjne', 'whoIsItFor')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1">Punkty listy (każdy punkt w nowej linii)</label>
                                            <textarea
                                                rows={4}
                                                value={(pageSections['postepowanie-restrukturyzacyjne']?.whoIsItFor?.points || []).join('\n')}
                                                onChange={(e) => {
                                                    const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                                                    updateSectionState('postepowanie-restrukturyzacyjne', 'whoIsItFor', 'points', lines);
                                                }}
                                                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono text-xs"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* TAB: KONTAKT */}
                    {activeTab === 'kontakt' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <PhoneIcon className="w-7 h-7 text-green-400" />
                                    <span>Zarządzanie Stroną Kontakt</span>
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Nagłówki, dane kontaktowe, godziny pracy oraz konfiguracja formularza zgłoszeniowego.
                                </p>
                            </div>

                            {loadingPage === 'kontakt' ? (
                                <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-3">
                                    <ArrowPathIcon className="w-6 h-6 animate-spin text-green-500" />
                                    <span>Ładowanie...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Dane kontaktowe i godziny pracy</h3>
                                            <button
                                                onClick={() => saveSection('kontakt', 'details')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz dane
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">Telefon</label>
                                                <input
                                                    type="text"
                                                    value={pageSections.kontakt?.details?.phone || ''}
                                                    onChange={(e) => updateSectionState('kontakt', 'details', 'phone', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                                                <input
                                                    type="text"
                                                    value={pageSections.kontakt?.details?.email || ''}
                                                    onChange={(e) => updateSectionState('kontakt', 'details', 'email', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">Godziny otwarcia</label>
                                                <input
                                                    type="text"
                                                    value={pageSections.kontakt?.details?.hours || ''}
                                                    onChange={(e) => updateSectionState('kontakt', 'details', 'hours', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                            <h3 className="text-base font-bold text-white">Formularz kontaktowy</h3>
                                            <button
                                                onClick={() => saveSection('kontakt', 'form')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                            >
                                                Zapisz formularz
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">Tytuł nad formularzem</label>
                                                <input
                                                    type="text"
                                                    value={pageSections.kontakt?.form?.title || ''}
                                                    onChange={(e) => updateSectionState('kontakt', 'form', 'title', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1">Endpoint wysyłki (np. Formspree)</label>
                                                <input
                                                    type="text"
                                                    value={pageSections.kontakt?.form?.submitEndpoint || ''}
                                                    onChange={(e) => updateSectionState('kontakt', 'form', 'submitEndpoint', e.target.value)}
                                                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* TAB: POLITYKA PRYWATNOŚCI */}
                    {activeTab === 'polityka' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <InformationCircleIcon className="w-7 h-7 text-green-400" />
                                    <span>Zarządzanie: Polityka Prywatności</span>
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Edycja treści polityki prywatności oraz poszczególnych punktów RODO.
                                </p>
                            </div>

                            {loadingPage === 'polityka-prywatnosci' ? (
                                <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-3">
                                    <ArrowPathIcon className="w-6 h-6 animate-spin text-green-500" />
                                    <span>Ładowanie...</span>
                                </div>
                            ) : (
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                        <h3 className="text-base font-bold text-white">Treść Polityki Prywatności</h3>
                                        <button
                                            onClick={() => saveSection('polityka-prywatnosci', 'main')}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-xl transition"
                                        >
                                            Zapisz politykę
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">Tytuł</label>
                                        <input
                                            type="text"
                                            value={pageSections['polityka-prywatnosci']?.main?.title || ''}
                                            onChange={(e) => updateSectionState('polityka-prywatnosci', 'main', 'title', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1">Wstęp</label>
                                        <textarea
                                            rows={2}
                                            value={pageSections['polityka-prywatnosci']?.main?.intro || ''}
                                            onChange={(e) => updateSectionState('polityka-prywatnosci', 'main', 'intro', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-800">
                                        {(pageSections['polityka-prywatnosci']?.main?.sections || []).map((sec: any, idx: number) => (
                                            <div key={idx} className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
                                                <label className="block text-[11px] text-slate-400">Nagłówek sekcji</label>
                                                <input
                                                    type="text"
                                                    value={sec.title}
                                                    onChange={(e) => {
                                                        const updated = [...pageSections['polityka-prywatnosci'].main.sections];
                                                        updated[idx].title = e.target.value;
                                                        updateSectionState('polityka-prywatnosci', 'main', 'sections', updated);
                                                    }}
                                                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-bold"
                                                />
                                                <label className="block text-[11px] text-slate-400">Treść punktu</label>
                                                <textarea
                                                    rows={4}
                                                    value={sec.content}
                                                    onChange={(e) => {
                                                        const updated = [...pageSections['polityka-prywatnosci'].main.sections];
                                                        updated[idx].content = e.target.value;
                                                        updateSectionState('polityka-prywatnosci', 'main', 'sections', updated);
                                                    }}
                                                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: MEDIA & UPLOAD */}
                    {activeTab === 'media' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <FolderPlusIcon className="w-7 h-7 text-green-400" />
                                    <span>Biblioteka Mediów &amp; Wgrywanie Zdjęć</span>
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Wgraj nowe zdjęcia z dysku i skopiuj ich ścieżkę do użycia w sekcjach hero, dyskrecja, o nas itp.
                                </p>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
                                <div className="inline-flex p-4 rounded-full bg-green-950/60 text-green-400 border border-green-800">
                                    <FolderPlusIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-base font-bold text-white">Wgraj nowy plik lub zdjęcie</h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    Pliki są zapisywane w katalogu public/uploads/ i są natychmiast dostępne na Twojej stronie.
                                </p>

                                <div className="pt-2">
                                    <label className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold text-xs rounded-xl shadow-lg cursor-pointer transition">
                                        <PlusIcon className="w-4 h-4" />
                                        <span>{uploading ? 'Wgrywanie pliku...' : 'Wybierz plik z dysku'}</span>
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                            className="hidden"
                                            accept="image/*,.pdf,.doc,.docx"
                                        />
                                    </label>
                                </div>
                            </div>

                            {uploadedFiles.length > 0 && (
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-green-400">
                                        Ostatnio wgrane pliki w tej sesji
                                    </h3>
                                    <div className="space-y-3">
                                        {uploadedFiles.map((fileUrl) => (
                                            <div
                                                key={fileUrl}
                                                className="flex items-center justify-between p-3.5 bg-slate-800/70 rounded-xl border border-slate-700/60"
                                            >
                                                <span className="font-mono text-xs text-green-300 break-all">{fileUrl}</span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(fileUrl);
                                                        showToast('success', 'Skopiowano adres do schowka!');
                                                    }}
                                                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg shrink-0 ml-3 transition"
                                                >
                                                    Kopiuj link
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                                <h3 className="text-sm font-bold text-white">Istniejące domyślne grafiki w projekcie:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                                    {['/img/tlo.jpg', '/img/discretion.jpg', '/img/office.jpg', '/img/future.jpg', '/img/fallhero.jpg'].map(
                                        (img) => (
                                            <div
                                                key={img}
                                                className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-lg border border-slate-800"
                                            >
                                                <span className="text-slate-300 truncate">{img}</span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(img);
                                                        showToast('success', 'Skopiowano adres grafiki!');
                                                    }}
                                                    className="text-green-400 hover:text-green-300 text-[11px] underline ml-2"
                                                >
                                                    Kopiuj
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
