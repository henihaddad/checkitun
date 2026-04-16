import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type FicheData = {
  fullName: string;
  nationality: string;
  dateOfBirth: string | Date;
  passportNumber: string;
  passportExpiry: string | Date;
  phone: string;
  email: string | null;
  arrivalDate: string | Date;
  departureDate: string | Date;
  roomNumber: string | null;
  propertyName: string;
  propertyCity: string | null;
  submittedAt: Date;
  passportPhotoUrl?: string | null;
};

function fmtDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = date.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function fmtDateTime(d: Date): string {
  return `${fmtDate(d)} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
}

export async function buildFichePdf(data: FicheData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const ink = rgb(0.11, 0.1, 0.09);
  const muted = rgb(0.42, 0.4, 0.38);
  const line = rgb(0.78, 0.77, 0.75);
  const olive = rgb(0.12, 0.23, 0.18);

  const margin = 50;
  let y = height - margin;

  // Header — establishment name on top-left
  page.drawText(data.propertyName, {
    x: margin,
    y,
    size: 11,
    font: bold,
    color: olive,
  });
  if (data.propertyCity) {
    page.drawText(data.propertyCity, {
      x: margin,
      y: y - 13,
      size: 9,
      font,
      color: muted,
    });
  }
  page.drawText("CheckiTun", {
    x: width - margin - font.widthOfTextAtSize("CheckiTun", 10),
    y,
    size: 10,
    font: bold,
    color: olive,
  });

  y -= 46;

  // Title
  const title = "FICHE INDIVIDUELLE DE POLICE";
  page.drawText(title, {
    x: (width - bold.widthOfTextAtSize(title, 17)) / 2,
    y,
    size: 17,
    font: bold,
    color: ink,
  });
  y -= 18;
  const subtitle = "Individual Police Registration Form";
  page.drawText(subtitle, {
    x: (width - italic.widthOfTextAtSize(subtitle, 11)) / 2,
    y,
    size: 11,
    font: italic,
    color: muted,
  });
  y -= 26;

  // Legal preamble
  const preamble =
    "Ecrire en majuscules / in block letters. À remplir par tout client de l'établissement.";
  page.drawText(preamble, {
    x: (width - italic.widthOfTextAtSize(preamble, 9)) / 2,
    y,
    size: 9,
    font: italic,
    color: muted,
  });
  y -= 22;

  // Divider
  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 0.5,
    color: line,
  });
  y -= 26;

  // Field rows
  const rows: Array<[string, string]> = [
    ["Nom et prénoms / Full name", data.fullName],
    ["Nationalité / Nationality", data.nationality],
    ["Date de naissance / Date of birth", fmtDate(data.dateOfBirth)],
    ["Passeport n° / Passport number", data.passportNumber],
    ["Date d'expiration / Passport expiry", fmtDate(data.passportExpiry)],
    ["Téléphone mobile / Mobile phone", data.phone],
    ["Adresse électronique / Email", data.email ?? "—"],
    ["Date d'arrivée / Arrival date", fmtDate(data.arrivalDate)],
    ["Date de départ prévue / Expected departure", fmtDate(data.departureDate)],
    ["Chambre / Room", data.roomNumber ?? "—"],
    ["Établissement / Accommodation", `${data.propertyName}${data.propertyCity ? " — " + data.propertyCity : ""}`],
  ];

  for (const [label, value] of rows) {
    page.drawText(label, { x: margin, y, size: 8.5, font, color: muted });
    page.drawText(value || "—", { x: margin, y: y - 13, size: 12, font: bold, color: ink });
    y -= 32;
    page.drawLine({
      start: { x: margin, y: y + 4 },
      end: { x: width - margin, y: y + 4 },
      thickness: 0.3,
      color: line,
    });
    y -= 6;
  }

  y -= 14;

  // Signature block
  const sigBoxY = y - 54;
  page.drawRectangle({
    x: margin,
    y: sigBoxY,
    width: width - margin * 2,
    height: 54,
    borderColor: line,
    borderWidth: 0.5,
  });
  page.drawText("Signature électronique / Electronic signature", {
    x: margin + 10,
    y: sigBoxY + 40,
    size: 8.5,
    font,
    color: muted,
  });
  page.drawText(
    `Formulaire soumis électroniquement via CheckiTun le ${fmtDateTime(data.submittedAt)}.`,
    {
      x: margin + 10,
      y: sigBoxY + 22,
      size: 9,
      font: italic,
      color: ink,
    },
  );
  page.drawText(
    "Submitted electronically — valid equivalent to a handwritten signature under Tunisian law 2000-83.",
    {
      x: margin + 10,
      y: sigBoxY + 9,
      size: 8,
      font: italic,
      color: muted,
    },
  );

  y = sigBoxY - 22;

  // Footer legal text
  const footer1 =
    "Fiche conservée par l'établissement pendant 6 mois et transmise aux services de police uniquement sur réquisition.";
  const footer2 =
    "Retained by the establishment for 6 months; transmitted to police only upon official request.";
  page.drawText(footer1, { x: margin, y, size: 8, font: italic, color: muted });
  y -= 11;
  page.drawText(footer2, { x: margin, y, size: 8, font: italic, color: muted });

  return pdf.save();
}
