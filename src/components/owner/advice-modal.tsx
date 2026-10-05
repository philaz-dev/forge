"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { useDemo } from "@/store/demo-store";
import { useOwner } from "./owner-context";

export function AdviceModal({
  onClose,
  topic,
}: {
  onClose: () => void;
  topic?: string;
}) {
  const { pet } = useOwner();
  const { notify } = useDemo();
  const toast = useToast();
  const [text, setText] = useState(
    topic === "poids"
      ? `Bonjour, pourriez-vous m'indiquer comment accompagner l'évolution du poids de ${pet.animal.name} ?`
      : "",
  );
  return (
    <Modal
      open
      onClose={onClose}
      warm
      title="Demander conseil"
      description={`Un vétérinaire vous répond sous 24 h à propos de ${pet.animal.name}.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            disabled={!text.trim()}
            icon={<Send size={15} />}
            onClick={() => {
              notify({
                kind: "conseil",
                title: "Demande de conseil",
                body: `${pet.owner.firstName} ${pet.owner.lastName} : « ${text.trim().slice(0, 110)}${text.length > 110 ? "…" : ""} »`,
                animalId: pet.animal.id,
              });
              toast({
                title: "Message transmis à la clinique",
                description:
                  "Démo : retrouvez-le dans les notifications de l'espace vétérinaire.",
              });
              onClose();
            }}
          >
            Envoyer
          </Button>
        </>
      }
    >
      <Field label="Votre question">
        <Textarea
          className="min-h-[140px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrivez votre message…"
        />
      </Field>
    </Modal>
  );
}
