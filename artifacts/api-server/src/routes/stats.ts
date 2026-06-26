import { Router, type IRouter } from "express";
import { db, projectsTable, appointmentsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [projectCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(projectsTable);

  const totalProjects = (projectCount?.count ?? 0) + 47;

  res.json({
    totalProjects,
    totalHours: 1000 + totalProjects * 20,
    responseTime: "< 24h",
    satisfactionRate: 100,
  });
});

export default router;
