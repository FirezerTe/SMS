import { Gender } from "../../api-client/api-client";

export const GenderLookup: { [key in Gender]: string } = {
  [Gender.Male]: "Male",
  [Gender.Female]: "Female",
};
