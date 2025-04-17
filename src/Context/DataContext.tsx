import React, { createContext, useState, ReactNode, useMemo } from "react";

const DataContext = createContext<any>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<string>("");
  const [userNameValue, setUserNameValue] = useState<string>("");

  const contextValue = useMemo(() => {
    return {
      userProfile,
      setUserProfile,
      userNameValue,
      setUserNameValue,
    };
  }, [userProfile, userNameValue]);

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export { DataContext, DataProvider };
