const core = require('@actions/core');
const {GitHub, context} = require('@actions/github');
const axios = require('axios').default;

async function run() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = new GitHub(process.env.GITHUB_TOKEN);

    // Get owner and repo from context of payload that triggered the action
    const {owner, repo} = context.repo;

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const limit = 25;
    const rating = core.getInput('rating', {required: false});
    const lang = core.getInput('lang', {required: false});

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
