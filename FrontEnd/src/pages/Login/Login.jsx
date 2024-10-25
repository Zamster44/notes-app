import { Navbar } from "../../components/Navbar/Navbar"
import { Link } from "react-router-dom"
import { PasswordInput } from "../../components/Input/PasswordInput"
import { useState } from "react"
import { validateEmail } from "../../utils/helper"

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please enter a valid email")
      return;
    }

    if(!password){
      setError("Please enter password")
      return
    }

    setError("")

  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>

            <div className="text-2xl mb-7">Login</div>

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => {setPassword(e.target.value)}}
            />

            {error && <p className="text-red-500 text-xs pb-1 ">{error}</p>}

            <button type="submit" className="btn-primary">Login</button>

            <p className="text-sm text-center mt-4">
              Not Registered Yet? {" "}
              <Link to={"/signup"} className="font-medium text-primary underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>

  )
}
