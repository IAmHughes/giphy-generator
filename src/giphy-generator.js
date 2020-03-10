const core = require('@actions/core');
const {GitHub, context} = require('@actions/github');
const axios = require('axios').default;

async function run() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = new GitHub(process.env.GITHUB_TOKEN);

    // Get owner, repo, and event from context of payload that triggered the action
    const {owner, repo} = context.repo;
    const event_type = context.eventName;
    let issue_pr_number;
    let body;

    // Parse body of issue or PR to look for `/giphy <search_term>`
    core.debug(`Context for ${event_type}\n\n${JSON.stringify(context)}`);

    if (event_type === 'pull_request') {
      core.debug(`context.number = ${context.number}`);
      issue_pr_number = context.number;
      body = context.number.body;

      core.debug(`${event_type} triggered action, issue_pr_number: ${issue_pr_number}, body: ${body}`)
    } else if (event_type === 'issues') {
      core.debug(`context.issue = ${context.issue}`);
      issue_pr_number = context.issue.number;
      body = context.issue.body;

      core.debug(`${event_type}  triggered action, issue_pr_number: ${issue_pr_number}, body: ${body}`)
    } else {
      core.debug(`context.issue = ${context.issue}`);
      core.debug(`context.comment = ${context.comment}`);
      issue_pr_number = context.issue.number;
      body = context.comment.body;

      core.debug(`${event_type}  triggered action, issue_pr_number: ${issue_pr_number}, body: ${body}`)
    }

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const rating = core.getInput('rating', {required: false});
    const lang = core.getInput('lang', {required: false});
    const limit = 25;

    // Query GIPHY for a GIF!
    // API Documentation: https://developers.giphy.com/docs/api/endpoint/#search
    // eslint-disable-next-line no-await-in-loop
    const searchForGifResponse = await axios.get(
      `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_TOKEN}&q=${query}&limit=${limit}&offset=0&rating=${rating}&lang=${lang}`
    );

    core.debug(`Successfully queried GIPHY with query: ${query}, rating: ${rating}, and lang: ${lang}`);

    // Get the ID, title, and GIF URL for the GIF from the response
    const gifIndex = Math.ceil(Math.random() * limit);

    core.debug(`gifIndex picked is: ${gifIndex}`);

    const {
      title: gifTitle,
      images: {
        original: {url: gifUrl}
      }
    } = searchForGifResponse.data.data[gifIndex];

    // Create a comment
    // API Documentation: https://developer.github.com/v3/issues/comments/#create-a-comment
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-issues-create-comment
    // eslint-disable-next-line no-await-in-loop
    await github.issues.createComment({
      owner,
      repo,
      issue_number: commentNumber,
      body: `![${gifTitle}](${gifUrl})`
    });
    core.debug(`Successfully created comment on #: ${commentNumber} and gifTitle: ${gifTitle} - ${gifUrl}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
