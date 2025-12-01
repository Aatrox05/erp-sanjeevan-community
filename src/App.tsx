import React, { useState } from 'react';
import { StaffDashboard } from './components/StaffDashboard';
import { HODDashboard } from './components/HODDashboard';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { LeaveProvider } from './components/LeaveContext';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { User, UserCheck, Shield, LogIn, GraduationCap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type UserRole = 'staff' | 'hod' | 'superadmin' | 'student' | null;

interface LoginData {
  email: string;
  password: string;
  role: UserRole;
}

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [showLogin, setShowLogin] = useState<UserRole>(null);
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
    role: null
  });

  // Demo credentials for each role
  const demoCredentials = {
    staff: { email: 'staff@college.edu', password: 'staff123' },
    hod: { email: 'hod@college.edu', password: 'hod123' },
    superadmin: { email: 'admin@college.edu', password: 'admin123' },
    student: { email: 'stud@college.edu', password: 'stud123' }
  };

  const handleLogin = (role: UserRole) => {
    if (!loginData.email || !loginData.password || !loginData.role) {
      toast.error('Please fill in all fields');
      return;
    }

    if (loginData.role !== role) {
      toast.error('Selected role does not match login credentials');
      return;
    }

    // Validate credentials
    const credentials = demoCredentials[role as keyof typeof demoCredentials];
    if (loginData.email !== credentials.email || loginData.password !== credentials.password) {
      toast.error('Invalid email or password');
      return;
    }

    toast.success(`Login successful! Welcome to ${role.toUpperCase()} dashboard`);
    setCurrentRole(role);
    setShowLogin(null);
    setLoginData({ email: '', password: '', role: null });
  };

  const handleBack = () => {
    setCurrentRole(null);
    setShowLogin(null);
    setLoginData({ email: '', password: '', role: null });
  };



  const renderLoginCard = (role: UserRole, title: string, description: string, icon: React.ReactNode, bgColor: string, buttonColor: string) => (
    <Card className="hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
      <CardHeader className="text-center pb-4">
        <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showLogin === role ? (
          <>
            <div className="space-y-2">
              <Label htmlFor={`${role}-email`}>Email Address</Label>
              <Input
                id={`${role}-email`}
                type="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-password`}>Password</Label>
              <Input
                id={`${role}-password`}
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${role}-role`}>Role</Label>
              <Select onValueChange={(value) => setLoginData({ ...loginData, role: value as UserRole })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="staff">Staff Member</SelectItem>
                  <SelectItem value="hod">Head of Department</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                className={`flex-1 ${buttonColor}`}
                onClick={() => handleLogin(role)}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowLogin(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button 
              className={`w-full ${buttonColor}`}
              onClick={() => setShowLogin(role)}
            >
              Login to {title}
            </Button>
            <div className="text-sm text-gray-500">
              {role === 'staff' && (
                <>
                  <p>• View leave balance</p>
                  <p>• Apply for leave</p>
                  <p>• Check notifications</p>
                  <p>• Holiday calendar</p>
                </>
              )}
              {role === 'hod' && (
                <>
                  <p>• Approve leave requests</p>
                  <p>• Staff workload analysis</p>
                  <p>• Department analytics</p>
                  <p>• Team management</p>
                </>
              )}
              {role === 'superadmin' && (
                <>
                  <p>• Final leave approvals</p>
                  <p>• Financial analytics</p>
                  <p>• Performance reports</p>
                  <p>• System management</p>
                </>
              )}
              {role === 'student' && (
                <>
                  <p>• View courses and resources</p>
                  <p>• Check academic calendar</p>
                  <p>• See notifications</p>
                  <p>• Track assignments</p>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <LeaveProvider>
      {currentRole === 'staff' ? (
        <StaffDashboard onBack={handleBack} />
      ) : currentRole === 'hod' ? (
        <HODDashboard onBack={handleBack} />
      ) : currentRole === 'superadmin' ? (
        <SuperAdminDashboard onBack={handleBack} />
      ) : currentRole === 'student' ? (
        <StudentDashboard onBack={handleBack} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">ERP system sanjeevan</h1>
              <p className="text-xl text-gray-600">Login to access your dashboard</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {renderLoginCard(
                'student',
                'Student Portal',
                'Access your courses, calendar and notifications',
                <GraduationCap className="w-8 h-8 text-green-600" />,
                'bg-green-100',
                'bg-green-600 hover:bg-green-700'
              )}

              {renderLoginCard(
                'staff',
                'Staff Portal',
                'Access leave management, notifications and calendar',
                <User className="w-8 h-8 text-blue-600" />,
                'bg-blue-100',
                'bg-blue-600 hover:bg-blue-700'
              )}

              {renderLoginCard(
                'hod',
                'HOD Portal',
                'Manage department operations and approvals',
                <UserCheck className="w-8 h-8 text-indigo-600" />,
                'bg-indigo-100',
                'bg-indigo-600 hover:bg-indigo-700'
              )}

              {renderLoginCard(
                'superadmin',
                'Admin Portal',
                'Full system administration and final approvals',
                <Shield className="w-8 h-8 text-purple-600" />,
                'bg-purple-100',
                'bg-purple-600 hover:bg-purple-700'
              )}
            </div>

            <div className="mt-8 text-center">
              <div className="bg-white/80 backdrop-blur rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Demo Login Credentials</h3>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="font-medium text-green-600">Student Portal</div>
                    <div className="text-gray-600">stud@college.edu</div>
                    <div className="text-gray-600">stud123</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-blue-600">Staff Portal</div>
                    <div className="text-gray-600">staff@college.edu</div>
                    <div className="text-gray-600">staff123</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-indigo-600">HOD Portal</div>
                    <div className="text-gray-600">hod@college.edu</div>
                    <div className="text-gray-600">hod123</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-purple-600">Admin Portal</div>
                    <div className="text-gray-600">admin@college.edu</div>
                    <div className="text-gray-600">admin123</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Use these credentials with the corresponding role selection to access each dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </LeaveProvider>
  );
}