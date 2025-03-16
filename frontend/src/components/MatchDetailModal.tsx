import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Match } from '../api/api';

interface MatchDetailModalProps {
  visible: boolean;
  match: Match | null;
  matchStatistics: any;
  matchPlayers: any;
  onClose: () => void;
}

const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ 
  visible, 
  match, 
  matchStatistics, 
  onClose 
}) => {
  if (!match) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <ScrollView>
            {!matchStatistics ? (
              <ActivityIndicator size="large" color="#0066cc" />
            ) : (
              <>
                <View style={styles.matchHeader}>
                  <Text style={styles.matchTitle}>경기 상세 정보</Text>
                  <Text style={styles.matchDate}>{match.date}</Text>
                </View>

                <View style={styles.scoreContainer}>
                  <View style={styles.teamContainer}>
                    <Text style={styles.teamName}>
                      {matchStatistics?.match_info?.home_team || match.homeTeam?.team_long_name || `팀 ${match.home_team_api_id}`}
                    </Text>
                    <Text style={styles.score}>{match.home_team_goal}</Text>
                  </View>
                  <Text style={styles.versus}>vs</Text>
                  <View style={styles.teamContainer}>
                    <Text style={styles.teamName}>
                      {matchStatistics?.match_info?.away_team || match.awayTeam?.team_long_name || `팀 ${match.away_team_api_id}`}
                    </Text>
                    <Text style={styles.score}>{match.away_team_goal}</Text>
                  </View>
                </View>

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>경기 통계</Text>
                  
                  <View style={styles.statRow}>
                    <Text style={styles.statValue}>
                      {Math.round(matchStatistics?.statistics?.possession?.home || 0)}%
                    </Text>
                    <Text style={styles.statLabel}>점유율</Text>
                    <Text style={styles.statValue}>
                      {Math.round(matchStatistics?.statistics?.possession?.away || 0)}%
                    </Text>
                  </View>
                  
                  <View style={styles.statRow}>
                    <Text style={styles.statValue}>
                      {matchStatistics?.statistics?.shots?.on?.home || 0}
                    </Text>
                    <Text style={styles.statLabel}>유효 슈팅</Text>
                    <Text style={styles.statValue}>
                      {matchStatistics?.statistics?.shots?.on?.away || 0}
                    </Text>
                  </View>
                  
                  <View style={styles.statRow}>
                    <Text style={styles.statValue}>
                      {matchStatistics?.statistics?.shots?.off?.home || 0}
                    </Text>
                    <Text style={styles.statLabel}>슈팅</Text>
                    <Text style={styles.statValue}>
                      {matchStatistics?.statistics?.shots?.off?.away || 0}
                    </Text>
                  </View>
                  
                  <View style={styles.statRow}>
                    <Text style={styles.statValue}>
                      {matchStatistics?.statistics?.corners || 0}
                    </Text>
                    <Text style={styles.statLabel}>코너킥</Text>
                    <Text style={styles.statValue}>
                      {matchStatistics?.statistics?.corners || 0}
                    </Text>
                  </View>
                  
                  <View style={styles.statRow}>
                    <Text style={styles.statValue}>
                      {matchStatistics?.statistics?.fouls || 0}
                    </Text>
                    <Text style={styles.statLabel}>파울</Text>
                    <Text style={styles.statValue}>
                      {matchStatistics?.statistics?.fouls || 0}
                    </Text>
                  </View>
                </View>

                {matchStatistics?.players && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>선수 명단</Text>
                    
                    <Text style={styles.teamSubtitle}>
                      {matchStatistics.players.homeTeam?.team_name || match.homeTeam?.team_long_name || `홈팀 (${match.home_team_api_id})`}
                    </Text>
                    {matchStatistics.players.homeTeam?.players?.map((player: any) => (
                      <View key={player.id} style={styles.playerRow}>
                        <Text style={styles.playerNumber}>{player.number}</Text>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <Text style={styles.playerPosition}>{player.position}</Text>
                      </View>
                    ))}
                    
                    <Text style={[styles.teamSubtitle, styles.awayTeam]}>
                      {matchStatistics.players.awayTeam?.team_name || match.awayTeam?.team_long_name || `원정팀 (${match.away_team_api_id})`}
                    </Text>
                    {matchStatistics.players.awayTeam?.players?.map((player: any) => (
                      <View key={player.id} style={styles.playerRow}>
                        <Text style={styles.playerNumber}>{player.number}</Text>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <Text style={styles.playerPosition}>{player.position}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  matchHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  matchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  matchDate: {
    fontSize: 16,
    color: '#666',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  versus: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 10,
  },
  sectionContainer: {
    marginBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 80,
    textAlign: 'center',
  },
  teamSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
  },
  awayTeam: {
    marginTop: 20,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playerNumber: {
    width: 40,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 5,
    marginRight: 10,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
  },
  playerPosition: {
    width: 40,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});

export default MatchDetailModal;