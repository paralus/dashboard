import React from "react";

import Button from "@material-ui/core/Button";
import GetAppIcon from "@material-ui/icons/GetApp";

import T from "i18n-react";
import { getRafayCliDownloadOptions } from "actions/index";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import linux_logo from "./images/linux_logo1.png";
import windows_logo from "./images/windows_logo1.png";
import apple_logo from "./images/apple_logo1.png";

const style = {
  cardStyle: {
    marginTop:
      "10px" /* boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)" */,
  },
};

class DownloadCli extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cliMac: "x64",
      cliLinux: "x64",
      cliWindows: "x64",
      clioptions: {
        Mac_AMD64: {},
        Linux_AMD64: {},
        Linux_386: {},
        Windows_AMD64: {},
        Windows_386: {},
      },
    };
  }

  componentDidMount() {
    this.props.getRafayCliDownloadOptions();
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.isDownloadOptionsSucess && props.rafayClidownloadOptions) {
      props.rafayClidownloadOptions.forEach((clioption) => {
        const key = `${clioption.type}_${clioption.arch}`;
        this.state.clioptions[key] = clioption;
      });
    }
    this.setState(this.state);
  }

  UNSAFE_componentWillUpdate() {}

  handleCLITypeChange = (type) => (event) => {
    if (type === "linux") {
      this.state.cliLinux = event.target.value;
    }
    if (type === "windows") {
      this.state.cliWindows = event.target.value;
    }
    this.setState({ ...this.state });
  };

  handleStepperReset = () => {
    const { history } = this.props;
    history.push(`/main/users`);
  };

  render() {
    return (
      <div className="w-100">
        {/* this.props.location.pathname === "/main/users/cli" && (
                    <Breadcrumb className="mb-0 mt-0" tag="nav" style={{ backgroundColor: 'transparent' }}>
                        <BreadcrumbItem
                            active={false}
                            tag="a"
                            key='nav1'
                            color="primary"
                            href="#/main/users">
                            <p style={{ color: 'teal' }} ><T.span text="user.cli.breadcrumb.users" /></p>
                        </BreadcrumbItem>
                        <BreadcrumbItem
                            active
                            tag="span"
                            key='nav2'
                            color="primary"
                        >
                            <T.span text="user.cli.breadcrumb.download" />
                        </BreadcrumbItem>
                    </Breadcrumb>
                ) */}
        <div id="components" className="pb-3">
          <div className="row mb-4 ml-0">
            <div className="col-md-12">
              <div className="col-md-12" style={style.cardStyle}>
                <h1 className="pt-3 d-flex justify-content-center mt-4">
                  <T.span text="user.cli.platform.title" />
                </h1>
                <div
                  className="row mb-4"
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  <div className="col-md-12 p-0 d-flex justify-content-center mb-4">
                    <T.span text="user.cli.platform.description" />
                  </div>
                  <div
                    className="col-md-12 mt-4"
                    style={{
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    <div className="row">
                      <div className="col-md-4 p-2">
                        <div
                          className="col-md-12 p-3"
                          style={{
                            border: "2px solid #E5E5E5",
                            borderRadius: "10px",
                            height: "100%",
                          }}
                        >
                          <img
                            src={apple_logo}
                            alt="Paris"
                            style={{
                              width: "100px",
                            }}
                          />
                          <h2 className="mt-2 mb-4">
                            <T.span text="user.cli.platform.mac.title" />
                          </h2>
                          <div
                            className="col-md-12"
                            style={{
                              color: "#757575",
                              marginBottom: "20px",
                            }}
                          >
                            <T.span text="user.cli.platform.mac.description" />
                          </div>
                          <div
                            className="col-md-12"
                            style={{
                              color: "#757575",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              className="mt-4 text-white"
                              href={this.state.clioptions.Mac_AMD64.url}
                              id="Mac_AMD64"
                            >
                              <GetAppIcon
                                style={style.arrowDown}
                                className="mr-2"
                              />
                              <T.span text="user.cli.platform.mac.download" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 p-2">
                        <div
                          className="col-md-12 p-3"
                          style={{
                            border: "2px solid #E5E5E5",
                            borderRadius: "10px",
                          }}
                        >
                          <img
                            src={windows_logo}
                            alt="Paris"
                            style={{
                              width: "100px",
                            }}
                          />
                          <h2 className="mt-2 mb-4">
                            <T.span text="user.cli.platform.windows.title" />
                          </h2>
                          <div className="col-md-12">
                            {/* <FormControl className="w-30 mb-2" id="cli_win_select">
                                                            <Select
                                                                value={this.state.cliWindows}
                                                                onChange={this.handleCLITypeChange('windows')}
                                                                input={<Input id="cliMac" />}
                                                            >
                                                                <MenuItem value="x64" id="win_x64" ><T.span text="user.cli.platform.windows.x64" /></MenuItem>
                                                                <MenuItem value="x86" id="win_x86" ><T.span text="user.cli.platform.windows.x86" /></MenuItem>
                                                            </Select>
                                                        </FormControl> */}
                          </div>
                          <div
                            className="col-md-12"
                            style={{
                              color: "#757575",
                              marginBottom: "20px",
                            }}
                          >
                            64-bit
                          </div>
                          <div className="col-md-12">
                            {this.state.cliWindows === "x64" && (
                              <Button
                                variant="contained"
                                color="primary"
                                className="mt-4 text-white"
                                href={this.state.clioptions.Windows_AMD64.url}
                                id="win_x64_button"
                              >
                                <GetAppIcon
                                  style={style.arrowDown}
                                  className="mr-2"
                                />
                                <T.span text="user.cli.platform.windows.download.x64" />
                              </Button>
                            )}
                            {this.state.cliWindows === "x86" && (
                              <Button
                                variant="contained"
                                color="primary"
                                className="mt-4"
                                href={this.state.clioptions.Windows_386.url}
                                id="win_x86_button"
                              >
                                <GetAppIcon
                                  style={style.arrowDown}
                                  className="mr-2"
                                />
                                <T.span text="user.cli.platform.windows.download.x86" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 p-2">
                        <div
                          className="col-md-12 p-3"
                          style={{
                            border: "2px solid #E5E5E5",
                            borderRadius: "10px",
                          }}
                        >
                          <img
                            src={linux_logo}
                            alt="Paris"
                            style={{
                              width: "100px",
                            }}
                          />
                          <h2 className="mt-2 mb-4">
                            <T.span text="user.cli.platform.linux.title" />
                          </h2>
                          <div
                            className="col-md-12"
                            style={{
                              color: "#757575",
                            }}
                          >
                            {/* <FormControl className="w-30 mb-2" id="cli_linux_select">
                                                            <Select
                                                                value={this.state.cliLinux}
                                                                onChange={this.handleCLITypeChange('linux')}
                                                                input={<Input id="cliMac" />}

                                                            >
                                                                <MenuItem value="x64" id="linux_x64" ><T.span text="user.cli.platform.linux.x64" /></MenuItem>
                                                                <MenuItem value="x86" id="linux_x86" ><T.span text="user.cli.platform.linux.x86" /></MenuItem>
                                                            </Select>
                                                        </FormControl> */}
                          </div>
                          <div
                            className="col-md-12"
                            style={{
                              color: "#757575",
                              marginBottom: "20px",
                            }}
                          >
                            64-bit
                          </div>
                          <div
                            className="col-md-12"
                            style={{
                              color: "#757575",
                            }}
                          >
                            {this.state.cliLinux === "x64" && (
                              <Button
                                variant="contained"
                                color="primary"
                                className="mt-4 text-white"
                                href={this.state.clioptions.Linux_AMD64.url}
                                id="linux_x64_button"
                              >
                                <GetAppIcon
                                  style={style.arrowDown}
                                  className="mr-2"
                                />
                                <T.span text="user.cli.platform.windows.download.x64" />
                              </Button>
                            )}
                            {this.state.cliLinux === "x86" && (
                              <Button
                                variant="contained"
                                color="primary"
                                className="mt-4 text-white"
                                href={this.state.clioptions.Linux_386.url}
                                id="linux_x86_button"
                              >
                                <GetAppIcon
                                  style={style.arrowDown}
                                  className="mr-2"
                                />
                                <T.span text="user.cli.platform.windows.download.x86" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Paper style={{ bottom: '0px', left: '200px', zIndex: '199', position: 'fixed', display: 'block', width: '100%', height: '75px' }}>
                    <div className="row pt-3" style={{ paddingRight: '200px' }}>
                        <div className=" offset-md-9 col-md-3 text-center">
                            <Button variant="contained" color="primary" onClick={this.handleStepperReset} type="submit"  >
                                <T.span text="user.cli.platform.exit" />
                            </Button>
                        </div>
                    </div>
                </Paper> */}
      </div>
    );
  }
}
const mapStateToProps = ({ settings }) => {
  const {
    isDownloadOptionsSucess,
    isDownloadOptionsFailure,
    rafayClidownloadOptions,
  } = settings;
  return {
    isDownloadOptionsSucess,
    isDownloadOptionsFailure,
    rafayClidownloadOptions,
  };
};
export default withRouter(
  connect(mapStateToProps, { getRafayCliDownloadOptions })(DownloadCli)
);
