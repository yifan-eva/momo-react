import DemoLogin from "@/pages/DemoLogin";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import NNavbar from "./components/NNavbar";
import { MemberCreate } from "./pages/Member/Create";
import Login from "./pages/Member/Login";
import ProductCard from "./pages/Product/Products";
import Footer from "./components/Footer";
import Profile from "./pages/Member/Profile";
import ProductProfile from "./pages/Product/ProductProfile";
import Cart from "./shop/Cart";
import OrderCheck1 from "./shop/OrderCheck1";
import OrderCheck2 from "./shop/OrderCheck2";
import OrderCheck3 from "./shop/OrderCheck3";
import NotFound from "./pages/DemoLogin/NotFound";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminOrder from "./pages/Admin/AdminOrder";
import AdminOrderItem from "./pages/Admin/AdminOrderItem";
import AdminMember from "./pages/Admin/AdminMember";
import AdminProduct from "./pages/Admin/AdminProduct";
import AdminProductCreate from "./pages/Admin/AdminProductCreate";
import Authorization from "./pages/DemoLogin/Authorization";
import AdminIndex from "./pages/Admin/AdminIndex";

function App() {
  return (
    <div className="App">

      {/* {isAdminLoggedIn ? <Navbar /> : <NNavbar />} */}
      <NNavbar></NNavbar>
      <Routes>
        <Route path="/" element={<DemoLogin />} />

        <Route path="/Login" element={<Login />} />
        <Route path="/Create" element={<MemberCreate />} />
        <Route path="/Profile" element={<Profile />} />

        {/* <Route path="/aaa" element={<Product/>} /> */}
        <Route path="/Product" element={< ProductCard />} />
        <Route path="/ProductCategory" element={<ProductCard />} />
        <Route path="/ProductProfile" element={< ProductProfile />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/OrderCheck1" element={<OrderCheck1 />} />
        <Route path="/OrderCheck2" element={<OrderCheck2 />} />
        <Route path="/OrderCheck3" element={<OrderCheck3 />} />

        <Route path="/AdminIndex" element={<AdminIndex />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/AdminOrder" element={<AdminOrder />} />
        <Route path="/AdminOrderItem" element={<AdminOrderItem />} />
        <Route path="/AdminMember" element={<AdminMember />} />
        <Route path="/AdminProduct" element={<AdminProduct />} />
        <Route path="/AdminProductCreate" element={<AdminProductCreate />} />

        <Route path='*' element={<NotFound />}></Route>
        <Route path="/Authorization" element={<Authorization />} />


      </Routes>
      <Footer></Footer>
    </div>
  )
}


export default App;
