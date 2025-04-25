# **HoldFast**  

## **Overview**  
HoldFast is a group project for **Computer Graphics CS4053**. Players race to tap buttons on a rotating cube before a burning fuse reaches its end. The game features real-time animations, particle effects, and an extremely interactive scene. Players lose if the cube "explodes" when the wire burns up.

## **Current Features**
- **Interactive Cube:** Object within scene that users can manipulate via keyboard or mouse. 
- **Wire System:** Connected line segments drawn in object space, wrapping around the cube.  
- **Fuse Animation:** A moving fuse mesh traverses the wire using a parametric equation.  
- **Interactive Buttons:** Clickable meshes allow players to stop the fuse.  
- **Toggleable Rendering/Functions:** Users can toggle.
- **Live Timer:** Users are timed when they start the game. The completion time is displayed upon achieving game objectives.

## **Next Objectives**  
- **Improve Input Handling:** Prevent click-through interactions.  
- **Code Modularization:** Enhance flexibility for future feature development.  
- **Wire Burn Effect:** Recolor or remove parts of the wire as the fuse burns.  
- **UI & Game Loop Enhancements:** 
   - Support "hotswapping" the cube for different objects.
   - Allow for different gamemodes
      - Max Score for time
      - Fastest Time for set score
      - Competitive Mode with leaderboard
      - etc...
   - Support multiple different background scenes
   - Cross-platform compatibility
      - Mobile devices
      - Tablets
      - Consoles

---  
## **Installation & Setup**  
### **Prerequisites**  
Ensure the required dependencies are installed.  

### **Setup Steps**  
1. **Clone the Repository:**  
   ```sh
   git clone git@github.com:ephraaimwong/HoldFast.git
   ```  
   Alternatively, use [GitHub Desktop](https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop).  

2. **Install Dependencies:**  
   ```sh
   node -v     # Check Node.js version  
   npm -v      # Check npm version  
   npm install #Install dependencies from package.json
   ```  
   Ensure the following dependencies are in `package.json`:  
   ```json
   "dependencies": {
    "@react-three/drei": "^10.0.5",
    "@react-three/fiber": "^9.1.1",
    "@react-three/postprocessing": "^3.0.4",
    "postprocessing": "^6.37.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.174.0"
   }
   ```  

3. **Set Up Environment Variables**  
4. **Start the Application**  
   ```sh
   npm run dev
   ```  
   Expect something like:
   ```
   > package.json@0.0.0 dev
   > vite


   VITE v6.3.1  ready in 154 ms

   ➜  Local:   http://localhost:5173/HoldFast/  <-- click here
   ➜  Network: use --host to expose
   ➜  press h + enter to show help
   ```
   (ctrl + click) the link to launch local build

---  
## **Tech Stack**  
- **Vite:** Frontend build and development server to host application.
- **React:** Component-based UI building library. React hooks are heavily used for logic and state handling.
- **React 3 Fiber (R3F):** React renderer for Three.js, supporting the component-based architecture.
- **React 3 Postprocessing:** Wrapper library for WebGL's postprocessing library to intergrate real-time visual effects on components after the scene is rendered.
- **React 3 Drei:** Helper library for ready-to-deploy 3D components and interaction handling.
- **Three.js:** Used for rendering 3D graphics.  
- **Node.js:** Manage and run all development tools that build and deploy Holdfast.

---  
## **Development Workflow**  
### **Feature-Branch Workflow**  
1. **Create a new branch per feature:**  
   ```sh
   git checkout -b feature/buttonSpawn
   ```  
2. **Branch Naming Convention:**  
   - `feature/<featureName>` (e.g., `feature/buttonSpawn`)  
   - `bugfix/<fixName>` (e.g., `bugfix/clickIssue`)  
3. **Regularly fetch updates from `main`:**  
   ```sh
   git fetch
   ```  
4. **Merge via Pull Requests:**  
   - Submit a PR before merging into `main`.  
   - Follow team-approved merge methods.  

---  
## **Team Communication**  
- **Primary Channel:** [Telegram](https://telegram.org/)  
- **Weekly Check-Ins**  

---  
## **Additional Notes**  
- Follow the **Contributing Guidelines** before making changes.  
- Refer to the **Documentation** for API details.  
- For critical issues, contact **[person of contact]**.  

