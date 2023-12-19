import { FaArrowRight } from "react-icons/fa6";
import Title from "../Components/Title";
import useSettings from "../hooks/useSettings";
import { useEffect, useState } from "react";

const Details = () => {
  const { details, setDetails, prevStep, nextStep } = useSettings();

  const [localStudentData, setLocalStudentData] = useState({});
  const [gender, setGender] = useState(localStudentData?.gender || "");

  useEffect(() => {
    const local_student_data = localStorage.getItem("be_student");
    if (local_student_data) {
      setLocalStudentData(JSON.parse(local_student_data));
      setGender(JSON.parse(local_student_data)?.gender);
    }
  }, []);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const data = { name, email, phone, gender };
    setDetails({ ...details, student: data });
    localStorage.setItem("be_student", JSON.stringify(data));
    nextStep();
  };

  return (
    <section>
      <Title>Your Details</Title>
      <form onSubmit={handleSubmitForm}>
        <div className="w-full max-w-[500px] mx-auto flex flex-col gap-3">
          <div>
            <label
              htmlFor="name"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Name
            </label>
            <input
              required
              name="name"
              type="text"
              defaultValue={localStudentData?.name}
              placeholder="Your Full Name"
              className="input input-bordered text-[17px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 focus:border-[#4438caa6]"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Email
            </label>
            <input
              name="email"
              type="text"
              defaultValue={localStudentData?.email}
              placeholder="Your Email Address"
              className="input input-bordered text-[17px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 focus:border-[#4438caa6]"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Phone
            </label>
            <input
              required
              name="phone"
              type="number"
              defaultValue={localStudentData?.phone}
              placeholder="Your Active Phone Number"
              className="input input-bordered text-[17px] font-[400] text-slate-800 bg-white w-full shadow-sm border-2 focus:border-[#4438caa6]"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="text-[15px] text-slate-500 font-[400]"
            >
              Gender
            </label>
            <div className="flex flex-row gap-1 items-center">
              <label htmlFor="male" className="text-[17px] text-slate-800">
                Male
              </label>
              <input
                required
                checked={gender === "male"}
                onChange={() => setGender("male")}
                type="radio"
                name="gender"
                id="male"
                value="male"
                className="radio radio-sm radio-primary mr-4"
              />
              <label htmlFor="female" className="text-[17px] text-slate-800">
                Female
              </label>
              <input
                required
                checked={gender === "female"}
                onChange={() => setGender("female")}
                type="radio"
                name="gender"
                id="female"
                value="female"
                className="radio radio-sm radio-primary"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="w-full max-w-[700px] flex flex-row justify-between items-center text-[17px] font-[400] text-neutral-800 mt-8">
          <button
            type="button"
            className="py-1 px-4 bg-white text-neutral-500 rounded-md border-[2px] border-neutral-300 active:scale-90"
            onClick={prevStep}
          >
            Back
          </button>
          <button
            type="submit"
            className="py-1 px-4 bg-indigo-700 text-white rounded-md border-[2px] border-transparent active:scale-90 flex flex-row items-center gap-1 hover:gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            Next <FaArrowRight className="text-[14px] -mt-[1px]" />
          </button>
        </div>
      </form>
    </section>
  );
};
export default Details;
