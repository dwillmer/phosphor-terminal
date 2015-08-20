/*-----------------------------------------------------------------------------
| Copyright (c) 2015 PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import DockMode = phosphor.widgets.DockMode;
import DockArea = phosphor.widgets.DockArea;
import Tab = phosphor.widgets.Tab;
import Widget = phosphor.widgets.Widget;

import * as terminal from "../../../lib/index";


class Content extends Widget {

  constructor(title: string) {
    super();
    this.addClass('content');
    this.addClass(title.toLowerCase());
    this._tab = new Tab(title);
    this._tab.closable = true;
  }

  get tab(): Tab {
    return this._tab;
  }

  private _tab: Tab;
}

class TabTerm extends terminal.TerminalWidget {
  constructor(ws_url: string) {
    super(ws_url);
    this._tab = new Tab('term');
    this._tab.closable = true;
  }

  get tab(): Tab {
    return this._tab;
  }

  private _tab: Tab;
}


function main(): void {
  var area = new DockArea();
  area.tabOverlap = 1;

  var r1 = new Content('Red');
  var r2 = new Content('Red');
  var r3 = new Content('Red');

  var b1 = new Content('Blue');
  var b2 = new Content('Blue');
  var b3 = new Content('Blue');

  var g1 = new Content('Green');
  var g2 = new Content('Green');
  var g3 = new Content('Green');

  var y1 = new Content('Yellow');
  var y2 = new Content('Yellow');
  var y3 = new Content('Yellow');

  var protocol = (window.location.protocol.indexOf("https") === 0) ? "wss" : "ws";
  var ws_url = protocol + "://" + window.location.host + "/websocket";

  var term = new TabTerm(ws_url);

  area.addWidget(r1);

  area.addWidget(term, DockMode.SplitRight, r1);
  area.addWidget(y1, DockMode.SplitBottom, b1);
  area.addWidget(b1, DockMode.SplitLeft, y1);

  area.addWidget(b2, DockMode.Bottom);

  area.addWidget(y2, DockMode.TabBefore, r1);
  area.addWidget(b3, DockMode.TabBefore, y2);
  area.addWidget(g2, DockMode.TabBefore, b2);
  area.addWidget(y3, DockMode.TabBefore, g2);
  area.addWidget(g3, DockMode.TabBefore, y3);
  area.addWidget(r2, DockMode.TabBefore, b1);
  area.addWidget(y3, DockMode.TabBefore, y1);

  area.attach(document.getElementById('main'));
  area.fit();

  window.onresize = () => area.fit();

}
window.onload = main;

