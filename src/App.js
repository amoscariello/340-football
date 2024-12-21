import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

const Homepage = ({ leagues, onSelectLeague }) => {
  return (
    <div>
      <h1 className="homepage-header">340 - Football Stats & Predictions</h1>
      <div className="league-list">
        {leagues.map((league, index) => (
          <div key={index} className="league-card" onClick={() => onSelectLeague(league)}>
            <img src={league.logo} alt={`${league.name} Logo`} className="league-logo" />
            <p>{league.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeagueTeams = ({ leagueName, leagueLogo, teams, onSelectTeam, onBack }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  const getLeaderboardFilename = (leagueName) => `./data/${leagueName.replace(/\s+/g, '-').toLowerCase()}-leaderboard.json`;
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(getLeaderboardFilename(leagueName));
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard for ${leagueName}`);
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, [leagueName]);

  const getLogoFilename = (playerName) => `./images/${playerName.replace(/\s+/g, '-').toLowerCase()}-logo.png`;

  return (
    <div className="league-page-header">
      <div className="header-logo-container">
        <img 
          src={leagueLogo} 
          alt={`${leagueName} Logo`} 
          className="header-logo" 
        />
        <h1>{leagueName}</h1>
      </div>
    <div className="league-page">
      
      
      <div className="leaderboard-section">
        <h2>Leaderboard</h2>
        {leaderboard.length > 0 ? (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Team</th>
                <th>Pts</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GS</th>
                <th>GC</th>
                <th>GD</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((team, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{team.player}</td>
                  <td>{team.points}</td>
                  <td>{team.matches}</td>
                  <td>{team.win}</td>
                  <td>{team.draw}</td>
                  <td>{team.lost}</td>
                  <td>{team.GF}</td>
                  <td>{team.GA}</td>
                  <td>{team.GF-team.GA}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading leaderboard...</p>
        )}
      </div>

      
      <div className="team-selector-section">
        <h2>Select team to view data</h2>
        <div className="team-list">
          {teams.map((team, index) => (
            <div key={index} className="team-card" onClick={() => onSelectTeam(team)}>
              <img src={getLogoFilename(team.playerName)} alt={`${team.playerName} Logo`} className="team-logo" />
              <p>{team.playerName}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
      <button onClick={onBack} className="back-button">
        Back to Home Page
       </button>
    </div>
  );
};

const BarChartComponent = ({ teamData, onBack }) => {
  const { playerName, current, rating, points, matches, win, draw, lost, GF, GA, positions, last5, next5 } = teamData;
  const [chartData, setChartData] = useState([]);
  const [totalPositions, setTotalPositions] = useState(0);
  const [probabilities, setProbabilities] = useState({});

  useEffect(() => {
    const total = positions.reduce((acc, position) => acc + position, 0);
    setTotalPositions(total);

    const chartData = positions.map((position, index) => ({
      position: `#${index + 1}`,
      'position %': total > 0 ? (position / total) * 100 : 0,
    }));


    setChartData(chartData);

    if (total > 0) {
      const winProbability = positions[0] / total;
      const top4Probability = positions.slice(0, 4).reduce((acc, position) => acc + position, 0) / total; 
      const top8Probability = positions.slice(0, 8).reduce((acc, position) => acc + position, 0) / total; 
      const relegationProbability = positions.slice(-3).reduce((acc, position) => acc + position, 0) / total; 
      setProbabilities({
        win: (winProbability * 100).toFixed(2),
        top4: (top4Probability * 100).toFixed(2),
        top8: (top8Probability * 100).toFixed(2),
        relegation: (relegationProbability * 100).toFixed(2),
      });
    }
  }, [positions]);

  const getLogoFilename = (playerName) => `./images/${playerName.replace(/\s+/g, '-').toLowerCase()}-logo.png`;

  return (
    <div className="team-page-header">
      <div className="header-logo-container">
        <img 
          src={getLogoFilename(playerName)} 
          alt={`${playerName} Logo`} 
          className="header-logo" 
        />
        <h1>{playerName}</h1>
      </div>
      <div className="team-page">
      <div className="team-other-data-section">
      <h2>Current standing</h2>
      <table className="team-data-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Pts</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GS</th>
            <th>GC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{current}.</td>
            <td>{points}</td>
            <td>{matches}</td>
            <td>{win}</td>
            <td>{draw}</td>
            <td>{lost}</td>
            <td>{GF}</td>
            <td>{GA}</td>
          </tr>
        </tbody>
      </table>
        <h2>Last 5 matches:</h2>
        {last5.length > 0 ? (
          <table className="team-last-5-matches-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Team A</th>
                <th>Score</th>
                <th>Team B</th>
              </tr>
            </thead>
            <tbody>
              {last5.map((match, index) => (
                <tr key={index}>
                  <td className="column-date">{match.date}</td>
                  <td className="column-team">{match.team1}</td>
                  <td className="column-score">{match.score.ft[0]}-{match.score.ft[1]}</td>
                  <td className="column-team">{match.team2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Data not available.</p>
        )}
        <h2>Next 5 matches:</h2>
        {next5.length > 0 ? (
          <table className="team-last-5-matches-table">
            <thead>
              <tr>
                <th></th>
                <th>Team A</th>
                <th>Odds%</th>
                <th>Team B</th>
              </tr>
            </thead>
            <tbody>
              {next5.map((match, index) => (
                <tr key={index}>
                  <td className="column-date">{match.date}</td>
                  <td className="column-team">{match.team1}</td>
                  <td className="column-score">{match.score.ft[0]}/{match.score.ft[1]}</td>
                  <td className="column-team">{match.team2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Data not available.</p>
        )}
      </div>
      
      <div className="team-data-section">
      <h2>Team rating: {rating}</h2>
      <h2>Expected position (projection over {totalPositions} simulations)</h2>
      <table className="team-data-table">
            <thead>
              <tr>
                <th>Victory %</th>
                <th>Top 4 %</th>
                <th>Top 8 %</th>
                <th>Relegation %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{probabilities.win}%</td>
                <td>{probabilities.top4}%</td>
                <td>{probabilities.top8}%</td>
                <td>{probabilities.relegation}%</td>
              </tr>
            </tbody>
          </table>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="position" />
          <YAxis />
          <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
          <Legend />
          <Bar dataKey="position %" fill="red" />
        </BarChart>
      </ResponsiveContainer>
    

      
      </div>
    </div>
    <button onClick={onBack} className="back-button">
        Back to League Page
      </button>
    </div>
  );
};


const App = () => {
  const [leagues] = useState([
    { name: 'Serie A', logo: './images/serie-a-logo.png'},
    { name: 'Premier League', logo: './images/premier-league-logo.png' },
    { name: 'La Liga', logo: './images/la-liga-logo.png' },
    { name: 'Bundesliga', logo: './images/bundesliga-logo.png'},
    { name: 'Ligue 1', logo: './images/ligue-1-logo.png'},
  ]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    if (selectedLeague) {
      fetch(`./data/${selectedLeague.name.replace(/\s+/g, '-').toLowerCase()}-data.json`)
        .then((response) => response.json())
        .then((data) => setTeams(data))
        .catch((error) => console.error('Error fetching league data:', error));
    }
  }, [selectedLeague]);

  const handleBackToHomepage = () => {
    setSelectedTeam(null);
    setSelectedLeague(null);
  };

  const handleBackToLeague = () => {
    setSelectedTeam(null);
  };

  if (selectedTeam) {
    return <BarChartComponent teamData={selectedTeam} onBack={handleBackToLeague} />;
  }

  if (selectedLeague) {
    return <LeagueTeams leagueName={selectedLeague.name} leagueLogo={selectedLeague.logo} teams={teams} onSelectTeam={setSelectedTeam} onBack={handleBackToHomepage} />;
  }

  return <Homepage leagues={leagues} onSelectLeague={setSelectedLeague} />;
};

export default App;
