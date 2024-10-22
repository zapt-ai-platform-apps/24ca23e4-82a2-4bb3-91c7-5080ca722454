# Earth Facts

## Overview
Earth Facts is an interactive web application that allows users to generate, save, and explore interesting facts about Earth. Users can sign in using ZAPT authentication and enjoy features like generating facts via AI, viewing saved facts, generating images related to facts, converting facts to speech, and generating markdown stories about Earth.

## User Journeys

### 1. Sign In with ZAPT
1. **Launch the App**: Upon opening the app, users are greeted with a sign-in page titled "Sign in with ZAPT."
2. **Learn More**: Users can click on the link to ZAPT's marketing site to learn more about the authentication service.
3. **Authenticate**: Users sign in using their preferred method—email magic link or social providers like Google, Facebook, or Apple.
4. **Automatic Transition**: Once signed in, the app automatically redirects to the home page without requiring a page refresh.

### 2. Generate and Save a New Earth Fact
1. **Navigate to "Add New Fact" Section**: On the home page, users find the "Add New Fact" form.
2. **Enter Fact Details**:
   - **Title**: Users input the title of the fact.
   - **Description**: Users provide a detailed description of the fact.
3. **Save Fact**: Clicking the "Save Fact" button stores the fact in their personal list.
4. **Generate Fact via AI**: Alternatively, users can click "Generate Fact" to have an AI generate a new Earth fact, which they can then save.

### 3. View Saved Facts
1. **Access "Fact List"**: Users can scroll through their saved facts in the "Fact List" section.
2. **Read Facts**: Each fact displays the title and description, allowing users to revisit and learn from their saved facts.

### 4. Additional Features
1. **Generate Image**:
   - Users can generate an image related to Earth by clicking the "Generate Image" button.
   - The generated image appears below, providing a visual representation.
2. **Text to Speech**:
   - Users can convert a fact's description to speech by clicking "Text to Speech."
   - An audio player appears, allowing users to listen to the fact.
3. **Generate Markdown Story**:
   - Clicking "Generate Markdown" creates a markdown-formatted story about Earth.
   - The story is displayed below, rendered appropriately.

### 5. Sign Out
1. **Sign Out**: Users can securely sign out of the app by clicking the "Sign Out" button in the header.
2. **Redirect to Sign-In Page**: After signing out, users are redirected back to the sign-in page.

## External APIs Used
- **ZAPT Authentication**: Used for user authentication and session management.
- **AI Fact Generation**: Utilizes the `chatgpt_request` event to generate new Earth facts.
- **Image Generation**: Uses the `generate_image` event to create images related to Earth.
- **Text to Speech**: Employs the `text_to_speech` event to convert fact descriptions into audio.