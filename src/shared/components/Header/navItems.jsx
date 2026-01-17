import {
  BookOpen,
  Bug,
  BrainCircuit,
  Zap,
  DollarSign,
  Sparkles,
  Users,
  Bookmark,
  Shield,
  Camera,
  Layout as LayoutIcon,
  Trophy,
} from "../Icons";

export const practiceItems = [
  {
    label: "Compiler",
    to: "/compiler",
    icon: <LayoutIcon className="w-4 h-4 text-slate-500" />,
  },
  {
    label: "Flashcards",
    to: "/flashcards",
    icon: <Bookmark className="w-4 h-4 text-primary-600" />,
  },
  {
    label: "Bug Hunt",
    to: "/bug-hunt",
    icon: <Bug className="w-4 h-4 text-red-500" />,
  },
  {
    label: "Peer Interview",
    to: "/p2p",
    icon: <Users className="w-4 h-4 text-orange-500" />,
  },

  {
    label: "Collaborative Whiteboard",
    to: "/collaborative-whiteboard",
    icon: <BrainCircuit className="w-4 h-4 text-indigo-500" />,
  },
];

export const resourceItems = [
  {
    label: "Pitch Coach",
    to: "/pitch-coach",
    icon: <Sparkles className="w-4 h-4 text-indigo-600" />,
  },
  {
    label: "Company Sprints",
    to: "/company-sprints",
    icon: <Trophy className="w-4 h-4 text-yellow-600" />,
  },
  {
    label: "Behavioral Prep",
    to: "/behavioral-prep",
    icon: <Zap className="w-4 h-4 text-indigo-600" />,
  },
  {
    label: "Offer Negotiator",
    to: "/negotiate",
    icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
  },
  {
    label: "Referral Engine",
    to: "/referral-engine",
    icon: <Users className="w-4 h-4 text-emerald-600" />,
  },
  {
    label: "Pre-Interview",
    to: "/pre-interview",
    icon: <Camera className="w-4 h-4 text-primary-600" />,
  },
  {
    label: "Post-Interview Game",
    to: "/post-interview-game",
    icon: <Shield className="w-4 h-4 text-emerald-600" />,
  },
  {
    label: "The Vault",
    to: "/vault",
    icon: <Bookmark className="w-4 h-4 text-amber-600" />,
  },
];
