"use client";

import { RowsManager } from "@/components/admin/rows-manager";

export default function Page() {
  return (
    <RowsManager
      table="books"
      title="Livres"
      description="Ajoutez vos livres : couverture, présentation, extraits et liens vers les boutiques."
      titleKey="title"
      subtitleKey="statusLabel"
      orderKey="position"
      jsonKeys={["excerpts", "buyLinks"]}
      defaults={{ title: "", slug: "", subtitle: "", status: "writing", statusLabel: "En cours d’écriture", pitch: "", cover: "", excerpts: [], buyLinks: [], position: 0, published: true }}
      fields={[
        { key: "title", label: "Titre", type: "text", required: true },
        { key: "subtitle", label: "Sous-titre", type: "text" },
        { key: "slug", label: "Adresse (URL)", type: "text", hint: "Laissez vide : créée à partir du titre." },
        { key: "cover", label: "Image de couverture", type: "image", hint: "Sans image, une couverture 3D est générée avec le titre." },
        { key: "status", label: "Statut", type: "select", options: [{ value: "writing", label: "En cours d’écriture" }, { value: "preorder", label: "Précommande" }, { value: "available", label: "Disponible" }] },
        { key: "statusLabel", label: "Texte du badge de statut", type: "text" },
        { key: "pitch", label: "Présentation", type: "textarea" },
        { key: "buyLinks", label: "Liens vers les boutiques", type: "list", fields: [{ key: "label", label: "Nom du bouton (ex. Acheter sur Amazon)" }, { key: "href", label: "Lien (https://…)" }] },
        { key: "excerpts", label: "Extraits", type: "list", fields: [{ key: "title", label: "Titre de l’extrait" }, { key: "body", label: "Texte de l’extrait", long: true }] },
        { key: "position", label: "Ordre d’affichage", type: "number" },
        { key: "published", label: "Publié sur le site", type: "boolean" },
      ]}
    />
  );
}
