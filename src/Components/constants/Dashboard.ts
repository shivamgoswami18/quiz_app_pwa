export const DashboardData = {
    PERFORMERS_CLOUMN_PLAYER_HEADER: "Player",
    PERFORMERS_CLOUMN_PLAYER_ACCESSORKEY: "name",
    PERFORMERS_CLOUMN_TOURNAMENTS_WON_HEADER: "Tournaments Won",
    PERFORMERS_CLOUMN_TOURNAMENTS_WON_ACCESSORKEY: "tournamentsWon",
    PERFORMERS_CLOUMN_TOTAL_POINTS_HEADER: "Total Points",
    PERFORMERS_CLOUMN_TOTAL_POINTS_ACCESSORKEY: "totalPoints",
    PERFORMERS_CLOUMN_ACCURACY_HEADER: "Accuracy",
    PERFORMERS_CLOUMN_ACCURACY_ACCESSORKEY: "accuracy",
    GOOD_MORNING_ADMIN: "Good Morning, Admin!",
    HERES_WHATS_HAPPENING: "Here's what's happening in your quiz app today.",
    FILTER_BY_DATE: "Filter By Date",
    QUIZ_STATISTICS: "Quiz Statistics",
    EXPORT_REPORT: "Report",
    TOP_PERFORMERS: "Top Performers",
    FILTER_BY: "Filter By",
    FEEDBACK_TRENDS: "Feedback Trends",
    DASHBOARD_PAGE_TITLE: "Dashboard | Quizown",
    SELECT_TOURNAMENT: "select tournament"
}

export const DashboardTable = {
    ENTER_IN_BASE_TABLE: "Enter",
    ITEMS_PER_PAGE_IN_BASE_TABLE: "Items per page:",
    SHOWING_IN_BASE_TABLE: "Showing",
    OF_IN_BASE_TABLE: "of",
    RESULTS_IN_BASE_TABLE: "Results",
    NO_DATA_IN_BASE_TABLE: "Sorry! No Result Found",
    SEARCH_IN_BASE_TABLE: "Search...",
}

export const CardData = [
    { icon: "mdi-trophy-outline", title: "Total Tournaments", value: 25 },
    {
      icon: "mdi-account-multiple-outline",
      title: "Active Players",
      value: 1200,
    },
    { icon: "mdi-chart-bar", title: "Top Leaderboard Score", value: 9800 },
    { icon: "mdi-puzzle-outline", title: "Challenges Completed", value: 450 },
    {
      icon: "mdi-gamepad-variant-outline",
      title: "Ongoing Tournaments",
      value: 8,
    },
    { icon: "mdi mdi-account-group", title: "Community Groups", value: 42 },
];

// Pie Chart Data and Options
export const QuizChartData = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        label: "Quiz Statistics",
        data: [60, 25, 15],
        backgroundColor: ["#95A9FD", "#3CD188", "#FDAC8B"],
        borderColor: ["#95A9FD", "#3CD188", "#FDAC8B"],
        borderWidth: 1,
      },
    ],
};

export const QuizChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
};

// Bar Chart Data and Options
export const FeedbackChartData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Feedback Received",
        data: [120, 150, 100, 200, 170],
        backgroundColor: "#2D65CD",
        borderColor: "#2D65CD",
        borderWidth: 1,
      },
    ],
};

export const FeedbackChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.raw} feedbacks`;
          },
        },
      },
    },
};

export const TopPerformers = [
    {
      name: "Alex Smith",
      image: "https://i.pravatar.cc/150?img=1",
      tournamentsWon: 8,
      totalPoints: 2840,
      accuracy: "94%",
    },
    {
      name: "Emma Wilson",
      image: "https://i.pravatar.cc/150?img=2",
      tournamentsWon: 7,
      totalPoints: 2690,
      accuracy: "92%",
    },
    {
      name: "James Chen",
      image: "https://i.pravatar.cc/150?img=3",
      tournamentsWon: 6,
      totalPoints: 2520,
      accuracy: "89%",
    },
    {
      name: "Sarah Johnson",
      image: "https://i.pravatar.cc/150?img=4",
      tournamentsWon: 5,
      totalPoints: 2380,
      accuracy: "87%",
    },
    {
      name: "Michael Brown",
      image: "https://i.pravatar.cc/150?img=5",
      tournamentsWon: 5,
      totalPoints: 2240,
      accuracy: "85%",
    },
];

export const TopPerformersTournament = [
    {
        value: "Tournament A",
        label: "Tournament A",
    },
    {
        value: "Tournament B",
        label: "Tournament B",
    },
    {
        value: "Tournament C",
        label: "Tournament C",
    },
];