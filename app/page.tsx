import { MonsterCan } from "@/components/monster";

const MONTHLY_MONSTER_AMOUNT = 18;

export default function Home() {
  return (
    <div className="grid grid-cols-6 gap-4 p-4">
      {Array.from({ length: MONTHLY_MONSTER_AMOUNT }, (_, i) => {
        const status = i < 5 ? "FULL" : i < 10 ? "HALF" : "EMPTY";
        return <MonsterCan key={i} status={status} />;
      })}
    </div>
  );
}
