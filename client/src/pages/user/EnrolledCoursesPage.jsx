// src/pages/user/EnrolledCoursesPage.jsx - NEW FILE

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import apiClient from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const EnrolledCoursesPage = () => {
  const { user } = useAuthStore();
  const [allSdgs, setAllSdgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllSdgs = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await apiClient.get('/sdgs');
        const sdgData = response.data?.sdgs || response.data || [];
        if (Array.isArray(sdgData)) {
          setAllSdgs(sdgData);
        }
      } catch (error) {
        console.error("Could not fetch SDG list for enrolled courses", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllSdgs();
  }, [user]);

  const enrolledCourses = useMemo(() => {
    if (!user?.enrolledCourses || allSdgs.length === 0) return [];
    return user.enrolledCourses.map(courseId => {
      const sdgDetail = allSdgs.find(s => s._id === courseId);
      const progress = user.progressBySdg?.[courseId]?.progressPercentage || 0;
      return { ...sdgDetail, progress };
    }).filter(course => course._id);
  }, [user, allSdgs]);

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="container py-8 mx-auto">
      <header className="py-12 mb-12 text-center border-b">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          My Enrolled Courses
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-600">
          Continue your learning journey and track your progress towards a better world.
        </p>
      </header>
      
      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((course, index) => (
            <div 
              key={course._id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
            >
              <Link to={`/sdgs/${course.sdgNumber}`} className="block h-full">
                <Card className="flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  {course.imageUrl && (
                     <CardHeader className="p-0">
                       <img src={course.imageUrl} alt={course.title} className="rounded-t-lg aspect-video object-cover" />
                     </CardHeader>
                  )}
                  <CardContent className="flex flex-col flex-grow p-6">
                    <CardTitle className="flex-grow">{course.sdgNumber}. {course.title}</CardTitle>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-sm mb-1">
                        <p className="text-slate-600">Progress</p>
                        <p className="font-semibold text-primary">{Math.round(course.progress)}%</p>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500 rounded-lg bg-slate-50 border">
          <h3 className="text-2xl font-semibold">You're Not Enrolled in Any Courses Yet</h3>
          <p className="mt-2 mb-6">Start your journey by exploring the 17 goals.</p>
          <Button asChild><Link to="/sdgs">Explore Courses</Link></Button>
        </div>
      )}
    </div>
  );
};

export default EnrolledCoursesPage;