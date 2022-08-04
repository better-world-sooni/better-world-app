import { EventRegister } from "react-native-event-listeners";

export const expandImageViewerEvent = () => `expand-image-viewer`;

export const expandImageViewer = (images, imageIndex) => {
    EventRegister.emit(expandImageViewerEvent(), {images, imageIndex},);
};