import { responsiveSize } from "./reponsiveSize";

export const shortenText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getDynamicTextStyle(text: string) {
  const length = text?.length || 0;

  return {
    fontSize:
      length > 20
        ? responsiveSize(14)
        : length > 12
        ? responsiveSize(20)
        : responsiveSize(30),

    flexShrink: 1,
  };
}