import { StateEnum } from '@/pages';

export type CreateTournamentPayload = {
  name: string;
  cover: string;
  phone: string;
  mode: StateEnum;
  venue: number;
  totalTeams: number;
  totalLineup: number;
};
