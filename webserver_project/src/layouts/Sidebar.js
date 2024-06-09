import { Button, Nav, NavItem } from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import styles_Full from "./FullLayout.module.css";
import { IoHomeSharp, IoSettingsSharp } from "react-icons/io5";
import { FaMapMarkedAlt, FaUserCircle } from "react-icons/fa";
import { PiUmbrellaSimpleBold } from "react-icons/pi";
const navigation = [
  {
    title: "Home",
    href: "/",
    icon: <IoHomeSharp />,
  },
  {
    title: "Map",
    href: "/map",
    icon: <FaMapMarkedAlt />,
  },
  {
    title: "Entity",
    href: "/entity",
    icon: <PiUmbrellaSimpleBold />,
  },
  {
    title: "Account",
    href: "/account",
    icon: <FaUserCircle />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <IoSettingsSharp />,
  },
];

const Sidebar = () => {
  const showMobilemenu = () => {
    document
      .getElementById("sidebarArea")
      .classList.toggle(styles_Full.showSidebar);
  };
  let location = useLocation();

  return (
    <div className={styles.sidebarBorder}>
      <div className={styles.logo}>
        <Logo />
        <span className={styles.btn}>
          <Button
            close
            size="sm"
            className={styles.btn}
            onClick={() => showMobilemenu()}
          ></Button>
        </span>
      </div>
      <div className={styles.navArea}>
        <Nav vertical className={styles.sidebarNav}>
          {navigation.map((navi, index) => (
            <NavItem key={index} className={styles.sidenavBg}>
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? styles.currentLink
                    : styles.restLink
                }
              >
                {navi.icon}
                <span className={styles.title}>{navi.title}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
