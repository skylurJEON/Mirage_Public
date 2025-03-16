import axios from 'axios';

// 기본 API 주소 설정
const API_BASE_URL = 'http://localhost:3000';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export interface Team {
  id: number;
  name: string;
  team_long_name: string;
  team_short_name: string;
}

export interface League {
  id: number;
  name: string;
  country_id: number;
}

export interface Match {
  id: number;
  league_id: number;
  home_team_api_id: number;
  away_team_api_id: number; 
  home_team_goal: number;
  away_team_goal: number;
  date: string;
  homeTeam?: {
    team_long_name: string;
    team_short_name: string;
  };
  awayTeam?: {
    team_long_name: string;
    team_short_name: string;
  };
}

export interface Player {
  id: number;
  player_api_id: number;
  player_name: string;
  birthday: string;
  height: number;
  weight: number;
}

export interface Country {
  id: number;
  name: string;
}

export interface MatchResponse {
    data: Match[];
    meta: {
      page: number;
      last_page: number;
    };
  }
  

// 팀 API
export const fetchTeams = async (): Promise<Team[]> => {
  const response = await api.get<Team[]>('/teams');
  return response.data;
};

export const searchTeam = async (name: string): Promise<Team[]> => {
  const response = await api.get<Team[]>(`/teams/search?name=${name}`);
  return response.data;
};

export const fetchTeamById = async (id: number): Promise<Team> => {
  const response = await api.get<Team>(`/teams/${id}`);
  return response.data;
};



// 리그 API
export const fetchLeagues = async (): Promise<League[]> => {
  const response = await api.get<League[]>('/leagues');
  return response.data;
};

export const fetchLeaguesByCountry = async (countryId: number): Promise<League[]> => {
  const response = await api.get<League[]>(`/leagues/country/${countryId}`);
  return response.data;
};

export const fetchLeagueById = async (id: number): Promise<League> => {
  const response = await api.get<League>(`/leagues/${id}`);
  return response.data;
};



// 경기 API
export const fetchMatches = async ({ page = 1, limit = 20 }): Promise<MatchResponse> => {
  const response = await api.get<MatchResponse>(`/matches`, {
    params: { page, limit },
  });
  return response.data;
};

export const fetchMatchById = async (id: number): Promise<Match> => {
  const response = await api.get<Match>(`/matches/${id}`);
  return response.data;
};

export const fetchMatchesByLeague = async (leagueId: number): Promise<MatchResponse> => {
  const response = await api.get<MatchResponse>(`/matches/league/${leagueId}`);
  return response.data;
};

export const fetchMatchesByTeam = async (teamId: number): Promise<Match[]> => {
  const response = await api.get<Match[]>(`/matches/team/${teamId}`);
  return response.data;
};

export const fetchMatchesBySeason = async (season: string): Promise<Match[]> => {
  const response = await api.get<Match[]>(`/matches/season/${season}`);
  return response.data;
};

export const fetchMatchStatistics = async (id: number): Promise<any> => {
  const response = await api.get<any>(`/matches/${id}/statistics`);
  return response.data;
};

export const fetchMatchPlayers = async (id: number): Promise<Player[]> => {
  const response = await api.get<Player[]>(`/matches/${id}/players`);
  return response.data;
};

// 특정 경기의 통계 데이터 조회
export const getMatchStatistics = async (matchId: number) => {
  const response = await api.get(`/matches/${matchId}/statistics`);
  return response.data;
};
  
  // 특정 경기의 출전 선수 조회
export const getMatchPlayers = async (matchId: number) => {
  const response = await api.get(`/matches/${matchId}/players`);
  return response.data;
};


// 선수 API
export const fetchPlayers = async (): Promise<Player[]> => {
  const response = await api.get<Player[]>('/players');
  return response.data;
};

export const searchPlayer = async (name: string): Promise<Player[]> => {
  const response = await api.get<Player[]>(`/players/search?name=${name}`);
  return response.data;
};

export const fetchPlayerById = async (id: number): Promise<Player> => {
  const response = await api.get<Player>(`/players/${id}`);
  return response.data;
};

export const fetchPlayerAttributes = async (id: number): Promise<any> => {
  const response = await api.get<any>(`/players/${id}/attributes`);
  return response.data;
};



// 국가 API
export const fetchCountries = async (): Promise<Country[]> => {
  const response = await api.get<Country[]>('/countries');
  return response.data;
};

export const fetchCountryById = async (id: number): Promise<Country> => {
  const response = await api.get<Country>(`/countries/${id}`);
  return response.data;
};

export default api;  