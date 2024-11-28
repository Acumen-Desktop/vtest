import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  console.log(
    "Line 4 - [...catchall]/+page.ts - Caught undefined route:",
    params.catchall
  );
  throw error(404, {
    message: "Page not found",
  });
};
