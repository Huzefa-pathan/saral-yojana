import { Package } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-heading font-bold text-2xl text-primary">
      <div className="bg-primary text-white p-1.5 rounded-lg">
        <Package className="h-6 w-6" />
      </div>
      <span>Saral<span className="text-secondary">Yojana</span></span>
    </div>
  );
}
