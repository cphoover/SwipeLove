import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const OtpContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
`;

const OtpInputField = styled.input`
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 24px;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #5a7b91;
  }
`;

const OtpInput = ({ length = 4, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]$/.test(value) && value !== '') return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
    checkInputs(newOtp);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputsRef.current[index - 1].focus();
      }
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      checkInputs(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newOtp = pasteData.split('').concat(new Array(length - pasteData.length).fill(''));
    setOtp(newOtp);
    checkInputs(newOtp);
  };

  const checkInputs = (newOtp) => {
    const allFilled = newOtp.every((digit) => digit.trim() !== '');
    if (allFilled && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <OtpContainer>
      {otp.map((digit, index) => (
        <OtpInputField
          key={index}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => (inputsRef.current[index] = el)}
        />
      ))}
    </OtpContainer>
  );
};

export default OtpInput;
