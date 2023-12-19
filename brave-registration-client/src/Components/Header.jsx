import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const Header = () => {
  return (
    <header className="w-full">
      <div className="w-full max-w-[960px] mx-auto h-[70px] flex flex-row gap-3 flex-wrap justify-between items-center">
        <img
          src={Logo}
          alt="Brave Education Logo"
          className="w-full max-w-[200px] object-contain"
        />

        <div className="text-[17px] text-white font-[500] flex flex-row gap-3 items-center flex-wrap">
          <span>Hotline: 01916-074609</span>
          <Link
            to="/enrolled-courses"
            className="text-white bg-rose-600 rounded-md py-1 px-3 bg-opacity-50 hover:bg-opacity-100"
          >
            Account
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Header;
