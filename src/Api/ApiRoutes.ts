// auth
export const LOGIN = "auth/login";
export const CHANGEPASSWORD = "auth/changePassword";
export const VIEWPROFILE = "auth/viewProfile";
export const EDITPROFILE = "auth/editProfile";
export const FILEUPLOAD = "common/fileUpload";

//Leaderboard
export const GLOBAL_LEADERBOARD_LIST = "leaderBoard/listOfGlobal/";
export const DOMAIN_LEADERBOARD_LIST = "leaderBoard/listOfDomain/";

// Dashboard
export const DASHBOARD_QUIZ_DATA = "dashboard/dashboardQuizData";
export const DASHBOARD_QUIZ_STATISTICS_DATA =
  "dashboard/dashboardQuizStatisticsData";
export const DASHBOARD_TOP_PERFORMERS_DATA =
  "dashboard/dashboardTopPerformersData";
export const DASHBOARD_FEEDBACK_TRENDS_DATA =
  "dashboard/dashboardFeedbackTrendsData";

//Quiz-Domain
export const DOMAIN_LIST = "domain/listOfDomain";
export const ADD_DOMAIN = "domain/createDomain";
export const VIEW_DOMAIN = "domain/viewDomain/";
export const EDIT_DOMAIN = "domain/updateDomain/";
export const DELETE_DOMAIN = "domain/deleteDomain/";

//Quiz
export const QUIZ_QUESTION_LIST_WITH_SELECTION = "quiz/domain/listOfQuizDomainQuestion";
export const UPDATE_QUIZ_QUESTION = "quiz/domain/updateQuizQuestions";
export const QUIZ_LIST = "quiz/listOfQuiz";
export const EDIT_QUIZ_STATUS = "quiz/quizStatusChange/";
export const VIEW_QUIZ_DETAILS = "quiz/viewQuiz/";
export const ADD_QUIZ_QUESTION = "quiz/question/add";
export const EDIT_QUIZ_DETAILS = "quiz/updateQuiz/";
export const QUIZ_QUESTION_LIST = "quiz/domain/selectedQuestions/";
export const ADD_QUIZ_DETAILS = "quiz/add";
export const VIEW_BONUS_QUESTION = "quiz/question/viewQuizQuestion/";
export const EDIT_BONUS_QUESTION = "quiz/question/updateBonusQuizQuestion/";
export const DELETE_BONUS_QUESTION = "quiz/question/deleteQuizQuestion/";
export const APPROVE_QUIZ = "quiz/privateQuizStatusChange/";
export const REJECT_QUIZ = "quiz/privateQuizStatusChange/";

//Feedback
export const FEEDBACK_LIST = "quiz/listOfQuiz";
export const QUIZ_FEEDBACK_LIST = "common/listOfFeedback/";

// knowledge-corner
export const ARTICLE_LIST = "knowledgeCorner/listOfArticle";
export const ARTICLE_ADD = "knowledgeCorner/addArticle";
export const ARTICLE_VIEW = "knowledgeCorner/viewArticle/";
export const ARTICLE_EDIT = "knowledgeCorner/editArticle/";
export const EDIT_ARTICLE_STATUS = "knowledgeCorner/activateDeactivateArticle/";
export const ARTICLE_DELETE = "knowledgeCorner/deleteArticle/";

//User
export const USER_LIST = "auth/listOfUser";
export const EDIT_USER_STATUS = "activeDeactiveUser/";
export const VIEW_USER = "auth/viewProfile/";
export const LIST_OF_USER_STATS = "app/profile/listOfStats/";
export const LIST_OF_USER_PERFORMANCE = "listOfDomainState/";

//Tournament
export const TOURNAMENT_SELECTED_QUIZZES_LIST = "tournament/selectedQuizzes/";
export const TOURNAMENT_LIST = "tournament/listOfTournaments";
export const ADD_TOURNAMENT = "tournament/addTournament";
export const VIEW_TOURNAMENT = "tournament/viewTournament/";
export const EDIT_TOURNAMENT = "tournament/editTournament/";
export const TOURNAMENT_DOMAIN_QUIZ_LIST = "tournament/tournamentDomainQuizzes";
export const UPDATE_TOURNAMENT_QUIZ_LIST = "tournament/updateTournamentQuizzes";
export const EDIT_TOURNAMENT_STATUS = "tournament/changeTournamentStatus/";

//Community-Group
export const COMMUNITY_LIST = "chat/listOfCommunities";
export const ADD_COMMUNITY = "chat/addCommunity";
export const VIEW_COMMUNITY = "chat/viewCommunity/";
export const EDIT_COMMUNITY = "chat/editCommunity/";
export const EDIT_COMMUNITY_STATUS = "chat/activateDeactivateCommunity/";
export const USER_LIST_IN_COMMUNITY = "chat/listOfCommunityUsers/";
export const REMOVE_USER_FROM_COMMUNITY = "chat/removeCommunityUsers/";

//Domain-Question
export const DOMAIN_QUESTION_LIST = "quiz/domain/list/";
export const ADD_DOMAIN_QUESTION = "quiz/domain/add";
export const EDIT_DOMAIN_QUESTION = "quiz/domain/edit/";
export const DELETE_DOMAIN_QUESTION = "quiz/domain/delete/";
export const VIEW_DOMAIN_QUESTION = "quiz/domain/view/";

// Fact
export const FACT_LIST = "factOfTheDay/listOfFacts";
export const ADD_FACT = "factOfTheDay/addFact";
export const VIEW_FACT = "factOfTheDay/viewFact/";
export const EDIT_FACT = "factOfTheDay/editFact/";
