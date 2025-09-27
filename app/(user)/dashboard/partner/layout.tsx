"use client"
import Sidebar from "@/components/user/Sidebar";
import NavBar from "@/components/public/navigation/NavBar";
import PhoneReminderModal from "@/components/common/PhoneReminderModal";

export default function ClientPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen flex flex-col`}>
      <NavBar />
      <PhoneReminderModal />

      <div className={`flex justify-center items-start grow pt-16 px-4`}>
        <div className={`flex grow max-w-screen-xl w-full gap-8`}>
          <Sidebar />
          <main className={`w-full flex grow`}>{children}</main>
        </div>
      </div>
    </div>
  );
}
