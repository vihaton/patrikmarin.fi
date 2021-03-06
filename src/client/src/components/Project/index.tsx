import * as React from 'react';
import * as url from 'url';
import glamorous from 'glamorous';
import { RouteComponentProps, withRouter } from 'react-router-dom';
//
import { IProjectFields } from 'shared/interfaces/IProject';
import { IEntry, IEntryImage } from 'shared/interfaces/IEntry';

import NotFound from '../NotFound';
import Loader from './Loader';

import ContentfulAttribution from '../Misc/ContentfulAttribution';
import { colors } from '../../styles';

const Container = glamorous.div({
  marginTop: '30px',
  marginBottom: '20px',
});

const NavigationLink = glamorous.a({
  marginRight: '10px',
  textDecoration: 'none',
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline',
  },
  '& i': {
    marginRight: '1rem',
  },
});

const ExternalLinkContainer = glamorous.div({
  '& a': {
    color: '#000',
    ':hover': {
      color: '#000',
    },
  },
});

const HeaderContainer = glamorous.div({
  paddingTop: '30px',
  paddingBottom: '10px',
  marginBottom: '40px',
  borderBottom: `2px solid ${colors.mediumGray}`,
});

const ContentContainer = glamorous.div({
  borderBottom: `2px solid ${colors.mediumGray}`,
  '& .row': {
    paddingBottom: '0.5rem',
  },
});

const SegmentTitle = glamorous.p({
  fontWeight: 'bold',
  marginBottom: '1rem',
});

const SegmentText = glamorous.p({
  textAlign: 'justify',
});

const SegmentImageContainer = glamorous.div({
  marginBottom: '2.5rem',
  textAlign: 'center',
  '& img': {
    maxWidth: '100%',
    boxShadow: '0px 0px 10px 1px rgba(171,171,171,1)',
  },
});

const SegmentImageDescription = glamorous.p({
  textAlign: 'center',
  fontSize: '80%',
});

const FooterContainer = glamorous.div({
  marginTop: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export enum ImageClassEnum {
  NO_BG = 'NO_BG',
  PORTRAIT = 'PORTRAIT',
  HALF_WIDTH = 'HALF_WIDTH',
}

function getContainerClasses(classNames: string[]): React.CSSProperties {
  const style: React.CSSProperties = {};

  classNames.forEach((name: ImageClassEnum) => {
    switch (name) {
      case ImageClassEnum.HALF_WIDTH:
        style.width = '48%';
        style.marginLeft = 0;
        style.float = 'left';
        style.boxSizing = 'border-box';
        break;
    }
  });

  return style;
}

function getImageClasses(classNames: string[]): React.CSSProperties {
  const style: React.CSSProperties = {};

  classNames.forEach((name: ImageClassEnum) => {
    switch (name) {
      case ImageClassEnum.PORTRAIT:
        style.maxHeight = '600px';
        style.maxWidth = '90%';
        break;
      case ImageClassEnum.NO_BG:
        style.boxShadow = 'none';
        break;
    }
  });

  return style;
}

const DataSegment: React.SFC<{
  title: string, text: string, images: IEntryImage[] | undefined,
}> = ({ title, text, images }) => (
  <div className="row">
    <SegmentTitle>{title}</SegmentTitle>
    <SegmentText>{text}</SegmentText>
    {images && images.map((image: IEntryImage, i: number) => {
      const imgClasses = !! image.fields.classes ? image.fields.classes : [];
      // Get smaller images to reduce load time
      const imgUrl = `${image.fields.image.fields.file.url}?fm=jpg&q=80&w=1600`;
      return (
        <SegmentImageContainer key={i} style={getContainerClasses(imgClasses)}>
          <img
            style={getImageClasses(imgClasses)}
            src={imgUrl}
          />
          <SegmentImageDescription>
            {image.fields.altText}
          </SegmentImageDescription>
        </SegmentImageContainer>
      );
    })}
  </div>
);

interface IExternalLink {
  link: string;
  text: string;
  icon: string;
}

function externalLinkMapper(linkString: string): IExternalLink | undefined {
  const linkUrl = url.parse(linkString);
  const host = linkUrl.hostname;
  const urlhref = linkUrl.href;
  // Override default linktext is linktext query parameter is given
  const linktext = linkUrl.query !== null ?
    new URLSearchParams(linkUrl.query as string).get('linktext') : null;

  if (urlhref === undefined) {
    return undefined;
  }
  if (host === undefined) {
    return undefined;
  }

  // Remove query from url
  let link = (linktext !== null) ?
    urlhref.replace(`linktext=${linktext}`, '') : urlhref;

  // Remove possible question mark from the end as well
  if (link.endsWith('?')) link = link.substr(0, link.length - 1);

  let text = (linktext !== null) ? linktext : '';
  let icon = '';

  // TODO: Resolve subdomain handling
  switch (host) {
    case 'github.com':
      if (text === '') text = 'Code on GitHub!';
      icon = 'fa-github-alt';
      break;
    case 'patrikmarin.fi':
      if (text === '') text = 'Try it out!';
      icon = 'fa-caret-right';
      break;
    default:
      if (text === '') text = 'Take a look!';
      icon = 'fa-caret-right';
  }

  return {
    link,
    text,
    icon,
  };
}

interface IProjectState {
  loading: boolean;
  entry: IEntry | undefined;
}

class ProjectComponent extends React.Component<RouteComponentProps<any>, IProjectState> {

  state: IProjectState = {
    loading: true,
    entry: undefined,
  };

  componentDidMount() {

    const projectId = this.props.match.params.id;

    fetch('/api/projects')
      .then(res => res.json())
      .then((projects: IProjectFields[]) => {
        const project = projects.find(project => project.id === projectId);
        const loading = false;
        if (project && project.entry) {
          this.setState({ loading, entry: project.entry });
          document.title = project.entry.fields.title;
        } else {
          this.setState({ loading });
        }
      }).catch((err) => {
        this.setState({ loading: false });
      });
  }

  render() {

    document.body.style.background = '#FFF';
    document.body.style.height = 'auto';

    if (this.state.loading) {
      return (
        <Loader/>
      );
    }

    const project = this.state.entry;

    // Return not found
    if (project === undefined) {
      return (
        <NotFound/>
      );
    }

    return (
      <Container>
        <div className="container">
          <div>
            <NavigationLink href="/">
              <i className="fa fa-angle-left fa-lg"></i>
              Back to menu
            </NavigationLink>
          </div>
          <HeaderContainer>
            <div className="row">
              <div className="twelve columns">
                <h1 style={{ fontWeight: 'bold' }}>{project.fields.title}</h1>
                <h5>{project.fields.subtitle}</h5>
                <ExternalLinkContainer>
                  {!!project.fields.previewLink &&
                    <NavigationLink href={`/app/${this.props.match.params.id}`}>
                      <i className="fa fa-caret-right fa-lg"></i>
                      Try it out!
                    </NavigationLink>}
                  {project.fields.links &&
                    project.fields.links.map((linkString: string, i: number) => {
                      const link = externalLinkMapper(linkString);
                      if (link !== undefined) {
                        return (
                          <NavigationLink key={i} href={link.link}>
                            <i className={`fa ${link.icon} fa-lg`}></i>
                            {link.text}
                          </NavigationLink>
                        );
                      }
                      console.log('Invalid link: ', linkString);
                      return null;
                    },
                  )}
                </ExternalLinkContainer>
              </div>
            </div>
          </HeaderContainer>
          <ContentContainer>
            {!!project.fields.whatText && 
              <DataSegment
              title="What?"
              text={project.fields.whatText}
              images={project.fields.whatImages}
              />
            }
            {!!project.fields.whyText && 
              <DataSegment
                title="Why?"
                text={project.fields.whyText}
                images={project.fields.whyImages}
              />
            }
            {!!project.fields.currentStatusText && 
              <DataSegment
                title="Current status"
                text={project.fields.currentStatusText}
                images={project.fields.currentStatusImages}
              />
            }
          </ContentContainer>
          <div className="row">
            <FooterContainer>
              <NavigationLink href="/">
                <i className="fa fa-angle-left fa-lg"></i>
                Back to menu
              </NavigationLink>
              <ContentfulAttribution/>
            </FooterContainer>
          </div>
        </div>
      </Container>
    );
  }
}

export default withRouter(ProjectComponent);
