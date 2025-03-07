import Register from "@/src/app/(auth)/register";
import Login from "@/src/app/(auth)/login";
import Intro from "@/src/app/(auth)/intro";
import { SCREENS } from "./routes";
import TabLayout from "@/src/app/(tabs)/_layout";
import userStack from "@/src/app/(user)/_layout";

export const authStackNav = [
  // {
  //   name: "index",
  //   component: Intro,
  // },
  {
    name: "(user)",
    component: userStack,
  },
  // {
  //   name: SCREENS.LOGIN,
  //   component: Login,
  // },
  // {
  //   name: SCREENS.REGISTER,
  //   component: Register,
  // },
];

export const userStackNav = [
  {
    name: "(tab)",
    component: TabLayout,
  },
]

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
