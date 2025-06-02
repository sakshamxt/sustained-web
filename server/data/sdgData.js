// server/data/sampleSDGs.js

const sdgs = [
  // SDG 1: No Poverty
  {
    sdgNumber: 1,
    title: "No Poverty",
    shortDescription: "End poverty in all its forms everywhere.",
    whatYouWillLearn: [
      "Understand the multifaceted nature of poverty.",
      "Analyze strategies and policies for poverty reduction.",
      "Explore global and local poverty challenges and solutions."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+1`,
    fullDescription: "Globally, the number of people living in extreme poverty declined by more than half between 1990 and 2015. Still, about 736 million people lived on less than US$1.90 a day in 2015. This SDG aims to eradicate extreme poverty for all people everywhere and to reduce at least by half the proportion of men, women, and children of all ages living in poverty in all its dimensions according to national definitions.",
    presentations: [
      { title: "Understanding Global Poverty", urlOrContent: "placeholder_url/content_sdg1_pres1" },
      { title: "Poverty Reduction Strategies", urlOrContent: "placeholder_url/content_sdg1_pres2" }
    ],
    lessons: [
      { title: "Defining and Measuring Poverty", content: "Detailed text on poverty metrics and definitions...", type: "text" },
      { title: "Case Study: Successful Poverty Alleviation", content: "Video_url_or_text_content", type: "video_case_study" }
    ],
    practicalActivities: [
      { title: "Research Local Poverty Initiatives", description: "Identify and report on organizations tackling poverty in your community.", submissionType: "report" },
      { title: "Debate: Universal Basic Income", description: "Prepare arguments for or against UBI as a poverty solution.", submissionType: "debate_notes" }
    ]
  },
  // SDG 2: Zero Hunger
  {
    sdgNumber: 2,
    title: "Zero Hunger",
    shortDescription: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture.",
    whatYouWillLearn: [
      "Identify the causes and consequences of hunger and malnutrition.",
      "Learn about sustainable agricultural practices for food security.",
      "Analyze global efforts to achieve zero hunger."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+2`,
    fullDescription: "After decades of steady decline, the number of people who suffer from hunger – as measured by the prevalence of undernourishment – began to slowly increase again in 2015. Current estimates show that nearly 690 million people are hungry, or 8.9 percent of the world population. This SDG aims to end hunger and ensure access by all people, in particular the poor and people in vulnerable situations, including infants, to safe, nutritious and sufficient food all year round.",
    presentations: [
      { title: "The Global Food Crisis", urlOrContent: "placeholder_url/content_sdg2_pres1" },
      { title: "Sustainable Agriculture Explained", urlOrContent: "placeholder_url/content_sdg2_pres2" }
    ],
    lessons: [
      { title: "Understanding Malnutrition", content: "Text content on different forms of malnutrition and their impacts...", type: "text" },
      { title: "Innovation in Farming", content: "Exploring new technologies in sustainable agriculture...", type: "text_with_images" }
    ],
    practicalActivities: [
      { title: "Plan a Balanced Meal on a Budget", description: "Design a weekly meal plan that is nutritious and affordable for a low-income family.", submissionType: "meal_plan" },
      { title: "Investigate Food Waste", description: "Track your household food waste for a week and suggest reduction strategies.", submissionType: "report_and_plan" }
    ]
  },
  // SDG 3: Good Health and Well-being
  {
    sdgNumber: 3,
    title: "Good Health and Well-being",
    shortDescription: "Ensure healthy lives and promote well-being for all at all ages.",
    whatYouWillLearn: [
      "Understand key global health challenges and determinants of health.",
      "Learn about strategies for disease prevention and health promotion.",
      "Explore the importance of mental health and well-being."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+3`,
    fullDescription: "Ensuring healthy lives and promoting well-being at all ages is essential to sustainable development. Significant strides have been made in increasing life expectancy and reducing some of the common killers associated with child and maternal mortality. However, more efforts are needed to fully eradicate a wide range of diseases and address many different persistent and emerging health issues.",
    presentations: [
      { title: "Global Health Issues Overview", urlOrContent: "placeholder_url/content_sdg3_pres1" },
      { title: "The Importance of Vaccinations", urlOrContent: "placeholder_url/content_sdg3_pres2" }
    ],
    lessons: [
      { title: "Understanding Communicable Diseases", content: "Text about common infectious diseases and prevention...", type: "text" },
      { title: "Mental Health Awareness", content: "An introduction to mental health, stigma, and support systems...", type: "text_and_video" }
    ],
    practicalActivities: [
      { title: "Design a Health Promotion Campaign", description: "Develop a campaign concept for a local health issue (e.g., hygiene, exercise).", submissionType: "campaign_proposal" },
      { title: "Track Your Physical Activity", description: "Monitor your physical activity for a week and reflect on its impact on your well-being.", submissionType: "activity_log_reflection" }
    ]
  },
  // SDG 4: Quality Education
  {
    sdgNumber: 4,
    title: "Quality Education",
    shortDescription: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.",
    whatYouWillLearn: [
      "Understand the importance of inclusive and equitable education.",
      "Learn about challenges and innovations in global education.",
      "Explore the concept of lifelong learning and its benefits."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+4`,
    fullDescription: "Education enables upward socioeconomic mobility and is a key to escaping poverty. Over the past decade, major progress was made towards increasing access to education and school enrollment rates at all levels, particularly for girls. Nevertheless, about 260 million children were still out of school in 2018 — nearly one fifth of the global population in that age group. This SDG aims to ensure that all girls and boys complete free, equitable and quality primary and secondary education leading to relevant and effective learning outcomes.",
    presentations: [
      { title: "Barriers to Education Worldwide", urlOrContent: "placeholder_url/content_sdg4_pres1" },
      { title: "The Future of Learning Technologies", urlOrContent: "placeholder_url/content_sdg4_pres2" }
    ],
    lessons: [
      { title: "Inclusive Education Practices", content: "Strategies for creating inclusive learning environments...", type: "text" },
      { title: "The Role of EdTech", content: "Exploring how technology is shaping education...", type: "interactive_module_link" }
    ],
    practicalActivities: [
      { title: "Tutor or Mentor a Younger Student", description: "Volunteer to help a student with their studies.", submissionType: "activity_report" },
      { title: "Research a Global Education Initiative", description: "Investigate and present on an organization working to improve education access.", submissionType: "presentation_slides" }
    ]
  },
  // SDG 5: Gender Equality
  {
    sdgNumber: 5,
    title: "Gender Equality",
    shortDescription: "Achieve gender equality and empower all women and girls.",
    whatYouWillLearn: [
      "Understand the concepts of gender, gender equality, and gender-based discrimination.",
      "Learn about the challenges women and girls face globally.",
      "Explore strategies to promote gender equality and women's empowerment."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+5`,
    fullDescription: "Gender equality is not only a fundamental human right, but a necessary foundation for a peaceful, prosperous and sustainable world. Providing women and girls with equal access to education, health care, decent work, and representation in political and economic decision-making processes will fuel sustainable economies and benefit societies and humanity at large.",
    presentations: [
      { title: "Understanding Gender Bias", urlOrContent: "placeholder_url/content_sdg5_pres1" },
      { title: "Women in Leadership", urlOrContent: "placeholder_url/content_sdg5_pres2" }
    ],
    lessons: [
      { title: "The History of Women's Rights", content: "Key milestones in the fight for gender equality...", type: "timeline_text" },
      { title: "Challenging Gender Stereotypes", content: "Discussion on identifying and challenging stereotypes...", type: "interactive_discussion_guide" }
    ],
    practicalActivities: [
      { title: "Interview an Inspiring Woman", description: "Conduct an interview with a woman leader or role model in your community or field of interest.", submissionType: "interview_summary" },
      { title: "Analyze Media for Gender Representation", description: "Critically examine how genders are portrayed in a chosen piece of media (movie, ad, news).", submissionType: "media_analysis_report" }
    ]
  },
  // SDG 6: Clean Water and Sanitation
  {
    sdgNumber: 6,
    title: "Clean Water and Sanitation",
    shortDescription: "Ensure availability and sustainable management of water and sanitation for all.",
    whatYouWillLearn: [
      "Understand the global water crisis and its impact.",
      "Learn about water conservation and sustainable water management practices.",
      "Explore the importance of sanitation and hygiene (WASH)."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+6`,
    fullDescription: "Access to safe water, sanitation and hygiene is the most basic human need for health and well-being. Billions of people will lack access to these basic services in 2030 unless progress quadruples. Demand for water is rising owing to rapid population growth, urbanization and increasing water needs from agriculture, industry, and energy sectors.",
    presentations: [
      { title: "The World's Water Resources", urlOrContent: "placeholder_url/content_sdg6_pres1" },
      { title: "Water, Sanitation, and Hygiene (WASH) Link", urlOrContent: "placeholder_url/content_sdg6_pres2" }
    ],
    lessons: [
      { title: "The Water Cycle and Human Impact", content: "Understanding how human activities affect water resources...", type: "text_diagrams" },
      { title: "Water Purification Techniques", content: "Overview of different methods for making water safe...", type: "text_video_demos" }
    ],
    practicalActivities: [
      { title: "Calculate Your Water Footprint", description: "Use an online tool to calculate your personal or household water footprint and identify ways to reduce it.", submissionType: "footprint_report_action_plan" },
      { title: "Design a Rainwater Harvesting System", description: "Sketch a basic design for a rainwater harvesting system for a home or community building.", submissionType: "design_sketch_explanation" }
    ]
  },
  // SDG 7: Affordable and Clean Energy
  {
    sdgNumber: 7,
    title: "Affordable and Clean Energy",
    shortDescription: "Ensure access to affordable, reliable, sustainable and modern energy for all.",
    whatYouWillLearn: [
      "Understand the global energy landscape and challenges.",
      "Learn about various renewable energy sources and technologies.",
      "Explore the importance of energy efficiency and conservation."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+7`,
    fullDescription: "Access to affordable, reliable, sustainable and modern energy is a cornerstone of development. Yet, 759 million people lack access to electricity, and one-third of the world’s population relies on dangerous and inefficient cooking systems. This SDG aims to ensure universal access to affordable, reliable and modern energy services, increase substantially the share of renewable energy in the global energy mix, and double the global rate of improvement in energy efficiency.",
    presentations: [
      { title: "Introduction to Renewable Energy Sources", urlOrContent: "placeholder_url/content_sdg7_pres1" },
      { title: "The Future of Energy Grids", urlOrContent: "placeholder_url/content_sdg7_pres2" }
    ],
    lessons: [
      { title: "Solar Power Fundamentals", content: "How solar panels work and their applications...", type: "text_animation" },
      { title: "Energy Conservation at Home", content: "Practical tips for reducing energy consumption...", type: "checklist_guide" }
    ],
    practicalActivities: [
      { title: "Home Energy Audit", description: "Conduct a simple energy audit of your home and identify areas for improvement.", submissionType: "audit_report" },
      { title: "Research a Renewable Energy Technology", description: "Prepare a short report or presentation on a specific renewable energy technology (e.g., wind, geothermal, tidal).", submissionType: "report_or_slides" }
    ]
  },
  // SDG 8: Decent Work and Economic Growth
  {
    sdgNumber: 8,
    title: "Decent Work and Economic Growth",
    shortDescription: "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.",
    whatYouWillLearn: [
      "Understand the principles of sustainable and inclusive economic growth.",
      "Learn about challenges in the global labor market, including youth employment and informal work.",
      "Explore the concept of 'decent work' and its components."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+8`,
    fullDescription: "Sustained and inclusive economic growth can drive progress, create decent jobs for all and improve living standards. The COVID-19 pandemic has disrupted billions of lives and endangered the global economy. This SDG aims to sustain per capita economic growth in accordance with national circumstances and, in particular, at least 7 per cent gross domestic product growth per annum in the least developed countries.",
    presentations: [
      { title: "Global Economic Trends", urlOrContent: "placeholder_url/content_sdg8_pres1" },
      { title: "The Gig Economy: Pros and Cons", urlOrContent: "placeholder_url/content_sdg8_pres2" }
    ],
    lessons: [
      { title: "Understanding Fair Labor Practices", content: "What constitutes fair wages, safe working conditions, and rights at work...", type: "text_case_studies" },
      { title: "Entrepreneurship and Job Creation", content: "The role of small businesses and startups in economic growth...", type: "text_interviews" }
    ],
    practicalActivities: [
      { title: "Develop a Business Idea", description: "Outline a simple business plan for a small, sustainable enterprise.", submissionType: "business_outline" },
      { title: "Analyze Job Market Trends", description: "Research current job market trends in a chosen industry and report on skills in demand.", submissionType: "report" }
    ]
  },
  // SDG 9: Industry, Innovation and Infrastructure
  {
    sdgNumber: 9,
    title: "Industry, Innovation and Infrastructure",
    shortDescription: "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.",
    whatYouWillLearn: [
      "Understand the role of infrastructure, industry, and innovation in sustainable development.",
      "Learn about challenges and opportunities in developing sustainable infrastructure.",
      "Explore the importance of research, development, and technological innovation."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+9`,
    fullDescription: "Inclusive and sustainable industrialization, together with innovation and infrastructure, can unleash dynamic and competitive economic forces that generate employment and income. They play a key role in introducing and promoting new technologies, facilitating international trade and enabling the efficient use of resources.",
    presentations: [
      { title: "Sustainable Infrastructure Projects", urlOrContent: "placeholder_url/content_sdg9_pres1" },
      { title: "The Fourth Industrial Revolution (Industry 4.0)", urlOrContent: "placeholder_url/content_sdg9_pres2" }
    ],
    lessons: [
      { title: "Innovation for Development", content: "How technological and social innovations can solve development challenges...", type: "text_examples" },
      { title: "Smart Cities: Concept and Technologies", content: "An overview of how technology is shaping urban environments...", type: "text_video_module" }
    ],
    practicalActivities: [
      { title: "Propose an Innovative Solution", description: "Identify a local problem and propose an innovative technological or process-based solution.", submissionType: "proposal" },
      { title: "Map Local Infrastructure", description: "Create a map or report on the state of a specific type of infrastructure (e.g., transport, internet access) in your community.", submissionType: "map_report" }
    ]
  },
  // SDG 10: Reduced Inequalities
  {
    sdgNumber: 10,
    title: "Reduced Inequalities",
    shortDescription: "Reduce inequality within and among countries.",
    whatYouWillLearn: [
      "Understand the different dimensions of inequality (income, gender, age, disability, etc.).",
      "Learn about the causes and consequences of inequality.",
      "Explore policies and actions to reduce inequalities."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+10`,
    fullDescription: "Inequality within and among countries is a persistent cause for concern. While income inequality between countries may have reduced, inequality within countries has risen. There is growing consensus that economic growth is not sufﬁcient to reduce poverty if it is not inclusive and if it does not involve the three dimensions of sustainable development – economic, social and environmental.",
    presentations: [
      { title: "Measuring Inequality: Gini Coefficient and Beyond", urlOrContent: "placeholder_url/content_sdg10_pres1" },
      { title: "Social Justice Movements and Inequality", urlOrContent: "placeholder_url/content_sdg10_pres2" }
    ],
    lessons: [
      { title: "Understanding Systemic Discrimination", content: "How societal structures can perpetuate inequality...", type: "text_case_studies" },
      { title: "Inclusive Policies for Equality", content: "Examples of policies aimed at reducing various forms of inequality...", type: "text_policy_briefs" }
    ],
    practicalActivities: [
      { title: "Identify Local Inequalities", description: "Research and report on a form of inequality present in your community or region.", submissionType: "report" },
      { title: "Advocacy Letter Writing", description: "Write a letter to a local representative advocating for a policy to reduce a specific inequality.", submissionType: "letter" }
    ]
  },
  // SDG 11: Sustainable Cities and Communities
  {
    sdgNumber: 11,
    title: "Sustainable Cities and Communities",
    shortDescription: "Make cities and human settlements inclusive, safe, resilient and sustainable.",
    whatYouWillLearn: [
      "Understand the challenges and opportunities of urbanization.",
      "Learn about principles of sustainable urban planning and design.",
      "Explore ways to make communities more inclusive, safe, and resilient."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+11`,
    fullDescription: "The world is becoming increasingly urbanized. Since 2007, more than half the world’s population has been living in cities, and that share is projected to rise to 60 per cent by 2030. Cities and metropolitan areas are powerhouses of economic growth—contributing about 60 per cent of global GDP. However, they also account for about 70 per cent of global carbon emissions and over 60 per cent of resource use.",
    presentations: [
      { title: "Challenges of Rapid Urbanization", urlOrContent: "placeholder_url/content_sdg11_pres1" },
      { title: "Green Building and Sustainable Design", urlOrContent: "placeholder_url/content_sdg11_pres2" }
    ],
    lessons: [
      { title: "Urban Planning for Sustainability", content: "Key concepts like mixed-use development, public transport, and green spaces...", type: "text_interactive_map" },
      { title: "Community Resilience and Disaster Preparedness", content: "Strategies for making communities able to withstand and recover from shocks...", type: "text_checklist" }
    ],
    practicalActivities: [
      { title: "Assess Your Community's Sustainability", description: "Evaluate your local community against criteria for sustainability (e.g., green spaces, transport, waste management).", submissionType: "assessment_report" },
      { title: "Design a Sustainable Community Feature", description: "Propose a design for a sustainable feature in your community (e.g., a community garden, a bike path, a recycling program).", submissionType: "design_proposal" }
    ]
  },
  // SDG 12: Responsible Consumption and Production
  {
    sdgNumber: 12,
    title: "Responsible Consumption and Production",
    shortDescription: "Ensure sustainable consumption and production patterns.",
    whatYouWillLearn: [
      "Understand the impact of current consumption and production patterns on the environment.",
      "Learn about the principles of a circular economy and sustainable lifestyles.",
      "Explore ways individuals and businesses can promote responsible consumption and production."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+12`,
    fullDescription: "Sustainable consumption and production is about promoting resource and energy efficiency, sustainable infrastructure, and providing access to basic services, green and decent jobs and a better quality of life for all. Its implementation helps to achieve overall development plans, reduce future economic, environmental and social costs, strengthen economic competitiveness and reduce poverty.",
    presentations: [
      { title: "The Problem with Fast Fashion/Electronics", urlOrContent: "placeholder_url/content_sdg12_pres1" },
      { title: "Introduction to Circular Economy", urlOrContent: "placeholder_url/content_sdg12_pres2" }
    ],
    lessons: [
      { title: "Understanding Your Ecological Footprint", content: "How daily choices impact resource use...", type: "text_calculator_link" },
      { title: "Reduce, Reuse, Recycle, Rethink, Refuse", content: "Deep dive into the 5 R's of waste management...", type: "text_practical_tips" }
    ],
    practicalActivities: [
      { title: "Conduct a Waste Audit", description: "Track and categorize your household waste for a week to identify areas for reduction.", submissionType: "audit_report_action_plan" },
      { title: "Upcycling Project", description: "Create a new, useful item from materials that would otherwise be discarded.", submissionType: "project_photo_description" }
    ]
  },
  // SDG 13: Climate Action
  {
    sdgNumber: 13,
    title: "Climate Action",
    shortDescription: "Take urgent action to combat climate change and its impacts.",
    whatYouWillLearn: [
      "Understand the science of climate change, its causes, and impacts.",
      "Learn about international agreements and national policies for climate action.",
      "Explore individual and collective actions to mitigate and adapt to climate change."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+13`,
    fullDescription: "Climate change is now affecting every country on every continent. It is disrupting national economies and affecting lives, costing people, communities and countries dearly today and even more tomorrow. Weather patterns are changing, sea levels are rising, and weather events are becoming more extreme. This SDG acknowledges that the UN Framework Convention on Climate Change is the primary international, intergovernmental forum for negotiating the global response to climate change.",
    presentations: [
      { title: "The Science of Global Warming", urlOrContent: "placeholder_url/content_sdg13_pres1" },
      { title: "Climate Change Adaptation vs. Mitigation", urlOrContent: "placeholder_url/content_sdg13_pres2" }
    ],
    lessons: [
      { title: "Understanding Greenhouse Gases", content: "Sources and impacts of different GHGs...", type: "text_infographic" },
      { title: "Renewable Energy's Role in Climate Action", content: "How transitioning to renewables helps combat climate change...", type: "text_case_studies" }
    ],
    practicalActivities: [
      { title: "Calculate Your Carbon Footprint", description: "Use an online calculator to estimate your carbon footprint and identify ways to reduce it.", submissionType: "footprint_report_action_plan" },
      { title: "Advocate for Climate Policy", description: "Research a local or national climate policy and write a letter to a policymaker or an article for a local newspaper about it.", submissionType: "letter_or_article" }
    ]
  },
  // SDG 14: Life Below Water
  {
    sdgNumber: 14,
    title: "Life Below Water",
    shortDescription: "Conserve and sustainably use the oceans, seas and marine resources for sustainable development.",
    whatYouWillLearn: [
      "Understand the importance of oceans and marine ecosystems.",
      "Learn about threats to marine biodiversity, such as pollution and overfishing.",
      "Explore solutions for ocean conservation and sustainable use of marine resources."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+14`,
    fullDescription: "The world’s oceans – their temperature, chemistry, currents and life – drive global systems that make the Earth habitable for humankind. Our rainwater, drinking water, weather, climate, coastlines, much of our food, and even the oxygen in the air we breathe, are all ultimately provided and regulated by the sea. Careful management of this essential global resource is a key feature of a sustainable future.",
    presentations: [
      { title: "Threats to Marine Ecosystems (Plastic, Overfishing)", urlOrContent: "placeholder_url/content_sdg14_pres1" },
      { title: "Marine Protected Areas (MPAs)", urlOrContent: "placeholder_url/content_sdg14_pres2" }
    ],
    lessons: [
      { title: "Ocean Acidification Explained", content: "Causes and consequences of increasing ocean acidity...", type: "text_animation" },
      { title: "Sustainable Fishing Practices", content: "Methods and policies for ensuring fish stocks for the future...", type: "text_video_clips" }
    ],
    practicalActivities: [
      { title: "Reduce Plastic Consumption", description: "Track your single-use plastic consumption for a week and develop a plan to reduce it significantly.", submissionType: "tracking_sheet_action_plan" },
      { title: "Research a Marine Conservation Organization", description: "Learn about an organization working to protect marine life and present its work.", submissionType: "report_or_presentation" }
    ]
  },
  // SDG 15: Life on Land
  {
    sdgNumber: 15,
    title: "Life on Land",
    shortDescription: "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.",
    whatYouWillLearn: [
      "Understand the importance of terrestrial ecosystems and biodiversity.",
      "Learn about threats such as deforestation, desertification, and biodiversity loss.",
      "Explore strategies for conservation, restoration, and sustainable land management."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+15`,
    fullDescription: "Forests cover nearly 31 per cent of our planet’s land area. From the air we breathe, to the water we drink, to the food we eat–forests sustain us. Terrestrial ecosystems are vital for human well-being and livelihoods, supporting agriculture, forestry, and tourism. This SDG aims to conserve and restore the use of terrestrial ecosystems such as forests, wetlands, drylands and mountains by 2020.",
    presentations: [
      { title: "The Importance of Biodiversity", urlOrContent: "placeholder_url/content_sdg15_pres1" },
      { title: "Deforestation: Causes and Solutions", urlOrContent: "placeholder_url/content_sdg15_pres2" }
    ],
    lessons: [
      { title: "Understanding Ecosystem Services", content: "The benefits humans derive from healthy ecosystems...", type: "text_examples" },
      { title: "Reforestation and Afforestation Efforts", content: "Case studies of successful land restoration projects...", type: "text_image_gallery" }
    ],
    practicalActivities: [
      { title: "Identify Local Flora and Fauna", description: "Go on a nature walk (if safe and possible) or use online resources to identify and learn about 5 local plant and 5 local animal species.", submissionType: "species_list_descriptions" },
      { title: "Plant a Tree or Start a Small Garden", description: "Participate in a tree-planting initiative or start a small garden (even indoors). Document your experience.", submissionType: "photo_journal_entry" }
    ]
  },
  // SDG 16: Peace, Justice and Strong Institutions
  {
    sdgNumber: 16,
    title: "Peace, Justice and Strong Institutions",
    shortDescription: "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.",
    whatYouWillLearn: [
      "Understand the links between peace, justice, human rights, and sustainable development.",
      "Learn about challenges to peace, such as conflict, violence, and corruption.",
      "Explore the role of effective, accountable, and inclusive institutions."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+16`,
    fullDescription: "Peaceful, just and inclusive societies are necessary to achieve the Sustainable Development Goals (SDGs). People everywhere need to be free of fear from all forms of violence and feel safe as they go about their lives whatever their ethnicity, faith or sexual orientation. High levels of armed violence and insecurity have a destructive impact on a country’s development, affecting economic growth and often resulting in long standing grievances among communities.",
    presentations: [
      { title: "Understanding Human Rights", urlOrContent: "placeholder_url/content_sdg16_pres1" },
      { title: "The Role of Good Governance", urlOrContent: "placeholder_url/content_sdg16_pres2" }
    ],
    lessons: [
      { title: "Conflict Resolution and Peacebuilding", content: "Introduction to methods and strategies for resolving conflicts peacefully...", type: "text_scenarios" },
      { title: "Access to Justice", content: "Challenges and solutions for ensuring everyone has access to fair legal systems...", type: "text_case_studies" }
    ],
    practicalActivities: [
      { title: "Research a Human Rights Issue", description: "Investigate a current human rights issue and summarize its key aspects and ongoing efforts to address it.", submissionType: "summary_report" },
      { title: "Learn About Your Local Governance", description: "Identify your local government representatives and their roles, or attend (or watch a recording of) a local council meeting.", submissionType: "report_reflection" }
    ]
  },
  // SDG 17: Partnerships for the Goals
  {
    sdgNumber: 17,
    title: "Partnerships for the Goals",
    shortDescription: "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development.",
    whatYouWillLearn: [
      "Understand the importance of global partnerships and cooperation for achieving the SDGs.",
      "Learn about the different actors involved (governments, civil society, private sector, academia).",
      "Explore how finance, technology, capacity-building, and trade contribute to the SDGs."
    ],
    imageUrl: `https://placehold.co/600x400?text=SDG+17`,
    fullDescription: "The SDGs can only be realized with strong global partnerships and cooperation. A successful sustainable development agenda requires partnerships between governments, the private sector and civil society. These inclusive partnerships built upon a shared vision and shared goals that place people and the planet at the centre, are needed at the global, regional, national and local level.",
    presentations: [
      { title: "The Role of Multi-Stakeholder Partnerships", urlOrContent: "placeholder_url/content_sdg17_pres1" },
      { title: "Financing for Sustainable Development", urlOrContent: "placeholder_url/content_sdg17_pres2" }
    ],
    lessons: [
      { title: "How International Cooperation Works", content: "Examples of successful global partnerships for development...", type: "text_case_studies" },
      { title: "The Role of Technology Transfer and Capacity Building", content: "Sharing knowledge and skills across borders for sustainable development...", type: "text_examples" }
    ],
    practicalActivities: [
      { title: "Identify a Local Partnership for an SDG", description: "Research and report on a local example of different organizations working together to address one of the SDGs.", submissionType: "report" },
      { title: "Propose a Partnership Idea", description: "Think of a local issue related to an SDG and propose a potential partnership between two or more different types of organizations to tackle it.", submissionType: "proposal_outline" }
    ]
  }
];

export default sdgs;