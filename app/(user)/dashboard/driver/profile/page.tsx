import type { Metadata } from "next";
import ProfilePage from "@/components/user/profile/ProfilePage";

export const metadata: Metadata = {
  title: "Mi perfil",
  robots: { index: false, follow: false },
};

const Profile = () => {
    return <ProfilePage />;
};

export default Profile;
