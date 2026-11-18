import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to generate a unique Booking ID like APT-2026-1042
async function generateUniqueBookingId(): Promise<string> {
  const year = new Date().getFullYear();
  let bookingId = "";
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    bookingId = `APT-${year}-${randomNum}`;

    const existing = await prisma.appointment.findUnique({
      where: { bookingId },
    });

    if (!existing) {
      isUnique = true;
    }
  }

  return bookingId;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    // If client asks for booked slots for a specific date
    if (dateParam) {
      const existingAppointments = await prisma.appointment.findMany({
        where: {
          appointmentDate: dateParam,
          status: { not: "CANCELLED" },
        },
        select: {
          timeSlot: true,
          shift: true,
        },
      });

      const bookedSlots = existingAppointments.map((a) => a.timeSlot);
      return NextResponse.json({ date: dateParam, bookedSlots }, { status: 200 });
    }

    // Default: fetch all appointments (for admin)
    const appointments = await prisma.appointment.findMany({
      orderBy: [
        { appointmentDate: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      patientEmail,
      serviceId,
      serviceName,
      fee,
      appointmentDate,
      shift,
      timeSlot,
      notes,
    } = body;

    // Validate required fields
    if (!patientName || !patientPhone || !serviceId || !appointmentDate || !timeSlot) {
      return NextResponse.json(
        { error: "Missing required booking details. Name, Phone, Service, Date, and Time Slot are mandatory." },
        { status: 400 }
      );
    }

    // Double-booking prevention check:
    // Check if an active appointment already exists for the same date and time slot
    const existingBooking = await prisma.appointment.findFirst({
      where: {
        appointmentDate,
        timeSlot,
        status: { not: "CANCELLED" },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          error: `The ${timeSlot} slot on ${appointmentDate} is already booked by another patient. Please select an alternate slot.`,
          isSlotTaken: true,
        },
        { status: 409 }
      );
    }

    // Generate unique formatted booking ID e.g. APT-2026-1042
    const bookingId = await generateUniqueBookingId();

    const appointment = await prisma.appointment.create({
      data: {
        bookingId,
        patientName: patientName.trim(),
        patientAge: patientAge ? String(patientAge).trim() : null,
        patientGender: patientGender ? String(patientGender).trim() : null,
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail ? patientEmail.trim() : null,
        serviceId,
        serviceName,
        fee: fee || "Fee on visit",
        appointmentDate,
        shift: shift || "Morning Shift",
        timeSlot,
        status: "CONFIRMED",
        notes: notes ? notes.trim() : null,
      },
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create appointment:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Unable to complete appointment booking." },
      { status: 500 }
    );
  }
}
