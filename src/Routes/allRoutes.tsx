import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "pages/Dashboard/Dashboard";

//login
import Login from "../pages/Authentication/Login";

// User Profile
import UserProfile from "../pages/Authentication/Profile";
import ChangePassword from "pages/Authentication/ChangePassword";
import Leaderboard from "pages/Leaderboard";
import { moduleName } from "Components/constants/common";
import Feedback from "pages/Feedback/Feedback";
import KnowledgeCorner from "pages/KnowledgeCorner/KnowledgeCorner";
import User from "pages/User/User";
import UserView from "pages/User/UserView";
import Tournament from "pages/Tournament/Tournament";
import TournamentForm from "pages/Tournament/TournamentForm";
import CommunityGroup from "pages/CommunityGroup/CommunityGroup";
import ArticleForm from "pages/KnowledgeCorner/ArticleForm";
import Quizzes from "pages/Quizzes/Quizzes";
import QuizForm from "pages/Quizzes/QuizForm";
import QuizDomain from "pages/QuizDomain/QuizDomain";
import DomainQuestionList from "pages/DomainQuestion/DomainQuestionList";
import DomainQuestion from "pages/DomainQuestion/DomainQuestion";
import Questions from "pages/Quizzes/Questions";
import QuizFeedback from "pages/Feedback/QuizFeedback";
import QuizView from "pages/Quizzes/QuizView";
import Fact from "pages/Fact/Fact";
import CommunityGroupView from "pages/CommunityGroup/CommunityGroupView";
import TournamentQuiz from "pages/Tournament/TournamentQuiz";
import TournamentView from "pages/Tournament/TournamentView";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  //User Profile
  { path: "/profile", component: <UserProfile /> },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/login" />,
  },
  { path: "/change-password", component: <ChangePassword /> },
  { path: "*", component: <Navigate to="/dashboard" /> },
  {
    path: "/quiz-domain",
    module_name: moduleName.QuizDomain,
    component: <QuizDomain />,
  },
  {
    path: "/domain-question",
    module_name: moduleName.DomainQuestion,
    component: <DomainQuestionList />,
  },
  {
    path: "/:domainName/question/add",
    module_name: moduleName.DomainQuestion,
    component: <DomainQuestion />,
  },
  {
    path: "/:domainName/question/edit",
    module_name: moduleName.DomainQuestion,
    component: <DomainQuestion />,
  },
  {
    path: "/quizzes",
    module_name: moduleName.Quizzes,
    component: <Quizzes />,
  },
  {
    path: "/quizzes/add",
    module_name: moduleName.Quizzes,
    component: <QuizForm />,
  },
  {
    path: "/quizzes/edit/:quizId",
    module_name: moduleName.Quizzes,
    component: <QuizForm />,
  },
  {
    path: "/quizzes/view/:quizId",
    module_name: moduleName.Quizzes,
    component: <QuizView />,
  },
  {
    path: "/quizzes/quizQuestion",
    module_name: moduleName.Quizzes,
    component: <Questions />,
  },
  {
    path: "/leaderboard",
    module_name: moduleName.Leaderboard,
    component: <Leaderboard />,
  },
  {
    path: "/feedback",
    module_name: moduleName.Feedback,
    component: <Feedback />,
  },
  {
    path: "/feedback/:quizId",
    module_name: moduleName.Feedback,
    component: <QuizFeedback />,
  },
  {
    path: "/knowledge-corner",
    module_name: moduleName.KnowledgeCorner,
    component: <KnowledgeCorner />,
  },
  {
    path: "/knowledge-corner/add",
    module_name: moduleName.KnowledgeCorner,
    component: <ArticleForm />,
  },
  {
    path: "/knowledge-corner/edit/:articleId",
    module_name: moduleName.KnowledgeCorner,
    component: <ArticleForm />,
  },
  {
    path: "/knowledge-corner/view/:articleId",
    module_name: moduleName.KnowledgeCorner,
    component: <ArticleForm />,
  },
  {
    path: "/user",
    module_name: moduleName.Users,
    component: <User />,
  },
  {
    path: "/user/view/:userId",
    module_name: moduleName.Users,
    component: <UserView />,
  },
  {
    path: "/tournament",
    module_name: moduleName.Tournament,
    component: <Tournament />,
  },
  {
    path: "/tournament/add",
    module_name: moduleName.Tournament,
    component: <TournamentForm />,
  },
  {
    path: "/tournament/edit/:tournamentId",
    module_name: moduleName.Tournament,
    component: <TournamentForm />,
  },
  {
    path: "/tournament/view/:tournamentId",
    module_name: moduleName.Tournament,
    component: <TournamentView />,
  },
  {
    path: "/tournament/tournamentQuiz",
    module_name: moduleName.Tournament,
    component: <TournamentQuiz />,
  },
  {
    path: "/community-group",
    module_name: moduleName.CommunityGroup,
    component: <CommunityGroup />,
  },
  {
    path: "/community-group/users/:communityId",
    module_name: moduleName.CommunityGroup,
    component: <CommunityGroupView />,
  },
  {
    path: "/fact",
    module_name: moduleName.Fact,
    component: <Fact />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: "/login", component: <Login /> },
];

export { authProtectedRoutes, publicRoutes };
