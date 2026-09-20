import { Routes, Route,BrowserRouter } from 'react-router-dom'
import Login from './pages/R1Login.tsx'
import Home from "./pages/R2Home.tsx"
import {R3Drivers} from './pages/R3Drivers.tsx'
import { R4Waiting } from './pages/R4Waiting'
import { R5Matched } from './pages/R5Matched'
import { R6Complete } from './pages/R6Complete'
import { D1Signin } from './pages/driver/D1Signin.tsx'
import { D2Home } from './pages/driver/D2Home'
import { D3Request } from './pages/driver/D3Request'
import { D4InProgress } from './pages/driver/D4InProgress'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/home' element={<Home/>}></Route>
        <Route path="/drivers" element={<R3Drivers />} />
        <Route path="/waiting" element={<R4Waiting />} />
        <Route path="/matched" element={<R5Matched />} />
        <Route path="/complete" element={<R6Complete />} />


        <Route path="/driver" element={<D1Signin />} />
        <Route path="/driver/home" element={<D2Home />} />
        <Route path="/driver/request" element={<D3Request />} />
        <Route path="/driver/trip" element={<D4InProgress />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App