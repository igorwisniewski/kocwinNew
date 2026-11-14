import NavDefault from "@/app/comps/navbar";
import Footer from "@/app/comps/footer";
import { getPageSections, getGlobalSettings } from "@/lib/cms";

export const dynamic = 'force-dynamic';

export default async function PrivacyPolicyPage() {
    const [sections, settings] = await Promise.all([
        getPageSections('polityka-prywatnosci'),
        getGlobalSettings(),
    ]);

    const main = sections.main;
    const title = main?.title || "Polityka prywatności";
    const intro = main?.intro || "Polityka prywatności opisuje zasady przetwarzania przez nas informacji na Twój temat, w tym danych osobowych oraz ciasteczek, czyli tzw. cookies.";
    const policySections = main?.sections || [];

    return (
        <>
            <NavDefault settings={settings} />
            <main className="bg-white min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-24 sm:py-32">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
                        <p className="text-gray-700 leading-relaxed mt-4 max-w-2xl mx-auto">
                            {intro}
                        </p>
                    </div>

                    <div className="space-y-10 text-gray-700 leading-relaxed">
                        {policySections.map((sec: any, idx: number) => (
                            <section key={sec.id || idx} className="border-b border-gray-100 pb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{sec.title}</h2>
                                <div className="whitespace-pre-line text-sm md:text-base leading-relaxed text-gray-700">
                                    {sec.content}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </main>
            <Footer settings={settings} />
        </>
    );
}
