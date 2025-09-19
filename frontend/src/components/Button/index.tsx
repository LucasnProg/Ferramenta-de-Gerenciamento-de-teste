import React from "react";
import * as C from "./styles";

interface ButtonProps {
  Text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>;
  Type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
}

  const Button: React.FC<ButtonProps> = ({ Text, onClick, Type, children }) => {
    return (
      <C.Button type={Type} onClick={onClick}>
        {Text || children}
      </C.Button>
    );
  };
  
  export default Button;
