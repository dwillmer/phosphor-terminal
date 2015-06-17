"use strict";
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/*-----------------------------------------------------------------------------
| Copyright (c) 2015 Phosphor Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
var phosphor;
(function (phosphor) {
    var terminal;
    (function (terminal) {
        var Widget = phosphor.widgets.Widget;
        /**
         * A widget which manages a terminal session.
         */
        var TermWidget = (function (_super) {
            __extends(TermWidget, _super);
            /*
            * Construct a new terminal.
            */
            function TermWidget(ws_url, config) {
                var _this = this;
                _super.call(this);
                this.addClass('TermWidget');
                this._ws = new WebSocket(ws_url);
                this._term = Terminal(config || { useStyle: true });
                this._term.open(this.node);
                this._term.on('data', function (data) {
                    _this._ws.send(JSON.stringify(['stdin', data]));
                });
                this._ws.onmessage = function (event) {
                    var json_msg = JSON.parse(event.data);
                    switch (json_msg[0]) {
                        case "stdout":
                            _this._term.write(json_msg[1]);
                            break;
                        case "disconnect":
                            _this._term.write("\r\n\r\n[Finished... Term Session]\r\n");
                            break;
                    }
                };
            }
            /**
             * Dispose of the resources held by the widget.
             */
            TermWidget.prototype.dispose = function () {
                this._term.destroy();
                this._ws = null;
                this._term = null;
                _super.prototype.dispose.call(this);
            };
            /**
             * Handle resize event
             */
            TermWidget.prototype.onResize = function (msg) {
                var termRowHeight = this._term.element.offsetHeight / this._term.rows;
                var termColWidth = this._term.element.offsetWidth / this._term.cols;
                var rows = Math.max(2, Math.floor(msg.height / termRowHeight) - 1);
                var cols = Math.max(3, Math.floor(msg.width / termColWidth) - 1);
                this._term.resize(cols, rows);
            };
            return TermWidget;
        })(Widget);
        terminal.TermWidget = TermWidget;
    })(terminal = phosphor.terminal || (phosphor.terminal = {}));
})(phosphor || (phosphor = {})); // module phosphor.widgets
