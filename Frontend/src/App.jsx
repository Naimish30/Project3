import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Signup from "./components/signup";
import Login from "./components/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgetPassword from "./components/forgetPassword";
import GetAccount from "./components/getaccount";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forgetpassword" element={<ForgetPassword />}></Route>
          <Route path="/getaccount" element={<GetAccount />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
