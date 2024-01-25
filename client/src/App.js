import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import DashBoard from './modules/dashboard/DashBoard';
import Form from './modules/form/Form';

const ProtectedRoutes=({children,auth=false})=>{
  const isLoggedIn=localStorage.getItem('user:token') !== null || false

  if(!isLoggedIn && auth){
    return <Navigate to="/login" />;
  }else if (isLoggedIn && ['/login', '/register'].includes(window.location.pathname)) {
    return <Navigate to="/" />;
   
  }
  return children
}

function App() {
  return (
    <div 
    className='bg-[#d3e7ed] h-screen flex justify-center items-center'
    >
      <Routes>
        <Route path="/" element={
        <ProtectedRoutes auth={true}>
          <DashBoard />
        </ProtectedRoutes>} />
        
        <Route path="/login" element={
        <ProtectedRoutes>
          <Form isSignInPage={true} />
        </ProtectedRoutes>} />

        <Route path="/register" element={
        <ProtectedRoutes>
          <Form isSignInPage={false} />
        </ProtectedRoutes>} />
     </Routes>
    </div>
  );
}

export default App;
