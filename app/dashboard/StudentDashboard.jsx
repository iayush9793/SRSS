"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// Firestore removed - using Supabase now
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  LogOut,
  User as UserIcon,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Phone,
  GraduationCap,
  BookOpen,
  Shield,
  DollarSign,
  FileDown,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { getPublicIdFromUrl } from "@/lib/cloudinary-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Course options
const COURSES = [
  "B.ed",
  "D.eled",
  "BA",
  "BSC",
];

// Batch years
const BATCH_YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

export default function StudentDashboard() {
  const router = useRouter();
  const { user, userRole, signOut } = useAuth();

  // State Management
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [feesData, setFeesData] = useState({
    totalAmount: "",
    amountPaid: "",
    status: "Unpaid",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [notification, setNotification] = useState({ type: null, message: "" });
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    contactNo: "",
    batchYear: "",
    course: "",
  });

  // Show notification
  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: null, message: "" }), 5000);
  }, []);

  // Fetch students from Supabase
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error
        });
        throw error;
      }

      const studentsData = data.map((student, index) => ({
        id: student.id,
        serialNo: index + 1,
        name: student.name || "",
        rollNo: student.roll_no,
        contactNo: student.contact_no,
        batchYear: student.batch_year,
        course: student.course,
        documents: student.documents || [],
        totalAmount: student.total_amount || 0,
        amountPaid: student.amount_paid || 0,
        feeStatus: student.fee_status || "Unpaid",
        createdAt: student.created_at,
        updatedAt: student.updated_at,
      }));

      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      const errorMessage = error?.message || error?.details || error?.hint || JSON.stringify(error) || "Unknown error";
      showNotification("error", `Failed to fetch students: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user, fetchStudents]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle add/edit student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStudent) {
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update({
            name: formData.name,
            roll_no: formData.rollNo,
            contact_no: formData.contactNo,
            batch_year: formData.batchYear,
            course: formData.course,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedStudent.id);

        if (error) throw error;
        showNotification("success", "Student updated successfully!");
      } else {
        // Add new student
        const { error } = await supabase
          .from('students')
          .insert({
            name: formData.name,
            roll_no: formData.rollNo,
            contact_no: formData.contactNo,
            batch_year: formData.batchYear,
            course: formData.course,
            documents: [],
          });

        if (error) throw error;
        showNotification("success", "Student added successfully!");
      }
      setIsModalOpen(false);
      setFormData({ name: "", rollNo: "", contactNo: "", batchYear: "", course: "" });
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      showNotification("error", `Failed to save student: ${error.message}`);
    }
  };

  // Handle delete student
  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    if (userRole !== "admin") {
      showNotification("error", "Only admins can delete students");
      return;
    }

    try {
      // Delete all associated documents from Cloudinary
      const student = students.find((s) => s.id === studentId);
      if (student?.documents) {
        for (const docUrl of student.documents) {
          try {
            const publicId = getPublicIdFromUrl(docUrl);
            if (publicId) {
              await fetch(`/api/upload?public_id=${encodeURIComponent(publicId)}`, {
                method: "DELETE",
              });
            }
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        }
      }

      // Delete student from Supabase
      const { error: deleteError } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (deleteError) throw deleteError;

      showNotification("success", "Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      showNotification("error", "Failed to delete student");
    }
  };

  // Handle edit student
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name || "",
      rollNo: student.rollNo || "",
      contactNo: student.contactNo || "",
      batchYear: student.batchYear || "",
      course: student.course || "",
    });
    setIsModalOpen(true);
  };

  // Handle edit fees
  const handleEditFees = (student) => {
    setSelectedStudent(student);
    setFeesData({
      totalAmount: student.totalAmount?.toString() || "0",
      amountPaid: student.amountPaid?.toString() || "0",
      status: student.feeStatus || "Unpaid",
    });
    setIsFeesModalOpen(true);
  };

  // Handle fees update
  const handleFeesSubmit = async (e) => {
    e.preventDefault();
    if (userRole !== "admin") {
      showNotification("error", "Only admins can edit fees");
      return;
    }

    try {
      const totalAmount = parseFloat(feesData.totalAmount) || 0;
      const amountPaid = parseFloat(feesData.amountPaid) || 0;
      let status = feesData.status;

      // Auto-calculate status based on amounts
      if (amountPaid >= totalAmount && totalAmount > 0) {
        status = "Paid";
      } else if (amountPaid > 0 && amountPaid < totalAmount) {
        status = "Partial";
      } else {
        status = "Unpaid";
      }

      const { error } = await supabase
        .from('students')
        .update({
          total_amount: totalAmount,
          amount_paid: amountPaid,
          fee_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedStudent.id);

      if (error) throw error;

      showNotification("success", "Fees updated successfully!");
      setIsFeesModalOpen(false);
      setSelectedStudent(null);
      setFeesData({ totalAmount: "", amountPaid: "", status: "Unpaid" });
      fetchStudents();
    } catch (error) {
      console.error("Error updating fees:", error);
      showNotification("error", `Failed to update fees: ${error.message}`);
    }
  };

  // Calculate amount left
  const calculateAmountLeft = (totalAmount, amountPaid) => {
    const total = parseFloat(totalAmount) || 0;
    const paid = parseFloat(amountPaid) || 0;
    return Math.max(0, total - paid);
  };

  // Handle CSV download
  const handleDownloadCSV = () => {
    try {
      // Prepare CSV data
      const headers = [
        "Serial No.",
        "Name",
        "Roll No./Student ID",
        "Contact No.",
        "Batch Year",
        "Course",
        "Total Amount",
        "Amount Paid",
        "Amount Left",
        "Fee Status",
        "Documents Count",
        "Created At",
      ];

      const rows = filteredStudents.map((student) => {
        const amountLeft = calculateAmountLeft(student.totalAmount, student.amountPaid);
        return [
          student.serialNo,
          student.name || "",
          student.rollNo,
          student.contactNo,
          student.batchYear,
          student.course,
          student.totalAmount || 0,
          student.amountPaid || 0,
          amountLeft,
          student.feeStatus || "Unpaid",
          student.documents?.length || 0,
          new Date(student.createdAt).toLocaleDateString(),
        ];
      });

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `students_data_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification("success", "CSV file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      showNotification("error", "Failed to download CSV file");
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (e, studentId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `students/${studentId}`);

      // Upload to Cloudinary via API route
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      const downloadURL = result.url;

      // Update student document with new file URL in Supabase
      const student = students.find((s) => s.id === studentId);
      const updatedDocuments = [...(student?.documents || []), downloadURL];

      const { error } = await supabase
        .from('students')
        .update({
          documents: updatedDocuments,
          updated_at: new Date().toISOString(),
        })
        .eq('id', studentId);

      if (error) throw error;

      showNotification("success", "Document uploaded successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error uploading document:", error);
      showNotification("error", `Failed to upload document: ${error.message}`);
    } finally {
      setUploadingDoc(false);
      e.target.value = "";
    }
  };

  // Handle document view
  const handleViewDocument = (documentUrl) => {
    setSelectedDocument(documentUrl);
    setIsDocumentModalOpen(true);
  };

  // Handle document delete
  const handleDeleteDocument = async (studentId, documentUrl) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      // Extract public_id from Cloudinary URL
      const publicId = getPublicIdFromUrl(documentUrl);
      
      if (publicId) {
        // Delete from Cloudinary
        const response = await fetch(`/api/upload?public_id=${encodeURIComponent(publicId)}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete from Cloudinary");
        }
      }

      // Remove from student's documents array in Supabase
      const student = students.find((s) => s.id === studentId);
      const updatedDocuments = student.documents.filter((url) => url !== documentUrl);

      const { error } = await supabase
        .from('students')
        .update({
          documents: updatedDocuments,
          updated_at: new Date().toISOString(),
        })
        .eq('id', studentId);

      if (error) throw error;

      showNotification("success", "Document deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting document:", error);
      showNotification("error", "Failed to delete document");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      showNotification("error", "Failed to logout");
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.contactNo?.includes(searchTerm);
    const matchesBatch = !filterBatch || student.batchYear === filterBatch;
    const matchesCourse = !filterCourse || student.course === filterCourse;
    return matchesSearch && matchesBatch && matchesCourse;
  });

  // Check permissions
  const canEdit = userRole === "admin" || userRole === "operator";
  const canDelete = userRole === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Management Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-2">
              Manage student records and documents
            </p>
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-600">
                Role: <span className="font-semibold capitalize">{userRole || "Loading..."}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline truncate max-w-[150px]">{user.email}</span>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-lg text-xs sm:text-sm px-3 sm:px-4 py-2 h-auto"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Notification */}
        {notification.type && (
          <div
            className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            )}
            <span className="break-words">{notification.message}</span>
          </div>
        )}

        {/* Action Bar */}
        <Card className="mb-4 sm:mb-6 shadow-lg">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Search and Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by Name, Roll No or Contact..."
                    className="pl-10 h-10 sm:h-11 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 flex-1 sm:flex-initial">
                  <select
                    className="h-10 sm:h-11 px-3 sm:px-4 rounded-lg border border-gray-300 bg-white text-sm"
                    value={filterBatch}
                    onChange={(e) => setFilterBatch(e.target.value)}
                  >
                    <option value="">All Batches</option>
                    {BATCH_YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  <select
                    className="h-10 sm:h-11 px-3 sm:px-4 rounded-lg border border-gray-300 bg-white text-sm"
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                  >
                    <option value="">All Courses</option>
                    {COURSES.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <Button
                  onClick={handleDownloadCSV}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 h-10 sm:h-11 text-sm flex-1 sm:flex-initial"
                >
                  <FileDown className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Download CSV</span>
                  <span className="sm:hidden">CSV</span>
                </Button>
                {canEdit && (
                  <Button
                    onClick={() => {
                      setSelectedStudent(null);
                      setFormData({ name: "", rollNo: "", contactNo: "", batchYear: "", course: "" });
                      setIsModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-10 sm:h-11 text-sm flex-1 sm:flex-initial"
                  >
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Student</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              Students ({filteredStudents.length})
            </CardTitle>
            <CardDescription className="text-sm">
              Manage student information and documents
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">No students found.</p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="block md:hidden space-y-3 p-4">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">#{student.serialNo}</span>
                            {student.name && (
                              <span className="text-sm font-semibold text-gray-900">{student.name}</span>
                            )}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{student.rollNo}</div>
                        </div>
                        {canEdit && (
                          <div className="flex gap-1">
                            <Button
                              onClick={() => handleEdit(student)}
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            {canDelete && (
                              <Button
                                onClick={() => handleDelete(student.id)}
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:border-red-300"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{student.contactNo}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{student.batchYear}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <BookOpen className="h-3 w-3" />
                          <span>{student.course}</span>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex items-center gap-1 mb-1">
                            <DollarSign className="h-3 w-3 text-gray-600" />
                            <span className="text-xs text-gray-600">Total: ₹{parseFloat(student.totalAmount || 0).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            Paid: ₹{parseFloat(student.amountPaid || 0).toLocaleString('en-IN')} | 
                            Left: ₹{calculateAmountLeft(student.totalAmount, student.amountPaid).toLocaleString('en-IN')}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                student.feeStatus === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : student.feeStatus === "Partial"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.feeStatus || "Unpaid"}
                            </span>
                            {userRole === "admin" && (
                              <Button
                                onClick={() => handleEditFees(student)}
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                title="Edit Fees"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                          {canEdit && (
                            <label className="cursor-pointer">
                              <Upload className="h-4 w-4 text-blue-600 hover:text-blue-700" />
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleDocumentUpload(e, student.id)}
                                disabled={uploadingDoc}
                              />
                            </label>
                          )}
                          <span className="text-xs text-gray-500">
                            {student.documents?.length || 0} file(s)
                          </span>
                          {student.documents && student.documents.length > 0 && (
                            <div className="flex gap-1">
                              {student.documents.map((docUrl, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleViewDocument(docUrl)}
                                  className="p-1 hover:bg-blue-100 rounded"
                                  title="View document"
                                >
                                  <Eye className="h-4 w-4 text-blue-600" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Serial No.
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Roll No./Student ID
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact No.
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Batch Year
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fees
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Documents
                        </th>
                        {canEdit && (
                          <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {student.serialNo}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name || "-"}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {student.rollNo}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {student.contactNo}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {student.batchYear}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {student.course}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                Total: ₹{parseFloat(student.totalAmount || 0).toLocaleString('en-IN')}
                              </div>
                              <div className="text-xs text-gray-600">
                                Paid: ₹{parseFloat(student.amountPaid || 0).toLocaleString('en-IN')}
                              </div>
                              <div className="text-xs text-gray-600">
                                Left: ₹{calculateAmountLeft(student.totalAmount, student.amountPaid).toLocaleString('en-IN')}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    student.feeStatus === "Paid"
                                      ? "bg-green-100 text-green-800"
                                      : student.feeStatus === "Partial"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {student.feeStatus || "Unpaid"}
                                </span>
                                {userRole === "admin" && (
                                  <Button
                                    onClick={() => handleEditFees(student)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2"
                                    title="Edit Fees"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {canEdit && (
                                <label className="cursor-pointer">
                                  <Upload className="h-4 w-4 text-blue-600 hover:text-blue-700" />
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, student.id)}
                                    disabled={uploadingDoc}
                                  />
                                </label>
                              )}
                              <span className="text-sm text-gray-600">
                                {student.documents?.length || 0} file(s)
                              </span>
                              {student.documents && student.documents.length > 0 && (
                                <div className="flex gap-1">
                                  {student.documents.map((docUrl, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleViewDocument(docUrl)}
                                      className="p-1 hover:bg-blue-100 rounded"
                                      title="View document"
                                    >
                                      <Eye className="h-4 w-4 text-blue-600" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          {canEdit && (
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  onClick={() => handleEdit(student)}
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                {canDelete && (
                                  <Button
                                    onClick={() => handleDelete(student.id)}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-red-600 hover:text-red-700 hover:border-red-300"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Student Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent ? "Edit Student" : "Add New Student"}
            </DialogTitle>
            <DialogDescription>
              {selectedStudent
                ? "Update student information"
                : "Enter student details to add a new record"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter student name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Roll No./Student ID *</label>
              <Input
                name="rollNo"
                value={formData.rollNo}
                onChange={handleInputChange}
                placeholder="Enter Roll No or Student ID"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Contact No. *</label>
              <Input
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                placeholder="Enter contact number"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Batch Year *</label>
              <select
                name="batchYear"
                value={formData.batchYear}
                onChange={handleInputChange}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                required
              >
                <option value="">Select Batch Year</option>
                {BATCH_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Course Enrolled *</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                required
              >
                <option value="">Select Course</option>
                {COURSES.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedStudent(null);
                  setFormData({ name: "", rollNo: "", contactNo: "", batchYear: "", course: "" });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                {selectedStudent ? "Update" : "Add"} Student
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal */}
      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
            <DialogDescription>View student document</DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="mt-4">
              {selectedDocument.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={selectedDocument}
                  alt="Document"
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg border mx-auto"
                />
              ) : selectedDocument.match(/\.(pdf)$/i) ? (
                <iframe
                  src={selectedDocument}
                  className="w-full h-[70vh] border rounded-lg"
                  title="Document Viewer"
                />
              ) : (
                <div className="w-full h-[50vh] sm:h-[70vh] border rounded-lg flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-muted-foreground mb-4">
                      Preview not available for this file type
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedDocument, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                </div>
              )}
              <div className="mt-4 flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedDocument, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDocumentModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Fees Modal */}
      <Dialog open={isFeesModalOpen} onOpenChange={setIsFeesModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Fees</DialogTitle>
            <DialogDescription>
              Update fee information for {selectedStudent?.rollNo || "student"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFeesSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Total Amount (₹) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={feesData.totalAmount}
                onChange={(e) =>
                  setFeesData({ ...feesData, totalAmount: e.target.value })
                }
                placeholder="Enter total amount"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Amount Paid (₹) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={feesData.amountPaid}
                onChange={(e) =>
                  setFeesData({ ...feesData, amountPaid: e.target.value })
                }
                placeholder="Enter amount paid"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Status *
              </label>
              <select
                value={feesData.status}
                onChange={(e) =>
                  setFeesData({ ...feesData, status: e.target.value })
                }
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                required
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Status will be auto-calculated based on amounts, but you can override it.
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{parseFloat(feesData.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{parseFloat(feesData.amountPaid || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Amount Left:</span>
                  <span className="font-semibold text-red-600">
                    ₹{calculateAmountLeft(feesData.totalAmount, feesData.amountPaid).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsFeesModalOpen(false);
                  setSelectedStudent(null);
                  setFeesData({ totalAmount: "", amountPaid: "", status: "Unpaid" });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                Update Fees
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

