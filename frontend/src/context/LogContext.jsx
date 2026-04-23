import { createContext, useContext, useState } from "react";

const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  const addLog = (log) => {
    setLogs((prev) => [...prev, log]);
  };
  const reviewLog = (index,comment) => {
    setLogs( (prev) =>
      prev.map((log,i) =>
        i === index 
           ? {
            ...log,
            supervisorComment : comment ,
            status :"reviewed" ,
             }
           :log
  )

    );
  };

  return (
    <LogContext.Provider value={{ logs, addLog ,reviewLog}}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => useContext(LogContext);