import express, { NextFunction, Request, Response } from "express";
import { createPDF } from "./core/pdf";
import { getReportHandler } from "./reports/utils";
import { Report } from "./reports/types";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.post("/:id", async (req: Request, res: Response, next: NextFunction) => {
  console.log("report: ", req.url);
  try {
    const handler = getReportHandler(req.params.id as Report);
    if (!handler) {
      res.status(400);
      res.send({ message: "Not found" });
    }
    const result = await createPDF(handler(req));

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=export.pdf`);

    result.pipe(res);
  } catch (error) {
    next(error);
  }
});

app.use(
  (error: Error, _req: Request, res: Response, next: NextFunction): void => {
    console.log(error);
    res.status(500);
    res.json({ message: error.message, stack: error.stack });
    next(error);
  }
);

export default app;
