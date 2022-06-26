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

export enum VotingStatus {
    Rejected = 0,
    Approved = 1,
    Error = 2,
}

const voteEventId = (postId) => `vote-${postId}`
const votingStatusEventId = (postId) => `votingStatus-${postId}`

export default function useVote({initialVote, initialForVotesCount, initialAgainstVotesCount, initialVotingStatus, postId}) {
    const [vote, setVote] = useState(initialVote)
    const [votingStatus, setVotingStatus] = useState(initialVotingStatus);
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
        setVotingStatus(initialVotingStatus);
        EventRegister.addEventListener(votingStatusEventId(postId), (votingStatus) => {
            setVotingStatus(votingStatus)
        })
        return () => {
            EventRegister.removeEventListener(votingStatusEventId(postId));
        }
    }, [initialVotingStatus]);
    const handlePressVoteFor = () => {
        handlePressVote(VoteCategory.For)
    };
    const handlePressVoteAgainst = () => {
        handlePressVote(VoteCategory.Against)
    };
    const confirmVote = async (voteCategory) => {
        smallBump();
        const {data} = await postPromiseFnWithToken({url: apis.vote.postId(postId).url, body: {
            category: voteCategory
        }});
        if(data.success){
            EventRegister.emit(voteEventId(postId), voteCategory)
            EventRegister.emit(votingStatusEventId(postId), data.voting_status)
        } else {
            EventRegister.emit(votingStatusEventId(postId), VotingStatus.Error)
        }
    }
    const handlePressVote = (voteCategory) => {
        if(vote == null){
            gotoConfirmation({onConfirm: () => confirmVote(voteCategory), text: `투표는 취소할 수 없습니다. \n${voteCategory == VoteCategory.For ? '찬성' : '반대'}하시겠습니까?`})
        }
    }
    const handleSetVotable = (value) => {
        EventRegister.emit(votingStatusEventId(postId), value)
    }
    return {
        votingStatus,
        forVotesCount: initialForVotesCount + forVoteOffset, 
        againstVotesCount: initialAgainstVotesCount + againstVoteOffset,
        hasVotedFor: vote == VoteCategory.For,
        hasVotedAgainst: vote == VoteCategory.Against,
        handleSetVotable,
        handlePressVoteFor,
        handlePressVoteAgainst,
    }
};