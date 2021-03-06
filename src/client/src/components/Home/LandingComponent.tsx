import * as React from 'react';
import glamorous from 'glamorous';
import * as ReactTooltip from 'react-tooltip';

import { colors, mediaQueries } from '../../styles';
import { IProfile } from 'shared/interfaces/IResume';
import { ILocation, ILocationInformation } from 'shared/interfaces/ILocation';

import { animateToElement } from '../../utils/smoothScroller';

const LandingContainer = glamorous.div({
  minHeight: 'calc(100vh - 7rem)',
  marginTop: '8rem',
  [mediaQueries.tablet]: {
    marginTop: 0,
  },
});

const Container = glamorous.div({
  minHeight: 'inherit',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '& .info-tooltip': {
    maxWidth: '50%',
    marginTop: '-1rem',
    background: '#fff',
    opacity: 1,
  },
});

const WelcomeText = glamorous.h5({
  color: colors.landingPage.welcomeText,
  textAlign: 'center',
  letterSpacing: '1px',
  padding: 0,
  margin: 0,
  marginBottom: '1rem',
  fontWeight: 'bold',
});

const Title = glamorous.h1({
  color: colors.landingPage.foreground,
  letterSpacing: '5px',
  textAlign: 'center',
  padding: 0,
  margin: 0,
  marginBottom: '2rem',
  fontFamily: 'Raleway, Lato, sans-serif',
});

const InfoLabel = glamorous.h6({
  textAlign: 'center',
  letterSpacing: '1px',
  padding: 0,
  margin: 0,
  color: colors.landingPage.infolabel,
  marginBottom: '3rem',
  textTransform: 'uppercase',
  fontWeight: 'bold',
});

const ButtonContainer = glamorous.div({
  textAlign: 'center',
});

const Button = glamorous.a({
  color: `${colors.landingPage.foreground} !important`,
  marginLeft: '0.7rem !important',
  marginRight: '0.7rem !important',

  ':hover': {
    color: `${colors.landingPage.hoverForeground} !important`,
    background: 'rgba(0,0,0,0.1) !important',
    borderColor: `${colors.landingPage.infolabel} !important'`,
  },

  ':active': {
    color: `${colors.landingPage.hoverForeground} !important`,
    background: 'rgba(0,0,0,0.2) !important',
    borderColor: `${colors.landingPage.infolabel} !important'`,
  },
});

const LinkContainer = glamorous.div({
  marginTop: '4rem',
  marginBottom: '10rem',

  color: colors.landingPage.foreground,
  textAlign: 'center',

  '& i': {
    color: colors.landingPage.foreground,
  },

  '& a': {
    color: colors.landingPage.foreground,
    textDecoration: 'none',
  },

  '& a:hover': {
    color: colors.landingPage.infolabel,
    textDecoration: 'none',
  },

  [mediaQueries.tablet]: {
    marginBottom: '6rem',
  },
});

const PGPLink = glamorous.div({
  '& i': {
    color: '#00D050',
    marginRight: '0.5rem',
  },
  '& a:hover': {
    color: '#00D050',
    textDecoration: 'none',
  },
});

const LocationText = glamorous.div({
  cursor: 'pointer',
  position: 'relative',
  '& i': {
    color: '#d0b41a',
    marginRight: '0.5rem',
  },
  '& p': {
    display: 'inline-block',
    color: '#d0b41a',
  },
  '& #dbpedia-icon': {
    '::before': {
      content: ' ',
      position: 'absolute',
      top: '-0.8rem',
      left: '2rem',
      margin: 'auto',
      borderLeft: '1rem solid transparent',
      borderRight: '1rem solid transparent',
      borderBottom: '1rem solid white',
    },
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '50%',
    height: '4rem',
    width: '4rem',
    display: 'flex',
    position: 'absolute',
    top: '4rem',
    margin: 'auto',
    left: 0,
    right: 0,
    '& img': {
      width: '100%',
    },
  },
});

const AttributionContainer = glamorous.div({
  display: 'flex',
  marginTop: '1rem',
  marginBottom: '1rem',
  justifyContent: 'center',
  '& img': {
    height: '1.5rem',
  },
});

interface LandingComponentProps {
  name: string;
  infoLabel: string;
  profiles: IProfile[];
  email: string;
  lastLocation?: ILocation;
  locationInformation?: ILocationInformation;
}

interface LandingComponentState {
  height: string;
}

class LandingComponent extends React.Component<LandingComponentProps, LandingComponentState> {

  profileSeparator = ' • ';

  navigate(e: React.MouseEvent<HTMLAnchorElement>) {
    const target = e.target as HTMLAnchorElement;
    const id = target.href.split('#')[1];
    const elem = document.querySelector('#' + id);

    if (!!elem) {
      e.preventDefault();
      animateToElement(elem);
    }
  }

  render() {

    const locationString = (loc: ILocation): string | null => {
      const now = Date.now();
      const prefix = now - loc.timestamp > 43200000 ?
        'Last seen in' : 'I\'m currently somewhere in';

      if (loc.city && loc.country &&
          loc.city !== 'null' && loc.country !== 'null')
        return `${prefix} ${loc.city}, ${loc.country}`;
      
      if (loc.city && loc.city !== 'null') return `${prefix} ${loc.city}`;
      if (loc.country && loc.country !== 'null') return `${prefix} ${loc.country}`;

      return null;
    };

    return (
      <LandingContainer>
        <Container>
          <div className="container">
            <WelcomeText>HELLO AND WELCOME.</WelcomeText>
            <Title>I'm {this.props.name}</Title>
            <InfoLabel>{this.props.infoLabel}</InfoLabel>
            <ButtonContainer>
              <Button
                className="button"
                href="#description"
                onClick={this.navigate}
              >
                READ MORE
              </Button>
              <Button className="button" href={require('./resources/cv_patrik-marin_en_web.pdf')}
                >DOWNLOAD CV
              </Button>
            </ButtonContainer>
            <LinkContainer>
              {this.props.profiles.map((profile: IProfile, index: number) => {
                return (index === this.props.profiles.length - 1) ?
                  <a key={index} href={profile.url}>{profile.network}</a> :
                  <span key={index}>
                    <a href={profile.url}>{profile.network}</a>{this.profileSeparator}
                  </span>;
              })}
              <br/>
              <a href={`mailto:${this.props.email}`}>{this.props.email}</a>
              <PGPLink>
                <i className="fa fa-lock"/>
                <a href={require('./resources/pgp.txt')}>1B2D D0FC 4E42 41A5 20D4</a>
              </PGPLink>
              {this.props.lastLocation && locationString(this.props.lastLocation) &&
                <React.Fragment>
                  <LocationText data-tip data-for="location-tooltip">
                    <i className="fa fa-location-arrow"/>
                    <p>{locationString(this.props.lastLocation)}</p>
                    {
                      this.props.locationInformation &&
                      this.props.locationInformation.city === this.props.lastLocation.city &&
                      this.props.locationInformation.country === this.props.lastLocation.country &&
                      <div id="dbpedia-icon">
                        <img src={require('./images/dbpedia.svg')} alt="DBpedia"/>
                      </div>
                    }
                  </LocationText>
                  {this.props.locationInformation &&
                   this.props.locationInformation.city === this.props.lastLocation.city &&
                   this.props.locationInformation.country === this.props.lastLocation.country &&
                    <ReactTooltip
                      className="info-tooltip"
                      id="location-tooltip"
                      place="bottom"
                      type="light"
                      effect="solid"
                    >
                      <AttributionContainer>
                        <img src={require('./images/wikipedia.svg')} alt="Wikipedia"/>
                      </AttributionContainer>
                      <span>{this.props.locationInformation.information}</span>
                    </ReactTooltip>
                  }
                </React.Fragment>
              }
            </LinkContainer>
          </div>
        </Container>
      </LandingContainer>
    );
  }
}

export default LandingComponent;
