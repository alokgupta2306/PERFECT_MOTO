import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, AlertCircle, Loader2, Wrench } from "lucide-react";
import api from "../../utils/api";

const AdminServiceAppointments = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/service-appointments");
        setAppointments(res.data.appointments || []);
      } catch (err) {
        console.error("Service appointments fetch error:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/service-appointments/${id}/status`, { status: newStatus });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error("Appointment status update error:", err);
      alert(err.response?.data?.message || "Failed to update appointment status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <Loader2 size={36} className="text-primary-gold animate-spin mb-3" />
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-gray">
          Loading Service Appointments...
        </p>
      </div>
    );
  }

  if (!loading && appointments.length === 0) {
    return (
      <div className="min-h-[50vh] border border-dashed border-border-dark rounded-xl p-12 text-center flex flex-col items-center justify-center max-w-5xl mx-auto my-8">
        <Wrench size={40} className="text-muted-gray mb-3" />
        <h3 className="font-heading font-bold uppercase text-pure-white text-sm tracking-wide">No Appointments Yet</h3>
        <p className="text-xs text-muted-gray mt-1 max-w-xs">No customers have booked a service appointment yet.</p>
      </div>
    );
  }

  const filteredAppointments = statusFilter === "all"
    ? appointments
    : appointments.filter((a) => a.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-border-dark pb-5">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-gold uppercase tracking-wide">
            Service <span className="text-pure-white">Appointments</span>
          </h1>
          <p className="text-xs text-muted-gray mt-1">Review booked motorcycle service appointments and update their status.</p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-deep-black p-1 rounded-lg border border-border-dark shrink-0 max-w-full">
          {[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" }
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setStatusFilter(t.value)}
              className={`h-8 px-3 rounded text-[10px] font-heading uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                statusFilter === t.value ? "bg-primary-gold text-deep-black" : "text-muted-gray hover:text-pure-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card-dark border border-border-dark rounded-xl overflow-hidden shadow-md">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-deep-black/40 text-muted-gray font-heading font-bold uppercase tracking-wider border-b border-border-dark text-[10px]">
                <th className="p-4 pl-5">Customer</th>
                <th className="p-4">Bike</th>
                <th className="p-4">Service Type</th>
                <th className="p-4">Date &amp; Slot</th>
                <th className="p-4">Mode</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/40 font-medium">
              {filteredAppointments.map((appt) => {
                const customerName = appt.user?.name || "Unknown";
                const customerPhone = appt.user?.phone || "-";
                const localizedDate = new Date(appt.preferredDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                });

                return (
                  <tr key={appt._id} className="hover:bg-deep-black/20 transition-colors">
                    <td className="p-4 pl-5 text-pure-white font-semibold">
                      {customerName}
                      <div className="text-[10px] text-muted-gray font-mono font-normal mt-0.5">{customerPhone}</div>
                    </td>
                    <td className="p-4 text-muted-gray">
                      {appt.bikeBrand} {appt.bikeModel} <span className="font-mono">({appt.bikeYear})</span>
                    </td>
                    <td className="p-4 text-pure-white">{appt.serviceType}</td>
                    <td className="p-4 text-muted-gray font-mono">
                      {localizedDate}
                      <div className="text-[10px] mt-0.5">{appt.timeSlot}</div>
                    </td>
                    <td className="p-4 text-muted-gray capitalize">{appt.deliveryMode}</td>
                    <td className="p-4">
                      <select
                        value={appt.status}
                        onChange={(e) => handleUpdateStatus(appt._id, e.target.value)}
                        className={`h-8 px-2.5 bg-deep-black text-[10px] font-heading font-bold uppercase tracking-wider rounded-md border focus:outline-none focus:border-primary-gold cursor-pointer transition-colors ${
                          appt.status === "pending" ? "text-warning-amber border-warning-amber/30" :
                          appt.status === "confirmed" ? "text-info-blue border-info-blue/30" :
                          appt.status === "completed" ? "text-success-green border-success-green/30" :
                          "text-error-red border-error-red/30"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 pr-5 text-right space-x-1 shrink-0">
                      <button
                        onClick={() => navigate(`/admin/service-appointments/${appt._id}`)}
                        className="h-8 px-3 bg-deep-black border border-border-dark text-muted-gray hover:text-primary-gold hover:border-primary-gold rounded-lg inline-flex items-center gap-1 transition-colors text-[10px] font-heading font-bold uppercase tracking-wider shadow-sm"
                        title="View full appointment"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminServiceAppointments;