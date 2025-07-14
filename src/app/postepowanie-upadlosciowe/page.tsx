import NavDefault from "@/app/comps/navbar";
import BankruptcyHero from "@/app/postepowanie-upadlosciowe/comps/BankruptcyHero";
import WhoIsItFor from "@/app/postepowanie-upadlosciowe/comps/WhoIsItFor";
import ProcessTimeline from "@/app/postepowanie-upadlosciowe/comps/ProcessTimeline";
import BenefitsSection from "@/app/postepowanie-upadlosciowe/comps/BenefitsSection";
import FaqAccordion from "@/app/postepowanie-upadlosciowe/comps/FaqAccordion";
import DocumentsList from "@/app/postepowanie-upadlosciowe/comps/DocumentsList";
import BankruptcyCta from "@/app/postepowanie-upadlosciowe/comps/cta";
import Footer from "@/app/comps/footer";
import ScrollProgressBar from "@/app/comps/scroll";

export default function BankruptcyPage() {
    return (
        <>
            <NavDefault />
            <ScrollProgressBar/>
            <main>
                <BankruptcyHero />
                <WhoIsItFor />
                <ProcessTimeline />
                <BenefitsSection />
                <FaqAccordion />
                <DocumentsList />
                <BankruptcyCta />
            </main>
            <Footer/>
        </>
    );
}