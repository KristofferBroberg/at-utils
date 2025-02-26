'use strict';

class Utils {
  static getActiveClass(id, c) {
    return c.state.step === id ? 'active' : '';
  }
  static wrapVersion(version) {
    return <span class="version">{version}</span>;
  }
  static showNextStep(c) {
    c ? c.setState({ step: c.state.step+1 }) : this.setState({ step: this.state.step+1 });
  }
  static handleError(self, e) {
    $('body').attr('class', 'error');
    const msg = e.toString ? e.toString() : e;
    self.setState({ error: new ErrorDisplay(msg).render(), step: -1 });
  }
  static renderReleaseSelect(releases, selectedVersion) {
    return (<select id="release" value={selectedVersion} onChange={e => this.setState({ selectedRelease: e.target.value })}>
      {releases.map(r => <option value={r.tag_name}>{r.name} ({new Date(r.date).toDateString()})</option>)}
    </select>);
  }
}