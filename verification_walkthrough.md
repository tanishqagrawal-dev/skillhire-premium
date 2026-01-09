# SkillHire Premium - Verification Walkthrough

This document outlines the steps to verify the functionality of the newly implemented SkillHire Premium modules.

## 1. Resume Builder & ATS Checker
**Objective**: Verify that a user can create a resume and get an ATS score.

1.  **Navigate to Resume Builder**:
    *   Click on "Resume Builder" in the sidebar.
    *   *Expected*: The Resume Builder view appears with the Editor and Preview panels.
2.  **Edit Personal Info**:
    *   Expand "Personal Info".
    *   Enter "Jane Doe" as the name.
    *   *Expected*: The Preview panel updates immediately to show "Jane Doe".
3.  **Add Experience**:
    *   Expand "Experience".
    *   Click "+ Add Position".
    *   Fill in a dummy job title and company.
    *   *Expected*: The new job appears in the Preview panel.
4.  **Check ATS Score**:
    *   In the "ATS Score" box, check the calculated score.
    *   Paste a dummy Job Description in the "Target Job Description" box.
    *   *Expected*: The score should update based on keyword matching (mock logic).
5.  **Download PDF**:
    *   Click the "Download PDF" button.
    *   *Expected*: A PDF file of the resume should be generated and downloaded.

## 2. Mock Interview Simulator
**Objective**: Verify the interview setup and simulation flow.

1.  **Navigate to Mock Interview**:
    *   Click on "Mock Interview" in the sidebar.
    *   *Expected*: The "Configure Interview" setup card appears.
2.  **Start Interview**:
    *   Select "Google" and "Software Engineer".
    *   Click "Start Interview".
    *   *Expected*: The view switches to the active interview interface.
3.  **Check Permissions**:
    *   *Expected*: The browser requests Camera/Microphone permissions. (Note: May be blocked in some iframe environments, verify using `localhost`).
4.  **Interact**:
    *   Click "Next Question".
    *   *Expected*: The question text changes.
5.  **End Session**:
    *   Click "End Session".
    *   *Expected*: The "Interview Analysis" feedback report appears with scores.

## 3. DSA Practice Module
**Objective**: Verify the coding environment and AI hints.

1.  **Navigate to DSA Practice**:
    *   Click on "DSA Practice" in the sidebar.
    *   *Expected*: The problem list and workspace appear.
2.  **Select a Problem**:
    *   Click on a problem from the list (e.g., "Two Sum").
    *   *Expected*: The editor view opens with the problem description.
3.  **Run Code**:
    *   Click "Run Code".
    *   *Expected*: The "Test Results" tab shows a status message (mock execution).
4.  **Get Hint**:
    *   Click "Neuron AI Hint".
    *   Switch to the "Neuron AI Coach" tab.
    *   *Expected*: A hint for the problem appears.

## 4. Roadmap Generator
**Objective**: Verify the generation of a personalized learning path.

1.  **Navigate to My Roadmap**:
    *   Click on "My Roadmap" in the sidebar.
    *   *Expected*: The input form appears.
2.  **Generate Roadmap**:
    *   Select "Frontend Engineer" and "6 Months".
    *   Click "Generate Roadmap".
    *   *Expected*: The view switches to a timeline visualization of the roadmap.
3.  **Reset**:
    *   Click "Edit Config".
    *   *Expected*: The view returns to the input form.

## 5. AI Coach
**Objective**: Verify the global chat assistant.

1.  **Open Chat**:
    *   Click the floating "AI" icon in the bottom right.
    *   *Expected*: The chat window slides up.
2.  **Context Awareness**:
    *   Navigate to different pages (e.g., Dashboard vs. Resume).
    *   *Expected*: The initial greeting or context message might change (if implemented to react to page changes).
3.  **Send Message**:
    *   Type "Help me with python" and send.
    *   *Expected*: The UI shows a typing indicator, followed by a response.

## 6. General UI/UX
*   **Responsiveness**: Resize the window to mobile size. Ensure the sidebar collapses and the layout adjusts.
*   **Theme**: Toggle the "Sun/Moon" icon. Verify that the application switches between Light and Dark modes.
