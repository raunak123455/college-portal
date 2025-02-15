"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

interface Application {
  id: string;
  university: string;
  program: string;
  status: string;
  progress: number;
  submittedDate: string;
  lastUpdated: string;
  timeline: {
    date: string;
    status: string;
    icon: string;
  }[];
}

export default function ApplicationTrackingPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("https://college-portal-419x.onrender.com/api/applications", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch applications"
        );
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background image div with overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-white/20" />
      </div>

      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Application Tracking</h1>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search applications..." className="pl-8" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg shadow-sm p-6 space-y-4"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{app.university}</h2>
                    <p className="text-muted-foreground">{app.program}</p>
                  </div>
                  <Badge
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

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Application Progress</span>
                    <span>{app.progress}%</span>
                  </div>
                  <Progress value={app.progress} />
                </div>

                {/* Dates */}
                <div className="flex gap-8 text-sm">
                  <div>
                    <p className="text-muted-foreground">Submitted Date</p>
                    <p className="font-medium">{app.submittedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{app.lastUpdated}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-3">Application Timeline</h3>
                  <div className="space-y-3">
                    {app.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {event.icon === "submit" && (
                          <Clock className="h-5 w-5 text-blue-500" />
                        )}
                        {event.icon === "verify" && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {event.icon === "review" && (
                          <Calendar className="h-5 w-5 text-orange-500" />
                        )}
                        <div>
                          <p className="font-medium">{event.status}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">View Details</Button>
                  <Button>Update Status</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
