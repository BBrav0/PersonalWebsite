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
  inProgress?: boolean;
  owner?: string;
}

export const PROJECTS_REPO_CONFIG: Record<string, RepoConfig> = {
  "PersonalWebsite": {
    title: "Personal Website",
    order: 1,
    libraries: ["React","Vercel","Github API"],
    inProgress: true,
  },
  "exodrive": {
    title: "ExoDrive",
    order: 2,
    description: "Repository for the company luxury exotics rental company ExoDrive. Website: https://exodrive.co",
    libraries: ["React","Vercel","Supabase"],
    inProgress: true,
    owner: "gunvir103",
  },
  "VoiceCommandsPC": {
    order: 4,
    libraries: ["Gemini API"],
    inProgress: true,
  },
  "TTChat2MC": {
    title: 'TikTok Minecraft Link',
    order: 5,
    libraries: ['Maven','TikTok API', 'Minecraft Plugin'],
  }
}; 

export const SOFTWARE_REPO_CONFIG: Record<string, RepoConfig> = {
  'CoursePlanner': {
    title: 'Ben\'s Course Planner',
    order: 1,
    libraries: ['Tkinter'],
    customLinks: [
      {
        label: 'Download',
        url: 'https://github.com/BBrav0/CoursePlanner/releases',
        variant: 'default',
        icon: null // React.ReactNode will be handled in the component
      }
    ]
  },
  "Leagueback": {
    title: "Leagueback",
    order: 2,
    libraries: ["Microsoft Edgeview2", "React","Riot API","Supabase Proxy"],
    inProgress: true,
    customLinks: [
      {
        label: 'Download',
        url: 'https://github.com/BBrav0/Leagueback/releases',
        variant: 'default',
        icon: null // React.ReactNode will be handled in the component
      }
    ]
  },
  'BlitzLoLLink': {
    title: 'Blitz League Link',
    order: 3,
    libraries: ['Windows Scripting']
  },
  'MidAirBlock': {
    title: 'Mid-Air Block',
    order: 4,
    libraries: ['Bukkit', 'Minecraft Plugin'],
    customLinks: [
      {
        label: 'Download',
        url: 'https://github.com/BBrav0/MidAirBlock/releases',
        variant: 'default',
        icon: null // React.ReactNode will be handled in the component
      }
    ]
  },
  'ArrowRide': {
    title: 'Arrow Ride',
    order: 5,
    libraries: ['Bukkit', 'Minecraft Plugin'],
    customLinks: [
      {
        label: 'Download',
        url: 'https://github.com/BBrav0/ArrowRide/releases',
        variant: 'default',
        icon: null // React.ReactNode will be handled in the component
      }
    ]
  }
}; 