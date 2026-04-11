import JSZip from "jszip";
import { saveAs } from "file-saver";
import { buildAdvertorialHtml } from "./advertorialHtmlExporter";
import { buildLegalPages } from "./advertorialLegalPages";

type AdvertorialImageLike = {
  mode?: "url" | "upload";
  url?: string;
  preview?: string;
  fileName?: string;
  fileData?: string;
};

type AdvertorialConfigLike = {
  siteName?: string;
  headline?: string;
  heroImage?: AdvertorialImageLike;
  secondaryImage?: AdvertorialImageLike;
  sidebarImage?: AdvertorialImageLike;
  storyImage?: AdvertorialImageLike;
  comments?: Array<{
    image?: AdvertorialImageLike;
  }>;
  [key: string]: any;
};

const sanitizeFileName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "advertorial";

const getExtensionFromMime = (mime?: string) => {
  if (!mime) return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("svg")) return "svg";
  return "png";
};

const getExtensionFromUrl = (url?: string) => {
  if (!url) return "png";
  const clean = url.split("?")[0].split("#")[0];
  const ext = clean.split(".").pop()?.toLowerCase();
  if (ext && ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)) {
    return ext === "jpeg" ? "jpg" : ext;
  }
  return "png";
};

const extractBase64Payload = (dataUrl: string) => {
  const parts = dataUrl.split(",");
  return parts.length > 1 ? parts[1] : dataUrl;
};

const extractMimeFromDataUrl = (dataUrl?: string) => {
  if (!dataUrl?.startsWith("data:")) return "";
  const match = dataUrl.match(/^data:(.*?);base64,/);
  return match?.[1] || "";
};

const imageToAsset = async (
  image: AdvertorialImageLike | undefined,
  fileBaseName: string
): Promise<{ path: string; blob: Blob } | null> => {
  if (!image) return null;

  if (image.mode === "upload" && (image.fileData || image.preview)) {
    const dataUrl = image.fileData || image.preview || "";
    if (!dataUrl) return null;

    const mime = extractMimeFromDataUrl(dataUrl);
    const ext = getExtensionFromMime(mime);
    const payload = extractBase64Payload(dataUrl);

    const byteCharacters = atob(payload);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i += 1) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: mime || "image/png",
    });

    return {
      path: `img/${fileBaseName}.${ext}`,
      blob,
    };
  }

  if (image.url) {
    try {
      const response = await fetch(image.url);
      if (!response.ok) return null;

      const blob = await response.blob();
      const ext =
        getExtensionFromMime(blob.type) || getExtensionFromUrl(image.url);

      return {
        path: `img/${fileBaseName}.${ext}`,
        blob,
      };
    } catch {
      return null;
    }
  }

  return null;
};

const cloneConfig = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const exportAdvertorialZip = async (
  config: AdvertorialConfigLike
) => {
  const zip = new JSZip();
  const exportConfig = cloneConfig(config);

  const imageJobs: Array<{
    source: AdvertorialImageLike | undefined;
    applyPath: (path: string) => void;
    fileBaseName: string;
  }> = [
    {
      source: exportConfig.heroImage,
      applyPath: (path) => {
        exportConfig.heroImage = {
          ...(exportConfig.heroImage || {}),
          mode: "url",
          url: path,
          preview: "",
          fileData: "",
        };
      },
      fileBaseName: "hero",
    },
    {
      source: exportConfig.secondaryImage,
      applyPath: (path) => {
        exportConfig.secondaryImage = {
          ...(exportConfig.secondaryImage || {}),
          mode: "url",
          url: path,
          preview: "",
          fileData: "",
        };
      },
      fileBaseName: "secondary",
    },
    {
      source: exportConfig.sidebarImage,
      applyPath: (path) => {
        exportConfig.sidebarImage = {
          ...(exportConfig.sidebarImage || {}),
          mode: "url",
          url: path,
          preview: "",
          fileData: "",
        };
      },
      fileBaseName: "sidebar",
    },
    {
      source: exportConfig.storyImage,
      applyPath: (path) => {
        exportConfig.storyImage = {
          ...(exportConfig.storyImage || {}),
          mode: "url",
          url: path,
          preview: "",
          fileData: "",
        };
      },
      fileBaseName: "story",
    },
  ];

  (exportConfig.comments || []).forEach((comment, index) => {
    imageJobs.push({
      source: comment.image,
      applyPath: (path) => {
        if (!exportConfig.comments?.[index]) return;
        exportConfig.comments[index].image = {
          ...(exportConfig.comments[index].image || {}),
          mode: "url",
          url: path,
          preview: "",
          fileData: "",
        };
      },
      fileBaseName: `comment-${index + 1}`,
    });
  });

  for (const job of imageJobs) {
    const asset = await imageToAsset(job.source, job.fileBaseName);
    if (!asset) continue;

    zip.file(asset.path, asset.blob);
    job.applyPath(asset.path);
  }

  const indexHtml = buildAdvertorialHtml(exportConfig);
  const legalPages = buildLegalPages(exportConfig);

  zip.file("index.html", indexHtml);
  zip.file("terms.html", legalPages.terms);
  zip.file("privacy.html", legalPages.privacy);
  zip.file("disclaimer.html", legalPages.disclaimer);

  const slugBase = sanitizeFileName(
    exportConfig.siteName || exportConfig.headline || "advertorial"
  );

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${slugBase}.zip`);
};