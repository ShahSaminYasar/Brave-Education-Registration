import { createBrowserRouter } from "react-router-dom";
import Checkout from "../Pages/Checkout";
import App from "../App";
import EnrolledCourses from "../Pages/Dashboard/EnrolledCourses";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/enrolled-courses",
    element: <EnrolledCourses />,
  },
]);
