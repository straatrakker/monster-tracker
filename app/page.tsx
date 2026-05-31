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
