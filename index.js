import axios from "axios";
import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

const cli = readline.createInterface({ input, output, prompt: ">" });
const base = axios.create({
  baseURL: "https://api.github.com/repos/",
  headers: { Accept: "application/vnd.github.v3+json" },
  responseType: "json",
});

function changes(owner, repo) {
  let ownerStr = String(owner).replace(" ", "");
  let repoStr = String(repo).replace(" ", "-");
  base
    .get(`${ownerStr}/${repoStr}/commits`, { per_page: 2 })
    .then((res) => {
      console.log(`Showing Last Two Commits, will update again in 15s`);
      console.log(`1.`);
      console.log(`Author: ${res.data[0].commit.author.name}`);
      console.log(`Message from Commit: ${res.data[0].commit.message}`);
      console.log(
        `Time: ${new Date(
          res.data[0].commit.author.date
        ).getHours()}:${new Date(res.data[0].commit.author.date).getMinutes()}`
      );
      console.log(`URL to Commit: ${res.data[0].commit.url}`);
      console.log(`2.`);
      console.log(`Author: ${res.data[1].commit.author.name}`);
      console.log(`Message from Commit: ${res.data[1].commit.message}`);
      console.log(
        `Time: ${new Date(
          res.data[1].commit.author.date
        ).getHours()}:${new Date(res.data[1].commit.author.date).getMinutes()}`
      );
      console.log(`URL to Commit: ${res.data[1].commit.url}`);
    })
    .catch((err) => {
      console.log(`Error Getting Repo`);
      console.error(err);
      return false;
    });
}

let [question1, question2, question3] = [
  `Whats your Github Username?`,
  `Whats the name of the repo you want to watch ?`,
  `Time Interval(ms):`,
];
console.log(
  `Use this for Repos That Commits are being constantly being pushed To, For best experience`
);
console.log(`Click Ctrl + C twice to exit`);
cli.question(question1, (owner) => {
  cli.question(question2, (repo) => {
    cli.question(question3, (time) => {
      console.log(`Loading...`);
      if (!(owner && repo && time)) {
        console.log(`Failed to provide info, Please provide info`);
        cli.close();
        return false;
      }
      setInterval(() => {
        changes(owner, repo);
      }, time);
    });
  });
});
