import {getDataImageUrlWithHeader} from "../../utilities/getDataImageUrlWithHeader";

const Base64ToImage = ({ base64, alt = 'Dropzone Background', style = {} }) => {
    const dataImageUrlWithHeader = getDataImageUrlWithHeader(base64);

    if (!dataImageUrlWithHeader) {
        console.warn('Base64 string is invalid or missing');
        return null;
    }

    const combinedStyle = {
        ...style,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
    };

    return (
        <img
            src={dataImageUrlWithHeader}
            alt={alt}
            style={combinedStyle}
            onLoad={() => console.log('Image successfully loaded')}
            onError={(e) => console.error('Image failed to load', e)}
        />
    );
};

export default Base64ToImage;