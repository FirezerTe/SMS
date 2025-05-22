import { Box } from "@mui/material";
import { useMemo } from "react";
import {
  ShareholderDetailsDto,
  ShareholderDocumentDto,
} from "../../../app/api";
import { DocumentType, ShareholderType } from "../../../app/api/enums";
import { DocumentsList } from "./DocumentsList";

export const Documents = ({
  documents,
  shareholder,
}: {
  documents: ShareholderDocumentDto[];
  shareholder?: ShareholderDetailsDto;
}) => {
  const docs = useMemo(() => {
    const pictures = documents.filter(
      (d) => d.documentType === DocumentType.ShareholderPicture
    );
    const photoIds = documents.filter(
      (d) => d.documentType === DocumentType.PhotoIdentification
    );
    const drivingLicenses = documents.filter(
      (d) => d.documentType === DocumentType.DrivingLicense
    );
    const passports = documents.filter(
      (d) => d.documentType === DocumentType.Passport
    );
    const signatures = documents.filter(
      (d) => d.documentType === DocumentType.ShareholderSignature
    );
    const certificates = documents.filter(
      (d) => d.documentType === DocumentType.ArticlesOfOrganizationOrCertificate
    );
    const operationalAgreements = documents.filter(
      (d) => d.documentType === DocumentType.OperationalAgreement
    );
    const birthCertificates = documents.filter(
      (d) => d.documentType === DocumentType.BirthCertificate
    );
    const marriageCertificates = documents.filter(
      (d) => d.documentType === DocumentType.MarriageCertificate
    );

    const others = documents.filter(
      (d) => d.documentType === DocumentType.Other
    );

    return {
      pictures,
      signatures,
      certificates,
      operationalAgreements,
      photoIds,
      drivingLicenses,
      passports,
      others,
      birthCertificates,
      marriageCertificates,
    };
  }, [documents]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {shareholder?.shareholderType !== ShareholderType.Individual && (
        <>
          {!!docs.certificates.length && (
            <Box>
              <DocumentsList
                documents={docs.certificates}
                title="Articles Of Organization (Certificate)"
              />
            </Box>
          )}
          {!!docs.operationalAgreements.length && (
            <Box>
              <DocumentsList
                documents={docs.operationalAgreements}
                title="Operational Agreement"
              />
            </Box>
          )}
        </>
      )}
      {!!docs.pictures.length && (
        <Box>
          <DocumentsList documents={docs.pictures} title="Photo" />
        </Box>
      )}

      {!!docs.photoIds.length && (
        <Box>
          <DocumentsList documents={docs.photoIds} title="Identification" />
        </Box>
      )}
      {!!docs.drivingLicenses.length && (
        <Box>
          <DocumentsList
            documents={docs.drivingLicenses}
            title="Driving License"
          />
        </Box>
      )}
      {!!docs.birthCertificates.length && (
        <Box>
          <DocumentsList
            documents={docs.birthCertificates}
            title="Birth Certificate"
          />
        </Box>
      )}
      {!!docs.marriageCertificates.length && (
        <Box>
          <DocumentsList
            documents={docs.marriageCertificates}
            title="Marriage Certificate"
          />
        </Box>
      )}

      {!!docs.passports.length && (
        <Box>
          <DocumentsList documents={docs.passports} title="Passport" />
        </Box>
      )}
      {!!docs.signatures.length && (
        <Box>
          <DocumentsList documents={docs.signatures} title="Signature" />
        </Box>
      )}

      {!!docs.others.length && (
        <Box>
          <DocumentsList documents={docs.others} title="Others" />
        </Box>
      )}
    </Box>
  );
};
