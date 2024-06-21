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
  // z-index: 2;
 
 
`;

// const MarkerPoint = styled.div`
//   position: absolute;
//   bottom: -12px;
//   left: calc(50% + 2px);
//   transform: translateX(-50%);
//   width: 0;
//   height: 0;
//   z-index: 2;
//   border-left: 10px solid transparent;
//   border-right: 10px solid transparent;
//   border-top: 10px solid white;
// `;

const PersonAvatar = ({ photoUrl, small }) => (
  <AvatarWrapper  small={small}>
    <AvatarPhoto src={photoUrl} alt="Friend's Photo" />
    {/* <MarkerPoint /> */}
  </AvatarWrapper>
);

export default PersonAvatar;
