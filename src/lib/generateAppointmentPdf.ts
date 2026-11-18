import jsPDF from "jspdf";
import { clinicConfig } from "@/config/clinicConfig";

export interface AppointmentSlipData {
  bookingId: string;
  patientName: string;
  patientAge?: string | null;
  patientGender?: string | null;
  patientPhone: string;
  patientEmail?: string | null;
  serviceName: string;
  fee: string;
  appointmentDate: string;
  shift: string;
  timeSlot: string;
  status: string;
  notes?: string | null;
  createdAt?: string;
}

export function generateAppointmentPdf(appointment: AppointmentSlipData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryTeal = [13, 148, 136]; // #0d9488
  const darkTeal = [15, 118, 110]; // #0f766e
  const textDark = [30, 41, 59]; // slate-800
  const textMuted = [100, 116, 139]; // slate-500
  const bgLight = [240, 253, 250]; // teal-50
  const borderLight = [204, 251, 241]; // teal-100

  // Top Accent Banner
  doc.setFillColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.rect(0, 0, 210, 8, "F");

  // Clinic Header
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(clinicConfig.clinicName, 15, 22);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.text("DENTAL SURGERY & CLINICAL AESTHETIC DERMATOLOGY", 15, 27);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    `${clinicConfig.location.fullAddress} | Tel: ${clinicConfig.contact.phone}`,
    15,
    32
  );

  // Top right badge: 100% Sterile
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(135, 14, 60, 16, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text("VERIFIED CLINICAL CENTER", 140, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(clinicConfig.stats.sterilizationStandard, 140, 26);

  // Divider Line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(15, 36, 195, 36);

  // Official Slip Title Banner
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(15, 41, 180, 18, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("APPOINTMENT CONFIRMATION SLIP", 20, 50);

  // Booking ID & Status right-aligned
  doc.setFontSize(11);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text(`BOOKING REF: ${appointment.bookingId}`, 130, 48);

  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52); // green-800
  doc.text(`STATUS: ${appointment.status.toUpperCase()}`, 130, 54);

  // SECTION 1: Patient Information Box
  let currentY = 66;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(15, currentY, 180, 36, 2, 2, "F");
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(15, currentY, 180, 36, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text("PATIENT INFORMATION", 20, currentY + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("Patient Full Name:", 20, currentY + 15);
  doc.text("Age / Gender:", 20, currentY + 22);
  doc.text("Mobile Contact:", 20, currentY + 29);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont("helvetica", "bold");
  doc.text(appointment.patientName, 60, currentY + 15);

  doc.setFont("helvetica", "normal");
  const ageGenderStr = `${appointment.patientAge ? appointment.patientAge + " Years" : "Not specified"}  |  ${appointment.patientGender || "Not specified"}`;
  doc.text(ageGenderStr, 60, currentY + 22);
  doc.text(appointment.patientPhone, 60, currentY + 29);

  if (appointment.patientEmail) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text("Email Address:", 115, currentY + 22);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(appointment.patientEmail, 142, currentY + 22);
  }

  // SECTION 2: Appointment & Treatment Box
  currentY = 108;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, currentY, 180, 44, 2, 2, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, currentY, 180, 44, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text("APPOINTMENT SCHEDULE & TREATMENT", 20, currentY + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("Treatment / Service:", 20, currentY + 16);
  doc.text("Appointment Date:", 20, currentY + 24);
  doc.text("Shift & Time Slot:", 20, currentY + 32);
  doc.text("Estimated Fee:", 20, currentY + 39);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont("helvetica", "bold");
  doc.text(appointment.serviceName, 60, currentY + 16);

  doc.setFont("helvetica", "normal");
  doc.text(appointment.appointmentDate, 60, currentY + 24);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text(`${appointment.shift}  (${appointment.timeSlot})`, 60, currentY + 32);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`${appointment.fee}  (Payable at clinic via UPI/Cash/Card)`, 60, currentY + 39);

  // SECTION 3: Consulting Doctor & Location Box
  currentY = 158;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, currentY, 180, 40, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text("CONSULTING SPECIALIST & CLINIC ADDRESS", 20, currentY + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(clinicConfig.doctor.name, 20, currentY + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(clinicConfig.doctor.qualifications, 20, currentY + 22);
  doc.text(
    `Registration: ${clinicConfig.doctor.registrationNumber}  |  ${clinicConfig.doctor.designation}`,
    20,
    currentY + 27
  );

  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text(`Clinic Location: ${clinicConfig.location.fullAddress}`, 20, currentY + 34);

  // SECTION 4: Patient Guidelines & Instructions
  currentY = 204;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, currentY, 180, 38, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("PATIENT INSTRUCTIONS & IMPORTANT GUIDELINES:", 20, currentY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    "1. Arrival: Please arrive 10-15 minutes prior to your time slot for registration & vitals check.",
    20,
    currentY + 14
  );
  doc.text(
    "2. Medical Records: Bring previous dental X-rays, medical prescriptions, or allergy history if any.",
    20,
    currentY + 20
  );
  doc.text(
    "3. Rescheduling: Please notify at least 2 hours in advance via WhatsApp or Phone if rescheduling is needed.",
    20,
    currentY + 26
  );
  doc.text(
    "4. Facilities: Wheelchair accessible ground floor entrance. Dedicated parking & metro exit adjacent.",
    20,
    currentY + 32
  );

  // FOOTER & SIGNATURE
  currentY = 248;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, currentY, 195, currentY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    "This is an electronically generated appointment slip issued by Amulya Dental Clinic portal. No physical signature required.",
    15,
    currentY + 6
  );

  // Doctor Signature area
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text("For AMULYA DENTAL CLINIC", 145, currentY + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("Authorized Medical Registrar", 145, currentY + 17);

  // Save / Trigger Download
  const fileName = `Appointment_Slip_${appointment.bookingId}.pdf`;
  doc.save(fileName);
}
