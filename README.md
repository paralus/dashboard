# Dashboard

Dashboard is the web UI that allows users to interact with paralus. Built using react, the dashboard is responsive, faste and feature loaded. It allows you to easily work with your clusters. The intuitive UI helps you manage your organization, projects and clusters along with user permissions and access. It makes importing clusters and managing access to it easier and quicker.

<br>

<img src="https://raw.githubusercontent.com/paralus/paralus/845812b5f7f2e0f69f4645eb8c9016e6b250c4c7/paralus.gif?token=GHSAT0AAAAAABPXWZYZAJMCUKQICMJT6UYCYVIHS5A" alt="Paralus Dashboard" height="50%" width="50%"/>

<hr>

## Development Setup

### Setup Paralus core

Follow the [development setup guide](https://github.com/paralus/paralus/blob/main/CONTRIBUTING.md#development-setup) to start Paralus core. The dashboard requires core to be running.

### Install Dependencies

```bash
yarn install
```

### Start Dashboard Development Server

```bash
yarn run start
```

Open http://localhost:3000 to access the dashboard.

### Setup Admin User Account

Run following command inside root directory of `paralus/paralus`:

```go
go run scripts/initialize/main.go \
        --org DefaultOrg \
        --partner DefaultPartner \
        --partner-host paralus.local \
        --admin-email admin@paralus.local \
        --admin-first-name Admin \
        --admin-last-name User
```

You will get the admin account password set link, like this:

```bash
Org Admin signup URL:  http://127.0.0.1:4433/self-service/recovery?flow=7c85618b-cc38-4f4f-895c-3540f1fe5149&token=sf7fHWXDW664Y1DAMg5QIJ6Hqg97Huu7
```

Open link in browser and set the password.

Now you can login to the dashboard using email (`admin@paralus.local`) and password you have provided.

## Community & Support

- Visit [Paralus website](https://paralus.io) for the complete documentation and helpful links.
- Join our [Slack channel](https://join.slack.com/t/paralus/shared_invite/zt-1a9x6y729-ySmAq~I3tjclEG7nDoXB0A) to post your queries and discuss features.
- Tweet to [@paralus_](https://twitter.com/paralus_/) on Twitter.
- Create [GitHub Issues](https://github.com/paralus/dashboard/issues) to report bugs or request features.

## Contributing

The easiest way to start is to look at existing issues and see if there’s something there that you’d like to work on. You can filter issues with the label “Good first issue” which are relatively self sufficient issues and great for first time contributors.

Once you decide on an issue, please comment on it so that all of us know that you’re on it.

If you’re looking to add a new feature, raise a [new issue](https://github.com/paralus/dashboard/issues) and start a discussion with the community. Engage with the maintainers of the project and work your way through.
