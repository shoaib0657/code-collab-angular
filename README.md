# CodeCollab

## About
CodeCollab is a collaborative coding platform built using Angular, Socket.io and CodeMirror. It allows multiple users to work on code together in real-time, track cursor positions and receive notifications. The platform is built using Angular for the frontend, Node.js for the backend and Socket.io for real-time communication. CodeMirror is used for the code editor.

## Features

- **Real-time Collaboration**: Multiple users can edit code simultaneously.
- **Cursor Tracking**: Tracks and displays the cursor position of each collaborator.
- **Home Page**: Interface to join or create a coding room.
- **Editor Page**: Integrated code editor using CodeMirror.
- Syntax highlighting

## Future Scope

1. [] Add syntax highlighting for multiple languages
2. [] Add support for multiple themes
3. [] Add support for saving the last theme and language selected by the user in local storage
4. [] Add support to accept or reject new users trying to join the room
5. [ ] Add to implement video and voice chat feature inside the editor
6. [ ] Add support for local code file uploading

## Installation

### Prerequisites
- Node.js
- Angular CLI

### Steps
1. Clone the repository:
    ```sh
    git clone https://github.com/shoaib0657/code-collab-angular.git
    ```
2. Navigate to the project directory:
    ```sh
    cd code-collab-angular
    ```

## Usage

1. **Home Page**:
   - Enter a room name to join or create a new room.
   - Press Enter to navigate to the editor page.

2. **Editor Page**:
   - Start coding in the provided editor.
   - The cursor position and code changes will be synchronized with all connected clients.

## Contributing
Contributions are welcome! Please fork this repository and submit pull requests.

## Contact
For any questions or feedback, please open an issue in this repository.

## Live Demo
Check out the live demo [here](http://code-collab-4nmm.onrender.com).

