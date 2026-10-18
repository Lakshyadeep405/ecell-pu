import React from "react";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { INITIAL_BLOGS, BlogPost } from "@/lib/blogs";
import BlogsClient from "./BlogsClient";

export const metadata: Metadata = {
  title: "Startup & Innovation Blogs | E-Cell JNCT PU",
  description:
    "Read startup insights, student venture stories, and entrepreneurial thoughts from the students and community of JNCT Professional University E-Cell.",
  keywords: [
    "E-Cell JNCT PU blogs",
    "student entrepreneurship stories",
    "startup articles JNCT",
    "innovation Bhopal",
    "entrepreneurship student essays",
  ],
};

export const revalidate = 0;

export default async function PublicBlogsPage() {
  let blogs: BlogPost[] = INITIAL_BLOGS;

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      blogs = data;
    }
  } catch (err) {
    console.warn("Could not fetch blogs from Supabase, using initial blogs fallback:", err);
  }

  return <BlogsClient initialBlogs={blogs} />;
}
