import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import NotFoundContent from "./(public)/not-found";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
