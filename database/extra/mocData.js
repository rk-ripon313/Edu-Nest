export const mockBooks = [
  {
    _id: "64aa001e9705487c69b2be01",
    title: "Advanced Mathematics for HSC",
    thumbnail:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=870&auto=format&fit=crop",
    price: 250,
    category: {
      label: "HSC",
      group: "Science",
      subject: "Higher Mathematics",
      part: "1st",
    },
    educator: {
      firstName: "Fatima",
      lastName: "Begum",
    },
    totalEnrollments: 12,
    averageRating: 4.8,
    totalRatings: 9,
  },
  {
    _id: "64aa001e9705487c69b2be02",
    title: "Physics First Paper",
    thumbnail:
      "https://images.unsplash.com/photo-1555530477-7e7b7e82781e?q=80&w=870",
    price: 180,
    category: {
      label: "HSC",
      group: "Science",
      subject: "Physics",
      part: "1st",
    },
    educator: {
      firstName: "Rahim",
      lastName: "Uddin",
    },
    totalEnrollments: 24,
    averageRating: 4.5,
    totalRatings: 18,
  },
  {
    _id: "64aa001e9705487c69b2be03",
    title: "English Grammar for SSC",
    thumbnail:
      "https://images.unsplash.com/photo-1588776814546-ec7b59cde79c?q=80&w=870",
    price: 120,
    category: {
      label: "SSC",
      group: "Arts",
      subject: "English",
      part: "1st",
    },
    educator: {
      firstName: "Karim",
      lastName: "Ahmed",
    },
    totalEnrollments: 8,
    averageRating: 4.2,
    totalRatings: 7,
  },
  {
    _id: "64aa001e9705487c69b2be04",
    title: "ICT for Beginners",
    thumbnail:
      "https://images.unsplash.com/photo-1581091012184-df4c6d0e819b?q=80&w=870",
    price: 100,
    category: {
      label: "HSC",
      group: "Commerce",
      subject: "ICT",
      part: "1st",
    },
    educator: {
      firstName: "Lamia",
      lastName: "Noor",
    },
    totalEnrollments: 6,
    averageRating: 4.9,
    totalRatings: 10,
  },
  {
    _id: "64aa001e9705487c69b2be05",
    title: "Chemistry Part 2",
    thumbnail:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=870",
    price: 200,
    category: {
      label: "HSC",
      group: "Science",
      subject: "Chemistry",
      part: "2nd",
    },
    educator: {
      firstName: "Shahid",
      lastName: "Hasan",
    },
    totalEnrollments: 18,
    averageRating: 4.4,
    totalRatings: 11,
  },
  {
    _id: "64aa001e9705487c69b2be06",
    title: "Accounting Basics",
    thumbnail:
      "https://images.unsplash.com/photo-1526304640581-84d174abda41?q=80&w=870",
    price: 160,
    category: {
      label: "SSC",
      group: "Commerce",
      subject: "Accounting",
      part: "1st",
    },
    educator: {
      firstName: "Jamal",
      lastName: "Khan",
    },
    totalEnrollments: 20,
    averageRating: 4.6,
    totalRatings: 15,
  },
];

export const mockStudySeries = [
  {
    _id: "64aa001e9705487c69b2be01",
    title: "Advanced Mathematics Complete Course",
    slug: "advanced-math-course",
    description: "Master all concepts of advanced mathematics for HSC level",
    thumbnail:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=870&auto=format&fit=crop",
    educator: {
      name: "Dr. Fatima Begum",
      _id: "64aa001e9705487c69b2be11",
    },
    level: "HSC",
    group: "Science",
    subject: "Higher Mathematics",
    chapters: ["64aa001e9705487c69b2be21", "64aa001e9705487c69b2be22"],
    outComes: [
      "Master calculus concepts",
      "Solve complex algebra problems",
      "Understand trigonometry applications",
      "Develop problem-solving skills",
    ],
    tags: ["math", "hsc", "science"],
    price: 500,
    isPublished: true,
  },
  {
    _id: "64aa001e9705487c69b2be02",
    title: "Physics Crash Course",
    slug: "physics-crash-course",
    description: "Quick revision of all physics concepts before exams",
    thumbnail:
      "https://images.unsplash.com/photo-1555530477-7e7b7e82781e?q=80&w=870",
    educator: {
      name: "Prof. Rahim Uddin",
      _id: "64aa001e9705487c69b2be12",
    },
    level: "SSC",
    group: "Science",
    subject: "Physics",
    chapters: ["64aa001e9705487c69b2be23"],
    outComes: [
      "Understand fundamental physics laws",
      "Solve numerical problems",
      "Prepare for practical exams",
    ],
    tags: ["physics", "ssc", "science"],
    price: 0,
    isPublished: true,
  },
  {
    _id: "64aa001e9705487c69b2be03",
    title: "English Grammar Mastery",
    slug: "english-grammar-mastery",
    description: "Complete guide to English grammar rules and applications",
    thumbnail:
      "https://images.unsplash.com/photo-1588776814546-ec7b59cde79c?q=80&w=870",
    educator: {
      name: "Karim Ahmed",
      _id: "64aa001e9705487c69b2be13",
    },
    level: "All Levels",
    group: "Arts",
    subject: "English",
    chapters: [
      "64aa001e9705487c69b2be24",
      "64aa001e9705487c69b2be25",
      "64aa001e9705487c69b2be26",
    ],
    outComes: [
      "Improve writing skills",
      "Master grammar rules",
      "Enhance communication abilities",
    ],
    tags: ["english", "grammar", "arts"],
    price: 300,
    isPublished: true,
  },
];
