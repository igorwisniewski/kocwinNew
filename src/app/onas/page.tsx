import NavDefault from "@/app/comps/navbar";
import AboutHero from "@/app/onas/comps/aboutHero";
import OurValues from "@/app/onas/comps/ourvalues";
import TeamSection from "@/app/onas/comps/TeamSection";
import HistorySection from "@/app/onas/comps/HistorySection";
import CallToAction from "@/app/onas/comps/CallToAction";
import Footer from "@/app/comps/footer";


export default function AboutUsPage() {
    return (
        <>
            <NavDefault />
            <main>
                <AboutHero />
                <OurValues />
                <TeamSection />
                <HistorySection />
                <CallToAction />
            </main>
            <Footer />
        </>
    );
}