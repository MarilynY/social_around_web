import React from 'react';
import PropTypes from 'prop-types';
import GridGallery from 'react-grid-gallery';

export class Gallery extends React.Component {
    static propTypes = {
        images: PropTypes.arrayOf(
            PropTypes.shape({
                user: PropTypes.string.isRequired,
                src: PropTypes.string.isRequired,
                thumbnail: PropTypes.string.isRequired,
                caption: PropTypes.string,
                thumbnailWidth: PropTypes.number.isRequired,
                thumbnailHeight: PropTypes.number.isRequired
            })
        ).isRequired
    }

    render () {
        var images = this.props.images.map(i => {
            const customOverlay = {
                customOverlay: ( <div style={captionStyle}>
                    <div>{`${i.user}: ${i.caption}`}</div>
                    </div>)
            };
            return { ...i, ...customOverlay }; 
        })

        return (
                <div style={wrapperStyle}>
                <GridGallery
                    //close window when click black background
                    backdropClosesModal
                    images={images}
                    enableImageSelection={false}/>
                </div>
        );
    }
}

const wrapperStyle = {
        display: "block",
        minHeight: "1px",
        width: "100%",
        border: "1px solid #ddd",
        overflow: "auto"
}


const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};


//fake data
// Gallery.defaultProps = {
//     images: [
//         {
//             user: 'nicky',
//             src: "https://c7.staticflickr.com/9/8106/28941228886_86d1450016_b.jpg",
//             thumbnail: "https://c7.staticflickr.com/9/8106/28941228886_86d1450016_n.jpg",
//             thumbnailWidth: 271,
//             thumbnailHeight: 320,
//             caption: "Orange Macro (Tom Eversley - isorepublic.com)"
//         },
//         {
//             user: 'Donghan',
//             src: "https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_b.jpg",
//             thumbnail: "https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_n.jpg",
//             thumbnailWidth: 320,
//             thumbnailHeight: 190,
//             caption: "286H (gratisography.com)"
//         },
//     ]
// };