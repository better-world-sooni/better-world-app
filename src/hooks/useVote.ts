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

const voteEventId = (postId) => `like-${postId}`

export default function useVote({initialVote, initialForVotesCount, initialAgainstVotesCount, initialAbstainVotesCount, postId}) {
    const [vote, setVote] = useState(initialVote)
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
    return {
        forVotesCount: initialForVotesCount + forVoteOffset, 
        againstVotesCount: initialAgainstVotesCount + againstVoteOffset, 
        abstainVotesCount: initialAbstainVotesCount+ abstainVoteOffset,
        hasVotedFor: vote == VoteCategory.For,
        hasVotedAgainst: vote == VoteCategory.Against,
        hasVotedAbstain: vote == VoteCategory.Abstain,
        handlePressVoteFor,
        handlePressVoteAgainst,
        handlePressVoteAbstain
    }
};