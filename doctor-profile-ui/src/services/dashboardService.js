import { supabase } from "../supabase/client";

/**
 * Get total number of doctors.
 */
export async function getTotalDoctors() {
  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "doctor");

  if (error) {
    throw error;
  }

  return count || 0;
}

/**
 * Get total number of patients.
 */
export async function getTotalPatients() {
  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "patient");

  if (error) {
    throw error;
  }

  return count || 0;
}

/**
 * Get appointment statistics.
 */
export async function getAppointmentStatistics() {
  const { data, error } = await supabase
    .from("appointments")
    .select("status");

  if (error) {
    throw error;
  }

  const appointments = data || [];

  return {
    total: appointments.length,

    pending: appointments.filter(
      (appointment) => appointment.status === "Pending"
    ).length,

    accepted: appointments.filter(
      (appointment) => appointment.status === "Accepted"
    ).length,

    completed: appointments.filter(
      (appointment) => appointment.status === "Completed"
    ).length,

    cancelled: appointments.filter(
      (appointment) => appointment.status === "Cancelled"
    ).length,

    rejected: appointments.filter(
      (appointment) => appointment.status === "Rejected"
    ).length,
  };
}

/**
 * Get all dashboard statistics.
 */
export async function getDashboardStatistics() {
  const [
    totalDoctors,
    totalPatients,
    appointmentStatistics,
  ] = await Promise.all([
    getTotalDoctors(),
    getTotalPatients(),
    getAppointmentStatistics(),
  ]);

  return {
    totalDoctors,
    totalPatients,
    totalAppointments: appointmentStatistics.total,

    pendingAppointments: appointmentStatistics.pending,
    acceptedAppointments: appointmentStatistics.accepted,
    completedAppointments: appointmentStatistics.completed,
    cancelledAppointments: appointmentStatistics.cancelled,
    rejectedAppointments: appointmentStatistics.rejected,

    // Revenue is not available yet because the current
    // database does not have a valid payment/revenue source.
    totalRevenue: 0,
  };
}