import NavDefault from "@/app/comps/navbar";
import BankruptcyHero from "@/app/postepowanie-upadlosciowe/comps/BankruptcyHero";
import WhoIsItFor from "@/app/postepowanie-upadlosciowe/comps/WhoIsItFor";
import ProcessTimeline from "@/app/postepowanie-upadlosciowe/comps/ProcessTimeline";
import BenefitsSection from "@/app/postepowanie-upadlosciowe/comps/BenefitsSection";
import FaqAccordion from "@/app/postepowanie-upadlosciowe/comps/FaqAccordion";
import BankruptcyCta from "@/app/postepowanie-upadlosciowe/comps/cta";
import Footer from "@/app/comps/footer";
import ScrollProgressBar from "@/app/comps/scroll";
import { getPageSections, getGlobalSettings } from "@/lib/cms";

export const dynamic = 'force-dynamic';

export default async function BankruptcyPage() {
    const [sections, settings] = await Promise.all([
        getPageSections('postepowanie-upadlosciowe'),
        getGlobalSettings(),
    ]);

    return (
        <>
            <NavDefault settings={settings} />
            <ScrollProgressBar />
            <main>
                <BankruptcyHero content={sections.hero} />
                <WhoIsItFor content={sections.whoIsItFor} />
                <ProcessTimeline content={sections.process} />
                <BenefitsSection content={sections.benefits} />
                <FaqAccordion content={sections.faq} />
                <BankruptcyCta content={sections.cta} />
            </main>
            <Footer settings={settings} />
        </>
    );
}
