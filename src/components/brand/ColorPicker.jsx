import React, { useState, useCallback, useMemo } from 'react';
import { HexColorPicker, RgbaColorPicker } from 'react-colorful';
import {
    Box,
    Popover,
    TextField,
    Typography,
    Tooltip,
    IconButton,
    Divider,
} from '@mui/material';
import ColorizeIcon from '@mui/icons-material/Colorize';

import { parseToRgba, formatColor } from '../../themes/cssColors';

// Firefox has no EyeDropper, so the button is hidden rather than offered and broken.
const hasEyeDropper = typeof window !== 'undefined' && typeof window.EyeDropper === 'function';

const CHECKERBOARD =
    'repeating-conic-gradient(rgba(0,0,0,0.18) 0% 25%, rgba(255,255,255,0.6) 0% 50%) 50% / 10px 10px';

/**
 * One colour control, used for every colour anywhere in the studio.
 *
 * `allowAlpha` is a correctness switch, not a preference. Ringle's schema is hex and the
 * import and palette builders drop anything `isHex` rejects, so the fields that feed
 * ringle's colour block pass false and can only ever emit `#RRGGBB`.
 */
const ColorPicker = ({
    value,
    onChange,
    allowAlpha = false,
    quickPicks = [],
    testId,
    label,
    size = 34,
}) => {
    const [anchor, setAnchor] = useState(null);
    const [draft, setDraft] = useState('');

    const rgba = useMemo(() => parseToRgba(value) || { r: 0, g: 0, b: 0, a: 1 }, [value]);
    const open = Boolean(anchor);

    const emit = useCallback((next) => {
        onChange(formatColor(next, true));
    }, [onChange]);

    const openAt = useCallback((e) => {
        setDraft(value || '');
        setAnchor(e.currentTarget);
    }, [value]);

    const onHex = useCallback((hex) => {
        const parsed = parseToRgba(hex);
        if (parsed) emit({ ...parsed, a: 1 });
    }, [emit]);

    const onRgba = useCallback((next) => emit(next), [emit]);

    const commitDraft = useCallback(() => {
        const parsed = parseToRgba(draft);
        if (parsed) emit(allowAlpha ? parsed : { ...parsed, a: 1 });
    }, [draft, emit, allowAlpha]);

    const pickFromScreen = useCallback(async () => {
        try {
            const result = await new window.EyeDropper().open();
            const parsed = parseToRgba(result?.sRGBHex);
            if (parsed) emit({ ...parsed, a: allowAlpha ? rgba.a : 1 });
        } catch (e) {
            // The visitor pressed Escape, or the browser refused. Nothing to do.
        }
    }, [emit, allowAlpha, rgba.a]);

    const uniquePicks = useMemo(
        () => [...new Set(quickPicks.filter(Boolean))].slice(0, 18),
        [quickPicks],
    );

    return (
        <>
            <Tooltip title={value || 'no value'}>
                <Box
                    component="button"
                    type="button"
                    onClick={openAt}
                    aria-label={label ? `Pick ${label}` : 'Pick a colour'}
                    data-testid={testId}
                    sx={{
                        width: size,
                        height: size - 4,
                        p: 0,
                        flexShrink: 0,
                        cursor: 'pointer',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        background: CHECKERBOARD,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: value || 'transparent',
                        },
                    }}
                />
            </Tooltip>

            <Popover
                open={open}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                slotProps={{ paper: { sx: { p: 2, width: 248 } } }}
            >
                <Box data-testid={`${testId}-popover`}>
                    {label && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                            {label}
                        </Typography>
                    )}

                    <Box
                        sx={{
                            '& .react-colorful': { width: '100%', height: 168 },
                            '& .react-colorful__saturation': { borderRadius: '6px 6px 0 0' },
                            '& .react-colorful__last-control': { borderRadius: '0 0 6px 6px' },
                            mb: 1.5,
                        }}
                    >
                        {allowAlpha ? (
                            <RgbaColorPicker color={rgba} onChange={onRgba} />
                        ) : (
                            <HexColorPicker color={formatColor({ ...rgba, a: 1 }, true)} onChange={onHex} />
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <TextField
                            fullWidth
                            size="small"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onBlur={commitDraft}
                            onKeyDown={(e) => { if (e.key === 'Enter') commitDraft(); }}
                            placeholder={allowAlpha ? '#RRGGBB or rgba(…)' : '#RRGGBB'}
                            inputProps={{ 'data-testid': `${testId}-text`, spellCheck: false }}
                            sx={{ '& input': { fontFamily: 'monospace', fontSize: 12 } }}
                        />
                        {hasEyeDropper && (
                            <Tooltip title="Pick a colour from the screen">
                                <IconButton size="small" onClick={pickFromScreen} data-testid={`${testId}-eyedropper`}>
                                    <ColorizeIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>

                    {uniquePicks.length > 0 && (
                        <>
                            <Divider sx={{ my: 1.5 }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>
                                Already in your palette
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {uniquePicks.map((pick) => (
                                    <Tooltip key={pick} title={pick}>
                                        <Box
                                            component="button"
                                            type="button"
                                            aria-label={pick}
                                            data-testid={`${testId}-pick-${pick.replace(/[^a-z0-9]/gi, '')}`}
                                            onClick={() => {
                                                const parsed = parseToRgba(pick);
                                                if (parsed) emit(allowAlpha ? parsed : { ...parsed, a: 1 });
                                            }}
                                            sx={{
                                                width: 22,
                                                height: 22,
                                                p: 0,
                                                cursor: 'pointer',
                                                borderRadius: 0.5,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                background: pick,
                                            }}
                                        />
                                    </Tooltip>
                                ))}
                            </Box>
                        </>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default ColorPicker;
