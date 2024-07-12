// import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter}from"react-router-dom";
import Project from './Components/Project'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Project/>
    </BrowserRouter>,
)
