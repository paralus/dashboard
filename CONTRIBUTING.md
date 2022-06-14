We 💚 Opensource!

Yes, because we feel that it’s the best way to build and improve a product. It allows people like you from across the globe to contribute and improve a product over time. And we’re super happy to see that you’d like to contribute to Paralus dashboard.

We are always on the lookout for anything that can improve the product. Be it feature requests, issues/bugs, code or content, we’d love to see what you’ve got to make this better. If you’ve got anything exciting and would love to contribute, this is the right place to begin your journey as a contributor to Paralus dashboard and the larger open source community.

**How to get started?**
The easiest way to start is to look at existing issues and see if there’s something there that you’d like to work on. You can filter issues with the label [“[Good first issue](https://github.com/paralus/dashboard/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)” which are relatively self sufficient issues and great for first time contributors.

Once you decide on an issue, please comment on it so that all of us know that you’re on it.

If you’re looking to add a new feature, [raise a new issue](https://github.com/paralus/dashboard/issues/new) and start a discussion with the community. Engage with the maintainers of the project and work your way through.

# Dashboard

Dashboard is the web UI that allows users to interact with paralus. Built using react, the dashboard is responsive, faste and feature loaded. It allows you to easily work with your clusters. The intuitive UI helps you manage your organization, projects and clusters along with user permissions and access. It makes importing clusters and managing access to it easier and quicker.

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

## Need Help?

If you are interested to contribute to prompt but are stuck with any of the steps, feel free to reach out to us. Please [create an issue](https://github.com/paralus/dashboard/issues/new) in this repository describing your issue and we'll take it up from there.

You can reach out to us via our [Slack Channel](https://join.slack.com/t/paralus/shared_invite/zt-1a9x6y729-ySmAq~I3tjclEG7nDoXB0A) or [Twitter](https://twitter.com/paralus_).
