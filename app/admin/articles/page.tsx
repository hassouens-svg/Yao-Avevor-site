"use client";

import { RowsManager } from "@/components/admin/rows-manager";
import { categories } from "@/content/articles";

const covers = ["payslip", "net", "budget", "shield", "exam", "curve", "tax", "growth"].map((v) => ({ value: v, label: v }));

export default function Page() {
  return (
    <RowsManager
      table="articles"
      title="Articles"
      description="Écrivez, modifiez, masquez ou supprimez les articles du site."
      titleKey="title"
      subtitleKey="publishedAt"
      defaults={{ title: "", slug: "", excerpt: "", category: categories[0].slug, readingMinutes: 5, publishedAt: new Date().toISOString().slice(0, 10), cover: "curve", coverImage: "", body: "", published: true }}
      fields={[
        { key: "title", label: "Titre", type: "text", required: true },
        { key: "slug", label: "Adresse (URL)", type: "text", hint: "Laissez vide : elle sera créée à partir du titre." },
        { key: "excerpt", label: "Résumé", type: "textarea" },
        { key: "category", label: "Catégorie", type: "select", options: categories.map((c) => ({ value: c.slug, label: c.name })) },
        { key: "publishedAt", label: "Date de publication", type: "date" },
        { key: "readingMinutes", label: "Temps de lecture (minutes)", type: "number" },
        { key: "coverImage", label: "Image de couverture", type: "image", hint: "Facultatif. Sans image, une couverture graphique est générée." },
        { key: "cover", label: "Couverture graphique (si pas d’image)", type: "select", options: covers },
        { key: "body", label: "Texte de l’article (Markdown)", type: "markdown", hint: "## pour un intertitre, **gras**, - liste, [lien](https://…), ![image](URL). Pour les articles existants, laisser vide conserve la version interactive (fiche de paie, simulateurs)." },
        { key: "published", label: "Publié sur le site", type: "boolean" },
      ]}
    />
  );
}
