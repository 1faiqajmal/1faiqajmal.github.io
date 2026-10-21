/* =================================================================
   content.js  ·  EVERYTHING written on your website lives here.
   -----------------------------------------------------------------
   How to edit:
   - Change the text between the quotes "like this", save the file,
     then refresh the page.
   - Keep the quotes and the comma at the end of each line.
     If the page shows a red "content.js has a mistake" box,
     you're missing a quote, comma or bracket near your last edit.
   - To remove something, delete its whole { ... }, block.
   - To add something, copy a block, paste it right after, and
     change the text.
   - Leave a field as "" (empty quotes) to hide it.
   ================================================================= */

var SITE = {
  name: "Faiq Ajmal",
  initials: "FA",                          // shown when there's no photo
  roles: ["Builder", "Student", "Coach"],  // the small line above your name
  tagline: "I build hardware that helps people.",
  intro: "A drone that detects fires, a Raspberry Pi device that detects ice on roads, and computers for people in my community.",

  // Your photo: put a picture in assets/img/ and write its path here,
  // for example "assets/img/me.jpg". Leave "" to show your initials.
  photo: "",

  // Default board color: "blue", "green", "black", "purple" or "red".
  // Visitors can switch it with the dots at the top of the page.
  boardColor: "blue",

  updated: "October 2026",

  // Section titles, the words on the gold menu, and the line under each title.
  sections: {
    about:      { menu: "About",      title: "About me",               lede: "" },
    projects:   { menu: "Projects",   title: "Projects",               lede: "Things I've built and things I'm building now. Open a datasheet for the details." },
    work:       { menu: "Work",       title: "Work experience",        lede: "" },
    leadership: { menu: "Leadership", title: "Leadership & community", lede: "Programs I'm part of, clubs I help run and teams I coach." },
    awards:     { menu: "Awards",     title: "Awards & learning",      lede: "" },
    sports:     { menu: "Sports",     title: "Sports",                 lede: "" },
    contact:    { menu: "Contact",    title: "Contact",                lede: "The best ways to reach me." }
  },

  /* ---------------- ABOUT ---------------- */
  about: [
    "I'm Faiq. I like knowing how things work on the inside, and I like it even more when I can take something apart, fix it and put it back together better than before.",
    "Most of my time goes into hardware. I build and repair computers for people in my community, I'm working on a drone that detects fires, and my Raspberry Pi road ice detector won a bronze medal at BASEF.",
    "Outside the lab I coach youth soccer at Milton Magic, swim and play soccer, run the AI side of my school's programming club, and lead a youth mental health project through ICNA Relief's Seeds of Leadership program."
  ],

  // The "Key specifications" table next to your About text: ["label", "value"]
  specs: [
    ["Primary function", "Building hardware that helps people"],
    ["Interfaces", "Python, Raspberry Pi, Linux"],
    ["PC builds & repairs", "Since 2024"],
    ["Clubs", "Programming (AI lead), Stock Market (executive)"],
    ["Sports", "Swimming, soccer"],
    ["Also", "Air Cadets, volunteer photography"]
  ],

  skills: [
    { group: "Hardware",      items: ["PC building & upgrades", "Hardware troubleshooting", "Raspberry Pi", "Electronics & circuits", "VEX robotics"] },
    { group: "Software & AI", items: ["Python", "Running AI models", "AI fundamentals", "Linux (Ubuntu)", "Networking basics"] },
    { group: "People",        items: ["Coaching", "Teaching younger students", "Event photography", "Leadership training"] }
  ],

  /* ---------------- PROJECTS ----------------
     status: "progress" (amber light), "done" or "ongoing" (green light)
     details: the bullet points inside the datasheet pop-up
     award:   leave "" if none
     link:    a web address for a "Visit" button, or "" for none   */
  projects: [
    {
      title: "Fire-detection drone",
      status: "progress",
      when: "",
      summary: "A drone that detects fires from the air, so people can respond sooner.",
      details: [
        "Built to help people: the goal is to catch fires early, before they spread.",
        "In progress now."
        // Add more lines here: what sensors or camera it uses, how it decides it's a fire, what you've tested.
      ],
      tags: ["Drones", "Fire detection", "Hardware"],
      award: "",
      link: "", linkLabel: ""
    },
    {
      title: "Road ice detector",
      status: "done",
      when: "",
      summary: "A Raspberry Pi device that detects ice on roads.",
      details: [
        "Built around a Raspberry Pi.",
        "Won a bronze medal at BASEF, the Bay Area Science and Engineering Fair."
      ],
      tags: ["Raspberry Pi", "Hardware", "Science fair"],
      award: "Bronze · BASEF",
      link: "", linkLabel: ""
    },
    {
      title: "Model maglev train launcher",
      status: "progress",
      when: "Fall 2026",
      summary: "A multi-stage electromagnetic launcher for a model maglev train, built with a teammate in my school's electronics lab.",
      details: [
        "My Maker Monday project for Computer Technology, running the full semester with a team of two.",
        "Stages of electromagnetic coils fire one after another to push the train along the track.",
        "Safety is built in: a master key so it only runs with our teacher present, and a cover over the capacitors so no one can touch them."
      ],
      tags: ["Electronics", "Electromagnetics", "Team project"],
      award: "",
      link: "", linkLabel: ""
    },
    {
      title: "PC builds & repairs",
      status: "ongoing",
      when: "2024 – now",
      summary: "I build, upgrade and repair computers for people in my community.",
      details: [
        "Customers find me through Facebook Marketplace.",
        "Jobs range from picking parts and full builds to troubleshooting machines that won't boot."
      ],
      tags: ["Hardware", "Troubleshooting", "Customer service"],
      award: "",
      link: "", linkLabel: ""
    },
    {
      title: "VEX Robotics",
      status: "done",
      when: "Grades 9 – 10",
      summary: "Two years on a VEX Robotics team, building and programming competition robots.",
      details: [
        "Took part in VEX Robotics in Grades 9 and 10."
      ],
      tags: ["Robotics", "Programming", "Teamwork"],
      award: "",
      link: "", linkLabel: ""
    },
    {
      title: "Computer Technology site",
      status: "ongoing",
      when: "2026 – 27",
      summary: "My course portfolio: a circuit-board website with an interactive tool for every unit.",
      details: [
        "Pages for hardware, AI, networking, number theory, electronics and programming, each with its own tool, from a subnet calculator to a programmable rover.",
        "I add new assignments to it as the course goes on."
      ],
      tags: ["HTML", "CSS", "JavaScript"],
      award: "",
      link: "",                       // paste your course site's link here to show a "Visit" button
      linkLabel: "Visit the course site"
    }
  ],

  /* ---------------- WORK ---------------- */
  experience: [
    { role: "PC builder & repair technician", org: "Independent", when: "2024 – now",
      text: "Building, upgrading and repairing computers for people in my community, with customers from Facebook Marketplace." },
    { role: "Intern", org: "Shift Auto", when: "Summer 2026",
      text: "" },   // add a sentence about what you worked on
    { role: "Co-op student", org: "XoomTech", when: "Grade 11",
      text: "" }    // add a sentence about what you worked on
  ],

  /* ---------------- LEADERSHIP & COMMUNITY ---------------- */
  leadership: [
    { role: "Muslim Youth Mental Health Support and Awareness Initiative", org: "Impact Project · ICNA Relief Seeds of Leadership", when: "2026",
      text: "I'm starting by listening to Muslim youth in my community before choosing a solution, then testing it and improving it with their feedback. On October 3, 2026, I held a mental health awareness session at Ford Community Park to connect people with information and resources." },
    { role: "Youth Leadership Development Program", org: "ICNA Relief", when: "",
      text: "Completed leadership training and was selected for the Seeds of Leadership program." },
    { role: "Learn to Lead", org: "Leadership training program", when: "",
      text: "" },
    { role: "AI section lead", org: "Programming Club", when: "",
      text: "I run the AI part of the club and teach younger students how to run their own AI models." },
    { role: "Executive", org: "Stock Market Club", when: "",
      text: "Helping run the club and recruit new members." },
    { role: "Youth soccer coach", org: "Milton Magic", when: "Summer 2024 – now",
      text: "Coaching youth soccer teams." },
    { role: "Cadet", org: "197 Typhoon Royal Canadian Air Cadet Squadron", when: "",
      text: "" },
    { role: "Volunteer photographer", org: "Community events", when: "",
      text: "Photographing events and places as a volunteer." }
  ],

  /* ---------------- AWARDS & LEARNING ---------------- */
  awards: [
    { title: "Bronze medal, BASEF", text: "Bay Area Science and Engineering Fair, for my Raspberry Pi road ice detector." },
    { title: "University of Waterloo math contests", text: "Wrote math competitions from the University of Waterloo." },
    { title: "Chemistry & physics competitions", text: "Wrote chemistry and physics contests alongside math." },
    { title: "Python & AI training", text: "Completed Python training and a course on AI fundamentals." }
  ],

  /* ---------------- SPORTS ---------------- */
  sports: [
    { title: "Swimming", text: "I swim and compete in swimming competitions." },
    { title: "Soccer", text: "I play on my school's soccer team and won a championship with my summer team." }
  ],

  /* ---------------- CONTACT ----------------
     Fill in any you want to show. Empty ones stay hidden, and if
     they're all empty the Contact section is hidden too.         */
  contact: {
    email: "",
    github: "https://github.com/1faiqajmal",
    linkedin: "",     // e.g. "https://www.linkedin.com/in/yourname"
    instagram: ""     // e.g. a photography account
  }
};
