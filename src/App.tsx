import DemoLogin from "@/pages/DemoLogin";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
// import AccessDenied from "./pages/AccessDenied";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Navbar from "./components/NNavbar";
import {MemberCreate} from "./pages/Member/Create";
import Login from "./pages/Member/Login";
import Product from "./pages/Product/Productxxxx";
import ProductCard from "./pages/Product/Products";
import Footer from "./components/Footer";
import Profile from "./pages/Member/Profile";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<DemoLogin />} />

        <Route path="/Login" element={<Login/>} />
        <Route path="/Create" element={<MemberCreate />} />
        <Route path="/Profile" element={<Profile/>}/>

        <Route path="/aaa" element={<Product/>} />
        <Route path="/Product" element={< ProductCard />} />

        
      </Routes>
      <Footer></Footer>
      </div>
  )
    }

export default App;
