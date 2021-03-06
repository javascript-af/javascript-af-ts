import * as passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import { v4 as uuid } from "uuid";
import { Request } from "express";
import { driver } from "../server";
import * as _ from "lodash";

const init = () => {
  // Setup use serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // @todo If we dont end up using user.xx except id dont query db
    // const db = driver.session();
    // db.run(`MATCH (n:User { id:{id}}) RETURN n`, { id })
    //   .then(user => {
    //     if (!_.isEmpty(user.records)) {
    //       return done(null, user.records[0].get("n").properties);
    //       db.close();
    //     }
    //     return done(null, null);
    //   })
    //   .catch(err => {
    //     done(err);
    //     return null;
    //   });
    return done(null, { id });
  });

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        passReqToCallback: true,
        scope: ["user"],
        callbackURL: "/auth/github/callback"
      },
      async (
        _req: Request,
        token: string,
        _tokenSecret: string,
        profile: any,
        done: any
      ) => {
        const name =
          profile.displayName || profile.username || profile._json.name || "";
        const splitProfileUrl = profile.profileUrl.split("/");
        const fallbackUsername = splitProfileUrl[splitProfileUrl.length - 1];
        const githubUsername =
          profile.username || profile._json.login || fallbackUsername;
        const email =
          (profile.emails &&
            profile.emails.length > 0 &&
            profile.emails[0].value) ||
          null;

        const db = driver.session();
        try {
          const res = await db.run(
            "MATCH (user:User {username: {username}}) RETURN user",
            { username: githubUsername }
          );
          if (!_.isEmpty(res.records)) {
            // save thier new git token
            await db.run(
              `MATCH (n:User {username: {username}})
                          SET n.githubToken = {githubToken}
                          RETURN n`,
              { username: githubUsername, githubToken: token }
            );
            // Existing user just create their session
            return done(null, res.records[0].get("user").properties);
          }
          const user = {
            id: uuid(),
            name,
            email,
            username: githubUsername,
            githubToken: token,
            profileUrl: profile.profileUrl
          };
          const result = await db.run(
            `
        CREATE (user:User {id: {id}, name: {name}, username:{username}, githubToken: {githubToken}, profileUrl:{profileUrl}, email: {email}, createdAt: datetime(), updatedAt: datetime() })
        RETURN user;
        `,
            user
          );
          db.close();
          return done(null, result.records[0].get("user").properties);
        } catch (ex) {
          return done(ex);
        }
      }
    )
  );
};

export default init;
