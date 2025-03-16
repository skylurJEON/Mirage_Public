import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Modal,
  SafeAreaView,
  StatusBar,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { 
  fetchLeagues, 
  fetchMatches, 
  fetchMatchById,
  getMatchStatistics,
  fetchMatchesByLeague,
  getMatchPlayers,
  searchTeam, 
  searchPlayer, 
  League, 
  Match, 
  Team, 
  Player 
} from '../api/api';
import MatchDetailModal from '../components/MatchDetailModal';

export default function DataScreen() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchDetail, setMatchDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [showMatchDetail, setShowMatchDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'teams' | 'players'>('teams');
  const [searchResults, setSearchResults] = useState<Team[] | Player[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [matchStatistics, setMatchStatistics] = useState<any>(null);
  const [matchPlayers, setMatchPlayers] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    try {
      setLoading(true);
      const data = await fetchLeagues();
      setLeagues(data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async (leagueId: number) => {
    try {
      setMatchLoading(true);
      const response = await fetchMatchesByLeague(leagueId);
      setMatches(Array.isArray(response) ? response : response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setMatchLoading(false);
    }
  };

  const loadMatchDetail = async (matchId: number) => {
    try {
      setMatchLoading(true);
      const detail = await fetchMatchById(matchId);
      const statistics = await getMatchStatistics(matchId);
      const players = await getMatchPlayers(matchId);
      
      console.log('Match statistics:', JSON.stringify(statistics, null, 2));
    
      
      setSelectedMatch(detail);
      setMatchStatistics(statistics);
      setMatchPlayers(players);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching match detail:', error);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleLeagueSelect = (league: League) => {
    setSelectedLeague(league);
    setShowLeagueModal(false);
    loadMatches(league.id);
  };

  const handleMatchPress = (match: Match) => {
    setSelectedMatch(match);
    setShowMatchDetail(true);
    loadMatchDetail(match.id);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearchLoading(true);
      const result = searchType === 'teams' ? await searchTeam(searchQuery) : await searchPlayer(searchQuery);
      setSearchResults(result);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const renderLeagueItem = ({ item }: { item: League }) => (
    <TouchableOpacity 
      style={styles.leagueItem}
      onPress={() => handleLeagueSelect(item)}
    >
      <Text style={styles.leagueName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderMatchItem = ({ item }: { item: Match }) => {
    // 팀 이름 가져오기 (API 응답에 따라 조정 필요)
    const homeTeamName = item.homeTeam?.team_short_name || `팀 ${item.home_team_api_id}`;
    const awayTeamName = item.awayTeam?.team_short_name || `팀 ${item.away_team_api_id}`;
    
    return (
      <TouchableOpacity 
        style={styles.matchItem}
        onPress={() => handleMatchPress(item)}
      >
        <Text style={styles.matchDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.matchTitle}>{homeTeamName} vs {awayTeamName}</Text>
        <Text style={styles.matchScore}>{item.home_team_goal} - {item.away_team_goal}</Text>
      </TouchableOpacity>
    );
  };

  const renderSearchItem = ({ item }: { item: Team | Player }) => {
    if ('team_long_name' in item) {
      return (
        <View style={styles.searchItem}>
          <Text style={styles.searchTitle}>{item.team_long_name}</Text>
          <Text>{item.team_short_name}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.searchItem}>
          <Text style={styles.searchTitle}>{item.player_name}</Text>
          <Text>Height: {item.height} cm</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContainer}>
          {/* 검색 UI */}
          {/* <View style={styles.searchContainer}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search teams or players..." 
              value={searchQuery} 
              onChangeText={setSearchQuery}
            />
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                onPress={() => setSearchType('teams')} 
                style={[styles.toggleButton, searchType === 'teams' && styles.activeToggle]}
              >
                <Text>Teams</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSearchType('players')} 
                style={[styles.toggleButton, searchType === 'players' && styles.activeToggle]}
              >
                <Text>Players</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View> */}

          {/* 리그 선택 */}
          <TouchableOpacity 
            style={styles.leagueSelector} 
            onPress={() => setShowLeagueModal(true)}
          >
            <Text style={styles.leagueSelectorText}>
              {selectedLeague ? selectedLeague.name : 'Select League'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {matchLoading ? (
            <ActivityIndicator size="large" color="#0066cc" />
          ) : (
            <FlatList
              data={matches}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderMatchItem}
              ListEmptyComponent={<Text style={styles.noData}>No matches found</Text>}
            />
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* 리그 선택 모달 */}
      <Modal
        visible={showLeagueModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLeagueModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={leagues}
              renderItem={renderLeagueItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </View>
      </Modal>

      {/* 경기 상세 정보 모달 */}
      <MatchDetailModal
        visible={showMatchDetail}
        match={selectedMatch}
        matchStatistics={matchStatistics}
        matchPlayers={matchPlayers}
        onClose={() => setShowMatchDetail(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8',
      padding: 20,
    },
    mainContainer: {
      flex: 1,
    },
    searchContainer: { 
      marginVertical: 10, 
      alignItems: 'center' 
    },
    searchInput: { 
      borderWidth: 1, 
      borderColor: '#ccc', 
      padding: 8, 
      width: '100%', 
      borderRadius: 5 
    },
    toggleContainer: { 
      flexDirection: 'row', 
      marginTop: 10 
    },
    toggleButton: { 
      padding: 10, 
      marginHorizontal: 5, 
      borderWidth: 1, 
      borderRadius: 5 
    },
    activeToggle: { 
      backgroundColor: '#007bff',
    },
    searchButton: { 
      marginTop: 10, 
      backgroundColor: '#007bff', 
      padding: 10, 
      borderRadius: 5 
    },
    searchButtonText: { 
      color: 'white', 
      fontWeight: 'bold' 
    },
    leagueSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ddd',
      padding: 12,
      borderRadius: 10,
      width: '100%',
      marginVertical: 10,
    },
    leagueSelectorText: {
      fontSize: 16,
      color: '#333',
      flex: 1,
    },
    dropdownIcon: {
      fontSize: 16,
      color: '#333',
    },
    leagueItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    leagueName: {
      fontSize: 16,
      color: '#333',
    },
    matchItem: {
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
    matchDate: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    matchTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    matchScore: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      maxHeight: '80%',
    },
    searchItem: {
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
    searchTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    noData: {
      textAlign: 'center',
      marginVertical: 20,
      color: '#666',
    },
  });