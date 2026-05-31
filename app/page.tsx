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
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  const { cans, resetAll, _hydrated } = useMonsterStore();
  const totalDrunk = cans.reduce((total, status) => {
    if (status === "EMPTY") return total + 1;
    if (status === "HALF") return total + 0.5;
    return total;
  }, 0);

  if (!_hydrated) return null;

  return (
    <main className="container mx-auto flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex-1 space-y-6">
        <header className="space-y-2 border-b pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Maandvoorraad
          </p>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              Monster Tracker
            </h1>
            <p className="text-sm text-muted-foreground">
              {cans.length - totalDrunk} van de {cans.length} blikjes over
            </p>
          </div>
        </header>

        <div className="grid grid-cols-6 gap-4">
          {cans.map((status, i) => (
            <MonsterCan key={i} index={i} status={status} />
          ))}
        </div>

        <div className="rounded-2xl bg-secondary p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Totaal opgeslurpt
          </p>
          <p className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            {totalDrunk}{" "}
            {totalDrunk === 1 || totalDrunk === 0.5 ? "blikje" : "blikjes"}
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Alles weer vol</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hebben we weer nieuwe monster? 🤩</DialogTitle>
            <DialogDescription>De goden hebben ons gezegend!</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2">
            <Button
              onClick={() => {
                resetAll();
                setOpen(false);
              }}
            >
              Ja! 😍
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Nee! 😭
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
