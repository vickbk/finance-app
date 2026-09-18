import { AuthFooter, VerifyResetCode } from "@/features/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify reset code",
};

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) redirect("/reset");

  return (
    <VerifyResetCode id={id}>
      <AuthFooter
        text="Remember your password?"
        link={{ text: "Login here", path: "/login" }}
      />
    </VerifyResetCode>
  );
}

export default Page;
