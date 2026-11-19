"use client";

import { RowsManager } from "@/components/admin/rows-manager";

export default function Page() {
  return (
    <RowsManager
      table="testimonials"
      title="Témoignages & vidéos"
      description="Recommandations écrites et témoignages vidéo. Avec une vidéo, la carte vidéo s’affiche ; sinon, la citation."
      titleKey="name"
      subtitleKey="role"
      orderKey="position"
      defaults={{ name: "", role: "", quote: "", linkedin: "", photo: "", videoUrl: "", poster: "", featured: false, published: true, position: 0 }}
      fields={[
        { key: "name", label: "Nom", type: "text", required: true },
        { key: "role", label: "Poste / légende", type: "text" },
        { key: "quote", label: "Témoignage écrit", type: "textarea" },
        { key: "videoUrl", label: "Vidéo", type: "video", hint: "Envoyez un MP4 ou collez un lien YouTube / Vimeo." },
        { key: "poster", label: "Image d’aperçu de la vidéo", type: "image" },
        { key: "photo", label: "Photo de la personne", type: "image" },
        { key: "linkedin", label: "Profil LinkedIn", type: "url" },
        { key: "position", label: "Ordre d’affichage", type: "number" },
        { key: "published", label: "Publié sur le site", type: "boolean", hint: "Uniquement avec l’accord de la personne." },
      ]}
    />
  );
}
