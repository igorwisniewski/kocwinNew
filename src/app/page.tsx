import NavDefault from "@/app/comps/navbar";
import Hero from "@/app/comps/hero";
import WhyUs from "@/app/comps/whyus";
import HowWeHelp from "@/app/comps/howwehelp";
import Testimonials from "@/app/comps/testimonials";
import Footer from "@/app/comps/footer";
import ScrollProgressBar from "@/app/comps/scroll";
import ProcessSection from "@/app/comps/processstep";
import DiscretionSection from "@/app/comps/discretion";
import CaseStudies from "@/app/comps/CaseStudies";
import HomepageBenefits from "@/app/comps/benefits";
import CookieBanner from "@/app/comps/CookieBannner";
import { getPageSections, getGlobalSettings } from "@/lib/cms";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const [sections, settings] = await Promise.all([
        getPageSections('home'),
        getGlobalSettings(),
    ]);

    return (
        <div>
            <NavDefault settings={settings} />
            <ScrollProgressBar />
            <main>
                <Hero content={sections.hero} />
                <HowWeHelp content={sections.howwehelp} />
                <DiscretionSection content={sections.discretion} />
                <WhyUs content={sections.whyus} />
                <HomepageBenefits content={sections.benefits} />
                <ProcessSection content={sections.process} />
                <CaseStudies content={sections.casestudies} />
                <Testimonials content={sections.testimonials} />
            </main>
            <CookieBanner settings={settings} />
            <Footer settings={settings} />
        </div>
    );
}
