import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useRef, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import axios from "axios";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import TaskDetails from "./pages/TaskDetails";
import Tasks from "./pages/Tasks";
import Trash from "./pages/Trash";
import Users from "./pages/Users";
import Dashboard from "./pages/dashboard";
import { setOpenSidebar } from "./redux/slices/authSlice";
import { setAllUsers } from "./redux/slices/userSlice";
import { setAllTasks } from "./redux/slices/userSlice";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/Profilepage";

function Layout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/user/get-team", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch team list");
        }

        const data = await response.json();
        dispatch(setAllUsers(data));
      } catch (error) {
        console.error("Error fetching team list:", error);
      }
    };

    fetchAllUsers();
  }, [dispatch]);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8800/api/task/alltasks", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        dispatch(setAllTasks(response.data.tasks));
      } catch (error) {
        console.error("Error fetching tasks:", error.response?.data?.message || "Failed to fetch tasks");
      }
    };

    fetchAllTasks();
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className="flex-1 overflow-y-auto">
        <Navbar />

        <div className="p-4 2xl:px-10">
          { isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Outlet />
          ) }
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" state={ { from: location } } replace />
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <Transition
      show={ !!isSidebarOpen }
      as={ Fragment }
      enter="transition-opacity duration-700"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-700"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        ref={ mobileMenuRef }
        className={ clsx(
          "md:hidden fixed inset-0 z-40 bg-black/40 transition-all duration-700",
          isSidebarOpen ? "opacity-100" : "opacity-0"
        ) }
        onClick={ closeSidebar }
      >
        <div className="bg-white w-3/4 h-full" onClick={ (e) => e.stopPropagation() }>
          <div className="w-full flex justify-end px-5 mt-5">
            <button onClick={ closeSidebar } className="flex justify-end items-end">
              <IoClose size={ 25 } />
            </button>
          </div>

          <div className="-mt-10">
            <Sidebar />
          </div>
        </div>
      </div>
    </Transition>
  );
};

function App() {
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6]">
      <Routes>
        <Route element={ <Layout /> }>
          <Route index path="/" element={ <Navigate to="/dashboard" /> } />
          <Route path="/dashboard" element={ <Dashboard /> } />
          <Route path="/tasks" element={ <Tasks /> } />
          <Route path="/completed/:status" element={ <Tasks /> } />
          <Route path="/in-progress/:status" element={ <Tasks /> } />
          <Route path="/todo/:status" element={ <Tasks /> } />
          <Route path="/team" element={ <Users /> } />
          <Route path="/trashed" element={ <Trash /> } />
          <Route path="/task/:id" element={ <TaskDetails /> } />
        </Route>
        <Route path="profile" element={ <ProfilePage /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/signup" element={ <Signup /> } />
      </Routes>

      <Toaster richColors />
    </main>
  );
}

export default App;
