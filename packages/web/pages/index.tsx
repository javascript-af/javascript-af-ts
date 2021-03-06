import * as React from 'react';
import { Typography, CardHorizontalScroller } from 'javascript-af-ui';
import {
  RepositoriesController,
  NewsItemsController,
  TalksController,
} from '@jsaf/controller';
import shuffle from 'lodash.shuffle';
import styled from 'styled-components';
import { HERO_COLORS } from '../constants';
import Layout from '../components/Layouts';
import { HeroItem } from '../components/HeroItem';
import { RepoItem } from '../components/RepoItem';
import { NewsItem } from '../components/NewsItem';
import { TalkItem } from '../components/TalkItem';

const shuffled = shuffle(HERO_COLORS);

const HeroTop = styled.section`
  display: grid;
  grid-gap: 1vw;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: repeat(3, minmax(15vh, 1fr));
  grid-template-areas: 'featured item1' 'featured item2' 'featured item3';
  & > :nth-child(1) {
    grid-area: featured;
    align-content: end;
  }
  & > :nth-child(2) {
    grid-area: item1;
  }
  & > :nth-child(3) {
    grid-area: item2;
  }
  & > :nth-child(4) {
    grid-area: item3;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 3fr repeat(3, minmax(15vh, 1fr));
    grid-template-areas: 'featured' 'item2' 'item3' 'item1';
  }
`;

const ContentSection = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1.7fr 0.3fr;
  grid-template-areas: 'content ads';
  .content {
    grid-area: content;
    margin-left: 0.5rem;
  }
  .ads {
    grid-area: ads;
  }
`;

const ContentContainer = styled.div`
  border-bottom: 1px solid #eeeeee;
  padding: 2rem 0;
  & > h3 {
    font-size: 1.75rem !important;
  }
`;

const Index: React.SFC = () => {
  return (
    <Layout>
      <HeroTop>
        <HeroItem
          heading={'xl'}
          bgColor={shuffled[0]}
          image="https://images.unsplash.com/photo-1479920252409-6e3d8e8d4866?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7335ddddbdb2e401ce4f50507524d900&auto=format&fit=crop&w=1050&q=80"
        >
          Zeit released v2 of hyper terminal
        </HeroItem>
        <HeroItem
          heading="h3"
          bgColor={shuffled[1]}
          image="https://images.unsplash.com/photo-1479920252409-6e3d8e8d4866?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7335ddddbdb2e401ce4f50507524d900&auto=format&fit=crop&w=1050&q=80"
        >
          Nextjs hit v6.1.1
        </HeroItem>
        <HeroItem bgColor={shuffled[2]} heading="h3">
          Apollo teased the defer features incoming
        </HeroItem>
        <HeroItem
          bgColor={shuffled[3]}
          heading="h3"
          image="https://images.unsplash.com/photo-1479920252409-6e3d8e8d4866?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7335ddddbdb2e401ce4f50507524d900&auto=format&fit=crop&w=1050&q=80"
        >
          Andrew Clark gave demo with {"'"}
          Suspense
          {"'"}
        </HeroItem>
      </HeroTop>
      <ContentSection>
        <div className="content">
          <ContentContainer>
            <Typography type={'h3'} margin={6}>
              Repositories
            </Typography>
            <RepositoriesController>
              {({ data, loading }) => {
                if (loading) {
                  return <h1>loading</h1>;
                }
                return (
                  <CardHorizontalScroller>
                    {data.map(item => (
                      <RepoItem
                        key={item.id}
                        title={item.githubName}
                        description={item.description}
                        githubUser={item.githubOwner}
                        githubRepo={item.githubName}
                      />
                    ))}
                  </CardHorizontalScroller>
                );
              }}
            </RepositoriesController>
          </ContentContainer>
          <ContentContainer>
            <Typography type={'h3'} margin={10}>
              Latest Dev News
            </Typography>
            <NewsItemsController>
              {({ data, loading }) => {
                if (loading) {
                  return <h1>loading</h1>;
                }
                return (
                  <div style={{ margin: '0 12px' }}>
                    {data.map(item => (
                      <NewsItem
                        key={item.id}
                        title={item.title}
                        slug={item.slug}
                      >
                        {item.content
                          .split(' ')
                          .slice(0, 30)
                          .join(' ')}
                      </NewsItem>
                    ))}
                  </div>
                );
              }}
            </NewsItemsController>
          </ContentContainer>
          <ContentContainer>
            <Typography type={'h3'} margin={10}>
              Popular Talks
            </Typography>
            <TalksController>
              {({ data, loading }) => {
                if (loading) {
                  return <h1>loading</h1>;
                }
                return (
                  <CardHorizontalScroller>
                    {data.map(item => (
                      <TalkItem
                        key={item.id}
                        title={item.title}
                        slug={item.slug}
                      />
                    ))}
                  </CardHorizontalScroller>
                );
              }}
            </TalksController>
          </ContentContainer>
        </div>
      </ContentSection>
    </Layout>
  );
};

export default Index;
