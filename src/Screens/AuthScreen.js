import { useState } from "react";
import { Container, Content } from "../Layout";
import BottomTabMenu from "../BottomTabMenu";
import NotificationIcon from "../icons/notification";
import { useRouter } from "../Router";
import QuickFlingsLogo from "../icons/quickflings";
import {
  HomeHeaderWrapper,
  HomeHeaderLogo,
  HomeHeaderText,
  HomeHeaderButton,
  HiddenAdminButton,
} from "./HomeScreen.styles";
import { supabase } from "../db";
import { useAuth } from "../Providers/AuthProvider";
import OtpInput from "../OtpInput";

const AuthScreen = () => {
  const { goto } = useRouter();
  const {
    loginWithPhone,
    verifyOtp,
    logout,
    isLoggedIn,
    loading,
    user,
    session,
  } = useAuth();

  const [countryCode, setCountryCode] = useState("+1");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async () => {
    await loginWithPhone(`${countryCode}${phoneNumber}`);
    setIsOtpSent(true);
  };

  const handleLogout = async () => {
    await logout();
    goto("login");
  };

  const handleVerifyOtp = async () => {
    await verifyOtp(`${countryCode}${phoneNumber}`, otp);
  };

  return (
    <>
      {loading ? (
        <Container>
          <p>Loading...</p>
        </Container>
      ) : (
        <>
          <Container>
            <HomeHeaderWrapper>
              <HomeHeaderLogo>
                <QuickFlingsLogo />
                <HomeHeaderText>QuickFlings</HomeHeaderText>
              </HomeHeaderLogo>

              {!isLoggedIn() ? (
                <HiddenAdminButton
                  onClick={() => {
                    goto("admin");
                  }}
                ></HiddenAdminButton>
              ) : (
                <>
                  <HomeHeaderButton onClick={handleLogout}>
                    Logout
                  </HomeHeaderButton>
                  <HomeHeaderButton
                    onClick={() => {
                      goto("notifications");
                    }}
                  >
                    <NotificationIcon />
                  </HomeHeaderButton>
                </>
              )}
            </HomeHeaderWrapper>

            <Content>
              <div>
                {isLoggedIn() && (
                  <strong>
                    user:
                    {JSON.stringify(
                      {
                        user,
                        session,
                      },
                      null,
                      4
                    )}
                  </strong>
                )}
                <h2>Phone Login</h2>
                {!isOtpSent ? (
                  <>
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
                    <button onClick={handleSendOtp}>Login</button>
                  </>
                ) : (
                  <>
                    <OtpInput length={6} onComplete={(otp) => setOtp(otp)} />
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={handleVerifyOtp}>Enter Code</button>
                  </>
                )}
              </div>
            </Content>
          </Container>
          <BottomTabMenu />
        </>
      )}
    </>
  );
};

export default AuthScreen;
