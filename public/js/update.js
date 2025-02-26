'use strict';

class Update extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      step: 1, 
      releaseData: { current: {}, latest: {}} };
  }
  render() {
    const currentRelease = this.state.currentRelease || '';
    const newRelease = this.state.newRelease || '';
    const releases = this.state.releases || [];
    return (
      <div>
        <div className="breadcrumb-container">
          <ol className="breadcrumb">
            <li className={Utils.getActiveClass(1, this)}>Check</li>
            <li className={Utils.getActiveClass(3, this)}>Confirm</li>
            <li className={Utils.getActiveClass(4, this)}>Update</li>
            <li className={Utils.getActiveClass(5, this)}>Finish</li>
          </ol>
        </div>
        <div className={`install-step-container ${Utils.getActiveClass(1, this)}`}>
          <div className="install-step center">
            <div className="step-illustration"> 
              <img src="assets/responsive.png" />
            </div>
            <h2>Get the latest Adapt</h2>
            <p>You're only a few clicks away from getting the latest updates for your Adapt authoring tool install.</p> 
            <button className="btn btn-info" onClick={this.checkForUpdates.bind(this)}>Check for updates</button>
          </div>
        </div>
        <div className={`install-step-container ${Utils.getActiveClass(2, this)}`}>
          <div className="install-step">
            <div class="icon"><span class="lnr lnr-checkmark-circle"></span></div>
            <h2>Nothing to do!</h2>
            <p>There are no updates to apply; you're using {Utils.wrapVersion(currentRelease)}, which is the latest version!</p>
            <p class="instruction">You may now close this window.</p>
          </div>
        </div>
        <div className={`install-step-container ${Utils.getActiveClass(3, this)}`}>
          <div className="install-step">
            <div class="icon"><span class="lnr lnr-warning"></span></div>
            <h2>You're behind!</h2>
            <p>You're using {Utils.wrapVersion(currentRelease)}, and a newer version of the Adapt authoring tool exists.</p>
            <p>The latest compatible release of the authoring tool has automatically been selected, but you can change this using the below dropdown.</p>
            <p>{Utils.renderReleaseSelect(releases).bind(this)}</p>
            <p class="instruction">Click the button below to update.</p>
            <button className="btn btn-info" onClick={this.performUpdate.bind(this)}>Update</button>
          </div>
        </div>
        <div className={`install-step-container ${Utils.getActiveClass(4, this)}`}>
          <div className="install-step">
            <div class="icon"><span class="lnr lnr-hourglass"></span></div>
            <h2>Updating</h2>
            <p>Your application is being updated to {Utils.wrapVersion(newRelease)}; this process may take a while.</p> 
            <div className="progress">
              <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}}></div>
            </div>
          </div>
        </div>
        <div className={`install-step-container ${Utils.getActiveClass(5, this)}`}>
          <div className="install-step">
            <div class="icon"><span class="lnr lnr-checkmark-circle"></span></div>
            <h2>Update complete!</h2>
            <p>Congratulations, your authoring tool has been successfully updated to {Utils.wrapVersion(newRelease)}.</p>
            <p class="instruction">You may now close this page.</p>
          </div>
        </div>
      </div>
    );
  }
  async checkForUpdates() {
    const res = await fetch('/releases', { method: 'GET' });
    if(res.status > 299) {
      return Utils.handleError(this, res.statusText);
    }
    try {
      const { currentVersion, releases } = await res.json();
      this.setState({ 
        currentRelease: currentVersion, 
        newRelease: releases.find(r => r.url)?.tag_name,
        releases, 
        step: !releases.length ? 2 : 3 
      });
    } catch(e) {
      return Utils.handleError(this, e.message);
    }
  }
  async performUpdate() {
    Utils.showNextStep(this);
    const res = await fetch(`/update?version=${this.state.newRelease}`, { method: 'POST' });
    if(res.status > 299) return Utils.handleError(this, res.statusText);
    Utils.showNextStep(this);
    this.exit();
  }
  async exit() {
    const res2 = await fetch('/exit', { method: 'POST' });
    if(res2.status === 500) return Utils.handleError(this, await res2.text());
  }
}

async function run() {
  try {
    ReactDOM.render(React.createElement(Update), document.querySelector('#app'));
  } catch(e) {
    console.error(e);
  }
}

run();