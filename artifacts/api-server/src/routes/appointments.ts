import { Router, type IRouter } from "express";
import { db, appointmentsTable } from "@workspace/db";
import { CreateAppointmentBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/appointments", async (_req, res): Promise<void> => {
  const appointments = await db
    .select()
    .from(appointmentsTable)
    .orderBy(appointmentsTable.createdAt);
  res.json(appointments);
});

router.post("/appointments", async (req, res): Promise<void> => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [appointment] = await db
    .insert(appointmentsTable)
    .values({
      ...parsed.data,
      status: "pending",
    })
    .returning();

  res.status(201).json(appointment);
});

export default router;
