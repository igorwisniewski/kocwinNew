import NavDefault from "@/app/comps/navbar";
import Footer from "@/app/comps/footer";
import ScrollProgressBar from "@/app/comps/scroll";
import RestructuringHero from "@/app/restrukturyzacja/comps/RestructuringHero";
import WhoIsItForRestructuring from "@/app/restrukturyzacja/comps/WhoIsItForRestructuring";
import RestructuringTimeline from "@/app/restrukturyzacja/comps/RestructuringTimeline";
import RestructuringBenefits from "@/app/restrukturyzacja/comps/RestructuringBenefits";
import BankruptcyCta from "@/app/postepowanie-upadlosciowe/comps/cta";
import FaqAccordion from "@/app/restrukturyzacja/comps/RestructuringFaq";
import { getGlobalSettings } from "@/lib/cms";

export const dynamic = 'force-dynamic';

export default async function RestructuringPage() {
    const settings = await getGlobalSettings();
    return (
        <>
            <NavDefault settings={settings} />
            <ScrollProgressBar />
            <main>
                <RestructuringHero />
                <WhoIsItForRestructuring />
                <RestructuringTimeline />
                <RestructuringBenefits />
                <FaqAccordion />
                <BankruptcyCta />
            </main>
            <Footer settings={settings} />
        </>
    );
}
