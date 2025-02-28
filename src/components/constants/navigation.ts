import Register from "@/src/app/auth/register";
import Login from "@/src/app/auth/login";
import Intro from "@/src/app/auth";


export const authStackNav = [
  {
    name: 'index',
    component: Intro,  
  },
  {
    name: 'login',
    component: Login,  
  },
  {
    name: 'register',
    component: Register,  
  },

];

export const tabItems = [
  {
    name: "index",
    title: "Home",
    src: "home", 
  },
  {
    name: "collections",
    title: "Collections",
    src: "collections", 
  },
  {
    name: "search",
    title: "Search",
    src: "search", 
  },
  {
    name: "cart",
    title: "Cart",
    src: "shopping-cart", 
  },
];