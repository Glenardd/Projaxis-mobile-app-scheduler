// for fontsize responsiveness
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");
export const responsiveFont = (size: number) => (width / 360) * size;
