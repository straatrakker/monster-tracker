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

const STATUS_LABELS: Record<CanStatus, string> = {
  FULL: "Weer vol",
  HALF: "Voor de helft",
  EMPTY: "Helemaal op",
};

const STATUS_OPTIONS: Record<CanStatus, CanStatus[]> = {
  FULL: ["EMPTY", "HALF"],
  HALF: ["EMPTY", "FULL"],
  EMPTY: ["FULL", "HALF"],
};

export const MonsterCan = ({ index, status }: MonsterCanProps) => {
  const setCanStatus = useMonsterStore((s) => s.setCanStatus);
  const [open, setOpen] = useState(false);
  const otherStatuses = STATUS_OPTIONS[status].map((value) => ({
    value,
    label: STATUS_LABELS[value],
  }));

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
          {otherStatuses.map((s, i) => (
            <Button
              key={s.value}
              variant={i === 0 ? "default" : "secondary"}
              onClick={() => handleSelect(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
