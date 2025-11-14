import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  DollarSign,
  Package2,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { useHotel } from "../../context/HotelContext";
import {
  AdditionalService,
  AdditionalServiceCategory,
} from "../../types/entities";

interface ServiceFormProps {
  additionalService?: AdditionalService;
  onClose: () => void;
  onSuccess: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  additionalService,
  onClose,
  onSuccess,
}) => {
  const { createAdditionalService, updateAdditionalService } = useHotel();
  const [formData, setFormData] = useState({
    name: additionalService?.name || "",
    description: additionalService?.description || "",
    category:
      additionalService?.category || ("other" as AdditionalServiceCategory),
    unitPrice: additionalService?.unitPrice || 0,
    unit: additionalService?.unit || "per hour",
    minQuantity: additionalService?.minQuantity || 1,
    maxQuantity: additionalService?.maxQuantity || 100,
    isActive: additionalService?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.unitPrice <= 0
    ) {
      alert("Please fill in all required fields with valid values");
      return;
    }

    const serviceData: Omit<
      AdditionalService,
      "id" | "createdAt" | "updatedAt"
    > = {
      ...formData,
    };

    try {
      if (additionalService) {
        // Update existing service
        updateAdditionalService({
          ...additionalService,
          ...serviceData,
        });
      } else {
        // Create new service
        createAdditionalService(serviceData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving additional service:", error);
      alert("Failed to save the additional service. Please try again.");
    }
  };

  const categoryOptions = [
    { value: "catering", label: "Catering & Food" },
    { value: "decoration", label: "Decoration & Design" },
    { value: "technical", label: "Technical & AV" },
    { value: "staff", label: "Staff & Personnel" },
    { value: "equipment", label: "Equipment & Furniture" },
    { value: "transport", label: "Transportation" },
    { value: "security", label: "Security Services" },
    { value: "other", label: "Other Services" },
  ];

  const unitOptions = [
    { value: "per hour", label: "Per Hour" },
    { value: "per day", label: "Per Day" },
    { value: "per event", label: "Per Event" },
    { value: "per person", label: "Per Person" },
    { value: "per piece", label: "Per Piece" },
    { value: "per setup", label: "Per Setup" },
    { value: "per vehicle", label: "Per Vehicle" },
    { value: "flat rate", label: "Flat Rate" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Service Name *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Professional DJ Service"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as AdditionalServiceCategory,
              })
            }
            options={categoryOptions}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Detailed description of the service..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Unit Price ($) *
          </label>
          <Input
            type="number"
            value={formData.unitPrice}
            onChange={(e) =>
              setFormData({ ...formData, unitPrice: Number(e.target.value) })
            }
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Unit Type *
          </label>
          <Select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            options={unitOptions}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Quantity
          </label>
          <Input
            type="number"
            value={formData.minQuantity}
            onChange={(e) =>
              setFormData({ ...formData, minQuantity: Number(e.target.value) })
            }
            placeholder="1"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maximum Quantity
          </label>
          <Input
            type="number"
            value={formData.maxQuantity}
            onChange={(e) =>
              setFormData({ ...formData, maxQuantity: Number(e.target.value) })
            }
            placeholder="100"
            min="1"
          />
        </div>
      </div>

      {/* Service Status */}
      <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label
          htmlFor="isActive"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Service is active and available for booking
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {additionalService ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
};

export const AdditionalServices: React.FC = () => {
  const { state, deleteAdditionalService, updateAdditionalService } =
    useHotel();
  const additionalServices = state.additionalServices || [];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<AdditionalService | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | AdditionalServiceCategory
  >("all");

  const filteredServices = useMemo(() => {
    return additionalServices.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && service.isActive) ||
        (statusFilter === "inactive" && !service.isActive);

      const matchesCategory =
        categoryFilter === "all" || service.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [additionalServices, searchTerm, statusFilter, categoryFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryLabel = (category: AdditionalServiceCategory) => {
    const categoryMap = {
      catering: "Catering & Food",
      decoration: "Decoration & Design",
      technical: "Technical & AV",
      staff: "Staff & Personnel",
      equipment: "Equipment & Furniture",
      transport: "Transportation",
      security: "Security Services",
      other: "Other Services",
    };
    return categoryMap[category] || category;
  };

  const getCategoryColor = (category: AdditionalServiceCategory) => {
    const colorMap = {
      catering: "bg-orange-100 text-orange-800",
      decoration: "bg-pink-100 text-pink-800",
      technical: "bg-blue-100 text-blue-800",
      staff: "bg-green-100 text-green-800",
      equipment: "bg-purple-100 text-purple-800",
      transport: "bg-indigo-100 text-indigo-800",
      security: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colorMap[category] || "bg-gray-100 text-gray-800";
  };

  const handleEditService = (service: AdditionalService) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const handleViewService = (service: AdditionalService) => {
    setSelectedService(service);
    setIsViewModalOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this service? This action cannot be undone."
      )
    ) {
      try {
        deleteAdditionalService(serviceId);
      } catch (error) {
        console.error("Error deleting additional service:", error);
        alert("Failed to delete the service. Please try again.");
      }
    }
  };

  const toggleServiceStatus = (serviceId: string) => {
    const service = additionalServices.find((s) => s.id === serviceId);
    if (service) {
      try {
        updateAdditionalService({
          ...service,
          isActive: !service.isActive,
        });
      } catch (error) {
        console.error("Error updating service status:", error);
        alert("Failed to update service status. Please try again.");
      }
    }
  };

  const serviceStats = {
    total: additionalServices.length,
    active: additionalServices.filter((s) => s.isActive).length,
    averagePrice:
      additionalServices.length > 0
        ? additionalServices.reduce((sum, s) => sum + s.unitPrice, 0) /
          additionalServices.length
        : 0,
    categories: new Set(additionalServices.map((s) => s.category)).size,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Additional Services
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage additional services available for events and bookings
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add New Service
        </Button>
      </div>

      {/* Service Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Services</p>
                <p className="text-3xl font-bold">{serviceStats.total}</p>
              </div>
              <Package2 className="w-8 h-8 opacity-80" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Services</p>
                <p className="text-3xl font-bold">{serviceStats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Avg Price</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(serviceStats.averagePrice)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Categories</p>
                <p className="text-3xl font-bold">{serviceStats.categories}</p>
              </div>
              <Filter className="w-8 h-8 opacity-80" />
            </div>
          </div>
        </Card>
      </div>

      {/* Services Management */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              All Services
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredServices.length} of {additionalServices.length} services
            </span>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search services by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "active" | "inactive"
                  )
                }
                options={[
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active Only" },
                  { value: "inactive", label: "Inactive Only" },
                ]}
              />

              <Select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value as "all" | AdditionalServiceCategory
                  )
                }
                options={[
                  { value: "all", label: "All Categories" },
                  { value: "catering", label: "Catering & Food" },
                  { value: "decoration", label: "Decoration & Design" },
                  { value: "technical", label: "Technical & AV" },
                  { value: "staff", label: "Staff & Personnel" },
                  { value: "equipment", label: "Equipment & Furniture" },
                  { value: "transport", label: "Transportation" },
                  { value: "security", label: "Security Services" },
                  { value: "other", label: "Other Services" },
                ]}
              />
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredServices.map((service) => (
                  <tr
                    key={service.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {service.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {service.description}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                          service.category
                        )}`}
                      >
                        {getCategoryLabel(service.category)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(service.unitPrice)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {service.unit}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {service.minQuantity} - {service.maxQuantity}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleServiceStatus(service.id)}
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          service.isActive
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {service.isActive ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {service.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewService(service)}
                          className="p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditService(service)}
                          className="p-1"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                          className="p-1 text-red-600 hover:text-red-700 hover:border-red-300"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {additionalServices.length === 0
                    ? "No services found"
                    : "No services match your criteria"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {additionalServices.length === 0
                    ? "Create your first additional service for events"
                    : "Try adjusting your search terms or filters to find services"}
                </p>
                {additionalServices.length === 0 && (
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Service
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Create Service Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Additional Service"
      >
        <ServiceForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            // In a real app, this would refresh the services list
          }}
        />
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedService(null);
        }}
        title="Edit Additional Service"
      >
        {selectedService && (
          <ServiceForm
            additionalService={selectedService}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedService(null);
            }}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedService(null);
              // In a real app, this would refresh the services list
            }}
          />
        )}
      </Modal>

      {/* View Service Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedService(null);
        }}
        title="Service Details"
      >
        {selectedService && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {selectedService.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedService.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Category:
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                        selectedService.category
                      )}`}
                    >
                      {getCategoryLabel(selectedService.category)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Unit Price:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(selectedService.unitPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Unit Type:
                    </span>
                    <span className="font-medium">{selectedService.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`font-medium ${
                        selectedService.isActive
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {selectedService.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Quantity Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Minimum Quantity:
                    </span>
                    <span className="font-medium">
                      {selectedService.minQuantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Maximum Quantity:
                    </span>
                    <span className="font-medium">
                      {selectedService.maxQuantity}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Price Range
                  </h5>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <div>
                      Minimum Cost:{" "}
                      {formatCurrency(
                        selectedService.unitPrice *
                          (selectedService.minQuantity || 1)
                      )}
                    </div>
                    <div>
                      Maximum Cost:{" "}
                      {formatCurrency(
                        selectedService.unitPrice *
                          (selectedService.maxQuantity || 1)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditService(selectedService);
                }}
                className="mr-3"
              >
                Edit Service
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedService(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
