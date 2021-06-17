const Constants = (() => {
    const PREFIX  = 'web-voyager-';
    const PANEL_ID = `${PREFIX}root`;
    const ROW_HIGHLIGHT_CLASS = `${PREFIX}row-highlight`;
    const COLUMN_HIGHLIGHT_CLASS = `${PREFIX}column-highlight`;
    const COLUMN_ACTIVE_CLASS = `${PREFIX}column-active`;
    return {
        ROW_HIGHLIGHT_CLASS,
        COLUMN_HIGHLIGHT_CLASS,
        COLUMN_ACTIVE_CLASS,
        PANEL_ID
    }
})()