import { useRouter } from 'next/router';
import styles from "../../styles/Post.module.css";
import React from 'react'
import { Post } from "@/types";

type Props = {
  post: Post;
};

export async function getStaticPaths() {
  const res = await fetch("http://localhost:3001/api/v1/posts");
  const posts: Post[] = await res.json();

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({params}:{params:{id: string}}) {
  const res = await fetch(`http://localhost:3001/api/v1/posts/${params.id}`);
  const post = await res.json();

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
}

const blogPost = ({ post }: Props) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return(
    <div className={styles.container}>
      <div className={styles.title}>{post.title}</div>
      <div className={styles.date}>{post.created_at}</div>
      <div className={styles.content}>{post.content}</div>
    </div>
  );
}

export default blogPost;