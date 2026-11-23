"use client";

import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import { Send } from "lucide-react";
import { account, DB_ID, Query, errorMessage, tables } from "@/lib/appwrite/browser";
import { sendCampaign } from "@/lib/actions/campaign";
import { effectiveSubscribers, type SubRow } from "@/lib/admin/subscribers";
import { Btn, Card, Field, Select, TextArea, TextInput, useToast } from "@/components/admin/ui";

const segments = [
  { value: "all", label: "Tous les abonnés" },
  { value: "gestion-projet", label: "Gestion de projet" },
  { value: "finances-perso", label: "Finances perso" },
  { value: "livre", label: "Livres" },
];

const TEMPLATE = `Bonjour,

Voici les nouveautés du mois.

## Nouvel article
**Comment lire sa fiche de paie, ligne par ligne** — chaque bloc expliqué simplement.
[Lire l’article](https://yaoavevor.com/articles/comment-lire-sa-fiche-de-paie)

## Le test du mois
20 questions pour faire le point sur la gestion de projet.
[Faire le test](https://yaoavevor.com/tests)

À très bientôt,`;

export default function NewsletterPage() {
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [body, setBody] = useState(TEMPLATE);
  const [segment, setSegment] = useState("all");
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  useEffect(() => {
    tables
      .listRows({ databaseId: DB_ID, tableId: "subscribers", queries: [Query.limit(5000)] })
      .then((r) => setSubs(r.rows as unknown as SubRow[]))
      .catch((e) => toast(errorMessage(e), "error"));
  }, [toast]);

  const recipients = useMemo(
    () => effectiveSubscribers(subs).filter((s) => s.status !== "unsubscribed" && (segment === "all" || (s.segments ?? "").split(",").includes(segment))).map((s) => s.email),
    [subs, segment],
  );

  async function send(test: boolean) {
    if (!test && !confirm(`Envoyer « ${subject} » à ${recipients.length} abonné(s) ?`)) return;
    setBusy(true);
    try {
      const { jwt } = await account.createJWT();
      const r = await sendCampaign(jwt, { subject, markdown: body, preheader, recipients, test });
      toast(r.message, r.ok ? "ok" : "error");
    } catch (e) {
      toast(errorMessage(e), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display text-4xl text-navy-deep">Newsletter</h1>
        <p className="mt-1 text-sm text-muted">Rédigez, envoyez-vous un test, puis envoyez à vos abonnés. Chaque email porte votre photo, votre signature et un lien de désinscription.</p>
      </header>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-5">
          <Field label="Objet de l’email"><TextInput value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex. 3 réflexes pour piloter un projet en retard" /></Field>
          <Field label="Texte d’aperçu (facultatif)" hint="Affiché à côté de l’objet dans la boîte de réception."><TextInput value={preheader} onChange={(e) => setPreheader(e.target.value)} /></Field>
          <Field label="Destinataires">
            <Select value={segment} onChange={(e) => setSegment(e.target.value)} options={segments} />
          </Field>
          <p className="text-sm text-navy-deep"><strong>{recipients.length}</strong> destinataire(s). Offre gratuite : 100 emails par jour.</p>
          <Field label="Contenu" hint="## titre, **gras**, - liste, [texte du lien](https://…), ![image](URL d’une image de la médiathèque).">
            <TextArea className="min-h-[24rem] font-mono text-[13px]" value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Btn variant="secondary" disabled={busy} onClick={() => send(true)}>Envoyer un test à moi</Btn>
            <Btn disabled={busy || !recipients.length} onClick={() => send(false)}><Send className="size-4" /> Envoyer à {recipients.length} abonné(s)</Btn>
          </div>
        </Card>
        <Card>
          <p className="label-caps text-muted">Aperçu</p>
          <div className="mt-4 rounded-md border border-line">
            <div className="bg-navy-deep px-5 py-4 font-bold tracking-wide text-white">YAO AVEVOR<span className="text-sky">.</span></div>
            <div className="prose-ya p-5 text-[15px]">
              <h2 className="!mt-0 text-[1.4rem] normal-case">{subject || "Objet de l’email"}</h2>
              <div dangerouslySetInnerHTML={{ __html: marked.parse(body, { async: false }) as string }} />
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-4 not-prose">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/email-yao.jpg" alt="" className="size-14 rounded-full border-2 border-sky" />
                <div className="text-sm"><p className="font-bold text-navy-deep">Yao AVEVOR, Ph.D, PMP®</p><p className="text-muted">Gestion de projets industriels · Formateur PMP® (PMI ATP)</p></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
