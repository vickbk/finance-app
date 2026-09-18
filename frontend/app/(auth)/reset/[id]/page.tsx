import { AuthFooter, ResetPassword } from "@/features/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create a new password",
};

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) redirect("/reset");

  return (
    <ResetPassword id={id}>
      <AuthFooter
        text="Remember your password?"
        link={{ text: "Login here", path: "/login" }}
      />
    </ResetPassword>
  );
}

export default Page;
