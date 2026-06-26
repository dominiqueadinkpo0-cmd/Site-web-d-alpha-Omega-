import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db, projectsTable } from "@workspace/db";
import {
  CreateProjectBody,
  GetProjectParams,
  GetProjectEstimationParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateProjectNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `AOD-${year}-${random}`;
}

function generateTrackingToken(): string {
  return randomBytes(16).toString("hex");
}

function computeEstimation(project: typeof projectsTable.$inferSelect) {
  let answers: Record<string, unknown> = {};
  try {
    if (project.answers) {
      answers = JSON.parse(project.answers);
    }
  } catch {
    // ignore
  }

  const budgetStr = (project.budget || "").toLowerCase();
  const descStr = (project.description || "").toLowerCase();
  const typeStr = (project.projectType || "").toLowerCase();
  const combinedText = budgetStr + descStr + typeStr + JSON.stringify(answers).toLowerCase();

  let complexity: "simple" | "moderate" | "complex" | "enterprise" = "moderate";
  if (
    combinedText.includes("saas") ||
    combinedText.includes("plateforme") ||
    combinedText.includes("erp") ||
    combinedText.includes("crm") ||
    combinedText.includes("automatisation")
  ) {
    complexity = "complex";
  } else if (
    combinedText.includes("enterprise") ||
    combinedText.includes("international") ||
    combinedText.includes("multi-tenant")
  ) {
    complexity = "enterprise";
  } else if (
    combinedText.includes("vitrine") ||
    combinedText.includes("landing") ||
    combinedText.includes("simple")
  ) {
    complexity = "simple";
  }

  const ranges = {
    simple: { low: 500, medium: 1500, premium: 3000, weeks: 3, hosting: 15, maintenance: 50 },
    moderate: { low: 2000, medium: 5000, premium: 10000, weeks: 8, hosting: 30, maintenance: 150 },
    complex: { low: 8000, medium: 20000, premium: 40000, weeks: 16, hosting: 80, maintenance: 400 },
    enterprise: { low: 30000, medium: 60000, premium: 120000, weeks: 30, hosting: 200, maintenance: 1000 },
  };

  const r = ranges[complexity];

  const techMap: Record<string, string[]> = {
    simple: ["Next.js", "Tailwind CSS", "Vercel"],
    moderate: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Stripe"],
    complex: ["Next.js", "TypeScript", "PostgreSQL", "Node.js", "Docker", "AWS", "Stripe"],
    enterprise: ["Next.js", "TypeScript", "PostgreSQL", "Node.js", "Docker", "AWS", "Redis", "Kubernetes", "Stripe"],
  };

  const featuresMap: Record<string, string[]> = {
    simple: ["Site responsive", "SEO de base", "Formulaire de contact", "Hébergement optimisé"],
    moderate: ["Design sur mesure", "CMS intégré", "SEO avancé", "Paiement en ligne", "Tableau de bord admin"],
    complex: ["Architecture scalable", "Authentification avancée", "API REST", "Automatisations", "Analytics", "Multi-rôles"],
    enterprise: ["Architecture micro-services", "Multi-tenant", "SSO/SAML", "Audit trail", "SLA 99.9%", "Support dédié"],
  };

  const recommendationsMap: Record<string, string> = {
    simple: "Alpha Oméga Digital recommande une approche agile avec livraisons itératives. Votre projet peut démarrer rapidement avec un MVP fonctionnel.",
    moderate: "Alpha Oméga Digital recommande une architecture modulaire permettant l'évolution de votre plateforme. Un accompagnement mensuel est conseillé pour maintenir la performance.",
    complex: "Alpha Oméga Digital recommande une phase de découverte approfondie de 2 semaines avant le développement. Une architecture cloud-native garantira la scalabilité de votre solution.",
    enterprise: "Alpha Oméga Digital recommande un audit technique complet et la mise en place d'une équipe projet dédiée. Un contrat de maintenance enterprise avec SLA est fortement conseillé.",
  };

  return {
    low: r.low,
    medium: r.medium,
    premium: r.premium,
    complexity,
    estimatedWeeks: r.weeks,
    monthlyMaintenance: r.maintenance,
    hostingMonthly: r.hosting,
    recommendedTechnologies: techMap[complexity],
    priorityFeatures: featuresMap[complexity],
    recommendations: recommendationsMap[complexity],
  };
}

router.get("/projects", async (_req, res): Promise<void> => {
  const projects = await db
    .select()
    .from(projectsTable)
    .orderBy(projectsTable.createdAt);
  res.json(projects);
});

router.post("/projects", async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const projectNumber = generateProjectNumber();
  const trackingToken = generateTrackingToken();

  const [project] = await db
    .insert(projectsTable)
    .values({
      ...parsed.data,
      projectNumber,
      trackingToken,
      status: "new",
    })
    .returning();

  res.status(201).json(project);
});

// Track by token — must come before /:id route to avoid "track" being parsed as an id
router.get("/projects/track/:token", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.token) ? req.params.token[0] : req.params.token;

  if (!raw || raw.length < 8) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.trackingToken, raw));

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const estimation = computeEstimation(project);
  res.json({ project, estimation });
});

router.patch("/projects/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const allowed = ["new", "contacted", "in_progress", "closed"] as const;
  const status = req.body?.status;
  if (!allowed.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const [updated] = await db
    .update(projectsTable)
    .set({ status })
    .where(eq(projectsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(updated);
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProjectParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, params.data.id));

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(project);
});

router.get("/projects/:id/estimation", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProjectEstimationParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, params.data.id));

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const estimation = computeEstimation(project);
  res.json(estimation);
});

export default router;
