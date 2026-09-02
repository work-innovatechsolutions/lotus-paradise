import { BLOG_POSTS, type BlogArticle } from "@/lib/data";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { IdbStorage } from "@/lib/idb-storage";

const BLOGS_STORAGE_KEY = "lp_blogs_v1";

const DEFAULT_BLOGS: BlogArticle[] = [...BLOG_POSTS];

function getCachedBlogs(): BlogArticle[] {
  if (typeof window === "undefined") return DEFAULT_BLOGS;
  try {
    const raw = IdbStorage.safeLocalGet(BLOGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_BLOGS;
}

function updateCache(items: BlogArticle[]) {
  if (typeof window === "undefined") return;
  try {
    IdbStorage.safeLocalSet(BLOGS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("lp_blogs_updated"));
  } catch {}
}

export const BlogService = {
  async getAllBlogs(): Promise<BlogArticle[]> {
    const cached = getCachedBlogs();

    try {
      const colRef = collection(db, "blogs");
      const fetchPromise = getDocs(colRef);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 2500)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;
      if (snapshot && !snapshot.empty) {
        const firestoreData = snapshot.docs.map((docSnap: any) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as BlogArticle[];

        updateCache(firestoreData);
        return firestoreData;
      }
    } catch (err) {
      console.warn("Firestore blogs fetch error:", err);
    }

    return cached;
  },

  async getBlogBySlug(slug: string): Promise<BlogArticle | null> {
    const blogs = await this.getAllBlogs();
    return blogs.find((b) => b.slug === slug) || null;
  },

  async createBlog(data: Omit<BlogArticle, "id">): Promise<BlogArticle> {
    const newId = `blog-${Date.now()}`;
    const newBlog: BlogArticle = {
      ...data,
      id: newId,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      publishedAt: data.publishedAt || new Date().toISOString().slice(0, 10),
    };

    const cached = getCachedBlogs();
    const updated = [newBlog, ...cached];
    updateCache(updated);

    (async () => {
      try {
        await setDoc(doc(db, "blogs", newId), newBlog);
      } catch (err) {
        console.warn("Firestore createBlog sync:", err);
      }
    })();

    return newBlog;
  },

  async updateBlog(id: string, data: Partial<BlogArticle>): Promise<BlogArticle> {
    const cached = getCachedBlogs();
    const target = cached.find((b) => b.id === id);
    if (!target) throw new Error("Blog not found");

    const updated: BlogArticle = {
      ...target,
      ...data,
      slug: data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : target.slug,
    };

    const nextList = cached.map((b) => (b.id === id ? updated : b));
    updateCache(nextList);

    (async () => {
      try {
        await setDoc(doc(db, "blogs", id), updated, { merge: true });
      } catch (err) {
        console.warn("Firestore updateBlog sync:", err);
      }
    })();

    return updated;
  },

  async deleteBlog(id: string): Promise<void> {
    const cached = getCachedBlogs();
    const nextList = cached.filter((b) => b.id !== id);
    updateCache(nextList);

    (async () => {
      try {
        await deleteDoc(doc(db, "blogs", id));
      } catch (err) {
        console.warn("Firestore deleteBlog sync:", err);
      }
    })();
  },
};
