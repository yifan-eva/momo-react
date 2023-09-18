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

        </Routes>
        <Footer></Footer>
    </div>
  )
}


export default App;
