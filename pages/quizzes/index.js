import { requiresAuth } from '../../src/helpers/withAuth';
import { useAllQuizzes, useDeleteQuiz, useStartQuiz } from '../../src/api/quizzes.api';
import React from 'react';
import Spinner from '../../src/components/Spinner';
import Link from 'next/link';
import NewQuiz from '../../src/components/NewQuiz';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { BsGear, BsPencil, BsPlay, BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Error from '../../src/components/pages/Error';

function Quizzes() {
    const [quizzes, loading, error] = useAllQuizzes();
    const deleteQuiz = useDeleteQuiz();
    const startQuiz = useStartQuiz();
    const handleDeleteQuiz = async (id) => {
        await deleteQuiz(id);
        toast.success('Quiz Deleted');
    };

    const handleStart = async (quiz) => {
        await startQuiz(quiz);
    };

    if (loading) return <Spinner />;
    if (error)
        return (
            <Error title={'Error'} text={'You probably dont have permission to view this page'} />
        );
    return (
        <>
            <List>
                {quizzes.map((quiz) => {
                    return (
                        <ListItem key={quiz.id}>
                            <ListItemText>
                                <Link href={`/quizzes/${quiz.id}`}>{quiz.title}</Link>
                            </ListItemText>
                            <ListItemSecondaryAction>
                                {quiz.status === 'WAITING' || quiz.status === 'IN_PROGRESS' ? (
                                    <Link href={`/quizzes/${quiz.id}/manage/${quiz.game}`}>
                                        <IconButton size={'small'}>
                                            <BsGear />
                                        </IconButton>
                                    </Link>
                                ) : (
                                    <IconButton
                                        size={'small'}
                                        onClick={() => {
                                            handleStart(quiz);
                                        }}
                                    >
                                        <BsPlay />
                                    </IconButton>
                                )}

                                <Link href={`/quizzes/${quiz.id}/edit`}>
                                    <IconButton size={'small'}>
                                        <BsPencil />
                                    </IconButton>
                                </Link>
                                <IconButton
                                    size={'small'}
                                    onClick={() => handleDeleteQuiz(quiz.id)}
                                >
                                    <BsTrash />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
            <NewQuiz />
        </>
    );
}

export default requiresAuth(Quizzes);
