import Link from "next/link";

export default function Footer({ settings }: { settings?: any }) {
    const siteName = settings?.siteName || "Twoje Oddłużanie";
    const siteSlogan = settings?.siteSlogan || "Twój problem, nasze rozwiązanie";
    const phone = settings?.phone || "+48 796 464 273";
    const email = settings?.email || "kontakt@twojeoddluzanie.pl";
    const address = settings?.address || "";
    const copyright = settings?.copyrightText || "© 2025 Twoje Oddłużanie. Wszelkie prawa zastrzeżone.";
    const footerLinks = settings?.footerLinks || [
        { label: "Strona główna", href: "/" },
        { label: "O nas", href: "/onas" },
        { label: "Postępowanie Upadłościowe", href: "/postepowanie-upadlosciowe" },
        { label: "Kontakt", href: "/kontakt" },
        { label: "Polityka Prywatności", href: "/polityka-prywatnosci" },
    ];

    return (
        <footer className="bg-neutral-900 text-white py-10 z-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="font-bold text-lg mb-2">{siteName}</h3>
                    <p className="text-sm text-gray-400">{siteSlogan}</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Linki</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                        {footerLinks.map((link: any, idx: number) => (
                            <li key={link.id || link.href || idx}>
                                <Link href={link.href} className="hover:underline">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Kontakt</h4>
                    <p className="text-sm text-gray-300">
                        tel: <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:underline">{phone}</a>
                        <br />
                        email: <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                        {address && (
                            <>
                                <br />
                                {address}
                            </>
                        )}
                    </p>
                </div>
            </div>
            <div className="text-center mt-8 text-xs text-gray-400">
                {copyright} Stworzone przez <Link href="https://wisstack.pl/" className="hover:underline text-gray-300">WISSTACK</Link>
            </div>
        </footer>
    );
}
