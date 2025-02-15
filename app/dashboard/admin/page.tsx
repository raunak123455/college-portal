"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast, { Toaster } from "react-hot-toast";

interface Application {
  _id: string;
  university: string;
  program: string;
  student?: {
    name: string;
    email: string;
  };
  status: string;
  timeline: { date: string; status: string }[];
  progress: number;
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/applications/all",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        console.log("Fetched applications:", data); // Debug log
        setApplications(data);
      } catch (err) {
        console.error("Fetch error:", err); // Debug log
        setError(
          err instanceof Error ? err.message : "Failed to fetch applications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Add loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading applications...</p>
      </div>
    );
  }

  // Add error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  // Add empty state
  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button
              variant="destructive"
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
              }}
            >
              Logout
            </Button>
          </div>
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No applications found</p>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Show success toast
      toast.success("Logged out successfully");

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  // Add delete handler
  const handleDelete = async (appId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/applications/${appId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      // Refresh applications list after successful deletion
      const updatedApps = applications.filter((app) => app._id !== appId);
      setApplications(updatedApps);
      setIsDeleteDialogOpen(false);

      // Show success toast
      toast.success("Application deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      // Show error toast
      toast.error("Failed to delete application");
    }
  };

  const handleStatusUpdate = async (appId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/applications/${appId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: newStatus,
            lastUpdated: new Date().toISOString().split("T")[0],
            timeline: [
              {
                date: new Date().toISOString().split("T")[0],
                status: `Status updated to ${newStatus}`,
                icon: newStatus.toLowerCase().includes("reject")
                  ? "reject"
                  : "review",
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      const updatedApp = await response.json();

      // Update the applications list with the new status
      setApplications((apps) =>
        apps.map((app) => (app._id === appId ? { ...app, ...updatedApp } : app))
      );

      // Show success toast
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Update error:", error);
      // Show error toast
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="grid gap-6">
            {applications.map((app) => (
              <Card key={app._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {app.university}
                      </h2>
                      <p className="text-muted-foreground">{app.program}</p>
                      <p className="text-sm text-muted-foreground">
                        Student:{" "}
                        {app.student
                          ? `${app.student.name} (${app.student.email})`
                          : "No student data"}
                      </p>
                    </div>
                    <div className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Application Details */}
                            <div className="grid gap-4">
                              <div>
                                <h3 className="font-semibold">University</h3>
                                <p>{app.university}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold">Program</h3>
                                <p>{app.program}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold">Update Status</h3>
                                <Select
                                  defaultValue={app.status}
                                  onValueChange={(value) =>
                                    handleStatusUpdate(app._id, value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Pending">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="Under Review">
                                      Under Review
                                    </SelectItem>
                                    <SelectItem value="Documents Pending">
                                      Documents Pending
                                    </SelectItem>
                                    <SelectItem value="Interview Scheduled">
                                      Interview Scheduled
                                    </SelectItem>
                                    <SelectItem value="Accepted">
                                      Accepted
                                    </SelectItem>
                                    <SelectItem value="Rejected">
                                      Rejected
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Timeline */}
                              <div>
                                <h3 className="font-semibold mb-2">
                                  Application Timeline
                                </h3>
                                <div className="space-y-2">
                                  {app.timeline.map((event, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 text-sm"
                                    >
                                      <span className="text-muted-foreground">
                                        {event.date}
                                      </span>
                                      <span>{event.status}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Progress */}
                              <div>
                                <h3 className="font-semibold mb-2">Progress</h3>
                                <Progress value={app.progress} />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  setSelectedAppId(app._id);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                Delete Application
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Badge
                        className="ml-2"
                        variant={
                          app.status === "Accepted"
                            ? "success"
                            : app.status === "Rejected"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                application.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedAppId && handleDelete(selectedAppId)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          // Default options for all toasts
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
}
