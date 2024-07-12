// import React from 'react'
import { Route, Routes  } from "react-router-dom";
import Home from "./Home.jsx";
import Product from "./Product.jsx";
// import About from './About.jsx'
// import Contact from './Contact.jsx'
import UserTable from "./UserTable.jsx";
import ProductTable from "./ProductTable.jsx";

const Project = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productPage" element={<Product />} />
        {/* <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/> */}
        <Route path="/user" element={<UserTable />} />
        <Route path="/productTable" element={<ProductTable />} />
        
      </Routes>
    </>
  );
};
export default Project;
