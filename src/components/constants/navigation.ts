import Register from "@/src/app/auth/register";
import Login from "@/src/app/auth/login";
import Intro from "@/src/app/auth";
import { SCREENS } from "./routes";

export const authStackNav = [
  // {
  //   name: "index",
  //   component: Intro,
  // },
  // {
  //   name: SCREENS.LOGIN,
  //   component: Login,
  // },
  // {
  //   name: SCREENS.REGISTER,
  //   component: Register,
  // },
];

export const tabItems = [
  {
    name: SCREENS.HOME,
    title: "Home",
    src: "home",
  },
  {
    name: SCREENS.COLLECTIONS,
    title: "Collections",
    src: "category",
  },
  {
    name: SCREENS.SEARCH,
    title: "Search",
    src: "search",
  },
  {
    name: SCREENS.CART,
    title: "Cart",
    src: "shopping-cart",
  },
];
