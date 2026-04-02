import JSZip from 'jszip';
import { fetchImageData, isLocalImage } from './imageRegistry';

interface ImageMapping {
  originalUrl: string;
  localPath: string; // e.g. "images/hero.jpg"
  fileName: string;  // e.g. "hero.jpg"
}

/**
 * Collect all image URLs from an HTML string, fetch them, and build a ZIP.
 * Returns the HTML with local paths and the ZIP blob.
 */
export async function exportAsZip(
  html: string,
  imageUrls: { url: string; name: string }[],
  zipFileName: string = 'project'
): Promise<void> {
  const zip = new JSZip();
  const imagesFolder = zip.folder('images')!;

  // Track used filenames to avoid collisions
  const usedNames = new Set<string>();
  const mappings: ImageMapping[] = [];

  for (const { url, name } of imageUrls) {
    if (!url || url === '#') continue;

    const imageData = await fetchImageData(url);
    if (!imageData) continue;

    // Build clean filename
    let baseName = name.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    let fileName = `${baseName}.${imageData.extension}`;

    // Deduplicate
    let counter = 1;
    while (usedNames.has(fileName)) {
      fileName = `${baseName}-${counter}.${imageData.extension}`;
      counter++;
    }
    usedNames.add(fileName);

    imagesFolder.file(fileName, imageData.data);

    mappings.push({
      originalUrl: url,
      localPath: `images/${fileName}`,
      fileName,
    });
  }

  // Replace all URLs in HTML with local paths
  let finalHtml = html;
  for (const mapping of mappings) {
    // Escape special regex chars in URL
    const escaped = mapping.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    finalHtml = finalHtml.replace(new RegExp(escaped, 'g'), mapping.localPath);
  }

  zip.file('index.html', finalHtml);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${zipFileName}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
