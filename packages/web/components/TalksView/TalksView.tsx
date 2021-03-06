import * as React from 'react';
import styled from 'styled-components';
import { Typography } from 'javascript-af-ui';
import { TalkController } from '@jsaf/controller';

const TimeIcon = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const TalksGrid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr 28%;
  grid-template-rows: 75vh 1fr;
  grid-template-areas: 'video video' ' info side';
`;

const VideoArea = styled.div`
  grid-area: video;
  iframe {
    border: 0;
    height: 100%;
    width: 100%;
  }
`;

const InfoArea = styled.div`
  grid-area: info;
  display: grid;
  grid-template-rows: 2rem 1fr;
  grid-template-columns: 1fr 15%;
  padding: 1rem;
  .heading {
    grid-row: 2 / 3;
    grid-column: 1 / 2;
    h2 {
      font-family: 'Fira Sans', monospace;
    }
    p {
      margin-top: 1rem;
      font-size: 18px;
      font-family: 'Fira Mono', sans-serif;
    }
  }
  .tags {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    a {
      font-family: 'Fira Mono', monospace;
      color: blue;
      letter-spacing: 2px;
      text-decoration: none;
    }
  }
  .length {
    grid-row: 1 / 2;
    grid-column: 2 / 3;
    display: flex;
    align-items: center;
    svg {
      margin-right: 3%;
      width: 30px;
      height: 30px;
    }
  }
`;

const PreviewArea = styled.div`
  grid-area: side;
`;

const VideoPreviewStyles = styled.div`
  display: flex;
  padding-top: 1rem;
  .image {
    img {
      height: auto;
      width: 168px;
    }
  }
  .info {
    flex: 1;
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    span {
      display: -webkit-box;
      font-size: 0.9rem;
      font-weight: 600;
      max-height: 2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: normal;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .subinfo {
      padding-top: 0.5rem;
      span {
        font-weight: 300;
      }
    }
  }
`;

const VideoPreview = props => {
  return (
    <VideoPreviewStyles {...props}>
      <div className="image">
        <img src={props.img} alt="" />
      </div>
      <div className="info">
        <Typography type="span" margin={0}>
          {props.title}
        </Typography>
        <div className="subinfo">
          <Typography type="span">{props.speaker}</Typography>
          <Typography type="span" className="time">
            {props.time}
          </Typography>
        </div>
      </div>
    </VideoPreviewStyles>
  );
};

export class TalksView extends React.Component<{ slug: string }> {
  render() {
    return (
      <TalkController slug={this.props.slug}>
        {({ data, loading }) => {
          if (loading) {
            return <div>loading....</div>;
          }
          return (
            <TalksGrid>
              <VideoArea>
                <iframe
                  src={data.iframe}
                  allowFullScreen={true}
                  frameBorder={0}
                />
              </VideoArea>

              <InfoArea>
                <div className="tags">
                  <Typography
                    type="h5"
                    component="a"
                    href="/something"
                    margin={0}>
                    #programming
                  </Typography>
                </div>
                <div className="length">
                  <TimeIcon />
                  <Typography type="h5" margin={0}>
                    25 mins
                  </Typography>
                </div>
                <div className="heading">
                  <Typography type="h2" margin={0}>
                    {data.title}
                  </Typography>
                  <Typography component="p" margin={0}>
                    {data.speaker}
                  </Typography>
                </div>
              </InfoArea>
              <PreviewArea>
                <VideoPreview
                  img="https://img.youtube.com/vi/cZeWjYVNWfU/maxresdefault.jpg"
                  time="59 mins"
                  title="Using New Web APIs For Your Own Pleasure"
                  speaker="Michaela Lehr"
                />
                <VideoPreview
                  img="https://img.youtube.com/vi/maykR0aVsj8/maxresdefault.jpg"
                  time="54 mins"
                  title="We All Started Somewhere"
                  speaker="Preethi Kasireddy"
                />
                <VideoPreview
                  img="https://i.ytimg.com/vi/z-6JC0_cOns/hqdefault.jpg?sqp=-oaymwEYCKgBEF5IVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLBN7tX3k--W4L8mgxQ0Hiz2fwsdww"
                  time="20 mins"
                  title="React Suspance"
                  speaker="Andrew Clark"
                />
              </PreviewArea>
            </TalksGrid>
          );
        }}
      </TalkController>
    );
  }
}
