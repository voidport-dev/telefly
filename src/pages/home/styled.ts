import styled from "@emotion/styled";
import { animated } from "@react-spring/web";

export const Container = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
  width: 100%;
  height: 100%;
  padding: 8px;
  background: #333;
`;

export const Sidebar = styled(animated.div)`
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  overflow: hidden;
  background: #222;
`;

export const SidebarContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
`;

export const HideSidebarButton = styled.button<{ $isVisible: boolean }>`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 20px;
  height: 20px;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  background: none;
  border: none;
  transform: ${({ $isVisible }) => ($isVisible ? "rotate(0deg)" : "rotate(180deg)")};
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.75;
  }
`;

export const LogOutButton = styled.button`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin-inline: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
  background: #111;
  border: none;
  transition: all 0.2s ease-in-out;

  & > span {
    overflow: hidden;
    white-space: nowrap;
  }

  &:hover {
    opacity: 0.75;
  }
`;

export const Content = styled.div`
  flex: 1;
  overflow: hidden;
  background: #222;
  display: grid;
  grid-template-rows: 50px 1fr auto;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #111;
`;

export const Chat = styled.div`
  flex: 1;
`;

export const Input = styled.textarea`
  display: flex;
  align-items: center;
  justify-content: space-between;
  resize: none;
  background: #111;
  border: none;
  color: #fff;
  font-size: 16px;
  padding: 8px;
  border-radius: 8px;
  outline: none;
  height: 40px;
  max-height: 120px;
  overflow-y: auto;
  line-height: 24px;
`;
