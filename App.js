import {Button, StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView} from 'react-native';
import {useState} from 'react';

const App = () => {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [stepNumber, setStepNumber] = useState(0);
    const [isXNext, setIsXNext] = useState(true);
    const [score, setScore] = useState({X: 0, O: 0});

    const currentBoard = history[stepNumber];
    const winnerInfo = calculateWinner(currentBoard);
    const winner = winnerInfo?.winner;

    const handleClick = (index) => {
        const boardCopy = [...currentBoard];
        if (boardCopy[index] || winner) return;

        boardCopy[index] = isXNext ? 'X' : 'O';

        const newHistory = history.slice(0, stepNumber + 1);
        setHistory([...newHistory, boardCopy]);
        setStepNumber(newHistory.length);
        setIsXNext(!isXNext);

        const newWinnerInfo = calculateWinner(boardCopy);
        if (newWinnerInfo?.winner) {
            const newScore = {...score};
            newScore[newWinnerInfo.winner]++;
            setScore(newScore);
        }
    };

    const jumpTo = (step) => {
        setStepNumber(step);
        setIsXNext(step % 2 === 0);
    };

    const resetGame = () => {
        setHistory([Array(9).fill(null)]);
        setStepNumber(0);
        setIsXNext(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Хрестики-Нулики</Text>
            <Text style={styles.score}>
                (X) {score.X} : {score.O} (O)
            </Text>

            <View style={styles.board}>
                {currentBoard.map((value, index) => {
                    const isWinningCell = winnerInfo?.line?.includes(index);
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.cell, isWinningCell && styles.winningCell]}
                            onPress={() => handleClick(index)}
                        >
                            <Text style={styles.cellText}>{value}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {winner ? (
                <View style={styles.winnerContainer}>
                    <Text style={styles.winnerText}>{winner} виграв!</Text>
                    <Button title="Нова гра" onPress={resetGame}/>
                </View>
            ) : (
                <Text style={styles.turnText}>
                    Черга гравця: {isXNext ? 'Хрестики (X)' : 'Нулики (O)'}
                </Text>
            )}

            <Text style={styles.historyTitle}>Ходи:</Text>
            <ScrollView style={styles.historyContainer}>
                {history.map((_, move) => (
                    <Button
                        key={move}
                        title={move === 0 ? 'Початок гри' : `Хід #${move}`}
                        onPress={() => jumpTo(move)}
                    />
                ))}
            </ScrollView>

            <StatusBar/>
        </View>
    );
};

export default App;

const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let [a, b, c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner: squares[a], line: [a, b, c]};
        }
    }
    return null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    score: {
        fontSize: 20,
        marginBottom: 10,
    },
    board: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    cell: {
        width: '33.33%',
        height: '33.33%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    winningCell: {
        backgroundColor: '#90ee90',
    },
    cellText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    winnerContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    winnerText: {
        fontSize: 20,
        marginBottom: 10,
        color: 'green',
    },
    turnText: {
        fontSize: 18,
        marginTop: 10,
    },
    historyTitle: {
        fontSize: 18,
        marginTop: 20,
        marginBottom: 5,
    },
    historyContainer: {
        maxHeight: 150,
        width: '100%',
    },
});
