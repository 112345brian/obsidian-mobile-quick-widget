import type { DashboardWidgetDefinition } from '../DashboardWidgetApi.ts';

import { continueWidget } from './continue.ts';
import { gitWidget } from './git.ts';
import { graphWidget } from './graph.ts';
import { moreActionsWidget } from './moreActions.ts';
import { pomodoroWidget } from './pomodoro.ts';
import { radialLauncherWidget } from './radialLauncher.ts';
import { tasksWidget } from './tasks.ts';

/**
 * Every ReadyBoard built-in widget, expressed through the exact same
 * DashboardWidgetDefinition shape a third-party plugin would use. There is
 * no separate "built-in" code path in DashboardContent — these are
 * registered into the same DashboardWidgetRegistry as anything else.
 */
export const BUILTIN_WIDGETS: DashboardWidgetDefinition[] = [
  continueWidget,
  graphWidget,
  radialLauncherWidget,
  tasksWidget,
  moreActionsWidget,
  pomodoroWidget,
  gitWidget,
];
