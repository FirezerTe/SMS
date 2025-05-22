import { reportConfigurations } from "./reportConfigurations";
import { Report } from "./types";

export const getReportHandler = (rpt: Report) =>
  reportConfigurations[rpt]?.handler;
