import { ContactType } from "../../api-client/api-client";

export const ContactTypeLookup: { [key in ContactType]: string } = {
  [ContactType.Email]: "Email",
  [ContactType.CellPhone]: "Mobile#",
  [ContactType.HomePhone]: "Home Phone#",
  [ContactType.WorkPhone]: "Work Phone#",
  [ContactType.Fax]: "Fax",
};
