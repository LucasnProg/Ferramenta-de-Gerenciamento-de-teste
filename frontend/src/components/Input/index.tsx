import React from 'react';
import * as C from './styles';

type Props = {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<Props> = ({ type, placeholder, value, onChange }) => {
    return (
        <C.Input 
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

export default Input;