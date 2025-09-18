import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import type { User } from "@/types/User";

const USERS_FILE = path.resolve("data/auth.json");

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name: string;
    email: string;
    password: string;
    adminSecret?: string;
  }>(event);

  // ensure file exists
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]");
  }

  const users: any[] = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));

  if (users.find((u) => u.email === body.email)) {
    throw createError({ statusCode: 400, message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const role: User["role"] =
    body.adminSecret && body.adminSecret === process.env.ADMIN_SECRET
      ? "admin"
      : "user";

  const newUser = {
    id: uuidv4(),
    name: body.name,
    email: body.email,
    password: hashedPassword,
    role,
  };

  users.push(newUser);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

  // return safe user
  return { id: newUser.id, name: newUser.name, email: newUser.email, role };
});
