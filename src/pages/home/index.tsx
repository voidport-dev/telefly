import { useState } from "react";

import { useSpring, easings } from "@react-spring/web";
import { ArrowLeftToLine } from "lucide-react";

import { Container, Sidebar, Content, HideSidebarButton } from "./styled";

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

  const toggleSidebar = () => {
    const value = !isSidebarVisible;
    setIsSidebarVisible(value);
    localStorage.setItem("ui.sidebar.visibility", value.toString());
  };

  return (
    <Container>
      <Sidebar style={sidebarSpring}>
        <HideSidebarButton $isVisible={isSidebarVisible} onClick={toggleSidebar}>
          <ArrowLeftToLine />
        </HideSidebarButton>
      </Sidebar>

      <Content>
        <h1>Telefly</h1>
      </Content>
    </Container>
  );
}
