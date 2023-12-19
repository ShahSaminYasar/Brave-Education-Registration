import { createContext, useState } from "react";

export const SettingsContext = createContext(null);

const SettingsProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = ["services", "datetime", "details", "cart", "confirm"];

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps?.length ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const [details, setDetails] = useState({});

  // useEffect(() => {
  //   console.log(details);
  // }, [details]);

  const values = {
    steps,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    details,
    setDetails,
  };

  return (
    <SettingsContext.Provider value={values}>
      {children}
    </SettingsContext.Provider>
  );
};
export default SettingsProvider;
