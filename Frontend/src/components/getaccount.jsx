import { createContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from 'axios'



function GetAccount() {

    


  const [email, setemail] = useState(null);

    const navigate =useNavigate()
  const handlegetAccount=async (e)=>{
    e.preventDefault()
    if(!email){
        return alert("please enter email")
    }
    console.log(email)
    try {
        const user = await axios.post("http://localhost:3002/findaccount",{id:email})
        
        navigate('/forgetpassword',{ state: { email:email } })
      } catch (error) {
        console.log(error)
        alert(error.response.data)
      }

    
  }
  return (
    <>
      <h4 className="flex text-left text-4xl">Find Your account</h4>
      <div>
        <label className="flex text-left text-xl font-semibold mb-2 mt-[30px]">
          Email
        </label>
        <div className="flex justify-start">
          <input
            type="text"
            placeholder="Enter your email id"
            className="w-[25%] sm:w-[35%] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setemail(e.target.value.trim())}
          />
          
        </div>
      </div>

      <div className="flex justify-start">
        <button onClick={handlegetAccount} className="w-[25%]   mt-[30px] sm:w-[15%] bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors   sm:bg-slate-600">
          Reset
        </button>
      </div>
    </>
  );
}
export default GetAccount;
