import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const routeTransitions = trigger('routeTransition', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: '0' }),
        animate('250ms ease-in-out', style({ opacity: '1' })),
      ],
      {
        optional: true,
      }
    ),
  ]),
]);
