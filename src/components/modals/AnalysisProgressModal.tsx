import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface AnalysisProgressModalProps {
  isOpen: boolean;
  districtName: string;
  onComplete: () => void;
  onClose: () => void;
}

export const AnalysisProgressModal: React.FC<AnalysisProgressModalProps> = ({
  isOpen,
  districtName,
  onComplete,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { num: 1, title: 'Image Acquisition', detail: `Querying Sentinel-2 cloud-free pairs for ${districtName}` },
    { num: 2, title: 'Alignment & Registration', detail: 'Sub-pixel co-registration RMSE < 0.15px verification' },
    { num: 3, title: 'Change Detection', detail: 'Computing spectral difference indices (NDVI / NDBI / NDWI)' },
    { num: 4, title: 'Classification', detail: 'GeoFind CNN model categorizing change polygons' },
    { num: 5, title: 'Result Generation', detail: `Extracting suspicious sector boundaries for ${districtName}` },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 5;
        }
        return prev + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Satellite Analysis Pipeline
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Analyzing {districtName} bounds in Tamil Nadu
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
            Step {currentStep}/5
          </span>
        </div>

        {/* Pipeline Step List */}
        <div className="space-y-4">
          {steps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div
                key={step.num}
                className={`p-3 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                    : isDone
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                    : 'bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">
                      {step.num}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{step.title}</span>
                      {isDone && <span className="text-[10px] text-emerald-600 font-semibold">Done</span>}
                      {isCurrent && <span className="text-[10px] text-indigo-600 font-semibold animate-pulse">Running...</span>}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
