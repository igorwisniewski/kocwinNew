import NavDefault from "@/app/comps/navbar";
import ContactHeader from "@/app/kontakt/comps/ContactHeader";
import ContactFormSection from "@/app/kontakt/comps/ContactFormSection";
import Footer from "@/app/comps/footer";
import { getPageSections, getGlobalSettings } from "@/lib/cms";

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
    const [sections, settings] = await Promise.all([
        getPageSections('kontakt'),
        getGlobalSettings(),
    ]);

    return (
        <>
            <NavDefault settings={settings} />
            <main className="min-h-screen">
                <ContactHeader content={sections.header} />
                <ContactFormSection details={sections.details} form={sections.form} />
            </main>
            <Footer settings={settings} />
        </>
    );
}
