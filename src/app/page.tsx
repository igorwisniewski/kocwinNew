'use client'
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

export default function Home() {
  return (
    <div>
      <NavDefault/>
        <ScrollProgressBar/>
      <main>
        <Hero/>
          <HowWeHelp/>
          <DiscretionSection/>
          <WhyUs/>
          <HomepageBenefits/>
          <ProcessSection/>
          <CaseStudies/>
          <Testimonials/>
      </main>
      <CookieBanner/>
        <Footer/>
    </div>
  );
}
