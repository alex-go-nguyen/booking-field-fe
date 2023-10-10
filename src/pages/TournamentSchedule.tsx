import { Box, Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MatchDetail } from '@/components';
import { useLocale } from '@/locales';
import { Match } from '@/services/match/match.dto';
import { matchKeys } from '@/services/match/match.query';
import { Round } from '@/services/round/round.dto';
import { Team } from '@/services/team/team.dto';
import { TournamentTypeEnum } from '@/services/tournament/tournament.dto';
import { tournamentKeys } from '@/services/tournament/tournament.query';
import { acronym, convertRoundName, formatDateToTime, formatDateWithoutYear } from '@/utils';

export const TournamentSchedule = () => {
  const { formatMessage } = useLocale();

  const { id } = useParams();

  const [filterByRound, setFilterByRound] = useState<number | null>(null);

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const [rounds, setRounds] = useState<Round[]>();
  const [champion, setChampion] = useState<Team | null>(null);

  const tournamentInstance = tournamentKeys.detail(Number(id));
  const { data: tournament } = useQuery({ ...tournamentInstance });

  const matchInstance = matchKeys.list({ tournamentId: Number(id) });
  const { data: matches } = useQuery({ ...matchInstance, enabled: Boolean(tournament) });

  useEffect(() => {
    if (tournament && matches) {
      const filteredTournament =
        filterByRound === null
          ? tournament.data.rounds
          : tournament.data.rounds.filter((item) => item.no === filterByRound);
      setRounds(filteredTournament);

      if (tournament.data.type === TournamentTypeEnum.Knockout) {
        const finalMatch = matches.data[tournament.data.totalTeam - 2];

        if (finalMatch.hostGoals && finalMatch.guestGoals) {
          const championTeam = finalMatch.hostGoals > finalMatch?.guestGoals ? finalMatch?.host : finalMatch?.guest;
          setChampion(championTeam);
        }
      }
    }
  }, [filterByRound, tournament, matches]);

  return (
    tournament && (
      <Box paddingY={4}>
        {champion && <Typography marginY={1}>Đội vô địch: {champion.name}</Typography>}
        <Box display='flex' gap={2}>
          <Button
            variant={filterByRound === null ? 'contained' : 'outlined'}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() => setFilterByRound(null)}
          >
            {formatMessage({ id: 'app.tournament.schedule.filter.all' })}
          </Button>
          {tournament.data.rounds.map((round) => (
            <Button
              variant={filterByRound === round.no ? 'contained' : 'outlined'}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => setFilterByRound(round.no)}
              key={round.id}
            >
              {acronym(convertRoundName(round.no, tournament.data.rounds.length, tournament.data.type))}
            </Button>
          ))}
        </Box>
        {rounds?.map((round, roundId) => (
          <Box marginY={4} borderRadius={3} overflow='hidden' key={round.id}>
            <Box bgcolor='primary.main' padding={1} textAlign='center'>
              <Typography sx={{ color: 'primary.contrastText' }}>
                {convertRoundName(round.no, tournament.data.rounds.length, tournament.data.type)}
              </Typography>
            </Box>
            <Box bgcolor='secondary.light'>
              {round.matches.map((match) => (
                <Box
                  key={match.id}
                  paddingY={2}
                  display='flex'
                  justifyContent='space-between'
                  paddingX={2}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setSelectedMatch(match)}
                >
                  <Box display='flex' justifyContent='left' alignItems='center' gap={2} width={200}>
                    <Box
                      component='img'
                      src={
                        match.host?.avatar ||
                        'https://www.seekpng.com/png/full/28-289657_espn-soccer-team-logo-default.png'
                      }
                      alt={match.host?.name}
                      width={40}
                      height={40}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Typography textAlign='left'>
                      {match.host?.name || `Win ${convertRoundName(roundId - 1, rounds.length, tournament.data.type)} `}
                    </Typography>
                  </Box>
                  <Box
                    bgcolor={match.hostGoals && match.guestGoals ? 'primary.main' : 'primary.dark'}
                    color='primary.contrastText'
                    paddingY={1}
                    marginX={2}
                    minWidth={{ xs: 70, md: 100 }}
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    textAlign='center'
                    paddingX={1}
                  >
                    {match.hostGoals && match.guestGoals ? (
                      <Typography fontSize={{ xs: 16, md: 20 }} fontWeight={500}>
                        {match.hostGoals} - {match.guestGoals}
                      </Typography>
                    ) : match.time ? (
                      <Box>
                        <Typography display='block' fontWeight={700} fontSize={{ xs: 16, md: 20 }}>
                          {formatDateToTime(match.time)}
                        </Typography>
                        <Typography display='block' fontWeight={500}>
                          {formatDateWithoutYear(match.time)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant='body2' padding={1}>
                        {formatMessage({ id: 'app.tournament.schedule.no-schedule' })}
                      </Typography>
                    )}
                  </Box>

                  <Box display='flex' justifyContent='right' alignItems='center' gap={2} width={200}>
                    <Typography textAlign='right'>
                      {match.guest?.name ||
                        `Win ${convertRoundName(roundId - 1, rounds.length, tournament.data.type)} `}
                    </Typography>
                    <Box
                      component='img'
                      src={
                        match.guest?.avatar ||
                        'https://www.seekpng.com/png/full/28-289657_espn-soccer-team-logo-default.png'
                      }
                      alt={match.guest?.name}
                      width={40}
                      height={40}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
        {selectedMatch && (
          <MatchDetail isOpen={!!selectedMatch} onClose={() => setSelectedMatch(null)} data={selectedMatch} />
        )}
      </Box>
    )
  );
};
