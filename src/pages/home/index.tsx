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
  Chat,
  Header,
  Input,
} from "./styled";

export default function Home() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    localStorage.getItem("ui.sidebar.visibility") === "true",
  );
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const textarea = e.target;
    textarea.style.height = "40px";

    const lineHeight = 24;
    const padding = 16;
    const singleLineHeight = lineHeight + padding;
    const maxHeight = lineHeight * 5 + padding;

    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(scrollHeight, maxHeight);

    if (newHeight > singleLineHeight) {
      textarea.style.height = `${newHeight}px`;
    }
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
          <LogOutIcon style={{ minWidth: "24px" }} />
          <animated.span style={textSpring}>Log Out</animated.span>
        </LogOutButton>
      </Sidebar>

      <Content>
        <Header />
        <Chat />
        <Input value={inputValue} onChange={handleInputChange} placeholder="Type your message..." />
      </Content>
    </Container>
  );
}
