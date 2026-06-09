import { getArticles } from "@/lib/data/journal";
import HomePage from "./home-client";

export default async function Page() {
  const articles = await getArticles().catch(() => []);
  return <HomePage articles={articles} />;
}
