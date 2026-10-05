"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { repository, DEMO_OWNER_ID } from "@/data/repository";
import { useDemo } from "@/store/demo-store";
import type { AnimalRow } from "@/domain/types";
import { BookingModal } from "./booking-modal";
import { AdviceModal } from "./advice-modal";

interface Ctx {
  pets: AnimalRow[];
  pet: AnimalRow;
  ownerFirstName: string;
  openBooking: (reason?: string) => void;
  openAdvice: (topic?: string) => void;
}

const OwnerCtx = createContext<Ctx | null>(null);

export function OwnerProvider({ children }: { children: ReactNode }) {
  const { state } = useDemo();
  const pets = useMemo(
    () =>
      repository
        .rowsForOwner(DEMO_OWNER_ID)
        .sort((a, b) =>
          a.animal.id === "a-oslo" ? -1 : b.animal.id === "a-oslo" ? 1 : 0,
        ),
    [],
  );
  const pet = pets.find((p) => p.animal.id === state.activePetId) ?? pets[0]!;
  const [booking, setBooking] = useState<{ reason?: string } | null>(null);
  const [advice, setAdvice] = useState<{ topic?: string } | null>(null);

  const openBooking = useCallback(
    (reason?: string) => setBooking({ reason }),
    [],
  );
  const openAdvice = useCallback((topic?: string) => setAdvice({ topic }), []);

  return (
    <OwnerCtx.Provider
      value={{
        pets,
        pet,
        ownerFirstName: pet.owner.firstName,
        openBooking,
        openAdvice,
      }}
    >
      {children}
      {booking && (
        <BookingModal
          onClose={() => setBooking(null)}
          initialReason={booking.reason}
        />
      )}
      {advice && (
        <AdviceModal onClose={() => setAdvice(null)} topic={advice.topic} />
      )}
    </OwnerCtx.Provider>
  );
}

export function useOwner() {
  const c = useContext(OwnerCtx);
  if (!c) throw new Error("useOwner doit être utilisé dans <OwnerProvider>");
  return c;
}
