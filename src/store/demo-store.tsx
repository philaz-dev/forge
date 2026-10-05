"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type { Appointment, Channel, ClinicNotification } from "@/domain/types";

/**
 * État de démonstration partagé entre l'espace vétérinaire et l'espace
 * propriétaire (ex. : un rendez-vous demandé côté propriétaire apparaît dans
 * les notifications côté clinique). Persisté dans localStorage uniquement pour
 * le confort de la démo — aucune donnée n'est envoyée nulle part.
 *
 * Plus tard, chaque « slice » deviendra un appel API / une table Supabase :
 *   dismissed / reminders / contacted → table `recommendation_actions`
 *   appointments                       → service de prise de rendez-vous
 *   notifications                      → système de notifications (push/email)
 *   campaignsSent                      → table `campaign_runs` + passerelle d'envoi
 */
export interface DemoState {
  dismissed: string[];
  reminders: Record<string, { date: string; note: string }>;
  contacted: Record<string, { channel: Channel; at: string }>;
  appointments: Appointment[];
  notifications: ClinicNotification[];
  campaignsSent: Record<
    string,
    { count: number; channels: Channel[]; at: string }
  >;
  imported: boolean;
  activePetId: string;
}

const SEED_STATE: DemoState = {
  dismissed: [],
  reminders: {},
  contacted: {},
  appointments: [
    {
      id: "apt-seed-1",
      animalId: "a-oslo",
      ownerId: "o-sophie",
      reason: "Rappel de vaccination",
      date: "2026-12-05",
      time: "10:30",
      vet: "Dr Martin",
      status: "confirme",
      source: "clinique",
    },
  ],
  notifications: [
    {
      id: "n-seed-1",
      at: "2026-10-05T08:12:00",
      kind: "rdv",
      title: "Demande de rendez-vous",
      body: "Camille Durand souhaite un créneau pour Nala (rappel de vaccination).",
      animalId: "a-nala",
      read: false,
    },
    {
      id: "n-seed-2",
      at: "2026-10-04T18:40:00",
      kind: "conseil",
      title: "Demande de conseil",
      body: "Léa Moreau s'interroge sur l'évolution du poids de Rio.",
      animalId: "a-rio",
      read: false,
    },
  ],
  campaignsSent: {},
  imported: false,
  activePetId: "a-oslo",
};

type Action =
  | { type: "hydrate"; state: DemoState }
  | { type: "dismiss"; id: string }
  | { type: "restore"; id: string }
  | { type: "remind"; id: string; date: string; note: string }
  | { type: "contact"; id: string; channel: Channel }
  | { type: "book"; appointment: Appointment; notification: ClinicNotification }
  | { type: "notify"; notification: ClinicNotification }
  | { type: "readAll" }
  | { type: "sendCampaign"; id: string; count: number; channels: Channel[] }
  | { type: "imported" }
  | { type: "activePet"; id: string }
  | { type: "reset" };

function reducer(s: DemoState, a: Action): DemoState {
  switch (a.type) {
    case "hydrate":
      return a.state;
    case "dismiss":
      return s.dismissed.includes(a.id)
        ? s
        : { ...s, dismissed: [...s.dismissed, a.id] };
    case "restore":
      return { ...s, dismissed: s.dismissed.filter((x) => x !== a.id) };
    case "remind":
      return {
        ...s,
        reminders: { ...s.reminders, [a.id]: { date: a.date, note: a.note } },
      };
    case "contact":
      return {
        ...s,
        contacted: {
          ...s.contacted,
          [a.id]: { channel: a.channel, at: new Date().toISOString() },
        },
      };
    case "book":
      return {
        ...s,
        appointments: [...s.appointments, a.appointment],
        notifications: [a.notification, ...s.notifications],
      };
    case "notify":
      return { ...s, notifications: [a.notification, ...s.notifications] };
    case "readAll":
      return {
        ...s,
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      };
    case "sendCampaign":
      return {
        ...s,
        campaignsSent: {
          ...s.campaignsSent,
          [a.id]: {
            count: a.count,
            channels: a.channels,
            at: new Date().toISOString(),
          },
        },
      };
    case "imported":
      return { ...s, imported: true };
    case "activePet":
      return { ...s, activePetId: a.id };
    case "reset":
      return SEED_STATE;
  }
}

const STORAGE_KEY = "vita-demo-v1";

interface Ctx {
  state: DemoState;
  hydrated: boolean;
  dismiss: (id: string) => void;
  restore: (id: string) => void;
  remind: (id: string, date: string, note: string) => void;
  contact: (id: string, channel: Channel) => void;
  book: (
    appointment: Omit<Appointment, "id">,
    notif: { title: string; body: string },
  ) => Appointment;
  notify: (n: Omit<ClinicNotification, "id" | "at" | "read">) => void;
  readAll: () => void;
  sendCampaign: (id: string, count: number, channels: Channel[]) => void;
  markImported: () => void;
  setActivePet: (id: string) => void;
  reset: () => void;
}

const DemoCtx = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, SEED_STATE);
  const hydrated = useRef(false);
  const [, force] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw)
        dispatch({
          type: "hydrate",
          state: { ...SEED_STATE, ...JSON.parse(raw) },
        });
    } catch {
      /* stockage indisponible : on reste sur l'état initial */
    }
    hydrated.current = true;
    force();
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const uid = () => Math.random().toString(36).slice(2, 9);

  const book: Ctx["book"] = useCallback((appointment, notif) => {
    const full: Appointment = { ...appointment, id: `apt-${uid()}` };
    dispatch({
      type: "book",
      appointment: full,
      notification: {
        id: `n-${uid()}`,
        at: new Date().toISOString(),
        kind: "rdv",
        title: notif.title,
        body: notif.body,
        animalId: appointment.animalId,
        read: false,
      },
    });
    return full;
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      hydrated: hydrated.current,
      dismiss: (id) => dispatch({ type: "dismiss", id }),
      restore: (id) => dispatch({ type: "restore", id }),
      remind: (id, date, note) => dispatch({ type: "remind", id, date, note }),
      contact: (id, channel) => dispatch({ type: "contact", id, channel }),
      book,
      notify: (n) =>
        dispatch({
          type: "notify",
          notification: {
            ...n,
            id: `n-${uid()}`,
            at: new Date().toISOString(),
            read: false,
          },
        }),
      readAll: () => dispatch({ type: "readAll" }),
      sendCampaign: (id, count, channels) =>
        dispatch({ type: "sendCampaign", id, count, channels }),
      markImported: () => dispatch({ type: "imported" }),
      setActivePet: (id) => dispatch({ type: "activePet", id }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [state, book],
  );

  return <DemoCtx.Provider value={value}>{children}</DemoCtx.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoCtx);
  if (!ctx) throw new Error("useDemo doit être utilisé dans <DemoProvider>");
  return ctx;
}
