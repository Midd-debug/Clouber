import React from "react";
import Profile from "../components/Profile";

function ProfilePage() {
  const user = { name: "Wilbian", email: "wilbian@example.com" }; // Ejemplo
  return <Profile user={user} />;
}

export default ProfilePage;
