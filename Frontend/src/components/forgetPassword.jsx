import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from 'axios'
function ForgetPassword() {
    const navigate=useNavigate()
  const [password, setPassword] = useState(null);
  const location = useLocation();
  const { email } = location.state || {};
  const [see, setSee] = useState(false);

  const handleReset=async (e)=>{
    e.preventDefault()
    if (
        !/(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,}/.test(password)
      ) {
        alert("Password must contain at least 8 characters, one uppercase letter, one number, and one symbol");
        return;
      }
    try {
        const user = await axios.post("http://localhost:3002/resetpassword",{email:email,password:password})
        alert("Password Reset Successfull")
        navigate('/login')
      } catch (error) {
        console.log(error)
        alert(error.response.data)
      }

    
  }


  return (
    <>
      <h4 className="flex text-left text-4xl">Reset your Password</h4>
      <div>
        <label className="flex text-left text-xl font-semibold mb-2 mt-[30px]">
          New Password
        </label>
        <div className="relative">
          <input
            type={see ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            onClick={() => setSee(!see)}
          >
            {see ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="flex justify-start">
        <button onClick={handleReset} className="w-[25%]   mt-[30px] sm:w-[15%] bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors   sm:bg-slate-600">
          Reset
        </button>
      </div>
    </>
  );
}
export default ForgetPassword;
