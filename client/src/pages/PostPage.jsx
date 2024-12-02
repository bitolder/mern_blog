import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";

export default function PostPage() {
  const [post, setPost] = useState({});
  const [errorPost, setErrorPost] = useState(null);
  const [loading, setLoading] = useState();
  const { postSlug } = useParams();

  // {
  //   "posts": [
  //     { "title": "Post 1",content, etcccc },
  //     { "title": "Post 2",content, etcccc }
  //   ],
  //   "totalPosts": 100,
  //   "lastMonthPosts": 10
  // }
  useEffect(() => {
    const fetchPostSlug = async () => {
      try {
        setLoading(true);
        setErrorPost(null);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        if (res.ok) {
          const data = await res.json();

          setPost(data.posts[0]);
          setLoading(false);
        } else {
          setErrorPost(data.message);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchPostSlug();
  }, [postSlug]);
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <main className="flex flex-col min-h-screen p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>
      <Link className="self-center mt-5" to={post.category}>
        <Button pill color="gray" size="xs">
          {post.category}
        </Button>
      </Link>
      <img
        className="w-full max-h-[600px] object-cover mt-10"
        src={post.postImage}
        alt={post.slug}
      />
      <div className="flex justify-between p-3 border-b border-slate-500 w-full mx-auto max-w-2xl text-xs">
        <span className="hover:underline">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="italic">
          {post.content ? (post.content.length / 1000).toFixed(0) : "0"}mins
          read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <CallToAction />
      <CommentSection postId={post._id} />
    </main>
  );
}
