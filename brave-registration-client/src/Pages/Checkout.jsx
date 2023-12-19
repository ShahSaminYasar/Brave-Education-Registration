import { FaCheckDouble } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import useSettings from "../hooks/useSettings";
import useCourses from "../hooks/useCourses";
import moment from "moment";

const Checkout = () => {
  const query = new URLSearchParams(window.location.search);
  const status = query.get("status");

  const { details, setDetails, setCurrentStep } = useSettings();
  const courseDetails = useCourses(details?.course);

  if (details?.uid) {
    const enrolledCourses = JSON.parse(
      localStorage.getItem("be_enrolled_courses")
    );
    const check = enrolledCourses?.filter(
      (enrolledCourse) => enrolledCourse?.uid === details?.uid
    );
    console.log(check);
    if (!check || check?.length === 0) {
      let newEnrolledArray = [];
      if (enrolledCourses) {
        newEnrolledArray = [...enrolledCourses, details];
        localStorage.setItem(
          "be_enrolled_courses",
          JSON.stringify(newEnrolledArray)
        );
      } else {
        newEnrolledArray = [details];
        localStorage.setItem(
          "be_enrolled_courses",
          JSON.stringify(newEnrolledArray)
        );
      }
    }
  }

  if (!details?.uid) {
    return <Navigate to="/" />;
  }

  const handleRestart = () => {
    setDetails({});
    return setCurrentStep(1);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <section className="bg-white rounded-md px-5 py-7 text-slate-800 text-[17px] font-[500] shadow-md w-full max-w-[660px] relative">
        {status !== "success" ? (
          <>
            <p className="text-[30px] text-slate-800 font-[500] block text-center mb-5">
              Status:{" "}
              <span className="text-slate-900 font-[600] uppercase">
                {status}
              </span>
            </p>
            <Link
              to="/"
              className="block mx-auto w-fit py-2 px-3 border-2 border-indigo-700 rounded-md text-indigo-700"
            >
              Retry?
            </Link>
          </>
        ) : (
          <>
            <div className="py-4 px-2">
              {courseDetails?.[0]?.isLoading ? (
                <span className="loader loader-spinner loader-sm"></span>
              ) : courseDetails?.[0]?.error ? (
                <p className="block text-red-500 text-center mb-4">
                  {courseDetails?.[0]?.error ||
                    "An error occured, please retry."}
                </p>
              ) : (
                <>
                  <FaCheckDouble className="text-[70px] text-green-500 block mx-auto mb-5" />
                  <p className="text-[20px] text-slate-800 font-[500] block text-center mb-2">
                    You have successfully registered in the course <br />
                    <span className="font-[600]">
                      {courseDetails?.[0]?.name}
                    </span>
                  </p>
                  <p className="block text-center mb-2">
                    Your ID:{" "}
                    <span className="font-[600] text-[22px] text-indigo-800">
                      {details?.uid}
                    </span>
                    <span className="text-[12px] text-slate-600 font-[300] italic -mt-[6px] block">
                      (Please save it for future use)
                    </span>
                  </p>
                  <div className="flex flex-col gap-2 justify-start items-start">
                    <p className="block text-center w-full">
                      We expect your presence at{" "}
                      <span className="text-indigo-700 font-[600]">
                        {details?.schedule?.time}
                      </span>{" "}
                      on{" "}
                      <span className="text-indigo-800 font-[600]">
                        {moment(details?.schedule?.date).format("D MMMM YYYY")}
                      </span>
                    </p>
                    {/* <div className="divider my-[0px]"></div> */}
                    <div className="grid sm:flex sm:flex-row gap-2 sm:gap-3 items-center justify-center w-full mt-5 text-center">
                      <button className="rounded-md py-2 px-3 text-[16px] bg-rose-600 text-white font-[400] active:scale-95 shadow-lg active:shadow-none">
                        Download Invoice
                      </button>
                      <button
                        onClick={handleRestart}
                        className="rounded-md py-2 px-3 text-[16px] bg-indigo-600 text-white font-[400] active:scale-95 shadow-lg active:shadow-none"
                      >
                        Register another course
                      </button>
                      <Link
                        to="/enrolled-courses"
                        className="rounded-md py-2 px-3 text-[16px] bg-emerald-600 text-white font-[400] active:scale-95 shadow-lg active:shadow-none"
                      >
                        Account
                      </Link>
                    </div>
                  </div>
                  <span
                    className={`absolute -top-[5px] -right-[5px] text-[30px] font-[700] text-white bg-rose-900 rounded-md px-2 leading-[40px] ${
                      courseDetails?.[0]?.offerPrice === 0 ? "hidden" : ""
                    }`}
                  >
                    {details?.paid ? "PAID" : "UNPAID"}
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
};
export default Checkout;
