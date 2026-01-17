import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { Layout } from "../../../shared/components/Layout";
import { useAuth } from "../../../shared/context/AuthContext";
import { getInterviews } from "../../../shared/services/firebase";
import { TrendingUp, AlertCircle, Award } from "../../../shared/components/Icons";
import { AuthRequired } from "../../../shared/components/AuthRequired";

import {
  MetricCard,
  CareerPulseCard,
  PerformanceTrendChart,
  WeaknessChart,
  DashboardHeader,
} from "../components/Dashboard";

function useDashboardData(user, authLoading) {
  const [loading, setLoading] = useState(true);
  const [interviewData, setInterviewData] = useState([]);
  const [localStats, setLocalStats] = useState({
    bugHuntScore: 0,
    negotiationOutcomes: [],
    lastPitchScore: 0,
    logicMastery: 0,
  });

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getInterviews(user.id);
      setInterviewData(data);

      const bugHuntStats = JSON.parse(
        localStorage.getItem("nextoffer_ai_bughunt_stats") || '{"score":0}',
      );
      const negotiationOutcomes = JSON.parse(
        localStorage.getItem("nextoffer_ai_negotiation_outcomes") || "[]",
      );
      const lastPitchScore = parseInt(
        localStorage.getItem("nextoffer_ai_last_pitch_score") || "0",
      );
      const logicMastery = parseInt(
        localStorage.getItem("nextoffer_ai_logic_mastery") || "0",
      );

      setLocalStats({
        bugHuntScore: bugHuntStats.score || 0,
        negotiationOutcomes,
        lastPitchScore,
        logicMastery,
      });
    } catch (error) {
      console.warn("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, user, loadData]);

  return { loading, interviewData, localStats };
}

function calculateStats(data, localStats) {
  // Calculate Average Score Trend
  const scores = data
    .filter((i) => i.ratings)
    .map((i) => ({
      date: new Date(i.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      technical: i.ratings.technical_skills || 0,
      communication: i.ratings.communication || 0,
    }))
    .reverse();

  // Calculate Weaknesses
  const topicCounts = {};
  data.forEach((i) => {
    if (i.topics) {
      i.topics.forEach((t) => {
        topicCounts[t] = (topicCounts[t] || 0) + 1;
      });
    }
  });
  const weaknesses = Object.entries(topicCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate holistic data based on all modules
  const avgScore =
    data.length > 0
      ? (
          data.reduce(
            (acc, i) =>
              acc +
              ((i.ratings?.technical_skills || 0) +
                (i.ratings?.communication || 0)) /
                2,
            0,
          ) / data.length
        ).toFixed(1)
      : 0;

  const holisticData = [
    {
      subject: "Interviews",
      A: Math.min(data.length * 10, 100),
      fullMark: 100,
    },
    {
      subject: "Bug Hunt",
      A: Math.min(localStats.bugHuntScore, 100),
      fullMark: 100,
    },
    {
      subject: "Negotiation",
      A: Math.min(localStats.negotiationOutcomes.length * 15, 100),
      fullMark: 100,
    },
    { subject: "Pitch", A: localStats.lastPitchScore, fullMark: 100 },
    { subject: "Logic", A: localStats.logicMastery, fullMark: 100 },
  ];

  return {
    averageScore: avgScore,
    totalInterviews: data.length,
    topWeaknesses: weaknesses,
    chartData: scores,
    holisticData,
  };
}

const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    </Layout>
  );
});

export function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { loading, interviewData, localStats } = useDashboardData(
    user,
    authLoading,
  );

  const stats = useMemo(
    () => calculateStats(interviewData, localStats),
    [interviewData, localStats],
  );

  if (authLoading || loading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return (
      <AuthRequired
        title="Dashboard Access"
        message="Please sign in to view your interview analytics and progress."
      />
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CareerPulseCard holisticData={stats.holisticData} />

          <div className="grid grid-cols-1 gap-6">
            <MetricCard
              icon={<Award className="text-indigo-600" />}
              label="Average Score"
              value={`${stats.averageScore}/10`}
              color="indigo"
            />
            <MetricCard
              icon={<TrendingUp className="text-emerald-600" />}
              label="Total Sessions"
              value={stats.totalInterviews}
              color="emerald"
            />
            <MetricCard
              icon={<AlertCircle className="text-red-500" />}
              label="Top Weakness"
              value={stats.topWeaknesses[0]?.name || "None"}
              color="red"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PerformanceTrendChart data={stats.chartData} />
          <WeaknessChart data={stats.topWeaknesses} />
        </div>
      </div>
    </Layout>
  );
}
