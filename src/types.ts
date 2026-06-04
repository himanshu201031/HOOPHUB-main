/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EventOrganizer {
  name: string;
  role: string;
  avatarClass: string;
}

export interface EventDetail {
  title: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  distance: string;
  organizer: EventOrganizer;
  joinedCount: number;
  maxCount: number;
}

export interface StatItem {
  value: string;
  label: string;
  badgeText: string;
  badgeType: 'up' | 'neutral' | 'down';
}

export interface StepItem {
  id: string;
  number: string;
  title: string;
  description: string;
}
