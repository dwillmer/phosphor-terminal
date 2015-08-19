/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

import * as terminal from "../../lib/index";


function main(): void {

	var protocol = (window.location.protocol.indexOf("https") === 0) ? "wss" : "ws";
	var ws_url = protocol + "://" + window.location.host + "/websocket";

	var term = new terminal.TerminalWidget(ws_url);

	term.attach(document.getElementById('main'));
	term.fit();

	window.onresize = () => term.fit();

}
window.onload = main;

