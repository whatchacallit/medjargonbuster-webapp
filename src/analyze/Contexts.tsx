
import React, { useContext } from "react";

export type IExtractionResult = {
    text?: string,
    meta?: any
}

export type IExtractionContextType = {
    extractionResult: IExtractionResult,
    setExtractionResult: (result: IExtractionResult) => void

}

export const ExtractionResultContext = React.createContext<IExtractionContextType>({
    extractionResult: {},
    setExtractionResult: result => console.log(result)
});

export const useExtractionResult = () => useContext(ExtractionResultContext);