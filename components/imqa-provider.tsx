"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// SDK 설정 타입 정의
export interface IMQASDKConfig {
  // Required fields
  collectorUrl: string;
  serviceName: string;
  serviceVersion: string;
  serviceKey: string;

  // Optional core settings
  serviceNamespace?: string;
  authorizationToken?: string;
  deploymentEnvironment?: string;

  // Features
  consoleCapture: boolean;
  advancedNetworkCapture: boolean;
  disableReplay: boolean;
  captureMetrics: boolean;
  debug: boolean;
  samplingProbability: number;

  // Session & Storage
  sessionStorage: "cookie" | "localStorage";
  disablePreflight: boolean;

  // Protocol
  exporterProtocol: "json" | "proto";

  // Recording
  recordCanvas: boolean;
  maskAllInputs: boolean;
  maskAllText: boolean;
  maskClass: string;
  ignoreClass: string;
  blockClass: string;

  // Network
  websocket: boolean;
  socketio: boolean;
  ignoreUrls: string[];
  tracePropagationTargets: string[];
  webVitals: boolean;

  // Instrumentations
  instrumentations: {
    console: boolean;
    document: boolean;
    errors: boolean;
    fetch: boolean;
    interactions: boolean;
    longtask: boolean;
    visibility: boolean;
    connectivity: boolean;
    postload: boolean;
    socketio: boolean;
    websocket: boolean;
    webvitals: boolean;
    xhr: boolean;
  };
}

// 컨텍스트 타입 정의
interface IMQAContextType {
  isInitialized: boolean;
  config: IMQASDKConfig;
  updateConfig: (newConfig: Partial<IMQASDKConfig>) => void;
  initIMQA: () => Promise<void>;
  deinitIMQA: () => Promise<void>;
  toggleFeature: (
    feature: keyof Pick<
      IMQASDKConfig,
      | "consoleCapture"
      | "advancedNetworkCapture"
      | "disableReplay"
      | "debug"
      | "captureMetrics"
    >,
    value: boolean
  ) => void;
  autoReinit: boolean;
  setAutoReinit: (value: boolean) => void;
}

// 환경변수에서 기본값 가져오기
const getEnvConfig = (): Partial<IMQASDKConfig> => {
  return {
    collectorUrl: process.env.NEXT_PUBLIC_IMQA_COLLECTOR_URL || "",
    serviceName: process.env.NEXT_PUBLIC_IMQA_SERVICE_NAME || "",
    serviceVersion: process.env.NEXT_PUBLIC_IMQA_SERVICE_VERSION || "",
    serviceKey: process.env.NEXT_PUBLIC_IMQA_SERVICE_KEY || "",
    serviceNamespace: process.env.NEXT_PUBLIC_IMQA_SERVICE_NAMESPACE || "",
    deploymentEnvironment:
      process.env.NEXT_PUBLIC_IMQA_DEPLOYMENT_ENVIRONMENT || "development",
    debug: process.env.NEXT_PUBLIC_IMQA_DEBUG === "true",
    samplingProbability: parseFloat(
      process.env.NEXT_PUBLIC_IMQA_SAMPLING_PROBABILITY || "1"
    ),
    consoleCapture: process.env.NEXT_PUBLIC_IMQA_CONSOLE_CAPTURE === "true",
    advancedNetworkCapture:
      process.env.NEXT_PUBLIC_IMQA_ADVANCED_NETWORK_CAPTURE === "true",
    disableReplay: process.env.NEXT_PUBLIC_IMQA_DISABLE_REPLAY !== "false",
    captureMetrics: process.env.NEXT_PUBLIC_IMQA_CAPTURE_METRICS === "true",
  };
};

// 기본 설정
const createDefaultConfig = (): IMQASDKConfig => {
  const envConfig = getEnvConfig();

  return {
    // Required fields from env
    collectorUrl: envConfig.collectorUrl || "",
    serviceName: envConfig.serviceName || "",
    serviceVersion: envConfig.serviceVersion || "",
    serviceKey: envConfig.serviceKey || "",

    // Optional core settings
    serviceNamespace: envConfig.serviceNamespace || "",
    deploymentEnvironment: envConfig.deploymentEnvironment || "development",

    // Features
    consoleCapture: envConfig.consoleCapture ?? false,
    advancedNetworkCapture: envConfig.advancedNetworkCapture ?? false,
    disableReplay: envConfig.disableReplay ?? true,
    captureMetrics: envConfig.captureMetrics ?? false,
    debug: envConfig.debug ?? false,
    samplingProbability: envConfig.samplingProbability ?? 1,

    // Session & Storage
    sessionStorage: "localStorage",
    disablePreflight: false,

    // Protocol
    exporterProtocol: "proto",

    // Recording
    recordCanvas: false,
    maskAllInputs: false,
    maskAllText: false,
    maskClass: "imqa-mask",
    ignoreClass: "imqa-ignore",
    blockClass: "imqa-block",

    // Network
    websocket: false,
    socketio: false,
    ignoreUrls: [],
    tracePropagationTargets: [],
    webVitals: true,

    // Instrumentations
    instrumentations: {
      console: true,
      document: true,
      errors: true,
      fetch: true,
      interactions: true,
      longtask: true,
      visibility: true,
      connectivity: true,
      postload: true,
      socketio: false,
      websocket: false,
      webvitals: true,
      xhr: true,
    },
  };
};

// 기본 컨텍스트 값
const defaultContextValue: IMQAContextType = {
  isInitialized: false,
  config: createDefaultConfig(),
  updateConfig: () => {},
  initIMQA: async () => {},
  deinitIMQA: async () => {},
  toggleFeature: () => {},
  autoReinit: true,
  setAutoReinit: () => {},
};

const IMQAContext = createContext<IMQAContextType>(defaultContextValue);

export const useIMQA = () => useContext(IMQAContext);

export function IMQAProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [config, setConfig] = useState<IMQASDKConfig>(createDefaultConfig);
  const [autoReinit, setAutoReinit] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [imqaModule, setImqaModule] = useState<any>(null);

  // IMQA 모듈 로드
  useEffect(() => {
    const loadIMQA = async () => {
      try {
        const IMQAModule = await import("@imqa/web-agent");
        setImqaModule(IMQAModule.default);
      } catch (error) {
        console.error("Failed to load IMQA module:", error);
      }
    };
    loadIMQA();
  }, []);

  // 환경변수가 모두 설정되어 있는지 확인
  const hasRequiredEnvVars = useMemo(() => {
    return !!(
      config.collectorUrl &&
      config.serviceName &&
      config.serviceVersion &&
      config.serviceKey
    );
  }, [config]);

  // IMQA 초기화
  const initIMQA = useCallback(async () => {
    if (!imqaModule) {
      console.error("IMQA module not loaded");
      return;
    }

    if (!hasRequiredEnvVars) {
      console.error(
        "IMQA initialization failed: Missing required environment variables"
      );
      return;
    }

    try {
      await imqaModule.init({
        collectorUrl: config.collectorUrl,
        serviceName: config.serviceName,
        serviceVersion: config.serviceVersion,
        serviceKey: config.serviceKey,
        serviceNamespace: config.serviceNamespace || undefined,
        deploymentEnvironment: config.deploymentEnvironment || undefined,
        consoleCapture: config.consoleCapture,
        advancedNetworkCapture: config.advancedNetworkCapture,
        disableReplay: config.disableReplay,
        captureMetrics: config.captureMetrics,
        debug: config.debug,
        samplingProbability: config.samplingProbability,
        sessionStorage: config.sessionStorage,
        disablePreflight: config.disablePreflight,
        exporterProtocol: config.exporterProtocol,
        recordCanvas: config.recordCanvas,
        maskAllInputs: config.maskAllInputs,
        maskAllText: config.maskAllText,
        maskClass: config.maskClass,
        ignoreClass: config.ignoreClass,
        blockClass: config.blockClass,
        websocket: config.websocket,
        socketio: config.socketio,
        ignoreUrls: config.ignoreUrls,
        tracePropagationTargets: config.tracePropagationTargets,
        webVitals: config.webVitals,
        instrumentations: config.instrumentations,
      });
      setIsInitialized(true);
      console.log("IMQA initialized successfully");
    } catch (error) {
      console.error("IMQA initialization failed:", error);
      setIsInitialized(false);
    }
  }, [imqaModule, config, hasRequiredEnvVars]);

  // IMQA 종료
  const deinitIMQA = useCallback(async () => {
    if (!imqaModule) return;
    try {
      await imqaModule.deinit();
      setIsInitialized(false);
      console.log("IMQA deinitialized");
    } catch (error) {
      console.error("IMQA deinitialization failed:", error);
    }
  }, [imqaModule]);

  // 설정 업데이트
  const updateConfig = useCallback(
    (newConfig: Partial<IMQASDKConfig>) => {
      setConfig((prev) => {
        const updated = { ...prev, ...newConfig };
        return updated;
      });

      if (autoReinit && isInitialized) {
        deinitIMQA().then(() => {
          setTimeout(() => initIMQA(), 100);
        });
      }
    },
    [autoReinit, isInitialized, deinitIMQA, initIMQA]
  );

  // 기능 토글
  const toggleFeature = useCallback(
    (
      feature: keyof Pick<
        IMQASDKConfig,
        | "consoleCapture"
        | "advancedNetworkCapture"
        | "disableReplay"
        | "debug"
        | "captureMetrics"
      >,
      value: boolean
    ) => {
      updateConfig({ [feature]: value });
    },
    [updateConfig]
  );

  // 환경변수가 설정되어 있으면 자동 초기화
  useEffect(() => {
    if (imqaModule && hasRequiredEnvVars && autoReinit && !isInitialized) {
      initIMQA();
    }
  }, [imqaModule, hasRequiredEnvVars, autoReinit, isInitialized, initIMQA]);

  // IMQA 상태 동기화 (1초마다)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (imqaModule) {
  //       try {
  //         const actuallyInitialized = imqaModule.isInitialized?.() ?? false;
  //         if (actuallyInitialized !== isInitialized) {
  //           setIsInitialized(actuallyInitialized);
  //         }
  //       } catch {
  //         // Ignore errors
  //       }
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [imqaModule, isInitialized]);

  const contextValue = useMemo(
    () => ({
      isInitialized,
      config,
      updateConfig,
      initIMQA,
      deinitIMQA,
      toggleFeature,
      autoReinit,
      setAutoReinit,
    }),
    [
      isInitialized,
      config,
      updateConfig,
      initIMQA,
      deinitIMQA,
      toggleFeature,
      autoReinit,
    ]
  );

  return (
    <IMQAContext.Provider value={contextValue}>{children}</IMQAContext.Provider>
  );
}
