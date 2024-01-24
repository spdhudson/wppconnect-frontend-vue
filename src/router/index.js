import { createRouter, createWebHistory } from "vue-router";
import config from "../config.js";
const Login = () => import("../pages/Login");
const Qrcode = () => import("../pages/Qrcode.vue");
const Chat = () => import("../pages/Chat");
const Contacts = () => import("../pages/Contacts");
const Groups = () => import("../pages/Groups");
const Configs = () => import("../pages/Configs");
const Profile = () => import("../pages/Profile.vue");
const Configs_Buttons = () => import("../pages/Configs_Buttons.vue");
const Configs_Lists = () => import("../pages/Configs_Lists.vue");

const routes = [
  // {
  //   // path: "/login",
  //   name: "login",
  //   component: Login,
  // },
  {
    path: "/qrcode",
    name: "qrcode",
    component: Qrcode,
  },
  {
    path: "/",
    name: "index",
    component: Chat,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/chat",
    name: "chat",
    component: Chat,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/contacts",
    name: "contacts",
    component: Contacts,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/groups",
    name: "groups",
    component: Groups,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/settings",
    name: "settings",
    component: Configs,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/settings/buttons",
    name: "settings-buttons",
    component: Configs_Buttons,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/settings/lists,",
    name: "settings-lists",
    component: Configs_Lists,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  routes,
});
export default router;

// Meta Handling
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem(config.TOKEN_KEY) == null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    if (to.path == "/login") {
      if (localStorage.getItem(config.TOKEN_KEY) != null) {
        next({
          path: "/chat",
        });
      } else {
        next();
      }
    }
    next();
  }
});
