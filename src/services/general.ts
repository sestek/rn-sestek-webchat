import { Platform } from "react-native";

export default class GeneralManager {

    static getMobileTopBottom(type: 'bottom' | 'top') {
        if (Platform.OS === "ios") {
            return type === "bottom" ? 20 : 35;
        }
        return 0;
    }
}