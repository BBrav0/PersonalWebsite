

export interface CustomLink {
  label: string;
  url: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  icon?: React.ReactNode;
}

export interface RepoConfig {
  order: number;
  libraries?: string[];
  customLinks?: CustomLink[];
  title?: string;
  description?: string;
  detailsMarkdown?: string;

  owner?: string;
  manualRepo?: {
    updatedAt: string;
    languages?: Record<string, number>;
    githubUrl?: string;
  };
}

export const PROJECTS_REPO_CONFIG: Record<string, RepoConfig> = {
  "PersonalWebsite": {
    title: "Personal Website",
    order: 1,
    libraries: ["React","Vercel","Github API"],

  },
  "CanvasToNotion": {
    title: "Canvas to Notion",
    order: 2,
    description: "Syncs coursework and assignment data from Canvas into Notion for cleaner planning and tracking.",
    libraries: ["Canvas API", "Notion API"],
    owner: "BBrav0",
  },
  "feagi-java-sdk": {
    title: "FEAGI Java SDK",
    order: 3,
    description: "Java SDK for building apps and integrations on top of the FEAGI neurorobotics platform.",
    libraries: ["Java", "Maven", "FEAGI"],
    owner: "feagi",
  },
  "Resume-Building": {
    title: "Resume Building",
    order: 4,
    description: "Source repo for my resume workflow, assets, and PDF output used across my personal site.",
    libraries: ["LaTeX", "GitHub Actions"],
    owner: "BBrav0",
  },
  "exodrive": {
    title: "ExoDrive",
    order: 5,
    description: "Repository for the company luxury exotics rental company ExoDrive. Website: https://exodrive.co",
    libraries: ["React","Vercel","Supabase"],

    owner: "gunvir103",
  },
  "VoiceCommandsPC": {
    order: 6,
    libraries: ["Gemini API"],

  },
  "GarminDataReader": {
    title: "Garmin Data Reader",
    order: 7,
    libraries: ["Garmin API", "SQLlite"]
  },
  "TTChat2MC": {
    title: "TikTok Minecraft Link",
    order: 8,
    libraries: ["Maven","TikTok API", "Minecraft Plugin"],
  },
  "WaterSortSolver": {
    title: "Water Sort Solver",
    order: 9,
  },
  "FitbitDataReader": {
    title: "Fitbit Data Reader",
    order: 10,
    description: "Old repository for reading Fitbit running data with some strava data via their APIs.",
    libraries: ["Fitbit API","Strava API", "SQLlite"],
    owner: "BBrav0"
  },
  "SchoolSite": {
    title: "School Site",
    libraries: ["Vercel"],
    order: 11,
  }
};


export const SOFTWARE_REPO_CONFIG: Record<string, RepoConfig> = {
  'CoursePlannerWEB': {
    title: 'CoursePlanner Web',
    order: 1,
    description: 'A fully functional web app for planning a college degree, rebuilt from my original desktop app into a more accessible experience.',
    libraries: ['Next.js', 'TypeScript', 'Supabase'],
    customLinks: [
      {
        label: 'Website',
        url: 'https://courseplanner.benbravo.net',
        variant: 'default',
        icon: null
      }
    ],
    detailsMarkdown: `# CoursePlanner Web

CoursePlanner Web is the web version of a tool I originally built for myself during college to make degree planning easier.

It helps map out semesters, requirements, electives, credits, and long-term course sequencing in a way that feels practical instead of messy.

The repository is private, but the app is live and publicly available at [courseplanner.benbravo.net](https://courseplanner.benbravo.net).`,
    manualRepo: {
      updatedAt: '2026-04-27T00:00:00.000Z',
      languages: {
        TypeScript: 1
      }
    }
  },
  'CoursePlanner': {
    title: 'Ben\'s Course Planner',
    order: 2,
    libraries: ['Tkinter'],
    customLinks: [
      {
        label: 'Download',
        url: 'https://github.com/BBrav0/CoursePlanner/releases',
        variant: 'default',
        icon: null
      }
    ]
  },
  "Leagueback-WEBAPP": {
    title: "Leagueback",
    order: 3,
    libraries: ["React","Riot API","Supabase"],

    customLinks: [
      {
        label: 'Website',
        url: 'https://leagueback.benbravo.net',
        variant: 'default',
        icon: null
      }
    ]
  },
  'BlitzLoLLink': {
    title: 'Blitz League Link',
    order: 5,
    libraries: ['Windows Scripting']
  },
  'ChessCoachAI': {
    title: 'Chess Coach AI',
    order: 4,
    description: 'An interactive chess training app that combines in-browser engine analysis with rating-aware AI coaching.',
    libraries: ['Next.js', 'Stockfish 18', 'LLM Coaching'],

    customLinks: [
      {
        label: 'Website',
        url: 'https://chess.benbravo.net',
        variant: 'default',
        icon: null
      }
    ],
    detailsMarkdown: `# Chess Coach AI

Chess Coach AI is a live product at [chess.benbravo.net](https://chess.benbravo.net) built around a simple idea: let the engine handle chess, and let the AI handle coaching.

It includes:

- Interactive analysis board
- In-browser Stockfish 18 evaluation
- Opening explorer data
- AI chat that can interact with the current board state
- PGN export and annotations
- Multiple chat tabs
- Google sign-in and premium features
- Rating-aware coaching

The repository is private, but the product is real and actively being improved.`,
    manualRepo: {
      updatedAt: '2026-04-13T00:00:00.000Z',
      languages: {
        TypeScript: 1
      }
    }
  }

}; 