"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, School, Trophy } from "lucide-react";

// Mock data for college matches
const collegeMatches = [
  {
    university: "Stanford University",
    program: "Computer Science",
    matchPercentage: 92,
    strengths: [
      "Academic Performance",
      "Research Experience",
      "Technical Skills",
    ],
    requirements: {
      gpa: "3.9/4.0",
      satScore: "1540",
      research: "Required",
      internships: "Preferred",
    },
  },
  {
    university: "MIT",
    program: "Artificial Intelligence",
    matchPercentage: 88,
    strengths: ["Technical Background", "Project Experience", "Mathematics"],
    requirements: {
      gpa: "3.8/4.0",
      satScore: "1520",
      research: "Preferred",
      internships: "Required",
    },
  },
  {
    university: "Carnegie Mellon",
    program: "Software Engineering",
    matchPercentage: 85,
    strengths: ["Coding Skills", "Project Portfolio", "Leadership"],
    requirements: {
      gpa: "3.7/4.0",
      satScore: "1500",
      research: "Optional",
      internships: "Required",
    },
  },
  {
    university: "UC Berkeley",
    program: "Data Science",
    matchPercentage: 82,
    strengths: ["Mathematics", "Programming", "Analytics"],
    requirements: {
      gpa: "3.6/4.0",
      satScore: "1480",
      research: "Preferred",
      internships: "Preferred",
    },
  },
  {
    university: "Georgia Tech",
    program: "Computer Engineering",
    matchPercentage: 78,
    strengths: ["Technical Skills", "Mathematics", "Hardware Knowledge"],
    requirements: {
      gpa: "3.5/4.0",
      satScore: "1450",
      research: "Optional",
      internships: "Preferred",
    },
  },
];

export default function AIMatcherPage() {
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
            <h1 className="text-2xl font-bold text-white">
              AI Profile Matcher
            </h1>
            <p className="text-muted-foreground">
              Colleges that match your profile based on AI analysis
            </p>
          </div>
          <Button>Update Profile</Button>
        </div>

        {/* Match Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Match Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">
                Highest match rate
              </p>
            </CardContent>
          </Card>
          {/* Add more summary cards as needed */}
        </div>

        {/* College Matches List */}
        <div className="space-y-4">
          {collegeMatches.map((college, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {college.university}
                    </h2>
                    <p className="text-muted-foreground">{college.program}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {college.matchPercentage}%
                    </div>
                    <p className="text-sm text-muted-foreground">Match Rate</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <Progress value={college.matchPercentage} />
                  </div>

                  {/* Strengths */}
                  <div>
                    <h3 className="font-semibold mb-2">Your Strengths</h3>
                    <div className="flex flex-wrap gap-2">
                      {college.strengths.map((strength, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="font-semibold mb-2">Program Requirements</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Required GPA</p>
                        <p className="font-medium">
                          {college.requirements.gpa}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">SAT Score</p>
                        <p className="font-medium">
                          {college.requirements.satScore}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Research</p>
                        <p className="font-medium">
                          {college.requirements.research}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Internships</p>
                        <p className="font-medium">
                          {college.requirements.internships}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">View Details</Button>
                    <Button>Apply Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
