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
    verifyOtp,
    logout,
    isLoggedIn,
    loading,
    user,
    session,
  } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogout = async () => {
    await logout();
    goto("login");
  };

  const handleVerifyOtp = async () => {
    await verifyOtp(phoneNumber, otp);
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

                <>
                  <OtpInput length={6} onComplete={(otp) => setOtp(otp)} />
                  <button onClick={handleVerifyOtp}>Enter Code</button>
                </>
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
