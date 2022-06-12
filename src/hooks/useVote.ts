import { useEffect, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import apis from "src/modules/apis";
import { smallBump } from "src/modules/hapticFeedBackUtils";
import { usePostPromiseFnWithToken } from "src/redux/asyncReducer";

export enum VoteCategory {
    Against = 0,
    For = 1,
    Abstain = 2
}

const voteEventId = (postId) => `vote-${postId}`
const voteableEventId = (postId) => `votable-${postId}`

export default function useVote({initialVote, initialForVotesCount, initialAgainstVotesCount, initialAbstainVotesCount, votingDeadline, postId}) {
    const [vote, setVote] = useState(initialVote)
    const [votable, setVotable] = useState(!votingDeadline ||
        new Date(votingDeadline) > new Date());
    const forVoteOffset = initialVote == null && VoteCategory.For == vote ? 1 : 0;
    const againstVoteOffset = initialVote == null && VoteCategory.Against == vote ? 1 : 0;
    const abstainVoteOffset = initialVote == null && VoteCategory.Abstain == vote ? 1 : 0;
    
    const postPromiseFnWithToken = usePostPromiseFnWithToken();
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
    const handlePressVoteAbstain = () => {
        handlePressVote(VoteCategory.Abstain)
    }
    const handlePressVote = (voteCategory) => {
        if(vote == null){
            smallBump();
            postPromiseFnWithToken({url: apis.vote.postId(postId).url, body: {
                category: voteCategory
            }});
            setVote(voteCategory);
            EventRegister.emit(voteEventId(postId), voteCategory)
        }
    }
    const handleSetVotable = (value) => {
        EventRegister.emit(voteableEventId(postId), value)
    }
    return {
        votable,
        forVotesCount: initialForVotesCount + forVoteOffset, 
        againstVotesCount: initialAgainstVotesCount + againstVoteOffset, 
        abstainVotesCount: initialAbstainVotesCount+ abstainVoteOffset,
        hasVotedFor: vote == VoteCategory.For,
        hasVotedAgainst: vote == VoteCategory.Against,
        hasVotedAbstain: vote == VoteCategory.Abstain,
        handleSetVotable,
        handlePressVoteFor,
        handlePressVoteAgainst,
        handlePressVoteAbstain
    }
};