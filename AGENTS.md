<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Monster Can State — Implementation Instructions

## Goal

Persist the status (`FULL | HALF | EMPTY`) of each Monster can across page reloads and app restarts using Zustand + IndexedDB.

---

## 1. Install dependencies

```bash
npm install zustand idb-keyval
```

---

## 2. Create the IndexedDB storage adapter

**`lib/idbStorage.ts`**

```ts
import { get, set, del } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

export const idbStorage: StateStorage = {
  getItem: async (name) => (await get(name)) ?? null,
  setItem: async (name, value) => set(name, value),
  removeItem: async (name) => del(name),
};
```

---

## 3. Create the Zustand store

**`store/useMonsterStore.ts`**

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "@/lib/idbStorage";

export type CanStatus = "FULL" | "HALF" | "EMPTY";

interface MonsterState {
  cans: CanStatus[];
  setCanStatus: (index: number, status: CanStatus) => void;
  resetAll: () => void;
  _hydrated: boolean;
  _setHydrated: (value: boolean) => void;
}

const MONTHLY_MONSTER_AMOUNT = 18;
const DEFAULT_CANS: CanStatus[] = Array(MONTHLY_MONSTER_AMOUNT).fill("FULL");

export const useMonsterStore = create<MonsterState>()(
  persist(
    (set) => ({
      cans: DEFAULT_CANS,
      _hydrated: false,
      _setHydrated: (value) => set({ _hydrated: value }),
      setCanStatus: (index, status) =>
        set((state) => {
          const updated = [...state.cans];
          updated[index] = status;
          return { cans: updated };
        }),
      resetAll: () => set({ cans: DEFAULT_CANS }),
    }),
    {
      name: "monster-storage",
      storage: createJSONStorage(() => idbStorage),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated(true);
      },
    },
  ),
);
```

---

## 4. Update `MonsterCan` to read/write from the store

**`components/monster.tsx`**

The component needs two new props: its `index` in the grid, and access to `setCanStatus` from the store.

```tsx
"use client";

import Image from "next/image";
import fullCan from "@/public/full-can.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useMonsterStore, type CanStatus } from "@/store/useMonsterStore";
import { useState } from "react";

interface MonsterCanProps {
  index: number;
  status: CanStatus;
}

const ALL_STATUSES: { value: CanStatus; label: string }[] = [
  { value: "FULL", label: "Weer vol" },
  { value: "HALF", label: "Voor de helft" },
  { value: "EMPTY", label: "Helemaal op" },
];

export const MonsterCan = ({ index, status }: MonsterCanProps) => {
  const setCanStatus = useMonsterStore((s) => s.setCanStatus);
  const [open, setOpen] = useState(false);
  const otherStatuses = ALL_STATUSES.filter((s) => s.value !== status);

  const handleSelect = (newStatus: CanStatus) => {
    setCanStatus(index, newStatus);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="relative w-12">
          <Image src={fullCan} alt="" className="w-12 block" />
          {status === "HALF" && (
            <div className="absolute inset-0 bg-linear-to-b from-white/80 from-50% to-transparent to-50%" />
          )}
          {status === "EMPTY" && (
            <div className="absolute inset-0 bg-white/80" />
          )}
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Was het lekker?</DialogTitle>
          <DialogDescription>Tuurlijk was het lekker...</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2">
          {otherStatuses.map((s) => (
            <Button key={s.value} onClick={() => handleSelect(s.value)}>
              {s.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 5. Update the page

**`app/page.tsx`**

```tsx
"use client";

import { MonsterCan } from "@/components/monster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMonsterStore } from "@/store/useMonsterStore";

export default function Home() {
  const { cans, resetAll, _hydrated } = useMonsterStore();
  const totalDrunk = cans.filter((s) => s !== "FULL").length;

  // Avoid SSR mismatch — don't render until store is hydrated from IndexedDB
  if (!_hydrated) return null;

  return (
    <main className="container mx-auto p-4 flex flex-col flex-1">
      <div className="flex-1">
        <div className="grid grid-cols-6 gap-4 h-full">
          {cans.map((status, i) => (
            <MonsterCan key={i} index={i} status={status} />
          ))}
        </div>
        <h2>Totaal gedronken: {totalDrunk}</h2>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Alles weer vol</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hebben we weer nieuwe monster? 🤩</DialogTitle>
            <DialogDescription>De goden hebben ons gezegend!</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2">
            <Button onClick={resetAll}>Ja! 😍</Button>
            <Button variant="secondary">Nee! 😭</Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
```

---

## What changed and why

| Change                                      | Reason                                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `cans: CanStatus[]` array in the store      | Tracks status of every can individually by index                                           |
| `idb-keyval` + custom storage adapter       | IndexedDB survives browser restarts and PWA reinstalls; better than `localStorage` for PWA |
| `_hydrated` flag                            | Prevents SSR mismatch — the page only renders after the store has loaded from IndexedDB    |
| `index` prop on `MonsterCan`                | Needed to target the right can in the store when updating                                  |
| `"use client"` on page + component          | Required for Zustand hooks in Next.js App Router                                           |
| Controlled `Dialog` (`open`/`onOpenChange`) | Allows closing the dialog programmatically after selecting a status                        |

---

## File structure

```
├── lib/
│   └── idbStorage.ts          ← IndexedDB adapter
├── store/
│   └── useMonsterStore.ts     ← Zustand store with persistence
├── components/
│   └── monster.tsx            ← Updated to accept index + write to store
└── app/
    └── page.tsx               ← Updated to read from store
```
