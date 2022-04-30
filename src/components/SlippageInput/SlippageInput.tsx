import React from 'react';
import Input, { InputProps } from '../Input';

interface SlippageInputProps extends InputProps {}

const SlippageInput: React.FC<SlippageInputProps> = ({ onChange, value }) => {
  return <Input onChange={onChange} placeholder="0" value={value} />;
};

export default SlippageInput;
