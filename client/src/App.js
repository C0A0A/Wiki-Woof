import './App.css';
import React from "react";
import { Route } from "react-router-dom";
import NavBar from "./components/NavBar/Navbar.js";
import Landing from "./components/Landing/Landing.js";
import Home from "./components/Home/Home.js";
import Dog from "./components/Dog/Dog.js";
import FormDog from "./components/FormDog/FormDog.js";
import FormTemperament from "./components/FormTemperament/FormTemperament.js";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Route exact path="/" component={Landing} />
      <Route exact path="/dogs" component={Home} />
      <Route exact path="/creation" component={FormDog} />
      <Route exact path="/temperament" component={FormTemperament} />
      <Route exact path="/dogs/:id" component={Dog} />
              
    </div>
  );
}

export default App;
