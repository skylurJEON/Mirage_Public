import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { 
  fetchTeams, fetchLeagues, fetchMatches, fetchPlayers, fetchCountries, 
  Team, League, Match, Player, Country 
} from '../api/api';

const DataScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Teams' | 'Leagues' | 'Matches' | 'Players' | 'Countries'>('Matches');
  const [data, setData] = useState<Team[] | League[] | Match[] | Player[] | Country[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const isFetched = useRef<{ [key: string]: boolean }>({});

  
  const loadData = async (tab: typeof activeTab, page: number = 1) => {
    try {

        if (isFetched.current[tab]) return; // 이미 호출된 경우 실행하지 않음
        isFetched.current[tab] = true;

      setLoading(true);
      let result: Team[] | League[] | Match[] | Player[] | Country[] = [];

      if (tab === 'Teams') {
        result = await fetchTeams();
      } else if (tab === 'Leagues') {
        result = await fetchLeagues();
      } else if (tab === 'Matches') {
        const response = await fetchMatches({ page, limit: 20 });
        const matchData: Match[] = response.data; 
        result = page === 1 ? matchData : [...(data as Match[]), ...matchData]; 
        setHasMore(response.meta.page < response.meta.last_page);
      } else if (tab === 'Players') {
        result = await fetchPlayers();
      } else if (tab === 'Countries') {
        result = await fetchCountries();
      }

      setData(result);
      setCurrentPage(page);
    } catch (error) {
      console.error(`Error fetching ${tab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTab, 1);
  }, [activeTab]);

  // 페이지네이션
  const loadMoreData = () => {
    if (!loading && hasMore) {
      loadData(activeTab, currentPage + 1);
    }
  };

  // UI 렌더링
  const renderItem = ({ item }: { item: Team | League | Match | Player | Country }) => {
    if (activeTab === 'Teams') {
      const team = item as Team;
      return (
        <View style={styles.card}>
          <Text style={styles.title}>{team.name}</Text>
        </View>
      );
    } else if (activeTab === 'Leagues') {
      const league = item as League;
      return (
        <View style={styles.card}>
          <Text style={styles.title}>{league.name}</Text>
          <Text style={styles.subtitle}>Country ID: {league.country_id}</Text>
        </View>
      );
    } else if (activeTab === 'Matches') {
      const match = item as Match;
      return (
        <View style={styles.card}>
          <Text style={styles.title}> Match {match.id}</Text>
          <Text style={styles.subtitle}>{match.home_team_api_id} vs {match.away_team_api_id}</Text>
          <Text style={styles.subtitle}>Score: {match.home_team_goal} - {match.away_team_goal}</Text>
          <Text style={styles.subtitle}>Date: {match.date}</Text>
        </View>
      );
    } else if (activeTab === 'Players') {
      const player = item as Player;
      return (
        <View style={styles.card}>
          <Text style={styles.title}>{player.player_name}</Text>
          <Text style={styles.subtitle}>Height: {player.height} cm</Text>
          <Text style={styles.subtitle}>Weight: {player.weight} kg</Text>
        </View>
      );
    } else if (activeTab === 'Countries') {
      const country = item as Country;
      return (
        <View style={styles.card}>
          <Text style={styles.title}>{country.name}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* 탭 버튼 */}
      <View style={styles.tabContainer}>
        {['Teams', 'Leagues', 'Matches', 'Players', 'Countries'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)} style={[styles.tabButton, activeTab === tab && styles.activeTab]}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 데이터 리스트 */}
      {loading && currentPage === 1 ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <FlatList
          data={data as any}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onEndReached={loadMoreData} 
          onEndReachedThreshold={0.5} // 스크롤 50% 이하에서 로드
          ListFooterComponent={loading ? <ActivityIndicator size="small" color="#007bff" /> : null}
        />
      )}
    </View>
  );
};

export default DataScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  loader: {
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});