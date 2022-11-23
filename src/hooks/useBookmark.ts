import {useEffect, useState} from 'react';
import {EventRegister} from 'react-native-event-listeners';
import apis from 'src/modules/apis';
import {smallBump} from 'src/utils/hapticFeedBackUtils';
import {usePromiseFnWithToken} from 'src/redux/asyncReducer';

export enum BookmarkableType {
  Comment = 'Comment',
  Post = 'Post',
  DrawEvent = 'DrawEvent',
}

const bookmarkEventId = (bookmarkableType, bookmarkableId) =>
  `bookmark-${bookmarkableType}-${bookmarkableId}`;

export default function useBookmark(
  initialBookmarked,
  bookmarkableType,
  bookmarkableId,
) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const promiseFnWithToken = usePromiseFnWithToken();
  useEffect(() => {
    setBookmarked(initialBookmarked);
    const listenerId = EventRegister.addEventListener(
      bookmarkEventId(bookmarkableType, bookmarkableId),
      data => {
        setBookmarked(data);
      },
    );
    return () => {
      if (typeof listenerId == 'string')
        EventRegister.removeEventListener(listenerId);
    };
  }, [initialBookmarked]);
  const handlePressBookmark = () => {
    const method = bookmarked ? 'DELETE' : 'POST';
    const apiFn =
      bookmarkableType == BookmarkableType.DrawEvent
        ? apis.bookmark.drawEvent
        : null;
    if (!bookmarked) smallBump();
    promiseFnWithToken({url: apiFn(bookmarkableId).url, method});
    EventRegister.emit(
      bookmarkEventId(bookmarkableType, bookmarkableId),
      !bookmarked,
    );
  };
  return [bookmarked, handlePressBookmark];
}
