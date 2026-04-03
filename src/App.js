


import { Fragment, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./components/admin-dashboard/admin-dashboard";
import AdminHome from "./components/admin-dashboard/admin-home";
import CreateCategory from "./components/admin-dashboard/create-category";
import CreateCupon from "./components/admin-dashboard/create-cupon";
import CreateProducts from "./components/admin-dashboard/create-products";
import ManageCategory from "./components/admin-dashboard/manage-category";
import ManageCupon from "./components/admin-dashboard/manage-cupon";
import ManageOrders from "./components/admin-dashboard/manage-orders";
import ManageProducts from "./components/admin-dashboard/manage-products";
import ChangePassword from "./components/changePassword/ChangePassword";
import Checkout from "./components/checkout/Checkout";
import Dashboard from "./components/dashboard/Dashboard";
import DrawerCart from "./components/drawer/Drawer";
import Footer from "./components/footer/Footer";
import FooterHeader from "./components/footerHeader/FooterHeader";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import MobileApp from "./components/mobileApp/MobileApp";
import MyOrders from "./components/myOrders/MyOrders";
import Navigation from "./components/navigation/Navigation";
import Order from "./components/order/Order";
import PaymentHistory from "./components/paymentHistory/PaymentHistory";
import Product from "./components/product/Product";
import Register from "./components/register/Register";
import Search from "./components/search/Search";
import SideBar from "./components/sideBar/SideBar";
import UpdateProfile from "./components/updateProfile/UpdateProfile";
import User from "./components/user/User";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Offers from "./pages/Offers";

function App() {
  let [isOpenRegister, setIsOpenRegister] = useState(false);
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <Fragment>
      <Toaster position="top-center" reverseOrder={false} />
      {!isAdminPath && (
        <>
          <Header />
          <Navigation />
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about-us" element={<About />} />
        <Route path="contact-us" element={<Contact />} />
        <Route path={"product/:productTitle"} element={<Product />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="search" element={<Search />} />
        <Route path={"order/:id"} element={<Order />} />
        <Route path="offer" element={<Offers />} />

        <Route path="user" element={<User />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="payment-history" element={<PaymentHistory />} />
          <Route path="update-profile" element={<UpdateProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        <Route path="admin" element={<AdminDashboard />}>
          <Route path="dashboard" element={<AdminHome></AdminHome>} />
          <Route
            path="create-category"
            element={<CreateCategory></CreateCategory>}
          />
          <Route
            path="manage-category"
            element={<ManageCategory></ManageCategory>}
          />
          <Route
            path="create-products"
            element={<CreateProducts></CreateProducts>}
          />
          <Route
            path="manage-products"
            element={<ManageProducts></ManageProducts>}
          />

          <Route path="cupon-code" element={<CreateCupon></CreateCupon>} />
          <Route path="manage-cupon" element={<ManageCupon></ManageCupon>} />
          <Route path="manage-orders" element={<ManageOrders />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>

      {!isAdminPath && (
        <>
          <div>
            <FooterHeader />
          </div>
          <div>
            <SideBar />
            <DrawerCart />
            <Login setIsOpenRegister={setIsOpenRegister} />
            <Register
              isOpen={isOpenRegister}
              setIsOpenRegister={setIsOpenRegister}
            />
          </div>
          <div className="w-full">
            <MobileApp />
            <Footer />
          </div>
        </>
      )}
    </Fragment>
  );
}

export default App;
