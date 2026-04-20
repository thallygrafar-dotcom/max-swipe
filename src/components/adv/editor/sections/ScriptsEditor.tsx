import { useAdvertorial } from "@/contexts/adv/AdvertorialContext";

const inputClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white";

const labelClass = "mb-1 block text-xs text-muted-foreground";

const textareaClass =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none text-white min-h-[140px] resize-y";

const defaultScripts = {
  clarityEnabled: false,
  clarityProjectId: "",
  headScripts: "",
  bodyStartScripts: "",
  bodyEndScripts: "",
};

const ScriptsEditor = () => {
  const { config, updateConfig } = useAdvertorial();
  const scripts = config.scripts ?? defaultScripts;

  return (
    <div className="space-y-4 pb-6">
      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">
            Microsoft Clarity
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Ative o Clarity e informe o Project ID para inserir automaticamente
            o script na head do advertorial.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <div>
            <p className="text-sm font-medium text-white">Ativar Clarity</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Injeta o código do Clarity na head quando habilitado.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateConfig({
                scripts: {
                  ...scripts,
                  clarityEnabled: !scripts.clarityEnabled,
                },
              })
            }
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
              scripts.clarityEnabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                scripts.clarityEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div>
          <label className={labelClass}>Clarity Project ID</label>
          <input
            className={inputClass}
            value={scripts.clarityProjectId}
            onChange={(e) =>
              updateConfig({
                scripts: {
                  ...scripts,
                  clarityProjectId: e.target.value,
                },
              })
            }
            placeholder="Ex: t9x8ab7cde"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Scripts da Head</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Códigos que serão inseridos dentro da tag {"<head>"}.
          </p>
        </div>

        <div>
          <label className={labelClass}>Scripts adicionais da head</label>
          <textarea
            className={textareaClass}
            value={scripts.headScripts}
            onChange={(e) =>
              updateConfig({
                scripts: {
                  ...scripts,
                  headScripts: e.target.value,
                },
              })
            }
            placeholder={`Ex:
<script>
  console.log("head");
</script>`}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-white">Scripts do Body</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Códigos para o início e final do body.
          </p>
        </div>

        <div>
          <label className={labelClass}>Scripts no início do body</label>
          <textarea
            className={textareaClass}
            value={scripts.bodyStartScripts}
            onChange={(e) =>
              updateConfig({
                scripts: {
                  ...scripts,
                  bodyStartScripts: e.target.value,
                },
              })
            }
            placeholder={`Ex:
<!-- Google Tag Manager (noscript) -->`}
          />
        </div>

        <div>
          <label className={labelClass}>Scripts no final do body</label>
          <textarea
            className={textareaClass}
            value={scripts.bodyEndScripts}
            onChange={(e) =>
              updateConfig({
                scripts: {
                  ...scripts,
                  bodyEndScripts: e.target.value,
                },
              })
            }
            placeholder={`Ex:
<script>
  console.log("fim do body");
</script>`}
          />
        </div>
      </div>
    </div>
  );
};

export default ScriptsEditor;