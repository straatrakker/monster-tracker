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

interface MonsterCanProps {
  status: "FULL" | "HALF" | "EMPTY";
}

export const MonsterCan = ({ status }: MonsterCanProps) => {
  return (
    <Dialog>
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
          <Button>Helemaal</Button>
          <Button>Half</Button>
          <Button>Leeg</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
