"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  School,
  Trophy,
  Clock,
} from "lucide-react";

interface Scholarship {
  _id: string;
  name: string;
  university: string;
  amount: number;
  type: string;
  deadline: string;
  status: string;
  requirements: {
    gpa: string;
    major: string[];
    residency: string;
    level: string;
  };
  description: string;
  featured: boolean;
  progress?: number;
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/scholarships", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch scholarships");
        }

        const data = await response.json();
        setScholarships(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch scholarships"
        );
        console.error("Error fetching scholarships:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading scholarships...</p>
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
          backgroundImage: `url('/bg.jpg')`,
          backgroundSize: "100% 100%",
        }}
      />

      {/* Overlay for better readability */}
      <div className="fixed inset-0 bg-white/10 -z-10" />

      {/* Main content */}
      <div className="container mx-auto p-6 space-y-6 relative">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Scholarships</h1>
            <p className="text-muted-foreground">
              Find and track scholarship opportunities
            </p>
          </div>
          <Button>Match My Profile</Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-500">
                Available Scholarships
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {scholarships.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Matching your profile
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search scholarships..." className="pl-8" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="merit">Merit-based</SelectItem>
              <SelectItem value="need">Need-based</SelectItem>
              <SelectItem value="athletic">Athletic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Scholarships</TabsTrigger>
            {/* <TabsTrigger value="featured">Featured</TabsTrigger> */}
            <TabsTrigger value="applied">My Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {scholarships.map((scholarship) => (
              <Card
                key={scholarship._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {scholarship.name}
                      </h2>
                      <p className="text-muted-foreground">
                        {scholarship.university}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        $
                        {scholarship.amount
                          ? scholarship.amount.toLocaleString()
                          : "0"}
                      </div>
                      <Badge
                        variant={
                          scholarship.status === "Open"
                            ? "success"
                            : "destructive"
                        }
                      >
                        {scholarship.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Requirements */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Required GPA</p>
                        <p className="font-medium">
                          {scholarship.requirements.gpa}+
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Eligible Majors</p>
                        <p className="font-medium">
                          {scholarship.requirements.major.join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Residency</p>
                        <p className="font-medium">
                          {scholarship.requirements.residency}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deadline</p>
                        <p className="font-medium">{scholarship.deadline}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                      {scholarship.description}
                    </p>

                    {/* Progress if applied */}
                    {scholarship.progress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Application Progress</span>
                          <span>{scholarship.progress}%</span>
                        </div>
                        <Progress value={scholarship.progress} />
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">View Details</Button>
                      <Button>Apply Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="featured">
            {scholarships
              .filter((s) => s.featured)
              .map((scholarship) => (
                <Card
                  key={scholarship._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {scholarship.name}
                        </h2>
                        <p className="text-muted-foreground">
                          {scholarship.university}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          $
                          {scholarship.amount
                            ? scholarship.amount.toLocaleString()
                            : "0"}
                        </div>
                        <Badge
                          variant={
                            scholarship.status === "Open"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {scholarship.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Requirements */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Required GPA</p>
                          <p className="font-medium">
                            {scholarship.requirements.gpa}+
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Eligible Majors
                          </p>
                          <p className="font-medium">
                            {scholarship.requirements.major.join(", ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Residency</p>
                          <p className="font-medium">
                            {scholarship.requirements.residency}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deadline</p>
                          <p className="font-medium">{scholarship.deadline}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">
                        {scholarship.description}
                      </p>

                      {/* Progress if applied */}
                      {scholarship.progress && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Application Progress</span>
                            <span>{scholarship.progress}%</span>
                          </div>
                          <Progress value={scholarship.progress} />
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        <Button variant="outline">View Details</Button>
                        <Button>Apply Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="applied" className="space-y-4">
            {/* Sample applied scholarships */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Merit Scholarship 2024
                    </h2>
                    <p className="text-muted-foreground">Stanford University</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      $25,000
                    </div>
                    <Badge variant="success">In Progress</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Requirements */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Required GPA</p>
                      <p className="font-medium">3.8+</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Eligible Majors</p>
                      <p className="font-medium">
                        Computer Science, Engineering
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Residency</p>
                      <p className="font-medium">International</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deadline</p>
                      <p className="font-medium">2024-05-15</p>
                    </div>
                  </div>

                  {/* Application Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Application Progress</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} />
                  </div>

                  {/* Next Steps */}
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Next Steps:</h3>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        Submit recommendation letters (Due: 2024-04-30)
                      </li>
                      <li className="flex items-center">
                        <School className="h-4 w-4 mr-2 text-muted-foreground" />
                        Complete academic statement
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">View Details</Button>
                    <Button>Continue Application</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Second sample application */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      International Student Grant
                    </h2>
                    <p className="text-muted-foreground">MIT</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      $30,000
                    </div>
                    <Badge variant="default">Draft</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Requirements */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Required GPA</p>
                      <p className="font-medium">3.5+</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Eligible Majors</p>
                      <p className="font-medium">All STEM Fields</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Residency</p>
                      <p className="font-medium">International</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deadline</p>
                      <p className="font-medium">2024-06-30</p>
                    </div>
                  </div>

                  {/* Application Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Application Progress</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} />
                  </div>

                  {/* Next Steps */}
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Next Steps:</h3>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center">
                        <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                        Upload academic achievements
                      </li>
                      <li className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        Complete financial information
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">View Details</Button>
                    <Button>Continue Application</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
