import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const ALLOWED_SLUGS = new Set([
  "trang-chu",
  "dich-vu",
  "gia-cong",
  "gioi-thieu",
  "lien-he",
  "san-pham",
  "tin-tuc",
  "cnc-infor",
]);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = body?.slug;
  if (!slug || !ALLOWED_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  revalidateTag(`page:${slug}`);
  return NextResponse.json({ revalidated: true, slug });
}
