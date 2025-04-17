export const CommunityLabel = {
  CommunityGroup: "Community Groups",
  CommunityPageTitle: "Community groups | Quizown",
  Title: "title",
  Description: "description",
  Domain: "domain",
};

export const CommunityHeader = {
  Title: "Title",
  Description: "Description",
  Domain: "Domain",
  Status: "Status",
};

export const CommunityKey = {
  Title: "community_name",
  Description: "description",
  Domain: "domain.name",
  Status: "status",
};

export const CommunityUserHeader = {
  Name: "Name",
  Email: "Email",
};

export const CommunityUserKey = {
  Name: "name",
  Email: "email",
};

export const DomainOption = [
  { label: "Science", value: "Science" },
  { label: "Finance", value: "Finance" },
  { label: "Entertainment", value: "Entertainment" },
];

export const CommunityUIConstants = {
  AddNewGroup: "Add New Group",
  EditGroup: "Edit Group",
  TitleInputLabel: "Title",
  DescriptionInputLabel: "Description",
  DomainInputLabel: "Domain",
  UpdateTheStatus: "update the status of community group?",
  UserListHeading: "'s User List",
  CommunityGroup: "Community Group",
  DoYouWantToRemoveUser: "Do you want to remove the user from community group?",
  UserListNavigation: "User List",
};

export const StatusOption = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export const userList = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
];

export const dummyData = [
  {
    _id: "1",
    community_name: "Science Enthusiasts",
    description:
      "A group for science enthusiasts to discuss latest discoveries.",
    domain_name: "Science",
    status: "Active",
    name: "Joy",
    email: "joy@gmail.com"
  },
  {
    _id: "2",
    community_name: "Tech Innovators",
    description:
      "A community for tech lovers to explore and share innovations.",
    domain_name: "Technology",
    status: "Inactive",
    name: "Roy",
    email: "roy@gmail.com"
  },
  {
    _id: "3",
    community_name: "Fitness Freaks",
    description: "Join us to share fitness tips, workouts, and stay motivated.",
    domain_name: "Health & Fitness",
    status: "Active",
    name: "David",
    email: "david@gmail.com"
  },
  {
    _id: "4",
    community_name: "Bookworms United",
    description:
      "A group for book lovers to discuss and review their favorite reads.",
    domain_name: "Literature",
    status: "Inactive",
    name: "Alex",
    email: "alex@gmail.com"
  },
];
