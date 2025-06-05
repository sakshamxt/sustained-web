// src/pages/sdg/SdgListPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import SdgCard from '@/components/sdg/SdgCard';
import LoadingSpinner from '@/components/common/LoadingSpinner'; // Or use Skeleton
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
// For Skeleton loading (optional)
// import { Skeleton } from "@/components/ui/skeleton";

// const SdgCardSkeleton = () => (
//   <div className="flex flex-col space-y-3">
//     <Skeleton className="h-[192px] w-full rounded-xl" /> {/* Image area: h-48 */}
//     <div className="p-2 space-y-2">
//       <Skeleton className="w-3/4 h-4" />
//       <Skeleton className="w-1/2 h-4" />
//       <Skeleton className="w-full h-8 mt-2" /> {/* Button area */}
//     </div>
//   </div>
// );


const SdgListPage = () => {
  const [sdgs, setSdgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSdgs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/sdgs');
        setSdgs(response.data.sdgs || response.data || []); // Adjust based on API response structure
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch SDGs.');
        console.error("Fetch SDGs error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSdgs();
  }, []);

  if (isLoading) {
    // return <LoadingSpinner size="lg" />;
    // Or using Skeletons for a better UX:
    return (
      <div className="container py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center text-primary">Our SDG Courses</h1>
         {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
           {[...Array(6)].map((_, i) => <SdgCardSkeleton key={i} />)}
         </div> */}
         <LoadingSpinner size="lg" /> {/* Simpler loading state */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 mx-auto text-center">
         <Alert variant="destructive" className="max-w-lg mx-auto">
          <Terminal className="w-4 h-4" />
          <AlertTitle>Error Fetching SDGs</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (sdgs.length === 0) {
    return <div className="py-10 text-center text-muted-foreground">No SDG courses available at the moment.</div>;
  }

  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-10 text-3xl font-bold tracking-tight text-center text-primary">
        Explore the Sustainable Development Goals
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8">
        {sdgs.map(sdg => (
          <SdgCard key={sdg._id || sdg.sdgNumber} sdg={sdg} />
        ))}
      </div>
    </div>
  );
};

export default SdgListPage;