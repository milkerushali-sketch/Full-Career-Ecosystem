import { Router } from "express";
import authRouter from "./auth";
import studentsRouter from "./students";
import resumeRouter from "./resume";
import companiesRouter from "./companies";
import jobsRouter from "./jobs";
import interviewsRouter from "./interviews";
import notificationsRouter from "./notifications";
import analyticsRouter from "./analytics";
import adminRouter from "./admin";
import healthRouter from "./health";

const router = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(studentsRouter);
router.use(resumeRouter);
router.use(companiesRouter);
router.use(jobsRouter);
router.use(interviewsRouter);
router.use(notificationsRouter);
router.use(analyticsRouter);
router.use(adminRouter);

export default router;
