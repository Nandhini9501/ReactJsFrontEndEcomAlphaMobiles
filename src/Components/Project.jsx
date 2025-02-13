// import React from 'react'
import { Route, Routes  } from "react-router-dom";
import Home from "./Home.jsx";
import Product from "./Product.jsx";
// import About from './About.jsx'
// import Contact from './Contact.jsx'
import UserTable from "./UserTable.jsx";
import ProductTable from "./ProductTable.jsx";
import AddCart from "./AddCart.jsx";

const Project = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productPage" element={<Product />} />
        {/* <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/> */}
        <Route path="/admin" element={<UserTable />} />
        <Route path="/user" element={<UserTable />} />
        <Route path="/productTable" element={<ProductTable />} />
        <Route path="/addCart" element={<AddCart />} />
        
      </Routes>
    </>
  );
};
export default Project;
