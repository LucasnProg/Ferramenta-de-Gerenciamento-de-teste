import React from 'react';
import * as C from './styles';

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    style?: React.CSSProperties;
    disabled?: boolean;
};

const Button: React.FC<Props> = ({ children, onClick, type = "button", style }) => {
    return (
        <C.Button type={type} onClick={onClick} style={style}>
            {children}
        </C.Button>
    );
};

export default Button;