import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Login() {
  const [see, setSee] = useState(false);
  const [id,setId]=useState(null)
  const [password,setPassword]=useState(null)
    const handleLogin=async(e)=>{
        setId(id.trim())
        e.preventDefault()
        if(!id){
            alert("Enter either email or password")
        }
        if(!password){
            alert("Password cannot be emptied")
        }
        else{
          
            try {
              const user = await axios.post("http://localhost:3002/login",{id:id,password:password})
              alert(user.response.data.msg)
            } catch (error) {
              console.log(error)
              alert(error.response.data.msg)
            }
            
        }

    }


const navigate=useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        <div>
          <label className="block text-xl font-semibold mb-2">Email/Phone Number</label>
          <input
            type="text"
            placeholder="Enter Email/Phone Number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e)=>setId(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Password</label>
          <div className="relative">
            <input
              type={see ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e)=>setPassword(e.target.value)}
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

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg">
            Not Registered? 
            <span onClick={()=>navigate('/')} className="text-indigo-600 cursor-pointer hover:underline ml-1">Register!</span>
          </h3>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg">
            Forget Password? 
            <span onClick={()=>navigate('/getaccount')} className="text-indigo-600 cursor-pointer hover:underline ml-1">Reset Password</span>
          </h3>
        </div>

        <button onClick={handleLogin} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
