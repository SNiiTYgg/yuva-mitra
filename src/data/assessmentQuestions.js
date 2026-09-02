// Skill Assessment Multi-step Questionnaire Data & Scoring Logic

export const ASSESSMENT_CATEGORIES = [
  { id: 'technical', name: 'Technical Skills', description: 'Core programming, development, and architecture aptitude' },
  { id: 'soft_skills', name: 'Soft Skills & Communication', description: 'Teamwork, peer review, and stakeholder presentations' },
  { id: 'problem_solving', name: 'Problem Solving & Logic', description: 'Algorithmic intuition and debugging methodology' },
  { id: 'domain_knowledge', name: 'Domain Knowledge', description: 'Industry practices, cloud fundamentals, and security awareness' },
  { id: 'career_interests', name: 'Career Interests', description: 'Preferred project types, work environments, and target roles' },
];

export const ASSESSMENT_QUESTIONS = [
  // 1. Technical Skills
  {
    id: 'q1',
    category: 'technical',
    question: 'How comfortable are you building modular frontend applications with React and state management?',
    options: [
      { text: 'Expert: Built enterprise full-stack apps with complex state and custom hooks', score: 10, skills: ['React.js', 'Frontend Architecture'] },
      { text: 'Proficient: Comfortable with hooks, context, routing, and REST integration', score: 8, skills: ['React.js'] },
      { text: 'Intermediate: Built basic multi-page apps following standard tutorials', score: 6, skills: ['React.js'] },
      { text: 'Beginner / Exploring: Just started learning JSX and component basics', score: 3, skills: [] },
    ],
  },
  {
    id: 'q2',
    category: 'technical',
    question: 'What is your primary backend programming language and framework proficiency?',
    options: [
      { text: 'Python (FastAPI / Django / Flask) with async tasks & ORMs', score: 10, skills: ['Python', 'Backend APIs'] },
      { text: 'JavaScript / TypeScript (Node.js / Express / NestJS)', score: 9, skills: ['Node.js', 'Backend APIs'] },
      { text: 'Java / Go / C++ for system software and microservices', score: 9, skills: ['System Design', 'Backend APIs'] },
      { text: 'Basic scripting and introductory database queries only', score: 4, skills: [] },
    ],
  },
  {
    id: 'q3',
    category: 'technical',
    question: 'How do you approach database schema design and query optimization?',
    options: [
      { text: 'Design normalized SQL schemas, optimize indexes, and utilize caching (Redis)', score: 10, skills: ['SQL & Database Design'] },
      { text: 'Proficient in relational (PostgreSQL/MySQL) or document databases (MongoDB)', score: 8, skills: ['SQL & Database Design'] },
      { text: 'Know basic CRUD queries, table joins, and primary/foreign keys', score: 6, skills: ['SQL & Database Design'] },
      { text: 'Limited experience beyond basic key-value storage', score: 3, skills: [] },
    ],
  },

  // 2. Soft Skills & Communication
  {
    id: 'q4',
    category: 'soft_skills',
    question: 'When receiving critical feedback on a pull request or code review from senior engineers, how do you respond?',
    options: [
      { text: 'Analyze suggestions objectively, ask clarifying questions, and document improvements', score: 10, skills: ['Communication', 'Agile Collaboration'] },
      { text: 'Implement requested changes promptly and verify test cases pass', score: 8, skills: ['Communication'] },
      { text: 'Feel slightly defensive initially, but ultimately make the requested edits', score: 5, skills: [] },
      { text: 'Prefer working on standalone code without code review rounds', score: 3, skills: [] },
    ],
  },
  {
    id: 'q5',
    category: 'soft_skills',
    question: 'How do you communicate technical blockers during sprint standups or research meetings?',
    options: [
      { text: 'Structure with Context, Exact Blocker, Attempted Fixes, and Specific Help needed', score: 10, skills: ['Project Management & Agile', 'Technical Communication'] },
      { text: 'Notify the lead or mentor directly as soon as stuck for more than a few hours', score: 8, skills: ['Communication'] },
      { text: 'Spend days trying every possible option before asking for guidance', score: 5, skills: [] },
      { text: 'Wait until the end of the sprint deadline to explain the obstacle', score: 2, skills: [] },
    ],
  },
  {
    id: 'q6',
    category: 'soft_skills',
    question: 'Have you presented technical findings or research posters to interdisciplinary audiences?',
    options: [
      { text: 'Frequently: Presented at hackathons, conferences, or college symposiums', score: 10, skills: ['Technical Writing & Research', 'Public Speaking'] },
      { text: 'Occasionally: Conducted internal team demos or lab seminars', score: 8, skills: ['Communication'] },
      { text: 'Rarely: Only presented mandatory academic project viva presentations', score: 5, skills: [] },
      { text: 'Never: Highly uncomfortable presenting in front of an audience', score: 3, skills: [] },
    ],
  },

  // 3. Problem Solving & Logic
  {
    id: 'q7',
    category: 'problem_solving',
    question: 'When encountering an intermittent production bug (e.g., race condition or memory leak), what is your debugging pipeline?',
    options: [
      { text: 'Reproduce with stress scripts, inspect heap/memory profiles, and analyze telemetry logs', score: 10, skills: ['Data Structures & Algorithms', 'System Debugging'] },
      { text: 'Isolate components, add comprehensive debug logging, and write unit test tests', score: 8, skills: ['Data Structures & Algorithms'] },
      { text: 'Search stack traces on StackOverflow / GitHub issues and test suggested fixes', score: 6, skills: [] },
      { text: 'Randomly modify parameters until the crash stops occurring', score: 2, skills: [] },
    ],
  },
  {
    id: 'q8',
    category: 'problem_solving',
    question: 'How comfortable are you with time and space complexity analysis (Big-O notation)?',
    options: [
      { text: 'Intuitive: Regularly solve Graph, DP, and Tree problems with optimal bounds', score: 10, skills: ['Data Structures & Algorithms'] },
      { text: 'Good: Easily identify O(N), O(N log N), and O(N^2) bottlenecks in daily code', score: 8, skills: ['Data Structures & Algorithms'] },
      { text: 'Basic: Know difference between array indexing and linear scans', score: 5, skills: [] },
      { text: 'Unsure: Rarely analyze computational complexity', score: 2, skills: [] },
    ],
  },
  {
    id: 'q9',
    category: 'problem_solving',
    question: 'Given an underspecified open-ended problem from an industry mentor, how do you start?',
    options: [
      { text: 'Draft requirement assumptions, define input/output contracts, and build MVP prototype', score: 10, skills: ['Product Thinking', 'System Design'] },
      { text: 'Ask structured discovery questions to clarify scope before touching code', score: 9, skills: ['Requirement Gathering'] },
      { text: 'Immediately start coding and adapt as new constraints appear', score: 5, skills: [] },
      { text: 'Wait for complete step-by-step instructions from the mentor', score: 3, skills: [] },
    ],
  },

  // 4. Domain Knowledge
  {
    id: 'q10',
    category: 'domain_knowledge',
    question: 'What is your familiarity with Cloud Native tools, Containers, and DevOps pipelines?',
    options: [
      { text: 'Advanced: Containerize apps with Docker, write CI/CD GitHub Actions, deploy to AWS/GCP', score: 10, skills: ['Cloud Computing (AWS/GCP)', 'DevOps'] },
      { text: 'Intermediate: Built Docker images and deployed apps to cloud platforms (Vercel/Render/EC2)', score: 7, skills: ['Cloud Computing (AWS/GCP)'] },
      { text: 'Basic: Understand what containers and cloud VMs are theoretically', score: 4, skills: [] },
      { text: 'None: Have only run applications on localhost so far', score: 2, skills: [] },
    ],
  },
  {
    id: 'q11',
    category: 'domain_knowledge',
    question: 'How do you rate your applied Machine Learning & Data Science capabilities?',
    options: [
      { text: 'Trained & evaluated PyTorch/TensorFlow models, fine-tuned LLMs, or used Scikit-Learn', score: 10, skills: ['Machine Learning', 'NLP & LLM Prompting'] },
      { text: 'Used pre-trained APIs (OpenAI / HuggingFace) and pandas/numpy for data exploratory analysis', score: 7, skills: ['Machine Learning'] },
      { text: 'Completed theoretical courses on ML algorithms (Regression, Clustering, Neural Nets)', score: 5, skills: [] },
      { text: 'No background in AI/ML or data science', score: 2, skills: [] },
    ],
  },
  {
    id: 'q12',
    category: 'domain_knowledge',
    question: 'How conscious are you of Web & API Security fundamentals (OWASP Top 10)?',
    options: [
      { text: 'Always sanitize inputs against XSS/SQLi, enforce JWT/OAuth2 RBAC, and rate-limit routes', score: 10, skills: ['Cybersecurity & Ethical Hacking'] },
      { text: 'Aware of basic CORS, password hashing with bcrypt, and HTTPS requirements', score: 7, skills: ['Cybersecurity & Ethical Hacking'] },
      { text: 'Heard of cybersecurity concepts but rarely implement proactive defenses', score: 4, skills: [] },
      { text: 'Unfamiliar with web security vulnerabilities', score: 2, skills: [] },
    ],
  },

  // 5. Career Interests
  {
    id: 'q13',
    category: 'career_interests',
    question: 'What type of industry engagement are you most eager to pursue right now?',
    options: [
      { text: '6-Month Full-Time R&D or Software Engineering Internship with leading enterprises', score: 10, interest: 'Enterprise R&D' },
      { text: 'Collaborative Research Project with Academic & Lab Faculty', score: 10, interest: 'Academia Research' },
      { text: 'Live Industry Capstone or Open-Source Live Project', score: 10, interest: 'Live Projects' },
      { text: 'Skill Bootcamps, Apprenticeships, and Guided Industry Mentorship', score: 10, interest: 'Apprenticeships & Bootcamps' },
    ],
  },
  {
    id: 'q14',
    category: 'career_interests',
    question: 'Which technology domains resonate most with your future career goals?',
    options: [
      { text: 'Full-Stack Web Architectures & Cloud Microservices', score: 10, interest: 'Cloud & Full Stack' },
      { text: 'Applied Artificial Intelligence, Machine Learning & NLP', score: 10, interest: 'AI & Data Science' },
      { text: 'Cybersecurity, Cloud Infrastructure & Systems Engineering', score: 10, interest: 'Cybersecurity & DevOps' },
      { text: 'Embedded Systems, IoT & Hardware-Software Co-design', score: 10, interest: 'Hardware & IoT' },
    ],
  },
  {
    id: 'q15',
    category: 'career_interests',
    question: 'What work environment helps you thrive most during collaborations?',
    options: [
      { text: 'Hybrid: Enjoy combining collaborative in-office sprints with focused remote deep work', score: 10, interest: 'Hybrid' },
      { text: 'Fully Remote: Autonomous, asynchronous communication with clear milestone deliverables', score: 10, interest: 'Remote' },
      { text: 'Onsite: In-person laboratory/office collaboration with direct daily mentor access', score: 10, interest: 'Onsite' },
      { text: 'Flexible: Open to any mode based on the project requirements', score: 10, interest: 'Flexible' },
    ],
  }
];

export function calculateAssessmentResults(answers) {
  // answers is an object: { q1: optionIndex, q2: optionIndex, ... }
  let totalScore = 0;
  let maxScore = ASSESSMENT_QUESTIONS.length * 10;
  const detectedSkills = new Set();
  const detectedInterests = new Set();

  ASSESSMENT_QUESTIONS.forEach((q) => {
    const selectedIndex = answers[q.id];
    if (selectedIndex !== undefined && q.options[selectedIndex]) {
      const option = q.options[selectedIndex];
      totalScore += option.score;
      if (option.skills) {
        option.skills.forEach((s) => detectedSkills.add(s));
      }
      if (option.interest) {
        detectedInterests.add(option.interest);
      }
    }
  });

  const percentage = Math.round((totalScore / maxScore) * 100);

  const strongSkills = Array.from(detectedSkills).slice(0, 5).map((name) => ({
    name,
    level: percentage > 75 ? 'Advanced' : 'Intermediate',
    verified: true,
  }));

  const recommendedDomains = Array.from(detectedInterests).length > 0
    ? Array.from(detectedInterests)
    : ['Full Stack Development', 'Distributed Systems', 'Applied AI/ML'];

  const allPossibleSkills = ['Cloud Computing (AWS/GCP)', 'Machine Learning', 'Cybersecurity & Ethical Hacking', 'Docker & Kubernetes', 'System Design'];
  const skillsToImprove = allPossibleSkills
    .filter((s) => !detectedSkills.has(s))
    .slice(0, 3)
    .map((name) => ({
      name,
      reason: 'High industry demand for your targeted career path.',
    }));

  return {
    score: percentage,
    strongSkills: strongSkills.length > 0 ? strongSkills : [
      { name: 'Python', level: 'Advanced', verified: true },
      { name: 'React.js', level: 'Intermediate', verified: true },
      { name: 'Data Structures & Algorithms', level: 'Intermediate', verified: true },
    ],
    skillsToImprove,
    careerInterests: recommendedDomains,
    completedAt: new Date().toISOString(),
  };
}
