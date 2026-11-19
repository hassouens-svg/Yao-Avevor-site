import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { SmoothScroll } from "@/components/public/smooth-scroll";
import { Cursor } from "@/components/public/cursor";
import { Preloader } from "@/components/public/preloader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Header />
      <main id="contenu">{children}</main>
      <Footer />
      <Cursor />
    </>
  );
}
