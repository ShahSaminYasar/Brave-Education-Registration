import { FaCheck, FaMoneyBillTransfer } from "react-icons/fa6";
import Title from "../Components/Title";
import useCourses from "../hooks/useCourses";
import useSettings from "../hooks/useSettings";
import { useState } from "react";
import BKashLogo from "../assets/bkash.png";
import BKashLogoWhite from "../assets/bkash-white.png";
import moment from "moment";
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Confirmation = () => {
  const { details, setDetails, prevStep } = useSettings();
  const axios = useAxios();
  const navigate = useNavigate();

  const courseDetails = useCourses(details?.course);

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    setConfirming(true);
    const sessionDetails = {
      course: details?.course,
      date: details?.schedule?.date,
      time: details?.schedule?.time,
      registeredOn: moment().format(),
      name: details?.student?.name,
      email: details?.student?.email,
      phone: details?.student?.phone,
      gender: details?.student?.gender,
    };

    // console.log("Details: ", data);

    try {
      if (paymentMethod === "bkash") {
        const { data: response } = await axios.post("/bkash-checkout", {
          courseId: details?.course,
          details: sessionDetails,
        });
        setConfirming(false);
        window.location.href = response?.bkashURL;
      } else {
        const { data } = await axios.post("/physical-checkout", {
          courseId: sessionDetails?.course,
          details: sessionDetails,
        });
        if (data?.message === "success") {
          setDetails({ ...details, uid: data?.uid, paid: data?.paid });
          setConfirming(false);
          return navigate("/checkout?status=success");
        } else {
          setConfirming(false);
          return toast.error(
            data?.message || "An error occured, please try again."
          );
        }
      }
    } catch (error) {
      setConfirming(false);
      return toast.error(
        error?.message || "An error occured, please try again."
      );
    }
  };

  return (
    <section>
      <Title>Checkout</Title>
      {courseDetails?.isLoading ? (
        <p className="block text-center text-[16px] text-slate-500">
          Loading...
        </p>
      ) : courseDetails?.error ? (
        <p className="block text-center text-[16px] text-red-500">
          {courseDetails?.error ||
            courseDetails?.error?.message ||
            "An error occured, please try again."}
        </p>
      ) : courseDetails?.[0]?.offerPrice === 0 ? (
        <p className="block text-center text-[20px] text-green-500 font-[500]">
          All set, please confirm.
        </p>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          <button
            className={`w-full max-w-[500px] h-[90px] mx-auto flex flex-row justify-between items-center gap-3 rounded-md px-5 py-2 text-[14px] sm:text-[17px] ${
              paymentMethod === "bkash"
                ? "bg-[#E2116E] text-slate-100"
                : "bg-[#fffdfe] text-slate-500"
            } overflow-hidden shadow-sm border-4 border-[#E2116E]`}
            onClick={() => setPaymentMethod("bkash")}
          >
            <img
              src={paymentMethod === "bkash" ? BKashLogoWhite : BKashLogo}
              alt="BKash Logo"
              className="h-full"
            />
            <p>Pay Tk. {courseDetails?.[0]?.offerPrice} with bKash</p>
          </button>

          <button
            className={`w-full max-w-[500px] h-[90px] mx-auto flex flex-row justify-between items-center gap-3 rounded-md px-5 py-2 text-[14px] sm:text-[17px] ${
              paymentMethod === "physical"
                ? "bg-[#0F0E49] text-slate-100"
                : "bg-[#fffdfe] text-slate-800"
            } overflow-hidden shadow-sm border-4 border-[#0F0E49]`}
            onClick={() => setPaymentMethod("physical")}
          >
            <FaMoneyBillTransfer className="text-[50px]" />
            <p>
              Pay physically in our office - Tk.{" "}
              {courseDetails?.[0]?.offerPrice}
            </p>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="w-full max-w-[700px] flex flex-row justify-between items-center text-[17px] font-[400] text-neutral-800 mt-6">
        <button
          className="py-1 px-4 bg-white text-neutral-500 rounded-md border-[2px] border-neutral-300 active:scale-90"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="py-1 px-4 bg-indigo-700 text-white rounded-md border-[2px] border-transparent active:scale-90 flex flex-row items-center gap-1 hover:gap-2 disabled:opacity-50 disabled:pointer-events-none"
          disabled={
            (!paymentMethod && courseDetails?.[0]?.offerPrice !== 0) ||
            confirming
          }
          onClick={handleConfirm}
        >
          Confirm <FaCheck className="text-[14px] -mt-[1px]" />
        </button>
      </div>
    </section>
  );
};
export default Confirmation;
