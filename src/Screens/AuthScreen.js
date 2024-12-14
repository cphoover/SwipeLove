import { useState } from "react";
import { Container, Content } from "../Layout";
import { useRouter } from "../Router";
import { useAuth } from "../Providers/AuthProvider";

const AuthScreen = () => {
  const { goto } = useRouter();
  const { loginWithPhone, logout, isLoggedIn } = useAuth();

  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSendOtp = async () => {
    await loginWithPhone(`${countryCode}${phoneNumber}`);
    goto("otp");
  };

  return (
    <Container>
      {isLoggedIn() && <button onClick={logout}>Logout</button>}
      <Content>
        <h2>Phone Login</h2>
        <select
          id="countryCode"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <option value="+1">+1 (US)</option>
          <option value="+44">+44 (UK)</option>
          <option value="+91">+91 (India)</option>
          <option value="+61">+61 (Australia)</option>
        </select>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button onClick={handleSendOtp}>Send OTP</button>
      </Content>
    </Container>
  );
};

export default AuthScreen;
