import Image from "next/image";
import fullCan from "@/public/full-can.png";

interface MonsterCanProps {
  status: "FULL" | "HALF" | "EMPTY";
}

export const MonsterCan = ({ status }: MonsterCanProps) => {
  return (
    <div className="relative w-12">
      <Image src={fullCan} alt="" className="w-12 block" />

      {status === "HALF" && (
        <div className="absolute inset-0 bg-linear-to-b from-white/80 from-50% to-transparent to-50%" />
      )}

      {status === "EMPTY" && <div className="absolute inset-0 bg-white/80" />}
    </div>
  );
};
