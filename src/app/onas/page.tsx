import NavDefault from "@/app/comps/navbar";
import AboutHero from "@/app/onas/comps/aboutHero";
import OurValues from "@/app/onas/comps/ourvalues";
import HistorySection from "@/app/onas/comps/HistorySection";
import CallToAction from "@/app/onas/comps/CallToAction";
import Footer from "@/app/comps/footer";
import ScrollProgressBar from "@/app/comps/scroll";
import { getPageSections, getGlobalSettings } from "@/lib/cms";

export const dynamic = 'force-dynamic';

export default async function AboutUsPage() {
    const [sections, settings] = await Promise.all([
        getPageSections('onas'),
        getGlobalSettings(),
    ]);

    return (
        <>
            <NavDefault settings={settings} />
            <ScrollProgressBar />
            <main>
                <AboutHero content={sections.hero} />
                <OurValues content={sections.values} />
                <HistorySection content={sections.history} />
                <CallToAction content={sections.cta} />
            </main>
            <Footer settings={settings} />
        </>
    );
}
