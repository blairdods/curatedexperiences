import { getArticles } from "@/lib/data/journal";
import HomePage from "./home-client";

export default function Page() {
  const articles = getArticles();
  return <HomePage articles={articles} />;
}
