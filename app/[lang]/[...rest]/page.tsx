import { notFound } from "next/navigation";

// Any unknown URL under /{lang}/ renders the localized 404 page with a real 404 status
export default function CatchAllPage() {
  notFound();
}
