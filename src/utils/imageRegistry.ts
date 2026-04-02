/**
 * Global image registry that maps blob/data URLs to original File objects.
 * Used during ZIP export to retrieve the actual file data.
 */

interface RegisteredImage {
  file: File;
  blobUrl: string;
  originalName: string;
  extension: string;
}

const registry = new Map<string, RegisteredImage>();

function getExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  return allowed.includes(ext) ? ext : 'jpg';
}

function sanitizeName(name: string): string {
  return name
    .replace(/\.[^.]+$/, '') // remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric
    .replace(/^-+|-+$/g, '') // trim dashes
    .slice(0, 30) || 'image';
}

export function registerImage(file: File): string {
  const blobUrl = URL.createObjectURL(file);
  const extension = getExtension(file.name);
  const originalName = sanitizeName(file.name);

  registry.set(blobUrl, {
    file,
    blobUrl,
    originalName,
    extension,
  });

  return blobUrl;
}

export function getRegisteredImage(url: string): RegisteredImage | undefined {
  return registry.get(url);
}

export function isLocalImage(url: string): boolean {
  return url.startsWith('blob:') || registry.has(url);
}

export function getAllRegisteredImages(): Map<string, RegisteredImage> {
  return new Map(registry);
}

export function unregisterImage(blobUrl: string): void {
  const entry = registry.get(blobUrl);
  if (entry) {
    URL.revokeObjectURL(blobUrl);
    registry.delete(blobUrl);
  }
}

/**
 * Given an image URL (blob or external), fetch the image data as ArrayBuffer.
 * For blob URLs: uses the registered File object directly.
 * For external URLs: fetches and returns the data.
 */
export async function fetchImageData(url: string): Promise<{ data: ArrayBuffer; extension: string } | null> {
  const registered = registry.get(url);
  if (registered) {
    const data = await registered.file.arrayBuffer();
    return { data, extension: registered.extension };
  }

  // External URL — try to fetch
  if (url.startsWith('http')) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) return null;
      const data = await resp.arrayBuffer();
      const contentType = resp.headers.get('content-type') || '';
      let ext = 'jpg';
      if (contentType.includes('png')) ext = 'png';
      else if (contentType.includes('webp')) ext = 'webp';
      else if (contentType.includes('gif')) ext = 'gif';
      return { data, extension: ext };
    } catch {
      return null;
    }
  }

  return null;
}
