
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { isAdminAuthenticated, setAdminAuthenticated } from '@/lib/adminAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [avgMetabolicAge, setAvgMetabolicAge] = useState(0);
  const [submissionRate, setSubmissionRate] = useState(0);
  const [avgSessionTime, setAvgSessionTime] = useState(0);
  const [genderDistribution, setGenderDistribution] = useState<any[]>([]);
  const [ageGroupDistribution, setAgeGroupDistribution] = useState<any[]>([]);
  const [utmSourceDistribution, setUtmSourceDistribution] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAdminAuthenticated()) {
      navigate('/admin');
      return;
    }
    
    // Load dashboard data
    loadDashboardData();
  }, [navigate]);
  
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Get submissions count
      const { count: submissionsCountResult, error: countError } = await supabase
        .from('quiz_submissions')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      setSubmissionsCount(submissionsCountResult || 0);
      
      // Get average metabolic age
      const { data: metabolicAgeData, error: metabolicError } = await supabase
        .from('quiz_submissions')
        .select('metabolic_age')
        .not('metabolic_age', 'is', null);
      
      if (metabolicError) throw metabolicError;
      if (metabolicAgeData.length > 0) {
        const avgAge = metabolicAgeData.reduce((sum, item) => sum + (item.metabolic_age || 0), 0) / metabolicAgeData.length;
        setAvgMetabolicAge(Math.round(avgAge));
      }
      
      // Get submission rate
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('submitted_email');
      
      if (sessionsError) throw sessionsError;
      if (sessionsData.length > 0) {
        const submittedCount = sessionsData.filter(session => session.submitted_email).length;
        setSubmissionRate(Math.round((submittedCount / sessionsData.length) * 100));
      }
      
      // Get average session time
      const { data: sessionTimeData, error: timeError } = await supabase
        .from('user_sessions')
        .select('start_time, end_time')
        .not('end_time', 'is', null);
      
      if (timeError) throw timeError;
      if (sessionTimeData.length > 0) {
        let totalMinutes = 0;
        sessionTimeData.forEach(session => {
          if (session.start_time && session.end_time) {
            const startTime = new Date(session.start_time);
            const endTime = new Date(session.end_time);
            const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
            totalMinutes += durationMinutes;
          }
        });
        setAvgSessionTime(Math.round(totalMinutes / sessionTimeData.length));
      }
      
      // Get gender distribution
      const { data: genderData, error: genderError } = await supabase
        .from('quiz_submissions')
        .select('gender')
        .not('gender', 'is', null);
      
      if (genderError) throw genderError;
      if (genderData.length > 0) {
        const genderCounts: Record<string, number> = {};
        genderData.forEach(item => {
          const gender = item.gender || 'unknown';
          genderCounts[gender] = (genderCounts[gender] || 0) + 1;
        });
        
        const genderChartData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));
        setGenderDistribution(genderChartData);
      }
      
      // Get age group distribution
      const { data: ageData, error: ageError } = await supabase
        .from('quiz_submissions')
        .select('age_group')
        .not('age_group', 'is', null);
      
      if (ageError) throw ageError;
      if (ageData.length > 0) {
        const ageGroupCounts: Record<string, number> = {};
        ageData.forEach(item => {
          const ageGroup = item.age_group || 'unknown';
          ageGroupCounts[ageGroup] = (ageGroupCounts[ageGroup] || 0) + 1;
        });
        
        const ageChartData = Object.entries(ageGroupCounts).map(([name, value]) => ({ name, value }));
        setAgeGroupDistribution(ageChartData);
      }
      
      // Get UTM source distribution
      const { data: utmData, error: utmError } = await supabase
        .from('quiz_submissions')
        .select('utm_source')
        .not('utm_source', 'is', null);
      
      if (utmError) throw utmError;
      if (utmData.length > 0) {
        const utmCounts: Record<string, number> = {};
        utmData.forEach(item => {
          const source = item.utm_source || 'direct';
          utmCounts[source] = (utmCounts[source] || 0) + 1;
        });
        
        const utmChartData = Object.entries(utmCounts).map(([name, value]) => ({ name, value }));
        setUtmSourceDistribution(utmChartData);
      }
      
      // Get recent submissions
      const { data: recentData, error: recentError } = await supabase
        .from('quiz_submissions')
        .select('email, created_at, gender, age_group, current_weight, target_weight')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (recentError) throw recentError;
      setRecentSubmissions(recentData || []);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    setAdminAuthenticated(false);
    navigate('/admin');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Dashboard...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
      
      <Tabs defaultValue="quiz_data">
        <TabsList className="mb-8 w-full justify-start">
          <TabsTrigger value="quiz_data" className="flex-1">Quiz Data KPIs</TabsTrigger>
          <TabsTrigger value="user_behavior" className="flex-1">User Behavior</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quiz_data" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissionsCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Metabolic Age</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgMetabolicAge} years</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Email Submission Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissionRate}%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgSessionTime} minutes</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {genderDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Age Group Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={ageGroupDistribution}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>UTM Source Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={utmSourceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {utmSourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[300px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Weight Goal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentSubmissions.map((submission, index) => (
                        <TableRow key={index}>
                          <TableCell>{submission.email}</TableCell>
                          <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{submission.current_weight} → {submission.target_weight} lbs</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="user_behavior" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissionsCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissionRate}%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgSessionTime} min</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{100 - submissionRate}%</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* This would be a more detailed table or chart showing session data */}
              <p className="text-muted-foreground">
                This tab provides detailed analytics about user behavior, session duration, and conversion paths.
                Additional metrics and visualizations can be added based on specific requirements.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
