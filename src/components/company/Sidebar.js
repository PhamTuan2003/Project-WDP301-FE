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
import sidebarBg from "../../assets/sidebar.jpg";
import { doLogout } from "../../redux/actions";
const Sidebar = (props) => {
  const { collapsed, toggled, handleToggleSidebar } = props;

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(doLogout());
  };
  return (
    <div>
      <ProSidebar
        image={sidebarBg}
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
            <MenuItem icon={<MdDashboard />}>
              Dashboard
              <Link to="/manage-company" />
            </MenuItem>
          </Menu>
          <Menu iconShape="circle">
            <MenuItem icon={<TbBrandBooking />}>
              Customer Booking
              <Link to="/manage-company/booking" />
            </MenuItem>
          </Menu>
          <Menu iconShape="circle">
            <MenuItem icon={<FaShip />}>
              {" "}
              View Yacht
              <Link to="/manage-company/view-yacht" />
            </MenuItem>
          </Menu>

          <Menu iconShape="circle">
            <MenuItem icon={<SlCalender />}>
              {" "}
              Schedule Yacht
              <Link to="/manage-company/schedule" />
            </MenuItem>
          </Menu>

          <Menu iconShape="circle">
            <MenuItem icon={<ImProfile />}>
              Profile
              <Link to="/manage-company/profile" />
            </MenuItem>
          </Menu>
        </SidebarContent>

        <SidebarFooter style={{ textAlign: "center" }}>
          <div
            className="sidebar-btn-wrapper d-flex justify-content-center"
            style={{
              padding: "20px 24px",
            }}
          >
            <NavLink onClick={handleLogout} className="nav-link " to="/signin">
              <TbLogout2 />
              Logout
            </NavLink>
          </div>
        </SidebarFooter>
      </ProSidebar>
    </div>
  );
};

export default Sidebar;
