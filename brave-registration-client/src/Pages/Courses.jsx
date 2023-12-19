import { useState } from "react";
import useSettings from "../hooks/useSettings";
import Title from "../Components/Title";
import useCourses from "../hooks/useCourses";
import { FaArrowRight } from "react-icons/fa6";

const Courses = () => {
  const courses = useCourses();

  const { nextStep, details, setDetails } = useSettings();

  const [selectedCourse, setSelectedCourse] = useState(details?.course);

  const handleNext = () => {
    setDetails({ course: selectedCourse });
    nextStep();
  };

  if (courses?.isLoading)
    return (
      <p className="block text-center text-[16px] text-slate-500">Loading...</p>
    );

  if (courses?.error)
    return (
      <p className="block text-center text-[16px] text-red-500">
        {courses?.error}
      </p>
    );

  if (courses?.length === 0)
    return (
      <p className="block text-center text-[16px] text-slate-500">
        Sorry, there are no courses available right now.
      </p>
    );

  return (
    <>
      <Title>Select a course</Title>
      <section className="flex flex-col gap-5">
        {courses?.map((course) => (
          <button
            key={course?.name}
            className={`w-full flex flex-row items-center gap-3 rounded-md ${
              course?._id === selectedCourse
                ? "bg-indigo-700 text-slate-200"
                : "bg-[#fffdfe] text-slate-500"
            } overflow-hidden shadow-sm border-2 border-indigo-600 hover:scale-[103%]`}
            onClick={() => setSelectedCourse(course?._id)}
          >
            <img
              src={course?.thumbnail}
              alt="Course Thumbnail"
              className="w-full max-w-[150px] aspect-[16/12] object-cover"
            />
            <div className="flex flex-col justify-center items-start text-[14px] sm:text-[15px] font-[400] w-full">
              <h3
                className={`${
                  course?._id === selectedCourse
                    ? "text-slate-200"
                    : "text-indigo-700"
                } text-[20px] sm:text-[25px] font-[500] text-left`}
              >
                {course?.name}
              </h3>
              <span>
                Duration:{" "}
                {course?.duration >= 60
                  ? parseInt(course?.duration / 60) +
                    "H " +
                    (course?.duration % 60 === 0
                      ? ""
                      : (course?.duration % 60) + "M")
                  : course?.duration + "M"}
              </span>
              <span>
                {course?.offerPrice < course?.price ? (
                  course?.offerPrice === 0 ? (
                    <>
                      <del className="opacity-50 mr-1">Tk. {course?.price}</del>
                      <span className="text-[17px] sm:text-[20px] text-green-500 font-[500]">
                        FREE
                      </span>
                    </>
                  ) : (
                    <>
                      <del className="opacity-50 mr-1">Tk. {course?.price}</del>
                      <span className="text-[17px] sm:text-[20px] text-green-500 font-[500]">
                        Tk. {course?.offerPrice}
                      </span>
                    </>
                  )
                ) : course?.price === 0 ? (
                  <span className="text-[17px] sm:text-[20px] text-green-500 font-[500]">
                    FREE
                  </span>
                ) : (
                  "Tk. " + course?.price
                )}
              </span>
            </div>
          </button>
        ))}

        {/* Navigation */}
        <div className="w-full max-w-[700px] flex flex-row justify-end items-center text-[17px] font-[400] text-neutral-800 mt-6">
          <button
            className="py-1 px-4 bg-indigo-700 text-white rounded-md border-[2px] border-transparent active:scale-90 flex flex-row items-center gap-1 hover:gap-2 disabled:opacity-50 disabled:pointer-events-none"
            disabled={!selectedCourse}
            onClick={handleNext}
          >
            Next <FaArrowRight className="text-[14px] -mt-[1px]" />
          </button>
        </div>
      </section>
    </>
  );
};
export default Courses;
