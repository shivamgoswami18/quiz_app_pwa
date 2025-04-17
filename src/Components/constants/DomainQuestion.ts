export const DomainQuestionLabel = {
  DomainQuestion: "Domain Questions",
  DomainQuestionPageTitle: "Question | Quizown",
  Domain: "Domain",
  SelectDomain: "Select Domain",
};

export const DomainQuestionUIConstants = {
  DomainInputLabel: "Domain",
  DomainPlaceholder: "domain",
};

export const DomainOption = [
  { label: "Science", value: "Science" },
  { label: "Finance", value: "Finance" },
  { label: "Entertainment", value: "Entertainment" },
];

export const DomainQuestionHeader = {
  DomainNo: "No",
  Domain: "Domain",
  Question: "Questions",
};

export const DomainQuestionKey = {
  DomainNo: "id",
  Domain: "name",
  Question: "total_questions",
};

export const dummyData = [
  {
    no: 1,
    id: 1,
    domain: "Science",
    question: 10,
  },
  {
    no: 2,
    id: 2,
    domain: "Finance",
    question: 20,
  },
  {
    no: 3,
    id: 3,
    domain: "Entertainment",
    question: 30,
  },
];

export const DomainQuestionPreviewUIConstants = {
  PreviewHeading: "Preview",
  Questions: "questions",
  Preview: "preview",
  QForQuestionNumber: "Q",
  DotForQuestionNumber: ".",
  OptionA: "A.",
  OptionB: "B.",
  OptionC: "C.",
  OptionD: "D.",
};

export const DomainQuestionConstants = {
  DomainQuestionHeading: "'s Questions",
  Import: "Import",
  Add: "Add",
  RequestEntityTooLarge: "request entity too large",
  PleaseAddImageLessThen10MB: "Please add image less then 10MB.",
  DomainQuestions: "Domain Questions",
  MCQ: "MCQ",
  Question: "question",
};

export const QuestionCardConstants = {
  Note: "Note:-",
  dataNotFound: "Sorry! There Is No Questions",
  trySearchingWithAnotherKeyword: "Try Searching With Another Keyword! Or Add Questions",
  AddQuestion: "Add Question",
  EditQuestion: "Edit Question",
}

export const DomainQuestionOptionUIConstants = {
  Choises: "Choises",
  Option1: "Option 1",
  Option2: "Option 2",
  Option3: "Option 3",
  Option4: "Option 4",
};

export const QuestionOptions = [
  { id: "2", value: "2", label: "Two options" },
  { id: "4", value: "4", label: "Four options" },
];

export const QuestionCardUIConstants = {
  Question: "Question:",
  WhitespaceNotAllowedMessage: "Whitespace is not allowed in start.",
  NoLeadingWhitespaceMessage: "no-leading-whitespace",
};

export const previewQuestionDummyData = [
  {
    id: 1,
    question: "What is your country?",
    options: ["India", "USA", "UK", "Japan"],
    questionImgage:
      "http://localhost:3000/static/media/logo-name.73b52041f9b4faf2c224.png",
    correctOption: 2,
  },
  {
    id: 2,
    question: "What is your name?",
    options: ["Roy", "Joy", "Nick", "Dom"],
    correctOption: 1,
  },
  {
    id: 2,
    question: "What is your name?",
    options: ["True", "False"],
    correctOption: 0,
  },
  {
    id: 2,
    question: "What is your name?",
    options: ["Roy", "Joy", "Nick", "Dom"],
    questionImgage:
      "http://localhost:3000/static/media/logo.83b35b749fa2c6dea91c.png",
    correctOption: 0,
  },
  {
    id: 2,
    question: "What is your name?",
    options: ["True", "False"],
    correctOption: 1,
  },
  {
    id: 2,
    question: "What is your name?",
    options: ["Roy", "Joy", "Nick", "Dom"],
    correctOption: 3,
  },
];
