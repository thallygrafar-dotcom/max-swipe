import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminUsers() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "thally.grafar@gmail.com"; // TROCA AQUI

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();

      // 🔒 proteção de admin
      if (userData.user?.email !== ADMIN_EMAIL) {
        window.location.href = "/swipe-max";
        return;
      }

      // 🔍 buscar dados
      const { data, error } = await supabase
        .from("swipemax_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setData(data || []);
      }

      setLoading(false);
    };

    init();
  }, []);

  // 🔄 loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Carregando usuários...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-semibold mb-8">
        Admin • Assinaturas
      </h1>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left">
          <thead className="bg-zinc-900 text-zinc-300 text-sm">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Expira em</th>
              <th className="p-4">Último evento</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-zinc-400">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-zinc-800 hover:bg-zinc-900 transition"
                >
                  <td className="p-4">{item.email}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "active"
                          ? "bg-green-600/20 text-green-400"
                          : item.status === "canceled"
                          ? "bg-yellow-600/20 text-yellow-400"
                          : item.status === "refunded"
                          ? "bg-red-600/20 text-red-400"
                          : item.status === "chargeback"
                          ? "bg-red-700/20 text-red-500"
                          : "bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {item.access_expires_at
                      ? new Date(item.access_expires_at).toLocaleString()
                      : "-"}
                  </td>

                  <td className="p-4 text-zinc-400">
                    {item.last_event || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}