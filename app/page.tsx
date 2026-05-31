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
    <main className="container mx-auto p-4 flex flex-col flex-1">
      <div className="flex-1">
        <div className="grid grid-cols-6 gap-4 h-full">
          {cans.map((status, i) => (
            <MonsterCan key={i} index={i} status={status} />
          ))}
        </div>

        <div className="mt-4">
          <h2 className="scroll-m-20 border-t pt-4 text-xl font-semibold tracking-tight first:mt-0">
            Totaal opgeslurpt: {totalDrunk} blikjes
          </h2>
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
