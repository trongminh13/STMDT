import { ExecArgs } from "@medusajs/framework/types";
import seedAICatalog from "./seed-ai-catalog";

/**
 * Legacy seed entry point — redirected to the official AI Catalog Seeder
 * to ensure database consistency and prevent accidental re-introduction of demo fashion data.
 */
export default async function seed(args: ExecArgs) {
  return seedAICatalog(args);
}
