import styled from "styled-components";

const AvatarWrapper = styled.div`
  position: relative;

  width: ${({ small }) => (small ? "40px" : "60px")};
  height: ${({ small }) => (small ? "40px" : "60px")};
  border-radius: 50%;
  overflow: hidden;
`;

const AvatarPhoto = styled.img`
  width: 100%;
 
  position: relative;
`;


const PersonAvatar = ({ photoUrl, small }) => (
  <AvatarWrapper  small={small}>
    <AvatarPhoto src={photoUrl} alt="Friend's Photo" />
    {/* <MarkerPoint /> */}
  </AvatarWrapper>
);

export default PersonAvatar;
