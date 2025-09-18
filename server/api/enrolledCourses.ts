import { defineEventHandler, readBody } from "h3";
import fsExtra from "fs-extra";
import { join } from "path";

const { readJson, writeJson } = fsExtra;
const filePath = join(process.cwd(), "data", "enrolledCourses.json");

async function loadEnrolledCourses() {
  try {
    return await readJson(filePath);
  } catch {
    return [];
  }
}

async function saveEnrolledCourses(courses: any[]) {
  await writeJson(filePath, courses, { spaces: 2 });
}

export default defineEventHandler(async (event) => {
  const method = event.req.method;
  let courses = await loadEnrolledCourses();

  if (method === "GET") {
    return courses;
  }

  if (method === "POST") {
    const body = await readBody(event);
    if (!courses.some((c: any) => c.id === body.id)) {
      courses.push(body);
      await saveEnrolledCourses(courses);
    }
    return { success: true };
  }

  return { error: "Method not allowed" };
});
