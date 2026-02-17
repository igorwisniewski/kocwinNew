import NavDefault from "@/app/comps/navbar";
import Footer from "@/app/comps/footer";
import ScrollProgressBar from "@/app/comps/scroll";
import RestructuringHero from "@/app/restrukturyzacja/comps/RestructuringHero";
import WhoIsItForRestructuring from "@/app/restrukturyzacja/comps/WhoIsItForRestructuring";
import RestructuringTimeline from "@/app/restrukturyzacja/comps/RestructuringTimeline";
import RestructuringBenefits from "@/app/restrukturyzacja/comps/RestructuringBenefits";
import BankruptcyCta from "@/app/postepowanie-upadlosciowe/comps/cta";

function RestructuringFaq() {
    return null;
}

export default function RestructuringPage() {
    return (
        <>
            <NavDefault />
            <ScrollProgressBar/>
            <main>
                <RestructuringHero />
                <WhoIsItForRestructuring />
                <RestructuringTimeline />
                <RestructuringBenefits />
                <RestructuringFaq />
                <BankruptcyCta/>
            </main>
            <Footer/>
        </>
    );
}