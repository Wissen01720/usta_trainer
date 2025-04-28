import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { ArrowRight, Code, Trophy, Calendar } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  // Sample data - would come from API in real app
  const courses = [
    { 
      id: 1, 
      title: "Introduction to Programming", 
      progress: 75, 
      lessons: 12,
      completedLessons: 9,
      nextLesson: "Variables & Functions"
    },
    { 
      id: 2, 
      title: "JavaScript Fundamentals", 
      progress: 40, 
      lessons: 8,
      completedLessons: 3,
      nextLesson: "Arrays & Objects"
    },
    { 
      id: 3, 
      title: "Building Animations with Code", 
      progress: 10, 
      lessons: 10,
      completedLessons: 1,
      nextLesson: "Creating Your First Animation"
    }
  ];
  
  const achievements = [
    { id: 1, title: "First Code Run", icon: <Code className="h-5 w-5" /> },
    { id: 2, title: "Animation Master", icon: <Trophy className="h-5 w-5" /> },
  ];

  const upcomingAssignments = [
    { 
      id: 1, 
      title: "Create a Flying Bird", 
      dueDate: "Apr 15, 2025",
      course: "Building Animations with Code"
    },
    { 
      id: 2, 
      title: "Build a Simple Game", 
      dueDate: "Apr 22, 2025",
      course: "JavaScript Fundamentals"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      
      {/* Welcome Message */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="h-8 w-8 mr-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">JP</span>
            </div>
            Welcome back, Student!
          </CardTitle>
          <CardDescription>
            Continue your learning journey and create amazing animations with code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
              <Progress value={42} className="h-2 w-48" />
            </div>
            <Button size="sm">
              Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Courses Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>
                  {course.completedLessons} of {course.lessons} lessons completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={course.progress} className="h-2 mb-4" />
                <p className="text-sm font-medium">Next: {course.nextLesson}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Achievements and Upcoming Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Achievements</CardTitle>
            <CardDescription>Your coding milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">Unlocked</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View All Achievements
            </Button>
          </CardFooter>
        </Card>
        
        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Assignments</CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-4 mt-1">
                    <Calendar className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground">{assignment.course}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs">Due: {assignment.dueDate}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View All Assignments
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;