// for image responsiveness
import { Dimensions } from "react-native";
export const responsiveImageSize = (size: number) => {
  const { width } = Dimensions.get("window");
  return (width / 360) * size;
};
