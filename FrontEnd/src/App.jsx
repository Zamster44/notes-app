import { Home } from "./pages/Home/Home"
import { Signup } from "./pages/Signup/Signup"
import { Login } from "./pages/Login/Login"

import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'

export const App = () => {
  const routes = (
    <Router>
      <Routes>
        <Route path="/dashboard" element = {<Home />} />
        <Route path="/login" element = {<Login />} />
        <Route path="/signup" element = {<Signup />} />
      </Routes>
    </Router>
  ) 
  return (
    <div className="">
      {routes}
    </div>
  )
}

