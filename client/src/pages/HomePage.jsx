// src/pages/HomePage.jsx - FIXED

import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Bot, Star, CheckCircle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import home1 from '/images/home1.png';
import home2 from '/images/home2.png';
import home3 from '/images/home3.png';
import home4 from '/images/home4.png';

const HomePage = () => {
  return (
    <div className="space-y-20 md:space-y-32">

      {/* 1. Split-Screen Hero Section */}
      <section className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="space-y-6 text-center lg:text-left animate-fade-in-up">
              <p className="font-semibold text-primary">FOR A BETTER WORLD</p>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                The Platform for Sustainable Learning
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                SustainED makes learning about the UN Sustainable Development Goals simple, engaging, and rewarding. Start your journey today.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="text-lg py-7 px-8">
                  <Link to="/sdgs">Explore Goals <ArrowRight className="w-5 h-5 ml-2" /></Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center animate-fade-in-up animation-delay-300">
              <img src={home1} alt="Illustration of sustainable learning" className="w-full max-w-md lg:max-w-none"/>
            </div>
        </div>
      </section>

      {/* 2. "Why SustainED?" Section (The Problem) */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground">Learning About Global Goals is Hard.</h2>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-muted-foreground">
              Information is scattered, content is often dry and academic, and there's little motivation to stay engaged. We knew there had to be a better way.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
              <Card className="p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-primary"/>
                <h3 className="text-xl font-bold mt-4">All-in-One Place</h3>
                <p className="text-muted-foreground mt-2">No more hunting for information. All 17 goals, beautifully organized in one platform.</p>
              </Card>
              <Card className="p-8 text-center">
                <Bot className="w-12 h-12 mx-auto text-primary"/>
                <h3 className="text-xl font-bold mt-4">Made for Engagement</h3>
                <p className="text-muted-foreground mt-2">We turn passive reading into active learning with an AI companion to guide you.</p>
              </Card>
              <Card className="p-8 text-center">
                <Star className="w-12 h-12 mx-auto text-primary"/>
                <h3 className="text-xl font-bold mt-4">Built-in Motivation</h3>
                <p className="text-muted-foreground mt-2">Our reward system keeps you engaged and recognizes your commitment to learning.</p>
              </Card>
            </div>
        </div>
      </section>

      {/* 3. "Our Solution" Section (Features) */}
      <section className="container mx-auto text-center">
        {/* UPDATED: Replaced text-slate-xxx with theme-aware colors */}
        <h2 className="text-3xl font-bold text-foreground">A Platform Built for You</h2>
        <p className="max-w-2xl mx-auto mt-2 text-lg text-muted-foreground">We've designed SustainED with three core pillars to make your learning journey effective and fun.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="p-8 text-center"><BookOpen className="w-12 h-12 mx-auto text-primary"/><h3 className="text-xl font-bold mt-4">Guided Learning</h3><p className="text-muted-foreground mt-2">Simple, clear lessons and activities for all 17 SDGs, taking you from beginner to expert.</p></Card>
          <Card className="p-8 text-center"><Bot className="w-12 h-12 mx-auto text-primary"/><h3 className="text-xl font-bold mt-4">AI Companion</h3><p className="text-muted-foreground mt-2">Your personal AI tutor is available 24/7 to explain complex topics in simple, conversational terms.</p></Card>
          <Card className="p-8 text-center"><Star className="w-12 h-12 mx-auto text-primary"/><h3 className="text-xl font-bold mt-4">Reward System</h3><p className="text-muted-foreground mt-2">Earn points and build streaks for your efforts, and redeem them for real-world rewards.</p></Card>
        </div>
      </section>

      {/* 4. Feature Showcase Section */}
      <section className="container mx-auto space-y-20">
        {/* Feature 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
                <Badge>Your AI Companion</Badge>
                {/* UPDATED: Replaced text-slate-xxx with theme-aware colors */}
                <h2 className="text-3xl font-bold text-foreground mt-2">Never Learn Alone</h2>
                <p className="mt-4 text-lg text-muted-foreground">Confused about a topic? Your personal AI tutor is available 24/7 to explain complex ideas in simple, conversational terms, ensuring you never get stuck.</p>
            </div>
            {/* UPDATED: Replaced bg-slate-50 with bg-secondary */}
            <div className="p-8 bg-secondary rounded-lg">
                <img src={home3} alt="Mockup of the AI tutor chat interface" className="rounded-md"/>
            </div>
        </div>
         {/* Feature 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* UPDATED: Replaced bg-slate-50 with bg-secondary */}
            <div className="p-8 bg-secondary rounded-lg lg:order-last">
                 <img src={home4} alt="Mockup of the gamified rewards system" className="rounded-md"/>
            </div>
             <div className="lg:order-first">
                <Badge>Reward System</Badge>
                {/* UPDATED: Replaced text-slate-xxx with theme-aware colors */}
                <h2 className="text-3xl font-bold text-foreground mt-2">Stay Motivated</h2>
                <p className="mt-4 text-lg text-muted-foreground">Our platform turns learning into a game. Earn points for every lesson, build your daily streak, and watch your progress grow.</p>
            </div>
              
        </div>
      </section>

      {/* 5. Final Call to Action */}
      <section className="container mx-auto">
        {/* UPDATED: A cleaner, more consistent design */}
        <div className="p-12 text-center bg-secondary rounded-lg border">
             <h2 className="text-3xl font-bold text-foreground">Ready to Start Your Journey?</h2>
             <p className="max-w-2xl mx-auto mt-2 text-lg text-muted-foreground">
               Join thousands of learners who are making a difference. Explore the goals today and see how you can be a part of the solution.
             </p>
             <Button asChild size="lg" className="mt-6 text-lg py-7 px-8">
                <Link to="/sdgs">
                    Get Started for Free
                </Link>
            </Button>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
