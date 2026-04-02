import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export default function SwipeHeader() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-black/35 backdrop-blur-xl">
      <div className="border-b border-white/10">
        <div className="mx-auto flex h-[70px] w-full max-w-[1600px] items-center justify-between px-5 md:px-8">
          <h1 className="text-[22px] font-semibold tracking-[-0.04em] text-white md:text-[24px]">
            Swipe<span className="font-bold text-red-500">MAX</span>
          </h1>

          <button
            onClick={handleLogout}
            className="
              inline-flex h-[42px] items-center justify-center gap-2
              rounded-xl border border-white/12
              bg-white/[0.03]
              px-4
              text-[13px] font-medium text-zinc-100
              transition-all duration-200
              hover:border-red-400/30
              hover:bg-red-500/10
              hover:text-white
            "
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}