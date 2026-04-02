import { useRef, useState } from 'react';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { registerImage } from '@/utils/imageRegistry';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export default function ImageUploadField({ label, value, onChange, className }: ImageUploadFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      return;
    }

    const blobUrl = registerImage(file);
    onChange(blobUrl);
    setShowUrlInput(false);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={className}>
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
        {label}
      </Label>

      <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className="space-y-2">
          <div className="relative group">
            <img
              src={value}
              alt="Preview"
              className="w-full max-h-32 object-cover rounded-lg border border-border"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Trocar imagem
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/40 transition-all flex flex-col items-center gap-1.5 group"
          >
            <Upload size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              Upload imagem
            </span>
            <span className="text-[10px] text-muted-foreground">
              .jpg .png .webp .gif
            </span>
          </button>

          {!showUrlInput ? (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="w-full flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              <LinkIcon size={10} />
              Ou cole uma URL
            </button>
          ) : (
            <div className="flex gap-1.5">
              <Input
                placeholder="https://..."
                className="text-xs h-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) {
                      onChange(val);
                      setShowUrlInput(false);
                    }
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val) {
                    onChange(val);
                  }
                  setShowUrlInput(false);
                }}
                autoFocus
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
