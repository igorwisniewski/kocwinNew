import NavDefault from "@/app/comps/navbar";
import ContactHeader from "@/app/kontakt/comps/ContactHeader";
import ContactFormSection from "@/app/kontakt/comps/ContactFormSection";
import Footer from "@/app/comps/footer";


export default function ContactPage() {
    return (
        <>
            <NavDefault />
            <main className="min-h-screen">
                <ContactHeader />
                <ContactFormSection />
            </main>
            <Footer />
        </>
    );
}