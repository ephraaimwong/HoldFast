# **HoldFast**  

## **Overview**  
*Brief description of the application.*  

---

## **Installation & Setup**  

### **Prerequisites**  
Ensure you have the required dependencies installed before proceeding.  

### **Steps to Set Up**  

1. **Clone this repository:**  
   - **Using Terminal (SSH):**  
     ```sh
     git clone git@github.com:ephraaimwong/HoldFast.git
     ```  
   - **Using [GitHub Desktop](https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop)**  

2. **Install dependencies:**  
   - Check for Node and npm versions:  
     ```sh
     node -v
     npm -v
     ```  
   - Install required packages:  
     ```sh
     npm install react@19.0.0 react-dom@19.0.0 @react-three/fiber@9.0.4 @react-three/drei@10.0.4
     ```  
   - Verify installation in `package.json`:  
     ```json
     ...
     "dependencies": {
       "@react-three/drei": "^10.0.4",
       "@react-three/fiber": "^9.0.4",
       "react": "^19.0.0",
       "react-dom": "^19.0.0"
     }
     ...
     ```  

3. **Set up environment variables**  

4. **Start the application**  

---

## **Tech Stack**  

- **Java**: Version a.bcd  
- **Unity**  
- **Blender**  
- **OpenGL**  

---

## **Development Standard-Operating-Procedures (SOP)**  

### **Feature-Branch Workflow**  

1. **Create a new branch for every feature** (1-to-1 principle):  
   - [GitHub Web](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository)  
   - [GitHub Desktop](https://docs.github.com/en/desktop/making-changes-in-a-branch/managing-branches-in-github-desktop)  
   - [Terminal](https://www.atlassian.com/git/tutorials/using-branches)  

2. **Branch naming convention:**  
   ```
   <type>/<featureName>
   ```
   - Example:  
     - `feature/buttonSpawn`  
     - `bugfix/buttonSpawnIssue`  

3. **Always create a branch from the latest `main` branch.**  

4. **Regularly fetch updates from `main`:**  
   ```sh
   git fetch
   ```

### **Merging Guidelines**  

1. **Always create a pull request before merging into `main`:**  
   - [GitHub Web](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request)  
   - [GitHub Desktop](https://docs.github.com/en/desktop/working-with-your-remote-repository-on-github-or-github-enterprise/syncing-your-branch-in-github-desktop#merging-another-branch-into-your-project-branch)  
   - [Terminal](https://www.atlassian.com/git/tutorials/using-branches/git-merge)  

2. **Merge using the appropriate method** based on team guidelines.  

---

## **Team Communication**  

1. **Primary communication channel:** [Telegram](https://telegram.org/)  
2. **Weekly team check-ins**  
3. **[Method]** for progress tracking  

---

## **Additional Notes**  

- Follow the **Contributing Guidelines** when making changes.  
- Refer to the **Documentation** for detailed API references.  
- Contact **[person of contact]** for any critical issues.  
