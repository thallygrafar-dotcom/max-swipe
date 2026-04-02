import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Mail, Loader2 } from "lucide-react";

interface AllowedEmail {
  id: string;
  email: string;
  created_at: string;
}

const AllowedEmailsManager = () => {
  const [emails, setEmails] = useState<AllowedEmail[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const fetchEmails = async () => {
    const { data, error } = await supabase
      .from("allowed_emails" as any)
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast({ title: "Erro", description: "Falha ao carregar emails.", variant: "destructive" });
    } else {
      setEmails((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) return;

    setAdding(true);
    const { error } = await supabase
      .from("allowed_emails" as any)
      .insert({ email: trimmed } as any);

    if (error) {
      const msg = error.message.includes("duplicate")
        ? "Este email já está na lista."
        : error.message;
      toast({ title: "Erro", description: msg, variant: "destructive" });
    } else {
      toast({ title: "Adicionado!", description: `${trimmed} foi autorizado.` });
      setNewEmail("");
      fetchEmails();
    }
    setAdding(false);
  };

  const handleDelete = async (id: string, email: string) => {
    if (emails.length <= 1) {
      toast({ title: "Ação bloqueada", description: "Deve haver pelo menos 1 email autorizado.", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("allowed_emails" as any)
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Erro", description: "Falha ao remover email.", variant: "destructive" });
    } else {
      toast({ title: "Removido", description: `${email} foi removido.` });
      fetchEmails();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Emails Autorizados</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Apenas estes emails poderão cadastrar e acessar o painel admin.
      </p>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {emails.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2 text-sm"
          >
            <span className="truncate">{item.email}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
              onClick={() => handleDelete(item.id, item.email)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          type="email"
          placeholder="novo@email.com"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
          className="text-sm"
        />
        <Button type="submit" size="sm" disabled={adding} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </Button>
      </form>
    </div>
  );
};

export default AllowedEmailsManager;
