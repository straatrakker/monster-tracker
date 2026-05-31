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

const MONTHLY_MONSTER_AMOUNT = 18;

export default function Home() {
  return (
    <main className="container mx-auto p-4 flex flex-col flex-1">
      <div className="flex-1">
        <div className="grid grid-cols-6 gap-4 h-full">
          {Array.from({ length: MONTHLY_MONSTER_AMOUNT }, (_, i) => {
            const status = i < 5 ? "FULL" : i < 10 ? "HALF" : "EMPTY";
            return <MonsterCan key={i} status={status} />;
          })}
        </div>
        <h2>Totaal gedronken: {MONTHLY_MONSTER_AMOUNT - 4}</h2>
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
            <Button>Ja! 😍</Button>
            <Button variant="secondary">Nee! 😭</Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
