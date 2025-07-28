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

export const mockBook = {
  _id: "64aa001e9705487c69b2be03",
  title: "Advanced Higher Mathematics for HSC",
  slug: "advanced-higher-mathematics-hsc",
  thumbnail:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  description: `
    This comprehensive book is designed for HSC Science students and covers 
    a wide range of advanced mathematical topics such as differential calculus, 
    integral calculus, trigonometry, vectors, and coordinate geometry. The book 
    follows the national curriculum and is ideal for students preparing for board 
    exams and university admission tests.
  `,
  fileUrl: "https://example.com/advanced-math-hsc.pdf",
  outComes: [
    "Gain a deep understanding of calculus and trigonometry",
    "Apply mathematical concepts in real-world problem solving",
    "Build a strong foundation for university admission exams",
    "Practice with hundreds of solved and unsolved problems",
  ],
  tags: [
    "Mathematics",
    "HSC",
    "Science",
    "Admission",
    "1st Paper",
    "Higher Math",
  ],
  price: 299,
  isPublished: true,
  createdAt: "2024-07-01T10:00:00Z",
  updatedAt: "2024-07-25T14:30:00Z",
  enrollCount: 1520,
  rating: {
    average: 3.85,
    count: 235,
  },
  category: {
    _id: "687d3b4977b38ed5dbb793d8",
    title: "HSC Science Mathematics",
    slug: "hsc-science-mathematics",
    label: "HSC",
    group: "Science",
    subject: "Higher Mathematics",
    part: "1st",
    thumbnail:
      "https://plus.unsplash.com/premium_photo-1673969849375-6ab20a2b25ae?auto=format&fit=crop&w=600&q=80",
  },
  educator: {
    _id: "64a23d3214312f1d2342e111",
    firstName: "Dr. Ripon",
    lastName: "Khan",
    image: "https://lh3.googleusercontent.com/a-/AOh14GjHn0a3G5OtM0B7zGdL43",
    role: "educator",
    email: "ripon.khan@example.com",
    userName: "rk-ripon-rkr9",
    educatorProfile: {
      bio: `
        Dr. Ripon Khan is a passionate mathematics educator and author with over 
        10 years of experience teaching at the HSC and university levels. He is 
        known for simplifying complex concepts with real-life examples. He has 
        authored 5 best-selling academic books and runs an online learning platform 
        for HSC students.
      `,
      expertise: ["Mathematics", "Physics", "Admission Prep"],
      qualification: "PhD in Applied Mathematics, DU",
      socialLinks: {
        facebook: "https://facebook.com/dr.riponkhan",
        linkedin: "https://linkedin.com/in/drriponkhan",
        website: "https://drmathacademy.com",
      },
      isVerified: true,
    },
  },
};

export const mockReviews = [
  {
    _id: "1",
    rating: 5,
    comment: "চমৎকার বই! সহজ ভাষায় ব্যাখ্যা করা হয়েছে।",
    createdAt: new Date("2024-10-12"),
    student: {
      firstName: "Arman",
      lastName: "Hossain",
      userName: "arman123",
      image: "https://res.cloudinary.com/demo/image/upload/men1.jpg",
    },
  },
  {
    _id: "2",
    rating: 4,
    comment: "প্রশ্নগুলোর ব্যাখ্যা ভালো ছিল, কিন্তু আরও উদাহরণ থাকলে ভালো হতো।",
    createdAt: new Date("2024-11-18"),
    student: {
      firstName: "Sadia",
      lastName: "Rahman",
      userName: "sadia_r",
      image: "https://res.cloudinary.com/demo/image/upload/women1.jpg",
    },
  },
  {
    _id: "3",
    rating: 3,
    comment: "গড় মানের বই। কিছু অধ্যায় একটু জটিল মনে হয়েছে।",
    createdAt: new Date("2024-12-22"),
    student: {
      firstName: "Nayeem",
      lastName: "Islam",
      userName: "nayeem99",
      image: "https://images.unsplash.com/photo-1502767089025-6572583495b0",
    },
  },
  {
    _id: "4",
    rating: 5,
    comment: "একদম পরিক্ষার উপযোগী। highly recommend করব।",
    createdAt: new Date("2025-01-05"),
    student: {
      firstName: "Tasnim",
      lastName: "Akter",
      userName: "tasnim_akter",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    },
  },
  {
    _id: "5",
    rating: 2,
    comment: "আশা অনুযায়ী পাইনি। কিছু বিষয় আরও স্পষ্ট করা দরকার।",
    createdAt: new Date("2025-01-15"),
    student: {
      firstName: "Fahim",
      lastName: "Ahmed",
      userName: "fahimdev",
      image: "https://res.cloudinary.com/demo/image/upload/men2.jpg",
    },
  },
  {
    _id: "6",
    rating: 4,
    comment: "ব্যাখ্যাগুলো পরিষ্কার এবং স্টেপ বাই স্টেপ দেওয়া ছিল।",
    createdAt: new Date("2025-02-10"),
    student: {
      firstName: "Riya",
      lastName: "Chowdhury",
      userName: "riya_c",
      image: "https://res.cloudinary.com/demo/image/upload/women2.jpg",
    },
  },
  {
    _id: "7",
    rating: 3,
    comment: "বইটা ভালো, কিন্তু কিছু টাইপো ছিল।",
    createdAt: new Date("2025-03-01"),
    student: {
      firstName: "Asif",
      lastName: "Mahmud",
      userName: "asif_007",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    },
  },
  {
    _id: "8",
    rating: 5,
    comment: "শুধু বই না, একজন গাইডের মতো। দারুণ লেগেছে!",
    createdAt: new Date("2025-03-15"),
    student: {
      firstName: "Mehjabin",
      lastName: "Sultana",
      userName: "mehjabin",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    },
  },
  {
    _id: "9",
    rating: 4,
    comment: "প্র্যাকটিস সেট ভালো ছিল, আরও যুক্ত করা যেত।",
    createdAt: new Date("2025-04-05"),
    student: {
      firstName: "Rakib",
      lastName: "Hasan",
      userName: "rakib_321",
      image: "https://res.cloudinary.com/demo/image/upload/men3.jpg",
    },
  },
  {
    _id: "10",
    rating: 5,
    comment: "অসাধারণ! পরিক্ষার আগেই আমার Confidence বেড়ে গেছে।",
    createdAt: new Date("2025-04-28"),
    student: {
      firstName: "Farzana",
      lastName: "Jahan",
      userName: "farzana.j",
      image: "https://res.cloudinary.com/demo/image/upload/women3.jpg",
    },
  },
];
