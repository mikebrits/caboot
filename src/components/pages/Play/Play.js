import Error from '../Error';
import React, { useEffect, useState } from 'react';
import { gameStatuses, useGameByPin } from '../../../api/game.api';
import Spinner from '../../Spinner';
import { getPlayerForLocalGame } from '../../../helpers/localGameState';
import { useRouter } from 'next/router';
import Ended from './Ended';
import LobbyOpen from './LobbyOpen';
import AnsweringQuestion from './AnsweringQuestion';
import LobbyClosed from './LobbyClosed';
import Leaderboard from './Leaderboard';
import { useManageAutoAnswer } from './Play.hooks';
import Confetti from 'react-confetti';

const stateMap = {
    [gameStatuses.ended]: Ended,
    [gameStatuses.lobbyOpen]: LobbyOpen,
    [gameStatuses.lobbyClosed]: LobbyClosed,
    [gameStatuses.answeringQuestion]: AnsweringQuestion,
    [gameStatuses.allAnswered]: AnsweringQuestion,
    [gameStatuses.showLeaderboard]: Leaderboard,
    [gameStatuses.questionsFinished]: Leaderboard,
    default: AnsweringQuestion,
};

const Play = ({ pin }) => {
    const [{ player, game }, loading, error] = useGameByPin(pin);
    useManageAutoAnswer({ game, player, loading });
    const [playerScore, setPlayerScore] = useState(0);
    const [confettiPieces, setConfettiPieces] = useState(0);
    const router = useRouter();

    const celebrate = () => {
        console.log('Confett');
        setConfettiPieces(200);
        const timeout = setTimeout(() => {
            setConfettiPieces(0);
        }, 3000);
        return () => clearTimeout(timeout);
    };

    console.log({ game });

    useEffect(() => {
        if (game.status === gameStatuses.showAnswer) {
            setPlayerScore(player.score);
        }
    }, [game?.status]);

    if (error) {
        return <Error title={'There was an error loading your game'} text={error.toString()} />;
    }

    if (loading) {
        return <Spinner />;
    }

    if (!getPlayerForLocalGame(game.id)) {
        router.push(`/play/name?${pin}`);
    }

    const GameState = stateMap[game.status] || stateMap.default;

    return (
        <>
            <p>
                <b>{player?.name}</b>: {playerScore}
            </p>
            <div
                style={{
                    display: 'flex',
                    height: '75vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    // background: 'pink',
                }}
            >
                <div style={{ flex: '0 1 auto' }}>
                    <GameState game={game} player={player} onCorrectAnswer={celebrate} />
                </div>
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={confettiPieces}
                />
            </div>
        </>
    );
};

export default Play;
