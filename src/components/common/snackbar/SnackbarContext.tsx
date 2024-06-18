"use client";
 import { SnackbarMessage } from "@/models/Common";
 import React, {
   createContext,
   FC,
   useState,
   useContext,
   ReactNode,
 } from "react";
 
 interface SnackbarContextType {
   message: SnackbarMessage | undefined;
   open: boolean;
   showSnackbar: (message?: SnackbarMessage) => void;
   onClose: () => void;
 }
 
 const defaultSnackbarContext: SnackbarContextType = {
   message: undefined,
   open: false,
   showSnackbar: () => {},
   onClose: () => {},
 };
 
 export const SnackbarContext = createContext<SnackbarContextType>(
   defaultSnackbarContext
 );
 
 export const useSnackbar = () => {
   return useContext(SnackbarContext);
 };
 
 interface SnackBarContextProviderProps {
   children: ReactNode;
 }
 
 export const SnackBarContextProvider: FC<SnackBarContextProviderProps> = ({
   children,
 }) => {
   const [message, setMessage] = useState<SnackbarMessage>();
   const [open, setIsDisplayed] = useState<boolean>(false);
   let timer: NodeJS.Timeout;
 
   const handleShowSnackbar = (message?: SnackbarMessage) => {
     setMessage(message);
     setIsDisplayed(true);
     timer = setTimeout(() => {
       handleCloseHandler();
     }, 5000);
   };
 
   const handleCloseHandler = () => {
     clearTimeout(timer);
     setIsDisplayed(false);
   };
 
   return (
     <SnackbarContext.Provider
       value={{
         message,
         open,
         showSnackbar: handleShowSnackbar,
         onClose: handleCloseHandler,
       }}
     >
       {children}
     </SnackbarContext.Provider>
   );
	 };