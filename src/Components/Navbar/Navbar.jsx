import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
} from "@heroui/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../Context/authContext";

export default function MyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthenticatedUser, clearUserToken } = useContext(authContext);

  const navigate = useNavigate();

  const menuItems = isAuthenticatedUser
    ? ["Home", "Profile"]
    : ["Register", "Login"];

  function handleLogout() {
    localStorage.removeItem("userToken");
    clearUserToken();
    navigate("/login");
  }

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden cursor-pointer"
      />
      <NavbarBrand>
        <p className="font-bold text-brand-light text-2xl sm:text-3xl">
          Linked Posts
        </p>
      </NavbarBrand>

      <div className="flex gap-4 items-center">
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {isAuthenticatedUser ? (
            <>
              <NavbarItem>
                <Link color="foreground" to="/home">
                  Home
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link color="foreground" to="/profile">
                  Profile
                </Link>
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem>
                <Link
                  className="hover:text-brand-light transition-colors duration-300"
                  color="foreground"
                  to="/login"
                >
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  className="hover:text-brand-light transition-colors duration-300"
                  color="foreground"
                  to="/register"
                >
                  Register
                </Link>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        {isAuthenticatedUser && (
          <NavbarContent as="div">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name="Jason Hughes"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  onClick={handleLogout}
                  key="logout"
                  color="danger"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        )}
      </div>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="flex w-full"
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              to={`/${item.toLowerCase()}`}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
