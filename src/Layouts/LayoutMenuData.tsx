import { moduleName } from "Components/constants/common";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [isMaster, setIsMaster] = useState<boolean>(false);
  const isQuizzes = useState<boolean>(false);
  const isLeaderboard = useState<boolean>(false);
  const isFeedback = useState<boolean>(false);
  const isKnowledgeCorner = useState<boolean>(false);
  const isUser = useState<boolean>(false);
  const isTournament = useState<boolean>(false);
  const isCommunityGroup = useState<boolean>(false);
  const isFact = useState<boolean>(false);
  const [iscurrentState, setIscurrentState] = useState(moduleName.Dashboard);

  function updateIconSidebar(e: any) {
    if (e?.target?.getAttribute("sub-items")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        const id = item.getAttribute("sub-items");
        const getID = document.getElementById(id) as HTMLElement;
        if (getID) getID.classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== moduleName.Dashboard) {
      setIsDashboard(false);
    }
    if (iscurrentState !== moduleName.Master) {
      setIsMaster(false);
    }
  }, [history, iscurrentState]);

  const menuItems: any = [
    {
      id: "dashboard",
      label: moduleName.Dashboard,
      icon: "mdi mdi-view-dashboard",
      link: "/dashboard",
      module_name: moduleName.Dashboard,
      stateVariables: isDashboard,
      click: function (e: any) {
        e.preventDefault();
        setIscurrentState(moduleName.Dashboard);
        updateIconSidebar(e);
      },
    },
    {
      id: "user",
      label: moduleName.Users,
      icon: "mdi mdi-account-circle",
      link: "/user",
      module_name: moduleName.Users,
      stateVariables: isUser,
      click: function (e: any) {
        e.preventDefault();
        setIscurrentState(moduleName.Users);
        updateIconSidebar(e);
      },
    },
    {
      id: "master",
      label: moduleName.Master,
      icon: "mdi mdi-view-grid-plus-outline",
      link: "/dashboard",
      module_name: moduleName.Master,
      stateVariables: isMaster,
      click: function (e: any) {
        e.preventDefault();
        setIscurrentState(moduleName.Master);
        setIsMaster(!isMaster);
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "quizDomain",
          label: moduleName.QuizDomain,
          link: "/quiz-domain",
          parentId: "master",
        },
        {
          id: "domainQuestion",
          label: moduleName.DomainQuestion,
          link: "/domain-question",
          parentId: "master",
        },
      ],
    },
    {
      id: "quizzes",
      label: moduleName.Quizzes,
      icon: "mdi mdi-format-list-bulleted",
      link: "/quizzes",
      module_name: moduleName.Quizzes,
      stateVariables: isQuizzes,
      click: function (e: any) {
        e.preventDefault();
        setIscurrentState(moduleName.Quizzes);
        updateIconSidebar(e);
      },
    },
    {
      id: "leaderboard",
      label: moduleName.Leaderboard,
      icon: "mdi mdi-trophy",
      link: "/leaderboard",
      module_name: moduleName.Leaderboard,
      stateVariables: isLeaderboard,
      click: function (e: any) {
        e.preventDefault();
        setIscurrentState(moduleName.Leaderboard);
        updateIconSidebar(e);
      },
    },
    {
      id: "feedback",
      label: moduleName.Feedback,
      icon: "mdi mdi-comment-text",
      link: "/feedback",
      module_name: moduleName.Feedback,
      stateVariables: isFeedback,
      click: function (e: any) {
        e.preventDefault();
        setIscurrentState(moduleName.Feedback);
        updateIconSidebar(e);
      },
    },
    {
      id: "knowledgeCorner",
      label: moduleName.KnowledgeCorner,
      icon: "mdi mdi-book-open-page-variant",
      link: "/knowledge-corner",
      module_name: moduleName.KnowledgeCorner,
      stateVariables: isKnowledgeCorner,
      click: function (e: any) {
        e.preventDefault();
        setIscurrentState(moduleName.KnowledgeCorner);
        updateIconSidebar(e);
      },
    },
    {
      id: "communityGroup",
      label: moduleName.CommunityGroup,
      icon: "mdi mdi-account-group",
      link: "/community-group",
      module_name: moduleName.CommunityGroup,
      stateVariables: isCommunityGroup,
      click: function (e: any) {
        e.preventDefault();
        setIscurrentState(moduleName.CommunityGroup);
        updateIconSidebar(e);
      },
    },
    {
      id: "tournament",
      label: moduleName.Tournament,
      icon: "mdi mdi-gamepad-variant",
      link: "/tournament",
      module_name: moduleName.Tournament,
      stateVariables: isTournament,
      click: function (e: any) {
        e.preventDefault();
        setIscurrentState(moduleName.Tournament);
        updateIconSidebar(e);
      },
    },
    {
      id: "fact",
      label: moduleName.Fact,
      icon: "mdi mdi-book-information-variant",
      link: "/fact",
      module_name: moduleName.Fact,
      stateVariables: isFact,
      click: function (e: any) {
        e.preventDefault();
        setIscurrentState(moduleName.Fact);
        updateIconSidebar(e);
      },
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
