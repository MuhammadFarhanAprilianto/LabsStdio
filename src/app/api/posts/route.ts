import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { excerpt: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { publishedAt: "desc" },
    }); 

    const parsedPosts = posts
      .map((post) => ({
        ...post,
        categories: (() => {
          try {
            return JSON.parse(post.categories);
          } catch {
            return [];
          }
        })(),
      }))
      .filter((post) => {
        if (!category || category === "All") return true;
        return post.categories.includes(category);
      });

    return NextResponse.json(
      {
        success: true,
        count: parsedPosts.length,
        data: parsedPosts,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("[API_POSTS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      content = "",
      image = "/images/BestDesign.webp",
      categories = ["UI/UX Design"],
      readTime = "5 min read",
      authorName = "Labs Stdio",
      authorRole = "Product Studio Team",
      featured = false,
      status = "PUBLISHED",
    } = body;

    if (!title || !excerpt) {
      return NextResponse.json(
        { success: false, error: "Title and excerpt are required." },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now().toString().slice(-4);

    const post = await prisma.post.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        image,
        categories:
          typeof categories === "string"
            ? categories
            : JSON.stringify(categories),
        readTime,
        authorName,
        authorRole,
        featured: Boolean(featured),
        status,
        viewCount: 0,
      },
    });

    try {
      revalidatePath("/journal");
      revalidatePath("/admin");
    } catch {
      // Safe fallback
    }

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error("[API_POSTS_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post." },
      { status: 500 }
    );
  }
}

