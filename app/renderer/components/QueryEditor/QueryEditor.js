import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../Button';
import Editor from '../Editor';

export default class QueryEditor extends React.Component {
  get options() {
    return {
      mode: 'text/x-sql',
      keyMap: this.props.setting.keyBind,
      lineNumbers: true,
      matchBrackets: true,
      indentUnit: 4,
      smartIndent: false,
    };
  }

  get style() {
    return this.props.editor.height == null ? {} : {
      height: `${this.props.editor.height}px`,
    };
  }

  handleResizeStart(e) {
    e.preventDefault();
    let editor = ReactDOM.findDOMNode(this.refs.Editor);
    let height = editor.clientHeight;
    let y = e.pageY;
    let handleResize = (e) => {
      let newHeight = height + (e.pageY - y);
      if (newHeight < 0) newHeight = 0;
      this.props.onChangeEditorHeight(newHeight);
    };
    let handleResizeStop = () => {
      document.removeEventListener('mouseup', handleResizeStop);
      document.removeEventListener('mousemove', handleResize);
    };
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeStop);
  }

  renderExecuteButton() {
    if (this.props.query.status === 'working') {
      return <Button className="QueryEditor-cancelBtn" onClick={() => this.props.onCancel()}>Cancel</Button>;
    }
    else {
      return <Button className="QueryEditor-executeBtn" onClick={() => this.props.onExecute()}>Execute</Button>;
    }
  }

  renderFormatButton() {
    console.log("renderFormatButton");
    return <Button className="QueryEditor-executeBtn" onClick={() => this.props.onFormat()}>Format</Button>;
  }


  renderStatus() {
    switch (this.props.query.status) {
      case 'success': return this.renderSuccess();
      case 'failure': return this.renderError();
      case 'working': return this.renderWorking();
      default: return null;
    }
  }

  renderSuccess() {
    let query = this.props.query;
    return (
      <div className="QueryEditor-status">
        <span><i className="fa fa-check" /></span>
        <span>runtime: {query.runtime ? `${query.runtime}ms` : '-'}</span>
        <span>rows: {query.rows ? query.rows.length : '-'}</span>
      </div>
    );
  }

  renderError() {
    return (
      <div className="QueryEditor-status is-error">
        <span><i className="fa fa-close" /> Failed</span>
      </div>
    );
  }

  renderWorking() {
    return (
      <div className="QueryEditor-status is-working">
        <span><i className="fa fa-spin fa-refresh" /></span>
      </div>
    );
  }

  render() {
    let query = this.props.query;

    return <div className="QueryEditor">
      <Editor
        value={query.body || ''}
        height={this.props.editor.height}
        ref="Editor"
        onChange={body => this.props.onChangeQueryBody(body)}
        onChangeCursor={line => this.props.onChangeCursorPosition(line)}
        onSubmit={() => this.props.onExecute()}
        onFormat={() => this.props.onFormat()}
        options={this.options} />
      <div className="QueryEditor-navbar">
        {this.renderExecuteButton()}
        {this.renderFormatButton()}
        {this.renderStatus()}
        <span onMouseDown={this.handleResizeStart.bind(this)} className="QueryEditor-resize">
          <i className="fa fa-arrows-v" />
        </span>
      </div>
    </div>;
  }
}
