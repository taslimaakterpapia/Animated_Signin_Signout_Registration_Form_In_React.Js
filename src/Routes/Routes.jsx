
import {
  createBrowserRouter,
} from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home/Home";

// import SignUp from "../pages/signUp/signUp";
import PrivateRoute from "./PrivateRoute";
import Secret from "../pages/Shared/Secret/Secret";
import Login from "../pages/Shared/Login/Login";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children:[
      {
          path:'/',
          element:<Home></Home>
      },
          
      {
          path:'login',
          element:<Login></Login>
      },
      // {
      //     path:'signup',
      //     element:<SignUp></SignUp>
      // },
      {
          path:'secret',
          element:<PrivateRoute><Secret></Secret></PrivateRoute>
      },
    ]
  },
])