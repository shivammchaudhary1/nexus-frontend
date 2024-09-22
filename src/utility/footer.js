import DashboardIcon from "##/src/assets/images/icons/dashboard.png";
import ProjectIcon from "##/src/assets/images/icons/monitor.png";
import ReportIcon from "##/src/assets/images/icons/pie-chart.png";
import HolidaysIcon from "##/src/assets/images/icons/holidays.png";
import ProfileIcon from "##/src/assets/images/icons/avatar.png";
import LogoutIcon from "##/src/assets/images/icons/logout.png";
import ClientIcon from "##/src/assets/images/icons/client.png";

const MENUS = [
  "dashboard",
  "client",
  "projects",
  "users",
  "reports",
  "holiday",
  "profile",
  "logout",
];

const MENU_LABELS = {
  dashboard: "Dashboard",
  client: "Clients",
  projects: "Projects",
  users: "Users",
  reports: "Reports",
  summary: "Summary",
  holiday: "Holiday",
  profile: "Profile",
  logout: "Logout",
};

const MENU_PATH_ICONS = {
  dashboard: {
    link: "/dashboard",
    Icon: DashboardIcon,
    adminOnly: false,
  },
  client: {
    link: "/clients",
    Icon: ClientIcon,
    adminOnly: true,
  },
  projects: {
    link: "/projects",
    Icon: ProjectIcon,
  },
  users: {
    link: "/users",
    Icon: ProfileIcon,
    adminOnly: true,
  },
  reports: {
    link: "/reports",
    Icon: ReportIcon,
  },
  holiday: {
    link: "/holidays",
    Icon: HolidaysIcon,
    adminOnly: false,
  },
  profile: {
    link: "/profile",
    Icon: ProfileIcon,
    adminOnly: false,
  },
  logout: {
    link: "/logout",
    Icon: LogoutIcon,
    adminOnly: false,
  },
};

export { MENUS, MENU_LABELS, MENU_PATH_ICONS };
