import lightTypography   from "./typography/lightTypography";
import altTypography from "./typography/altTypography";
import professionalTypography   from "./typography/professionalTypography";
import darkTypography from "./typography/darkTypography";
import corporateMemphisTypography    from "./typography/corporateMemphisTypography";
import techStartupTypography from "./typography/techStartupTypography";
import mintTypography from "./typography/mintTypography";
import sunsetTypography from "./typography/sunsetTypography";
import retroNeonTypography from "./typography/retroNeonTypography";

const typographyModeMappings = {
    light: lightTypography,
    dark: darkTypography,
    altTheme: altTypography,
    professional: professionalTypography,
    memphis: corporateMemphisTypography,
    startup: techStartupTypography,
    sunset: sunsetTypography,
    mint: mintTypography,
    retro_neon: retroNeonTypography
};

export const getTypographyByMode = (mode) => typographyModeMappings[mode] || lightTypography;