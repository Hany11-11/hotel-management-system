import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Card } from "../../components/ui/Card";

import { useHotel } from "../../context/HotelContext";
import { Event, EventType, EventStatus } from "../../types/entities";

interface CreateEventFormProps {
  event?: Event;
  mode?: "create" | "edit" | "view" | "list";
  onClose?: () => void;
  onSuccess?: () => void;
  onDelete?: (id: string) => void;
  showCRUD?: boolean; // New prop to enable CRUD view
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({
  event,
  mode = "list",
  onClose,
  onSuccess,
  onDelete,
  showCRUD = true,
}) => {
  const { state, createEvent, updateEvent, deleteEvent, initializeData } =
    useHotel();

  // CRUD state management
  const [currentMode, setCurrentMode] = useState<
    "create" | "edit" | "view" | "list"
  >(mode);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(event);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS

  // Initialize data when component mounts - improved version
  React.useEffect(() => {
    if (
      !state ||
      !state.halls ||
      state.halls.length === 0 ||
      !state.eventPackages ||
      state.eventPackages.length === 0
    ) {
      initializeData();
    }
  }, []);

  const [formData, setFormData] = useState({
    name: event?.name || "",
    hallIds: event?.hallIds || [], // Support multiple halls
    status: event?.status || ("active" as EventStatus),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Show loading state if data is not ready yet
  if (!state || !state.halls || state.halls.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading halls...</p>
        </div>
      </div>
    );
  }

  // Early return for missing halls
  if (!state.halls || state.halls.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">No halls available</p>
        <p className="text-sm text-gray-400">
          Please add halls to the system before creating events.
        </p>
      </div>
    );
  }

  // Get available halls (only active ones)
  const availableHalls = state.halls.filter((hall) => hall && hall.name);

  if (availableHalls.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">No active halls available</p>
        <p className="text-sm text-gray-400">
          Please add halls to the system before creating events.
        </p>
      </div>
    );
  }

  // Handle hall toggle for multiple selection
  const handleHallToggle = (hallId: string) => {
    setFormData((prev) => ({
      ...prev,
      hallIds: prev.hallIds.includes(hallId)
        ? prev.hallIds.filter((id) => id !== hallId)
        : [...prev.hallIds, hallId],
    }));
  };

  // Handle select all/none halls
  const handleSelectAllHalls = () => {
    setFormData((prev) => ({
      ...prev,
      hallIds:
        prev.hallIds.length === availableHalls.length
          ? []
          : availableHalls.map((hall) => hall.id),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }

    if (formData.hallIds.length === 0) {
      newErrors.hallIds = "At least one hall must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const eventData: Omit<Event, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name.trim(),
      type: "conference" as EventType, // Default type
      organizerName: "Default Organizer", // Default organizer
      identificationType: "nic", // Default identification type
      identificationNumber: "temp-id", // Temporary ID
      startDateTime: new Date().toISOString(), // Default to current time
      endDateTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
      expectedAttendees: 50, // Default attendees
      hallIds: formData.hallIds, // Multiple halls array
      totalRevenue: 0, // Default revenue
      status: formData.status,
      paymentStatus: "pending", // Default payment status
      createdBy: "admin", // Default user
    };

    try {
      if (currentMode === "edit" && selectedEvent) {
        // Update existing event
        updateEvent({
          ...selectedEvent,
          ...eventData,
          updatedAt: new Date().toISOString(),
        });
        console.log("Event updated successfully:", eventData);
      } else {
        // Create new event
        createEvent(eventData);
        console.log("Event created successfully:", eventData);
      }
      if (onSuccess) onSuccess();
      handleFormSuccess();
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  // Handle delete operation
  const handleDelete = () => {
    if (selectedEvent && deleteEvent) {
      if (
        window.confirm(
          "Are you sure you want to delete this event? This action cannot be undone."
        )
      ) {
        deleteEvent(selectedEvent.id);
        if (onDelete) onDelete(selectedEvent.id);
        setIsModalOpen(false);
        setSelectedEvent(undefined);
        if (onSuccess) onSuccess();
      }
    }
  };

  // CRUD operation handlers
  const handleCreate = () => {
    setCurrentMode("create");
    setSelectedEvent(undefined);
    setFormData({
      name: "",
      hallIds: [],
      status: "active" as EventStatus,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setCurrentMode("edit");
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      hallIds: event.hallIds || [],
      status: event.status,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleView = (event: Event) => {
    setCurrentMode("view");
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      hallIds: event.hallIds || [],
      status: event.status,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(undefined);
    setCurrentMode("list");
    if (onClose) onClose();
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedEvent(undefined);
    setCurrentMode("list");
    if (onSuccess) onSuccess();
  };

  const selectedHallNames = formData.hallIds
    .map((hallId) => {
      const hall = availableHalls.find((h) => h.id === hallId);
      return hall ? hall.name : "";
    })
    .filter(Boolean)
    .join(", ");

  // Filter events based on search term
  const filteredEvents = (state.events || []).filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.hallIds || []).some((hallId) => {
        const hall = availableHalls.find((h) => h.id === hallId);
        return hall?.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
  );

  // Calculate statistics
  const allEvents = state.events || [];
  const totalEvents = allEvents.length;
  const activeEvents = allEvents.filter(
    (event) =>
      event.status === "confirmed" ||
      event.status === "ongoing" ||
      event.status === "pending"
  ).length;
  const inactiveEvents = allEvents.filter(
    (event) => event.status === "cancelled" || event.status === "completed"
  ).length;

  // Get status color for table display
  const getStatusColor = (status: string): string => {
    // Determine if event is active or inactive
    const isActive =
      status === "confirmed" || status === "ongoing" || status === "pending";
    return isActive ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
  };

  // Get status label for display
  const getStatusLabel = (status: string): string => {
    const isActive =
      status === "confirmed" || status === "ongoing" || status === "pending";
    return isActive ? "Active" : "Inactive";
  };

  // If showCRUD is false or mode is not list, show the regular form
  if (!showCRUD || currentMode !== "list") {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Event Details
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Corporate Conference 2024"
                error={errors.name}
              />
            </div>
          </div>
        </div>

        {/* Hall Selection Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Hall Selection
          </h3>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Halls * (Multiple halls can be selected)
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAllHalls}
                className="text-xs"
              >
                {formData.hallIds.length === availableHalls.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            {/* Display selected halls by name */}
            {formData.hallIds.length > 0 && (
              <div className="mb-3 p-2 bg-blue-50 rounded border">
                <div className="text-sm text-blue-700">
                  <strong>Selected halls:</strong> {selectedHallNames}
                </div>
              </div>
            )}

            {/* Hall selection checkboxes */}
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-3">
              {availableHalls.map((hall) => (
                <div key={hall.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`hall-${hall.id}`}
                    checked={formData.hallIds.includes(hall.id)}
                    onChange={() => handleHallToggle(hall.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`hall-${hall.id}`}
                    className="flex-1 text-sm text-gray-700 cursor-pointer"
                  >
                    <span className="font-medium">{hall.name}</span>
                    <span className="text-gray-500 ml-2">
                      (Capacity: {hall.capacity})
                    </span>
                  </label>
                </div>
              ))}
            </div>

            {errors.hallIds && (
              <p className="mt-1 text-sm text-red-600">{errors.hallIds}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            {currentMode === "edit" && selectedEvent && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete Event
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCloseModal} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={currentMode === "view"}>
              {currentMode === "edit" ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </div>
      </form>
    );
  }

  // Main CRUD view with table
  return (
    <div className="space-y-6">
      {/* Header with Create button and Search */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
          <p className="text-gray-600">Create, view, edit, and delete events</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Events</p>
                <p className="text-3xl font-bold">{totalEvents}</p>
              </div>
              <Calendar className="w-8 h-8 opacity-80" />
            </div>
            <div className="mt-2 text-xs opacity-75">
              All time events created
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Events</p>
                <p className="text-3xl font-bold">{activeEvents}</p>
              </div>
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
            <div className="mt-2 text-xs opacity-75">
              Ongoing and scheduled events
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Inactive Events</p>
                <p className="text-3xl font-bold">{inactiveEvents}</p>
              </div>
              <Eye className="w-8 h-8 opacity-80" />
            </div>
            <div className="mt-2 text-xs opacity-75">
              Completed and cancelled events
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search events by name or hall..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredEvents.length} event(s) found
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Halls
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No events found matching your search."
                      : "No events found. Create your first event!"}
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => {
                  const eventHalls =
                    (event.hallIds || [])
                      .map((hallId) => {
                        const hall = availableHalls.find(
                          (h) => h.id === hallId
                        );
                        return hall ? hall.name : null;
                      })
                      .filter(Boolean)
                      .join(", ") || "No halls assigned";

                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {event.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {eventHalls}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            event.status
                          )}`}
                        >
                          {getStatusLabel(event.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.createdAt
                          ? new Date(event.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(event)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(event)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEvent(event);
                              handleDelete();
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit/View */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Event Details"
      >
        <CreateEventForm
          event={selectedEvent}
          mode={
            currentMode === "list"
              ? "create"
              : (currentMode as "create" | "edit" | "view")
          }
          onClose={handleCloseModal}
          onSuccess={handleFormSuccess}
          onDelete={selectedEvent ? () => handleDelete() : undefined}
          showCRUD={false}
        />
      </Modal>
    </div>
  );
};
