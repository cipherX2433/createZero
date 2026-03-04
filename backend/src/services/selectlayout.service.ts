export type LayoutType =
  | "bullet"
  | "quote"
  | "headline";

export function selectLayout(script: any): LayoutType {

  if (script.key_points && script.key_points.length === 3)
    return "bullet";

  if (script.hook_quote)
    return "quote";

  return "headline";
}