import { useEffect, useState } from "react";

import { useSpring, easings, animated } from "@react-spring/web";
import { ArrowLeftToLine, LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Sidebar,
  Content,
  HideSidebarButton,
  LogOutButton,
  SidebarContent,
  Chat,
  Header,
  Input,
} from "./styled";
import { useTDL } from "../../hooks/use-tdl";

export default function Home() {
  const { getCurrentUser, init, logout } = useTDL();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    localStorage.getItem("ui.sidebar.visibility") === "true",
  );
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const sidebarSpring = useSpring({
    width: isSidebarVisible ? 350 : 50,
    config: {
      duration: 300,
      easing: easings.easeInOutCubic,
    },
  });

  const textSpring = useSpring({
    opacity: isSidebarVisible ? 1 : 0,
    width: isSidebarVisible ? "auto" : 0,
    config: {
      duration: 300,
      easing: easings.easeInOutCubic,
    },
  });

  const toggleSidebar = () => {
    const value = !isSidebarVisible;
    setIsSidebarVisible(value);
    localStorage.setItem("ui.sidebar.visibility", value.toString());
  };

  const logOut = async () => {
    try {
      await logout();
      localStorage.removeItem("auth");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("auth");
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const getUser = async () => {
      await init();
      const res = await getCurrentUser();

      if (res.success) {
        setUser(res.data);
      } else {
        localStorage.removeItem("auth");
        navigate("/login", { replace: true });
      }
    };
    getUser();
  }, []);

  return (
    <Container>
      <Sidebar style={sidebarSpring}>
        <HideSidebarButton $isVisible={isSidebarVisible} onClick={toggleSidebar}>
          <ArrowLeftToLine />
        </HideSidebarButton>
        <SidebarContent></SidebarContent>
        <LogOutButton onClick={logOut}>
          <LogOutIcon style={{ minWidth: "24px" }} />
          <animated.span style={textSpring}>
            Log Out{" "}
            <i>
              {user?.firstName} {user?.lastName}
            </i>
          </animated.span>
        </LogOutButton>
      </Sidebar>

      <Content>
        <Header />
        <Chat />
        <Input
          rows={1}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
      </Content>
    </Container>
  );
}
