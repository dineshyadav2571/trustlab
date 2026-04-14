import { ReactNode } from "react";
import { UserContentFab } from "@/app/components/user/UserContentFab";

export default function UserZoneLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <UserContentFab />
    </>
  );
}
