interface SkillBarProps {
  skill: string;
  percentage: number;
  color: string;
}

export function SkillBar({ skill, percentage, color }: SkillBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-700 dark:text-slate-300 capitalize">
          {skill}
        </span>
        <span className="font-medium text-slate-900 dark:text-white">
          {percentage}%
        </span>
      </div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full animate-progress`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
