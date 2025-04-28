import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Users, 
  BookOpen, 
  Server, 
  AlertCircle, 
  ChevronUp,
  BarChart3,
  UserPlus,
  Settings
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Sample data - would come from API in real app
  const stats = {
    totalUsers: 156,
    activeStudents: 128,
    teachers: 18,
    admins: 4,
    courses: 12,
    assignments: 68,
    systemAlerts: 2
  };
  
  const recentUsers = [
    { id: 1, name: "Emma Wilson", role: "Student", joinDate: "Apr 5, 2025", status: "Active" },
    { id: 2, name: "Michael Chen", role: "Teacher", joinDate: "Apr 3, 2025", status: "Active" },
    { id: 3, name: "Sophia Rodriguez", role: "Student", joinDate: "Apr 2, 2025", status: "Active" }
  ];

  const systemEvents = [
    { 
      id: 1, 
      title: "Database Backup Completed", 
      timestamp: "Today, 3:24 PM",
      severity: "info"
    },
    { 
      id: 2, 
      title: "User Login Failed (Multiple Attempts)", 
      timestamp: "Today, 1:15 PM",
      severity: "warning"
    },
    { 
      id: 3, 
      title: "System Update Available", 
      timestamp: "Yesterday",
      severity: "info"
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'info':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Info</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Warning</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" /> System Settings
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-1" /> Add User
          </Button>
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{stats.totalUsers}</span>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600 flex items-center">
                <ChevronUp className="h-3 w-3 mr-1" /> 12%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{stats.courses}</span>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600 flex items-center">
                <ChevronUp className="h-3 w-3 mr-1" /> 4%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resources Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Server className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">72%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">{stats.systemAlerts}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different admin views */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users, roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <Card className="p-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Active Students</span>
                    <span className="font-bold text-lg">{stats.activeStudents}</span>
                  </Card>
                  <Card className="p-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Teachers</span>
                    <span className="font-bold text-lg">{stats.teachers}</span>
                  </Card>
                  <Card className="p-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Administrators</span>
                    <span className="font-bold text-lg">{stats.admins}</span>
                  </Card>
                </div>
                
                <h3 className="text-lg font-medium">Recent Users</h3>
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <div className="flex items-center mt-1">
                          <Badge 
                            variant="outline" 
                            className={user.role === 'Student' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                                      user.role === 'Teacher' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'}
                          >
                            {user.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-2">Joined: {user.joinDate}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Details</Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Users</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>
                Usage statistics and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-48">
              <div className="flex flex-col items-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mb-2" />
                <p>Analytics visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Monitor system performance and recent events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium mb-4">Recent Events</h3>
              <div className="space-y-3">
                {systemEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center mt-1">
                        {getSeverityBadge(event.severity)}
                        <span className="text-xs text-muted-foreground ml-2">{event.timestamp}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Details</Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View System Logs</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;