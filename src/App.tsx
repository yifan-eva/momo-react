import DemoLogin from "@/pages/DemoLogin";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/NNavbar";
import { MemberCreate } from "./pages/Member/Create";
import Login from "./pages/Member/Login";
import ProductCard from "./pages/Product/Products";
import Footer from "./components/Footer";
import Profile from "./pages/Member/Profile";
import ProductProfile from "./pages/Product/ProductProfile";
import Cart from "./shop/Cart";
import OrderCheck1 from "./shop/OrderCheck1";
import OrderCheck2 from "./shop/OrderCheck2";

function App() {
  return (
    <div className="App">
        <Navbar></Navbar>
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


        </Routes>
        <Footer></Footer>
    </div>
  )
}


export default App;
