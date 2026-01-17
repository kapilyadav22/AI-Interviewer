import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Infinity as InfinityIcon,
  ShoppingCart,
  Layout as LayoutIcon,
  Tv,
  ArrowLeft,
  Trophy,
  Target,
  Apple,
  Cpu,
  Sparkles,
  Car,
  CreditCard,
  Map,
  Home as HomeIcon,
  ShieldCheck,
  Network,
  Code2,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Briefcase,
  Building2,
  Rocket,
  Palette,
  Cloud,
  Database,
  Users2,
  HardDrive,
  Smartphone,
  Wallet,
} from "../../../shared/components/Icons";
import { Layout } from "../../../shared/components/Layout";
import { Button } from "../../../shared/components/Button";
import { COMPANY_DATA } from "../../../shared/data/companyData";
import { cn } from "../../../shared/utils/cn";

const ICON_MAP = {
  Search: Search,
  Infinity: InfinityIcon,
  ShoppingCart: ShoppingCart,
  Layout: LayoutIcon,
  Tv: Tv,
  Apple: Apple,
  Cpu: Cpu,
  Sparkles: Sparkles,
  Car: Car,
  CreditCard: CreditCard,
  Map: Map,
  Home: HomeIcon,
  ShieldCheck: ShieldCheck,
  Network: Network,
  Code2: Code2,
  UtensilsCrossed: UtensilsCrossed,
  ShoppingBag: ShoppingBag,
  Bike: Bike,
  Palette: Palette,
  Cloud: Cloud,
  Database: Database,
  Users2: Users2,
  HardDrive: HardDrive,
  Smartphone: Smartphone,
  Wallet: Wallet,
};

const CATEGORIES = [
  { id: "all", label: "All Sprints", icon: <Trophy className="w-4 h-4" /> },
  {
    id: "product",
    label: "Product Based",
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: "service",
    label: "Service Based",
    icon: <Briefcase className="w-4 h-4" />,
  },
  { id: "startup", label: "Startups", icon: <Rocket className="w-4 h-4" /> },
];

export const CompanySprints = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const handleStartSprint = (company) => {
    const storedResume = localStorage.getItem("user_resume");

    if (!storedResume) {
      navigate("/setup", {
        state: {
          nextAction: "company-sprint",
          companyProfile: company,
        },
      });
      return;
    }

    navigate("/interview", {
      state: {
        resume: storedResume,
        company: company,
        difficulty: "Senior",
        focusArea: "Mixed Technical & Behavioral",
      },
    });
  };

  const filteredCompanies = Object.values(COMPANY_DATA).filter(
    (company) => activeTab === "all" || company.type === activeTab,
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-white" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                COMPANY SPRINTS
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                Master the interview style of industry leaders.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  activeTab === cat.id
                    ? "bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                )}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredCompanies.map((company) => {
              const Icon = ICON_MAP[company.icon];
              return (
                <motion.div
                  key={company.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all border-b-8"
                  style={{ borderBottomColor: company.color }}
                >
                  <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: company.color }}
                      >
                        <Icon size={32} />
                      </div>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-widest rounded-full border border-slate-200 dark:border-slate-800">
                        {company.type}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      {company.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 h-20 overflow-hidden line-clamp-3">
                      {company.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <Target
                          size={16}
                          className="mr-2 text-slate-400 dark:text-slate-500"
                        />
                        High Relevancy
                      </div>
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <Trophy
                          size={16}
                          className="mr-2 text-slate-400 dark:text-slate-500"
                        />
                        Expert Evaluation
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
                    <Button
                      className="w-full font-bold h-12 rounded-xl"
                      style={{ backgroundColor: company.color }}
                      onClick={() => handleStartSprint(company)}
                    >
                      START {company.title.toUpperCase()} SPRINT
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
};
