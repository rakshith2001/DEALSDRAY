import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import EmployeeList from './pages/EmployeeList'
import CreateEmployee from './pages/CreateEmployee'
import { useAuthContext } from './hooks/useAuthContext'
import EditEmployee from './pages/EditEmployee'

function App() {
  const { user } = useAuthContext()


  return (
    <>
      <div className="App">
      <BrowserRouter>
        <Navbar />

        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={ user ? <Home /> : <Navigate to='/login' />} 
            />
            <Route
            path='/login'
            element={  user? <Home/>:<Login />} 
            />
            <Route
            path='/signup'
            element={ <Signup />}
            />
            <Route 
            path='/employeeList'
            element={user ? <EmployeeList />: <Navigate to='/login' />}
            />
            <Route 
            path='/createemployee'
            element={ user? <CreateEmployee/>: <Navigate to='/login' />}
            />

          

          
          </Routes>
        </div>
      </BrowserRouter>
    </div>
    </>
  )
}

export default App
