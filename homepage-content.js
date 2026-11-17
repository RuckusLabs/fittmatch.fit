/* Shared by the static page builder and browser. Edit here, then run node scripts/build-homepage.cjs. */
(function (root) {
  'use strict';
  const content = {
  "betaUrl": "https://testflight.apple.com/join/4PXhuby6",
  "shared": {
    "pageTitle": "FittMatch — Swipe Right. Find Your Fit.",
    "title": "Swipe right. Find your fit.",
    "description": "Looking for coaching work? Hiring for your team? Swipe right on fitness jobs or coaches you like. Use filters to focus your search, then get the conversation started.",
    "cta": "Join the iOS beta",
    "closing": "Your next fit starts with a swipe.",
    "closingBody": "Find a job you want to explore or a coach you’d like to meet. Join the FittMatch iOS beta and start browsing.",
    "faqs": [
      [
        "Who is FittMatch for?",
        "FittMatch connects fitness coaches looking for work with gyms, studios, and other employers hiring fitness professionals. On this site, “I’m hiring” is the Client side of the app."
      ],
      [
        "How do I try FittMatch?",
        "FittMatch is currently an iOS beta. Install Apple’s TestFlight app, open our beta invitation, and install FittMatch. You can then choose Coach or Client in the app."
      ],
      [
        "Can I look around before creating an account?",
        "Yes. Choose a role to preview jobs or coaches in the app without an account. Guest browsing has a limited number of swipes. Create an account to build your profile and connect."
      ],
      [
        "What does approved beta access include?",
        "Approved accounts receive seven days of complimentary Pro features. Installing through TestFlight does not automatically approve your account. Purchases are disabled during this beta. Contact your beta coordinator or support@fittmatch.fit about approval or expired access."
      ],
      [
        "Can coaches message for free?",
        "Yes. Coaches can discover opportunities and message for free. Messaging coaches from a Client account requires active Pro access, available to approved accounts during the beta."
      ]
    ]
  },
  "coach": {
    "pageTitle": "FittMatch — Your Next Coaching Job Starts with a Swipe",
    "label": "I’m a coach",
    "audience": "For coaches",
    "title": "Your next coaching job starts with a swipe.",
    "description": "See a coaching job you like? Swipe right to apply. Fine-tune your search by location, minimum hourly pay, and time slots.",
    "cta": "Start exploring jobs",
    "heroPhone": "coach-job",
    "heroDuo": "coach-chat-duo",
    "heroCaption": "Swipe right to apply. Refine your search. Start a conversation.",
    "tension": "Swipe. Refine. Connect.",
    "tensionBody": "A right swipe is all it takes to apply. Want a closer fit? Adjust your preferences and keep exploring.",
    "intro": "Three steps to your next introduction.",
    "introBody": "Follow fictional coach Harper Chen as they discover a mobility role at Buckeye Movement Lab, apply, and start a conversation.",
    "chapters": [
      {
        "label": "Swipe right",
        "title": "See a fit? Swipe right.",
        "body": "Swipe right to apply to a role that catches your eye. Your interest stays attached to the opportunity.",
        "detail": "Harper’s application now appears as Applied. Guest browsing is a preview; sign in to apply and connect.",
        "asset": "coach-activity",
        "device": "iphone",
        "caption": "A right swipe becomes an application.",
        "points": [
          "Swipe right to apply",
          "Revisit your applications anytime"
        ]
      },
      {
        "label": "Filters",
        "title": "Find work that fits.",
        "body": "Want to make your search more specific? Choose where you want to work, your minimum hourly pay, and when you’re available.",
        "detail": "Harper spots Buckeye’s Recovery & Mobility Coach opening.",
        "asset": "coach-job",
        "device": "iphone",
        "caption": "See the opportunity before you swipe.",
        "points": [
          "Choose your job and facility types",
          "Save a useful search for next time"
        ],
        "filters": {
          "title": "Your preferences. Your next move.",
          "items": [
            [
              "Location",
              "Search cities and choose a radius."
            ],
            [
              "Pay",
              "Set your minimum hourly pay."
            ],
            [
              "Time slots",
              "Choose working days and AM or PM."
            ],
            [
              "Work setup",
              "Choose employment and facility types."
            ]
          ]
        }
      },
      {
        "label": "Connect",
        "title": "Start the conversation.",
        "body": "Talk with the team, discuss the opportunity, and arrange an interview. Take the next step together.",
        "detail": "Harper and Buckeye discuss a mobility class and an introductory call. Coaches message for free.",
        "asset": "coach-chat-duo",
        "device": "duo",
        "caption": "From a promising role to a real introduction.",
        "points": [
          "Connect through matches or message requests",
          "Propose an interview in chat"
        ]
      }
    ],
    "accessTitle": "Ready to start swiping?",
    "accessBody": "Coach discovery and messaging are free. Approved beta accounts also receive seven days of complimentary Pro features. There are no purchases in this beta.",
    "closing": "Find your next fit. Start with a swipe.",
    "closingBody": "Browse fitness jobs, swipe right on a role you like, and meet the people behind the opportunity.",
    "faqs": [
      [
        "What happens when I swipe right?",
        "When you’re signed in as a coach, swiping right on a job submits your interest as an application. You can revisit it in Activity and connect through a match or message request. Guest swipes let you preview the experience."
      ],
      [
        "Can I filter jobs around my schedule and pay?",
        "Yes. Choose search cities and a radius, working days, and AM or PM time slots. Set a minimum hourly pay and narrow by job, employment, and facility types. You can also save useful searches."
      ],
      [
        "Is this for finding coaching work?",
        "Yes. FittMatch helps fitness professionals discover jobs and connect with gyms, studios, and other employers. It is a recruiting marketplace for fitness work."
      ],
      [
        "Do I need to pay to message a gym?",
        "No. Coaches can discover opportunities and message for free. Some additional features require Pro access; approved beta accounts receive seven days of complimentary Pro."
      ],
      [
        "How do I try FittMatch?",
        "FittMatch is currently an iOS beta. Install Apple’s TestFlight app, open our beta invitation, and install FittMatch. You can then choose Coach or Client in the app."
      ],
      [
        "Can I look around before creating an account?",
        "Yes. Choose a role to preview jobs or coaches in the app without an account. Guest browsing has a limited number of swipes. Create an account to build your profile and connect."
      ],
      [
        "What does approved beta access include?",
        "Approved accounts receive seven days of complimentary Pro features. Installing through TestFlight does not automatically approve your account. Purchases are disabled during this beta. Contact your beta coordinator or support@fittmatch.fit about approval or expired access."
      ],
      [
        "Does a match mean I have a job?",
        "A match or message starts a connection. The employer and coach decide the next steps, interview process, and any offer. FittMatch does not guarantee employment."
      ]
    ],
    "supportTitle": "A little more behind every swipe.",
    "supportBody": "Show what makes you a great coach and keep your applications in view.",
    "supporting": [
      {
        "title": "Let your coaching style show.",
        "body": "Bring your specialties, certifications, photos, and intro video together in one profile.",
        "asset": "coach-profile",
        "device": "iphone",
        "caption": "Give a team a feel for the coach behind the application."
      },
      {
        "title": "Know where things stand.",
        "body": "Follow application progress and get updates when a hiring team moves you forward. Save useful searches for next time.",
        "asset": "coach-activity",
        "device": "iphone",
        "caption": "Your next step stays connected to the role."
      }
    ]
  },
  "client": {
    "pageTitle": "FittMatch — Your Next Great Coach Starts with a Swipe",
    "label": "I’m hiring",
    "audience": "For gyms & hiring teams",
    "title": "Your next great coach starts with a swipe.",
    "description": "See a coach you’d like to meet? Swipe right to show your interest. Refine your search by location, specialty, and available time slots.",
    "cta": "Start exploring coaches",
    "heroPhone": "coach-profile",
    "heroDuo": "client-discover-duo",
    "heroCaption": "Swipe right to show interest. Refine your search. Make an introduction.",
    "tension": "Swipe. Refine. Connect.",
    "tensionBody": "Make the first move with a right swipe. Use filters to focus on your team’s needs, then start a conversation.",
    "intro": "Three steps to your next introduction.",
    "introBody": "See how fictional employer Buckeye Movement Lab can discover Harper, show interest, and discuss a coaching opportunity.",
    "chapters": [
      {
        "label": "Swipe right",
        "title": "Like what you see? Swipe right.",
        "body": "Show interest in a coach you’d like to meet. A right swipe is a simple way to make the first move.",
        "detail": "Buckeye finds Harper in Discover. A mutual like creates a match; message requests offer another way to connect.",
        "asset": "client-discover-duo",
        "device": "duo",
        "caption": "See a fit? Swipe right to show interest.",
        "points": [
          "Browse coach cards",
          "Swipe right on someone you’d like to meet"
        ]
      },
      {
        "label": "Filters",
        "title": "Find your kind of coach.",
        "body": "Looking for a particular fit? Narrow your search by working days, time slots, location, specialty, and experience.",
        "detail": "Harper’s profile gives Buckeye a closer look at their mobility and recovery experience.",
        "asset": "client-discover-duo",
        "device": "duo",
        "caption": "Keep your filters beside the coaches you’re exploring.",
        "points": [
          "Focus on the expertise your opening needs",
          "Save your search to return to it later"
        ],
        "filters": {
          "title": "Build the search around your team.",
          "items": [
            [
              "Location",
              "Search cities and choose a radius."
            ],
            [
              "Time slots",
              "Choose days, mornings, afternoons, or evenings."
            ],
            [
              "Specialty",
              "Look for the coaching expertise you need."
            ],
            [
              "Experience",
              "Choose an experience level for the role."
            ]
          ]
        }
      },
      {
        "label": "Connect",
        "title": "Make the introduction.",
        "body": "Connect through a match or message request and discuss your opening. Share the role and propose an interview in chat.",
        "detail": "Buckeye and Harper arrange an introductory call. Client messaging requires approved beta access.",
        "asset": "client-chat-duo",
        "device": "duo",
        "caption": "Turn interest into a conversation.",
        "points": [
          "Share the opportunity in chat",
          "Arrange the next conversation"
        ]
      }
    ],
    "accessTitle": "Ready to find your next coach?",
    "accessBody": "You can preview coaches before creating an account. Client messaging and other Pro recruiting features require active access. Approved accounts receive seven days of complimentary Pro; purchases are disabled in this beta.",
    "closing": "Meet your next great coach. Start with a swipe.",
    "closingBody": "Explore fitness professionals, swipe right on someone you’d like to meet, and start the conversation.",
    "faqs": [
      [
        "What happens when I swipe right?",
        "Swiping right on a coach shows your interest. If the interest is mutual, you match. You can also connect through a message request; Client messaging requires active Pro access, included for approved beta accounts."
      ],
      [
        "Can I find coaches for particular time slots?",
        "Yes. Filter by working days and mornings, afternoons, or evenings. Add location, coach specialty, and experience filters to focus your search. You can save the search for later."
      ],
      [
        "Who can hire through FittMatch?",
        "Gyms, studios, and other employers looking for fitness professionals can use the Client side of FittMatch. Choose “I’m hiring” here and Client when you enter the app."
      ],
      [
        "Can I message coaches during the beta?",
        "Client messaging requires active Pro access. Approved accounts receive seven days of complimentary Pro features. Downloading the beta alone does not grant this access."
      ],
      [
        "How do I try FittMatch?",
        "FittMatch is currently an iOS beta. Install Apple’s TestFlight app, open our beta invitation, and install FittMatch. You can then choose Coach or Client in the app."
      ],
      [
        "Can I look around before creating an account?",
        "Yes. Choose a role to preview jobs or coaches in the app without an account. Guest browsing has a limited number of swipes. Create an account to build your profile and connect."
      ],
      [
        "What does approved beta access include?",
        "Approved accounts receive seven days of complimentary Pro features. Installing through TestFlight does not automatically approve your account. Purchases are disabled during this beta. Contact your beta coordinator or support@fittmatch.fit about approval or expired access."
      ],
      [
        "Does FittMatch guarantee a hire?",
        "No. FittMatch helps you discover coaches and manage recruiting conversations. Your team decides whom to interview and hire."
      ]
    ],
    "supportTitle": "A little more behind every swipe.",
    "supportBody": "Give coaches a feel for your team and keep hiring organized as conversations move forward.",
    "supporting": [
      {
        "title": "Show what makes your team special.",
        "body": "Introduce your facility and culture. Publish a role with pay and schedule details so coaches know what to expect. Publishing requires approved beta access.",
        "asset": "client-profile",
        "device": "iphone",
        "caption": "Help a coach picture their place on your team."
      },
      {
        "title": "Keep the next step clear.",
        "body": "Organize applicants by role, keep private notes, and follow interview, offer, and hire stages with approved access.",
        "asset": "client-pipeline-duo",
        "device": "duo",
        "caption": "Your openings and pipeline counts in one place."
      }
    ]
  }
};
  if (typeof module !== 'undefined' && module.exports) module.exports = content;
  else root.FittMatchContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this);
