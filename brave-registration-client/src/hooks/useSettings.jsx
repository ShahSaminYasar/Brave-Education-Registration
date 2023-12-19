import { useContext } from "react";
import { SettingsContext } from "../Providers/Settings";

const useSettings = () => {
  return useContext(SettingsContext);
};
export default useSettings;
