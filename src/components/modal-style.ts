import { Platform, StyleSheet } from "react-native";
import { GeneralManager } from "../services";

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
  },
  header: {
    height: 30,
    marginTop: GeneralManager.getMobileTopBottom("top"),
    backgroundColor: '#ff6600',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  body: {

  },
  footer: {
    height: Platform.OS === "android" ? 60 : 80,
    backgroundColor: '#ff6600',
    padding: 10,
    paddingBottom: Platform.OS === "android" ? 10 : 25,
  }
});