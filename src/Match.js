import styled from "styled-components";
import { Button } from "./Layout";
import KissHeartAnimation from "./KissHeartAnimation";
import { LYFT_PINK } from "./themes/colors";
import Image from "./Image";
import { useRouter } from "./Router";

const MatchOverlayBack = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  /* z-index: 1000; */
`;

const MatchOverlay = styled.div`
  width: 343px;
  height: 288px;
  background-color: #ffffff;
  flex-direction: column;
  border-radius: 24px;
  box-shadow: 2px 0px 10px rgba(3, 3, 3, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MatchOverlayPhoto = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid ${LYFT_PINK};
  box-sizing: border-box;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const MatchOverlayTitle = styled.div`
  color: #030303;
  font-size: 24px;
  font-family: "Open Sans";
  font-weight: 500;
  line-height: 28px;
  text-align: center;
  margin-bottom: 9px;
`;

const MatchOverlayText = styled.div`
  color: #030303;
  font-size: 16px;
  font-family: "Open Sans";
  font-weight: 600;
  line-height: 19px;
  text-align: center;
  margin-bottom: 25px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
`;

const HideOverflow = styled.div`
  /* overflow: hidden; */
  /* height: 100vh; */
`;
const Match = ({ profile, onClose, onSendMsg, onClickProfilePhoto }) => {
  const { isCurrentPage } = useRouter();

  return (
    <>
      <MatchOverlayBack>
        <MatchOverlay>
          <MatchOverlayPhoto onClick={onClickProfilePhoto}>
            <Image src={profile?.photo_med} alt="Matched profile" />
          </MatchOverlayPhoto>
          <MatchOverlayTitle>It's a Match!</MatchOverlayTitle>
          <MatchOverlayText>
            You and {profile?.first_name} both liked each other.
          </MatchOverlayText>
          <ButtonRow>
            <Button onClick={onClose}>
              {isCurrentPage("home") ? "Keep Swiping" : "Close"}
            </Button>
            <Button onClick={onSendMsg}>Send Message</Button>
          </ButtonRow>
        </MatchOverlay>
      </MatchOverlayBack>
      <KissHeartAnimation start={true} />
    </>
  );
};

export default Match;
