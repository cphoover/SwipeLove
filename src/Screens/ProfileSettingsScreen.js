import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import { Range, getTrackBackground } from "react-range";
import { useRouter } from "../Router";
import { useMyPhotos } from "../Providers/MyPhotosProvider";
import Image from "../Image";
import { getUserId } from "../utils";
import { useLoadingBar } from "../Providers/LoadingBarProvider";
import { supabase } from "../db";
import { useMyUser } from "../Providers/MyUserProvider";
import { LYFT_PINK, LYFT_PINK_LIGHT } from "../themes/colors";

const ProfilePhotoWrapper = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 9999px;
  border: 4px solid ${LYFT_PINK_LIGHT};
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
  accent-color: ${LYFT_PINK};
`;

const SaveWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const ProfileSettingsScreen = () => {
  const { initializeLoadingBar, finishLoadingBar } = useLoadingBar();
  const { mainPhoto, photos, mainPhotoId } = useMyPhotos();
  const { userData, myUserDataLoaded, saveUserData } = useMyUser();

  const { goto } = useRouter();
  const userAge = 36;
  const defaultMinAge = Math.floor(userAge / 2) + 7;
  const defaultMaxAge = 2 * (userAge - 7);
  const [agePreferenceValues, setAgePreferenceValues] = useState([
    defaultMinAge,
    defaultMaxAge,
  ]);

  const [birthdate, setBirthdate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [genderPreference, setGenderPreference] = useState([]);

  useEffect(() => {
    if (userData) {
      setBirthdate(userData.birthdate || "");
      setFirstName(userData.first_name || "");
      setLastName(userData.last_name || "");
      setOccupation(userData.occupation || "");
      setGender(userData.gender || "");
      setBio(userData.bio || "");
      setInterests(userData.interests || "");
      setGenderPreference(
        userData.gender_pref ? userData.gender_pref.split(",") : []
      );
      setAgePreferenceValues([
        userData.age_pref_start || defaultMinAge,
        userData.age_pref_end || defaultMaxAge,
      ]);
    }
  }, [userData]);

  const [touched, setTouched] = useState({
    birthdate: false,
    firstName: false,
    lastName: false,
    occupation: false,
    gender: false,
    bio: false,
    interests: false,
    genderPreference: false,
  });

  const allFieldsFilled = () => {
    return (
      birthdate &&
      firstName &&
      lastName &&
      occupation &&
      gender &&
      bio &&
      interests &&
      genderPreference.length > 0
    );
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true,
    });
  };

  const handleSave = async () => {
    initializeLoadingBar("updateProfile");
    const payload = {
      user_id: getUserId(), // Replace with actual user_id
      updated_at: new Date().toISOString(),
      first_name: firstName,
      last_name: lastName,
      bio,
      birthdate,
      gender,
      age_pref_start: agePreferenceValues[0],
      age_pref_end: agePreferenceValues[1],
      gender_pref: genderPreference.join(","),
      occupation,
      interests,
    };

    try {
      await saveUserData(payload);
    } catch (error) {
      console.error(error);
    }

    finishLoadingBar("updateProfile");
  };

  return (
    <>
      <Container>
        {/* <MainHeader title="Profile Settings" /> */}
        <MainHeader title="Get Started" />
        <Content>
          <UpdatePhotoWrapper>
            <ProfilePhotoWrapper>
              <Image
                src={
                  mainPhoto?.photo_med ||
                  "/images/profile-photos/defaultavatar.jpeg"
                }
                alt="Profile"
              />
            </ProfilePhotoWrapper>
            <Button
              onClick={() => {
                goto("update-photos");
              }}
            >
              Manage Profile Photos
            </Button>
          </UpdatePhotoWrapper>
          {myUserDataLoaded && (
            <SettingsWrapper>
              <Setting>
                <SettingsLabel>Birthdate:</SettingsLabel>
                <DateInput
                  type="date"
                  placeholder="Your birthdate"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  onBlur={() => handleBlur("birthdate")}
                  required
                />
                {touched.birthdate && !birthdate && (
                  <ErrorMessage>Birthdate is required.</ErrorMessage>
                )}
              </Setting>

              <Setting>
                <SettingsLabel>First Name:</SettingsLabel>
                <SettingsInput
                  type="text"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  required
                />
                {touched.firstName && !firstName && (
                  <ErrorMessage>First name is required.</ErrorMessage>
                )}
              </Setting>

              <Setting>
                <SettingsLabel>Last Name:</SettingsLabel>
                <SettingsInput
                  type="text"
                  placeholder="Your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  required
                />
                {touched.lastName && !lastName && (
                  <ErrorMessage>Last name is required.</ErrorMessage>
                )}
              </Setting>

              <Setting>
                <SettingsLabel>Occupation:</SettingsLabel>
                <SettingsInput
                  type="text"
                  placeholder="E.g.: Nurse, Kindergarten Teacher"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  onBlur={() => handleBlur("occupation")}
                  required
                />
                {touched.occupation && !occupation && (
                  <ErrorMessage>Occupation is required.</ErrorMessage>
                )}
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
                      onBlur={() => handleBlur("gender")}
                      required
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
                      onBlur={() => handleBlur("gender")}
                      required
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
                      onBlur={() => handleBlur("gender")}
                      required
                    />
                    Non-Binary
                  </RadioLabel>
                </RadioGroup>
                {touched.gender && !gender && (
                  <ErrorMessage>Gender is required.</ErrorMessage>
                )}
              </Setting>

              <Setting>
                <SettingsLabel>Bio</SettingsLabel>
                <SettingsText
                  placeholder="Tell us about yourself..."
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  onBlur={() => handleBlur("bio")}
                  required
                ></SettingsText>
                {touched.bio && !bio && (
                  <ErrorMessage>Bio is required.</ErrorMessage>
                )}
              </Setting>

              <Setting>
                <SettingsLabel>Interests</SettingsLabel>
                <SettingsText
                  placeholder="Skin care, hiking, reading, etc..."
                  rows="4"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  onBlur={() => handleBlur("interests")}
                  required
                ></SettingsText>
                {touched.interests && !interests && (
                  <ErrorMessage>Interests are required.</ErrorMessage>
                )}
              </Setting>

              <Setting>
                <SettingsLabel>Age Preference</SettingsLabel>
                <RangeWrapper>
                  <Range
                    step={1}
                    min={18}
                    max={70}
                    values={agePreferenceValues}
                    onChange={(values) => setAgePreferenceValues(values)}
                    renderTrack={({ props: { key, ...rest }, children }) => (
                      <div
                        onMouseDown={rest.onMouseDown}
                        onTouchStart={rest.onTouchStart}
                        style={{
                          ...rest.style,
                          height: "4px",
                          display: "flex",
                          width: "100%",
                          WebkitTapHighlightColor: "transparent",
                          outline: "none",
                        }}
                      >
                        <div
                          ref={rest.ref}
                          style={{
                            height: "4px",
                            width: "100%",
                            borderRadius: "4px",
                            WebkitTapHighlightColor: "transparent",
                            outline: "none",
                            background: getTrackBackground({
                              values: agePreferenceValues,
                              colors: [
                                "#E6E6E6",
                                LYFT_PINK,
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
                    renderThumb={({ props: { key, ...rest }, value }) => (
                      <div
                        {...rest}
                        style={{
                          ...rest.style,
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
                            backgroundColor: LYFT_PINK,
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
                      name="genderPreference"
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
                      onBlur={() => handleBlur("genderPreference")}
                      required
                    />
                    Female
                  </RadioLabel>
                  <RadioLabel>
                    <RadioInput
                      type="checkbox"
                      name="genderPreference"
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
                      onBlur={() => handleBlur("genderPreference")}
                      required
                    />
                    Male
                  </RadioLabel>
                  <RadioLabel>
                    <RadioInput
                      type="checkbox"
                      name="genderPreference"
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
                      onBlur={() => handleBlur("genderPreference")}
                      required
                    />
                    Non-Binary
                  </RadioLabel>
                </RadioGroup>
                {touched.genderPreference && genderPreference.length === 0 && (
                  <ErrorMessage>Gender preference is required.</ErrorMessage>
                )}
              </Setting>
            </SettingsWrapper>
          )}
          <SaveWrapper>
            <Button disabled={!allFieldsFilled()} onClick={handleSave}>
              {allFieldsFilled()
                ? "Save Changes"
                : "Complete All Fields to Save"}
            </Button>
          </SaveWrapper>
        </Content>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default ProfileSettingsScreen;
