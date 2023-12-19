import Courses from "./Pages/Courses";
import Datetime from "./Pages/Datetime";
import Details from "./Pages/Details";
import Cart from "./Pages/Cart";
import Confirmation from "./Pages/Confirmation";
import useSettings from "./hooks/useSettings";
import Header from "./Components/Header";

const App = () => {
  const { steps, currentStep } = useSettings();

  return (
    <>
      <Header />
      <main className="flex flex-col justify-center items-center py-10 text-[17px]">
        <div className="w-full max-w-[700px]">
          <ul className="steps text-slate-600 text-[17px] w-full">
            {steps?.map((step) => (
              <li
                key={step}
                className={`step capitalize ${
                  steps?.indexOf(step) + 1 <= currentStep
                    ? "step-primary text-indigo-700"
                    : ""
                }`}
              >
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-r from-[#fbfaff] to-[#ebe8ff] border-2 border-indigo-700 shadow-md w-full max-w-[660px] mx-auto py-5 px-5 my-5 rounded-md">
          {currentStep === 1 ? (
            <Courses />
          ) : currentStep === 2 ? (
            <Datetime />
          ) : currentStep === 3 ? (
            <Details />
          ) : currentStep === 4 ? (
            <Cart />
          ) : currentStep === 5 ? (
            <Confirmation />
          ) : (
            "ERROR"
          )}
        </div>
      </main>
    </>
  );
};
export default App;
