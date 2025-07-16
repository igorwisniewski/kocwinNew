import NavDefault from "@/app/comps/navbar";
import AboutHero from "@/app/onas/comps/aboutHero";
import OurValues from "@/app/onas/comps/ourvalues";
import HistorySection from "@/app/onas/comps/HistorySection";
import CallToAction from "@/app/onas/comps/CallToAction";
import Footer from "@/app/comps/footer";
import ScrollProgressBar from "@/app/comps/scroll";


export default function AboutUsPage() {
    return (
        <>
            <NavDefault />
            <ScrollProgressBar/>
            <main>
                <AboutHero />
                <OurValues />
                <HistorySection />
                <CallToAction />
            </main>
            <Footer />
        </>
    );
}