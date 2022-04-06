import { Platform } from "react-native";

export default class GeneralManager {

    static getMobileTopBottom(type: 'bottom' | 'top') {
        if (Platform.OS === "ios") {
            return type === "bottom" ? 20 : 35;
        }
        return 0;
    }

    static getWebchatHost() {
        return `http://${Platform.OS !== "ios" ? "10.0.2.2" : "localhost"}:55020/chathub`;
    }

    static createUUID() {
        var s = ["M","o","b","i","l"];
        var hexDigits = "0123456789abcdef";
        for (var i = 5; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
}