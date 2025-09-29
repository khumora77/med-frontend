import { useEffect, useState } from "react";

import { IconButton, Menu, MenuItem } from "@mui/material";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { LogoutButton } from "./logout";
import { api } from "../../service/api";


const Profile = () => {
  const [user, setUser] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* Trigger icon */}
      <IconButton onClick={handleClick}>
        <User />
      </IconButton>

      {/* Dropdown menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem disabled>{user.email}</MenuItem>
        <MenuItem disabled>{user.role}</MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/change-password" style={{ textDecoration: "none", color: "inherit" }}>
            Change Password
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <LogoutButton />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Profile;
