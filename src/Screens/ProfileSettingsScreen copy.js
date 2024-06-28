import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import PersonAvatar from "../PersonAvatar";
import { Range, getTrackBackground } from "react-range";
import { useRouter } from "../Router";

const ProfilePhotoWrapper = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 9999px;
  border: 4px solid ${LYFT_PINK};
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

const DateInput = styled.input`
  width: 150px;
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
  const { goto } = useRouter();
  const userAge = 36;
  const defaultMinAge = Math.floor(userAge / 2) + 7;
  const defaultMaxAge = 2 * (userAge - 7);
  const [values, setValues] = useState([defaultMinAge, defaultMaxAge]);
  
  const [birthdate, setBirthdate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [genderPreference, setGenderPreference] = useState([]);
  
  const allFieldsFilled = () => {
    return (
      birthdate && firstName && lastName && occupation && gender && bio && interests && genderPreference.length > 0
    );
  };

  return (
    <>
      <Container>
        <MainHeader title="Profile Settings" />
        <Content>
          <UpdatePhotoWrapper>
            <ProfilePhotoWrapper>
              <img src="./images/profile-photos/person1.png" alt="Profile" />
            </ProfilePhotoWrapper>
            <Button
              onClick={() => {
                goto("update-photos");
              }}
            >
              Update Photos
            </Button>
          </UpdatePhotoWrapper>
          <SettingsWrapper>
            <Setting>
              <SettingsLabel>Birthdate:</SettingsLabel>
              <DateInput
                type="date"
                placeholder="Your birthdate"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </Setting>

            <Setting>
              <SettingsLabel>First Name:</SettingsLabel>
              <SettingsInput
                type="text"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Setting>

            <Setting>
              <SettingsLabel>Last Name:</SettingsLabel>
              <SettingsInput
                type="text"
                placeholder="Your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Setting>

            <Setting>
              <SettingsLabel>Occupation:</SettingsLabel>
              <SettingsInput
                type="text"
                placeholder="E.g.: Nurse, Kindergarten Teacher"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </Setting>

            <Setting>
              <SettingsLabel>Gender:</SettingsLabel>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Female
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Male
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="gender"
                    value="other"
                    checked={gender === "other"}
                    onChange={(e) => setGender(e.target.value)}
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
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></SettingsText>
            </Setting>

            <Setting>
              <SettingsLabel>Interests</SettingsLabel>
              <SettingsText
                placeholder="Skin care, hiking, reading, etc..."
                rows="4"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              ></SettingsText>
            </Setting>

            <Setting>
              <SettingsLabel>Age Preference</SettingsLabel>
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
                  renderThumb={({ props, value }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "20px",
                        width: "20px",
                        WebkitTapHighlightColor: "transparent",
                        outline: "none",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "0px",
                          color: "#FFF",
                          WebkitTapHighlightColor: "transparent",
                          outline: "none",
                          backgroundColor: "#007bff",
                          padding: "4px",
                          borderRadius: "50%",
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
                    checked={genderPreference.includes("female")}
                    onChange={(e) => {
                      const value = e.target.value;
                      setGenderPreference((prev) =>
                        prev.includes(value)
                          ? prev.filter((item) => item !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  Female
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="checkbox"
                    name="gender"
                    value="male"
                    checked={genderPreference.includes("male")}
                    onChange={(e) => {
                      const value = e.target.value;
                      setGenderPreference((prev) =>
                        prev.includes(value)
                          ? prev.filter((item) => item !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  Male
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="checkbox"
                    name="gender"
                    value="other"
                    checked={genderPreference.includes("other")}
                    onChange={(e) => {
                      const value = e.target.value;
                      setGenderPreference((prev) =>
                        prev.includes(value)
                          ? prev.filter((item) => item !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  Non-Binary
                </RadioLabel>
              </RadioGroup>
            </Setting>
          </SettingsWrapper>
          <SaveWrapper>
            <Button disabled={!allFieldsFilled()}>
              {allFieldsFilled() ? "Save Changes" : "Complete All Fields to Save"}
            </Button>
          </SaveWrapper>
        </Content>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default ProfileSettingsScreen;
