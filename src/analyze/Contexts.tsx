
import React, { useContext } from "react";

export type IPipelineResult = {
    text?: string,
    meta?: any
}

export type IAnalysisOptions = {
    autoTranslate?: boolean,
    autoTranslateLanguage?: string,
    autoStartReadAloud?: boolean
}


/**
 * Context type for the Analysis. Contains the configuration and the results of text extraction and analysis.
 *  
 */
export type IAnalysisContextType = {
    extractionResult: IPipelineResult,
    setExtractionResult: (result: IPipelineResult) => void

    analysisResult: IPipelineResult,
    setAnalysisResult: (result: IPipelineResult) => void

    isExtracting: boolean,
    setExtracting: (b: boolean) => void,

    isAnalyzing: boolean,
    setAnalyzing: (b: boolean) => void,

    hasResult: boolean,
    setHasResult: (b: boolean) => void,

    hasError: boolean,
    setHasError: (b: boolean) => void,

    options: IAnalysisOptions,
    setOptions: (options: IAnalysisOptions) => void,


}

/**
 * Create the AnalysisContext
 */
export const AnalysisContext = React.createContext<IAnalysisContextType>({
    extractionResult: {},
    setExtractionResult: result => console.log(result),
    analysisResult: {},
    setAnalysisResult: result => console.log(result),
    isExtracting: false,
    setExtracting: b => console.log(b),
    isAnalyzing: false,
    setAnalyzing: b => console.log(b),
    hasResult: false,
    setHasResult: b => console.log(b),
    hasError: false,
    setHasError: b => console.log(b),
    options: {},
    setOptions: options => console.log(options)

});

export const useAnalysisContext = () => useContext(AnalysisContext);