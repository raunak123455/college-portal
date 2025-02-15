"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
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
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

interface AgentNote {
  note: string;
  date: string;
  agent?: {
    name: string;
    email: string;
  };
}

interface Application {
  _id: string;
  university: string;
  program: string;
  student: {
    name: string;
    email: string;
  };
  status: string;
  timeline: { date: string; status: string; comment?: string }[];
  progress: number;
  agentNotes: AgentNote[];
}

export default function AgentDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [agentNote, setAgentNote] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/applications/agent",
        {
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch applications");

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (appId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/applications/${appId}/note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            note: agentNote,
            date: new Date().toISOString().split("T")[0],
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add note");

      toast.success("Note added successfully");
      setAgentNote("");
      fetchApplications(); // Refresh applications
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Agent Dashboard</h1>
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
                        Student: {app.student?.name} ({app.student?.email})
                      </p>
                      {/* Show latest note preview if exists */}
                      {app.agentNotes?.length > 0 && (
                        <div className="mt-2 text-sm">
                          <p className="text-muted-foreground font-medium">
                            Latest Note:
                          </p>
                          <p className="text-muted-foreground line-clamp-2">
                            {app.agentNotes[app.agentNotes.length - 1].note}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {app.agentNotes[app.agentNotes.length - 1].date}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            View & Add Notes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Application Details & Notes
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Application Info */}
                            <div className="border-b pb-4">
                              <h3 className="font-semibold mb-2">
                                Application Info
                              </h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">
                                    University
                                  </p>
                                  <p className="font-medium">
                                    {app.university}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Program
                                  </p>
                                  <p className="font-medium">{app.program}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Status
                                  </p>
                                  <p className="font-medium">{app.status}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Progress
                                  </p>
                                  <Progress
                                    value={app.progress}
                                    className="mt-2"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Previous Notes */}
                            {app.agentNotes?.length > 0 && (
                              <div className="border-b pb-4">
                                <h3 className="font-semibold mb-2">
                                  Previous Notes
                                </h3>
                                <div className="bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
                                  {app.agentNotes.map((note, index) => (
                                    <div
                                      key={index}
                                      className="mb-4 last:mb-0 border-b border-gray-200 last:border-0 pb-2"
                                    >
                                      <p className="text-sm whitespace-pre-line">
                                        {note.note}
                                      </p>
                                      <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                                        <span>{note.date}</span>
                                        {note.agent && (
                                          <span>By: {note.agent.name}</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Add Note Section */}
                            <div>
                              <h3 className="font-semibold mb-2">
                                Add New Note
                              </h3>
                              <Textarea
                                value={agentNote}
                                onChange={(e) => setAgentNote(e.target.value)}
                                placeholder="Add your notes here..."
                                className="mb-2 min-h-[100px]"
                              />
                              <Button
                                onClick={() => handleAddNote(app._id)}
                                disabled={!agentNote.trim()}
                                className="w-full"
                              >
                                Add Note
                              </Button>
                            </div>

                            {/* Application Timeline */}
                            <div>
                              <h3 className="font-semibold mb-2">
                                Application Timeline
                              </h3>
                              <div className="space-y-2">
                                {app.timeline.map((event, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 text-sm border-l-2 border-gray-200 pl-4 py-2"
                                  >
                                    <span className="text-muted-foreground">
                                      {event.date}
                                    </span>
                                    <span>{event.status}</span>
                                    {event.comment && (
                                      <span className="text-muted-foreground">
                                        - {event.comment}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
