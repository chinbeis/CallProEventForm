"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const store = await cookies();
    store.set("admin_auth", getSessionToken(), {
      httpOnly: true,
      sameSite: "strict",
      path: "/admin",
      maxAge: 60 * 60 * 8,
    });
    redirect("/admin");
  }

  redirect("/admin/login?error=1");
}

export async function logoutAction() {
  const store = await cookies();
  store.set("admin_auth", "", { maxAge: 0, path: "/admin" });
  redirect("/admin/login");
}
