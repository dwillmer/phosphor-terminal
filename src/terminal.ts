/*-----------------------------------------------------------------------------
| Copyright (c) 2015 Phosphor Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
module phosphor.widgets {

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

    this._term = Terminal(config || { useStyle: true });
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

  /**
   * Handle resize events
   */
  protected onResize(msg: ResizeMessage): void {
    var termRowHeight = this._term.element.offsetHeight / this._term.rows;
    var termColWidth = this._term.element.offsetWidth / this._term.cols;

    var rows = Math.max(2, Math.floor(msg.height / termRowHeight) - 1);
    var cols = Math.max(3, Math.floor(msg.width / termColWidth) - 1);

    this._term.resize(cols, rows);
  }

  private _ws: WebSocket;
  private _term: any;
}

} // module phosphor.widgets
