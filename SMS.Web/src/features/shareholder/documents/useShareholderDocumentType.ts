import { useMemo } from "react";
import { DocumentType } from "../../../app/api/enums";
import { SelectOption } from "../../../types";

export const useShareholderDocumentType = () => {
  const { shareholderDocumentTypes, shareholderDocumentTypeLookups } =
    useMemo(() => {
      const shareholderDocumentTypes = [
        {
          value: DocumentType.ArticlesOfOrganizationOrCertificate,
          displayName: "Articles Of Organization (Certificate)",
        },
        {
          value: DocumentType.OperationalAgreement,
          displayName: "Operational Agreement",
        },
        { value: DocumentType.ShareholderPicture, displayName: "Photo" },
        {
          value: DocumentType.PhotoIdentification,
          displayName: "Photo Identification",
        },
        { value: DocumentType.DrivingLicense, displayName: "Driving License" },
        { value: DocumentType.Passport, displayName: "Passport" },
        { value: DocumentType.ShareholderSignature, displayName: "Signature" },
        {
          value: DocumentType.BirthCertificate,
          displayName: "Birth Certificate",
        },
        {
          value: DocumentType.MarriageCertificate,
          displayName: "Marriage Certificate",
        },
        { value: DocumentType.Other, displayName: "Other" },
      ];

      const shareholderDocumentTypeLookups =
        shareholderDocumentTypes.map<SelectOption>((d) => ({
          label: d.displayName,
          value: d.value,
        }));

      return { shareholderDocumentTypes, shareholderDocumentTypeLookups };
    }, []);

  return { shareholderDocumentTypes, shareholderDocumentTypeLookups };
};
