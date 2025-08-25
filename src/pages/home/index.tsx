import { useState } from "react";

import { useSpring, easings, animated } from "@react-spring/web";
import { ArrowLeftToLine, LogOutIcon } from "lucide-react";

import {
  Container,
  Sidebar,
  Content,
  HideSidebarButton,
  LogOutButton,
  SidebarContent,
} from "./styled";

export default function Home() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    localStorage.getItem("ui.sidebar.visibility") === "true",
  );

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

  const logOut = () => {
    localStorage.removeItem("auth");
    window.location.reload();
  };

  return (
    <Container>
      <Sidebar style={sidebarSpring}>
        <HideSidebarButton $isVisible={isSidebarVisible} onClick={toggleSidebar}>
          <ArrowLeftToLine />
        </HideSidebarButton>
        <SidebarContent></SidebarContent>
        <LogOutButton onClick={logOut}>
          <LogOutIcon style={{ minWidth: 24 }} />
          <animated.span style={textSpring}>Log Out</animated.span>
        </LogOutButton>
      </Sidebar>

      <Content>
        <h1>Telefly</h1>
      </Content>
    </Container>
  );
}
