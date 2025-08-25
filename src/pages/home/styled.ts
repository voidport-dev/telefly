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
  flex-shrink: 0;
  overflow: hidden;
  background: #222;
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

export const Content = styled.div`
  flex: 1;
  padding: 8px;
  overflow: hidden;
  background: #222;
`;
