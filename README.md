# **HoldFast**  

## **Overview**  
HoldFast is a group project for **Computer Graphics CS4053**. Players race to tap buttons on a rotating cube before a burning fuse reaches its end. The game features real-time animations, particle effects, and cel-shading. Players lose if the cube "explodes" when the wire burns up.

## **Current Features**  
- **Wire System:** Connected line segments drawn in object space, wrapping around the cube.  
- **Fuse Animation:** A moving fuse mesh traverses the wire using a parametric equation.  
- **Interactive Buttons:** Clickable meshes allow players to stop the fuse.  
- **Cel-Shading & Wireframes:** Implements cel-shading similar to the connected line segments.  

## **Next Objectives**  
- **Improve Input Handling:** Prevent click-through interactions.  
- **Code Modularization:** Enhance flexibility for future feature development.  
- **UI & Game Loop Enhancements:** Introduce a timer and background shaders.
   - We should implement a simple menu UI for starting the interaction. 
- **Advanced Cel-Shading:** Further refine shader materials in **Three.js** ([ShaderMaterial Docs](https://threejs.org/docs/#api/en/materials/ShaderMaterial)).  
- **Wire Burn Effect:** Recolor or remove parts of the wire as the fuse burns.  

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
   node -v  # Check Node.js version  
   npm -v   # Check npm version  
   npm install  
   ```  
   Ensure the following dependencies are in `package.json`:  
   ```json
   "dependencies": {
     "@react-three/drei": "^10.0.4",
     "@react-three/fiber": "^9.0.4",
     "react": "^19.0.0",
     "react-dom": "^19.0.0"
   }
   ```  

3. **Set Up Environment Variables**  
4. **Start the Application**  
   ```sh
   npm start
   ```  

---  
## **Tech Stack**  
- **Three.js:** Used for rendering 3D graphics.  
- **Blender:** For creating and importing complex meshes.  

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

