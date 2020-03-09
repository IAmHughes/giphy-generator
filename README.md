# GIPHY Generator - GitHub Action!
A GitHub Action (written in JavaScript) to generate a comment on issues and PRs, responding to the command `/giphy <search_term>`, leveraging the [GIPHY API](https://developers.giphy.com/docs/api/endpoint/#search). Powered by GIPHY and GitHub Actions!

For example, if I commnented on an Issue and included the phrase `/giphy another one`, I would see a comment from this action of a gif response from [GIPHY's Search API](https://developers.giphy.com/docs/api/endpoint/#search) for `another one`:

![/giphy another one](https://media.giphy.com/media/xThuWcZzGnonnG3ayQ/giphy.gif)

## Usage
### Pre-requisites
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow---giphy-generator) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs
For more information on these inputs, see the [GIPHY API Documentation](https://developers.giphy.com/docs/api/endpoint/#search).

- `rating`: The [content rating](https://developers.giphy.com/docs/optional-settings#rating) used to filter results from the GIF search. Default: `g`
- `lang`: The [default language](https://developers.giphy.com/docs/optional-settings#language-support) that the search query is in. Default: `en` for English

### Example workflow - giphy generator
When an issue or pull_request has a new comment that contains the `/giphy <search_term>` phrase (or is opened/edited), and add a [comment](https://developer.github.com/v3/issues/comments/#create-a-comment) powered by GIPHY to add a GIF using the given search phrase:

```yaml
on:
  issues:
    types: [opened, edited]
  pull_request:
    types: [opened, edited]
  issue_comment:
    types: [created, edited]

name: GIPHY Generator

jobs:
  giphy-generator:
    name: GIPHY Generator
    runs-on: ubuntu-latest
    steps:
      - name: GIPHY Generator
        id: giphy_generator
        uses: iamhughes/giphy_generator@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # This token is provided by Actions, you do not need to create your own token
          GIPHY_TOKEN: ${{ secrets.GIPHY_TOKEN }} # This token should be created on giphy.com: https://developers.giphy.com/dashboard/?create=true
        with:
          rating: 'g'
          lang: 'en'
```

## Contributing
I would love for you to contribute, pull requests are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

![/giphy motivation](https://media1.giphy.com/media/ACcXRXwUqJ6Ok/giphy.gif?cid=790b76114c50f8d3fd545233a84bf5409ed102e90ff8e9e8&rid=giphy.gif)

## License
The scripts and documentation in this project are released under the [GNU License](LICENSE)

## Disclaimer
This leverages the [GIPHY API](https://developers.giphy.com/docs/api/endpoint#search) to query results based on inputs you provide and the rating you use. As a consumer of this action, you accept responsibility of any gifs that are posted by this bot. The owner of this action does not control the search algorithm or endpoint that is returning images and is not responsible for it's content.

![/giphy challenge accepted](https://media.giphy.com/media/d4zHnLjdy48Cc/giphy.gif)
