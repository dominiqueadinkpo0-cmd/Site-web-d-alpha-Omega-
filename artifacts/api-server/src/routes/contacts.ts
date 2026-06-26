import { Router, type IRouter } from "express";
import { db, contactsTable } from "@workspace/db";
import { CreateContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contacts", async (req, res): Promise<void> => {
  const parsed = CreateContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [contact] = await db
    .insert(contactsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(contact);
});

export default router;
