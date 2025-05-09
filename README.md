# Medibase 🏥

Medibase is a secure digital medical document manager that lets users upload, store, and share medical records with doctors using session-based access.

## Problem statement 

Patients and families often struggle to manage and share medical records, especially when dealing with multiple specialists. Traditional record-keeping systems are fragmented and insecure, leading to misplaced documents, repeated history explanations, and potential errors in care. Healthcare data is also highly vulnerable, with one of the highest breach rates across industries.

**Medibase** addresses these challenges by providing a secure, centralized platform built on MongoDB. All data in the backend is encrypted to ensure maximum privacy and protection. Patients can easily store, organize, and share medical records with trusted doctors—ensuring security, accessibility, and a smoother healthcare experience.


## 🔧 Project Structure

- `frontend/` – React-based UI  
- `backend/` – Node.js + MongoDB API with session-based file sharing  

## System Flowchart
<p align="center"><img src="Screenshots/FinalFlowchart.png" width="700" /></p>

## Demo:
Here is a demo of the system. 

https://github.com/user-attachments/assets/90cb650d-4406-4d4a-9675-9758718b16af

## Features: 

### Registration page 
To onboard new users.
<p align="center"><img src="Screenshots/RegistrationPage.png" width="700" /></p>

### Forgot password page
An email embedded with a secure link that leads to the reset password page is sent to the specified registered user.
<p align="center"><img src="Screenshots/ForgotPassword.png" width="700" /></p>

### Link to reset password 
Sent to registered email.
<p align="center"><img src="Screenshots/ResetPasswordEmail.png" width="700" /></p>

### Reset password page
<p align="center"><img src="Screenshots/ResetPasswordPage.png" width="700" /></p>

### Login page 
Ensures registered users can login upon entering the correct password.
<p align="center"><img src="Screenshots/LoginPage.png" width="700" /></p>

### Home page 
Upon successful login users are directed to the home page which displays a preview of the uploaded files and navbar which redirects to other pages.
<p align="center"><img src="Screenshots/HomePage.png" width="700" /></p>

### Click to view functionality 
Upon clicking the view button, the file is decrypted and displayed to the user.
<p align="center"><img src="Screenshots/ViewFileUpdated.png" width="700" /></p>

### Upload new file 
Users can choose files to upload.
<p align="center"><img src="Screenshots/AddNewFilesPage.png" width="700" /></p>



### View all files 
Files can be viewed category wise in this page.
<p align="center"><img src="Screenshots/ViewAllFilesPage.png" width="700" /></p>

### Search feature 
Search feature with suggestions for file names.
<p align="center"><img src="Screenshots/searchFeature.png" width="700" /></p>

### Menu options 
Options like delete, rename, change category, download.
<p align="center"><img src="Screenshots/MenuOptions.png" width="700" /></p>

### Change category 
The file's category can be changed using this feature
<p align="center"><img src="Screenshots/ChangeCategory.png" width="700" /></p>

### Download files feature
<p align="center"><img src="Screenshots/DownloadFeature.png" width="700" /></p>

### Rename files feature
<p align="center"><img src="Screenshots/RenameFile.png" width="700" /></p>
<p align="center"><img src="Screenshots/UpdatedResult.png" width="700" /></p>

### Verification of email
Email is sent to doctor with the json web token embedded in it, and it is verified once the doctor clicks on it.
<p align="center"><img src="Screenshots/VerifyEmailPage.png" width="700" /></p>
<p align="center"><img src="Screenshots/VerificationMailDoctor.png" width="700" /></p>

#### Web page automatically updates the status of the email once doctor verifies it through email.
<p align="center"><img src="Screenshots/VerificationSuccessfulRedirect.png" width="700" /></p>
<p align="center"><img src="Screenshots/EmailVerifiedDisplay.png" width="700" /></p>

### Select files feature
Specific files can be selected to be sent to the doctor's email.
<p align="center"><img src="Screenshots/SelectFilesPage.png" width="700" /></p>

Doctor's email can be selected only if it's verified.
<p align="center"><img src="Screenshots/ChooseVerifiedEmail.png" width="700" /></p>

A secure file link is sent to the doctor's verified email.
<p align="center"><img src="Screenshots/SecureAccessLink.png" width="700" /></p>

Once the link is clicked, the doctor can view the files in view only mode.
<p align="center"><img src="Screenshots/DoctorSession.png" width="700" /></p>

### Access Denied Page 
Access is denied if the link is attempted to be accessed by a different person at the same time.
<p align="center"><img src="Screenshots/AccessDenied.png" width="700" /></p>

### Active chats feature
The files sent in the particular chat can be viewed.
<p align="center"><img src="Screenshots/ActiveChatDoctor.png" width="700" /></p>

On the patient's side, all active chats with doctors can be viewed.
<p align="center"><img src="Screenshots/ActiveChatsPage.png" width="700" /></p>

### Categories page
All the categories for the user along with file count for each category can be viewed.
<p align="center"><img src="Screenshots/ViewCategories.png" width="700" /></p>

### Help page
<p align="center"><img src="Screenshots/HelpPage.png" width="700" /></p>

## Backend
### userData collection
This collection contains all details of the user

**Fields:**

- **User ID** – A unique identifier for each user.  
- **Username** – The user’s chosen display name or login name.  
- **Hashed Password** – Securely stored (not in plain text).  
- **Email** – Used for communication and verification.  
- **Categories** – A list of file categories specific to the user.  
- **Encrypted User Root Key** – Generated at registration, used for encryption/decryption purposes.  
- **Session ID** – Created at login, identifies the user’s session.  
- **Session Expiry** – Timestamp set to one hour after login; used to auto-logout the user.
  
<p align="center"><img src="Screenshots/userData.png" width="700" /></p>

### sessionData collection:

Contains data about the session created for sharing files with doctor. 

**Fields:**

- **id** – Auto-generated unique identifier for the session document.  
- **sessionId** – A UUID that uniquely identifies the session.  
- **userId** – ID of the user initiating the session.  
- **doctorName** – Name of the doctor assigned to this session.  
- **doctorEmail** – Encrypted email ID of the doctor.  
- **sessionState** – Status of the session (e.g., `"Inactive"`).  
- **files** – An array of file IDs shared in the session.  
- **createdAt** – ISO 8601 timestamp indicating when the session was created.  
- **sessionOwnerId** – ID of the user who owns/controls the session (typically the doctor accessing the files).  
<p align="center"><img src="https://github-production-user-asset-6210df.s3.amazonaws.com/98334746/435386973-a287e32b-ad80-48a2-838c-401bd0b46881.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250419%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250419T110900Z&X-Amz-Expires=300&X-Amz-Signature=6157e30a920308705186644e2c44b09365f463dc02b486f74555e241b3dff7b3&X-Amz-SignedHeaders=host" width="700" /></p>

### userSessionData collection: 

Contains data about the doctor emails stored for each session

**Fields:**

- **id** – Auto-generated unique identifier for the document.  
- **userId** – The ID of the user linked to this session data (typically the patient).  
- **emails** – An array containing email objects (can be empty or have one/multiple entries), each with:
  - **email** – The doctor’s email address.  
  - **status** – Verification status of the email. Possible values:
    - `"verified"`  
    - `"unverified"`  
<p align="center"><img src="Screenshots/userSessionData.png" width="700" /></p>




