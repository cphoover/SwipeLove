import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import PersonAvatar from "../PersonAvatar";
import { Range, getTrackBackground } from "react-range";

// import RangeSlider from "react-range-slider-input";

const ProfilePhotoWrapper = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 9999px;
  border: 4px solid #2ecc71;
  overflow: hidden;
  margin-bottom: 16px;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UpdatePhotoWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const SettingsWrapper = styled.div`
  padding-bottom: 42px;
  margin-bottom: 22px;
  border-bottom: 1px solid #e5e7eb;
`;

const SettingsLabel = styled.label`
  color: #030303;
  font-size: 18px;
  font-family: "Montserrat";
  font-weight: 600;
  display: block;
  padding-bottom: 11px;
`;

const Setting = styled.div`
  padding-top: 34px;
`;
const SettingsText = styled.textarea`
  width: 100%;
  min-height: 98px;
  padding: 10px;
  /* padding-top: 10px; */
  border: 1px solid #d8d8d8;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  color: #000;
  font-size: 16px;
  font-family: "Montserrat";
  line-height: 130%;
  outline: none;
  resize: both;
`;

const AgeInput = styled.input`
  width: 100px;
  height: 38px;
  padding: 10px;
  border: 1px solid #d8d8d8;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  color: #000;
  font-size: 16px;
  font-family: "Montserrat";
  line-height: 38px;
  outline: none;
`;

const SettingsInput = styled.input`
  width: 100%;
  width: 343px;
  height: 38px;
  padding: 10px;
  border: 1px solid #d8d8d8;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  color: #000;
  font-size: 16px;
  font-family: "Montserrat";
  line-height: 38px;
  outline: none;
`;

const RangeWrapper = styled.div`
  margin-top: 20px;
`;

const RadioGroup = styled.div`
  display: flex;
  justify-content: space-between;
  /* padding-top: 10px; */
`;

const RadioLabel = styled.label`
  color: #030303;
  font-size: 18px;
  font-family: "Montserrat";
  font-weight: 400;
  display: flex;
  align-items: center;
`;

const RadioInput = styled.input`
  margin-right: 6px;
`;

const SaveWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ProfileSettingsScreen = () => {
  const userAge = 36;
  const defaultMinAge = Math.floor(userAge / 2) + 7;
  const defaultMaxAge = 2 * (userAge - 7);
  const [values, setValues] = useState([defaultMinAge, defaultMaxAge]);
  return (
    <>
      <Container>
        <MainHeader title="Profile Settings" />
        <Content>
          <UpdatePhotoWrapper>
            <ProfilePhotoWrapper>
              <img src="/images/profile-photos/person1.png" alt="Profile" />
            </ProfilePhotoWrapper>
            <Button>Update Photos</Button>
          </UpdatePhotoWrapper>
          <SettingsWrapper>
            <Setting>
              <SettingsLabel>Age:</SettingsLabel>
              <AgeInput type="number" placeholder="Your age" pattern="[0-9]*" inputmode="numeric" />
            </Setting>

            <Setting>
              <SettingsLabel>First Name:</SettingsLabel>
              <SettingsInput type="text" placeholder="Your first name" />
            </Setting>

            <Setting>
              <SettingsLabel>Last Name:</SettingsLabel>
              <SettingsInput type="text" placeholder="Your first name" />
            </Setting>
            <Setting>
              <SettingsLabel>Gender:</SettingsLabel>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="gender"
                    value="female"
                    // checked={gender === "female"}
                    // onChange={handleGenderChange}
                  />
                  Female
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="gender"
                    value="male"
                    // checked={gender === "male"}
                    // onChange={handleGenderChange}
                  />
                  Male
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="gender"
                    value="other"
                    // checked={gender === "other"}
                    // onChange={handleGenderChange}
                  />
                  Non-Binary
                </RadioLabel>
              </RadioGroup>
            </Setting>
            <Setting>
              <SettingsLabel>Bio</SettingsLabel>
              <SettingsText
                placeholder="Tell us about yourself..."
                rows="4"
                style={{ width: "100%" }}
              ></SettingsText>
            </Setting>
            <Setting>
              <SettingsLabel>Interests</SettingsLabel>
              <SettingsText
                placeholder="Skin care, hiking, reading, etc..."
                rows="4"
                style={{ width: "100%" }}
              ></SettingsText>
            </Setting>
            <Setting>
              <SettingsLabel>Age Preference</SettingsLabel>
              {/* <Range
                min={18}
                max={120}
                step={1}
                values={[defaultMinAge, defaultMaxAge]}
              /> */}
              <RangeWrapper>
                <Range
                  step={1}
                  min={18}
                  max={70}
                  values={values}
                  onChange={(values) => setValues(values)}
                  renderTrack={({ props, children }) => (
                    <div
                      onMouseDown={props.onMouseDown}
                      onTouchStart={props.onTouchStart}
                      style={{
                        ...props.style,
                        height: "4px",
                        display: "flex",
                        width: "100%",
                        WebkitTapHighlightColor: "transparent",
                        outline: "none",
                      }}
                    >
                      <div
                        ref={props.ref}
                        style={{
                          height: "4px",
                          width: "100%",
                          borderRadius: "4px",
                          WebkitTapHighlightColor: "transparent",
                          outline: "none",
                          background: getTrackBackground({
                            values,
                            colors: [
                              "#E6E6E6",
                              "rgba(2, 117, 255, 1)",
                              "#E6E6E6",
                            ],
                            min: 18,
                            max: 70,
                          }),
                          alignSelf: "center",
                        }}
                      >
                        {children}
                      </div>
                    </div>
                  )}
                  renderThumb={({ props, value, index }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "10px",
                        width: "10px",
                        WebkitTapHighlightColor: "transparent",
                        outline: "none",
                        borderRadius: "50%",
                        backgroundColor: "rgba(2, 117, 255, 1)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "-28px",
                          color: "#FFF",
                          WebkitTapHighlightColor: "transparent",
                          outline: "none",
                          backgroundColor: "#007bff",
                          padding: "4px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  )}
                />
              </RangeWrapper>
            </Setting>
            <Setting>
              <SettingsLabel>Gender Preference:</SettingsLabel>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput
                    type="checkbox"
                    name="gender"
                    value="female"
                    // checked={gender === "female"}
                    // onChange={handleGenderChange}
                  />
                  Female
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="checkbox"
                    name="gender"
                    value="male"
                    // checked={gender === "male"}
                    // onChange={handleGenderChange}
                  />
                  Male
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="checkbox"
                    name="gender"
                    value="other"
                    // checked={gender === "other"}
                    // onChange={handleGenderChange}
                  />
                  Non-Binary
                </RadioLabel>
              </RadioGroup>
            </Setting>
          </SettingsWrapper>
          <SaveWrapper>
            <Button>Save Changes</Button>
          </SaveWrapper>
        </Content>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default ProfileSettingsScreen;
