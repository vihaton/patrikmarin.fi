import * as React from 'react';
import glamorous from 'glamorous';

import { colors, breakpoints } from '../../../styles';
import { IFlickrPhoto } from 'shared/interfaces/IFlickr';
import { IThumbnailPhoto, getThumbnailsWithSizes } from './imageUtils';

import LightboxComponent from './LightboxComponent';
import ImageComponent from './ImageComponent';

// Same width as a row of gallery images
const LoadMoreButton = glamorous.button({
  background: colors.lightGray,
  color: 'black',
  marginTop: '0.5rem',
  marginLeft: '0.2rem',
  width: 'calc(100% - 0.4rem)',
});

const GalleryContainer = glamorous.div({
  width: '100%',
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'flex-start',
  alignContent: 'stretch',
  alignItems: 'stretch',
  lineHeight: 0,
});

interface IGalleryProps {
  photos: IFlickrPhoto[];
}

interface IGalleryState {
  rowsDisplayed: number;
  allVisible: boolean;
  thumbnails: IThumbnailPhoto[];
  selectedIndex: number;
}

// Gets number of elements to be displayed on a row defined by component width
function getGalleryWidth(componentWidth: number): number {
  if (componentWidth <= breakpoints.mobile) return 2;
  if (componentWidth <= breakpoints.desktop) return 3;
  return 4;
}

// Numbers of image rows to load per iteration
const DEFAULT_ROW_CHUNK = 3;

class GalleryComponent extends React.Component<IGalleryProps, IGalleryState> {

  ref: HTMLDivElement | null = null;

  constructor(props: IGalleryProps) {
    super(props);
    this.state = {
      rowsDisplayed: 1,
      allVisible: false,
      thumbnails: [],
      selectedIndex: -1,
    };
    this.refreshData = this.refreshData.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
  }

  loadImageRow() {
    this.setState({
      rowsDisplayed: this.state.rowsDisplayed + 1,
    });
  }

  componentDidUpdate(nextProps: IGalleryProps, nextState: IGalleryState) {
    if ((nextProps.photos.length !== this.props.photos.length) || 
        (nextState.rowsDisplayed !== this.state.rowsDisplayed))  {
      this.refreshData();
    }
  }

  refreshData() {
    if (!!this.ref) {
      const width = Math.floor((this.ref as HTMLDivElement).clientWidth - 1);
      const itemsPerRow = getGalleryWidth(width);
      const imagesToBeDisplayed = this.state.rowsDisplayed * DEFAULT_ROW_CHUNK * itemsPerRow;

      const images = this.props.photos.slice(0, imagesToBeDisplayed);
      const allVisible = images.length >= this.props.photos.length;
      const thumbnails = getThumbnailsWithSizes(images, itemsPerRow, width);
      this.setState({
        thumbnails,
        allVisible,
      });
    }
  }

  handleImageClick(index: number) {
    this.setState({
      selectedIndex: index,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.refreshData);
    this.refreshData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.refreshData);
  }

  render() {
    return (
      <div ref={(input: HTMLDivElement) => { this.ref = input; }}>
        <LightboxComponent
          currentIndex={this.state.selectedIndex}
          images={this.state.thumbnails}
        />
        <GalleryContainer>
          {this.state.thumbnails.map((img, i) => {
            return <ImageComponent
              key={`img-${i}`}
              index={i}
              img={img}
              onClick={this.handleImageClick}
            />;
          })}
        </GalleryContainer>
        {!this.state.allVisible &&
          <LoadMoreButton
            onClick={ e => this.loadImageRow() }
          >
            Load more images
          </LoadMoreButton>
         }
      </div>
    );
  }
}

export default GalleryComponent;