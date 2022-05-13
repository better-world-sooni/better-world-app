import { useNavigation } from "@react-navigation/native";
import apis from "src/modules/apis";
import { NAV_NAMES } from "src/modules/navNames";
import { useApiGETWithToken } from "src/redux/asyncReducer";

export function useGotoNftProfile({contractAddress, tokenId}){
    const apiGETWithToken = useApiGETWithToken()
    const navigation = useNavigation()
    const goToProfile = () => {
        apiGETWithToken(
            apis.nft.contractAddressAndTokenId(
                contractAddress,
              tokenId,
            ),
          );
          navigation.navigate(NAV_NAMES.OtherProfile, {
            contractAddress,
            tokenId
          });
      }
      return goToProfile
}

export function useGotoProfile(){
  const navigation = useNavigation()
  const goToProfile = () => {
        navigation.navigate(NAV_NAMES.Profile);
    }
    return goToProfile
}

export function useGotoNftCollectionProfile({contractAddress}){
    const apiGETWithToken = useApiGETWithToken()
    const navigation = useNavigation()
    const goToProfile = () => {
        apiGETWithToken(
            apis.nft_collection.contractAddress.profile(
                contractAddress
            ),
          );
          navigation.navigate(NAV_NAMES.NftCollection, {
            contractAddress
          });
      }
      return goToProfile
}

export function useGotoPost({postId}){
  const apiGETWithToken = useApiGETWithToken()
  const navigation = useNavigation()
  const goToPost = () => {
    apiGETWithToken(apis.post.postId._(postId));
    navigation.navigate(NAV_NAMES.Post, {postId});
  }
  return goToPost
}

export function useGotoNewPost({postOwnerType}){
  const navigation = useNavigation()
  const goToPost = () => {
    navigation.navigate(NAV_NAMES.NewPost, {postOwnerType});
  }
  return goToPost
}

export function useGotoCapsule({nft}) {
  const navigation = useNavigation()
  const goToCapsule = () => {
    navigation.navigate(NAV_NAMES.Capsule, {
      nft,
    })
  };
  return goToCapsule
}