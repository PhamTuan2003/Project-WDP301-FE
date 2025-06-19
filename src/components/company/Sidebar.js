import { FaShip } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { MdDashboard } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { TbBrandBooking, TbLogout2 } from "react-icons/tb";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { doLogout } from "../../redux/actions/UserAction.js";

const Sidebar = (props) => {
  const { collapsed, toggled, handleToggleSidebar } = props;

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(doLogout());
  };
  return (
    <div>
      <ProSidebar
        image={"/images/sidebar.jpg"}
        collapsed={collapsed}
        toggled={toggled}
        breakPoint="md"
        onToggle={handleToggleSidebar}
      >
        <SidebarHeader>
          <div
            style={{
              padding: "24px",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: 14,
              letterSpacing: "1px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <span>Company Yacht Cruise</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem icon={<MdDashboard />} className="sidebar-menu-item">
              Dashboard
              <Link to="/manage-company" />
            </MenuItem>
          </Menu>
          <Menu iconShape="circle">
            <MenuItem icon={<TbBrandBooking />} className="sidebar-menu-item">
              Customer Booking
              <Link to="/manage-company/booking" />
            </MenuItem>
          </Menu>
          <Menu iconShape="circle">
            <MenuItem icon={<FaShip />} className="sidebar-menu-item">
              {" "}
              View Yacht
              <Link to="/manage-company/view-yacht" />
            </MenuItem>
          </Menu>

          <Menu iconShape="circle">
            <MenuItem icon={<SlCalender />} className="sidebar-menu-item">
              {" "}
              Schedule Yacht
              <Link to="/manage-company/schedule" />
            </MenuItem>
          </Menu>

          <Menu iconShape="circle">
            <MenuItem icon={<ImProfile />} className="sidebar-menu-item">
              Profile
              <Link to="/manage-company/profile" />
            </MenuItem>
          </Menu>
        </SidebarContent>

        <SidebarFooter style={{ textAlign: "center" }}>
          <div
            className="sidebar-btn-wrapper flex justify-center"
            style={{
              padding: "20px 24px",
            }}
          >
            <NavLink
              onClick={handleLogout}
              className="nav-link "
              to="/signin"
              style={{
                color: "#e53e3e",
                fontWeight: "bold",
                fontSize: "1.1rem",
                letterSpacing: "1px",
                cursor: "pointer",
                minWidth: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TbLogout2 size={28} />
              <span className="mt-1 px-1">Logout</span>
            </NavLink>
          </div>
        </SidebarFooter>
      </ProSidebar>
    </div>
  );
};

export default Sidebar;
