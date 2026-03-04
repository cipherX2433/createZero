import { toPng } from "html-to-image";

export async function exportImage(ref:any) {

  const dataUrl = await toPng(ref.current);

  const link = document.createElement("a");

  link.download = "post.png";
  link.href = dataUrl;

  link.click();
}