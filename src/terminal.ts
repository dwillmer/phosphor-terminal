/*-----------------------------------------------------------------------------
| Copyright (c) 2015 Phosphor Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
module phosphor.terminal {

import IMessage = core.IMessage;

import ResizeMessage = widgets.ResizeMessage;
import Widget = widgets.Widget;

/**
 * A terminal configuration
 */
export
interface ITerminalConfig {
  convertEol?: boolean;
  termName?: string;
  rows?: number;
  cols?: number;
  cursorBlink?: boolean;
  visualBell?: boolean;
  popOnBell?: boolean;
  scrollback?: number;
  screenKeys?: number;
  useStyle?: boolean;
}


declare function Terminal(config: ITerminalConfig): void;


/**
 * A widget which manages a terminal session.
 */
export
class TermWidget extends Widget {
  /*
  * Construct a new terminal.
  */
  constructor(ws_url: string, config?: ITerminalConfig) {
    super();
    this.addClass('TermWidget');
    this._ws = new WebSocket(ws_url);
    this._config = config || {useStyle: true};

    this._term = Terminal(this._config);
    this._term.open(this.node);

    this._term.on('data', (data: string) => {
      this._ws.send(JSON.stringify(['stdin', data]));
    });

    this._ws.onmessage = (event: MessageEvent) => {
      var json_msg = JSON.parse(event.data);
      switch (json_msg[0]) {
        case "stdout":
          this._term.write(json_msg[1]);
          break;
        case "disconnect":
          this._term.write("\r\n\r\n[Finished... Term Session]\r\n");
          break;
      }
    };

    // create a dummy terminal to get row/column size
    this._dummy_term = document.createElement('div');
    var pre = document.createElement('pre');
    pre.style.visibility = "hidden";
    var span = document.createElement('span');
    span.style.visibility = "hidden";
    pre.appendChild(span);
    this._dummy_term.appendChild(pre);
    // 24 rows
    pre.innerHTML = "<br><br><br><br><br><br><br><br><br><br><br><br>" +
                    "<br><br><br><br><br><br><br><br><br><br><br><br>"
    // 1 row + 80 columns
    span.innerHTML = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
    this._term.element.appendChild(this._dummy_term);

  }

  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    this._term.destroy();
    this._ws = null;
    this._term = null;
    super.dispose();
  }

  get config(): ITerminalConfig {
    return this._config;
  }

  /**
   * Set the configuration of the terminal
   */
  set config(conf: ITerminalConfig) {
    // TODO: implement this
    this._config = conf;
    this._term_row_height = 0;
  }

  /**
   * Handle resize event
   */
  protected onResize(msg: ResizeMessage): void {
    if (!this._term_row_height) {
      this._term_row_height = this._dummy_term.offsetHeight / 25;
      this._term_col_width = this._dummy_term.offsetWidth / 80;
    }

    var rows = Math.max(2, Math.floor(msg.height / this._term_row_height) - 1);
    var cols = Math.max(3, Math.floor(msg.width / this._term_col_width) - 1);

    this._term.resize(cols, rows);
  }

  private _ws: WebSocket;
  private _term: any;
  private _dummy_term: HTMLElement;
  private _term_row_height: number;
  private _term_col_width: number;
  private _config: ITerminalConfig;
}

} // module phosphor.widgets
