'use client';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function FormProgress({ currentStep, totalSteps, steps }: FormProgressProps) {
  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 flex rounded-full bg-gray-200">
          <div
            style={{ width: `${((currentStep) / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
          />
        </div>
      </div>

      {/* Step Labels */}
      <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-center ${
              index < currentStep
                ? 'text-blue-600 font-semibold'
                : index === currentStep
                ? 'text-gray-900 font-bold'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                index < currentStep
                  ? 'bg-blue-600 text-white'
                  : index === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <p className="text-xs hidden sm:block">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
