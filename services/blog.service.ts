import { BLOG_POSTS, type BlogArticle } from "@/lib/data";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { IdbStorage } from "@/lib/idb-storage";

const BLOGS_STORAGE_KEY = "lp_blogs_v1";

const DEFAULT_BLOGS: BlogArticle[] = [...BLOG_POSTS];

async function getStoredBlogs(): Promise<BlogArticle[]> {
  if (typeof window === "undefined") return DEFAULT_BLOGS;
  try {
    const idbData = await IdbStorage.get<BlogArticle[]>(BLOGS_STORAGE_KEY);
    if (Array.isArray(idbData) && idbData.length > 0) return idbData;
    const raw = IdbStorage.safeLocalGet(BLOGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_BLOGS;
}

async function updateCache(items: BlogArticle[]) {
  if (typeof window === "undefined") return;
  try {
    await IdbStorage.set(BLOGS_STORAGE_KEY, items);
    IdbStorage.safeLocalSet(BLOGS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("lp_blogs_updated"));
  } catch {}
}

export const BlogService = {
  async getAllBlogs(): Promise<BlogArticle[]> {
    const localData = await getStoredBlogs();

    try {
      const colRef = collection(db, "blogs");
      const fetchPromise = getDocs(colRef);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore timeout")), 4000)
      );

      const snapshot = (await Promise.race([fetchPromise, timeoutPromise])) as any;
      if (snapshot && !snapshot.empty) {
        const firestoreData: BlogArticle[] = snapshot.docs.map((docSnap: any) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        const firestoreIds = new Set(firestoreData.map((b) => b.id));
        const localOnly = localData.filter((b) => !firestoreIds.has(b.id));
        const merged = [...firestoreData, ...localOnly];

        await updateCache(merged);
        return merged;
      } else if (snapshot && snapshot.empty) {
        for (const blog of DEFAULT_BLOGS) {
          await setDoc(doc(db, "blogs", blog.id), blog);
        }
        await updateCache(DEFAULT_BLOGS);
        return DEFAULT_BLOGS;
      }
    } catch (err) {
      console.warn("Firestore blogs fetch fallback:", err);
    }

    return localData;
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

    const currentList = await getStoredBlogs();
    const updated = [newBlog, ...currentList];
    await updateCache(updated);

    try {
      await setDoc(doc(db, "blogs", newId), newBlog);
    } catch (err) {
      console.warn("Firestore createBlog sync:", err);
    }

    return newBlog;
  },

  async updateBlog(id: string, data: Partial<BlogArticle>): Promise<BlogArticle> {
    const currentList = await getStoredBlogs();
    const target = currentList.find((b) => b.id === id);
    if (!target) throw new Error("Blog not found");

    const updated: BlogArticle = {
      ...target,
      ...data,
      slug: data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : target.slug,
    };

    const nextList = currentList.map((b) => (b.id === id ? updated : b));
    await updateCache(nextList);

    try {
      await setDoc(doc(db, "blogs", id), updated, { merge: true });
    } catch (err) {
      console.warn("Firestore updateBlog sync:", err);
    }

    return updated;
  },

  async deleteBlog(id: string): Promise<void> {
    const currentList = await getStoredBlogs();
    const nextList = currentList.filter((b) => b.id !== id);
    await updateCache(nextList);

    try {
      await deleteDoc(doc(db, "blogs", id));
    } catch (err) {
      console.warn("Firestore deleteBlog sync:", err);
    }
  },
};
