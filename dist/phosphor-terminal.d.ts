declare module phosphor.terminal {
    import ResizeMessage = widgets.ResizeMessage;
    import Widget = widgets.Widget;
    /**
     * A terminal configuration
     */
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
    /**
     * A widget which manages a terminal session.
     */
    class TermWidget extends Widget {
        constructor(ws_url: string, config?: ITerminalConfig);
        /**
         * Dispose of the resources held by the widget.
         */
        dispose(): void;
        /**
         * Handle resize event
         */
        protected onResize(msg: ResizeMessage): void;
        private _ws;
        private _term;
    }
}
