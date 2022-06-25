import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import apis from "src/modules/apis";
import { smallBump } from "src/utils/hapticFeedBackUtils";
import { usePostPromiseFnWithToken } from "src/redux/asyncReducer";
import { useGotoConfirmationModal } from "./useGoto";

export enum VoteCategory {
    Against = 0,
    For = 1,
}

const voteEventId = (postId) => `vote-${postId}`
const voteableEventId = (postId) => `votable-${postId}`

export default function useVote({initialVote, initialForVotesCount, initialAgainstVotesCount, votingDeadline, postId}) {
    const [vote, setVote] = useState(initialVote)
    const [votable, setVotable] = useState(!votingDeadline ||
        new Date(votingDeadline) > new Date());
    const forVoteOffset = initialVote == null && VoteCategory.For == vote ? 1 : 0;
    const againstVoteOffset = initialVote == null && VoteCategory.Against == vote ? 1 : 0;
    
    const postPromiseFnWithToken = usePostPromiseFnWithToken();
    const gotoConfirmation = useGotoConfirmationModal()
    useEffect(() => {
        setVote(initialVote);
        EventRegister.addEventListener(voteEventId(postId), (voteCategory) => {
            setVote(voteCategory)
        })
        return () => {
            EventRegister.removeEventListener(voteEventId(postId));
        }
    }, [initialVote]);
    useEffect(() => {
        setVotable(!votingDeadline ||
            new Date(votingDeadline) > new Date());
        EventRegister.addEventListener(voteableEventId(postId), (votable) => {
            setVotable(votable)
        })
        return () => {
            EventRegister.removeEventListener(voteableEventId(postId));
        }
    }, [votingDeadline]);
    const handlePressVoteFor = () => {
        handlePressVote(VoteCategory.For)
    };
    const handlePressVoteAgainst = () => {
        handlePressVote(VoteCategory.Against)
    };
    const confirmVote = (voteCategory) => {
        smallBump();
        postPromiseFnWithToken({url: apis.vote.postId(postId).url, body: {
            category: voteCategory
        }});
        setVote(voteCategory);
        EventRegister.emit(voteEventId(postId), voteCategory)
    }
    const handlePressVote = (voteCategory) => {
        if(vote == null){
            gotoConfirmation({onConfirm: () => confirmVote(voteCategory), text: `투표는 취소할 수 없습니다. \n${voteCategory == VoteCategory.For ? '찬성' : '반대'}하시겠습니까?`})
        }
    }
    const handleSetVotable = (value) => {
        EventRegister.emit(voteableEventId(postId), value)
    }
    return {
        votable,
        forVotesCount: initialForVotesCount + forVoteOffset, 
        againstVotesCount: initialAgainstVotesCount + againstVoteOffset,
        hasVotedFor: vote == VoteCategory.For,
        hasVotedAgainst: vote == VoteCategory.Against,
        handleSetVotable,
        handlePressVoteFor,
        handlePressVoteAgainst,
    }
};