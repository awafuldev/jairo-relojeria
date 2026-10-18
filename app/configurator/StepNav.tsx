'use client'

import { useConfiguratorStore } from '@/lib/store'

interface StepNavProps {
  mobile?: boolean
}

export default function StepNav({ mobile }: StepNavProps) {
  const { categories, currentStepIndex, selections, setCurrentStep } = useConfiguratorStore()

  if (mobile) {
    return (
      <div className="flex flex-col gap-2">
        {/* Horizontal scrollable category pill bar */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {categories.map((cat, i) => {
            const isCompleted = !!selections[cat.id]
            const isActive = i === currentStepIndex

            return (
              <button
                key={cat.id}
                onClick={() => setCurrentStep(i)}
                className={`px-3 py-1.5 rounded-[3px] font-cabin text-[10px] uppercase tracking-[0.1em] whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                  isActive
                    ? 'bg-[#0a0d0f] text-[#ffffff] border-[#0a0d0f] font-semibold ring-1 ring-[#1dd8e1]'
                    : isCompleted
                    ? 'bg-[#f7f7f7] text-[#0a0d0f] border-[#d5d6d7]'
                    : 'bg-[#ffffff] text-[#2e3438] border-[#d5d6d7]'
                }`}
              >
                <span className={isActive ? 'text-[#1dd8e1]' : 'text-[#2e3438]'}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{cat.name}</span>
                {isCompleted && <span className="text-[#1dd8e1] font-bold text-[9px]">✓</span>}
              </button>
            )
          })}
          {/* Review Pill */}
          <button
            onClick={() => setCurrentStep(categories.length)}
            className={`px-3 py-1.5 rounded-[3px] font-cabin text-[10px] uppercase tracking-[0.1em] whitespace-nowrap transition-all shrink-0 border ${
              currentStepIndex === categories.length
                ? 'bg-[#0a0d0f] text-[#ffffff] border-[#0a0d0f] font-semibold ring-1 ring-[#1dd8e1]'
                : 'bg-[#ffffff] text-[#2e3438] border-[#d5d6d7]'
            }`}
          >
            Revisión Final
          </button>
        </div>
      </div>
    )
  }

  // Desktop vertical sidebar
  return (
    <div className="flex flex-col px-3 gap-1">
      <div className="px-3 pb-3 mb-2 border-b border-[#f7f7f7]">
        <p className="font-cabin text-[9px] uppercase tracking-[0.14em] text-[#2e3438]">Configurador</p>
        <p className="font-jost text-[13px] font-bold uppercase tracking-[0.08em] text-[#0a0d0f]">
          Componentes ({categories.length})
        </p>
      </div>

      <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-170px)] pr-1">
        {categories.map((cat, i) => {
          const isActive = i === currentStepIndex
          const isCompleted = !!selections[cat.id]

          return (
            <button
              key={cat.id}
              onClick={() => setCurrentStep(i)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-[3px] transition-all group font-cabin text-[11px] uppercase tracking-[0.08em] ${
                isActive
                  ? 'bg-[#0a0d0f] text-[#ffffff] font-semibold'
                  : 'hover:bg-[#f7f7f7] text-[#2e3438]'
              }`}
            >
              {/* Step Number */}
              <span
                className={`font-mono text-[10px] w-4 shrink-0 tabular-nums ${
                  isActive ? 'text-[#1dd8e1] font-bold' : 'text-[#2e3438]'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Category Name */}
              <span className="truncate flex-1">
                {cat.name}
              </span>

              {/* Status Indicator */}
              {isCompleted ? (
                <span className={`text-[11px] shrink-0 font-bold ${isActive ? 'text-[#1dd8e1]' : 'text-[#0a0d0f]'}`}>
                  ✓
                </span>
              ) : cat.isRequired ? (
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-[#1dd8e1]' : 'bg-[#d5d6d7]'}`} />
              ) : (
                <span className="font-cabin text-[8px] text-[#2e3438] shrink-0">Opc</span>
              )}
            </button>
          )
        })}

        {/* Final Review Step */}
        <button
          onClick={() => setCurrentStep(categories.length)}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left rounded-[3px] transition-all mt-3 border-t border-[#f7f7f7] font-cabin text-[11px] uppercase tracking-[0.08em] ${
            currentStepIndex === categories.length
              ? 'bg-[#0a0d0f] text-[#ffffff] font-semibold'
              : 'hover:bg-[#f7f7f7] text-[#0a0d0f]'
          }`}
        >
          <span className="font-mono text-[10px] w-4 shrink-0 text-[#1dd8e1]">
            {String(categories.length + 1).padStart(2, '0')}
          </span>
          <span className="flex-1">Revisión Final</span>
          <span className="text-[10px]">→</span>
        </button>
      </div>
    </div>
  )
}
