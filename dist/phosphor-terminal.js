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
                this._config = config || { useStyle: true };
                this._term = Terminal(this._config);
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
                // create a dummy terminal to get row/column size
                this._dummy_term = document.createElement('div');
                this._dummy_term.style.visibility = "hidden";
                var pre = document.createElement('pre');
                var span = document.createElement('span');
                pre.appendChild(span);
                // 24 rows
                pre.innerHTML = "<br><br><br><br><br><br><br><br><br><br><br><br>" + "<br><br><br><br><br><br><br><br><br><br><br><br>";
                // 1 row + 80 columns
                span.innerHTML = "012345678901234567890123456789" + "012345678901234567890123456789" + "01234567890123456789";
                this._dummy_term.appendChild(pre);
                this._term.element.appendChild(this._dummy_term);
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
            Object.defineProperty(TermWidget.prototype, "config", {
                get: function () {
                    return this._config;
                },
                /**
                 * Set the configuration of the terminal.
                 */
                set: function (options) {
                    if (options.useStyle) {
                        this._term.insertStyle(this._term.document, this._term.colors[256], this._term.colors[257]);
                    }
                    else if (options.useStyle === false) {
                        var sheetToBeRemoved = document.getElementById('term-style');
                        if (sheetToBeRemoved) {
                            var sheetParent = sheetToBeRemoved.parentNode;
                            sheetParent.removeChild(sheetToBeRemoved);
                        }
                    }
                    if (options.useStyle !== null) {
                        // invalidate terminal pixel size
                        this._term_row_height = 0;
                    }
                    for (var key in options) {
                        this._term[key] = options[key];
                    }
                    this._config = options;
                    this.resize_term(this.width, this.height);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Handle resizing the terminal itself.
             */
            TermWidget.prototype.resize_term = function (width, height) {
                if (!this._term_row_height) {
                    this._term_row_height = this._dummy_term.offsetHeight / 25;
                    this._term_col_width = this._dummy_term.offsetWidth / 80;
                }
                var rows = Math.max(2, Math.floor(height / this._term_row_height) - 1);
                var cols = Math.max(3, Math.floor(width / this._term_col_width) - 1);
                rows = this._config.rows || rows;
                cols = this._config.cols || cols;
                this._term.resize(cols, rows);
            };
            /**
             * Handle resize event.
             */
            TermWidget.prototype.onResize = function (msg) {
                this.resize_term(msg.width, msg.height);
            };
            return TermWidget;
        })(Widget);
        terminal.TermWidget = TermWidget;
    })(terminal = phosphor.terminal || (phosphor.terminal = {}));
})(phosphor || (phosphor = {})); // module phosphor.terminal
