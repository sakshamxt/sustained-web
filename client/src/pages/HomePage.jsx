// src/pages/HomePage.jsx
import React from 'react';
import LearnerOfTheWeekCard from '@/components/insights/LearnerOfTheWeekCard'; // Import the component

const HomePage = () => {
  return (
    <div className="py-8 space-y-10 text-center">
      <div>
        <h1 className="mb-4 text-4xl font-bold text-primary">Welcome to the SDG Learning Platform</h1>
        <p className="text-lg text-muted-foreground">Discover and learn about the Sustainable Development Goals.</p>
      </div>

      {/* Add the Learner of the Week component here */}
      <div className="flex justify-center">
        <LearnerOfTheWeekCard />
      </div>

      {/* You can add more sections to your homepage later */}
      {/* <section className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold text-primary">Featured SDGs</h2>
        {/* Placeholder for featured SDGs list *}
      </section> */}
    </div>
  );
};

export default HomePage;