import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios'
function Signup() {
  const [see, setSee] = useState(false);
  const [name,setName]=useState(null)
  const [phonenumber,setPhone]=useState(null)
  const [email,setEmail]=useState(null)
  const [password,setPassword]=useState(null)
  const [otp,setOtp]=useState(null)
  const[verify,setVerify]=useState(false)
  const[loading,setLoading]=useState(null)
  const[verfied,setVerfied]=useState(false)
  const navigate = useNavigate();


  const verifyEmail=async (e)=>{
    e.preventDefault()
   
    

    try{
      setLoading(true)
        const resp=await axios.post("http://localhost:3002/send-otp",{email:email})
        setVerify(!verify)
        setLoading(false)
    }
    catch(error){
        console.log(error)
    }
  }



  const handleRegister=async (e)=>{
    e.preventDefault()
    if(!name || !phonenumber || !email || !password){
        alert("All fields are compulsory")
    }
    if (/\d/.test(name)) {
        alert("Name cannot contain numbers");
        return;
      }
     
      if (!/^\d{10}$/.test(phonenumber)) {
        alert("Phone number should be a 10-digit number");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Invalid email address");
        return;
      }
      
      // Check if password meets complexity requirements
      if (
        !/(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,}/.test(password)
      ) {
        alert("Password must contain at least 8 characters, one uppercase letter, one number, and one symbol");
        return;
      }
      console.log("hello")
   try {
    const user= await axios.post("http://localhost:3002/signup",{name:name,email:email,phonenumber:phonenumber,password:password})
       alert("Registered")
   } catch (error) {
    alert(error.response.data.error)
   }
  }
 
const checkOtp =async(e)=>{
  e.preventDefault()
  try{
      setVerfied(false)
     const resp= await axios.post("http://localhost:3002/verify-otp",{email:email,otp:otp})
     if(resp.status==200){
      setVerfied(true)
     }

     alert(resp.data.message)
  }
  catch(e){
    alert(e)
  }
}

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Registration</h1>

        <div>
          <label className="block text-xl font-semibold mb-2">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e)=>setName(e.target.value.trim())}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold mb-2">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="Enter your phone number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e)=>setPhone(e.target.value)}
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold mb-2">Email Id</label>
          <div className="relative">
          <input
            type="email"
            disabled={verfied}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e)=>setEmail(e.target.value)}
          />
           <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
              onClick={verifyEmail}
              disabled={loading}
            >
              Verify
            </button>
          </div>

          {
            verify?
            <div>
            <input
            type="string"
            disabled={verfied}
            placeholder="Enter your otp"
            className=" mt-3 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e)=>setOtp(e.target.value)}
          />

            <button
              type="button"
              className="mt-5 w-[25%] bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              onClick={checkOtp}
              >
            Verify</button>
           
          </div>
          :""
          }
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
          <p className="text-sm text-red-600 mt-1 flex text-left">
            Password must be at least 8 characters long and include at least one number, one uppercase letter, and one symbol.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg">
            Already Registered?
            <span
              className="text-indigo-600 cursor-pointer hover:underline ml-1"
              onClick={() => navigate('/login')}
            >
              Login!
            </span>
          </h3>
        </div>

        <button
         onClick={handleRegister}
         disabled={!verfied}
         className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          Register
        </button>
      </div>
    </div>
  );
}

export default Signup;
