# Blazar Magic React Kit

This document provides details about the Blazar Magic React Kit, a comprehensive template designed for rapid development of front-end applications using React and Redux. It facilitates multilingual support, covering English and Spanish, among its many features.

## Featured in
- Nova Grant
- Manage Mint
- GoWell Enrollment

## Features

### Authorization
The Blazar Magic React Kit includes support for authentication using JSON Web Tokens (JWT). It leverages local session storage to keep the authentication token and username (which can be expanded to include more user information). The authentication information is rehydrated from local storage upon page refresh.

### Themes
The application incorporates [Material UI](https://mui.com/material-ui/customization/theming/) for theming. We've simplified the process of adjusting and adding new themes. For more details on how to customize themes, visit [Blazar Magic React Kit Themes](#). Themes data is also rehydrated from local storage on refresh.

### Preference Storage
This feature allows storing of user preferences, such as view settings, with the potential for further expansion. It ensures that user preferences are retained and reloaded from local storage after a refresh.

### Translation
The template supports multilingual capabilities, initially offering English and Spanish. User's language preference is accessible at `/language` (subject to change) and is rehydrated from local storage upon refresh. It utilizes `i18n` for managing translations.

## Contact Us

For any inquiries or support, please reach out to us at [sam.redpath@blazaarsoftware.com](mailto:sam.redpath@blazaarsoftware.com).
