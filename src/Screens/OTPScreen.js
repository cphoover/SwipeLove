import { useState } from "react";
import { Container, Content } from "../Layout";
import { useRouter } from "../Router";
import { supabase } from "../db";
import { useAuth } from "../Providers/AuthProvider";
import OtpInput from "../OtpInput";

const OTPScreen = () => {
  const { goto } = useRouter();
  const { verifyOtp, isLoggedIn, user, session, phoneNumber } = useAuth();


  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    await verifyOtp(phoneNumber, otp);
    goto("home");
  };

  return (
    <Container>
      <Content>
        {isLoggedIn() && (
          <pre>{JSON.stringify({ user, session }, null, 4)}</pre>
        )}
        <h2>Enter OTP</h2>
        <OtpInput length={6} onComplete={(otp) => setOtp(otp)} />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerifyOtp}>Enter Code</button>
      </Content>
    </Container>
  );
};

export default OTPScreen;
