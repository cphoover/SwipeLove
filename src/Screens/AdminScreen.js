import React, { useEffect, useState } from "react";
import { Container, Content } from "../Layout";
import MainHeader from "../MainHeader";
import BottomTabMenu from "../BottomTabMenu";
import { useRouter } from "../Router";
import { supabase } from "../db"; // Make sure to import your Supabase client
import { useMatches } from "../Providers/MatchesProvider";

const AdminScreen = () => {
  const { goto } = useRouter();
  const [users, setUsers] = useState([]);
  // const { setLatestMatchEpoch } = useMatches();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: userProfiles, error: userProfilesError } = await supabase
        .from("user_profiles")
        .select("user_id, first_name, last_name");

      if (userProfilesError) {
        console.error("Error fetching user profiles:", userProfilesError);
        return;
      }

      const { data: mainPhotos, error: mainPhotosError } = await supabase
        .from("main_photos")
        .select("user_id, photo_id");

      if (mainPhotosError) {
        console.error("Error fetching main photos:", mainPhotosError);
        return;
      }

      const { data: profilePhotos, error: profilePhotosError } = await supabase
        .from("profile_photos")
        .select("id, photo_small");

      if (profilePhotosError) {
        console.error("Error fetching profile photos:", profilePhotosError);
        return;
      }

      const usersWithPhotos = userProfiles.map((user) => {
        const mainPhoto = mainPhotos.find(
          (photo) => photo.user_id === user.user_id
        );
        if (mainPhoto) {
          const profilePhoto = profilePhotos.find(
            (photo) => photo.id === mainPhoto.photo_id
          );
          if (profilePhoto) {
            user.photo_small = profilePhoto.photo_small;
          }
        }
        return user;
      });

      setUsers(usersWithPhotos);
    };

    fetchUsers();
  }, []);

  const handleUserChange = (event) => {
    const userId = event.target.value;
    const user = users.find((u) => u.user_id === userId);
    setSelectedUser(user);
  };

  const switchUser = () => {
    localStorage.setItem("userId", selectedUser.user_id);
    goto("home");
    window.location.reload();
  };

  const deleteUserProfile = async () => {
    if (window.confirm(`Are you sure you want to delete the profile of ${selectedUser.first_name} ${selectedUser.last_name}? This action cannot be undone.`)) {
      const { error: interactionsError } = await supabase
        .from("interactions")
        .delete()
        .or(`user_id_from.eq.${selectedUser.user_id},user_id_to.eq.${selectedUser.user_id}`);

      if (interactionsError) {
        console.error("Error deleting interactions:", interactionsError);
        return;
      }

      const { error: matchesError } = await supabase
        .from("matches")
        .delete()
        .or(`user_id_1.eq.${selectedUser.user_id},user_id_2.eq.${selectedUser.user_id}`);

      if (matchesError) {
        console.error("Error deleting matches:", matchesError);
        return;
      }

      const { error: userProfileError } = await supabase
        .from("user_profiles")
        .delete()
        .eq("user_id", selectedUser.user_id);

      if (userProfileError) {
        console.error("Error deleting user profile:", userProfileError);
      } else {
        setUsers(users.filter((user) => user.user_id !== selectedUser.user_id));
        setSelectedUser(null);
        alert("User profile deleted successfully.");
      }
    }
  };

  const resetInteractions = async () => {
    if (window.confirm(`Are you sure you want to reset interactions for ${selectedUser.first_name} ${selectedUser.last_name}? This action cannot be undone.`)) {
      const { error: interactionsError } = await supabase
        .from("interactions")
        .delete()
        .or(`user_id_from.eq.${selectedUser.user_id},user_id_to.eq.${selectedUser.user_id}`);

      if (interactionsError) {
        console.error("Error deleting interactions:", interactionsError);
        return;
      }

      const { error: matchesError } = await supabase
        .from("matches")
        .delete()
        .or(`user_id_1.eq.${selectedUser.user_id},user_id_2.eq.${selectedUser.user_id}`);

      if (matchesError) {
        console.error("Error deleting matches:", matchesError);
        return;
      }

      alert("Interactions and matches reset successfully.");
    }
  };

  const resetAllInteractionsAndMatches = async () => {
    if (window.confirm("Are you sure you want to reset all interactions and matches? This action cannot be undone.")) {
      const { error: interactionsError } = await supabase
        .from("interactions")
        .delete()
        .gt("created_at", "1900-01-01"); // This effectively deletes all records

      if (interactionsError) {
        console.error("Error deleting all interactions:", interactionsError);
        return;
      }

      const { error: matchesError } = await supabase
        .from("matches")
        .delete()
        .gt("created_at", "1900-01-01"); // This effectively deletes all records

      if (matchesError) {
        console.error("Error deleting all matches:", matchesError);
        return;
      }

      alert("All interactions and matches reset successfully.");
    }
  };

  return (
    <>
      <Container>
        <MainHeader title="Admin Screen" />
        <Content>
          <label htmlFor="user-select">Select User: </label>
          <select id="user-select" onChange={handleUserChange}>
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>

          {selectedUser && (
            <>
              <div>
                <img
                  src={selectedUser.photo_small}
                  alt="Profile"
                  style={{ width: 100, height: 100, borderRadius: "50%" }}
                />
                <p>
                  {selectedUser.first_name} {selectedUser.last_name}
                </p>
                <button onClick={switchUser}>
                  Switch to {selectedUser.first_name} {selectedUser.last_name}'s
                  Profile
                </button>
              </div>

              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={resetInteractions}
                  style={{ backgroundColor: "orange", color: "white" }}
                >
                  RESET INTERACTIONS
                </button>
              </div>
              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={deleteUserProfile}
                  style={{ backgroundColor: "red", color: "white" }}
                >
                  DELETE USER PROFILE (WARNING)
                </button>
              </div>
            </>
          )}
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={resetAllInteractionsAndMatches}
              style={{ backgroundColor: "red", color: "white" }}
            >
              RESET ALL INTERACTIONS AND MATCHES (WARNING)
            </button>
          </div>
          <br />
          <br />

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to create a new user? This action will log you out.")) {
                  localStorage.removeItem("userId");
                  goto("settings");
                  window.location.reload();
                }
              }}
              style={{ backgroundColor: "green", color: "white" }}
            >
              Create New User
            </button>
          </div>
        </Content>
      </Container>
      <BottomTabMenu />
    </>
  );
};

export default AdminScreen;
